/**
 * URL 智能匹配模块
 * 根据域名自动匹配/高亮对应的 OTP 卡片
 */
export function getURLMatchCode() {
	return `
    // ========== Feature: 🎯 URL 智能匹配 ==========

    // 常见服务 → 域名映射（模糊匹配，服务名小写）
    const DOMAIN_MAP = {
      'github': ['github.com'],
      'google': ['google.com', 'accounts.google.com', 'gmail.com'],
      'gmail': ['gmail.com', 'accounts.google.com'],
      'microsoft': ['microsoft.com', 'live.com', 'outlook.com', 'office.com'],
      'outlook': ['outlook.com', 'live.com'],
      'apple': ['apple.com', 'icloud.com', 'appleid.apple.com'],
      'icloud': ['icloud.com', 'apple.com'],
      'amazon': ['amazon.com', 'amazon.co.jp', 'amazon.co.uk', 'aws.amazon.com'],
      'aws': ['aws.amazon.com', 'console.aws.amazon.com'],
      'facebook': ['facebook.com', 'fb.com', 'meta.com'],
      'meta': ['meta.com', 'facebook.com'],
      'instagram': ['instagram.com'],
      'twitter': ['twitter.com', 'x.com'],
      'x': ['x.com', 'twitter.com'],
      'discord': ['discord.com', 'discordapp.com'],
      'slack': ['slack.com'],
      'telegram': ['telegram.org', 'web.telegram.org'],
      'linkedin': ['linkedin.com'],
      'reddit': ['reddit.com'],
      'dropbox': ['dropbox.com'],
      'cloudflare': ['cloudflare.com', 'dash.cloudflare.com'],
      'digitalocean': ['digitalocean.com', 'cloud.digitalocean.com'],
      'heroku': ['heroku.com'],
      'vercel': ['vercel.com'],
      'netlify': ['netlify.com', 'app.netlify.com'],
      'bitbucket': ['bitbucket.org'],
      'gitlab': ['gitlab.com'],
      'npm': ['npmjs.com', 'npm.com'],
      'docker': ['docker.com', 'hub.docker.com'],
      'pypi': ['pypi.org'],
      'stripe': ['stripe.com', 'dashboard.stripe.com'],
      'paypal': ['paypal.com'],
      'binance': ['binance.com'],
      'coinbase': ['coinbase.com'],
      'kraken': ['kraken.com'],
      'twilio': ['twilio.com'],
      'sendgrid': ['sendgrid.com'],
      'namecheap': ['namecheap.com'],
      'godaddy': ['godaddy.com'],
      'ovh': ['ovh.com'],
      'wordpress': ['wordpress.com', 'wordpress.org'],
      'shopify': ['shopify.com'],
      'notion': ['notion.so'],
      'figma': ['figma.com'],
      'trello': ['trello.com'],
      'atlassian': ['atlassian.com', 'atlassian.net'],
      'jira': ['atlassian.net'],
      'zoom': ['zoom.us'],
      'teams': ['teams.microsoft.com'],
      'proton': ['proton.me', 'protonmail.com', 'protonvpn.com'],
      'protonmail': ['protonmail.com', 'proton.me'],
      'bitwarden': ['bitwarden.com', 'vault.bitwarden.com'],
      '1password': ['1password.com'],
      'lastpass': ['lastpass.com'],
      'dashlane': ['dashlane.com'],
      'steam': ['steampowered.com', 'store.steampowered.com'],
      'epic': ['epicgames.com'],
      'twitch': ['twitch.tv'],
      'youtube': ['youtube.com'],
      'adobe': ['adobe.com'],
      'jetbrains': ['jetbrains.com', 'account.jetbrains.com'],
      'vultr': ['vultr.com', 'my.vultr.com'],
      'linode': ['linode.com', 'cloud.linode.com'],
      'hetzner': ['hetzner.com'],
      'aliyun': ['aliyun.com', 'alibabacloud.com'],
      'tencent': ['cloud.tencent.com', 'tencent.com'],
      'huawei': ['huaweicloud.com'],
      'baidu': ['baidu.com'],
      'okx': ['okx.com'],
      'bybit': ['bybit.com'],
      'gate': ['gate.io'],
      'gateio': ['gate.io'],
      'upbit': ['upbit.com'],
      'bitfinex': ['bitfinex.com'],
      'kucoin': ['kucoin.com'],
      'gemini': ['gemini.com'],
      'robinhood': ['robinhood.com'],
      'etrade': ['etrade.com'],
      'interactive brokers': ['interactivebrokers.com'],
      'backblaze': ['backblaze.com'],
      'wasabi': ['wasabi.com'],
      'openai': ['openai.com', 'chat.openai.com', 'platform.openai.com'],
      'chatgpt': ['chat.openai.com', 'openai.com'],
      'anthropic': ['anthropic.com', 'console.anthropic.com'],
      'claude': ['claude.ai', 'anthropic.com'],
      'sentry': ['sentry.io'],
      'datadog': ['datadoghq.com'],
      'grafana': ['grafana.com'],
      'porkbun': ['porkbun.com'],
      'epik': ['epik.com'],
      'gandi': ['gandi.net'],
      'hover': ['hover.com'],
      'name.com': ['name.com'],
      'dynadot': ['dynadot.com'],
    };

    /**
     * 根据服务名猜测可能的域名
     */
    function guessDomainsForService(serviceName) {
      if (!serviceName) return [];
      const name = serviceName.toLowerCase().trim();

      // 精确匹配
      if (DOMAIN_MAP[name]) return [...DOMAIN_MAP[name]];

      // 部分匹配：服务名包含关键词
      for (const [key, domains] of Object.entries(DOMAIN_MAP)) {
        if (name.includes(key) || key.includes(name)) {
          return [...domains];
        }
      }

      // 猜测：serviceName.com
      const sanitized = name.replace(/[^a-z0-9]/g, '');
      if (sanitized.length >= 3) {
        return [sanitized + '.com'];
      }

      return [];
    }

    /**
     * 从 URL 中提取域名
     */
    function extractDomain(input) {
      if (!input) return '';
      let url = input.trim();
      // 如果没有协议前缀，加上 https://
      if (!url.match(/^https?:\\/\\//)) url = 'https://' + url;
      try {
        const u = new URL(url);
        return u.hostname.replace(/^www\\./, '');
      } catch {
        // 如果解析失败，尝试从输入中取出域名部分
        return input.replace(/^(https?:\\/\\/)?/, '').replace(/\\/.*$/, '').replace(/^www\\./, '');
      }
    }

    /**
     * 匹配域名与密钥
     * @param {string} domain - 要匹配的域名
     * @returns {Array} 匹配到的 secret ID 列表
     */
    function matchSecretsForDomain(domain) {
      if (!domain) return [];
      domain = domain.toLowerCase();

      const matched = [];

      secrets.forEach(s => {
        // 1. 检查密钥自带的 domains 字段
        if (s.domains && Array.isArray(s.domains)) {
          for (const d of s.domains) {
            if (domainMatches(domain, d)) {
              matched.push(s.id);
              return;
            }
          }
        }

        // 2. 检查自动映射
        const guessed = guessDomainsForService(s.name);
        for (const d of guessed) {
          if (domainMatches(domain, d)) {
            matched.push(s.id);
            return;
          }
        }
      });

      return matched;
    }

    /**
     * 域名匹配（支持子域名）
     * 例如 "accounts.google.com" 匹配 "google.com"
     */
    function domainMatches(input, pattern) {
      if (!input || !pattern) return false;
      input = input.toLowerCase();
      pattern = pattern.toLowerCase();
      return input === pattern || input.endsWith('.' + pattern);
    }

    // --- URL 匹配 UI ---

    let urlMatchActive = false;
    let urlMatchedIds = [];

    /**
     * 显示 URL 匹配输入框
     */
    function showURLMatcher() {
      const bar = document.getElementById('urlMatchBar');
      if (!bar) return;
      bar.style.display = 'flex';
      setTimeout(() => bar.classList.add('show'), 10);
      const input = document.getElementById('urlMatchInput');
      if (input) {
        input.value = '';
        input.focus();
      }
      urlMatchActive = true;
    }

    /**
     * 隐藏 URL 匹配框并清除高亮
     */
    function hideURLMatcher() {
      const bar = document.getElementById('urlMatchBar');
      if (!bar) return;
      bar.classList.remove('show');
      setTimeout(() => bar.style.display = 'none', 200);
      clearURLHighlights();
      urlMatchActive = false;
      urlMatchedIds = [];
      // 恢复显示
      document.getElementById('urlMatchResult').textContent = '';
    }

    /**
     * 执行 URL 匹配
     */
    function performURLMatch() {
      const input = document.getElementById('urlMatchInput');
      const resultEl = document.getElementById('urlMatchResult');
      if (!input) return;

      const domain = extractDomain(input.value);
      if (!domain) {
        resultEl.textContent = '';
        clearURLHighlights();
        return;
      }

      const matchedIds = matchSecretsForDomain(domain);
      urlMatchedIds = matchedIds;

      if (matchedIds.length === 0) {
        resultEl.textContent = '未找到 ' + domain + ' 的匹配';
        resultEl.style.color = 'var(--text-tertiary)';
        clearURLHighlights();
      } else {
        resultEl.textContent = '找到 ' + matchedIds.length + ' 个匹配';
        resultEl.style.color = 'var(--success, #10B981)';
        applyURLHighlights(matchedIds);
      }
    }

    /**
     * 高亮匹配的卡片
     */
    function applyURLHighlights(ids) {
      // 先清除所有高亮
      clearURLHighlights();

      document.querySelectorAll('.secret-card').forEach(card => {
        // 从 card 的 onclick 中提取 secret ID
        const onclickStr = card.getAttribute('onclick') || '';
        const idMatch = onclickStr.match(/copyOTPFromCard\\(event,\\s*"([^"]+)"/);
        if (!idMatch) return;

        const cardId = idMatch[1];
        if (ids.includes(cardId)) {
          card.classList.add('url-matched');
          // 滚动到第一个匹配的卡片
          if (cardId === ids[0]) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          card.classList.add('url-dimmed');
        }
      });
    }

    /**
     * 清除 URL 匹配高亮
     */
    function clearURLHighlights() {
      document.querySelectorAll('.url-matched').forEach(el => el.classList.remove('url-matched'));
      document.querySelectorAll('.url-dimmed').forEach(el => el.classList.remove('url-dimmed'));
    }

    // --- 编辑弹窗中的域名字段 ---

    /**
     * 在编辑弹窗打开时填充域名
     */
    function fillDomainsField(secret) {
      const input = document.getElementById('secretDomains');
      if (!input || !secret) return;

      if (secret.domains && Array.isArray(secret.domains)) {
        input.value = secret.domains.join(', ');
      } else {
        // 自动猜测
        const guessed = guessDomainsForService(secret.name);
        input.value = guessed.join(', ');
        input.placeholder = guessed.length > 0 ? guessed.join(', ') : '例如：github.com, gitlab.com';
      }
    }

    /**
     * 从编辑弹窗中获取域名列表
     */
    function getDomainsFromInput() {
      const input = document.getElementById('secretDomains');
      if (!input) return [];
      return input.value
        .split(/[,;\\n]+/)
        .map(d => d.trim().toLowerCase())
        .filter(d => d.length > 0);
    }
`;
}
