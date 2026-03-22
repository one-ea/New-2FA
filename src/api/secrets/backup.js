/**
 * 备份 API 处理器 v2
 *
 * - handleBackupSecrets: 手动创建备份到 R2
 * - handleGetBackups: 从 R2 列出备份
 */

import { getAllSecrets } from './shared.js';
import { getLogger } from '../../utils/logger.js';
import { checkRateLimit, getClientIdentifier, createRateLimitResponse, RATE_LIMIT_PRESETS } from '../../utils/rateLimit.js';
import { createJsonResponse, createErrorResponse } from '../../utils/response.js';
import { executeImmediateBackup } from '../../utils/backup.js';
import { BusinessLogicError, errorToResponse, logError } from '../../utils/errors.js';

/**
 * 手动创建备份到 R2
 */
export async function handleBackupSecrets(request, env) {
	const logger = getLogger(env);

	try {
		const clientIP = getClientIdentifier(request, 'ip');
		const rateLimitInfo = await checkRateLimit(clientIP, env, RATE_LIMIT_PRESETS.sensitive);
		if (!rateLimitInfo.allowed) {
			return createRateLimitResponse(rateLimitInfo);
		}

		const secrets = await getAllSecrets(env);

		if (!secrets || secrets.length === 0) {
			throw new BusinessLogicError('没有密钥需要备份', { operation: 'backup', secretsCount: 0 });
		}

		// 直接调用 R2 备份
		const result = await executeImmediateBackup(secrets, env, 'manual');

		return createJsonResponse({
			success: true,
			message: `备份完成，共备份 ${secrets.length} 个密钥`,
			backupKey: result.backupKey,
			count: secrets.length,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		if (error instanceof BusinessLogicError) {
			logError(error, logger, { operation: 'handleBackupSecrets' });
			return errorToResponse(error);
		}
		logger.error('手动备份失败', { errorMessage: error.message }, error);
		return createErrorResponse('备份失败', error.message, 500);
	}
}

/**
 * 获取备份列表（从 R2）
 */
export async function handleGetBackups(request, env) {
	const logger = getLogger(env);

	try {
		if (!env.BACKUP_R2) {
			return createJsonResponse({ success: true, backups: [], count: 0 });
		}

		const listed = await env.BACKUP_R2.list({ prefix: 'backups/' });
		const backups = listed.objects.map((obj) => ({
			key: obj.key,
			timestamp: obj.customMetadata?.timestamp || obj.uploaded.toISOString(),
			count: obj.customMetadata?.secretCount ? Number(obj.customMetadata.secretCount) : null,
			encrypted: obj.customMetadata?.encrypted === 'true',
			size: obj.size,
		}));

		// 按时间倒序
		backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

		logger.info('备份列表获取成功', { count: backups.length });

		return createJsonResponse({
			success: true,
			backups,
			count: backups.length,
		}, 200, request);
	} catch (error) {
		logger.error('获取备份列表失败', { errorMessage: error.message }, error);
		return createErrorResponse('获取备份列表失败', error.message, 500, request);
	}
}
