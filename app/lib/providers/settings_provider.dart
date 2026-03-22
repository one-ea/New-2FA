import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// 应用设置状态管理
class SettingsProvider extends ChangeNotifier {
  static const String _themeModeKey = 'theme_mode';
  static const String _autoRefreshKey = 'auto_refresh';

  ThemeMode _themeMode = ThemeMode.system;
  bool _autoRefresh = true; // 自动同步密钥列表

  ThemeMode get themeMode => _themeMode;
  bool get autoRefresh => _autoRefresh;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    final modeIndex = prefs.getInt(_themeModeKey) ?? ThemeMode.system.index;
    _themeMode = ThemeMode.values[modeIndex];
    _autoRefresh = prefs.getBool(_autoRefreshKey) ?? true;
    notifyListeners();
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_themeModeKey, mode.index);
    notifyListeners();
  }

  Future<void> setAutoRefresh(bool value) async {
    _autoRefresh = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_autoRefreshKey, value);
    notifyListeners();
  }
}
