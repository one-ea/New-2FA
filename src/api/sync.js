/**
 * P2P 同步 API
 * 加密中继：设备 A 加密上传 → Worker 暂存密文 → 设备 B 下载解密
 * Worker 无法读取明文，配对码一次性使用
 */

/**
 * 创建同步邀请（设备 A）
 * 接收加密后的密钥数据，返回同步 ID
 */
export async function handleSyncCreate(request, env) {
	try {
		const body = await request.json();
		const { syncId, encryptedData, iv, salt } = body;

		if (!syncId || !encryptedData || !iv || !salt) {
			return new Response(JSON.stringify({ error: '缺少必要参数' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// syncId 长度校验（6 字符）
		if (syncId.length !== 6) {
			return new Response(JSON.stringify({ error: '无效的同步 ID' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// 存储到 R2，10 分钟后自动过期（通过自定义 metadata）
		const key = `sync/${syncId}`;
		const payload = JSON.stringify({ encryptedData, iv, salt, createdAt: Date.now() });

		await env.BACKUP_R2.put(key, payload, {
			customMetadata: { expiresAt: String(Date.now() + 10 * 60 * 1000) },
		});

		return new Response(JSON.stringify({ ok: true, syncId, expiresIn: 600 }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: '创建同步失败: ' + error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

/**
 * 获取同步数据（设备 B）
 * 返回加密数据，获取后立即删除
 */
export async function handleSyncRetrieve(request, env) {
	try {
		const body = await request.json();
		const { syncId } = body;

		if (!syncId || syncId.length !== 6) {
			return new Response(JSON.stringify({ error: '无效的同步 ID' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const key = `sync/${syncId}`;
		const obj = await env.BACKUP_R2.get(key);

		if (!obj) {
			return new Response(JSON.stringify({ error: '同步码不存在或已过期' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const payload = await obj.text();
		const data = JSON.parse(payload);

		// 检查是否过期（10分钟）
		if (Date.now() - data.createdAt > 10 * 60 * 1000) {
			await env.BACKUP_R2.delete(key);
			return new Response(JSON.stringify({ error: '同步码已过期' }), {
				status: 410,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// 一次性使用：获取后立即删除
		await env.BACKUP_R2.delete(key);

		return new Response(
			JSON.stringify({
				ok: true,
				encryptedData: data.encryptedData,
				iv: data.iv,
				salt: data.salt,
			}),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		return new Response(JSON.stringify({ error: '获取同步数据失败: ' + error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
