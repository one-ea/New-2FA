/**
 * WebDAV 备份 API
 *
 * POST /api/webdav/config     — 保存 WebDAV 配置
 * GET  /api/webdav/config     — 获取 WebDAV 配置（密码脱敏）
 * POST /api/webdav/test       — 测试连接
 * POST /api/webdav/backup     — 立即备份到 WebDAV
 * GET  /api/webdav/list       — 列出远程备份文件
 * POST /api/webdav/restore    — 从 WebDAV 还原
 * DELETE /api/webdav/file     — 删除远程备份文件
 */

import { getLogger } from '../utils/logger.js';
import { getAllSecrets } from './secrets/shared.js';
import { encryptSecrets, decryptSecrets } from '../utils/encryption.js';
import {
	testConnection,
	ensureDirectory,
	uploadFile,
	downloadFile,
	listFiles,
	deleteFile,
} from '../utils/webdav.js';

// R2 中的 WebDAV 配置存储路径
const R2_WEBDAV_CONFIG = 'config/webdav.json';

/**
 * 读取 WebDAV 配置
 */
async function getConfig(env) {
	const obj = await env.BACKUP_R2.get(R2_WEBDAV_CONFIG);
	if (!obj) return null;
	return JSON.parse(await obj.text());
}

/**
 * 保存 WebDAV 配置
 */
async function saveConfig(env, config) {
	await env.BACKUP_R2.put(R2_WEBDAV_CONFIG, JSON.stringify(config), {
		httpMetadata: { contentType: 'application/json' },
	});
}

/**
 * POST /api/webdav/config — 保存配置
 */
export async function handleSaveWebDAVConfig(request, env) {
	const logger = getLogger(env);

	try {
		const { url, username, password, remotePath, autoBackup, intervalHours } = await request.json();

		if (!url || !username || !password) {
			return jsonResponse({ error: '请填写完整的 WebDAV 配置（地址、用户名、密码）' }, 400);
		}

		const config = {
			url: url.trim(),
			username: username.trim(),
			password, // 存储明文（R2 已加密）
			remotePath: (remotePath || '2fa-backup').trim(),
			autoBackup: !!autoBackup,
			intervalHours: intervalHours || 24,
			updatedAt: new Date().toISOString(),
		};

		await saveConfig(env, config);

		logger.info('WebDAV 配置已保存', { url: config.url, remotePath: config.remotePath });

		return jsonResponse({ success: true, message: 'WebDAV 配置已保存' });
	} catch (error) {
		logger.error('保存 WebDAV 配置失败', {}, error);
		return jsonResponse({ error: '保存配置失败: ' + error.message }, 500);
	}
}

/**
 * GET /api/webdav/config — 获取配置（密码脱敏）
 */
export async function handleGetWebDAVConfig(env) {
	try {
		const config = await getConfig(env);
		if (!config) {
			return jsonResponse({ configured: false });
		}

		return jsonResponse({
			configured: true,
			url: config.url,
			username: config.username,
			password: config.password ? '••••••••' : '',
			remotePath: config.remotePath,
			autoBackup: config.autoBackup,
			intervalHours: config.intervalHours,
			updatedAt: config.updatedAt,
		});
	} catch (error) {
		return jsonResponse({ error: '获取配置失败' }, 500);
	}
}

/**
 * POST /api/webdav/test — 测试连接
 */
export async function handleTestWebDAV(request, env) {
	const logger = getLogger(env);

	try {
		let { url, username, password, remotePath } = await request.json();

		// 如果密码是脱敏的，从已保存配置中读取
		if (password === '••••••••') {
			const saved = await getConfig(env);
			if (saved) password = saved.password;
		}

		if (!url || !username || !password) {
			return jsonResponse({ error: '请填写连接信息' }, 400);
		}

		const result = await testConnection(url, remotePath || '2fa-backup', username, password);

		logger.info('WebDAV 连接测试', { url, success: result.success });

		return jsonResponse(result);
	} catch (error) {
		logger.error('WebDAV 连接测试失败', {}, error);
		return jsonResponse({ success: false, error: error.message }, 500);
	}
}

