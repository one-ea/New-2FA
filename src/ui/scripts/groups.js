/**
 * 分组管理模块
 * 自定义分组：创建、删除、重命名、分配、筛选
 */
export function getGroupsCode() {
	return `
    // ========== Feature: 📂 分组/文件夹 ==========
    const GROUPS_KEY = '2fa-groups';

    // 预设分组颜色
    const GROUP_COLORS = [
      '#4F6EF7', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#06B6D4', '#F97316', '#14B8A6', '#6366F1'
    ];

    // --- 分组数据管理 ---

    /**
     * 获取所有分组
     * @returns {Array<{id: string, name: string, color: string}>}
     */
    function getGroups() {
      try {
        return JSON.parse(localStorage.getItem(GROUPS_KEY) || '[]');
      } catch { return []; }
    }

    /**
     * 保存分组列表
     */
    function saveGroups(groups) {
      try { localStorage.setItem(GROUPS_KEY, JSON.stringify(groups)); } catch(e) {}
    }

    /**
     * 创建新分组
     */
    function createGroup(name, color) {
      const groups = getGroups();
      // 检查重名
      if (groups.some(g => g.name === name)) {
        showCenterToast('❌', '分组名已存在');
        return false;
      }
      const id = 'g_' + Date.now().toString(36);
      groups.push({ id, name, color: color || GROUP_COLORS[groups.length % GROUP_COLORS.length] });
      saveGroups(groups);
      return true;
    }

    /**
     * 删除分组（不删密钥，只清除关联）
     */
    function deleteGroup(groupId) {
      let groups = getGroups();
      groups = groups.filter(g => g.id !== groupId);
      saveGroups(groups);
      // 清除密钥上的分组标记（仅本地缓存，不修改服务端）
      // 服务端的 group 字段保留，下次编辑时可重新分配
    }

    /**
     * 重命名分组
     */
    function renameGroup(groupId, newName) {
      const groups = getGroups();
      const g = groups.find(g => g.id === groupId);
      if (g) {
        g.name = newName;
        saveGroups(groups);
      }
    }

    /**
     * 根据 groupId 获取分组信息
     */
    function getGroupById(groupId) {
      return getGroups().find(g => g.id === groupId) || null;
    }

    /**
     * 获取密钥的分组信息（从 secret.group 字段读取）
     */
    function getSecretGroup(secret) {
      if (!secret || !secret.group) return null;
      return getGroupById(secret.group);
    }

    // --- 分组筛选 ---

    /**
     * 设置分组过滤
     */
    function setGroupFilter(groupId) {
      currentFilter = 'group:' + groupId;
      // 更新 chip 高亮
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      const el = document.getElementById('chip-group-' + groupId);
      if (el) el.classList.add('active');
      applyFilter();
    }

    // --- 分组 Chips 渲染 ---

    /**
     * 渲染分组 Chips 到 Filter Bar
     */
    function renderGroupChips() {
      // 移除旧的分组 chips
      document.querySelectorAll('.chip-group-dynamic').forEach(el => el.remove());

      const groups = getGroups();
      if (groups.length === 0) return;

      const container = document.getElementById('filterChips');
      const spacer = container.querySelector('.chip-spacer');

      groups.forEach(g => {
        const chip = document.createElement('button');
        chip.className = 'chip chip-group-dynamic';
        chip.id = 'chip-group-' + g.id;
        chip.onclick = () => setGroupFilter(g.id);

        // 带颜色圆点的分组名
        chip.innerHTML = '<span class="chip-color-dot" style="background:' + g.color + ';"></span>' + g.name;

        // 如果当前选中的就是这个分组，加上 active
        if (currentFilter === 'group:' + g.id) {
          chip.classList.add('active');
        }

        container.insertBefore(chip, spacer);
      });
    }

    // --- 分组管理弹窗 ---

    function showGroupManager() {
      closeActionMenu();
      const modal = document.getElementById('groupManagerModal');
      if (!modal) return;
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('show'), 10);
      disableBodyScroll();
      renderGroupManagerList();
    }

    function hideGroupManager() {
      const modal = document.getElementById('groupManagerModal');
      if (!modal) return;
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 200);
      enableBodyScroll();
    }

    /**
     * 渲染分组管理列表
     */
    function renderGroupManagerList() {
      const list = document.getElementById('groupManagerList');
      const groups = getGroups();

      if (groups.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-tertiary);font-size:13px;">还没有分组，点击上方按钮创建</div>';
        return;
      }

      // 计算每个分组的密钥数量
      list.innerHTML = groups.map(g => {
        const count = secrets.filter(s => s.group === g.id).length;
        return '<div class="group-manager-item">' +
          '<span class="group-manager-color" style="background:' + g.color + ';"></span>' +
          '<span class="group-manager-name">' + g.name + '</span>' +
          '<span class="group-manager-count">' + count + '</span>' +
          '<button class="group-manager-btn" onclick="renameGroupPrompt(\\'' + g.id + '\\',\\'' + g.name + '\\')" title="重命名">✏️</button>' +
          '<button class="group-manager-btn group-manager-btn-danger" onclick="deleteGroupConfirm(\\'' + g.id + '\\',\\'' + g.name + '\\')" title="删除">🗑️</button>' +
        '</div>';
      }).join('');
    }

    /**
     * 添加新分组
     */
    function addGroupFromManager() {
      const input = document.getElementById('newGroupNameInput');
      const name = input.value.trim();
      if (!name) {
        showCenterToast('❌', '请输入分组名');
        return;
      }
      if (createGroup(name)) {
        input.value = '';
        renderGroupManagerList();
        renderGroupChips();
        updateGroupSelect();
        showCenterToast('📂', '分组 "' + name + '" 已创建');
      }
    }

    /**
     * 重命名分组（简单 prompt）
     */
    function renameGroupPrompt(groupId, oldName) {
      const newName = prompt('重命名分组：', oldName);
      if (!newName || newName.trim() === oldName) return;
      renameGroup(groupId, newName.trim());
      renderGroupManagerList();
      renderGroupChips();
      updateGroupSelect();
      showCenterToast('✏️', '分组已重命名为 "' + newName.trim() + '"');
    }

    /**
     * 删除分组确认
     */
    function deleteGroupConfirm(groupId, name) {
      if (!confirm('确定删除分组 "' + name + '"？\\n（密钥不会被删除，只会移出该分组）')) return;
      deleteGroup(groupId);
      renderGroupManagerList();
      renderGroupChips();
      updateGroupSelect();
      // 如果当前正在筛选该分组，切回全部
      if (currentFilter === 'group:' + groupId) {
        setFilter('all');
      }
      showCenterToast('🗑️', '分组 "' + name + '" 已删除');
    }

    // --- 编辑弹窗中的分组选择器 ---

    /**
     * 更新编辑弹窗中的分组下拉框选项
     */
    function updateGroupSelect() {
      const select = document.getElementById('secretGroup');
      if (!select) return;
      const groups = getGroups();
      const currentVal = select.value;

      // 保留第一个 "无分组" 选项
      select.innerHTML = '<option value="">无分组</option>' +
        groups.map(g => '<option value="' + g.id + '">' + g.name + '</option>').join('');

      // 恢复选中值
      if (currentVal) select.value = currentVal;
    }

    // --- 初始化 ---

    // 页面加载后渲染分组 chips 和更新分组选择器
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        renderGroupChips();
        updateGroupSelect();
      }, 600);
    });
`;
}
