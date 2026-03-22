/**
 * 组件样式 v2
 */
export function getComponentStyles() {
	return `
    /* ─── 密钥卡片列表 ─── */
    .secrets-list {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin: 0 auto;
    }

    .secret-card {
      background: var(--card-bg);
      border-radius: 16px;
      padding: 16px;
      padding-top: 18px;
      border: 1.5px solid var(--card-border);
      transition: all 0.25s cubic-bezier(.4,0,.2,1);
      position: relative;
      width: 100%;
      box-shadow: var(--card-shadow);
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }

    .secret-card:hover {
      border-color: var(--card-hover-border);
      box-shadow: var(--card-hover-shadow);
      transform: translateY(-2px);
    }

    .secret-card:active {
      transform: translateY(0);
    }

    /* 卡片头部 */
    .secret-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .secret-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .service-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: 600;
      font-size: 15px;
      color: var(--accent);
      background: var(--accent-light);
      border: 1px solid var(--accent-border);
      transition: all 0.2s;
    }

    .secret-card:hover .service-icon {
      transform: scale(1.05);
    }

    .service-icon img {
      width: 26px;
      height: 26px;
      object-fit: contain;
      border-radius: 5px;
    }

    .secret-text { flex: 1; min-width: 0; }
    .service-details { flex: 1; min-width: 0; }

    .secret-text h3 {
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 1px;
      line-height: 1.3;
      word-break: break-word;
    }

    .secret-text p {
      color: var(--text-tertiary);
      font-size: 12px;
      margin: 0;
      line-height: 1.3;
      word-break: break-word;
    }

    /* 卡片菜单 */
    .card-menu {
      position: relative;
      cursor: pointer;
      padding: 6px;
      margin: -6px;
      border-radius: 8px;
      transition: background 0.15s;
    }

    .card-menu:hover { background: var(--bg-hover); }

    .menu-dots {
      font-size: 18px;
      color: var(--text-tertiary);
      line-height: 1;
      user-select: none;
    }

    .card-menu-dropdown {
      display: none;
      position: absolute;
      top: -6px; right: -6px;
      background: var(--menu-bg);
      border: 1px solid var(--menu-border);
      border-radius: 12px;
      min-width: 80px;
      width: fit-content;
      box-shadow: var(--menu-shadow);
      z-index: 10000;
      overflow: hidden;
      backdrop-filter: blur(20px);
    }

    .card-menu-dropdown.show { display: block; }

    .menu-item {
      padding: 10px 14px;
      color: var(--text-primary);
      cursor: pointer;
      transition: background 0.15s;
      font-size: 13px;
      white-space: nowrap;
      font-family: 'Inter', sans-serif;
    }

    .menu-item:hover { background: var(--menu-item-hover); }
    .menu-item-danger { color: var(--danger) !important; }
    .menu-item-danger:hover { background: var(--danger-light) !important; }

    /* 操作按钮 */
    .secret-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
      margin-left: 8px;
    }

    .action-btn {
      background: none;
      border: 1.5px solid;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 11px;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 52px;
    }

    .qr-btn { border-color: #a855f7; color: #a855f7; }
    .qr-btn:hover { background: #a855f7; color: white; }
    .edit-btn { border-color: var(--warning); color: var(--warning); }
    .edit-btn:hover { background: var(--warning); color: white; }
    .delete-btn { border-color: var(--danger); color: var(--danger); }
    .delete-btn:hover { background: var(--danger); color: white; }

    /* ─── OTP 显示 ─── */
    .otp-preview {
      margin-top: 10px;
      padding: 0;
      background: none;
      border: none;
    }

    .otp-main {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: space-between;
    }

    .otp-code-container {
      flex: 1;
      min-width: 0;
    }

    .otp-code {
      font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
      font-size: 36px;
      font-weight: 500;
      color: var(--otp-text);
      letter-spacing: 4px;
      cursor: pointer;
      transition: all 0.15s;
      user-select: none;
      margin: 2px 0;
      line-height: 1.1;
      padding: 0;
      background: none;
      border: none;
      display: block;
      width: 100%;
      text-align: left;
    }

    .otp-code:hover { opacity: 0.7; }

    .otp-bottom { display: none; }

    .otp-next-container {
      text-align: right;
      cursor: pointer;
      transition: all 0.15s;
      padding: 6px 10px;
      border-radius: 10px;
      background: var(--otp-next-bg);
      flex-shrink: 0;
      min-width: 68px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
    }

    .otp-next-container:hover { background: var(--otp-next-bg-hover); }

    .otp-next-label { display: none; }

    .otp-next-code {
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      color: var(--otp-next-text);
      letter-spacing: 1px;
      line-height: 1;
      display: block;
      white-space: nowrap;
      text-align: right;
    }

    /* 进度条 */
    .progress-mini {
      width: 56px;
      height: 3px;
      background: var(--border-primary);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-mini-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 2px;
      transition: width 1s ease-in-out;
    }

    .progress-top {
      width: 100%;
      height: 2px;
      background: transparent;
      overflow: hidden;
      position: absolute;
      top: 0; left: 0; right: 0;
      border-radius: 16px 16px 0 0;
    }

    .progress-top-fill {
      height: 100%;
      background: var(--progress-fill);
      transition: width 1s linear, background-color 0.5s ease;
      width: 0%;
    }

    /* ─── Footer ─── */
    .page-footer {
      margin-top: 32px;
      padding: 16px 20px 20px;
      border-top: 1px solid var(--footer-border);
      text-align: center;
    }

    .footer-content { max-width: 800px; margin: 0 auto; }

    .footer-links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }

    .footer-link {
      color: var(--footer-link);
      text-decoration: none;
      font-size: 12px;
      transition: color 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .footer-link:hover { color: var(--footer-link-hover); }

    .github-icon { width: 13px; height: 13px; vertical-align: middle; }

    .footer-separator {
      color: var(--border-secondary);
      font-size: 12px;
      user-select: none;
    }

    .footer-info {
      color: var(--text-tertiary);
      font-size: 11px;
      margin-top: 4px;
    }

    .footer-info a {
      color: var(--footer-link);
      text-decoration: none;
      transition: color 0.15s;
    }

    .footer-info a:hover { color: var(--footer-link-hover); }

    /* ─── PWA 安装按钮 ─── */
    .pwa-install-btn-float {
      position: fixed;
      bottom: 20px; right: 20px;
      width: 40px; height: 40px;
      background: var(--theme-toggle-bg);
      border: 1.5px solid var(--theme-toggle-border);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s;
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
      -webkit-tap-highlight-color: transparent;
    }

    .pwa-install-btn-float.show {
      opacity: 1;
      visibility: visible;
      bottom: 68px;
    }

    .pwa-install-btn-float:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      background: var(--theme-toggle-hover);
    }

    .pwa-install-btn-float:active { transform: scale(0.95); }

    .pwa-install-icon {
      font-size: 18px;
      transition: transform 0.2s;
    }

    .pwa-install-btn-float:hover .pwa-install-icon { transform: scale(1.1); }

    .back-to-top.show ~ .pwa-install-btn-float.show {
      bottom: 116px !important;
    }

    /* ─── 离线横幅 ─── */
    .offline-banner {
      position: fixed;
      top: 0; left: 0; right: 0;
      background: linear-gradient(135deg, var(--warning) 0%, var(--danger) 100%);
      color: white;
      padding: 10px 20px;
      box-shadow: var(--shadow-md);
      z-index: 999;
      transform: translateY(-100%);
      transition: transform 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .offline-banner.show { transform: translateY(0); }

    .offline-banner-icon {
      font-size: 18px;
      animation: pulse 2s infinite;
    }

    .offline-banner-text {
      font-size: 13px;
      font-weight: 600;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(0.95); }
    }

    body.offline-mode { padding-top: 40px; }
    body.offline-mode .secret-card { opacity: 0.95; }

    /* PWA 响应式 */
    @media (max-width: 480px) {
      .pwa-install-btn-float { width: 36px; height: 36px; right: 14px; border-radius: 10px; }
      .pwa-install-btn-float.show { bottom: 58px; }
      .pwa-install-icon { font-size: 16px; }
      .back-to-top.show ~ .pwa-install-btn-float.show { bottom: 100px !important; }
      .offline-banner { padding: 8px 16px; }
      .offline-banner-icon { font-size: 16px; }
      .offline-banner-text { font-size: 12px; }
      body.offline-mode { padding-top: 36px; }
    }

    @media (max-width: 360px) {
      .pwa-install-btn-float { width: 34px; height: 34px; right: 10px; border-radius: 10px; }
      .pwa-install-btn-float.show { bottom: 52px; }
      .pwa-install-icon { font-size: 14px; }
      .back-to-top.show ~ .pwa-install-btn-float.show { bottom: 94px !important; }
    }

    /* 超宽屏 */
    @media (min-width: 1440px) {
      .action-menu-float { right: 28px; }
      .theme-toggle-float, .back-to-top { right: 28px; }
      .back-to-top.show ~ .theme-toggle-float { bottom: 72px !important; }
      .pwa-install-btn-float { right: 28px; }
      .pwa-install-btn-float.show { bottom: 72px; }
      .back-to-top.show ~ .pwa-install-btn-float.show { bottom: 124px !important; }
    }
`;
}
