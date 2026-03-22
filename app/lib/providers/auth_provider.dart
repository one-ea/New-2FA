import 'package:flutter/foundation.dart';
import 'package:local_auth/local_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../services/api_service.dart';

/// 认证状态管理
/// 负责：登录/登出、生物识别解锁、服务器配置
class AuthProvider extends ChangeNotifier {
  static const String _biometricEnabledKey = 'biometric_enabled';

  final ApiService _api = ApiService();
  final LocalAuthentication _localAuth = LocalAuthentication();

  // 初始化完成标志 —— Router 依赖此值判断是否已恢复会话
  bool _initialized = false;
  bool _isAuthenticated = false;
  bool _isLoading = false;
  bool _biometricAvailable = false;
  bool _biometricEnabled = false;
  String? _error;

  bool get initialized => _initialized;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  bool get biometricAvailable => _biometricAvailable;
  bool get biometricEnabled => _biometricEnabled;
  String? get error => _error;
  ApiService get api => _api;
  String? get serverUrl => _api.serverUrl;

  /// 初始化：从安全存储恢复 token 和服务器URL，检测生物识别能力
  /// 必须在应用启动时 await 完成，路由守卫才能正确判断
  Future<void> init() async {
    try {
      // 1. 从 SecureStorage 恢复 serverUrl 和 token
      await _api.init();
      _isAuthenticated = await _api.isAuthenticated();

      // 2. 检测设备生物识别能力
      try {
        _biometricAvailable = await _localAuth.canCheckBiometrics ||
            await _localAuth.isDeviceSupported();
      } catch (_) {
        _biometricAvailable = false;
      }

      // 3. 读取用户偏好
      final prefs = await SharedPreferences.getInstance();
      _biometricEnabled = prefs.getBool(_biometricEnabledKey) ?? false;
    } catch (e) {
      debugPrint('AuthProvider.init error: $e');
      _isAuthenticated = false;
    } finally {
      _initialized = true;
      notifyListeners();
    }
  }

  // ─── 服务器配置 ─────────────────────────────────────────

  Future<void> setServerUrl(String url) async {
    await _api.setServerUrl(url);
    notifyListeners();
  }

  /// 测试服务器连通性
  Future<bool> testConnection(String url) async {
    try {
      await _api.setServerUrl(url);
      await _api.login('__test__connection__');
      return true;
    } on ApiException catch (e) {
      return e.code == 401 || e.code == 400 || e.code == 422;
    } catch (_) {
      return false;
    }
  }

  // ─── 登录 ───────────────────────────────────────────────

  Future<bool> login(String password) async {
    _setLoading(true);
    _error = null;

    try {
      await _api.login(password);
      _isAuthenticated = true;
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _error = e.message;
      notifyListeners();
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // ─── 生物识别解锁 ────────────────────────────────────────

  Future<bool> authenticateWithBiometric() async {
    if (!_biometricAvailable || !_biometricEnabled) return false;

    try {
      final authenticated = await _localAuth.authenticate(
        localizedReason: '使用生物识别快速解锁 2FA 验证器',
        options: const AuthenticationOptions(
          biometricOnly: false,
          stickyAuth: true,
          useErrorDialogs: true,
        ),
      );
      if (authenticated) {
        _isAuthenticated = true;
        notifyListeners();
      }
      return authenticated;
    } catch (e) {
      return false;
    }
  }

  Future<void> setBiometricEnabled(bool enabled) async {
    _biometricEnabled = enabled;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_biometricEnabledKey, enabled);
    notifyListeners();
  }

  // ─── 登出 ───────────────────────────────────────────────

  Future<void> logout() async {
    await _api.logout();
    _isAuthenticated = false;
    notifyListeners();
  }

  // ─── 工具方法 ────────────────────────────────────────────

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}
