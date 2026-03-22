/**
 * 搜索、排序与筛选模块
 * 包含搜索折叠、Filter Chips（全部/收藏/最近使用）、排序
 */
export function getSearchCode() {
	return `    // ========== 搜索、排序与筛选模块 ==========

    // 排序与筛选变量
    let currentSortType = 'oldest-first';
    let currentFilter = 'all'; // 'all' | 'favorites' | 'recent'

    // ── 收藏管理（localStorage） ──
    function getFavorites() {
      try {
        return JSON.parse(localStorage.getItem('2fa-favorites') || '[]');
      } catch (e) { return []; }
    }

    function setFavorites(ids) {
      try { localStorage.setItem('2fa-favorites', JSON.stringify(ids)); } catch(e) {}
    }

    function toggleFavorite(secretId) {
      const favs = getFavorites();
      const idx = favs.indexOf(secretId);
      if (idx >= 0) {
        favs.splice(idx, 1);
        showCenterToast('☆', '已取消收藏');
      } else {
        favs.push(secretId);
        showCenterToast('★', '已添加到收藏');
      }
      setFavorites(favs);
      // 如果当前在收藏 tab，重新渲染
      if (currentFilter === 'favorites') {
        applyFilter();
      }
      // 更新菜单图标
      updateFavoriteIcons();
    }

    function isFavorite(secretId) {
      return getFavorites().includes(secretId);
    }

    function updateFavoriteIcons() {
      secrets.forEach(s => {
        const menuItem = document.querySelector('#menu-' + s.id + ' .menu-item-fav');
        if (menuItem) {
          menuItem.textContent = isFavorite(s.id) ? '★ 取消收藏' : '☆ 收藏';
        }
      });
    }

    // ── 最近使用追踪（localStorage） ──
    function getRecentlyUsed() {
      try {
        return JSON.parse(localStorage.getItem('2fa-recent') || '[]');
      } catch (e) { return []; }
    }

    function recordRecentUse(secretId) {
      try {
        let recent = getRecentlyUsed().filter(r => r.id !== secretId);
        recent.unshift({ id: secretId, time: Date.now() });
        // 只保留最近 20 条
        recent = recent.slice(0, 20);
        localStorage.setItem('2fa-recent', JSON.stringify(recent));
      } catch(e) {}
    }

    function getRecentSecretIds() {
      // 返回最近 24 小时内使用过的 secret ID
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      return getRecentlyUsed()
        .filter(r => r.time > cutoff)
        .map(r => r.id);
    }

    // ── 折叠搜索 ──
    function toggleSearch() {
      const expanded = document.getElementById('searchExpanded');
      const toggleBtn = document.getElementById('searchToggleBtn');
      if (expanded.style.display === 'none') {
        expanded.style.display = 'flex';
        toggleBtn.style.display = 'none';
        // 延迟聚焦保证 DOM 渲染完成
        setTimeout(() => {
          document.getElementById('searchInput').focus();
        }, 50);
      } else {
        collapseSearch();
      }
    }

    function collapseSearch() {
      const expanded = document.getElementById('searchExpanded');
      const toggleBtn = document.getElementById('searchToggleBtn');
      const input = document.getElementById('searchInput');
      input.value = '';
      filterSecrets('');
      expanded.style.display = 'none';
      toggleBtn.style.display = 'flex';
    }

    function collapseSearchIfEmpty() {
      const input = document.getElementById('searchInput');
      // 延迟执行，避免点击 close 按钮时冲突
      setTimeout(() => {
        if (!input.value.trim()) {
          collapseSearch();
        }
      }, 200);
    }

    // ── Filter Chips ──
    function setFilter(filterType) {
      currentFilter = filterType;
      // 更新 chip 激活状态
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      const chipId = filterType === 'all' ? 'chipAll' :
                     filterType === 'favorites' ? 'chipFav' : 'chipRecent';
      document.getElementById(chipId).classList.add('active');
      applyFilter();
    }

    async function applyFilter() {
      const searchInput = document.getElementById('searchInput');
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

      if (currentFilter === 'all') {
        filteredSecrets = [...secrets];
      } else if (currentFilter === 'favorites') {
        const favs = getFavorites();
        filteredSecrets = secrets.filter(s => favs.includes(s.id));
      } else if (currentFilter === 'recent') {
        const recentIds = getRecentSecretIds();
        // 按使用时间排序
        filteredSecrets = recentIds
          .map(id => secrets.find(s => s.id === id))
          .filter(Boolean);
      }

      // 如果同时有搜索关键词，进一步过滤
      if (query) {
        filteredSecrets = filteredSecrets.filter(s => {
          const name = s.name.toLowerCase();
          const account = (s.account || '').toLowerCase();
          return name.includes(query) || account.includes(query);
        });
      }

      await renderFilteredSecrets();
      updateChipCounts();
    }

    function updateChipCounts() {
      const countEl = document.getElementById('chipAllCount');
      if (countEl) countEl.textContent = secrets.length;
    }

    // ── 排序 ──

    // 从 localStorage 恢复排序选择
    function restoreSortPreference() {
      try {
        const savedSort = localStorage.getItem('2fa-sort-preference');
        if (savedSort) {
          currentSortType = savedSort;
          const sortSelect = document.getElementById('sortSelect');
          if (sortSelect) {
            sortSelect.value = savedSort;
          }
        }
      } catch (e) {}
    }

    // 保存排序选择到 localStorage
    function saveSortPreference(sortType) {
      try { localStorage.setItem('2fa-sort-preference', sortType); } catch (e) {}
    }

    // 搜索过滤功能
    async function filterSecrets(query) {
      const trimmedQuery = query.trim().toLowerCase();
      currentSearchQuery = trimmedQuery;

      if (!trimmedQuery) {
        // 空搜索时应用当前 filter
        await applyFilter();
        return;
      }

      // 先应用 filter，再搜索
      let baseList;
      if (currentFilter === 'all') {
        baseList = [...secrets];
      } else if (currentFilter === 'favorites') {
        const favs = getFavorites();
        baseList = secrets.filter(s => favs.includes(s.id));
      } else if (currentFilter === 'recent') {
        const recentIds = getRecentSecretIds();
        baseList = recentIds.map(id => secrets.find(s => s.id === id)).filter(Boolean);
      }

      filteredSecrets = baseList.filter(secret => {
        const serviceName = secret.name.toLowerCase();
        const accountName = (secret.account || '').toLowerCase();
        return serviceName.includes(trimmedQuery) || accountName.includes(trimmedQuery);
      });

      const searchStats = document.getElementById('searchStats');
      if (searchStats) {
        const totalCount = baseList.length;
        const foundCount = filteredSecrets.length;
        if (foundCount === 0) {
          searchStats.textContent = '未找到匹配的密钥';
          searchStats.style.color = '#e74c3c';
        } else {
          searchStats.textContent = '找到 ' + foundCount + ' 个匹配密钥';
          searchStats.style.color = '#3498db';
        }
        searchStats.style.display = trimmedQuery ? 'block' : 'none';
      }

      await renderFilteredSecrets();
    }

    // 清除搜索
    function clearSearch() {
      document.getElementById('searchInput').value = '';
      filterSecrets('');
      document.getElementById('searchInput').focus();
    }

    // 应用排序
    async function applySorting() {
      const sortSelect = document.getElementById('sortSelect');
      currentSortType = sortSelect.value;
      saveSortPreference(currentSortType);
      await renderFilteredSecrets();
    }

    // 排序密钥
    function sortSecrets(secretsToSort, sortType) {
      if (!secretsToSort || secretsToSort.length === 0) return secretsToSort;
      const sorted = [...secretsToSort];
      switch (sortType) {
        case 'name-asc':
          return sorted.sort((a, b) => (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase(), 'zh-CN'));
        case 'name-desc':
          return sorted.sort((a, b) => (b.name || '').toLowerCase().localeCompare((a.name || '').toLowerCase(), 'zh-CN'));
        case 'account-asc':
          return sorted.sort((a, b) => (a.account || '').toLowerCase().localeCompare((b.account || '').toLowerCase(), 'zh-CN'));
        case 'account-desc':
          return sorted.sort((a, b) => (b.account || '').toLowerCase().localeCompare((a.account || '').toLowerCase(), 'zh-CN'));
        case 'newest-first':
          return sorted.reverse();
        case 'oldest-first':
        default:
          return sorted;
      }
    }
`;
}
