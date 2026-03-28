/**
 * 基础样式 v4 — 方案 C: 紧凑三列网格
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

    /* ━━ 主容器 ━━ */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 28px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* ━━ 页面顶栏 ━━ */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 40px 0 20px;
      gap: 16px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: var(--text-primary);
      flex-shrink: 0;
      line-height: 1.2;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-end;
    }

    /* ━━ 折叠搜索按钮 ━━ */
    .search-toggle-btn {
      width: 34px;
      height: 34px;
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-sm);
      background: var(--input-bg);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all var(--duration-fast);
      padding: 0;
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    /* 搜索按钮与操作按钮组之间加间距 */
    #searchToggleBtn { margin-right: 6px; }

    .search-toggle-btn:hover {
      border-color: var(--accent);
      background: var(--bg-hover);
    }

    /* 展开后的搜索框 */
    .search-expanded {
      display: flex;
      align-items: center;
      background: var(--search-bg);
      border: 1px solid var(--search-border);
      border-radius: var(--radius-sm);
      overflow: hidden;
      transition: border-color var(--duration-fast);
      max-width: 280px;
      flex: 1;
      position: relative;
    }

    .search-expanded:focus-within {
      border-color: var(--search-border-focus);
      box-shadow: 0 0 0 2px var(--accent-light);
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 0 8px 0 10px;
      font-size: 13px;
      font-family: var(--font-body);
      background: transparent;
      color: var(--input-text);
      height: 34px;
      min-width: 0;
    }

    .search-input::placeholder {
      color: var(--input-placeholder);
      font-weight: 400;
    }

    .search-input::-webkit-search-cancel-button {
      display: none;
      -webkit-appearance: none;
    }

    .search-close-btn {
      background: none;
      border: none;
      padding: 0 8px;
      color: var(--text-tertiary);
      cursor: pointer;
      font-size: 12px;
      height: 34px;
      display: flex;
      align-items: center;
    }

    .search-close-btn:hover { color: var(--danger); }

    /* header 内 + 小按钮（概念图风格：橙色小圆角） */
    .header-add-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: #F5A623;
      color: white;
      font-size: 18px;
      font-weight: 300;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--duration-fast);
      padding: 0;
      flex-shrink: 0;
      line-height: 1;
    }

    .header-add-btn:hover {
      background: #E09516;
      transform: translateY(-1px);
    }

    .header-add-btn:active { transform: scale(0.94); }

    .search-stats {
      margin-bottom: 8px;
      padding: 0 2px;
      font-size: 12px;
      color: var(--text-tertiary);
    }

    /* ━━ Filter Chips（概念图标签筛选） ━━ */
    .filter-chips {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 0 16px;
      flex-wrap: wrap;
    }

    .chip {
      padding: 5px 14px;
      border: 1px solid var(--border-primary);
      border-radius: 20px;
      background: transparent;
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 500;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all var(--duration-fast);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
    }

    .chip:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    .chip.active {
      background: var(--card-bg);
      color: var(--text-primary);
      border-color: var(--text-primary);
      font-weight: 600;
    }

    .chip-count {
      font-size: 11px;
      opacity: 0.8;
    }

    .chip-spacer { flex: 1; }

    /* ━━ 自定义排序下拉 ━━ */
    .sort-dropdown {
      position: relative;
      flex-shrink: 0;
    }

    .sort-trigger {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-sm);
      background: var(--input-bg);
      color: var(--text-secondary);
      font-size: 12px;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all var(--duration-fast);
      white-space: nowrap;
      line-height: 1.4;
    }

    .sort-trigger:hover { border-color: var(--accent); color: var(--text-primary); }
    .sort-dropdown.open .sort-trigger { border-color: var(--accent); color: var(--text-primary); }

    .sort-options {
      display: none;
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: var(--menu-bg);
      border: 1px solid var(--menu-border);
      border-radius: 10px;
      min-width: 120px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
      z-index: 1000;
      overflow: hidden;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 4px 0;
    }

    .sort-dropdown.open .sort-options { display: block; }

    .sort-option {
      padding: 7px 14px;
      font-size: 12px;
      font-family: var(--font-body);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--duration-fast);
      white-space: nowrap;
    }

    .sort-option:hover {
      background: var(--menu-item-hover);
      color: var(--text-primary);
    }

    .sort-option.active {
      color: var(--accent);
      font-weight: 600;
    }

    .content {
      flex: 1;
      padding: 0 0 20px;
    }

    /* ━━ 遮罩（模态框用） ━━ */
    .menu-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: transparent;
      opacity: 0; visibility: hidden;
      transition: all var(--duration-normal);
      z-index: 1;
    }
    .menu-overlay.show { opacity: 1; visibility: visible; }

    /* ━━ 浮动按钮组 ━━ */
    .back-to-top {
      position: fixed;
      bottom: 72px; right: 28px;
      width: 34px; height: 34px;
      background: var(--back-to-top-bg);
      border: 1px solid var(--back-to-top-border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-out);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
      z-index: 1000;
      opacity: 0; visibility: hidden;
      user-select: none;
      outline: none;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    .back-to-top:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .back-to-top.show { opacity: 1; visibility: visible; }
    .back-to-top:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); background: var(--back-to-top-hover); }
    .back-to-top:active { transform: scale(0.95); }

    .back-to-top-icon {
      font-size: 14px;
      font-weight: bold;
      line-height: 1;
      color: var(--back-to-top-text);
    }

    .theme-toggle-float {
      position: fixed;
      bottom: 28px; right: 28px;
      width: 34px; height: 34px;
      background: var(--theme-toggle-bg);
      border: 1px solid var(--theme-toggle-border);
      border-radius: var(--radius-sm);
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
      -webkit-tap-highlight-color: transparent;
    }

    .theme-toggle-float:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .back-to-top.show ~ .theme-toggle-float { bottom: 72px !important; }
    .theme-toggle-float:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); background: var(--theme-toggle-hover); }
    .theme-toggle-float:active { transform: scale(0.95); }

    .theme-toggle-float .theme-icon {
      font-size: 15px;
      transition: transform 0.3s;
    }

    .theme-toggle-float:hover .theme-icon { transform: rotate(15deg); }

    /* ━━ 空状态 ━━ */
    .empty-state {
      text-align: center;
      padding: 80px 20px 40px;
      color: var(--text-secondary);
    }

    .empty-state .icon {
      font-size: 44px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .empty-state p {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-tertiary);
      font-size: 13px;
    }

    /* ━━ 响应式 ━━ */
    @media (max-width: 768px) {
      .container { padding: 0 16px; }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        padding: 24px 0 16px;
        gap: 12px;
      }

      .page-title { font-size: 24px; }

      .header-actions {
        max-width: 100%;
        width: 100%;
      }

      .search-input-wrapper { max-width: none; }
    }

    @media (max-width: 480px) {
      .container { padding: 0 12px; }

      .page-header { padding: 16px 0 12px; }
      .page-title { font-size: 22px; }

      .search-icon { font-size: 12px; height: 32px; }
      .search-input { font-size: 13px; height: 32px; }
      .search-clear { height: 32px; }
      .sort-trigger { font-size: 11px; padding: 3px 8px; }


      .back-to-top, .theme-toggle-float {
        width: 32px; height: 32px; right: 12px; bottom: 16px;
      }
      .back-to-top.show ~ .theme-toggle-float { bottom: 56px !important; }
    }

    @media (max-width: 360px) {
      .page-title { font-size: 20px; }
      .back-to-top, .theme-toggle-float { width: 30px; height: 30px; right: 10px; }
    }
`;
}