/**
 * POST /api/webdav/backup — 立即备份
 */
export async function handleWebDAVBackup(request, env) {
	const logger = getLogger(env);

	try {
		const config = await getConfig(env);
		if (!config) {
			return jsonResponse({ error: '未配置 WebDAV，请先设置' }, 400);
		}

		// 获取所有密钥
		const secrets = await getAllSecrets(env);
		if (!secrets || secrets.length === 0) {
			return jsonResponse({ error: '没有密钥需要备份' }, 400);
		}

		// 构建备份数据
		const backupData = {
			version: '2.0',
			timestamp: new Date().toISOString(),
			count: secrets.length,
			source: '2FA-Manager',
			secrets,
		};

		// 加密
		let content;
		if (env.ENCRYPTION_KEY) {
			content = await encryptSecrets(secrets, env);
		} else {
			content = JSON.stringify(backupData, null, 2);
		}

		// 确保远程目录存在
		await ensureDirectory(config.url, config.remotePath, config.username, config.password);

		// 生成文件名
		const now = new Date();
		const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
		const filename = `2fa_backup_${dateStr}.json`;

		// 上传
		const result = await uploadFile(
			config.url,
			config.remotePath,
			filename,
			content,
			config.username,
			config.password,
		);

		logger.info('WebDAV 备份完成', {
			filename,
			secretCount: secrets.length,
			encrypted: !!env.ENCRYPTION_KEY,
		});

		return jsonResponse({
			success: true,
			message: `已备份 ${secrets.length} 个密钥到 WebDAV`,
			filename,
			secretCount: secrets.length,
			encrypted: !!env.ENCRYPTION_KEY,
		});
	} catch (error) {
		logger.error('WebDAV 备份失败', {}, error);
		return jsonResponse({ error: '备份失败: ' + error.message }, 500);
	}
}

/**
 * GET /api/webdav/list — 列出远程备份
 */
export async function handleListWebDAVBackups(env) {
	try {
		const config = await getConfig(env);
		if (!config) {
			return jsonResponse({ error: '未配置 WebDAV', backups: [] }, 400);
		}

		const files = await listFiles(config.url, config.remotePath, config.username, config.password);

		// 只显示 .json 备份文件
		const backups = files
			.filter((f) => f.name.endsWith('.json'))
			.map((f) => ({
				name: f.name,
				size: f.size,
				modified: f.modified,
				sizeFormatted: formatSize(f.size),
			}));

		return jsonResponse({ backups, count: backups.length });
	} catch (error) {
		return jsonResponse({ error: '获取备份列表失败: ' + error.message, backups: [] }, 500);
	}
}

/**
 * POST /api/webdav/restore — 从 WebDAV 还原
 */
export async function handleWebDAVRestore(request, env) {
	const logger = getLogger(env);

	try {
		const config = await getConfig(env);
		if (!config) {
			return jsonResponse({ error: '未配置 WebDAV' }, 400);
		}

		const { filename } = await request.json();
		if (!filename) {
			return jsonResponse({ error: '请指定要还原的文件' }, 400);
		}

		// 从 WebDAV 下载
		const content = await downloadFile(
			config.url,
			config.remotePath,
			filename,
			config.username,
			config.password,
		);

		// 解析数据（可能是加密的）
		let secrets;
		try {
			const parsed = JSON.parse(content);
			secrets = parsed.secrets || parsed;
		} catch {
			// 可能是加密数据
			secrets = await decryptSecrets(content, env);
		}

		if (!Array.isArray(secrets) || secrets.length === 0) {
			return jsonResponse({ error: '备份数据为空或格式无效' }, 400);
		}

		// 写入 R2 主数据
		const encrypted = await encryptSecrets(secrets, env);
		await env.BACKUP_R2.put('data/secrets.json', encrypted, {
			httpMetadata: { contentType: 'application/json' },
			customMetadata: {
				count: String(secrets.length),
				updatedAt: new Date().toISOString(),
				reason: 'webdav-restore',
			},
		});

		logger.info('WebDAV 还原完成', { filename, secretCount: secrets.length });

		return jsonResponse({
			success: true,
			message: `已从 WebDAV 还原 ${secrets.length} 个密钥`,
			secretCount: secrets.length,
		});
	} catch (error) {
		logger.error('WebDAV 还原失败', {}, error);
		return jsonResponse({ error: '还原失败: ' + error.message }, 500);
	}
}

