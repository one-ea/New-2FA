/**
 * 安全仪表盘模块
 * 安全评分、风险检测、改进建议
 */
export function getDashboardCode() {
	return `
    // ========== Feature: 📊 安全仪表盘 ==========

    /**
     * 分析所有密钥的安全状态，返回评分和详细报告
     * @returns {{score: number, grade: string, checks: Array, stats: Object}}
     */
    function analyzeSecurityStatus() {
      const total = secrets.length;
      if (total === 0) {
        return { score: 0, grade: '-', checks: [], stats: { total: 0 } };
      }

      const checks = [];
      let deductions = 0; // 从 100 分开始扣

      // --- 1. 算法强度检测 ---
      const sha1Secrets = secrets.filter(s => !s.algorithm || s.algorithm === 'SHA1');
      const sha1Pct = sha1Secrets.length / total;
      if (sha1Pct > 0.5) {
        checks.push({
          id: 'algo-weak',
          severity: 'warning',
          icon: '🔧',
          title: '多数密钥使用 SHA1 算法',
          detail: sha1Secrets.length + '/' + total + ' 个密钥使用 SHA1，建议升级到 SHA256',
          items: sha1Secrets.map(s => s.name).slice(0, 5)
        });
        deductions += 10;
      } else if (sha1Secrets.length > 0) {
        checks.push({
          id: 'algo-mixed',
          severity: 'info',
          icon: '🔧',
          title: '部分密钥使用 SHA1 算法',
          detail: sha1Secrets.length + ' 个密钥使用 SHA1（多数服务强制，一般无需处理）',
          items: sha1Secrets.map(s => s.name).slice(0, 3)
        });
        deductions += 3;
      }

      // --- 2. 重复密钥检测（高危）---
      const secretMap = {};
      secrets.forEach(s => {
        const key = s.secret.toUpperCase();
        if (!secretMap[key]) secretMap[key] = [];
        secretMap[key].push(s.name);
      });
      const duplicates = Object.values(secretMap).filter(arr => arr.length > 1);
      if (duplicates.length > 0) {
        const dupNames = duplicates.flat();
        checks.push({
          id: 'duplicate-secret',
          severity: 'danger',
          icon: '🚨',
          title: '发现重复密钥！',
          detail: dupNames.length + ' 个密钥共享相同的 Secret，存在严重安全风险',
          items: duplicates.map(d => d.join(' = '))
        });
        deductions += 25;
      }

      // --- 3. 位数检测 ---
      const sixDigit = secrets.filter(s => !s.digits || s.digits === 6);
      // 6 位是默认，不视为问题，但 8 位更安全
      const eightDigit = secrets.filter(s => s.digits === 8);
      if (eightDigit.length > 0) {
        checks.push({
          id: 'digit-strong',
          severity: 'success',
          icon: '✅',
          title: eightDigit.length + ' 个密钥使用 8 位验证码',
          detail: '8 位验证码安全性更高',
          items: eightDigit.map(s => s.name).slice(0, 3)
        });
      }

      // --- 4. 缺少账户名检测 ---
      const noAccount = secrets.filter(s => !s.account || !s.account.trim());
      if (noAccount.length > 0) {
        checks.push({
          id: 'no-account',
          severity: 'info',
          icon: '📝',
          title: noAccount.length + ' 个密钥未设置账户名',
          detail: '添加账户名有助于区分同名服务的不同账户',
          items: noAccount.map(s => s.name).slice(0, 5)
        });
        deductions += Math.min(noAccount.length, 5);
      }

      // --- 5. HOTP 密钥检测（需要注意计数器同步）---
      const hotpSecrets = secrets.filter(s => s.type && s.type.toUpperCase() === 'HOTP');
      if (hotpSecrets.length > 0) {
        checks.push({
          id: 'hotp-present',
          severity: 'info',
          icon: '🔄',
          title: hotpSecrets.length + ' 个 HOTP 密钥',
          detail: 'HOTP 需保持计数器同步，建议定期验证',
          items: hotpSecrets.map(s => s.name)
        });
      }

      // --- 6. 覆盖率评估（密钥总数）---
      if (total <= 2) {
        checks.push({
          id: 'coverage-low',
          severity: 'warning',
          icon: '📉',
          title: '2FA 覆盖率较低',
          detail: '当前只有 ' + total + ' 个服务启用了 2FA，建议为更多重要服务开启',
          items: []
        });
        deductions += 10;
      } else if (total >= 10) {
        checks.push({
          id: 'coverage-good',
          severity: 'success',
          icon: '🛡️',
          title: '2FA 覆盖率良好',
          detail: '已为 ' + total + ' 个服务启用 2FA 保护',
          items: []
        });
      }

      // --- 7. 应用锁检测 ---
      if (!isAppLockEnabled()) {
        checks.push({
          id: 'no-app-lock',
          severity: 'warning',
          icon: '🔐',
          title: '未启用应用锁',
          detail: '建议启用 PIN 码锁定，防止他人直接查看你的验证码',
          items: [],
          action: { label: '立即设置', fn: 'showAppLockSettings' }
        });
        deductions += 8;
      } else {
        checks.push({
          id: 'app-lock-ok',
          severity: 'success',
          icon: '🔐',
          title: '应用锁已启用',
          detail: 'PIN 码保护已开启',
          items: []
        });
      }

      // --- 8. 备份检测（检查 localStorage 中的 WebDAV 配置）---
      const hasWebDAV = !!localStorage.getItem('2fa-webdav-config');
      if (!hasWebDAV) {
        checks.push({
          id: 'no-backup',
          severity: 'warning',
          icon: '💾',
          title: '未配置自动备份',
          detail: '建议配置 WebDAV 自动备份，防止数据丢失',
          items: []
        });
        deductions += 5;
      } else {
        checks.push({
          id: 'backup-ok',
          severity: 'success',
          icon: '💾',
          title: 'WebDAV 备份已配置',
          detail: '自动备份已就绪',
          items: []
        });
      }

      // 计算最终分数
      const score = Math.max(0, Math.min(100, 100 - deductions));
      let grade;
      if (score >= 90) grade = 'A';
      else if (score >= 75) grade = 'B';
      else if (score >= 60) grade = 'C';
      else if (score >= 40) grade = 'D';
      else grade = 'F';

      // 排序：danger > warning > info > success
      const severityOrder = { danger: 0, warning: 1, info: 2, success: 3 };
      checks.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

      return {
        score,
        grade,
        checks,
        stats: {
          total,
          sha1Count: sha1Secrets.length,
          duplicateGroups: duplicates.length,
          hotpCount: hotpSecrets.length,
          noAccountCount: noAccount.length,
          eightDigitCount: eightDigit.length
        }
      };
    }

    // --- 仪表盘 UI ---

    function showSecurityDashboard() {
      closeActionMenu();
      closeAllCardMenus();

      const report = analyzeSecurityStatus();
      const modal = document.getElementById('securityDashboardModal');
      if (!modal) return;

      // 渲染内容
      renderDashboardContent(report);

      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('show'), 10);
      disableBodyScroll();

      // 动画：分数环
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

      // 评分颜色
      const scoreColor = report.score >= 90 ? '#10B981' :
                         report.score >= 75 ? '#4F6EF7' :
                         report.score >= 60 ? '#F59E0B' :
                         report.score >= 40 ? '#F97316' : '#EF4444';

      let html = '';

      // --- 评分环 ---
      html += '<div class="dash-score-section">';
      html += '<div class="dash-score-ring-wrap">';
      html += '<svg class="dash-score-ring" viewBox="0 0 120 120">';
      html += '<circle class="dash-ring-bg" cx="60" cy="60" r="52" />';
      html += '<circle class="dash-ring-fg" id="dashRingFg" cx="60" cy="60" r="52" stroke="' + scoreColor + '" />';
      html += '</svg>';
      html += '<div class="dash-score-text">';
      html += '<span class="dash-score-num" id="dashScoreNum" style="color:' + scoreColor + '">0</span>';
      html += '<span class="dash-score-label">安全评分</span>';
      html += '</div>';
      html += '</div>';

      // 等级徽章
      html += '<div class="dash-grade" style="background:' + scoreColor + '">' + report.grade + '</div>';

      // 概要统计
      html += '<div class="dash-stats-row">';
      html += '<div class="dash-stat"><span class="dash-stat-num">' + report.stats.total + '</span><span class="dash-stat-label">服务数</span></div>';
      html += '<div class="dash-stat"><span class="dash-stat-num">' + report.checks.filter(c => c.severity === 'success').length + '</span><span class="dash-stat-label">通过</span></div>';
      html += '<div class="dash-stat"><span class="dash-stat-num">' + report.checks.filter(c => c.severity === 'warning' || c.severity === 'danger').length + '</span><span class="dash-stat-label">待改进</span></div>';
      html += '</div>';
      html += '</div>';

      // --- 检查项列表 ---
      html += '<div class="dash-checks">';
      report.checks.forEach(check => {
        const severityClass = 'dash-check-' + check.severity;
        html += '<div class="dash-check-item ' + severityClass + '">';
        html += '<span class="dash-check-icon">' + check.icon + '</span>';
        html += '<div class="dash-check-body">';
        html += '<div class="dash-check-title">' + check.title + '</div>';
        html += '<div class="dash-check-detail">' + check.detail + '</div>';

        // 受影响的项
        if (check.items && check.items.length > 0) {
          html += '<div class="dash-check-items">';
          check.items.forEach(item => {
            html += '<span class="dash-check-tag">' + item + '</span>';
          });
          html += '</div>';
        }

        // 操作按钮
        if (check.action) {
          html += '<button class="dash-check-action" onclick="' + check.action.fn + '(); hideSecurityDashboard();">' + check.action.label + '</button>';
        }

        html += '</div>';
        html += '</div>';
      });
      html += '</div>';

      container.innerHTML = html;
    }

    /**
     * 评分环动画
     */
    function animateScoreRing(targetScore) {
      const ring = document.getElementById('dashRingFg');
      const numEl = document.getElementById('dashScoreNum');
      if (!ring || !numEl) return;

      const circumference = 2 * Math.PI * 52;
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = circumference;

      // 动画到目标值
      let current = 0;
      const step = targetScore / 40; // 40 帧完成
      const timer = setInterval(() => {
        current += step;
        if (current >= targetScore) {
          current = targetScore;
          clearInterval(timer);
        }
        const offset = circumference * (1 - current / 100);
        ring.style.strokeDashoffset = offset;
        numEl.textContent = Math.round(current);
      }, 20);
    }
`;
}
