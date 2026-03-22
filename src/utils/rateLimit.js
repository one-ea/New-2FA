import { getSecurityHeaders } from './security.js';
import { getLogger } from './logger.js';

/**
 * Rate Limiting v3 — 内存滑动窗口
 *
 * 无需 KV/R2，直接在 Worker 内存中限流。
 * Worker 实例是短暂的（每个请求可能新实例），
 * 所以 globalThis Map 只在同一实例生命周期内有效。
 * 对于个人应用这已经足够——大量突发请求会命中同一实例。
 */

// 全局内存存储（Worker 实例级别）
const rateLimitStore = new Map();

// 定期清理过期条目（防止内存泄漏）
const CLEANUP_INTERVAL = 60000; // 1分钟
let lastCleanup = Date.now();

function cleanupExpired() {
	const now = Date.now();
	if (now - lastCleanup < CLEANUP_INTERVAL) return;
	lastCleanup = now;

	for (const [key, data] of rateLimitStore) {
		if (data.expireAt && now > data.expireAt) {
			rateLimitStore.delete(key);
		}
	}
}

/**
 * 滑动窗口限流检查
 */
export async function checkRateLimitSlidingWindow(key, env, options = {}) {
	const { maxAttempts = 5, windowSeconds = 60 } = options;
	const logger = getLogger(env);
	const now = Date.now();
	const windowMs = windowSeconds * 1000;
	const windowStart = now - windowMs;
	const rateLimitKey = `ratelimit:v2:${key}`;

	cleanupExpired();

	try {
		let entry = rateLimitStore.get(rateLimitKey);
		let timestamps = [];

		if (entry && Array.isArray(entry.timestamps)) {
			timestamps = entry.timestamps.filter((ts) => ts > windowStart);
		}

		if (timestamps.length >= maxAttempts) {
			logger.warn('速率限制超出（滑动窗口）', {
				key,
				count: timestamps.length,
				maxAttempts,
				windowSeconds,
			});

			const oldestTimestamp = timestamps[0];
			const resetAt = oldestTimestamp + windowMs;
			return { allowed: false, remaining: 0, resetAt, limit: maxAttempts, algorithm: 'sliding-window' };
		}

		timestamps.push(now);

		// 限制存储大小
		const maxStored = Math.max(maxAttempts * 2, 20);
		if (timestamps.length > maxStored) {
			timestamps = timestamps.slice(-maxStored);
		}

		rateLimitStore.set(rateLimitKey, {
			timestamps,
			lastUpdate: now,
			expireAt: now + windowMs + 60000,
		});

		const oldestTimestamp = timestamps[0];
		const resetAt = oldestTimestamp + windowMs;
		return { allowed: true, remaining: maxAttempts - timestamps.length, resetAt, limit: maxAttempts, algorithm: 'sliding-window' };
	} catch (error) {
		logger.error('速率限制检查失败', { key, errorMessage: error.message }, error);
		return { allowed: true, remaining: maxAttempts, resetAt: now + windowMs, limit: maxAttempts, algorithm: 'sliding-window' };
	}
}

/**
 * 限流入口（统一使用滑动窗口）
 */
export async function checkRateLimit(key, env, options = {}) {
	return checkRateLimitSlidingWindow(key, env, options);
}

/**
 * 重置限流
 */
export async function resetRateLimit(key, env) {
	const logger = getLogger(env);
	try {
		rateLimitStore.delete(`ratelimit:${key}`);
		rateLimitStore.delete(`ratelimit:v2:${key}`);
		logger.info('速率限制已重置', { key });
	} catch (error) {
		logger.error('重置速率限制失败', { key, errorMessage: error.message }, error);
	}
}

/**
 * 获取限流信息（不增加计数）
 */
export async function getRateLimitInfo(key, env, optionsOrMaxAttempts = {}) {
	let options;
	if (typeof optionsOrMaxAttempts === 'number') {
		options = { maxAttempts: optionsOrMaxAttempts, windowSeconds: 60 };
	} else {
		options = optionsOrMaxAttempts;
	}

	const { maxAttempts = 5, windowSeconds = 60 } = options;
	const rateLimitKey = `ratelimit:v2:${key}`;
	const now = Date.now();
	const windowMs = windowSeconds * 1000;

	try {
		const entry = rateLimitStore.get(rateLimitKey);

		if (!entry || !Array.isArray(entry.timestamps)) {
			return { count: 0, remaining: maxAttempts, resetAt: now, limit: maxAttempts, algorithm: 'sliding-window' };
		}

		const windowStart = now - windowMs;
		const valid = entry.timestamps.filter((ts) => ts > windowStart);
		const oldest = valid[0] || now;

		return {
			count: valid.length,
			remaining: Math.max(0, maxAttempts - valid.length),
			resetAt: oldest + windowMs,
			limit: maxAttempts,
			algorithm: 'sliding-window',
		};
	} catch (error) {
		return { count: 0, remaining: maxAttempts, resetAt: now, limit: maxAttempts, algorithm: 'sliding-window' };
	}
}