/**
 * DELETE /api/webdav/file — 删除远程文件
 */
export async function handleDeleteWebDAVFile(request, env) {
	const logger = getLogger(env);

	try {
		const config = await getConfig(env);
		if (!config) {
			return jsonResponse({ error: '未配置 WebDAV' }, 400);
		}

		const { filename } = await request.json();
		if (!filename) {
			return jsonResponse({ error: '请指定要删除的文件' }, 400);
		}

		await deleteFile(config.url, config.remotePath, filename, config.username, config.password);

		logger.info('WebDAV 文件已删除', { filename });

		return jsonResponse({ success: true, message: '文件已删除' });
	} catch (error) {
		logger.error('删除 WebDAV 文件失败', {}, error);
		return jsonResponse({ error: '删除失败: ' + error.message }, 500);
	}
}

/**
 * WebDAV 自动备份（供 scheduled() 调用）
 */
export async function autoWebDAVBackup(env) {
	const logger = getLogger(env);
	const config = await getConfig(env);

	if (!config || !config.autoBackup) {
		return null; // 未启用自动备份
	}

	logger.info('执行 WebDAV 自动备份');

	const secrets = await getAllSecrets(env);
	if (!secrets || secrets.length === 0) {
		logger.info('没有密钥，跳过 WebDAV 备份');
		return null;
	}

	const backupData = {
		version: '2.0',
		timestamp: new Date().toISOString(),
		count: secrets.length,
		source: '2FA-Manager-Auto',
		secrets,
	};

	let content;
	if (env.ENCRYPTION_KEY) {
		content = await encryptSecrets(secrets, env);
	} else {
		content = JSON.stringify(backupData, null, 2);
	}

	await ensureDirectory(config.url, config.remotePath, config.username, config.password);

	const now = new Date();
	const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
	const filename = `2fa_auto_${dateStr}.json`;

	await uploadFile(config.url, config.remotePath, filename, content, config.username, config.password);

	logger.info('WebDAV 自动备份完成', { filename, secretCount: secrets.length });

	// 清理过时备份 (保留最近 30 天)
	try {
		const files = await listFiles(config.url, config.remotePath, config.username, config.password);
		const backups = files.filter((f) => f.name.endsWith('.json') && f.name.includes('2fa_'));
		
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		
		let deletedCount = 0;
		for (const file of backups) {
			if (file.modified && new Date(file.modified) < thirtyDaysAgo) {
				await deleteFile(config.url, config.remotePath, file.name, config.username, config.password);
				deletedCount++;
			}
		}
		if (deletedCount > 0) {
			logger.info('WebDAV 旧备份清理完成', { deleted: deletedCount });
		}
	} catch (error) {
		logger.warn('清理 WebDAV 旧备份失败', {}, error);
	}

	return { filename, secretCount: secrets.length };
}

// ─── 工具函数 ───

function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

function formatSize(bytes) {
	if (!bytes || bytes === 0) return '0 B';
	const units = ['B', 'KB', 'MB'];
	let i = 0;
	let size = bytes;
	while (size >= 1024 && i < units.length - 1) {
		size /= 1024;
		i++;
	}
	return `${size.toFixed(1)} ${units[i]}`;
}
