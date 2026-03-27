/**
 * 安全仪表盘模块
 * 支持两种展示模式：
 * 1. 内嵌卡片（主页实时显示）
 * 2. 弹窗详情（点击卡片展开完整报告）
 */
export function getDashboardCode() {
	return `
    // ========== Feature: 📊 安全仪表盘 ==========

    /**
     * 分析所有密钥的安全状态
     */
    function analyzeSecurityStatus() {
      const total = secrets.length;
      if (total === 0) {
        return { score: 0, grade: '-', checks: [], stats: { total: 0 } };
      }

      const checks = [];
      let deductions = 0;

      // 1. 算法强度
      const sha1Secrets = secrets.filter(s => !s.algorithm || s.algorithm === 'SHA1');
      const sha1Pct = sha1Secrets.length / total;
      if (sha1Pct > 0.5) {
        checks.push({ id: 'algo-weak', severity: 'warning', icon: '🔧', title: '多数密钥使用 SHA1 算法', detail: sha1Secrets.length + '/' + total + ' 个密钥使用 SHA1，建议升级到 SHA256', items: sha1Secrets.map(s => s.name).slice(0, 5) });
        deductions += 10;
      } else if (sha1Secrets.length > 0) {
        checks.push({ id: 'algo-mixed', severity: 'info', icon: '🔧', title: '部分密钥使用 SHA1 算法', detail: sha1Secrets.length + ' 个密钥使用 SHA1（多数服务强制，一般无需处理）', items: sha1Secrets.map(s => s.name).slice(0, 3) });
        deductions += 3;
      }

      // 2. 重复密钥（高危）
      const secretMap = {};
      secrets.forEach(s => { const key = s.secret.toUpperCase(); if (!secretMap[key]) secretMap[key] = []; secretMap[key].push(s.name); });
      const duplicates = Object.values(secretMap).filter(arr => arr.length > 1);
      if (duplicates.length > 0) {
        checks.push({ id: 'duplicate-secret', severity: 'danger', icon: '🚨', title: '发现重复密钥！', detail: duplicates.flat().length + ' 个密钥共享相同的 Secret，存在严重安全风险', items: duplicates.map(d => d.join(' = ')) });
        deductions += 25;
      }

      // 3. 位数检测
      const eightDigit = secrets.filter(s => s.digits === 8);
      if (eightDigit.length > 0) {
        checks.push({ id: 'digit-strong', severity: 'success', icon: '✅', title: eightDigit.length + ' 个密钥使用 8 位验证码', detail: '8 位验证码安全性更高', items: eightDigit.map(s => s.name).slice(0, 3) });
      }

      // 4. 缺少账户名
      const noAccount = secrets.filter(s => !s.account || !s.account.trim());
      if (noAccount.length > 0) {
        checks.push({ id: 'no-account', severity: 'info', icon: '📝', title: noAccount.length + ' 个密钥未设置账户名', detail: '添加账户名有助于区分同名服务的不同账户', items: noAccount.map(s => s.name).slice(0, 5) });
        deductions += Math.min(noAccount.length, 5);
      }

      // 5. HOTP
      const hotpSecrets = secrets.filter(s => s.type && s.type.toUpperCase() === 'HOTP');
      if (hotpSecrets.length > 0) {
        checks.push({ id: 'hotp-present', severity: 'info', icon: '🔄', title: hotpSecrets.length + ' 个 HOTP 密钥', detail: 'HOTP 需保持计数器同步，建议定期验证', items: hotpSecrets.map(s => s.name) });
      }

      // 6. 覆盖率
      if (total <= 2) { checks.push({ id: 'coverage-low', severity: 'warning', icon: '📉', title: '2FA 覆盖率较低', detail: '当前只有 ' + total + ' 个服务启用了 2FA，建议为更多重要服务开启', items: [] }); deductions += 10; }
      else if (total >= 10) { checks.push({ id: 'coverage-good', severity: 'success', icon: '🛡️', title: '2FA 覆盖率良好', detail: '已为 ' + total + ' 个服务启用 2FA 保护', items: [] }); }

      // 7. 应用锁
      if (!isAppLockEnabled()) { checks.push({ id: 'no-app-lock', severity: 'warning', icon: '🔐', title: '未启用应用锁', detail: '建议启用 PIN 码锁定，防止他人直接查看你的验证码', items: [], action: { label: '立即设置', fn: 'showAppLockSettings' } }); deductions += 8; }
      else { checks.push({ id: 'app-lock-ok', severity: 'success', icon: '🔐', title: '应用锁已启用', detail: 'PIN 码保护已开启', items: [] }); }

      // 8. 备份
      const hasWebDAV = !!localStorage.getItem('2fa-webdav-config');
      if (!hasWebDAV) { checks.push({ id: 'no-backup', severity: 'warning', icon: '💾', title: '未配置自动备份', detail: '建议配置 WebDAV 自动备份，防止数据丢失', items: [] }); deductions += 5; }
      else { checks.push({ id: 'backup-ok', severity: 'success', icon: '💾', title: 'WebDAV 备份已配置', detail: '自动备份已就绪', items: [] }); }

      const score = Math.max(0, Math.min(100, 100 - deductions));
      let grade;
      if (score >= 90) grade = 'A'; else if (score >= 75) grade = 'B'; else if (score >= 60) grade = 'C'; else if (score >= 40) grade = 'D'; else grade = 'F';

      const severityOrder = { danger: 0, warning: 1, info: 2, success: 3 };
      checks.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

      return { score, grade, checks, stats: { total, sha1Count: sha1Secrets.length, duplicateGroups: duplicates.length, hotpCount: hotpSecrets.length, noAccountCount: noAccount.length, eightDigitCount: eightDigit.length } };
    }

    // ========== 内嵌仪表盘（主页卡片） ==========

    /**
     * 渲染内嵌安全仪表盘卡片
     * 在 loadSecrets 完成后调用
     */
    function renderInlineDashboard() {
      const container = document.getElementById('inlineDashboard');
      if (!container || secrets.length === 0) {
        if (container) container.style.display = 'none';
        return;
      }

      const report = analyzeSecurityStatus();
      const scoreColor = report.score >= 90 ? '#10B981' :
                         report.score >= 75 ? '#4F6EF7' :
                         report.score >= 60 ? '#F59E0B' :
                         report.score >= 40 ? '#F97316' : '#EF4444';

      const warnings = report.checks.filter(c => c.severity === 'danger' || c.severity === 'warning');
      const passed = report.checks.filter(c => c.severity === 'success');

      // 紧凑的横向卡片
      let html = '<div class="inline-dash-card" onclick="showSecurityDashboard()">';

      // 左侧：迷你评分环
      html += '<div class="inline-dash-score">';
      html += '<svg class="inline-dash-ring" viewBox="0 0 60 60">';
      html += '<circle cx="30" cy="30" r="24" fill="none" stroke="var(--border-primary)" stroke-width="3" opacity="0.3"/>';
      html += '<circle class="inline-ring-fg" cx="30" cy="30" r="24" fill="none" stroke="' + scoreColor + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="' + (2 * Math.PI * 24) + '" stroke-dashoffset="' + (2 * Math.PI * 24 * (1 - report.score / 100)) + '" transform="rotate(-90 30 30)"/>';
      html += '</svg>';
      html += '<span class="inline-dash-num" style="color:' + scoreColor + '">' + report.score + '</span>';
      html += '</div>';

      // 中间：等级 + 摘要
      html += '<div class="inline-dash-info">';
      html += '<div class="inline-dash-header">';
      html += '<span class="inline-dash-grade" style="background:' + scoreColor + '">' + report.grade + '</span>';
      html += '<span class="inline-dash-title">安全评分</span>';
      html += '</div>';

      // 摘要文字
      if (warnings.length > 0) {
        html += '<div class="inline-dash-summary">' + warnings.length + ' 项待改进';
        if (passed.length > 0) html += '，' + passed.length + ' 项已通过';
        html += '</div>';
      } else {
        html += '<div class="inline-dash-summary" style="color:var(--success)">🎉 全部检查通过</div>';
      }
      html += '</div>';

      // 右侧：关键指标 pills
      html += '<div class="inline-dash-pills">';
      if (report.stats.duplicateGroups > 0) {
        html += '<span class="inline-pill danger">🚨 ' + report.stats.duplicateGroups + ' 组重复</span>';
      }
      warnings.forEach(w => {
        if (w.id !== 'duplicate-secret') {
          html += '<span class="inline-pill warning">' + w.icon + ' ' + w.title.substring(0, 8) + '</span>';
        }
      });
      if (warnings.length === 0) {
        html += '<span class="inline-pill success">✅ 安全状态良好</span>';
      }
      html += '</div>';

      // 展开箭头
      html += '<div class="inline-dash-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,6 15,12 9,18"/></svg></div>';

      html += '</div>';
      container.innerHTML = html;
      container.style.display = 'block';
    }

    // ========== 弹窗仪表盘 ==========

    function showSecurityDashboard() {
      closeActionMenu();
      closeAllCardMenus();
      const report = analyzeSecurityStatus();
      const modal = document.getElementById('securityDashboardModal');
      if (!modal) return;
      renderDashboardContent(report);
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('show'), 10);
      disableBodyScroll();
      setTimeout(() => animateScoreRing(report.score), 200);
    }

    function hideSecurityDashboard() {
      const modal = document.getElementById('securityDashboardModal');
      if (!modal) return;
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 200);
      enableBodyScroll();
    }

    function renderDashboardContent(report) {
      const container = document.getElementById('dashboardContent');
      if (!container) return;

      const scoreColor = report.score >= 90 ? '#10B981' : report.score >= 75 ? '#4F6EF7' : report.score >= 60 ? '#F59E0B' : report.score >= 40 ? '#F97316' : '#EF4444';

      let html = '<div class="dash-score-section">';
      html += '<div class="dash-score-ring-wrap">';
      html += '<svg class="dash-score-ring" viewBox="0 0 120 120"><circle class="dash-ring-bg" cx="60" cy="60" r="52" /><circle class="dash-ring-fg" id="dashRingFg" cx="60" cy="60" r="52" stroke="' + scoreColor + '" /></svg>';
      html += '<div class="dash-score-text"><span class="dash-score-num" id="dashScoreNum" style="color:' + scoreColor + '">0</span><span class="dash-score-label">安全评分</span></div>';
      html += '</div>';
      html += '<div class="dash-grade" style="background:' + scoreColor + '">' + report.grade + '</div>';
      html += '<div class="dash-stats-row">';
      html += '<div class="dash-stat"><span class="dash-stat-num">' + report.stats.total + '</span><span class="dash-stat-label">服务数</span></div>';
      html += '<div class="dash-stat"><span class="dash-stat-num">' + report.checks.filter(c => c.severity === 'success').length + '</span><span class="dash-stat-label">通过</span></div>';
      html += '<div class="dash-stat"><span class="dash-stat-num">' + report.checks.filter(c => c.severity === 'warning' || c.severity === 'danger').length + '</span><span class="dash-stat-label">待改进</span></div>';
      html += '</div></div>';

      html += '<div class="dash-checks">';
      report.checks.forEach(check => {
        html += '<div class="dash-check-item dash-check-' + check.severity + '">';
        html += '<span class="dash-check-icon">' + check.icon + '</span>';
        html += '<div class="dash-check-body">';
        html += '<div class="dash-check-title">' + check.title + '</div>';
        html += '<div class="dash-check-detail">' + check.detail + '</div>';
        if (check.items && check.items.length > 0) {
          html += '<div class="dash-check-items">';
          check.items.forEach(item => { html += '<span class="dash-check-tag">' + item + '</span>'; });
          html += '</div>';
        }
        if (check.action) { html += '<button class="dash-check-action" onclick="' + check.action.fn + '(); hideSecurityDashboard();">' + check.action.label + '</button>'; }
        html += '</div></div>';
      });
      html += '</div>';
      container.innerHTML = html;
    }

    function animateScoreRing(targetScore) {
      const ring = document.getElementById('dashRingFg');
      const numEl = document.getElementById('dashScoreNum');
      if (!ring || !numEl) return;
      const circumference = 2 * Math.PI * 52;
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = circumference;
      let current = 0;
      const step = targetScore / 40;
      const timer = setInterval(() => {
        current += step;
        if (current >= targetScore) { current = targetScore; clearInterval(timer); }
        ring.style.strokeDashoffset = circumference * (1 - current / 100);
        numEl.textContent = Math.round(current);
      }, 20);
    }
`;
}
