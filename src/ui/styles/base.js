/**
 * 基础样式 v3 — 布局骨架
 */
export function getBaseStyles() {
	return `
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--font-body);
      background: var(--bg-primary);
      min-height: 100vh;
      color: var(--text-primary);
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.5;
    }

    /* ── 主容器 ── */
    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 20px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .content {
      flex: 1;
      padding: 20px 0;
    }

    /* ── 搜索栏 ── */
    .search-section { margin-bottom: 20px; }
    .search-container { max-width: 100%; }

    .search-action-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .search-input-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      background: var(--search-bg);
      border: 1px solid var(--search-border);
      border-radius: var(--radius-md);
      overflow: hidden;
      transition: border-color var(--duration-fast) ease,
                  box-shadow var(--duration-fast) ease;
    }

    .search-input-wrapper:focus-within {
      border-color: var(--search-border-focus);
      box-shadow: 0 0 0 3px var(--accent-light);
    }

    .search-icon {
      padding: 0 12px;
      color: var(--search-icon);
      font-size: 14px;
      user-select: none;
      height: 42px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 0 12px 0 0;
      font-size: 14px;
      font-family: var(--font-body);
      background: transparent;
      color: var(--input-text);
      height: 42px;
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
      padding: 0 12px;
      color: var(--text-tertiary);
      cursor: pointer;
      font-size: 13px;
      transition: color var(--duration-fast);
      height: 42px;
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

    .sort-controls { flex-shrink: 0; }

    .sort-select {
      padding: 0 12px;
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      background: var(--input-bg);
      color: var(--text-primary);
      font-size: 13px;
      font-family: var(--font-body);
      cursor: pointer;
      outline: none;
      transition: border-color var(--duration-fast),
                  box-shadow var(--duration-fast);
      min-width: 110px;
      height: 42px;
    }

    .sort-select:hover { border-color: var(--accent); }
    .sort-select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-light);
    }

    /* ── FAB 菜单（右上角 +） ── */
    .action-menu-float {
      position: fixed;
      top: 20px;
      right: 24px;
      z-index: 1001;
    }

    .main-action-button {
      background: var(--float-btn-bg);
      color: var(--float-btn-text);
      border: none;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      font-size: 20px;
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-out);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--float-btn-shadow);
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      outline: none;
    }

    .main-action-button:hover {
      background: var(--float-btn-hover);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(26,26,46,0.4);
    }

    .main-action-button:active {
      transform: scale(0.95);
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
      top: 54px;
      right: 0;
      background: var(--menu-bg);
      border-radius: var(--radius-lg);
      box-shadow: var(--menu-shadow);
      border: 1px solid var(--menu-border);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-6px) scale(0.97);
      transition: all var(--duration-normal) var(--ease-out);
      z-index: 1000;
      min-width: 200px;
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
      padding: 10px 16px;
      color: var(--text-primary);
      cursor: pointer;
      transition: background var(--duration-fast);
      border-bottom: 1px solid var(--border-secondary);
      background: transparent;
      font-size: 13px;
      font-weight: 500;
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
      opacity: 0.8;
    }

    .item-text {
      font-size: 13px;
      font-weight: 500;
      flex: 1;
    }

    /* 子菜单入场动画 */
    .action-submenu .submenu-item {
      transform: translateX(-8px);
      opacity: 0;
      transition: all var(--duration-normal) var(--ease-out);
    }

    .action-submenu.show .submenu-item {
      transform: translateX(0);
      opacity: 1;
    }

    .action-submenu.show .submenu-item:nth-child(1) { transition-delay: 0.02s; }
    .action-submenu.show .submenu-item:nth-child(2) { transition-delay: 0.04s; }
    .action-submenu.show .submenu-item:nth-child(3) { transition-delay: 0.06s; }
    .action-submenu.show .submenu-item:nth-child(4) { transition-delay: 0.08s; }
    .action-submenu.show .submenu-item:nth-child(5) { transition-delay: 0.10s; }
    .action-submenu.show .submenu-item:nth-child(6) { transition-delay: 0.12s; }
    .action-submenu.show .submenu-item:nth-child(7) { transition-delay: 0.14s; }
    .action-submenu.show .submenu-item:nth-child(8) { transition-delay: 0.16s; }

    /* 菜单项 hover 色 */
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
      transition: all var(--duration-normal);
      z-index: 1;
    }

    .menu-overlay.show {
      opacity: 1;
      visibility: visible;
    }

    /* ── 浮动按钮组 ── */
    .back-to-top {
      position: fixed;
      bottom: 24px; right: 24px;
      width: 38px; height: 38px;
      background: var(--back-to-top-bg);
      border: 1px solid var(--back-to-top-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-out);
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
      font-size: 16px;
      font-weight: bold;
      line-height: 1;
      color: var(--back-to-top-text);
      transition: transform var(--duration-fast);
    }

    .back-to-top:hover .back-to-top-icon { transform: translateY(-1px); }

    /* 主题切换 */
    .theme-toggle-float {
      position: fixed;
      bottom: 24px; right: 24px;
      width: 38px; height: 38px;
      background: var(--theme-toggle-bg);
      border: 1px solid var(--theme-toggle-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-out);
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
      bottom: 70px !important;
    }

    .theme-toggle-float:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      background: var(--theme-toggle-hover);
    }

    .theme-toggle-float:active { transform: scale(0.95); }

    .theme-toggle-float .theme-icon {
      font-size: 16px;
      transition: transform 0.3s;
    }

    .theme-toggle-float:hover .theme-icon { transform: rotate(15deg); }

    /* ── 空状态 ── */
    .empty-state {
      text-align: center;
      padding: 80px 20px 40px;
      color: var(--text-secondary);
    }

    .empty-state .icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    .empty-state h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .empty-state p {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-tertiary);
      font-size: 14px;
    }

    /* ── 响应式 ── */
    @media (max-width: 768px) {
      .container {
        padding: 0 16px;
      }

      .search-action-row {
        flex-direction: column;
        gap: 8px;
        align-items: stretch;
      }
      .search-input-wrapper { width: 100%; }
      .sort-controls { width: 100%; }
      .sort-select { width: 100%; }
    }

    @media (max-width: 480px) {
      .container { padding: 0 12px; }

      .search-input-wrapper { border-radius: var(--radius-sm); }
      .search-icon { padding: 0 10px; font-size: 13px; height: 40px; }
      .search-input { font-size: 14px; height: 40px; }
      .search-clear { height: 40px; }
      .sort-select { height: 40px; border-radius: var(--radius-sm); font-size: 13px; }

      .action-menu-float { top: 14px; right: 14px; }
      .main-action-button { width: 40px; height: 40px; font-size: 18px; border-radius: var(--radius-sm); }

      .back-to-top,
      .theme-toggle-float {
        width: 36px; height: 36px; right: 14px; bottom: 16px; border-radius: var(--radius-sm);
      }

      .back-to-top.show ~ .theme-toggle-float { bottom: 60px !important; }

      .action-submenu { min-width: 180px; top: 50px; border-radius: var(--radius-md); }
      .submenu-item { padding: 10px 14px; }
    }

    @media (max-width: 360px) {
      .search-icon { height: 38px; }
      .search-input { height: 38px; font-size: 13px; }
      .search-clear { height: 38px; }
      .sort-select { height: 38px; font-size: 12px; }
      .action-menu-float { top: 10px; right: 10px; }
      .back-to-top, .theme-toggle-float { width: 34px; height: 34px; right: 10px; bottom: 12px; }
      .back-to-top.show ~ .theme-toggle-float { bottom: 54px !important; }
      .main-action-button { width: 36px; height: 36px; font-size: 16px; }
    }
`;
}
