/**
 * 工具箱区域 + 浮动按钮
 * 原 FAB 菜单已拆散为页面内嵌工具箱
 */

/**
 * 生成内嵌工具箱 HTML（放在 footer 上方）
 * 将原 FAB 菜单的功能项以图标网格形式展示
 */
export function getToolboxSection() {
	const tools = [
		{ icon: '<path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>', action: 'showWebDAVModal()', text: 'WebDAV' },
		{ icon: '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>', action: 'showURLMatcher()', text: 'URL匹配' },
		{ icon: '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>', action: 'showGroupManager()', text: '分组管理' },
		{ icon: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>', action: 'showAppLockSettings()', text: '应用锁' },
	];

	let html = `
  <!-- 工具箱区域 -->
  <div class="toolbox-section" id="toolboxSection">
    <div class="toolbox-header">
      <span class="toolbox-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
        工具与设置
      </span>
    </div>
    <div class="toolbox-grid" id="toolboxGrid">`;

	for (const tool of tools) {
		html += `
      <button class="toolbox-item" onclick="${tool.action}" title="${tool.text}">
        <span class="toolbox-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${tool.icon}</svg></span>
        <span class="toolbox-label">${tool.text}</span>
      </button>`;
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
  <!-- 回到顶部按钮 (仅滚动时显示) -->
  <button class="back-to-top" id="backToTop" onclick="scrollToTop()" title="回到顶部" aria-label="回到顶部" type="button" style="display: none;">
    <span class="back-to-top-icon" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </span>
  </button>

  <!-- Google Authenticator 巨大添加悬浮按钮 (FAB) -->
  <button class="add-fab-btn" onclick="showAddModal()" title="添加新的 2FA 密钥" aria-label="添加密钥">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  </button>`;
}
