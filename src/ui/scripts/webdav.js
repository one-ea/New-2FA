/**
 * WebDAV 备份 UI 模块
 */

export function getWebDAVCode() {
	return `
    // ========== WebDAV 备份模块 ==========

    function showWebDAVModal() {
      showModal('webdavModal', () => {
        loadWebDAVConfig();
      });
    }

    function hideWebDAVModal() {
      hideModal('webdavModal');
    }

    // 加载已保存的配置
    async function loadWebDAVConfig() {
      try {
        const resp = await authenticatedFetch('/api/webdav/config');
        const data = await resp.json();

        if (data.configured) {
          document.getElementById('webdavUrl').value = data.url || '';
          document.getElementById('webdavUsername').value = data.username || '';
          document.getElementById('webdavPassword').value = data.password || '';
          document.getElementById('webdavPath').value = data.remotePath || '2fa-backup';
          document.getElementById('webdavAutoBackup').checked = !!data.autoBackup;

          // 自动加载备份列表
          loadWebDAVBackups();
        }
      } catch (e) {
        console.error('加载 WebDAV 配置失败:', e);
      }
    }

    // 保存配置
    async function saveWebDAVConfig() {
      const url = document.getElementById('webdavUrl').value.trim();
      const username = document.getElementById('webdavUsername').value.trim();
      const password = document.getElementById('webdavPassword').value;
      const remotePath = document.getElementById('webdavPath').value.trim() || '2fa-backup';
      const autoBackup = document.getElementById('webdavAutoBackup').checked;

      if (!url || !username || !password) {
        showCenterToast('❌', '请填写完整的 WebDAV 配置');
        return;
      }

      const btn = document.getElementById('webdavSaveBtn');
      btn.textContent = '保存中...';
      btn.disabled = true;

      try {
        const resp = await authenticatedFetch('/api/webdav/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, username, password, remotePath, autoBackup }),
        });

        const data = await resp.json();
        if (data.success) {
          showCenterToast('✅', '配置已保存');
        } else {
          showCenterToast('❌', data.error || '保存失败');
        }
      } catch (e) {
        showCenterToast('❌', '保存失败: ' + e.message);
      } finally {
        btn.textContent = '💾 保存配置';
        btn.disabled = false;
      }
    }

    // 测试连接
    async function testWebDAVConnection() {
      const url = document.getElementById('webdavUrl').value.trim();
      const username = document.getElementById('webdavUsername').value.trim();
      const password = document.getElementById('webdavPassword').value;
      const remotePath = document.getElementById('webdavPath').value.trim() || '2fa-backup';

      if (!url || !username || !password) {
        showCenterToast('❌', '请先填写连接信息');
        return;
      }

      const btn = document.getElementById('webdavTestBtn');
      btn.textContent = '测试中...';
      btn.disabled = true;

      try {
        const resp = await authenticatedFetch('/api/webdav/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, username, password, remotePath }),
        });

        const data = await resp.json();
        if (data.success) {
          showCenterToast('✅', '连接成功！');
        } else {
          showCenterToast('❌', data.error || '连接失败');
        }
      } catch (e) {
        showCenterToast('❌', '连接失败: ' + e.message);
      } finally {
        btn.textContent = '🔗 测试连接';
        btn.disabled = false;
      }
    }

    // 立即备份
    async function webdavBackupNow() {
      const btn = document.getElementById('webdavBackupBtn');
      btn.textContent = '备份中...';
      btn.disabled = true;

      try {
        const resp = await authenticatedFetch('/api/webdav/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });

        const data = await resp.json();
        if (data.success) {
          showCenterToast('✅', data.message);
          loadWebDAVBackups(); // 刷新列表
        } else {
          showCenterToast('❌', data.error || '备份失败');
        }
      } catch (e) {
        showCenterToast('❌', '备份失败: ' + e.message);
      } finally {
        btn.textContent = '📤 立即备份';
        btn.disabled = false;
      }
    }

    // 加载远程备份列表
    async function loadWebDAVBackups() {
      const listEl = document.getElementById('webdavBackupList');
      if (!listEl) return;

      listEl.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text-tertiary);font-size:13px;">加载中...</div>';

      try {
        const resp = await authenticatedFetch('/api/webdav/list');
        const data = await resp.json();

        if (!data.backups || data.backups.length === 0) {
          listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-tertiary);font-size:13px;">暂无远程备份</div>';
          return;
        }

        listEl.innerHTML = data.backups.map(function(b) {
          const date = b.modified ? new Date(b.modified).toLocaleString('zh-CN') : '未知';
          return '<div class="webdav-backup-item">' +
            '<div class="webdav-backup-info">' +
              '<div class="webdav-backup-name">' + b.name + '</div>' +
              '<div class="webdav-backup-meta">' + date + ' · ' + (b.sizeFormatted || '') + '</div>' +
            '</div>' +
            '<div class="webdav-backup-actions">' +
              '<button class="webdav-action-btn webdav-restore-btn" onclick="webdavRestore(\\'' + b.name + '\\')" title="还原">↩</button>' +
              '<button class="webdav-action-btn webdav-delete-btn" onclick="webdavDelete(\\'' + b.name + '\\')" title="删除">✕</button>' +
            '</div>' +
          '</div>';
        }).join('');
      } catch (e) {
        listEl.innerHTML = '<div style="text-align:center;padding:16px;color:var(--danger);font-size:13px;">加载失败: ' + e.message + '</div>';
      }
    }

    // 从 WebDAV 还原
    async function webdavRestore(filename) {
      if (!confirm('确定要从 "' + filename + '" 还原吗？\\n\\n⚠️ 此操作将覆盖当前所有密钥！')) return;

      showCenterToast('⏳', '正在还原...');

      try {
        const resp = await authenticatedFetch('/api/webdav/restore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename }),
        });

        const data = await resp.json();
        if (data.success) {
          showCenterToast('✅', data.message);
          setTimeout(() => location.reload(), 1500);
        } else {
          showCenterToast('❌', data.error || '还原失败');
        }
      } catch (e) {
        showCenterToast('❌', '还原失败: ' + e.message);
      }
    }

    // 删除远程备份
    async function webdavDelete(filename) {
      if (!confirm('确定删除远程备份 "' + filename + '"？')) return;

      try {
        const resp = await authenticatedFetch('/api/webdav/file', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename }),
        });

        const data = await resp.json();
        if (data.success) {
          showCenterToast('✅', '已删除');
          loadWebDAVBackups();
        } else {
          showCenterToast('❌', data.error || '删除失败');
        }
      } catch (e) {
        showCenterToast('❌', '删除失败: ' + e.message);
      }
    }
`;
}
