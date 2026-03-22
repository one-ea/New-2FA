/**
 * 组件样式 v2
 */
export function getComponentStyles() {
	return `
    /* ─── 密钥卡片列表 ─── */
    .secrets-list {
      display: grid;
      /* 一列最小320px，自适应屏幕宽度展现2-3列 */
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
      margin: 0 auto;
      padding-bottom: 80px; /* 去除旧约束，留足底部空间 */
    }

    .secret-card {
      background: var(--card-bg);
      border-radius: 18px;
      padding: 18px;
      padding-top: 20px;
      border: 1px solid var(--card-border);
      transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
      position: relative;
      width: 100%;
      box-shadow: var(--card-shadow);
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      overflow: hidden;
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
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: 600;
      font-size: 16px;
      color: var(--accent);
      background: var(--accent-light);
      border: 1px solid var(--accent-border);
      transition: transform 0.3s ease;
    }

    .secret-card:hover .service-icon {
      transform: scale(1.05);
    }

    .service-icon img {
      width: 28px;
      height: 28px;
      object-fit: contain;
      border-radius: 6px;
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
      background: var(--bg-secondary);
      border: 1px solid var(--border-primary);
      color: var(--text-secondary);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 52px;
    }

    .action-btn:hover { background: var(--bg-hover); color: var(--text-primary); }

    .qr-btn { color: var(--text-primary); }
    .edit-btn { color: var(--text-primary); }
    .delete-btn { color: var(--danger); border-color: rgba(255,59,48,0.2); }
    .delete-btn:hover { background: var(--danger-light); color: var(--danger-dark); }

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

    /* 进度条 (改为底部极细极简风格) */
    .progress-mini {
      display: none; /* 极简设计里隐藏此组件以释放空间 */
    }

    .progress-mini-fill { display: none; }

    .progress-top {
      width: 100%;
      height: 2px;
      background: transparent;
      position: absolute;
      bottom: 0; /* 放到卡片底部 */
      left: 0; right: 0;
      top: auto;
      border-radius: 0;
      overflow: hidden;
    }

    .progress-top-fill {
      height: 100%;
      background: var(--progress-fill);
      transition: width 1s linear, background-color 0.5s ease;
      width: 0%;
      float: right; /* 从右往左消失 */
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

    /* ─── WebDAV 备份列表 ─── */
    .webdav-backup-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      transition: background 0.15s;
    }
    .webdav-backup-item:last-child { border-bottom: none; }
    .webdav-backup-item:hover { background: var(--bg-tertiary); }

    .webdav-backup-info { flex: 1; min-width: 0; }
    .webdav-backup-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .webdav-backup-meta {
      font-size: 11px;
      color: var(--text-tertiary);
      margin-top: 2px;
    }

    .webdav-backup-actions {
      display: flex;
      gap: 4px;
      margin-left: 8px;
      flex-shrink: 0;
    }

    .webdav-action-btn {
      width: 28px;
      height: 28px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--bg-primary);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: all 0.15s;
      padding: 0;
    }
    .webdav-action-btn:hover {
      background: var(--brand);
      color: white;
      border-color: var(--brand);
    }
    .webdav-delete-btn:hover {
      background: var(--danger);
      border-color: var(--danger);
    }

    /* 超宽屏 */
    @media (min-width: 1440px) {
      .action-menu-float { right: 28px; }
      .theme-toggle-float, .back-to-top { right: 28px; }
      .back-to-top.show ~ .theme-toggle-float { bottom: 72px !important; }
    }
`;
}