/**
 * 429 响应
 */
export function createRateLimitResponse(rateLimitInfo, request = null) {
	const retryAfter = Math.ceil((rateLimitInfo.resetAt - Date.now()) / 1000);

	let headers = {
		'Content-Type': 'application/json',
		'Retry-After': retryAfter.toString(),
		'X-RateLimit-Limit': rateLimitInfo.limit.toString(),
		'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
		'X-RateLimit-Reset': rateLimitInfo.resetAt.toString(),
		'X-RateLimit-Algorithm': rateLimitInfo.algorithm || 'sliding-window',
	};

	if (request) {
		headers = { ...getSecurityHeaders(request), ...headers };
	} else {
		headers['Access-Control-Allow-Origin'] = '*';
		headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
		headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
	}

	return new Response(
		JSON.stringify({
			error: '请求过于频繁',
			message: `您的请求次数过多，请在 ${retryAfter} 秒后重试`,
			retryAfter,
			limit: rateLimitInfo.limit,
			remaining: rateLimitInfo.remaining,
			resetAt: new Date(rateLimitInfo.resetAt).toISOString(),
			algorithm: rateLimitInfo.algorithm || 'sliding-window',
		}),
		{ status: 429, headers },
	);
}

/**
 * 客户端标识
 */
export function getClientIdentifier(request, type = 'ip') {
	switch (type) {
		case 'ip':
			return (
				request.headers.get('CF-Connecting-IP') ||
				request.headers.get('X-Real-IP') ||
				request.headers.get('X-Forwarded-For')?.split(',')[0] ||
				'unknown'
			);
		case 'token': {
			const authHeader = request.headers.get('Authorization');
			if (authHeader && authHeader.startsWith('Bearer ')) {
				return `token:${authHeader.substring(7, 23)}`;
			}
			return 'no-token';
		}
		case 'combined': {
			const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
			const auth = request.headers.get('Authorization');
			if (auth && auth.startsWith('Bearer ')) {
				return `${ip}:${auth.substring(7, 23)}`;
			}
			return ip;
		}
		default:
			return request.headers.get('CF-Connecting-IP') || 'unknown';
	}
}

/**
 * 预设配置
 */
export const RATE_LIMIT_PRESETS = {
	login: { maxAttempts: 5, windowSeconds: 60 },
	loginStrict: { maxAttempts: 3, windowSeconds: 60 },
	api: { maxAttempts: 30, windowSeconds: 60 },
	sensitive: { maxAttempts: 10, windowSeconds: 60 },
	bulk: { maxAttempts: 20, windowSeconds: 300 },
	global: { maxAttempts: 100, windowSeconds: 60 },
};

/**
 * 限流中间件包装器
 */
export function withRateLimit(handler, options = {}) {
	const { preset = 'api', identifierType = 'ip', customKey = null } = options;

	return async (request, env, ...args) => {
		let key;
		if (customKey) {
			key = typeof customKey === 'function' ? customKey(request) : customKey;
		} else {
			key = getClientIdentifier(request, identifierType);
		}

		const rateLimitConfig = RATE_LIMIT_PRESETS[preset] || RATE_LIMIT_PRESETS.api;
		const rateLimitInfo = await checkRateLimit(key, env, rateLimitConfig);

		if (!rateLimitInfo.allowed) {
			return createRateLimitResponse(rateLimitInfo, request);
		}

		const response = await handler(request, env, ...args);

		if (response instanceof Response) {
			const newHeaders = new Headers(response.headers);
			newHeaders.set('X-RateLimit-Limit', rateLimitInfo.limit.toString());
			newHeaders.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
			newHeaders.set('X-RateLimit-Reset', rateLimitInfo.resetAt.toString());
			newHeaders.set('X-RateLimit-Algorithm', rateLimitInfo.algorithm || 'sliding-window');

			return new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: newHeaders,
			});
		}

		return response;
	};
}
