/**
 * 2FA OTP Generator - Cloudflare Worker v2
 *
 * - 所有数据存储在 R2（密钥 + 认证 + 备份）
 * - 定时备份直接写 R2
 *
 * 原作者: wuzf (https://github.com/wuzf)
 * 当前维护: one-ea (https://github.com/one-ea)
 */

import { handleRequest, handleCORS } from './router/handler.js';
import { getLogger, createRequestLogger, PerformanceTimer } from './utils/logger.js';
import { getMonitoring, ErrorSeverity } from './utils/monitoring.js';
import { getAllSecrets } from './api/secrets/shared.js';
import { executeImmediateBackup, cleanupOldBackups } from './utils/backup.js';

/**
 * Cloudflare Worker 主入口点
 */
export default {
	async fetch(request, env, _ctx) {
		const logger = getLogger(env);
		const requestLogger = createRequestLogger(logger);
		const monitoring = getMonitoring(env);

		if (!monitoring._initialized) {
			await monitoring.initialize().catch((err) => {
				logger.warn('Failed to initialize monitoring', {}, err);
			});
			monitoring._initialized = true;
		}

		const timer = requestLogger.logRequest(request, env);
		const traceId = monitoring.getPerformanceMonitor().startTrace(`${request.method} ${new URL(request.url).pathname}`, {
			method: request.method,
			url: request.url,
		});

		try {
			const corsResponse = handleCORS(request);
			if (corsResponse) {
				monitoring.getPerformanceMonitor().endTrace(traceId, { type: 'cors-preflight', status: corsResponse.status });
				return corsResponse;
			}

			const response = await handleRequest(request, env);
			requestLogger.logResponse(timer, response);
			monitoring.getPerformanceMonitor().endTrace(traceId, { status: response.status, success: response.status < 400 });
			return response;
		} catch (error) {
			logger.error('Request handling failed', { method: request.method, url: request.url }, error);
			const errorInfo = monitoring.getErrorMonitor().captureError(error, { method: request.method, url: request.url }, ErrorSeverity.ERROR);
			requestLogger.logResponse(timer, null, error);
			monitoring.getPerformanceMonitor().endTrace(traceId, { success: false, errorId: errorInfo.errorId });

			return new Response(JSON.stringify({
				error: '服务器错误',
				message: '请求处理失败，请稍后重试',
				errorId: errorInfo.errorId,
			}), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	},

	/**
	 * 定时备份任务
	 * 读取 R2 主数据 → 创建 R2 备份快照 → 清理 30 天前的旧备份
	 */
	async scheduled(event, env, _ctx) {
		const logger = getLogger(env);
		const timer = new PerformanceTimer('ScheduledBackup', logger);

		try {
			logger.info('定时备份任务开始', { cron: event.cron || 'manual' });

			// 从 R2 读取当前密钥数据
			const secrets = await getAllSecrets(env);
			if (!secrets || secrets.length === 0) {
				logger.info('没有密钥需要备份，任务结束');
				return;
			}

			logger.info('密钥数量', { count: secrets.length });

			// 创建备份快照到 R2
			const result = await executeImmediateBackup(secrets, env, 'scheduled');
			timer.checkpoint('备份已保存');

			// 清理旧备份
			await cleanupOldBackups(env);
			timer.checkpoint('清理完成');

			timer.end({ success: true, backupKey: result?.backupKey, secretCount: secrets.length });
			logger.info('定时备份任务完成', { secretCount: secrets.length });
		} catch (error) {
			logger.error('定时备份任务失败', { duration: timer.getDuration() }, error);
			timer.end({ success: false, error: error.message });
		}
	},
};
