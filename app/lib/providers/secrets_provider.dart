import 'package:flutter/foundation.dart';

import '../models/secret_entry.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';

enum LoadState { idle, loading, error }

/// 密钥列表状态管理
/// 负责：数据同步、搜索过滤、CRUD 操作
class SecretsProvider extends ChangeNotifier {
  List<SecretEntry> _secrets = [];
  List<SecretEntry> _filtered = [];
  String _searchQuery = '';
  String _sortBy = 'name'; // name | createdAt
  LoadState _loadState = LoadState.idle;
  String? _error;
  ApiService? _api;

  List<SecretEntry> get secrets => _filtered;
  List<SecretEntry> get allSecrets => _secrets;
  int get count => _secrets.length;
  LoadState get loadState => _loadState;
  String? get error => _error;
  String get searchQuery => _searchQuery;
  String get sortBy => _sortBy;
  bool get isLoading => _loadState == LoadState.loading;

  // ─── 生命周期 ──────────────────────────────────────────

  bool _wasAuthenticated = false; // 上一次的认证状态

  /// 当 AuthProvider 状态改变时调用
  void onAuthChanged(AuthProvider auth) {
    if (auth.isAuthenticated) {
      _api = auth.api;
      // 每次从未认证→认证（登录或 token 恢复）都强制拉取最新数据
      if (!_wasAuthenticated) {
        _loadSecrets();
      }
    } else {
      _secrets = [];
      _filtered = [];
      _api = null;
      notifyListeners();
    }
    _wasAuthenticated = auth.isAuthenticated;
  }

  // ─── 数据加载 ──────────────────────────────────────────

  Future<void> refresh() => _loadSecrets();

  Future<void> _loadSecrets() async {
    if (_api == null) return;

    _loadState = LoadState.loading;
    _error = null;
    notifyListeners();

    try {
      _secrets = await _api!.getSecrets();
      _applyFilter();
      _loadState = LoadState.idle;
    } on ApiException catch (e) {
      _error = e.message;
      _loadState = LoadState.error;
    } finally {
      notifyListeners();
    }
  }

  // ─── 搜索 & 排序 ───────────────────────────────────────

  void search(String query) {
    _searchQuery = query.trim();
    _applyFilter();
    notifyListeners();
  }

  void setSort(String sortBy) {
    _sortBy = sortBy;
    _applyFilter();
    notifyListeners();
  }

  void _applyFilter() {
    var list = List<SecretEntry>.from(_secrets);

    // 搜索过滤
    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      list = list.where((s) {
        return s.name.toLowerCase().contains(q) ||
            s.account.toLowerCase().contains(q) ||
            (s.issuer?.toLowerCase().contains(q) ?? false);
      }).toList();
    }

    // 排序
    list.sort((a, b) {
      if (_sortBy == 'createdAt') {
        final at = a.createdAt ?? DateTime(0);
        final bt = b.createdAt ?? DateTime(0);
        return bt.compareTo(at); // 最新在前
      }
      return a.name.toLowerCase().compareTo(b.name.toLowerCase());
    });

    _filtered = list;
  }

  // ─── CRUD ──────────────────────────────────────────────

  Future<bool> addSecret(SecretEntry entry) async {
    if (_api == null) return false;
    try {
      final added = await _api!.addSecret(entry);
      _secrets.add(added);
      _applyFilter();
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _error = e.message;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateSecret(SecretEntry entry) async {
    if (_api == null) return false;
    try {
      final updated = await _api!.updateSecret(entry);
      final idx = _secrets.indexWhere((s) => s.id == entry.id);
      if (idx >= 0) _secrets[idx] = updated;
      _applyFilter();
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _error = e.message;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteSecret(String id) async {
    if (_api == null) return false;
    try {
      await _api!.deleteSecret(id);
      _secrets.removeWhere((s) => s.id == id);
      _applyFilter();
      notifyListeners();
      return true;
    } on ApiException catch (e) {
      _error = e.message;
      notifyListeners();
      return false;
    }
  }

  /// 批量导入（JSON 文件内容）
  Future<Map<String, dynamic>> importSecrets(List<SecretEntry> entries) async {
    if (_api == null) return {'error': '未连接'};
    try {
      final result = await _api!.batchAddSecrets(entries);
      await _loadSecrets(); // 重新加载确保同步
      return result;
    } on ApiException catch (e) {
      return {'error': e.message};
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
