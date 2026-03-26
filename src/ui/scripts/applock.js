/**
 * 应用锁模块
 * PIN 码锁定/解锁、PBKDF2 安全哈希、超时自动锁定
 */

/**
 * 获取应用锁相关代码
 * @returns {string} 应用锁 JavaScript 代码
 */
export function getAppLockCode() {
	return `
    // ========== Feature: 🔐 应用锁 (PIN) ==========
    const APP_LOCK_KEY = '2fa-app-lock';
    const APP_LOCK_TIMEOUT_KEY = '2fa-app-lock-timeout';
    const PBKDF2_ITERATIONS = 100000;
    let appLockTimer = null;
    let isAppLocked = false;

    // --- PBKDF2 安全哈希 ---

    /**
     * 将字符串转为 ArrayBuffer
     */
    function strToBuffer(str) {
      return new TextEncoder().encode(str);
    }

    /**
     * 将 ArrayBuffer 转为十六进制字符串
     */
    function bufToHex(buffer) {
      return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * 使用 PBKDF2 生成 PIN 的安全哈希
     * @param {string} pin - 用户输入的 PIN
     * @param {string} [saltHex] - 可选的盐值（十六进制），不传则生成新的
     * @returns {Promise<{hash: string, salt: string}>}
     */
    async function hashPIN(pin, saltHex) {
      let salt;
      if (saltHex) {
        salt = new Uint8Array(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)));
      } else {
        salt = crypto.getRandomValues(new Uint8Array(16));
      }

      const keyMaterial = await crypto.subtle.importKey(
        'raw', strToBuffer(pin), 'PBKDF2', false, ['deriveBits']
      );

      const derived = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
        keyMaterial, 256
      );

      return { hash: bufToHex(derived), salt: bufToHex(salt) };
    }

    // --- 应用锁状态管理 ---

    /**
     * 检查是否已设置应用锁
     */
    function isAppLockEnabled() {
      try {
        const data = localStorage.getItem(APP_LOCK_KEY);
        return !!data;
      } catch { return false; }
    }

    /**
     * 获取应用锁配置
     */
    function getAppLockConfig() {
      try {
        return JSON.parse(localStorage.getItem(APP_LOCK_KEY));
      } catch { return null; }
    }

    /**
     * 获取超时时间（分钟），默认 5 分钟
     */
    function getAppLockTimeout() {
      try {
        const v = localStorage.getItem(APP_LOCK_TIMEOUT_KEY);
        return v ? parseInt(v, 10) : 5;
      } catch { return 5; }
    }

    /**
     * 设置超时时间（分钟）
     */
    function setAppLockTimeout(minutes) {
      localStorage.setItem(APP_LOCK_TIMEOUT_KEY, String(minutes));
      resetAppLockTimer(); // 立即生效
    }

    // --- 设置/删除 PIN ---

    /**
     * 设置新的 PIN 码
     * @param {string} pin - 4-6 位 PIN
     */
    async function setupAppLock(pin) {
      const { hash, salt } = await hashPIN(pin);
      const config = {
        hash, salt,
        iterations: PBKDF2_ITERATIONS,
        createdAt: Date.now()
      };
      localStorage.setItem(APP_LOCK_KEY, JSON.stringify(config));
      isAppLocked = false;
      resetAppLockTimer();
    }

    /**
     * 移除应用锁
     */
    function removeAppLock() {
      localStorage.removeItem(APP_LOCK_KEY);
      localStorage.removeItem(APP_LOCK_TIMEOUT_KEY);
      isAppLocked = false;
      clearAppLockTimer();
      hideAppLockScreen();
    }

    // --- 验证 PIN ---

    /**
     * 验证输入的 PIN 是否正确
     * @param {string} pin - 用户输入
     * @returns {Promise<boolean>}
     */
    async function verifyPIN(pin) {
      const config = getAppLockConfig();
      if (!config) return false;
      const { hash } = await hashPIN(pin, config.salt);
      return hash === config.hash;
    }

    // --- 锁屏 UI ---

    /**
     * 显示锁屏界面
     */
    function showAppLockScreen() {
      isAppLocked = true;
      const overlay = document.getElementById('appLockOverlay');
      if (!overlay) return;

      overlay.style.display = 'flex';
      setTimeout(() => overlay.classList.add('show'), 10);

      // 重置 PIN 输入
      clearPinInput();
      document.getElementById('appLockError').style.display = 'none';

      // 聚焦隐藏输入框
      const hiddenInput = document.getElementById('appLockHiddenInput');
      if (hiddenInput) {
        setTimeout(() => hiddenInput.focus(), 100);
      }
    }

    /**
     * 隐藏锁屏界面
     */
    function hideAppLockScreen() {
      isAppLocked = false;
      const overlay = document.getElementById('appLockOverlay');
      if (!overlay) return;
      overlay.classList.remove('show');
      setTimeout(() => overlay.style.display = 'none', 300);
    }

    /**
     * 清空 PIN 输入
     */
    function clearPinInput() {
      const dots = document.querySelectorAll('.pin-dot');
      dots.forEach(d => d.classList.remove('filled'));
      const hiddenInput = document.getElementById('appLockHiddenInput');
      if (hiddenInput) hiddenInput.value = '';
    }

    /**
     * 更新 PIN 圆点显示
     */
    function updatePinDots(length) {
      const dots = document.querySelectorAll('.pin-dot');
      dots.forEach((d, i) => {
        d.classList.toggle('filled', i < length);
      });
    }

    /**
     * 处理 PIN 输入
     */
    function handlePinInput(digit) {
      const hiddenInput = document.getElementById('appLockHiddenInput');
      if (!hiddenInput) return;

      if (hiddenInput.value.length >= 6) return;
      hiddenInput.value += digit;
      updatePinDots(hiddenInput.value.length);

      // 输满 6 位自动验证（也支持 4 位时按回车验证）
      if (hiddenInput.value.length === 6) {
        submitPinUnlock();
      }
    }

    /**
     * 删除最后一位 PIN
     */
    function handlePinBackspace() {
      const hiddenInput = document.getElementById('appLockHiddenInput');
      if (!hiddenInput || hiddenInput.value.length === 0) return;
      hiddenInput.value = hiddenInput.value.slice(0, -1);
      updatePinDots(hiddenInput.value.length);
      document.getElementById('appLockError').style.display = 'none';
    }

    /**
     * 提交 PIN 验证
     */
    async function submitPinUnlock() {
      const hiddenInput = document.getElementById('appLockHiddenInput');
      if (!hiddenInput) return;

      const pin = hiddenInput.value;
      if (pin.length < 4) return;

      const ok = await verifyPIN(pin);
      if (ok) {
        hideAppLockScreen();
        resetAppLockTimer();
        showCenterToast('🔓', '已解锁');
      } else {
        // 错误：抖动动画
        const container = document.querySelector('.pin-dots-container');
        if (container) {
          container.classList.add('shake');
          setTimeout(() => container.classList.remove('shake'), 500);
        }
        document.getElementById('appLockError').style.display = 'block';
        document.getElementById('appLockError').textContent = 'PIN 码错误，请重试';
        clearPinInput();
      }
    }

    // --- 超时自动锁定 ---

    function resetAppLockTimer() {
      clearAppLockTimer();
      if (!isAppLockEnabled()) return;

      const minutes = getAppLockTimeout();
      if (minutes <= 0) return; // 0 表示不自动锁定

      appLockTimer = setTimeout(() => {
        if (isAppLockEnabled() && !isAppLocked) {
          console.log('🔒 超时自动锁定');
          showAppLockScreen();
        }
      }, minutes * 60 * 1000);
    }

    function clearAppLockTimer() {
      if (appLockTimer) {
        clearTimeout(appLockTimer);
        appLockTimer = null;
      }
    }

    // 监听用户活动，重置超时计时器
    ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'].forEach(evt => {
      document.addEventListener(evt, () => {
        if (!isAppLocked && isAppLockEnabled()) {
          resetAppLockTimer();
        }
      }, { passive: true });
    });

    // 页面隐藏时锁定
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isAppLockEnabled() && !isAppLocked) {
        // 页面切走时启动一个较短的锁定时间（30秒），防止快速切回
        clearAppLockTimer();
        appLockTimer = setTimeout(() => {
          if (isAppLockEnabled() && !isAppLocked) {
            showAppLockScreen();
          }
        }, 30 * 1000);
      }
    });

    // --- 应用锁设置弹窗 ---

    function showAppLockSettings() {
      closeAllCardMenus();
      closeActionMenu();

      const modal = document.getElementById('appLockSettingsModal');
      if (!modal) return;
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('show'), 10);
      disableBodyScroll();

      // 更新 UI 状态
      const enabled = isAppLockEnabled();
      document.getElementById('appLockToggle').checked = enabled;
      document.getElementById('appLockPinSection').style.display = enabled ? 'none' : 'none';
      document.getElementById('appLockManageSection').style.display = enabled ? 'block' : 'none';
      document.getElementById('appLockSetupSection').style.display = enabled ? 'none' : 'block';

      // 超时时间
      const timeoutSelect = document.getElementById('appLockTimeoutSelect');
      if (timeoutSelect) timeoutSelect.value = String(getAppLockTimeout());
    }

    function hideAppLockSettings() {
      const modal = document.getElementById('appLockSettingsModal');
      if (!modal) return;
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 200);
      enableBodyScroll();
    }

    /**
     * 切换应用锁状态
     */
    function toggleAppLockEnabled() {
      const toggle = document.getElementById('appLockToggle');
      if (toggle.checked) {
        // 启用：显示设置 PIN 界面
        document.getElementById('appLockSetupSection').style.display = 'block';
        document.getElementById('appLockManageSection').style.display = 'none';
        document.getElementById('appLockNewPin').value = '';
        document.getElementById('appLockConfirmPin').value = '';
        document.getElementById('appLockSetupError').style.display = 'none';
        document.getElementById('appLockNewPin').focus();
      } else {
        // 关闭前需要验证当前 PIN
        showVerifyPinToDisable();
      }
    }

    /**
     * 验证当前PIN后禁用应用锁
     */
    function showVerifyPinToDisable() {
      const currentPin = prompt('请输入当前 PIN 码以关闭应用锁：');
      if (!currentPin) {
        document.getElementById('appLockToggle').checked = true;
        return;
      }
      verifyPIN(currentPin).then(ok => {
        if (ok) {
          removeAppLock();
          showCenterToast('🔓', '应用锁已关闭');
          hideAppLockSettings();
        } else {
          document.getElementById('appLockToggle').checked = true;
          showCenterToast('❌', 'PIN 码错误');
        }
      });
    }

    /**
     * 保存新 PIN
     */
    async function saveNewAppLockPin() {
      const pin = document.getElementById('appLockNewPin').value;
      const confirm = document.getElementById('appLockConfirmPin').value;
      const errorEl = document.getElementById('appLockSetupError');

      if (!pin || pin.length < 4 || pin.length > 6) {
        errorEl.textContent = '请输入 4-6 位数字 PIN 码';
        errorEl.style.display = 'block';
        return;
      }

      if (!/^\\d+$/.test(pin)) {
        errorEl.textContent = 'PIN 码只能包含数字';
        errorEl.style.display = 'block';
        return;
      }

      if (pin !== confirm) {
        errorEl.textContent = '两次输入的 PIN 码不一致';
        errorEl.style.display = 'block';
        return;
      }

      await setupAppLock(pin);
      showCenterToast('🔒', '应用锁已启用');
      hideAppLockSettings();
    }

    /**
     * 修改 PIN 码
     */
    async function changeAppLockPin() {
      const currentPin = prompt('请输入当前 PIN 码：');
      if (!currentPin) return;

      const ok = await verifyPIN(currentPin);
      if (!ok) {
        showCenterToast('❌', '当前 PIN 码错误');
        return;
      }

      // 验证通过，显示设置新 PIN 界面
      document.getElementById('appLockManageSection').style.display = 'none';
      document.getElementById('appLockSetupSection').style.display = 'block';
      document.getElementById('appLockNewPin').value = '';
      document.getElementById('appLockConfirmPin').value = '';
      document.getElementById('appLockSetupError').style.display = 'none';
      document.getElementById('appLockNewPin').focus();
    }

    /**
     * 超时时间变更
     */
    function onAppLockTimeoutChange() {
      const select = document.getElementById('appLockTimeoutSelect');
      setAppLockTimeout(parseInt(select.value, 10));
      showCenterToast('⏱️', '超时时间已更新');
    }

    // --- 页面加载时检查应用锁 ---
    function initAppLock() {
      if (isAppLockEnabled()) {
        showAppLockScreen();
      }
    }

    // 隐藏输入框键盘事件处理（锁屏界面）
    document.addEventListener('DOMContentLoaded', () => {
      const hiddenInput = document.getElementById('appLockHiddenInput');
      if (hiddenInput) {
        hiddenInput.addEventListener('input', (e) => {
          const val = e.target.value.replace(/[^0-9]/g, '');
          e.target.value = val;
          updatePinDots(val.length);
          if (val.length === 6) {
            submitPinUnlock();
          }
        });

        hiddenInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitPinUnlock();
          }
        });
      }
    });

    // 延迟初始化应用锁（等待页面渲染完成）
    setTimeout(initAppLock, 100);
`;
}
