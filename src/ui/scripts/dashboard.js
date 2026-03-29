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

      // 1. 算法情况 (仅提示，因大多数网站强制使用 SHA1)
      const sha256Secrets = secrets.filter(s => s.algorithm && (s.algorithm.toUpperCase() === 'SHA256' || s.algorithm.toUpperCase() === 'SHA512'));
      if (sha256Secrets.length > 0) {
        checks.push({ id: 'algo-strong', severity: 'success', icon: '🛡️', title: sha256Secrets.length + ' 个应用使用强哈希算法', detail: '采用了安全级别更高的 SHA-256 / SHA-512', items: sha256Secrets.map(s => s.name).slice(0, 3) });
      } else {
        checks.push({ id: 'algo-standard', severity: 'info', icon: 'ℹ️', title: '所有密钥使用 SHA1 标准算法', detail: '这是行业默认标准，符合绝大多数网站的传统规范', items: [] });
      }

      // 2. 重复密钥（高危漏洞）
      const secretMap = {};
      secrets.forEach(s => { 
        if (!s.secret) return;
        const key = s.secret.toUpperCase(); 
        if (!secretMap[key]) secretMap[key] = []; 
        secretMap[key].push(s.name); 
      });
      const duplicates = Object.values(secretMap).filter(arr => arr.length > 1);
      if (duplicates.length > 0) {
        checks.push({ id: 'duplicate-secret', severity: 'danger', icon: '🚨', title: '系统发现重复密钥', detail: duplicates.flat().length + ' 个账户共享了相同的底层通讯 Secret，一旦泄露将造成连带影响', items: duplicates.map(d => d.join(' = ')) });
        deductions += 30;
      }

      // 3. 极短 Secret 预警 (低于 16 字 Base32 = 80 Bits 熵)
      const weakSecrets = secrets.filter(s => s.secret && s.secret.replace(/=/g, '').length < 16);
      if (weakSecrets.length > 0) {
        checks.push({ id: 'secret-weak', severity: 'warning', icon: '📏', title: weakSecrets.length + ' 个密钥的文本过短', detail: '密钥随机性较弱，强烈建议前往对应平台取消绑定并重新生成新的身份码', items: weakSecrets.map(s => s.name).slice(0, 5) });
        deductions += 15;
      }

      // 4. 时效参数异动检测 (过长生命周期)
      const extremelyLongPeriod = secrets.filter(s => s.period && parseInt(s.period) > 60);
      if (extremelyLongPeriod.length > 0) {
        checks.push({ id: 'period-very-long', severity: 'warning', icon: '⏱️', title: extremelyLongPeriod.length + ' 个验证码刷新周期异常', detail: '有效时间超过 60 秒，被钓鱼或截获重放的可能性增加', items: extremelyLongPeriod.map(s => s.name).slice(0, 5) });
        deductions += 10;
      }

      // 5. 高阶验证码形态 (8位数或更多)
      const strongDigit = secrets.filter(s => s.digits && s.digits >= 8);
      if (strongDigit.length > 0) {
        checks.push({ id: 'digit-strong', severity: 'success', icon: '✨', title: strongDigit.length + ' 个启用增强型验证码', detail: '应用采用了 8 位或更多验证码数字，极大地下降碰撞几率', items: strongDigit.map(s => s.name).slice(0, 3) });
      }

      // 6. 数据完整度：账户名称缺失
      const noAccount = secrets.filter(s => !s.account || !s.account.trim());
      if (noAccount.length > 0) {
        checks.push({ id: 'no-account', severity: 'info', icon: '📝', title: noAccount.length + ' 个业务未设置账户标识', detail: '没有明确的 Account 名称可能会让你在拥有同一个平台多个小号时发生混淆', items: noAccount.map(s => s.name).slice(0, 5) });
        deductions += 5;
      }

      // 7. 数据完整度：服务商 Issuer 缺失
      const noIssuer = secrets.filter(s => !s.issuer || !s.issuer.trim());
      if (noIssuer.length > 0) {
        checks.push({ id: 'no-issuer', severity: 'info', icon: '🏷️', title: noIssuer.length + ' 个业务未指定服务商', detail: '缺少 Issuer 发行方信息，应用将无法在展示与搜索中有效关联相应的图标', items: noIssuer.map(s => s.name).slice(0, 5) });
      }

      // 8. 全面防暴覆盖率评估
      if (total <= 3) { 
        checks.push({ id: 'coverage-low', severity: 'warning', icon: '📉', title: '2FA 防御面过于狭窄', detail: '当前仅有 ' + total + ' 个服务接入了验证码，建议为您持有的微信、银行、邮箱等均设置多重守护', items: [] }); 
        deductions += 5; 
      } else if (total >= 15) { 
        checks.push({ id: 'coverage-good', severity: 'success', icon: '🛡️', title: '数字防御体系完善', detail: '已累计为 ' + total + ' 个关键网络资产开启 2FA，安全意识非常出众！', items: [] }); 
      }

      // 9. 物理/本地防渗透：前置应用锁
      if (!isAppLockEnabled()) { 
        checks.push({ id: 'no-app-lock', severity: 'warning', icon: '🔓', title: '设备处于免密敞开状态', detail: '未配置主 PIN 码，任何人拿到您的设备都可随意窥视全盘验证口令', items: [], action: { label: '设置应用锁', fn: 'showAppLockSettings' } }); 
        deductions += 20; 
      } else { 
        checks.push({ id: 'app-lock-ok', severity: 'success', icon: '🔒', title: '本地防物理渗透已启用', detail: '强力的 PIN 盾牌保护了底层数据访问权', items: [] }); 
      }

      // 10. 云存储与容灾能力：私有 WebDAV
      const hasWebDAV = !!localStorage.getItem('2fa-webdav-config');
      if (!hasWebDAV) { 
        checks.push({ id: 'no-backup', severity: 'warning', icon: '☁️', title: '异地云端容灾未打通', detail: '推荐立即建立与私有 WebDAV 的加密连接，为设备丢失或损坏提前做好准备计划', items: [], action: { label: '部署备份', fn: 'showWebDAVModal' } }); 
        deductions += 10; 
      } else { 
        checks.push({ id: 'backup-ok', severity: 'success', icon: '💽', title: '三维架构冷热异地灾备完成', detail: '基于自动化的 WebDAV 数据管道已经处于工作状态', items: [] }); 
      }

      const score = Math.max(0, Math.min(100, 100 - deductions));
      let grade;
      if (score >= 95) grade = 'S+'; 
      else if (score >= 90) grade = 'S'; 
      else if (score >= 80) grade = 'A'; 
      else if (score >= 65) grade = 'B'; 
      else if (score >= 40) grade = 'C'; 
      else grade = 'D';

      const severityOrder = { danger: 0, warning: 1, info: 2, success: 3 };
      checks.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

      return { 
        score, grade, checks, 
        stats: { total, weakCount: weakSecrets.length, duplicateGroups: duplicates.length, noAccountCount: noAccount.length, strongDigitCount: strongDigit.length, noIssuerCount: noIssuer.length } 
      };
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
                         report.score >= 80 ? '#4F6EF7' :
                         report.score >= 65 ? '#F59E0B' :
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
      let pillCount = 0;
      if (report.stats.duplicateGroups > 0) {
        html += '<span class="inline-pill danger">🚨 ' + report.stats.duplicateGroups + ' 组重复</span>';
        pillCount++;
      }
      
      let warningsRendered = 0;
      const otherWarnings = warnings.filter(w => w.id !== 'duplicate-secret');
      
      otherWarnings.forEach(w => {
        if (pillCount < 3) {
          html += '<span class="inline-pill warning">' + w.icon + ' ' + w.title.substring(0, 10) + '</span>';
          warningsRendered++;
          pillCount++;
        }
      });
      
      const unrendered = otherWarnings.length - warningsRendered;
      if (unrendered > 0) {
         html += '<span class="inline-pill" style="background:var(--bg-tertiary);color:var(--text-secondary)">+' + unrendered + ' 项</span>';
      }
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

      const scoreColor = report.score >= 90 ? '#10B981' : 
                         report.score >= 80 ? '#4F6EF7' : 
                         report.score >= 65 ? '#F59E0B' : 
                         report.score >= 40 ? '#F97316' : '#EF4444';

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
