/**
 * 组件样式 v4.1 — 方案 C 精修：对齐概念图
 */
export function getComponentStyles() {
	return `
    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       Google Authenticator 格式列表
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .secrets-list {
      display: flex;
      flex-direction: column;
      gap: 0;
      padding-bottom: 110px;
    }

    /* ── 列表宽行卡片（纯平态无阴影边框的 MD3 列表） ── */
    .secret-card {
      display: flex;
      align-items: center;
      background: transparent;
      border-radius: 0;
      padding: 20px 24px;
      min-height: 96px; /* 恢复为超大块布局 */
      border-bottom: 1px solid var(--border-primary);
      transition: background-color var(--duration-normal) var(--ease-out);
      position: relative;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      gap: 16px;
    }

    .secret-card:last-child {
      border-bottom: none;
    }

    .secret-card:hover {
      background: var(--bg-hover);
    }

    .secret-card:active {
      background: var(--bg-active);
    }

    /* ── 左侧：品牌图标 (Google 风格纯色圆) ── */
    .card-icon {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      color: #fff;
      font-weight: 500;
      font-size: 18px;
    }

    .card-icon img {
      width: 80%;
      height: 80%;
      object-fit: contain;
    }
    
    .fallback-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }

    /* ── 中间：服务名 + 超大验证码 + 账户名 ── */
    .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      justify-content: center;
    }

    .card-issuer {
      font-size: 14px;
      font-family: var(--font-body);
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
      line-height: 1.2;
      font-weight: 500;
      letter-spacing: 0;
    }
    
    .card-issuer span {
      font-size: 10px;
      color: var(--text-tertiary);
      font-weight: normal;
    }

    .card-otp {
      font-family: var(--font-mono);
      font-size: 38px;
      font-weight: 500;
      color: var(--text-primary);
      letter-spacing: 3px;
      line-height: 1.2;
      margin: 4px 0;
      transition: opacity var(--duration-fast);
    }

    .card-otp:hover {
      opacity: 0.7;
    }

    .otp-next-preview {
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--accent);
      margin-top: 4px;
    }

    .card-account {
      font-size: 14px;
      font-family: var(--font-body);
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 4px;
      line-height: 1.2;
    }

    /* ── 右侧：操作区 (倒计时及菜单) ── */
    .card-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    /* 环形倒计时 */
    .timer-ring-wrapper {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .timer-ring {
      transform: rotate(-90deg);
    }
    
    .timer-ring-track {
      fill: none;
      stroke: var(--border-secondary);
      stroke-width: 4;
    }

    .timer-ring-fill {
      fill: none;
      stroke-width: 4;
      stroke-dasharray: 62.8318;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
    }

    /* 卡片菜单按钮 */
    .card-menu-wrapper {
      position: relative;
      cursor: pointer;
      padding: 8px;
      margin: -8px 0 -8px -8px;
      border-radius: 50%;
      transition: background var(--duration-fast);
      color: var(--text-tertiary);
    }

    .card-menu-wrapper:hover { 
      background: var(--bg-hover); 
      color: var(--text-primary);
    }

    .menu-dots {
      font-size: 20px;
      line-height: 1;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    /* 菜单下拉项 (继承 M3 风格) */
    .card-menu-dropdown {
      display: none;
      position: absolute;
      top: 36px; right: 0;
      background: var(--menu-bg);
      border: 1px solid var(--border-primary);
      border-radius: 12px;
      min-width: 140px;
      width: fit-content;
      box-shadow: var(--shadow-md);
      z-index: 10000;
      overflow: hidden;
      padding: 4px 0;
    }

    .card-menu-dropdown.show { display: block; }

    .menu-item {
      padding: 10px 16px;
      color: var(--text-primary);
      cursor: pointer;
      transition: background var(--duration-fast);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      font-family: var(--font-body);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .mi {
      font-size: 14px;
      width: 18px;
      text-align: center;
      flex-shrink: 0;
      line-height: 1;
    }

    .menu-item:hover { background: var(--menu-item-hover); }

    .menu-divider {
      height: 1px;
      background: var(--border-primary);
      margin: 4px 0;
    }

    .menu-item-danger { color: var(--danger) !important; }
    .menu-item-danger:hover { background: var(--danger-light) !important; }

    /* ━━ 内嵌工具箱 ━━ */
    .toolbox-section {
      margin: 24px 0 0;
      border-top: 1px solid var(--border-secondary);
      padding-top: 16px;
    }

    .toolbox-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 0;
      user-select: none;
    }

    .toolbox-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .toolbox-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 12px;
    }

    .toolbox-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 14px 8px;
      border: 1px solid var(--border-secondary);
      border-radius: var(--radius-md);
      background: var(--card-bg);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--duration-fast);
      font-family: var(--font-body);
      font-size: 0;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    .toolbox-item:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--bg-hover);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .toolbox-item:active { transform: scale(0.97); }

    .toolbox-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
    }
    .toolbox-item:hover .toolbox-icon { opacity: 1; }

    .toolbox-label {
      font-size: 11px;
      font-weight: 500;
      line-height: 1.2;
      text-align: center;
      white-space: nowrap;
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

    /* ━━ 响应式卡片调整 ━━ */
    @media (max-width: 580px) {
      .secrets-list {
        gap: 0;
      }
      .card-otp { font-size: 28px; letter-spacing: 1px; }
      .toolbox-grid {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      }
    }

    @media (max-width: 480px) {
      .secret-card { padding: 16px 16px; gap: 16px; }
      .card-otp { font-size: 34px; margin: 2px 0; }
      .card-icon { width: 40px; height: 40px; font-size: 18px; }
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
       📊 内嵌安全仪表盘卡片
       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    .inline-dashboard { margin-bottom: 16px; }

    .inline-dash-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 18px;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-md);
      box-shadow: var(--card-shadow);
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-out);
      user-select: none;
    }
    .inline-dash-card:hover {
      border-color: var(--card-hover-border);
      box-shadow: var(--card-hover-shadow);
      transform: translateY(-1px);
    }
    .inline-dash-card:active { transform: translateY(0) scale(0.995); }

    .inline-dash-score {
      position: relative;
      width: 56px; height: 56px;
      flex-shrink: 0;
    }
    .inline-dash-ring { width: 56px; height: 56px; }
    .inline-ring-fg { transition: stroke-dashoffset 0.8s var(--ease-out); }
    .inline-dash-num {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px; font-weight: 800;
      font-family: var(--font-mono);
    }

    .inline-dash-info { flex: 1; min-width: 0; }
    .inline-dash-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
    }
    .inline-dash-grade {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px; height: 22px;
      border-radius: 6px;
      color: white;
      font-size: 11px; font-weight: 800;
      flex-shrink: 0;
    }
    .inline-dash-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .inline-dash-summary { font-size: 12px; color: var(--text-secondary); line-height: 1.3; }

    .inline-dash-pills {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
      max-width: 300px;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .inline-dash-pills::-webkit-scrollbar { display: none; }
    .inline-pill {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px; font-weight: 500;
      white-space: nowrap;
    }
    .inline-pill.danger { background: var(--danger-light); color: var(--danger); }
    .inline-pill.warning { background: var(--warning-light); color: var(--warning); }
    .inline-pill.success { background: var(--success-light); color: var(--success); }

    .inline-dash-arrow {
      flex-shrink: 0;
      color: var(--text-tertiary);
      transition: transform var(--duration-fast);
    }
    .inline-dash-card:hover .inline-dash-arrow {
      transform: translateX(2px);
      color: var(--accent);
    }

    @media (max-width: 768px) { .inline-dash-pills { display: none; } }
    @media (max-width: 480px) {
      .inline-dash-card { padding: 10px 14px; gap: 12px; }
      .inline-dash-score { width: 44px; height: 44px; }
      .inline-dash-ring { width: 44px; height: 44px; }
      .inline-dash-num { font-size: 13px; }
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
