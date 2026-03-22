/**
 * 备份系统 v2
 * 所有备份存储在 R2，保留 30 天自动清理
 *
 * 事件驱动备份已整合到 shared.js 的 saveSecretsToKV 中，
 * 本模块仅保留防抖和清理逻辑供 scheduled() 使用。
 */

import { encryptData } from './encryption.js';
import { getLogger } from './logger.js';

const BACKUP_CONFIG = {
	DEBOUNCE_INTERVAL: 5 * 60 * 1000, // 5 分钟防抖
	MAX_AGE_DAYS: 30, // 保留 30 天
};

/**
 * 触发备份（兼容旧接口，由 shared.js 调用）
 * 现在是 no-op，因为 shared.js 已直接写 R2 快照
 */
export async function triggerBackup(_secrets, _env, _options = {}) {
	return null;
}

/**
 * 立即执行备份到 R2
 */
export async function executeImmediateBackup(secrets, env, reason = 'manual') {
	const logger = getLogger(env);
	if (!secrets || secrets.length === 0) return null;

	const now = new Date();
	const dateStr = now.toISOString().split('T')[0];
	const timeStr = now.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
	const backupKey = `backups/backup_${dateStr}_${timeStr}.json`;

	const backupData = {
		timestamp: now.toISOString(),
		version: '2.0',
		count: secrets.length,
		reason,
		secrets,
	};

	let content;
	let isEncrypted = false;

	if (env.ENCRYPTION_KEY) {
		content = await encryptData(backupData, env);
		isEncrypted = true;
	} else {
		content = JSON.stringify(backupData, null, 2);
	}

	await env.BACKUP_R2.put(backupKey, content, {
		httpMetadata: { contentType: 'application/json' },
		customMetadata: {
			secretCount: String(secrets.length),
			encrypted: String(isEncrypted),
			timestamp: now.toISOString(),
			reason,
		},
	});

	logger.info('R2 备份完成', { backupKey, secretCount: secrets.length, encrypted: isEncrypted });

	return { success: true, backupKey, secretCount: secrets.length };
}

/**
 * 清理超过 30 天的旧备份
 */
export async function cleanupOldBackups(env) {
	const logger = getLogger(env);
	if (!env.BACKUP_R2) return;

	try {
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - BACKUP_CONFIG.MAX_AGE_DAYS);

		const listed = await env.BACKUP_R2.list({ prefix: 'backups/' });
		let deleted = 0;

		for (const obj of listed.objects) {
			if (obj.uploaded < thirtyDaysAgo) {
				await env.BACKUP_R2.delete(obj.key);
				deleted++;
			}
		}

		if (deleted > 0) {
			logger.info('旧备份清理完成', { deleted, remaining: listed.objects.length - deleted });
		}
	} catch (error) {
		logger.error('旧备份清理失败', {}, error);
	}
}

export { BACKUP_CONFIG };
