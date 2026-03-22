/**
 * 共享工具函数 - 被多个 API 处理器使用
 *
 * v2: 所有数据存储在 R2
 * - saveSecrets: 保存密钥到 R2
 * - getAllSecrets: 从 R2 获取所有密钥
 */

import { encryptSecrets, decryptSecrets } from '../../utils/encryption.js';
import { getLogger } from '../../utils/logger.js';

// R2 中的密钥数据文件路径
const R2_SECRETS_KEY = 'data/secrets.json';

/**
 * 保存密钥到 R2
 *
 * 1. 加密数据（如果配置了 ENCRYPTION_KEY）
 * 2. 写入 R2
 * 3. 同时创建备份快照
 *
 * @param {Object} env - Cloudflare Workers 环境对象
 * @param {Array} secrets - 密钥数组
 * @param {string} reason - 操作原因
 */
export async function saveSecretsToKV(env, secrets, reason = 'update') {
	const logger = getLogger(env);

	try {
		// 🔒 加密数据
		const encryptedData = await encryptSecrets(secrets, env);

		// 写入 R2 主数据
		await env.BACKUP_R2.put(R2_SECRETS_KEY, encryptedData, {
			httpMetadata: { contentType: 'application/json' },
			customMetadata: {
				count: String(secrets.length),
				updatedAt: new Date().toISOString(),
				reason,
			},
		});

		logger.info(`密钥已保存到 R2`, {
			count: secrets.length,
			reason,
			encrypted: !!env.ENCRYPTION_KEY,
		});

		// 异步创建备份快照（不阻塞主流程）
		_createBackupSnapshot(env, encryptedData, secrets.length, logger).catch((err) => {
			logger.warn('创建备份快照失败（不影响主流程）', {}, err);
		});
	} catch (error) {
		logger.error('保存密钥到 R2 失败', {}, error);
		throw error;
	}
}

/**
 * 获取所有密钥（从 R2）
 *
 * @param {Object} env - Cloudflare Workers 环境对象
 * @returns {Promise<Array>} 密钥数组
 */
export async function getAllSecrets(env) {
	const logger = getLogger(env);

	try {
		const obj = await env.BACKUP_R2.get(R2_SECRETS_KEY);
		if (!obj) {
			logger.info('R2 中无密钥数据');
			return [];
		}

		const secretsData = await obj.text();
		return await decryptSecrets(secretsData, env);
	} catch (error) {
		logger.error('从 R2 获取密钥失败', { errorMessage: error.message }, error);
		return [];
	}
}

/**
 * 创建备份快照（写到 R2 backups/ 目录）
 * @private
 */
async function _createBackupSnapshot(env, encryptedData, count, logger) {
	const now = new Date();
	const dateStr = now.toISOString().split('T')[0];
	const timeStr = now.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
	const backupKey = `backups/backup_${dateStr}_${timeStr}.json`;

	await env.BACKUP_R2.put(backupKey, encryptedData, {
		httpMetadata: { contentType: 'application/json' },
		customMetadata: {
			secretCount: String(count),
			timestamp: now.toISOString(),
			encrypted: String(!!env.ENCRYPTION_KEY),
		},
	});

	logger.debug('备份快照已创建', { backupKey });
}
