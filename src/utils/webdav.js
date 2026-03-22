/**
 * WebDAV 客户端 — 基于 fetch() 实现
 * 支持：MKCOL（创建目录）、PUT（上传）、GET（下载）、PROPFIND（列目录）、DELETE
 */

/**
 * 构造 Basic Auth 头
 */
function basicAuth(username, password) {
	const encoded = btoa(`${username}:${password}`);
	return `Basic ${encoded}`;
}

/**
 * 规范化 URL：确保末尾有 /
 */
function normalizeUrl(url) {
	return url.endsWith('/') ? url : url + '/';
}

/**
 * WebDAV 请求封装
 */
async function davRequest(method, url, options = {}) {
	const { username, password, body, headers = {}, depth } = options;

	const reqHeaders = {
		Authorization: basicAuth(username, password),
		...headers,
	};

	if (depth !== undefined) {
		reqHeaders['Depth'] = String(depth);
	}

	const resp = await fetch(url, {
		method,
		headers: reqHeaders,
		body,
	});

	return resp;
}

/**
 * 创建远程目录（递归创建）
 */
export async function ensureDirectory(baseUrl, remotePath, username, password) {
	const base = normalizeUrl(baseUrl);
	const parts = remotePath.split('/').filter(Boolean);
	let currentPath = base;

	for (const part of parts) {
		currentPath += part + '/';
		const resp = await davRequest('MKCOL', currentPath, { username, password });
		// 201 = 创建成功, 405 = 已存在, 301 = 重定向（已存在）
		if (resp.status !== 201 && resp.status !== 405 && resp.status !== 301 && resp.ok === false) {
			// 如果是 409 Conflict，说明父目录不存在，继续尝试
			if (resp.status !== 409) {
				const text = await resp.text().catch(() => '');
				throw new Error(`创建目录 ${currentPath} 失败: ${resp.status} ${text.substring(0, 200)}`);
			}
		}
	}
}

/**
 * 上传文件到 WebDAV
 */
export async function uploadFile(baseUrl, remotePath, filename, content, username, password) {
	const base = normalizeUrl(baseUrl);
	const dir = remotePath ? normalizeUrl(remotePath) : '';
	const url = base + dir + filename;

	const resp = await davRequest('PUT', url, {
		username,
		password,
		body: content,
		headers: { 'Content-Type': 'application/json' },
	});

	if (!resp.ok && resp.status !== 201 && resp.status !== 204) {
		const text = await resp.text().catch(() => '');
		throw new Error(`上传文件失败: ${resp.status} ${text.substring(0, 200)}`);
	}

	return { success: true, url, status: resp.status };
}

/**
 * 从 WebDAV 下载文件
 */
export async function downloadFile(baseUrl, remotePath, filename, username, password) {
	const base = normalizeUrl(baseUrl);
	const dir = remotePath ? normalizeUrl(remotePath) : '';
	const url = base + dir + filename;

	const resp = await davRequest('GET', url, { username, password });

	if (!resp.ok) {
		throw new Error(`下载文件失败: ${resp.status}`);
	}

	return await resp.text();
}

/**
 * 列出远程目录文件
 */
export async function listFiles(baseUrl, remotePath, username, password) {
	const base = normalizeUrl(baseUrl);
	const dir = remotePath ? normalizeUrl(remotePath) : '';
	const url = base + dir;

	const resp = await davRequest('PROPFIND', url, {
		username,
		password,
		depth: 1,
		headers: { 'Content-Type': 'application/xml' },
		body: `<?xml version="1.0" encoding="utf-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:displayname/>
    <d:getcontentlength/>
    <d:getlastmodified/>
    <d:resourcetype/>
  </d:prop>
</d:propfind>`,
	});

	if (!resp.ok) {
		throw new Error(`列目录失败: ${resp.status}`);
	}

	const xml = await resp.text();
	return parseDAVResponse(xml, url);
}

/**
 * 删除远程文件
 */
export async function deleteFile(baseUrl, remotePath, filename, username, password) {
	const base = normalizeUrl(baseUrl);
	const dir = remotePath ? normalizeUrl(remotePath) : '';
	const url = base + dir + filename;

	const resp = await davRequest('DELETE', url, { username, password });

	if (!resp.ok && resp.status !== 204 && resp.status !== 404) {
		throw new Error(`删除文件失败: ${resp.status}`);
	}

	return { success: true };
}

/**
 * 测试 WebDAV 连接
 */
export async function testConnection(baseUrl, remotePath, username, password) {
	try {
		const base = normalizeUrl(baseUrl);
		const resp = await davRequest('PROPFIND', base, {
			username,
			password,
			depth: 0,
			headers: { 'Content-Type': 'application/xml' },
			body: `<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:resourcetype/></d:prop></d:propfind>`,
		});

		if (resp.status === 401 || resp.status === 403) {
			return { success: false, error: '认证失败，请检查用户名和密码' };
		}

		if (!resp.ok && resp.status !== 207) {
			return { success: false, error: `连接失败: HTTP ${resp.status}` };
		}

		// 尝试创建目标目录
		if (remotePath) {
			await ensureDirectory(baseUrl, remotePath, username, password);
		}

		return { success: true, message: '连接成功' };
	} catch (error) {
		return { success: false, error: `连接失败: ${error.message}` };
	}
}

/**
 * 解析 WebDAV XML 响应为文件列表
 */
function parseDAVResponse(xml, baseUrl) {
	const files = [];

	// 简单的正则解析（Worker 环境没有 DOMParser）
	const responses = xml.split('<d:response>').slice(1);

	for (const resp of responses) {
		const href = extractTag(resp, 'd:href') || extractTag(resp, 'D:href');
		const displayname = extractTag(resp, 'd:displayname') || extractTag(resp, 'D:displayname');
		const size = extractTag(resp, 'd:getcontentlength') || extractTag(resp, 'D:getcontentlength');
		const modified = extractTag(resp, 'd:getlastmodified') || extractTag(resp, 'D:getlastmodified');
		const isCollection = resp.includes('<d:collection') || resp.includes('<D:collection');

		if (!href) continue;

		// 跳过目录本身
		const decodedHref = decodeURIComponent(href);
		const basePath = new URL(baseUrl).pathname;
		if (decodedHref === basePath || decodedHref === basePath + '/') continue;

		// 提取文件名
		const parts = decodedHref.split('/').filter(Boolean);
		const name = parts[parts.length - 1] || displayname || href;

		if (!isCollection) {
			files.push({
				name,
				size: size ? parseInt(size) : 0,
				modified: modified || null,
				href: decodedHref,
			});
		}
	}

	// 按修改时间倒序
	files.sort((a, b) => {
		if (!a.modified || !b.modified) return 0;
		return new Date(b.modified) - new Date(a.modified);
	});

	return files;
}

/**
 * 从 XML 中提取标签内容
 */
function extractTag(xml, tag) {
	// 匹配 <tag>content</tag> 或 <tag/>
	const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i');
	const match = xml.match(regex);
	return match ? match[1].trim() : null;
}
