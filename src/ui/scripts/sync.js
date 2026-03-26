/**
 * P2P 同步前端模块
 * AES-256-GCM 加密、配对码生成、发送/接收 UI
 */
export function getSyncCode() {
	return `
    // ========== Feature: 🔄 P2P 同步 ==========

    /**
     * 生成随机配对码（12位字母数字）
     * 前 6 位 = syncId（用于服务端查找）
     * 完整 12 位 = 密钥材料（用于 AES 加密）
     */
    function generatePairingCode() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 避免 0/O/1/I 混淆
      let code = '';
      const random = crypto.getRandomValues(new Uint8Array(12));
      for (let i = 0; i < 12; i++) {
        code += chars[random[i] % chars.length];
      }
      return code;
    }

    /**
     * 从配对码派生 AES 密钥
     */
    async function deriveKeyFromCode(code, salt) {
      const keyMaterial = await crypto.subtle.importKey(
        'raw', strToBuffer(code), 'PBKDF2', false, ['deriveKey']
      );
      return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    }

    /**
     * 加密数据
     */
    async function encryptSyncData(data, code) {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveKeyFromCode(code, salt);

      const plaintext = strToBuffer(JSON.stringify(data));
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key, plaintext
      );

      return {
        encryptedData: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
        iv: btoa(String.fromCharCode(...iv)),
        salt: btoa(String.fromCharCode(...salt))
      };
    }

    /**
     * 解密数据
     */
    async function decryptSyncData(encryptedData, ivB64, saltB64, code) {
      const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
      const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
      const ciphertext = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

      const key = await deriveKeyFromCode(code, salt);

      const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key, ciphertext
      );

      return JSON.parse(new TextDecoder().decode(plaintext));
    }

    // --- 同步 UI ---

    function showSyncModal() {
      closeActionMenu();
      const modal = document.getElementById('syncModal');
      if (!modal) return;
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('show'), 10);
      disableBodyScroll();

      // 默认显示发送 tab
      switchSyncTab('send');
    }

    function hideSyncModal() {
      const modal = document.getElementById('syncModal');
      if (!modal) return;
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 200);
      enableBodyScroll();
    }

    function switchSyncTab(tab) {
      // 切换 tab 按钮
      document.querySelectorAll('.sync-tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById('syncTab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');

      // 切换内容
      document.getElementById('syncSendPanel').style.display = tab === 'send' ? 'block' : 'none';
      document.getElementById('syncReceivePanel').style.display = tab === 'receive' ? 'block' : 'none';

      // 重置状态
      document.getElementById('syncSendStatus').innerHTML = '';
      document.getElementById('syncReceiveStatus').innerHTML = '';
      document.getElementById('syncPairingCode').textContent = '';
      document.getElementById('syncReceiveInput').value = '';
    }

    /**
     * 发送端：生成配对码并上传加密数据
     */
    async function startSyncSend() {
      const statusEl = document.getElementById('syncSendStatus');
      const codeEl = document.getElementById('syncPairingCode');
      const btn = document.getElementById('syncSendBtn');

      if (secrets.length === 0) {
        statusEl.innerHTML = '<div class="sync-status-error">没有密钥可同步</div>';
        return;
      }

      btn.disabled = true;
      btn.textContent = '加密中...';
      statusEl.innerHTML = '<div class="sync-status-info">🔐 正在加密 ' + secrets.length + ' 个密钥...</div>';

      try {
        // 生成配对码
        const code = generatePairingCode();
        const syncId = code.substring(0, 6);

        // 加密所有密钥
        const dataToSync = secrets.map(s => ({
          name: s.name,
          account: s.account || '',
          secret: s.secret,
          type: s.type || 'TOTP',
          digits: s.digits || 6,
          period: s.period || 30,
          algorithm: s.algorithm || 'SHA1',
          counter: s.counter || 0,
          group: s.group || '',
          domains: s.domains || []
        }));

        const { encryptedData, iv, salt } = await encryptSyncData(dataToSync, code);

        // 上传到服务器
        statusEl.innerHTML = '<div class="sync-status-info">📤 正在上传加密数据...</div>';

        const response = await authenticatedFetch('/api/sync/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ syncId, encryptedData, iv, salt })
        });

        const result = await response.json();
        if (!result.ok) throw new Error(result.error || '上传失败');

        // 显示配对码
        codeEl.textContent = code.substring(0,4) + ' ' + code.substring(4,8) + ' ' + code.substring(8,12);
        statusEl.innerHTML = '<div class="sync-status-success">' +
          '✅ 已加密 ' + secrets.length + ' 个密钥<br>' +
          '<small style="color:var(--text-tertiary);">配对码 10 分钟内有效，仅可使用一次</small>' +
          '</div>';

        btn.textContent = '重新生成';
        btn.disabled = false;
      } catch (err) {
        statusEl.innerHTML = '<div class="sync-status-error">❌ ' + err.message + '</div>';
        btn.textContent = '📤 生成配对码';
        btn.disabled = false;
      }
    }

    /**
     * 接收端：输入配对码并下载解密
     */
    async function startSyncReceive() {
      const input = document.getElementById('syncReceiveInput');
      const statusEl = document.getElementById('syncReceiveStatus');
      const btn = document.getElementById('syncReceiveBtn');

      // 清理输入中的空格
      const code = input.value.replace(/\\s/g, '').toUpperCase();
      if (code.length !== 12) {
        statusEl.innerHTML = '<div class="sync-status-error">请输入完整的 12 位配对码</div>';
        return;
      }

      const syncId = code.substring(0, 6);

      btn.disabled = true;
      btn.textContent = '接收中...';
      statusEl.innerHTML = '<div class="sync-status-info">📥 正在获取加密数据...</div>';

      try {
        const response = await authenticatedFetch('/api/sync/retrieve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ syncId })
        });

        const result = await response.json();
        if (!result.ok) throw new Error(result.error || '获取失败');

        // 解密
        statusEl.innerHTML = '<div class="sync-status-info">🔓 正在解密...</div>';

        const decryptedSecrets = await decryptSyncData(
          result.encryptedData, result.iv, result.salt, code
        );

        if (!Array.isArray(decryptedSecrets) || decryptedSecrets.length === 0) {
          throw new Error('解密后的数据为空');
        }

        // 导入密钥（去重：跳过已存在的同名+同账户密钥）
        let imported = 0;
        let skipped = 0;

        for (const s of decryptedSecrets) {
          const exists = secrets.some(
            existing => existing.name === s.name && existing.account === s.account
          );
          if (exists) {
            skipped++;
            continue;
          }

          try {
            await authenticatedFetch('/api/secrets', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(s)
            });
            imported++;
          } catch { skipped++; }
        }

        // 刷新列表
        await loadSecrets();

        statusEl.innerHTML = '<div class="sync-status-success">' +
          '✅ 同步完成！<br>' +
          '导入 <strong>' + imported + '</strong> 个密钥' +
          (skipped > 0 ? '，跳过 ' + skipped + ' 个重复' : '') +
          '</div>';

        btn.textContent = '📥 开始接收';
        btn.disabled = false;

        showCenterToast('🔄', '同步完成，导入 ' + imported + ' 个密钥');
      } catch (err) {
        statusEl.innerHTML = '<div class="sync-status-error">❌ ' + err.message + '</div>';
        btn.textContent = '📥 开始接收';
        btn.disabled = false;
      }
    }
`;
}
