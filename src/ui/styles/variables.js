/**
 * CSS 变量定义 v4 — Material Design 3 (M3)
 * 设计语言: 圆润、直觉、Tonal Palette
 * 参考: Google Material Design 3
 */
export function getVariables() {
	return `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

    :root {
      /* ── 字体 (M3 推荐 Roboto) ── */
      --font-body: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      --font-mono: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;

      /* ── 动画 (M3 Easing) ── */
      --ease-out: cubic-bezier(0.2, 0, 0, 1);
      --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
      --duration-fast: 0.15s;
      --duration-normal: 0.25s;
      --duration-slow: 0.4s;

      --theme-transition-duration: 0.3s;
      --theme-transition:
        background-color var(--theme-transition-duration) var(--ease-in-out),
        color var(--theme-transition-duration) var(--ease-in-out),
        border-color var(--theme-transition-duration) var(--ease-in-out),
        box-shadow var(--theme-transition-duration) var(--ease-in-out);

      /* ── 圆角体系 (M3 标志性的高圆角) ── */
      --radius-sm: 8px;
      --radius-md: 16px;
      --radius-lg: 24px;
      --radius-xl: 32px;

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         浅色模式 — M3 Light Theme (Baseline Purple)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

      --bg-primary: #FEF7FF; /* Surface */
      --bg-primary-grad: none;
      --bg-secondary: #F3EDF7; /* Surface Container */
      --bg-tertiary: #ECE6F0; /* Surface Container High */
      --bg-elevated: #F7F2FA; /* Surface Container Low */
      --bg-overlay: rgba(0, 0, 0, 0.4);
      --bg-hover: rgba(103, 80, 164, 0.08); /* Primary hover */
      --bg-active: rgba(103, 80, 164, 0.12);
      --bg-disabled: #E6E0E9; /* On Surface variant at 12% opacity approx */

      --glass-blur: none;
      --glass-blur-heavy: none;

      --text-primary: #1D1B20; /* On Surface */
      --text-secondary: #49454F; /* On Surface Variant */
      --text-tertiary: #79747E; /* Outline */
      --text-disabled: #1D1B2060;
      --text-inverse: #FFFFFF; /* On Primary */
      --text-link: #6750A4; /* Primary */
      --text-link-hover: #4F378B;

      --border-primary: #CAC4D0; /* Outline Variant */
      --border-secondary: #E8DEF8;
      --border-tertiary: #79747E; /* Outline */
      --border-focus: #6750A4; /* Primary */
      --border-error: #B3261E; /* Error */
      --border-success: #146C2E;

      /* M3 Elevation 阴影体系 */
      --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15); /* Level 1 */
      --shadow-md: 0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15); /* Level 2 */
      --shadow-lg: 0 1px 3px 0 rgba(0,0,0,0.3), 0 4px 8px 3px rgba(0,0,0,0.15); /* Level 3 */
      --shadow-xl: 0 2px 3px 0 rgba(0,0,0,0.3), 0 6px 10px 4px rgba(0,0,0,0.15); /* Level 4 */

      /* 品牌强调色 (M3 Primary) */
      --accent: #6750A4;
      --accent-hover: #EADDFF; /* Primary Container */
      --accent-light: #EADDFF; /* Primary Container */
      --accent-border: transparent; /* M3 tend to use tonal backgrounds instead of borders */

      /* 功能状态色 */
      --success: #146C2E;
      --success-light: #C4EECF;
      --success-dark: #0F5223;
      --warning: #B3261E; /* M3 uses Error for danger/warning */
      --warning-light: #F9DEDC;
      --danger: #B3261E;
      --danger-light: #F9DEDC;
      --danger-dark: #8C1D18;
      --info: #0061A4;
      --info-light: #D1E4FF;

      /* 按钮 (M3 Filled / Tonal Buttons) */
      --btn-primary-bg: #6750A4;
      --btn-primary-hover: #4F378B;
      --btn-primary-text: #FFFFFF;
      --btn-secondary-bg: #EADDFF; /* Secondary Container */
      --btn-secondary-hover: #D0BCFF;
      --btn-secondary-text: #21005D; /* On Secondary Container */
      --btn-danger-bg: #B3261E;
      --btn-danger-hover: #8C1D18;
      --btn-danger-text: #FFFFFF;

      /* 输入框 */
      --input-bg: #F3EDF7; /* Surface Container */
      --input-bg-focus: #FEF7FF; /* Surface */
      --input-border: #79747E; /* Outline */
      --input-border-focus: #6750A4;
      --input-text: #1D1B20;
      --input-placeholder: #49454F; /* Variant */

      /* 卡片 (M3 Elevated/Filled Cards) */
      --card-bg: #F3EDF7; /* Surface Container */
      --card-border: transparent;
      --card-shadow: none; /* MD3 cards are either outlined or filled (no shadow) */
      --card-hover-border: #CAC4D0;
      --card-hover-shadow: var(--shadow-sm); /* Elevated slightly on hover */

      /* 模态框 (M3 Dialogs) */
      --modal-bg: #ECE6F0; /* Surface Container High */
      --modal-border: transparent;
      --modal-overlay: rgba(0, 0, 0, 0.4);
      --modal-header-border: #CAC4D0;

      /* 进度条 */
      --progress-bg: #EADDFF; /* Primary Container */
      --progress-fill: #6750A4;
      --progress-fill-warn: #F2B8B5; /* Custom error tonal */
      --progress-fill-danger: #B3261E;

      /* 滚动条 */
      --scrollbar-track: transparent;
      --scrollbar-thumb: #CAC4D0;
      --scrollbar-thumb-hover: #79747E;

      /* OTP */
      --otp-text: #1D1B20;
      --otp-next-bg: #E8DEF8;
      --otp-next-bg-hover: #D0BCFF;
      --otp-next-text: #4A4458;

      /* 搜索 */
      --search-bg: #F3EDF7;
      --search-border: transparent;
      --search-border-focus: #6750A4;
      --search-icon: #49454F;

      /* 菜单 */
      --menu-bg: #F3EDF7;
      --menu-border: transparent;
      --menu-item-hover: rgba(103, 80, 164, 0.08);
      --menu-shadow: var(--shadow-md);

      /* 浮动按钮 (M3 FAB) */
      --float-btn-bg: #EADDFF; /* Primary Container */
      --float-btn-hover: #D0BCFF;
      --float-btn-shadow: var(--shadow-lg); /* FAB Uses Level 3 */
      --float-btn-text: #21005D; /* On Primary Container */
      --theme-toggle-bg: #F3EDF7;
      --theme-toggle-hover: #E8DEF8;
      --theme-toggle-border: transparent;
      --back-to-top-bg: #F3EDF7;
      --back-to-top-hover: #E8DEF8;
      --back-to-top-border: transparent;
      --back-to-top-text: #1D1B20;

      /* Footer */
      --footer-border: #CAC4D0;
      --footer-text: #79747E;
      --footer-link: #49454F;
      --footer-link-hover: #6750A4;

      /* 兼容旧代码引用 */
      --primary: #6750A4;
      --brand: #6750A4;
      --border: #CAC4D0;
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       深色模式 — M3 Dark Theme (Baseline Purple)
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    [data-theme="dark"] {
      --bg-primary: #141218; /* Surface */
      --bg-primary-grad: none;
      --bg-secondary: #211F26; /* Surface Container */
      --bg-tertiary: #2B2930; /* Surface Container High */
      --bg-elevated: #1D1B20; /* Surface Container Low */
      --bg-overlay: rgba(0, 0, 0, 0.6);
      --bg-hover: rgba(208, 188, 255, 0.08); /* Primary hover */
      --bg-active: rgba(208, 188, 255, 0.12);
      --bg-disabled: #36343B; /* On Surface variant at 12% opacity approx */

      --glass-blur: none;
      --glass-blur-heavy: none;

      --text-primary: #E6E0E9; /* On Surface */
      --text-secondary: #CAC4D0; /* On Surface Variant */
      --text-tertiary: #938F99; /* Outline */
      --text-disabled: rgba(230, 224, 233, 0.38);
      --text-inverse: #381E72; /* On Primary */
      --text-link: #D0BCFF; /* Primary */
      --text-link-hover: #EADDFF;

      --border-primary: #49454F; /* Outline Variant */
      --border-secondary: #332D41;
      --border-tertiary: #938F99; /* Outline */
      --border-focus: #D0BCFF; /* Primary */
      --border-error: #F2B8B5; /* Error */
      --border-success: #81C995;

      --shadow-sm: 0 1px 2px 0 rgba(0,0,0,0.6), 0 1px 3px 1px rgba(0,0,0,0.3);
      --shadow-md: 0 1px 2px 0 rgba(0,0,0,0.6), 0 2px 6px 2px rgba(0,0,0,0.3);
      --shadow-lg: 0 1px 3px 0 rgba(0,0,0,0.6), 0 4px 8px 3px rgba(0,0,0,0.3);
      --shadow-xl: 0 2px 3px 0 rgba(0,0,0,0.6), 0 6px 10px 4px rgba(0,0,0,0.3);

      --accent: #D0BCFF; /* Primary */
      --accent-hover: #4F378B; /* Primary Container */
      --accent-light: #4F378B; /* Primary Container */
      --accent-border: transparent;

      --success-light: #1E3A29;
      --warning-light: #410E0B;
      --danger-light: #410E0B;
      --info-light: #003258;

      --btn-primary-bg: #D0BCFF;
      --btn-primary-hover: #EADDFF;
      --btn-primary-text: #381E72;
      --btn-secondary-bg: #4A4458; /* Secondary Container */
      --btn-secondary-hover: #E8DEF8;
      --btn-secondary-text: #E8DEF8; /* On Secondary Container */
      --btn-danger-bg: #F2B8B5;
      --btn-danger-hover: #F9DEDC;
      --btn-danger-text: #410E0B;

      --input-bg: #211F26; /* Surface Container */
      --input-bg-focus: #141218; /* Surface */
      --input-border: #938F99; /* Outline */
      --input-border-focus: #D0BCFF; /* Primary */
      --input-text: #E6E0E9;
      --input-placeholder: #CAC4D0; /* Variant */

      --card-bg: #211F26; /* Surface Container */
      --card-border: transparent;
      --card-shadow: none;
      --card-hover-border: #49454F;
      --card-hover-shadow: var(--shadow-sm); /* Elevated slight */

      --modal-bg: #2B2930; /* Surface Container High */
      --modal-border: transparent;
      --modal-overlay: rgba(0, 0, 0, 0.6);
      --modal-header-border: #49454F;

      --progress-bg: #4F378B; /* Primary Container */
      --progress-fill: #D0BCFF;
      --progress-fill-warn: #410E0B;
      --progress-fill-danger: #F2B8B5;

      --scrollbar-thumb: #49454F;
      --scrollbar-thumb-hover: #938F99;

      --otp-text: #E6E0E9;
      --otp-next-bg: #332D41;
      --otp-next-bg-hover: #4A4458;
      --otp-next-text: #CAC4D0;

      --search-bg: #211F26;
      --search-border: transparent;
      --search-border-focus: #D0BCFF; /* Primary */
      --search-icon: #CAC4D0;

      --menu-bg: #211F26;
      --menu-border: transparent;
      --menu-item-hover: rgba(208, 188, 255, 0.08); /* Primary at 8% */
      --menu-shadow: var(--shadow-md);

      --float-btn-bg: #4F378B; /* Primary Container */
      --float-btn-hover: #EADDFF;
      --float-btn-shadow: var(--shadow-lg);
      --float-btn-text: #EADDFF; /* On Primary Container (Fallback) */
      --theme-toggle-bg: #211F26;
      --theme-toggle-hover: #2B2930;
      --theme-toggle-border: transparent;
      --back-to-top-bg: #211F26;
      --back-to-top-hover: #2B2930;
      --back-to-top-border: transparent;
      --back-to-top-text: #E6E0E9;

      --footer-border: #49454F;
      --footer-text: #938F99;
      --footer-link: #CAC4D0;
      --footer-link-hover: #D0BCFF;

      --primary: #D0BCFF;
      --brand: #D0BCFF;
      --border: #49454F;
    }

    /* 系统偏好回退 */
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        /* 此处省略完整复制，因前端脚本中优先应用属性 */
        --bg-primary: #141218;
        --bg-secondary: #211F26;
        --bg-tertiary: #2B2930;
        --bg-elevated: #1D1B20;
        --bg-hover: rgba(208, 188, 255, 0.08);
        --text-primary: #E6E0E9;
        --text-secondary: #CAC4D0;
        --text-tertiary: #938F99;
        --border-primary: #49454F;
        --card-bg: #211F26;
        --card-border: transparent;
        --input-bg: #211F26;
        --input-border: #938F99;
        --input-text: #E6E0E9;
        --modal-bg: #2B2930;
        --modal-border: transparent;
        --accent: #D0BCFF;
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
