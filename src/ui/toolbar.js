/**
 * 侧边工具栏 + 更多操作菜单
 * 从 page.js 拆出，集中管理所有工具栏入口
 */

/**
 * 生成侧边工具栏 HTML
 */
export function getSideToolbar() {
	return `
  <!-- 右侧浮动竖直工具栏 -->
  <div class="side-toolbar" id="sideToolbar">
    <button class="toolbar-btn" onclick="showAddModal()" title="添加密钥"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
    <button class="toolbar-btn" onclick="showQRScanner()" title="扫二维码"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/><rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><path d="M14 14h3v3"/></svg></button>
    <button class="toolbar-btn" onclick="showImportModal()" title="批量导入"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
    <button class="toolbar-btn" id="toolbarMoreBtn" onclick="toggleActionMenu()" title="更多操作"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></button>
  </div>`;
}

/**
 * 生成更多操作菜单 HTML
 * 分 3 组：数据管理 / 智能功能 / 安全与设置
 */
export function getActionMenu() {
	// 菜单项配置：集中管理，便于增删
	const groups = [
		{
			label: '数据管理',
			items: [
				{ icon: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/>', action: 'exportAllSecrets()', text: '批量导出' },
				{ icon: '<polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>', action: 'showRestoreModal()', text: '还原配置' },
				{ icon: '<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>', action: 'showWebDAVModal()', text: 'WebDAV 备份' },
				{ icon: '<polyline points="17,1 21,5 17,9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7,23 3,19 7,15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>', action: 'showSyncModal()', text: '设备同步' },
			],
		},
		{
			label: '智能功能',
			items: [
				{ icon: '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>', action: 'showURLMatcher()', text: 'URL 匹配' },
				{ icon: '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>', action: 'showGroupManager()', text: '分组管理' },
				{ icon: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>', action: 'showToolsModal()', text: '实用工具' },
			],
		},
		{
			label: '安全与设置',
			items: [
				{ icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', action: 'showSecurityDashboard()', text: '安全仪表盘' },
				{ icon: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>', action: 'showAppLockSettings()', text: '应用锁' },
			],
		},
	];

	// 生成 HTML
	let html = `
  <!-- 更多操作浮动菜单 -->
  <div class="action-menu-float" style="position:fixed; right: 64px; top: auto; bottom: 60px; z-index: 1002;">
    <div class="action-submenu" id="actionSubmenu">`;

	for (const group of groups) {
		html += `\n      <div class="submenu-group-label">${group.label}</div>`;
		for (const item of group.items) {
			html += `
      <div class="submenu-item" onclick="${item.action}; closeActionMenu();">
        <span class="item-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg></span>
        <span class="item-text">${item.text}</span>
      </div>`;
		}
	}

	html += `
    </div>
  </div>`;

	return html;
}

/**
 * 生成浮动按钮 HTML（回到顶部 + 主题切换）
 */
export function getFloatingButtons() {
	return `
  <!-- 回到顶部按钮 -->
  <button class="back-to-top" id="backToTop" onclick="scrollToTop()" title="回到顶部" aria-label="回到顶部" type="button" style="display: none;">
    <span class="back-to-top-icon" aria-hidden="true">↑</span>
  </button>

  <!-- 主题切换按钮 -->
  <button class="theme-toggle-float" onclick="toggleTheme()" title="当前：跟随系统（点击切换）" aria-label="切换主题" type="button">
    <span class="theme-icon" id="theme-icon" aria-hidden="true">🌓</span>
  </button>`;
}
