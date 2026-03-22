/**
 * 组件样式 v3
 */
export function getComponentStyles() {
	return `
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       密钥卡片网格
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .secrets-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
      padding-bottom: 80px;
    }

    .secret-card {
      background: var(--card-bg);
      border-radius: var(--radius-lg);
      padding: 16px 18px 14px;
      border: 1px solid var(--card-border);
      transition: border-color var(--duration-normal) var(--ease-out),
                  box-shadow var(--duration-normal) var(--ease-out),
                  transform var(--duration-normal) var(--ease-out);
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
      transform: translateY(-1px);
    }

    .secret-card:active {
      transform: translateY(0) scale(0.995);
    }

    /* ── 卡片头部 ── */
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
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: 600;
      font-size: 14px;
      color: var(--accent);
      background: var(--accent-light);
      transition: transform var(--duration-normal) var(--ease-out);
    }

    .secret-card:hover .service-icon {
      transform: scale(1.06);
    }

    .service-icon img {
      width: 24px;
      height: 24px;
      object-fit: contain;
      border-radius: 4px;
    }

    .secret-text { flex: 1; min-width: 0; }
    .service-details { flex: 1; min-width: 0; }

    .secret-text h3 {
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 1px;
      line-height: 1.4;
      word-break: break-word;
      letter-spacing: -0.01em;
    }

    .secret-text p {
      color: var(--text-tertiary);
      font-size: 12px;
      margin: 0;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── 卡片菜单 ── */
    .card-menu {
      position: relative;
      cursor: pointer;
      padding: 4px 6px;
      margin: -4px -6px;
      border-radius: var(--radius-sm);
      transition: background var(--duration-fast);
    }

    .card-menu:hover { background: var(--bg-hover); }

    .menu-dots {
      font-size: 16px;
      color: var(--text-tertiary);
      line-height: 1;
      user-select: none;
    }

    .card-menu-dropdown {
      display: none;
      position: absolute;
      top: -4px; right: -4px;
      background: var(--menu-bg);
      border: 1px solid var(--menu-border);
      border-radius: var(--radius-md);
      min-width: 100px;
      width: fit-content;
      box-shadow: var(--menu-shadow);
      z-index: 10000;
      overflow: hidden;
      backdrop-filter: blur(20px);
    }

    .card-menu-dropdown.show { display: block; }

    .menu-item {
      padding: 9px 14px;
      color: var(--text-primary);
      cursor: pointer;
      transition: background var(--duration-fast);
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      font-family: var(--font-body);
    }

    .menu-item:hover { background: var(--menu-item-hover); }
    .menu-item-danger { color: var(--danger) !important; }
    .menu-item-danger:hover { background: var(--danger-light) !important; }

    /* ── 操作按钮 ── */
    .secret-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
      margin-left: 8px;
    }

    .action-btn {
      background: var(--bg-tertiary);
      border: none;
      color: var(--text-secondary);
      border-radius: var(--radius-sm);
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 500;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all var(--duration-fast);
    }

    .action-btn:hover { background: var(--bg-active); color: var(--text-primary); }
    .delete-btn:hover { background: var(--danger-light); color: var(--danger); }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       OTP 显示
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .otp-preview {
      margin-top: 12px;
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
      font-family: var(--font-mono);
      font-size: 32px;
      font-weight: 500;
      color: var(--otp-text);
      letter-spacing: 3px;
      cursor: pointer;
      transition: opacity var(--duration-fast);
      user-select: none;
      margin: 0;
      padding: 0;
      line-height: 1.2;
      background: none;
      border: none;
      display: block;
      width: 100%;
      text-align: left;
    }

    .otp-code:hover { opacity: 0.65; }

    .otp-bottom { display: none; }

    .otp-next-container {
      text-align: right;
      cursor: pointer;
      transition: background var(--duration-fast);
      padding: 6px 10px;
      border-radius: var(--radius-sm);
      background: var(--otp-next-bg);
      flex-shrink: 0;
      min-width: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
    }

    .otp-next-container:hover { background: var(--otp-next-bg-hover); }

    .otp-next-label { display: none; }

    .otp-next-code {
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 500;
      color: var(--otp-next-text);
      letter-spacing: 1px;
      line-height: 1;
      display: block;
      white-space: nowrap;
    }

    /* ── 进度条 ── */
    .progress-mini { display: none; }
    .progress-mini-fill { display: none; }

    .progress-top {
      width: 100%;
      height: 2px;
      background: var(--progress-bg);
      position: absolute;
      bottom: 0;
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
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       Footer
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .page-footer {
      margin-top: 24px;
      padding: 16px 0 20px;
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
      transition: color var(--duration-fast);
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
      color: var(--footer-text);
      font-size: 11px;
      margin-top: 4px;
    }

    .footer-info a {
      color: var(--footer-link);
      text-decoration: none;
      transition: color var(--duration-fast);
    }

    .footer-info a:hover { color: var(--footer-link-hover); }

    /* ── WebDAV 备份列表 ── */
    .webdav-backup-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-bottom: 1px solid var(--border-primary);
      transition: background var(--duration-fast);
    }
    .webdav-backup-item:last-child { border-bottom: none; }
    .webdav-backup-item:hover { background: var(--bg-hover); }

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
      border: 1px solid var(--border-primary);
      border-radius: 6px;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: all var(--duration-fast);
      padding: 0;
    }
    .webdav-action-btn:hover {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }
    .webdav-delete-btn:hover {
      background: var(--danger);
      border-color: var(--danger);
    }

    /* ── 响应式卡片 ── */
    @media (max-width: 680px) {
      .secrets-list {
        grid-template-columns: 1fr;
        gap: 10px;
      }
    }

    @media (max-width: 480px) {
      .secret-card {
        padding: 14px 14px 12px;
        border-radius: var(--radius-md);
      }

      .service-icon {
        width: 32px;
        height: 32px;
      }

      .service-icon img {
        width: 20px;
        height: 20px;
      }

      .otp-code {
        font-size: 28px;
        letter-spacing: 2px;
      }

      .otp-next-code {
        font-size: 12px;
      }
    }

    /* ── 超宽屏 ── */
    @media (min-width: 1200px) {
      .secrets-list {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }

    @media (min-width: 1440px) {
      .action-menu-float { right: 28px; }
      .theme-toggle-float, .back-to-top { right: 28px; }
      .back-to-top.show ~ .theme-toggle-float { bottom: 72px !important; }
    }
`;
}
