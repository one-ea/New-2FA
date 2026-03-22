/**
 * CSS 变量定义 v2 — 现代极简设计系统
 * 灵感来源: Linear, Vercel, Raycast
 */
export function getVariables() {
	return `
    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
      /* 字体组合 */
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-mono: "JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace;

      /* 过渡效果 - 更加柔和舒缓 */
      --theme-transition-duration: 0.3s;
      --theme-transition:
        background-color var(--theme-transition-duration) cubic-bezier(0.25, 0.1, 0.25, 1),
        color var(--theme-transition-duration) cubic-bezier(0.25, 0.1, 0.25, 1),
        border-color var(--theme-transition-duration) cubic-bezier(0.25, 0.1, 0.25, 1),
        box-shadow var(--theme-transition-duration) cubic-bezier(0.25, 0.1, 0.25, 1);

      /* ─── 浅色模式 (Minimalist Light) ─── */
      
      --bg-primary: #F5F5F7;     /* Apple 系浅灰背景 */
      --bg-secondary: #FFFFFF;   /* 纯白卡片 */
      --bg-tertiary: #E5E5EA;    
      --bg-elevated: #FFFFFF;
      --bg-overlay: rgba(0, 0, 0, 0.25);
      --bg-hover: rgba(0, 0, 0, 0.04);
      --bg-active: rgba(0, 0, 0, 0.08);
      --bg-disabled: #F2F2F7;

      --text-primary: #1D1D1F;   /* 深空灰文本 */
      --text-secondary: #86868B;
      --text-tertiary: #A1A1A6;
      --text-disabled: #D1D1D6;
      --text-inverse: #FFFFFF;
      --text-link: #0066CC;
      --text-link-hover: #0071E3;

      /* 极致微弱的边框，体现无界感 */
      --border-primary: rgba(0, 0, 0, 0.06);
      --border-secondary: rgba(0, 0, 0, 0.04);
      --border-tertiary: rgba(0, 0, 0, 0.08);
      --border-focus: #1D1D1F;
      --border-error: #FF3B30;
      --border-success: #34C759;

      /* 扩散型柔和阴影 */
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.02);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.04);
      --shadow-lg: 0 12px 32px rgba(0,0,0,0.06);
      --shadow-xl: 0 24px 64px rgba(0,0,0,0.08);

      /* 品牌色 — 克制的暗色 */
      --accent: #1D1D1F;
      --accent-hover: #000000;
      --accent-light: rgba(0,0,0,0.03);
      --accent-border: rgba(0,0,0,0.08);

      /* 功能色 (遵循 iOS 规范) */
      --success: #34C759;
      --success-light: rgba(52, 199, 89, 0.1);
      --success-dark: #248A3D;
      --warning: #FF9500;
      --warning-light: rgba(255, 149, 0, 0.1);
      --danger: #FF3B30;
      --danger-light: rgba(255, 59, 48, 0.1);
      --danger-dark: #C93400;
      --info: #007AFF;
      --info-light: rgba(0, 122, 255, 0.1);

      /* 按钮 */
      --btn-primary-bg: #1D1D1F;
      --btn-primary-hover: #333336;
      --btn-primary-text: #FFFFFF;
      --btn-secondary-bg: #F5F5F7;
      --btn-secondary-hover: #E5E5EA;
      --btn-secondary-text: #1D1D1F;
      --btn-danger-bg: #FF3B30;
      --btn-danger-hover: #D70015;
      --btn-danger-text: #FFFFFF;

      /* 输入框 */
      --input-bg: #FFFFFF;
      --input-bg-focus: #FFFFFF;
      --input-border: rgba(0,0,0,0.1);
      --input-border-focus: #1D1D1F;
      --input-text: #1D1D1F;
      --input-placeholder: #86868B;

      /* 卡片 */
      --card-bg: #FFFFFF;
      --card-border: rgba(0,0,0,0.04);
      --card-shadow: 0 2px 12px rgba(0,0,0,0.03), 0 0 1px rgba(0,0,0,0.02);
      --card-hover-border: rgba(0,0,0,0.08);
      --card-hover-shadow: 0 8px 32px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04);

      /* 模态框 */
      --modal-bg: #FFFFFF;
      --modal-border: rgba(0,0,0,0.05);
      --modal-overlay: rgba(0,0,0,0.3);
      --modal-header-border: rgba(0,0,0,0.05);

      /* 进度条 - 极细极简 */
      --progress-bg: #F5F5F7;
      --progress-fill: #1D1D1F;

      /* 滚动条 */
      --scrollbar-track: transparent;
      --scrollbar-thumb: #D1D1D6;
      --scrollbar-thumb-hover: #A1A1A6;

      /* OTP 动态内容 */
      --otp-text: #1D1D1F;
      --otp-next-bg: #F5F5F7;
      --otp-next-bg-hover: #E5E5EA;
      --otp-next-text: #86868B;

      /* 其他组件继承体系 */
      --search-bg: #FFFFFF;
      --search-border: rgba(0,0,0,0.06);
      --search-border-focus: #1D1D1F;
      --search-icon: #86868B;

      --menu-bg: #FFFFFF;
      --menu-border: rgba(0,0,0,0.06);
      --menu-item-hover: rgba(0,0,0,0.03);
      --menu-shadow: 0 12px 40px rgba(0,0,0,0.08);

      --theme-toggle-bg: #FFFFFF;
      --theme-toggle-hover: #F5F5F7;
      --theme-toggle-border: rgba(0,0,0,0.06);
      --back-to-top-bg: #FFFFFF;
      --back-to-top-hover: #F5F5F7;
      --back-to-top-border: rgba(0,0,0,0.06);
      --back-to-top-text: #1D1D1F;
      
      --float-btn-bg: #1D1D1F;
      --float-btn-hover: #333336;
      --float-btn-shadow: 0 8px 24px rgba(0,0,0,0.15);
      --float-btn-text: #FFFFFF;
    }

    /* ─── 深色模式 (Minimalist Dark) ─── */
    [data-theme="dark"] {
      --bg-primary: #000000;     /* Apple OLED 纯黑 */
      --bg-secondary: #1C1C1E;   /* 卡片深空灰 */
      --bg-tertiary: #2C2C2E;
      --bg-elevated: #1C1C1E;
      --bg-overlay: rgba(0,0,0,0.6);
      --bg-hover: rgba(255,255,255,0.06);
      --bg-active: rgba(255,255,255,0.1);
      --bg-disabled: #2C2C2E;

      --text-primary: #F5F5F7;
      --text-secondary: #86868B;
      --text-tertiary: #636366;
      --text-disabled: #AEAEC0;
      --text-inverse: #1D1D1F;
      --text-link: #2997FF;
      --text-link-hover: #70C5CE;

      --border-primary: rgba(255, 255, 255, 0.08); /* 深色下极微弱白线 */
      --border-secondary: rgba(255, 255, 255, 0.04);
      --border-tertiary: rgba(255, 255, 255, 0.1);
      --border-focus: #F5F5F7;
      --border-error: #FF453A;
      --border-success: #32D74B;

      --shadow-sm: 0 1px 3px rgba(0,0,0,0.6);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.8);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.9);
      --shadow-xl: 0 24px 64px rgba(0,0,0,0.95);

      --accent: #F5F5F7;
      --accent-hover: #FFFFFF;
      --accent-light: rgba(255,255,255,0.06);
      --accent-border: rgba(255,255,255,0.1);

      --success-light: rgba(50, 215, 75, 0.15);
      --warning-light: rgba(255, 159, 10, 0.15);
      --danger-light: rgba(255, 69, 58, 0.15);
      --info-light: rgba(10, 132, 255, 0.15);

      --btn-primary-bg: #F5F5F7;
      --btn-primary-hover: #FFFFFF;
      --btn-primary-text: #1D1D1F;
      --btn-secondary-bg: #2C2C2E;
      --btn-secondary-hover: #3A3A3C;
      --btn-secondary-text: #F5F5F7;
      --btn-danger-bg: #FF453A;
      --btn-danger-hover: #FF6961;

      --input-bg: #1C1C1E;
      --input-bg-focus: #1C1C1E;
      --input-border: rgba(255,255,255,0.1);
      --input-border-focus: #F5F5F7;
      --input-text: #F5F5F7;
      --input-placeholder: #86868B;

      --card-bg: #1C1C1E;
      --card-border: rgba(255,255,255,0.06);
      --card-shadow: 0 2px 12px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.02);
      --card-hover-border: rgba(255,255,255,0.15);
      --card-hover-shadow: 0 8px 32px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.05);

      --modal-bg: #1C1C1E;
      --modal-border: rgba(255,255,255,0.08);
      --modal-overlay: rgba(0,0,0,0.6);
      --modal-header-border: rgba(255,255,255,0.05);

      --progress-bg: #2C2C2E;
      --progress-fill: #F5F5F7;

      --scrollbar-thumb: #3A3A3C;
      --scrollbar-thumb-hover: #48484A;

      --otp-text: #F5F5F7;
      --otp-next-bg: rgba(255,255,255,0.05);
      --otp-next-bg-hover: rgba(255,255,255,0.08);
      --otp-next-text: #86868B;

      --search-bg: #1C1C1E;
      --search-border: rgba(255,255,255,0.08);
      --search-border-focus: #F5F5F7;
      --search-icon: #86868B;

      --menu-bg: #1C1C1E;
      --menu-border: rgba(255,255,255,0.08);
      --menu-item-hover: rgba(255,255,255,0.06);
      --menu-shadow: 0 12px 40px rgba(0,0,0,0.8);

      --theme-toggle-bg: #1C1C1E;
      --theme-toggle-hover: #2C2C2E;
      --theme-toggle-border: rgba(255,255,255,0.08);
      --back-to-top-bg: #1C1C1E;
      --back-to-top-hover: #2C2C2E;
      --back-to-top-border: rgba(255,255,255,0.08);
      --back-to-top-text: #F5F5F7;
      
      --float-btn-bg: #F5F5F7;
      --float-btn-hover: #FFFFFF;
      --float-btn-shadow: 0 8px 24px rgba(255,255,255,0.15);
      --float-btn-text: #1D1D1F;
    }

    /* 系统偏好回退 */
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        --bg-primary: #000000;
        --bg-secondary: #1C1C1E;
        --bg-tertiary: #2C2C2E;
        --bg-elevated: #1C1C1E;
        --bg-hover: rgba(255,255,255,0.06);
        --text-primary: #F5F5F7;
        --text-secondary: #86868B;
        --text-tertiary: #636366;
        --border-primary: rgba(255,255,255,0.08);
        --border-secondary: rgba(255,255,255,0.04);
        --card-bg: #1C1C1E;
        --card-border: rgba(255,255,255,0.06);
        --input-bg: #1C1C1E;
        --input-border: rgba(255,255,255,0.1);
        --input-text: #F5F5F7;
        --modal-bg: #1C1C1E;
        --modal-border: rgba(255,255,255,0.08);
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
