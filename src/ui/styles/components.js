/**
 * 组件样式 v4 — 方案 C: 紧凑三列卡片
 */
export function getComponentStyles() {
	return `
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       紧凑三列网格
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .secrets-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      padding-bottom: 60px;
    }

    /* ── 紧凑卡片 ── */
    .secret-card {
      background: var(--card-bg);
      border-radius: var(--radius-md);
      padding: 12px 14px 0;
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
      transform: translateY(0) scale(0.99);
    }

    /* ── 卡片头部：品牌图标 + 服务名（同行） ── */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .secret-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }

    .service-icon {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: 600;
      font-size: 10px;
      color: var(--accent);
      background: var(--accent-light);
    }

    .service-icon img {
      width: 16px;
      height: 16px;
      object-fit: contain;
      border-radius: 3px;
    }

    .secret-text { flex: 1; min-width: 0; }

    .secret-text h3 {
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 600;
      margin: 0;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 账户名移到卡片底部 */
    .secret-text p {
      display: none;
    }

    .secret-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .service-details { flex: 1; min-width: 0; }

    /* ── 卡片菜单 ── */
    .card-menu {
      position: relative;
      cursor: pointer;
      padding: 2px 4px;
      margin: -2px -4px;
      border-radius: 4px;
      transition: background var(--duration-fast);
    }

    .card-menu:hover { background: var(--bg-hover); }

    .menu-dots {
      font-size: 14px;
      color: var(--text-tertiary);
      line-height: 1;
      user-select: none;
    }

    .card-menu-dropdown {
      display: none;
      position: absolute;
      top: -2px; right: -2px;
      background: var(--menu-bg);
      border: 1px solid var(--menu-border);
      border-radius: var(--radius-sm);
      min-width: 90px;
      width: fit-content;
      box-shadow: var(--menu-shadow);
      z-index: 10000;
      overflow: hidden;
      backdrop-filter: blur(20px);
    }

    .card-menu-dropdown.show { display: block; }

    .menu-item {
      padding: 7px 12px;
      color: var(--text-primary);
      cursor: pointer;
      transition: background var(--duration-fast);
      font-size: 12px;
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
      gap: 4px;
      flex-shrink: 0;
      margin-left: 6px;
    }

    .action-btn {
      background: var(--bg-tertiary);
      border: none;
      color: var(--text-secondary);
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 500;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all var(--duration-fast);
    }

    .action-btn:hover { background: var(--bg-active); color: var(--text-primary); }
    .delete-btn:hover { background: var(--danger-light); color: var(--danger); }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       OTP 显示（紧凑版）
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .otp-preview {
      margin: 4px 0 0;
      padding: 0;
      background: none;
      border: none;
    }

    .otp-main {
      display: flex;
      align-items: baseline;
      gap: 0;
      justify-content: flex-start;
    }

    .otp-code-container {
      flex: 1;
      min-width: 0;
    }

    .otp-code {
      font-family: var(--font-mono);
      font-size: 26px;
      font-weight: 500;
      color: var(--otp-text);
      letter-spacing: 2px;
      cursor: pointer;
      transition: opacity var(--duration-fast);
      user-select: none;
      margin: 0;
      padding: 0;
      line-height: 1.3;
      background: none;
      border: none;
      display: block;
      width: 100%;
      text-align: left;
    }

    .otp-code:hover { opacity: 0.6; }

    .otp-bottom { display: none; }

    /* 隐藏 "下一个" 验证码以节省空间 */
    .otp-next-container {
      display: none;
    }

    .otp-next-label { display: none; }

    .otp-next-code {
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 500;
      color: var(--otp-next-text);
      letter-spacing: 1px;
      line-height: 1;
    }

    /* ── 卡片底部信息行：账户名 ── */
    .secret-card .secret-text p {
      display: none;
    }

    /* 通过 JS 渲染的 account 在 OTP 下方以小灰字显示 */

    /* ── 卡片底部：账户名 + 进度条 ── */
    .card-bottom {
      margin-top: 6px;
      padding-bottom: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .card-account {
      font-size: 11px;
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }

    /* ── 进度条（底部彩色细线） ── */
    .progress-mini { display: none; }
    .progress-mini-fill { display: none; }

    .progress-top {
      width: 100%;
      height: 3px;
      background: var(--progress-bg);
      position: relative;
      margin-top: 10px;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-top-fill {
      height: 100%;
      background: var(--progress-fill);
      transition: width 1s linear, background-color 0.5s ease;
      width: 0%;
      border-radius: 2px;
    }

    /* ━━ Footer ━━ */
    .page-footer {
      margin-top: 16px;
      padding: 12px 0 16px;
      border-top: 1px solid var(--footer-border);
      text-align: center;
    }

    .footer-content { max-width: 800px; margin: 0 auto; }

    .footer-links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }

    .footer-link {
      color: var(--footer-link);
      text-decoration: none;
      font-size: 11px;
      transition: color var(--duration-fast);
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }

    .footer-link:hover { color: var(--footer-link-hover); }
    .github-icon { width: 12px; height: 12px; vertical-align: middle; }

    .footer-separator {
      color: var(--border-secondary);
      font-size: 11px;
      user-select: none;
    }

    .footer-info {
      color: var(--footer-text);
      font-size: 10px;
      margin-top: 2px;
    }

    .footer-info a {
      color: var(--footer-link);
      text-decoration: none;
    }
    .footer-info a:hover { color: var(--footer-link-hover); }

    /* ── WebDAV 备份列表 ── */
    .webdav-backup-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid var(--border-primary);
      transition: background var(--duration-fast);
    }
    .webdav-backup-item:last-child { border-bottom: none; }
    .webdav-backup-item:hover { background: var(--bg-hover); }

    .webdav-backup-info { flex: 1; min-width: 0; }
    .webdav-backup-name {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .webdav-backup-meta {
      font-size: 10px;
      color: var(--text-tertiary);
      margin-top: 2px;
    }

    .webdav-backup-actions {
      display: flex;
      gap: 4px;
      margin-left: 6px;
      flex-shrink: 0;
    }

    .webdav-action-btn {
      width: 26px; height: 26px;
      border: 1px solid var(--border-primary);
      border-radius: 4px;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      transition: all var(--duration-fast);
      padding: 0;
    }
    .webdav-action-btn:hover { background: var(--accent); color: white; border-color: var(--accent); }
    .webdav-delete-btn:hover { background: var(--danger); border-color: var(--danger); }

    /* ━━ 响应式卡片 ━━ */
    @media (max-width: 900px) {
      .secrets-list {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 580px) {
      .secrets-list {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .otp-code { font-size: 28px; }
    }

    @media (max-width: 480px) {
      .secret-card {
        padding: 10px 12px 0;
      }

      .otp-code {
        font-size: 24px;
        letter-spacing: 1.5px;
      }
    }

    @media (min-width: 1200px) {
      .secrets-list {
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
    }

    @media (min-width: 1440px) {
      .action-menu-float { right: 28px; }
      .theme-toggle-float, .back-to-top { right: 28px; }
      .back-to-top.show ~ .theme-toggle-float { bottom: 68px !important; }
    }
`;
}
