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
      gap: 14px 16px;
      padding-bottom: 60px;
    }

    /* ── 紧凑卡片（概念图 ~90px 高） ── */
    .secret-card {
      background: var(--card-bg);
      border-radius: var(--radius-md);
      padding: 14px 16px 0;
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
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
    }

    .otp-code-container {
      flex: 1;
      min-width: 0;
    }

    .otp-code {
      font-family: var(--font-mono);
      font-size: 28px;
      font-weight: 800;
      color: var(--otp-text);
      letter-spacing: 3px;
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

    /* 下一个验证码预览（最后5秒显示） */
    .otp-next-container {
      display: none;
      align-items: center;
      gap: 6px;
      margin-top: 2px;
      opacity: 0;
      transform: translateY(-4px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .otp-next-container.show {
      display: flex;
      opacity: 1;
      transform: translateY(0);
    }

    .otp-next-label {
      font-size: 10px;
      color: var(--text-tertiary);
      white-space: nowrap;
    }

    .otp-next-code {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: 1.5px;
      line-height: 1;
      cursor: pointer;
    }
    .otp-next-code:hover { opacity: 0.7; }

    /* ── 卡片底部：进度条 + 账户名（概念图风格） ── */
    .card-bottom {
      margin-top: 6px;
      padding-bottom: 10px;
    }

    /* 进度条 */
    .progress-mini { display: none; }
    .progress-mini-fill { display: none; }

    .progress-top {
      width: 100%;
      height: 4px;
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

    /* ━━ 设置 FAB（齿轮按钮） ━━ */
    .settings-fab {
      position: fixed;
      right: 24px;
      bottom: 24px;
      width: 44px;
      height: 44px;
      border: 1px solid var(--border-primary);
      background: var(--menu-bg);
      color: var(--text-secondary);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: all var(--duration-normal) var(--ease-out);
      z-index: 1001;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      outline: none;
    }

    .settings-fab:hover {
      color: var(--text-primary);
      transform: rotate(30deg) scale(1.05);
      box-shadow: var(--shadow-xl);
    }

    .settings-fab:active { transform: scale(0.92); }

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
      .settings-fab {
        width: 40px;
        height: 40px;
        right: 16px;
        bottom: 16px;
      }
    }

    @media (max-width: 480px) {
      .secret-card { padding: 8px 10px 0; }
      .otp-code { font-size: 24px; letter-spacing: 1.5px; }
    }

    @media (min-width: 1200px) {
      .secrets-list { gap: 12px; }
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       Ctrl+K 命令面板
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .cmd-palette-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 99999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 15vh;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .cmd-palette-overlay.show { opacity: 1; }

    .cmd-palette {
      width: 520px;
      max-width: 90vw;
      background: var(--card-bg);
      border: 1px solid var(--border-primary);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.1);
      overflow: hidden;
      transform: scale(0.95) translateY(-10px);
      transition: transform 0.2s ease;
    }
    .cmd-palette-overlay.show .cmd-palette {
      transform: scale(1) translateY(0);
    }

    .cmd-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-primary);
      color: var(--text-tertiary);
    }

    .cmd-input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--text-primary);
      font-size: 15px;
      font-family: var(--font-body);
      outline: none;
    }
    .cmd-input::placeholder { color: var(--text-tertiary); }

    .cmd-kbd {
      font-size: 10px;
      padding: 2px 6px;
      border: 1px solid var(--border-primary);
      border-radius: 4px;
      color: var(--text-tertiary);
      background: var(--bg-hover);
      font-family: var(--font-mono);
    }

    .cmd-results {
      max-height: 320px;
      overflow-y: auto;
      padding: 6px 0;
    }

    .cmd-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      cursor: pointer;
      transition: background 0.1s;
    }
    .cmd-item:hover, .cmd-item.active {
      background: var(--bg-hover);
    }

    .cmd-item-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .cmd-logo {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      object-fit: contain;
      flex-shrink: 0;
    }

    .cmd-logo-placeholder {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: var(--accent);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .cmd-item-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .cmd-item-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cmd-item-account {
      font-size: 11px;
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cmd-item-otp {
      font-family: var(--font-mono);
      font-size: 16px;
      font-weight: 700;
      color: var(--accent);
      letter-spacing: 2px;
      flex-shrink: 0;
      margin-left: 16px;
    }

    .cmd-empty {
      padding: 24px 16px;
      text-align: center;
      color: var(--text-tertiary);
      font-size: 13px;
    }

    .cmd-footer {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 16px;
      border-top: 1px solid var(--border-primary);
      font-size: 11px;
      color: var(--text-tertiary);
    }
    .cmd-footer kbd {
      font-size: 10px;
      padding: 1px 5px;
      border: 1px solid var(--border-primary);
      border-radius: 3px;
      background: var(--bg-hover);
      font-family: var(--font-mono);
      margin-right: 2px;
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       OTP 隐藏/揭示动画
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .otp-code.masked,
    .otp-next-code.masked {
      filter: blur(8px);
      transition: filter 0.3s ease;
      user-select: none;
    }

    .otp-code.revealed,
    .otp-next-code.revealed {
      filter: blur(0);
      transition: filter 0.25s ease;
    }


    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       🔄 P2P 同步
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .sync-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 16px;
      background: var(--bg-secondary);
      border-radius: 10px;
      padding: 3px;
    }

    .sync-tab-btn {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .sync-tab-btn.active {
      background: var(--bg-primary);
      color: var(--text-primary);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .sync-pairing-code {
      font-family: var(--font-mono);
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 4px;
      text-align: center;
      padding: 16px;
      margin-bottom: 12px;
      color: var(--accent, #4F6EF7);
      min-height: 28px;
      user-select: all;
    }

    .sync-status-info {
      padding: 10px 14px;
      border-radius: 8px;
      background: var(--info-light, rgba(79,110,247,0.1));
      color: var(--info, #4F6EF7);
      font-size: 13px;
      text-align: center;
    }

    .sync-status-success {
      padding: 10px 14px;
      border-radius: 8px;
      background: var(--success-light, rgba(16,185,129,0.1));
      color: var(--success, #10B981);
      font-size: 13px;
      text-align: center;
    }

    .sync-status-error {
      padding: 10px 14px;
      border-radius: 8px;
      background: var(--danger-light, rgba(239,68,68,0.1));
      color: var(--danger, #EF4444);
      font-size: 13px;
      text-align: center;
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       🎯 URL 智能匹配
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .url-match-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 10px 16px;
      background: var(--bg-primary);
      border-top: 1px solid var(--border-primary);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transform: translateY(100%);
      transition: transform 0.25s ease;
    }
    .url-match-bar.show { transform: translateY(0); }

    .url-match-inner {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .url-match-input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--text-primary);
      font-size: 14px;
      outline: none;
      padding: 6px 0;
      font-family: var(--font-mono);
    }
    .url-match-input::placeholder { color: var(--text-tertiary); }

    .url-match-result {
      font-size: 12px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .url-match-close {
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
      transition: background var(--duration-fast);
    }
    .url-match-close:hover { background: var(--bg-hover); }

    /* 卡片匹配状态 */
    .secret-card.url-matched {
      outline: 2px solid var(--accent, #4F6EF7);
      outline-offset: 2px;
      box-shadow: 0 0 16px rgba(79, 110, 247, 0.25);
      position: relative;
      z-index: 1;
    }
    .secret-card.url-dimmed {
      opacity: 0.35;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       📊 安全仪表盘
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .dash-score-section {
      text-align: center;
      margin-bottom: 20px;
    }

    .dash-score-ring-wrap {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto 12px;
    }

    .dash-score-ring {
      width: 120px;
      height: 120px;
      transform: rotate(-90deg);
    }

    .dash-ring-bg {
      fill: none;
      stroke: var(--border-primary);
      stroke-width: 8;
    }

    .dash-ring-fg {
      fill: none;
      stroke-width: 8;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.8s ease;
    }

    .dash-score-text {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .dash-score-num {
      font-size: 32px;
      font-weight: 800;
      font-family: var(--font-mono);
      line-height: 1;
    }

    .dash-score-label {
      font-size: 11px;
      color: var(--text-tertiary);
      margin-top: 2px;
    }

    .dash-grade {
      display: inline-block;
      padding: 4px 16px;
      border-radius: 20px;
      color: #fff;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 16px;
    }

    .dash-stats-row {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-bottom: 8px;
    }

    .dash-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .dash-stat-num {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      font-family: var(--font-mono);
    }

    .dash-stat-label {
      font-size: 11px;
      color: var(--text-tertiary);
    }

    /* 检查项 */
    .dash-checks {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .dash-check-item {
      display: flex;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      border-left: 3px solid;
      background: var(--bg-secondary);
    }

    .dash-check-danger { border-left-color: #EF4444; }
    .dash-check-warning { border-left-color: #F59E0B; }
    .dash-check-info { border-left-color: #4F6EF7; }
    .dash-check-success { border-left-color: #10B981; }

    .dash-check-icon {
      font-size: 18px;
      flex-shrink: 0;
      line-height: 1.4;
    }

    .dash-check-body { flex: 1; min-width: 0; }

    .dash-check-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .dash-check-detail {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .dash-check-items {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;
    }

    .dash-check-tag {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }

    .dash-check-action {
      margin-top: 8px;
      padding: 5px 14px;
      border: none;
      border-radius: 6px;
      background: var(--accent, #4F6EF7);
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .dash-check-action:hover { opacity: 0.85; }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       📂 分组 Chips 与管理
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .chip-color-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
      flex-shrink: 0;
    }

    .chip-group-dynamic {
      display: inline-flex;
      align-items: center;
    }

    /* 分组管理列表 */
    .group-manager-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--border-primary);
      transition: background var(--duration-fast);
    }
    .group-manager-item:last-child { border-bottom: none; }
    .group-manager-item:hover { background: var(--bg-hover); }

    .group-manager-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .group-manager-name {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .group-manager-count {
      font-size: 12px;
      color: var(--text-tertiary);
      background: var(--bg-tertiary);
      padding: 2px 8px;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .group-manager-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: background var(--duration-fast);
      flex-shrink: 0;
      padding: 0;
    }
    .group-manager-btn:hover { background: var(--bg-active); }
    .group-manager-btn-danger:hover { background: var(--danger-light); }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       🔐 应用锁 — 锁屏界面
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .app-lock-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .app-lock-overlay.show { opacity: 1; }

    .app-lock-card {
      text-align: center;
      padding: 40px 32px;
      max-width: 320px;
      width: 90vw;
    }

    .app-lock-icon {
      font-size: 48px;
      margin-bottom: 12px;
      animation: lockBounce 0.6s ease;
    }

    @keyframes lockBounce {
      0% { transform: scale(0.5); opacity: 0; }
      60% { transform: scale(1.15); }
      100% { transform: scale(1); opacity: 1; }
    }

    .app-lock-title {
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
    }

    .app-lock-subtitle {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 28px;
    }

    .app-lock-hidden-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    /* PIN 圆点 */
    .pin-dots-container {
      display: flex;
      justify-content: center;
      gap: 14px;
      margin-bottom: 12px;
    }

    .pin-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.3);
      background: transparent;
      transition: all 0.2s ease;
    }

    .pin-dot.filled {
      background: #fff;
      border-color: #fff;
      transform: scale(1.15);
    }

    /* 抖动动画 */
    @keyframes pinShake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-10px); }
      40% { transform: translateX(10px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
    .pin-dots-container.shake {
      animation: pinShake 0.4s ease;
    }
    .pin-dots-container.shake .pin-dot.filled {
      background: var(--danger, #ef4444);
      border-color: var(--danger, #ef4444);
    }

    .app-lock-error {
      color: #ef4444;
      font-size: 13px;
      margin-bottom: 16px;
      min-height: 20px;
    }

    /* 数字键盘 */
    .pin-keypad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      max-width: 260px;
      margin: 0 auto;
    }

    .pin-key {
      width: 72px;
      height: 56px;
      border: none;
      border-radius: 14px;
      background: rgba(255,255,255,0.1);
      color: #fff;
      font-size: 24px;
      font-weight: 600;
      font-family: var(--font-body);
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }

    .pin-key:hover { background: rgba(255,255,255,0.18); }
    .pin-key:active { transform: scale(0.93); background: rgba(255,255,255,0.25); }

    .pin-key-empty {
      background: transparent;
      cursor: default;
    }
    .pin-key-empty:hover { background: transparent; }
    .pin-key-empty:active { transform: none; }

    .pin-key-action {
      font-size: 18px;
    }

    /* ━━ Toggle Switch 开关组件 ━━ */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
    }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: var(--bg-tertiary, #ccc);
      border-radius: 24px;
      transition: background 0.3s;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      left: 2px;
      bottom: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .toggle-switch input:checked + .toggle-slider {
      background: var(--accent, #4F6EF7);
    }
    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(20px);
    }
`;
}
