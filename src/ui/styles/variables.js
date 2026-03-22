/**
 * CSS 变量定义 v2 — 现代极简设计系统
 * 灵感来源: Linear, Vercel, Raycast
 */
export function getVariables() {
	return `
    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
      /* 过渡 */
      --theme-transition-duration: 0.25s;
      --theme-transition:
        background-color var(--theme-transition-duration) ease,
        color var(--theme-transition-duration) ease,
        border-color var(--theme-transition-duration) ease,
        box-shadow var(--theme-transition-duration) ease;

      /* ─── 浅色模式 ─── */

      --bg-primary: #fafafa;
      --bg-secondary: #f4f4f5;
      --bg-tertiary: #e4e4e7;
      --bg-elevated: #ffffff;
      --bg-overlay: rgba(0, 0, 0, 0.6);
      --bg-hover: rgba(0, 0, 0, 0.04);
      --bg-active: rgba(0, 0, 0, 0.06);
      --bg-disabled: #f4f4f5;

      --text-primary: #18181b;
      --text-secondary: #71717a;
      --text-tertiary: #a1a1aa;
      --text-disabled: #d4d4d8;
      --text-inverse: #fafafa;
      --text-link: #6366f1;
      --text-link-hover: #4f46e5;

      --border-primary: #e4e4e7;
      --border-secondary: #f4f4f5;
      --border-tertiary: #d4d4d8;
      --border-focus: #6366f1;
      --border-error: #ef4444;
      --border-success: #22c55e;

      --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.06);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.1);
      --shadow-xl: 0 24px 64px rgba(0,0,0,0.18);

      /* 品牌色 — Indigo 系 */
      --accent: #6366f1;
      --accent-hover: #4f46e5;
      --accent-light: rgba(99,102,241,0.08);
      --accent-border: rgba(99,102,241,0.25);

      /* 功能色 */
      --success: #22c55e;
      --success-light: rgba(34,197,94,0.1);
      --success-dark: #16a34a;
      --warning: #f59e0b;
      --warning-light: rgba(245,158,11,0.1);
      --danger: #ef4444;
      --danger-light: rgba(239,68,68,0.1);
      --danger-dark: #dc2626;
      --danger-darker: #b91c1c;
      --info: #0ea5e9;
      --info-light: rgba(14,165,233,0.1);
      --info-dark: #0284c7;

      /* 按钮 */
      --btn-primary-bg: #6366f1;
      --btn-primary-hover: #4f46e5;
      --btn-primary-text: #ffffff;
      --btn-secondary-bg: #e4e4e7;
      --btn-secondary-hover: #d4d4d8;
      --btn-secondary-text: #18181b;
      --btn-danger-bg: #ef4444;
      --btn-danger-hover: #dc2626;
      --btn-danger-text: #ffffff;
      --btn-info-bg: #0ea5e9;
      --btn-info-hover: #0284c7;
      --btn-info-text: #ffffff;

      /* 输入框 */
      --input-bg: #ffffff;
      --input-bg-focus: #ffffff;
      --input-border: #e4e4e7;
      --input-border-focus: #6366f1;
      --input-text: #18181b;
      --input-placeholder: #a1a1aa;

      /* 卡片 */
      --card-bg: #ffffff;
      --card-border: #e4e4e7;
      --card-shadow: 0 1px 3px rgba(0,0,0,0.04);
      --card-hover-border: #6366f1;
      --card-hover-shadow: 0 8px 24px rgba(99,102,241,0.1);

      /* 模态框 */
      --modal-bg: #ffffff;
      --modal-border: #e4e4e7;
      --modal-overlay: rgba(0,0,0,0.5);
      --modal-header-border: #f4f4f5;

      /* 进度条 */
      --progress-bg: #e4e4e7;
      --progress-fill: linear-gradient(90deg, #6366f1, #a78bfa);

      /* 滚动条 */
      --scrollbar-track: transparent;
      --scrollbar-thumb: #d4d4d8;
      --scrollbar-thumb-hover: #a1a1aa;

      /* OTP */
      --otp-text: #18181b;
      --otp-next-bg: rgba(0,0,0,0.03);
      --otp-next-bg-hover: rgba(0,0,0,0.06);
      --otp-next-text: #71717a;

      /* 搜索 */
      --search-bg: #ffffff;
      --search-border: #e4e4e7;
      --search-border-focus: #6366f1;
      --search-icon: #a1a1aa;

      /* 菜单 */
      --menu-bg: #ffffff;
      --menu-border: #e4e4e7;
      --menu-item-hover: rgba(0,0,0,0.04);
      --menu-shadow: 0 8px 30px rgba(0,0,0,0.12);

      /* 导入 */
      --import-instructions-bg: linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%);
      --import-instructions-border: #e4e4e7;
      --import-method-bg: #ffffff;
      --import-method-border: #e4e4e7;
      --import-method-hover-border: #6366f1;
      --import-example-bg: #fffbeb;
      --import-example-text: #92400e;
      --import-example-border: #fde68a;
      --import-file-bg: linear-gradient(135deg, #fafafa 0%, #eef2ff 100%);
      --import-file-border: #6366f1;

      /* 还原 */
      --restore-instructions-bg: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      --restore-instructions-border: #f59e0b;
      --restore-warning-bg: rgba(255,255,255,0.8);
      --restore-warning-text: #c2410c;
      --restore-warning-border: rgba(194,65,12,0.2);

      /* 备份 */
      --backup-header-bg: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      --backup-header-border: #6366f1;
      --backup-header-text: #4f46e5;
      --backup-select-bg: #ffffff;
      --backup-select-border: #e0e7ff;

      /* 表格 */
      --table-bg: #ffffff;
      --table-header-bg: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      --table-header-text: #ffffff;
      --table-header-border: #4f46e5;
      --table-border: #f4f4f5;
      --table-row-hover: linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%);

      /* 工具 */
      --tool-bg: #ffffff;
      --tool-border: #f4f4f5;
      --tool-hover-bg: rgba(99,102,241,0.04);
      --tool-icon-bg: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      --tool-icon-border: #c7d2fe;

      /* Toast */
      --toast-bg: #18181b;
      --toast-text: #fafafa;
      --toast-border: rgba(255,255,255,0.1);

      /* Footer */
      --footer-bg: transparent;
      --footer-border: #f4f4f5;
      --footer-text: #a1a1aa;
      --footer-link: #71717a;
      --footer-link-hover: #6366f1;

      /* FAB */
      --float-btn-bg: #6366f1;
      --float-btn-hover: #4f46e5;
      --float-btn-text: #ffffff;
      --float-btn-shadow: 0 8px 24px rgba(99,102,241,0.35);

      /* 主题切换 */
      --theme-toggle-bg: #ffffff;
      --theme-toggle-hover: #f4f4f5;
      --theme-toggle-border: #e4e4e7;

      /* 回顶部 */
      --back-to-top-bg: #ffffff;
      --back-to-top-hover: #f4f4f5;
      --back-to-top-border: #e4e4e7;
      --back-to-top-text: #18181b;

      /* 品牌色阶（兼容旧代码） */
      --primary-50: #eef2ff;
      --primary-100: #e0e7ff;
      --primary-500: #6366f1;
    }

    /* ─── 深色模式 ─── */
    [data-theme="dark"] {
      --bg-primary: #09090b;
      --bg-secondary: #18181b;
      --bg-tertiary: #27272a;
      --bg-elevated: #18181b;
      --bg-overlay: rgba(0,0,0,0.7);
      --bg-hover: rgba(255,255,255,0.06);
      --bg-active: rgba(255,255,255,0.1);
      --bg-disabled: #27272a;

      --text-primary: #fafafa;
      --text-secondary: #a1a1aa;
      --text-tertiary: #71717a;
      --text-disabled: #52525b;
      --text-inverse: #18181b;
      --text-link: #818cf8;
      --text-link-hover: #a78bfa;

      --border-primary: #27272a;
      --border-secondary: #18181b;
      --border-tertiary: #3f3f46;
      --border-focus: #818cf8;
      --border-error: #f87171;
      --border-success: #4ade80;

      --shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.5);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);
      --shadow-xl: 0 24px 64px rgba(0,0,0,0.7);

      --accent: #818cf8;
      --accent-hover: #a78bfa;
      --accent-light: rgba(129,140,248,0.1);
      --accent-border: rgba(129,140,248,0.3);

      --success-light: rgba(34,197,94,0.12);
      --warning-light: rgba(245,158,11,0.12);
      --danger-light: rgba(239,68,68,0.12);
      --info-light: rgba(14,165,233,0.12);

      --btn-primary-bg: #6366f1;
      --btn-primary-hover: #818cf8;
      --btn-secondary-bg: #27272a;
      --btn-secondary-hover: #3f3f46;
      --btn-secondary-text: #fafafa;
      --btn-danger-bg: #ef4444;
      --btn-danger-hover: #f87171;
      --btn-info-bg: #0ea5e9;
      --btn-info-hover: #38bdf8;

      --input-bg: #18181b;
      --input-bg-focus: #27272a;
      --input-border: #3f3f46;
      --input-border-focus: #818cf8;
      --input-text: #fafafa;
      --input-placeholder: #52525b;

      --card-bg: #18181b;
      --card-border: #27272a;
      --card-shadow: 0 1px 3px rgba(0,0,0,0.3);
      --card-hover-border: #818cf8;
      --card-hover-shadow: 0 8px 24px rgba(129,140,248,0.12);

      --modal-bg: #18181b;
      --modal-border: #27272a;
      --modal-overlay: rgba(0,0,0,0.75);
      --modal-header-border: #27272a;

      --progress-bg: #27272a;

      --scrollbar-thumb: #3f3f46;
      --scrollbar-thumb-hover: #52525b;

      --otp-text: #fafafa;
      --otp-next-bg: rgba(255,255,255,0.04);
      --otp-next-bg-hover: rgba(255,255,255,0.08);
      --otp-next-text: #a1a1aa;

      --search-bg: #18181b;
      --search-border: #27272a;
      --search-border-focus: #818cf8;
      --search-icon: #52525b;

      --menu-bg: #18181b;
      --menu-border: #27272a;
      --menu-item-hover: rgba(255,255,255,0.06);
      --menu-shadow: 0 8px 30px rgba(0,0,0,0.5);

      --import-instructions-bg: linear-gradient(135deg, #18181b 0%, #27272a 100%);
      --import-instructions-border: #3f3f46;
      --import-method-bg: #18181b;
      --import-method-border: #3f3f46;
      --import-method-hover-border: #818cf8;
      --import-example-bg: rgba(245,158,11,0.1);
      --import-example-text: #fcd34d;
      --import-example-border: rgba(245,158,11,0.3);
      --import-file-bg: linear-gradient(135deg, #18181b 0%, rgba(99,102,241,0.08) 100%);
      --import-file-border: #818cf8;

      --restore-instructions-bg: linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.04) 100%);
      --restore-instructions-border: #f59e0b;
      --restore-warning-bg: rgba(0,0,0,0.3);
      --restore-warning-text: #fbbf24;
      --restore-warning-border: rgba(245,158,11,0.3);

      --backup-header-bg: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(129,140,248,0.05) 100%);
      --backup-header-border: #818cf8;
      --backup-header-text: #a5b4fc;
      --backup-select-bg: #18181b;
      --backup-select-border: rgba(99,102,241,0.2);

      --table-bg: #18181b;
      --table-header-bg: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      --table-border: #27272a;
      --table-row-hover: linear-gradient(135deg, #27272a 0%, #3f3f46 100%);

      --tool-bg: #18181b;
      --tool-border: #27272a;
      --tool-hover-bg: rgba(129,140,248,0.06);
      --tool-icon-bg: linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(129,140,248,0.06) 100%);
      --tool-icon-border: rgba(129,140,248,0.2);

      --toast-bg: rgba(250,250,250,0.95);
      --toast-text: #18181b;
      --toast-border: rgba(0,0,0,0.1);

      --footer-border: #27272a;
      --footer-text: #52525b;
      --footer-link: #71717a;
      --footer-link-hover: #818cf8;

      --float-btn-bg: #6366f1;
      --float-btn-hover: #818cf8;
      --float-btn-shadow: 0 8px 24px rgba(99,102,241,0.4);

      --theme-toggle-bg: #18181b;
      --theme-toggle-hover: #27272a;
      --theme-toggle-border: #3f3f46;

      --back-to-top-bg: #18181b;
      --back-to-top-hover: #27272a;
      --back-to-top-border: #3f3f46;
      --back-to-top-text: #fafafa;

      --primary-50: rgba(99,102,241,0.1);
      --primary-100: rgba(99,102,241,0.15);
      --primary-500: #818cf8;
    }

    /* 系统偏好回退 */
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        --bg-primary: #09090b;
        --bg-secondary: #18181b;
        --bg-tertiary: #27272a;
        --bg-elevated: #18181b;
        --bg-hover: rgba(255,255,255,0.06);
        --text-primary: #fafafa;
        --text-secondary: #a1a1aa;
        --text-tertiary: #71717a;
        --border-primary: #27272a;
        --border-secondary: #18181b;
        --card-bg: #18181b;
        --card-border: #27272a;
        --input-bg: #18181b;
        --input-border: #3f3f46;
        --input-text: #fafafa;
        --modal-bg: #18181b;
        --modal-border: #27272a;
      }
    }

    /* 主题过渡 */
    html.theme-transition,
    html.theme-transition *,
    html.theme-transition *::before,
    html.theme-transition *::after {
      transition: var(--theme-transition) !important;
      transition-delay: 0s !important;
    }

    body, .card, .secret-card, .modal, .modal-content,
    input, select, textarea, button,
    .search-container, .header, .footer {
      transition: var(--theme-transition);
    }

    @media (prefers-reduced-motion: reduce) {
      html.theme-transition,
      html.theme-transition *,
      html.theme-transition *::before,
      html.theme-transition *::after {
        transition: none !important;
      }
    }
  `;
}
