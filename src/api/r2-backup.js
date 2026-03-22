/**
 * R2 备份 API
 * 列出和还原 R2 中的备份
 */

import { decryptSecrets, encryptData } from '../utils/encryption.js';
import { getLogger } from '../utils/logger.js';

// R2 中的主数据路径
const R2_SECRETS_KEY = 'data/secrets.json';

/**
 * GET /api/r2-backup → 列出 R2 备份
 */
export async function handleGetR2Backups(request, env) {
	if (!env.BACKUP_R2) {
		return new Response(JSON.stringify({ error: 'R2 未配置', backups: [] }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const listed = await env.BACKUP_R2.list({ prefix: 'backups/' });
		const backups = listed.objects.map((obj) => ({
			key: obj.key,
			size: obj.size,
			uploaded: obj.uploaded.toISOString(),
			timestamp: obj.customMetadata?.timestamp || obj.uploaded.toISOString(),
			secretCount: obj.customMetadata?.secretCount ? Number(obj.customMetadata.secretCount) : null,
			encrypted: obj.customMetadata?.encrypted === 'true',
		}));

		backups.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));

		return new Response(JSON.stringify({ backups, count: backups.length }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: '获取备份列表失败', message: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

/**
 * POST /api/r2-backup/restore { key: "backups/backup_xxx.json" }
 * 从 R2 备份还原到 R2 主数据
 */
export async function handleRestoreR2Backup(request, env) {
	const logger = getLogger(env);

	if (!env.BACKUP_R2) {
		return new Response(JSON.stringify({ error: 'R2 未配置' }), {
			status: 503,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const body = await request.json();
		const { key } = body;

		if (!key) {
			return new Response(JSON.stringify({ error: '缺少 key 参数' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// 从 R2 读取备份
		const obj = await env.BACKUP_R2.get(key);
		if (!obj) {
			return new Response(JSON.stringify({ error: '备份不存在' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const backupContent = await obj.text();

		// 检测是否加密
		let backupData;
		try {
			backupData = JSON.parse(backupContent);
		} catch {
			backupData = await decryptSecrets(backupContent, env);
		}

		// 获取密钥列表
		const secrets = backupData.secrets || backupData;
		if (!Array.isArray(secrets) || secrets.length === 0) {
			return new Response(JSON.stringify({ error: '备份数据为空或格式无效' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// 加密后写回 R2 主数据
		const { encryptSecrets } = await import('../utils/encryption.js');
		const encryptedData = await encryptSecrets(secrets, env);

		await env.BACKUP_R2.put(R2_SECRETS_KEY, encryptedData, {
			httpMetadata: { contentType: 'application/json' },
			customMetadata: {
				count: String(secrets.length),
				updatedAt: new Date().toISOString(),
				reason: 'restore',
			},
		});

		logger.info('R2 备份还原成功', { key, secretCount: secrets.length });

		return new Response(JSON.stringify({
			success: true,
			message: `已还原 ${secrets.length} 个密钥`,
			secretCount: secrets.length,
		}), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		logger.error('R2 备份还原失败', {}, error);
		return new Response(JSON.stringify({ error: '还原失败', message: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
