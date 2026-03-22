/**
 * 基础样式 v2 — 现代极简
 */
export function getBaseStyles() {
	return `
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-primary);
      min-height: 100vh;
      color: var(--text-primary);
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .container {
      max-width: 1080px; /* 极简风格放宽为主流桌面网格 */
      margin: 0 auto;
      padding: 0 16px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      padding: 64px 8px 32px; /* 增加上间距，Apple 风格喜欢空旷 */
      text-align: left; /* 改为左对齐适应多列网格 */
    }

    .header h1 {
      font-size: 32px; /* 增加大标题尺寸 */
      font-weight: 700;
      letter-spacing: -0.8px;
      margin-bottom: 8px;
    }

    .header p {
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 400;
    }

    .content {
      flex: 1; /* 撑满剩余高度 */
      padding: 24px 8px 16px;
    }

    /* ─── 搜索栏 ─── */
    .search-section { margin-bottom: 16px; }
    .search-container { max-width: 100%; }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--search-bg);
      border: 1.5px solid var(--search-border);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.2s ease;
    }

    .search-input-wrapper:focus-within {
      border-color: var(--search-border-focus);
      box-shadow: 0 0 0 3px var(--accent-light);
    }

    .search-icon {
      padding: 10px 14px;
      color: var(--search-icon);
      font-size: 14px;
      user-select: none;
      height: 44px;
      display: flex;
      align-items: center;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px 36px 10px 0;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      background: transparent;
      color: var(--input-text);
      height: 44px;
    }

    .search-input::placeholder {
      color: var(--input-placeholder);
      font-weight: 400;
    }

    .search-input::-webkit-search-cancel-button {
      display: none;
      -webkit-appearance: none;
    }

    .search-clear {
      position: absolute;
      right: 0; top: 0;
      background: none; border: none;
      padding: 10px 12px;
      color: var(--text-tertiary);
      cursor: pointer;
      font-size: 14px;
      transition: color 0.15s;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .search-clear:hover { color: var(--danger); }

    .search-stats {
      margin-top: 6px;
      padding: 0 4px;
      font-size: 12px;
      color: var(--text-tertiary);
    }

    .search-action-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-input-wrapper { flex: 1; }
    .sort-controls { flex-shrink: 0; }

    .sort-select {
      padding: 9px 12px;
      border: 1px solid var(--border-primary);
      border-radius: 12px;
      background: var(--input-bg);
      color: var(--text-primary);
      font-size: 13px;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      outline: none;
      transition: all 0.2s;
      min-width: 120px;
      height: 44px;
    }

    .sort-select:hover { border-color: var(--accent); }
    .sort-select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-light);
    }

    /* ─── FAB 菜单（右上角 +） ─── */
    .action-menu-float {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1001;
    }

    .main-action-button {
      background: var(--accent);
      color: white;
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 14px;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(.4,0,.2,1);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--float-btn-shadow);
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      outline: none;
    }

    .main-action-button:hover {
      background: var(--accent-hover);
      transform: translateY(-1px) scale(1.04);
    }

    .main-action-button:active {
      transform: scale(0.96);
    }

    .main-action-button.active {
      transform: rotate(45deg);
      background: var(--danger);
      border-radius: 50%;
    }

    .main-action-button.active:hover {
      background: var(--danger-dark);
    }

    /* 子菜单 */
    .action-submenu {
      position: absolute;
      top: 56px;
      right: 0;
      background: var(--menu-bg);
      border-radius: 16px;
      box-shadow: var(--menu-shadow);
      border: 1px solid var(--menu-border);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px) scale(0.96);
      transition: all 0.2s cubic-bezier(.4,0,.2,1);
      z-index: 1000;
      min-width: 180px;
      overflow: hidden;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .action-submenu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .submenu-item {
      display: flex;
      align-items: center;
      padding: 11px 16px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.15s;
      border-bottom: 1px solid var(--border-secondary);
      background: transparent;
      font-size: 13px;
    }

    .submenu-item:last-child { border-bottom: none; }

    .action-submenu.show .submenu-item:hover {
      background: var(--bg-hover);
    }

    .action-submenu.show .submenu-item:active {
      background: var(--bg-active);
    }

    .item-icon {
      font-size: 15px;
      margin-right: 10px;
      width: 20px;
      text-align: center;
      opacity: 0.85;
    }

    .item-text {
      font-size: 13px;
      font-weight: 500;
      flex: 1;
    }

    /* 子菜单入场动画 */
    .action-submenu .submenu-item {
      transform: translateX(-12px);
      opacity: 0;
      transition: all 0.2s ease;
    }

    .action-submenu.show .submenu-item {
      transform: translateX(0);
      opacity: 1;
    }

    .action-submenu.show .submenu-item:nth-child(1) { transition-delay: 0.02s; }
    .action-submenu.show .submenu-item:nth-child(2) { transition-delay: 0.05s; }
    .action-submenu.show .submenu-item:nth-child(3) { transition-delay: 0.08s; }
    .action-submenu.show .submenu-item:nth-child(4) { transition-delay: 0.11s; }
    .action-submenu.show .submenu-item:nth-child(5) { transition-delay: 0.14s; }
    .action-submenu.show .submenu-item:nth-child(6) { transition-delay: 0.17s; }

    /* 菜单项 hover 色彩 */
    .action-submenu.show .submenu-item:nth-child(1):hover { color: var(--accent); }
    .action-submenu.show .submenu-item:nth-child(2):hover { color: var(--success); }
    .action-submenu.show .submenu-item:nth-child(3):hover { color: #a855f7; }
    .action-submenu.show .submenu-item:nth-child(4):hover { color: var(--warning); }
    .action-submenu.show .submenu-item:nth-child(5):hover { color: var(--info); }
    .action-submenu.show .submenu-item:nth-child(6):hover { color: #ec4899; }

    /* 遮罩 */
    .menu-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: transparent;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
      z-index: 1;
    }

    .menu-overlay.show {
      opacity: 1;
      visibility: visible;
    }

    /* ─── 浮动按钮组 ─── */
    .back-to-top {
      position: fixed;
      bottom: 20px; right: 20px;
      width: 40px; height: 40px;
      background: var(--back-to-top-bg);
      border: 1.5px solid var(--back-to-top-border);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      user-select: none;
      outline: none;
      padding: 0;
      font-family: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    .back-to-top:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .back-to-top.show { opacity: 1; visibility: visible; }

    .back-to-top:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      background: var(--back-to-top-hover);
    }

    .back-to-top:active { transform: scale(0.95); }

    .back-to-top-icon {
      font-size: 18px;
      font-weight: bold;
      line-height: 1;
      color: var(--back-to-top-text);
      transition: transform 0.2s;
    }

    .back-to-top:hover .back-to-top-icon { transform: translateY(-2px); }

    /* 主题切换 */
    .theme-toggle-float {
      position: fixed;
      bottom: 20px; right: 20px;
      width: 40px; height: 40px;
      background: var(--theme-toggle-bg);
      border: 1.5px solid var(--theme-toggle-border);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
      z-index: 1000;
      user-select: none;
      outline: none;
      padding: 0;
      font-family: inherit;
      -webkit-tap-highlight-color: transparent;
    }

    .theme-toggle-float:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .back-to-top.show ~ .theme-toggle-float {
      bottom: 68px !important;
    }

    .theme-toggle-float:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      background: var(--theme-toggle-hover);
    }

    .theme-toggle-float:active { transform: scale(0.95); }

    .theme-toggle-float .theme-icon {
      font-size: 18px;
      transition: transform 0.3s;
    }

    .theme-toggle-float:hover .theme-icon { transform: rotate(20deg); }

    /* ─── 响应式 ─── */
    @media (max-width: 768px) {
      .search-action-row {
        flex-direction: column;
        gap: 10px;
        align-items: stretch;
      }
      .search-input-wrapper { width: 100%; }
      .sort-controls { width: 100%; }
      .sort-select { width: 100%; height: 42px; }
    }

    @media (max-width: 480px) {
      .search-input-wrapper { border-radius: 10px; }
      .search-icon { padding: 9px 12px; font-size: 13px; height: 40px; }
      .search-input { padding: 9px 36px 9px 0; font-size: 14px; height: 40px; }
      .search-clear { height: 40px; }
      .sort-select { height: 40px; border-radius: 10px; font-size: 13px; }

      .action-menu-float { top: 14px; right: 14px; }
      .main-action-button { width: 38px; height: 38px; font-size: 17px; border-radius: 12px; }

      .back-to-top,
      .theme-toggle-float {
        width: 36px; height: 36px; right: 14px; bottom: 14px; border-radius: 10px;
      }

      .back-to-top.show ~ .theme-toggle-float { bottom: 58px !important; }
      .back-to-top-icon { font-size: 16px; }
      .theme-toggle-float .theme-icon { font-size: 16px; }

      .action-submenu { min-width: 160px; top: 48px; border-radius: 14px; }
      .submenu-item { padding: 10px 14px; }
      .item-text { font-size: 13px; }
      .item-icon { font-size: 14px; margin-right: 8px; }
    }

    @media (max-width: 360px) {
      .search-icon { padding: 8px 10px; height: 38px; }
      .search-input { height: 38px; font-size: 13px; }
      .search-clear { height: 38px; }
      .sort-select { height: 38px; font-size: 12px; }
      .action-menu-float { top: 10px; right: 10px; }
      .back-to-top, .theme-toggle-float { width: 34px; height: 34px; right: 10px; bottom: 10px; }
      .back-to-top.show ~ .theme-toggle-float { bottom: 52px !important; }
      .main-action-button { width: 34px; height: 34px; font-size: 16px; }
      .action-submenu { min-width: 140px; top: 44px; }
    }
`;
}
