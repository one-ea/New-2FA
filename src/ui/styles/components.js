/**
 * 组件样式 v4.1 — 方案 C 精修：对齐概念图
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

    /* ── 紧凑卡片（概念图 ~90px 高） ── */
    .secret-card {
      background: var(--card-bg);
      border-radius: var(--radius-md);
      padding: 10px 12px 0;
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
      overflow: visible;
    }

    .secret-card:hover {
      border-color: var(--card-hover-border);
      box-shadow: var(--card-hover-shadow);
      transform: translateY(-1px);
    }

    .secret-card:active {
      transform: translateY(0) scale(0.99);
    }

    /* ── 卡片头部：品牌图标 + 服务名（同行，紧凑） ── */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2px;
    }

    .secret-info {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .service-icon {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-weight: 600;
      font-size: 9px;
      color: var(--accent);
      background: var(--accent-light);
    }

    .service-icon img {
      width: 14px;
      height: 14px;
      object-fit: contain;
      border-radius: 3px;
    }

    .secret-text { flex: 1; min-width: 0; }

    .secret-text h3 {
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 600;
      margin: 0;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 账户名在 header 中隐藏 */
    .secret-text p { display: none; }

    .secret-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .service-details { flex: 1; min-width: 0; }

    /* ── 卡片菜单（hover 才显示） ── */
    .card-menu {
      position: relative;
      cursor: pointer;
      padding: 2px 4px;
      margin: -2px -4px;
      border-radius: 4px;
      transition: background var(--duration-fast), opacity var(--duration-fast);
      opacity: 0;
    }

    .secret-card:hover .card-menu { opacity: 1; }
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
      top: 24px; right: 0;
      background: var(--menu-bg);
      border: 1px solid var(--menu-border);
      border-radius: 10px;
      min-width: 140px;
      width: fit-content;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
      z-index: 10000;
      overflow: hidden;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 4px 0;
    }

    .card-menu-dropdown.show { display: block; }

    .menu-item {
      padding: 8px 14px;
      color: var(--text-primary);
      cursor: pointer;
      transition: background var(--duration-fast);
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      font-family: var(--font-body);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* 菜单项图标 */
    .mi {
      font-size: 14px;
      width: 18px;
      text-align: center;
      flex-shrink: 0;
      line-height: 1;
    }

    .menu-item:hover { background: var(--menu-item-hover); }

    /* 分割线 */
    .menu-divider {
      height: 1px;
      background: var(--border-primary);
      margin: 4px 0;
    }

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
       OTP 显示（极紧凑）
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .otp-preview {
      margin: 0;
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
      padding: 2px 0;
      line-height: 1.2;
      background: none;
      border: none;
      display: block;
      width: 100%;
      text-align: left;
    }

    .otp-code:hover { opacity: 0.6; }

    .otp-bottom { display: none; }

    /* 隐藏 "下一个" 验证码 */
    .otp-next-container { display: none; }
    .otp-next-label { display: none; }

    .otp-next-code {
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 500;
      color: var(--otp-next-text);
      letter-spacing: 1px;
      line-height: 1;
    }

    /* ── 卡片底部：进度条 + 账户名（概念图风格） ── */
    .card-bottom {
      margin-top: 4px;
      padding-bottom: 8px;
    }

    /* 进度条 */
    .progress-mini { display: none; }
    .progress-mini-fill { display: none; }

    .progress-top {
      width: 100%;
      height: 3px;
      background: var(--progress-bg);
      position: relative;
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

    /* 账户名在进度条下方，右对齐（概念图风格） */
    .card-account {
      display: block;
      font-size: 11px;
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
      margin-top: 3px;
      text-align: right;
    }

    /* ━━ 右侧浮动工具栏（概念图：竖直4按钮） ━━ */
    .side-toolbar {
      position: fixed;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 2px;
      z-index: 1001;
      background: var(--menu-bg);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      padding: 4px;
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .toolbar-btn {
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all var(--duration-fast);
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    .toolbar-btn:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }

    .toolbar-btn:active { transform: scale(0.92); }

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
      .side-toolbar {
        right: 12px;
      }
    }

    @media (max-width: 580px) {
      .secrets-list {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .otp-code { font-size: 28px; }
      .side-toolbar {
        position: fixed;
        right: auto;
        left: 50%;
        top: auto;
        bottom: 16px;
        transform: translateX(-50%);
        flex-direction: row;
      }
    }

    @media (max-width: 480px) {
      .secret-card { padding: 8px 10px 0; }
      .otp-code { font-size: 24px; letter-spacing: 1.5px; }
    }

    @media (min-width: 1200px) {
      .secrets-list { gap: 12px; }
    }
`;
}
