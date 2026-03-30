/**
 * CSS 变量定义 v3 — 设计系统
 * 设计语言: 克制、精致、专业
 * 参考: Linear, Raycast, Apple HIG
 */
export function getVariables() {
	return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
      /* ── 字体 ── */
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-mono: "JetBrains Mono", "SF Mono", Menlo, Monaco, Consolas, monospace;

      /* ── 动画 ── */
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
      --duration-fast: 0.15s;
      --duration-normal: 0.25s;
      --duration-slow: 0.4s;

      --theme-transition-duration: 0.3s;
      --theme-transition:
        background-color var(--theme-transition-duration) var(--ease-in-out),
        color var(--theme-transition-duration) var(--ease-in-out),
        border-color var(--theme-transition-duration) var(--ease-in-out),
        box-shadow var(--theme-transition-duration) var(--ease-in-out);

      /* ── 圆角体系 ── */
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 20px;

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         浅色模式 — 柔和、沉静
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

      --bg-primary: #F8F8FA;
      --bg-secondary: #FFFFFF;
      --bg-tertiary: #F0F0F5;
      --bg-elevated: #FFFFFF;
      --bg-overlay: rgba(0, 0, 0, 0.4);
      --bg-hover: rgba(0, 0, 0, 0.03);
      --bg-active: rgba(0, 0, 0, 0.06);
      --bg-disabled: #F5F5F7;

      --text-primary: #1A1A2E;
      --text-secondary: #6E6E80;
      --text-tertiary: #9E9EB0;
      --text-disabled: #C5C5D0;
      --text-inverse: #FFFFFF;
      --text-link: #4F6EF7;
      --text-link-hover: #3B5AE0;

      --border-primary: rgba(0, 0, 0, 0.08);
      --border-secondary: rgba(0, 0, 0, 0.05);
      --border-tertiary: rgba(0, 0, 0, 0.12);
      --border-focus: #4F6EF7;
      --border-error: #E5484D;
      --border-success: #30A46C;

      --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
      --shadow-md: 0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04);
      --shadow-lg: 0 8px 30px rgba(0,0,0,0.08);
      --shadow-xl: 0 20px 60px rgba(0,0,0,0.12);

      /* 品牌色 — 克制的蓝紫 */
      --accent: #4F6EF7;
      --accent-hover: #3B5AE0;
      --accent-light: rgba(79,110,247,0.08);
      --accent-border: rgba(79,110,247,0.2);

      /* 功能色 */
      --success: #30A46C;
      --success-light: rgba(48,164,108,0.1);
      --success-dark: #18794E;
      --warning: #F5A623;
      --warning-light: rgba(245,166,35,0.1);
      --danger: #E5484D;
      --danger-light: rgba(229,72,77,0.08);
      --danger-dark: #CD2B31;
      --info: #3E63DD;
      --info-light: rgba(62,99,221,0.1);

      /* 按钮 */
      --btn-primary-bg: #1A1A2E;
      --btn-primary-hover: #2D2D44;
      --btn-primary-text: #FFFFFF;
      --btn-secondary-bg: #F0F0F5;
      --btn-secondary-hover: #E5E5EC;
      --btn-secondary-text: #1A1A2E;
      --btn-danger-bg: #E5484D;
      --btn-danger-hover: #CD2B31;
      --btn-danger-text: #FFFFFF;

      /* 输入框 */
      --input-bg: #FFFFFF;
      --input-bg-focus: #FFFFFF;
      --input-border: rgba(0,0,0,0.12);
      --input-border-focus: #4F6EF7;
      --input-text: #1A1A2E;
      --input-placeholder: #9E9EB0;

      /* 卡片 */
      --card-bg: #FFFFFF;
      --card-border: rgba(0,0,0,0.06);
      --card-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03);
      --card-hover-border: rgba(79,110,247,0.3);
      --card-hover-shadow: 0 4px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(79,110,247,0.15);

      /* 模态框 */
      --modal-bg: #FFFFFF;
      --modal-border: rgba(0,0,0,0.08);
      --modal-overlay: rgba(15,15,25,0.5);
      --modal-header-border: rgba(0,0,0,0.06);

      /* 进度条 */
      --progress-bg: rgba(0,0,0,0.06);
      --progress-fill: #4F6EF7;
      --progress-fill-warn: #F5A623;
      --progress-fill-danger: #E5484D;

      /* 滚动条 */
      --scrollbar-track: transparent;
      --scrollbar-thumb: rgba(0,0,0,0.15);
      --scrollbar-thumb-hover: rgba(0,0,0,0.25);

      /* OTP */
      --otp-text: #1A1A2E;
      --otp-next-bg: rgba(0,0,0,0.03);
      --otp-next-bg-hover: rgba(0,0,0,0.06);
      --otp-next-text: #6E6E80;

      /* 搜索 */
      --search-bg: #FFFFFF;
      --search-border: rgba(0,0,0,0.08);
      --search-border-focus: #4F6EF7;
      --search-icon: #9E9EB0;

      /* 菜单 */
      --menu-bg: #FFFFFF;
      --menu-border: rgba(0,0,0,0.08);
      --menu-item-hover: rgba(0,0,0,0.04);
      --menu-shadow: 0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);

      /* 浮动按钮 */
      --float-btn-bg: #1A1A2E;
      --float-btn-hover: #2D2D44;
      --float-btn-shadow: 0 4px 14px rgba(26,26,46,0.35);
      --float-btn-text: #FFFFFF;
      --theme-toggle-bg: #FFFFFF;
      --theme-toggle-hover: #F0F0F5;
      --theme-toggle-border: rgba(0,0,0,0.08);
      --back-to-top-bg: #FFFFFF;
      --back-to-top-hover: #F0F0F5;
      --back-to-top-border: rgba(0,0,0,0.08);
      --back-to-top-text: #1A1A2E;

      /* Footer */
      --footer-border: rgba(0,0,0,0.06);
      --footer-text: #9E9EB0;
      --footer-link: #6E6E80;
      --footer-link-hover: #4F6EF7;

      /* 兼容旧代码引用 */
      --primary: #4F6EF7;
      --brand: #4F6EF7;
      --border: rgba(0,0,0,0.08);
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       深色模式 — 深邃、宁静
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    [data-theme="dark"] {
      /* 核心赛博朋克深空背景 */
      --bg-primary: #050508; /* 主背景作为 Fallback */
      --bg-primary-grad: radial-gradient(circle at 80% -20%, #112F3D 0%, #090B10 50%, #030305 100%);
      --bg-secondary: rgba(18, 22, 32, 0.4);
      --bg-tertiary: rgba(25, 30, 42, 0.5);
      --bg-elevated: rgba(20, 25, 36, 0.65);
      --bg-overlay: rgba(0, 0, 0, 0.75);
      --bg-hover: rgba(16, 185, 129, 0.08);
      --bg-active: rgba(16, 185, 129, 0.12);
      --bg-disabled: rgba(25, 30, 42, 0.3);

      /* 毛玻璃滤镜 (组件中调用) */
      --glass-blur: blur(16px);
      --glass-blur-heavy: blur(24px);

      /* 高辨识度的极客文本色 */
      --text-primary: #F8FAFC;
      --text-secondary: #94A3B8;
      --text-tertiary: #64748B;
      --text-disabled: #334155;
      --text-inverse: #022C22;
      --text-link: #34D399;
      --text-link-hover: #10B981;

      /* 半透明与发光边框 */
      --border-primary: rgba(16, 185, 129, 0.15);
      --border-secondary: rgba(255, 255, 255, 0.03);
      --border-tertiary: rgba(16, 185, 129, 0.3);
      --border-focus: #10B981;
      --border-error: #EF4444;
      --border-success: #10B981;

      /* 极客风荧光阴影 */
      --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.6);
      --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05);
      --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.08);
      --shadow-xl: 0 12px 48px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.1);

      /* 品牌强调色 (Emerald / Neon Green) */
      --accent: #10B981;
      --accent-hover: #34D399;
      --accent-light: rgba(16, 185, 129, 0.15);
      --accent-border: rgba(16, 185, 129, 0.4);

      /* 功能状态色 */
      --success-light: rgba(16, 185, 129, 0.12);
      --warning-light: rgba(245, 158, 11, 0.12);
      --danger-light: rgba(239, 68, 68, 0.12);
      --info-light: rgba(56, 189, 248, 0.12);

      /* 核心卡片 - 毛玻璃态 */
      --card-bg: rgba(18, 24, 38, 0.35);
      --card-border: rgba(255, 255, 255, 0.05);
      --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.03);
      --card-hover-border: rgba(16, 185, 129, 0.5);
      --card-hover-shadow: 0 8px 32px rgba(16, 185, 129, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1);

      /* 模态框/弹窗 */
      --modal-bg: rgba(16, 20, 32, 0.65);
      --modal-border: rgba(16, 185, 129, 0.3);
      --modal-overlay: rgba(2, 4, 8, 0.85); /* 极深的背景遮罩 */
      --modal-header-border: rgba(255, 255, 255, 0.05);

      /* 按钮与输入 */
      --btn-primary-bg: #10B981;
      --btn-primary-hover: #34D399;
      --btn-primary-text: #022C22;
      --btn-secondary-bg: rgba(30, 41, 59, 0.6);
      --btn-secondary-hover: rgba(51, 65, 85, 0.8);
      --btn-secondary-text: #F8FAFC;
      --btn-danger-bg: #EF4444;
      --btn-danger-hover: #F87171;

      --input-bg: rgba(15, 23, 42, 0.5);
      --input-bg-focus: rgba(30, 41, 59, 0.6);
      --input-border: rgba(255, 255, 255, 0.1);
      --input-border-focus: #10B981;
      --input-text: #F8FAFC;
      --input-placeholder: #475569;

      /* OTP 动态数字 */
      --otp-text: #34D399; /* 荧光数字 */
      --otp-next-bg: rgba(255, 255, 255, 0.03);
      --otp-next-bg-hover: rgba(16, 185, 129, 0.1);
      --otp-next-text: #64748B;

      /* 进度指示器与下拉菜单 */
      --progress-bg: rgba(255, 255, 255, 0.05);
      --progress-fill: #10B981;
      --progress-fill-warn: #F59E0B;
      --progress-fill-danger: #EF4444;
      
      --search-bg: rgba(15, 23, 42, 0.5);
      --search-border: rgba(255, 255, 255, 0.05);
      --search-border-focus: #10B981;
      --search-icon: #64748B;

      --menu-bg: rgba(18, 24, 38, 0.7);
      --menu-border: rgba(16, 185, 129, 0.2);
      --menu-item-hover: rgba(16, 185, 129, 0.15);
      --menu-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 12px rgba(16, 185, 129, 0.15);

      --float-btn-bg: #10B981;
      --float-btn-hover: #34D399;
      --float-btn-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
      --float-btn-text: #022C22;

      --theme-toggle-bg: rgba(30, 41, 59, 0.5);
      --theme-toggle-hover: rgba(51, 65, 85, 0.7);
      --theme-toggle-border: rgba(255, 255, 255, 0.05);
      --back-to-top-bg: rgba(30, 41, 59, 0.5);
      --back-to-top-hover: rgba(51, 65, 85, 0.7);
      --back-to-top-border: rgba(255, 255, 255, 0.05);
      --back-to-top-text: #F8FAFC;

      --footer-border: rgba(255, 255, 255, 0.03);
      --footer-text: #475569;
      --footer-link: #64748B;
      --footer-link-hover: #10B981;

      --primary: #10B981;
      --brand: #10B981;
      --border: rgba(255, 255, 255, 0.05);
    }

    /* 系统偏好回退 */
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        --bg-primary: #0C0C14;
        --bg-secondary: #16161F;
        --bg-tertiary: #1E1E2A;
        --bg-elevated: #1A1A26;
        --bg-hover: rgba(255,255,255,0.05);
        --text-primary: #EDEDF0;
        --text-secondary: #8B8BA0;
        --text-tertiary: #5C5C72;
        --border-primary: rgba(255,255,255,0.07);
        --border-secondary: rgba(255,255,255,0.04);
        --card-bg: #16161F;
        --card-border: rgba(255,255,255,0.06);
        --input-bg: #16161F;
        --input-border: rgba(255,255,255,0.1);
        --input-text: #EDEDF0;
        --modal-bg: #16161F;
        --modal-border: rgba(255,255,255,0.08);
        --accent: #7B93F8;
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
