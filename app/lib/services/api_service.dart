import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../models/secret_entry.dart';

/// Cloudflare Workers API 服务
/// 负责认证、密钥 CRUD、备份管理
class ApiService {
  static const String _tokenKey = '2fa_jwt_token';
  static const String _serverUrlKey = '2fa_server_url';

  final FlutterSecureStorage _storage;
  late Dio _dio;
  String? _serverUrl;

  ApiService() : _storage = const FlutterSecureStorage() {
    _dio = Dio();
    _setupInterceptors();
  }

  // ─── 初始化 ───────────────────────────────────────────────

  /// 从安全存储恢复 token 和服务器 URL
  Future<void> init() async {
    _serverUrl = await _storage.read(key: _serverUrlKey);
    final token = await _storage.read(key: _tokenKey);
    if (token != null && _serverUrl != null) {
      _dio.options.baseUrl = _serverUrl!;
      _dio.options.headers['Authorization'] = 'Bearer $token';
    }
  }

  /// 设置服务器 URL（首次配置时调用）
  Future<void> setServerUrl(String url) async {
    _serverUrl = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
    await _storage.write(key: _serverUrlKey, value: _serverUrl!);
    _dio.options.baseUrl = _serverUrl!;
  }

  String? get serverUrl => _serverUrl;

  bool get hasServerUrl => _serverUrl != null && _serverUrl!.isNotEmpty;

  // ─── 拦截器配置 ───────────────────────────────────────────

  void _setupInterceptors() {
    _dio.options.connectTimeout = const Duration(seconds: 15);
    _dio.options.receiveTimeout = const Duration(seconds: 30);
    _dio.options.headers['Content-Type'] = 'application/json';
    _dio.options.headers['Accept'] = 'application/json';

    // 响应拦截器：自动处理 Token 续期
    _dio.interceptors.add(InterceptorsWrapper(
      onResponse: (response, handler) async {
        // 服务端通知需要刷新 Token
        if (response.headers.value('X-Token-Refresh-Needed') == 'true') {
          await _refreshToken();
        }
        handler.next(response);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // Token 过期，清除并触发重新登录
          await clearToken();
        }
        handler.next(error);
      },
    ));
  }

  // ─── 认证 ─────────────────────────────────────────────────

  /// 登录，返回 JWT token
  Future<String> login(String password) async {
    if (!hasServerUrl) throw const ApiException('未配置服务器地址');

    try {
      final response = await _dio.post(
        '/api/login',
        data: {'credential': password},
      );
      final token = response.data['token'] as String?;
      if (token == null || token.isEmpty) {
        throw const ApiException('服务器返回无效 token');
      }
      await _saveToken(token);
      return token;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<void> _saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  Future<void> _refreshToken() async {
    try {
      final response = await _dio.post('/api/refresh-token');
      final newToken = response.data['token'] as String?;
      if (newToken != null) {
        await _saveToken(newToken);
      }
    } catch (_) {
      // 续期失败不影响正常流程
    }
  }

  Future<void> clearToken() async {
    await _storage.delete(key: _tokenKey);
    _dio.options.headers.remove('Authorization');
  }

  Future<bool> isAuthenticated() async {
    final token = await _storage.read(key: _tokenKey);
    if (token == null || token.isEmpty) return false;

    // 解析 JWT payload 检查过期时间（JWT 格式：header.payload.signature）
    try {
      final parts = token.split('.');
      if (parts.length != 3) return false;

      // Base64 解码 payload（补全 padding）
      var payload = parts[1];
      final remainder = payload.length % 4;
      if (remainder != 0) payload += '=' * (4 - remainder);

      final decoded = String.fromCharCodes(
        base64Url.decode(payload),
      );
      final json = decoded;
      // 简单解析 exp 字段
      final expMatch = RegExp(r'"exp"\s*:\s*(\d+)').firstMatch(json);
      if (expMatch != null) {
        final exp = int.parse(expMatch.group(1)!);
        final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
        if (now >= exp) {
          // token 已过期，清除
          await clearToken();
          return false;
        }
      }
      return true;
    } catch (_) {
      // 解析失败就信任 token 存在
      return true;
    }
  }

  Future<void> logout() async {
    await clearToken();
  }

  // ─── 密钥管理 ─────────────────────────────────────────────

  /// 获取所有 2FA 密钥
  Future<List<SecretEntry>> getSecrets() async {
    try {
      final response = await _dio.get('/api/secrets');
      final List<dynamic> data = response.data as List;
      return data
          .map((json) => SecretEntry.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// 添加新密钥
  Future<SecretEntry> addSecret(SecretEntry entry) async {
    try {
      final response = await _dio.post('/api/secrets', data: entry.toJson());
      return SecretEntry.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// 批量添加（导入）
  Future<Map<String, dynamic>> batchAddSecrets(
      List<SecretEntry> entries) async {
    try {
      final response = await _dio.post(
        '/api/secrets/batch',
        data: {'secrets': entries.map((e) => e.toJson()).toList()},
      );
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// 更新密钥
  Future<SecretEntry> updateSecret(SecretEntry entry) async {
    try {
      final response = await _dio.put(
        '/api/secrets/${entry.id}',
        data: entry.toJson(),
      );
      return SecretEntry.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// 删除密钥
  Future<void> deleteSecret(String id) async {
    try {
      await _dio.delete('/api/secrets/$id');
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  // ─── 备份管理 ─────────────────────────────────────────────

  /// 获取备份列表
  Future<List<Map<String, dynamic>>> getBackups() async {
    try {
      final response = await _dio.get('/api/backup');
      final List<dynamic> data = response.data['backups'] as List? ?? [];
      return data.cast<Map<String, dynamic>>();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// 创建手动备份
  Future<Map<String, dynamic>> createBackup() async {
    try {
      final response = await _dio.post('/api/backup');
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// 恢复备份
  Future<Map<String, dynamic>> restoreBackup(String backupKey) async {
    try {
      final response = await _dio.post(
        '/api/backup/restore',
        data: {'backupKey': backupKey},
      );
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  // ─── R2 异地备份 ───────────────────────────────────────

  /// 获取 R2 备份列表
  Future<List<Map<String, dynamic>>> getR2Backups() async {
    try {
      final response = await _dio.get('/api/r2-backup');
      final List<dynamic> data = response.data['backups'] as List? ?? [];
      return data.cast<Map<String, dynamic>>();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  /// 从 R2 备份还原
  Future<Map<String, dynamic>> restoreR2Backup(String key) async {
    try {
      final response = await _dio.post(
        '/api/r2-backup/restore',
        data: {'key': key},
      );
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  // ─── 错误处理 ─────────────────────────────────────────────

  ApiException _handleDioError(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return const ApiException('连接超时，请检查网络');
    }
    if (e.type == DioExceptionType.connectionError) {
      return const ApiException('无法连接到服务器，请检查服务器地址和网络');
    }

    final statusCode = e.response?.statusCode;
    // 优先取服务器返回的具体消息
    final serverMessage = e.response?.data?['message']?.toString() ??
        e.response?.data?['error']?.toString();
    final fallbackMessage = e.message ?? '未知错误';

    return switch (statusCode) {
      // 401 优先展示服务器消息（如"密码错误"），便于用户判断
      401 => ApiException(serverMessage ?? '密码错误，请重试', code: 401),
      403 => ApiException(serverMessage ?? '没有权限执行此操作', code: 403),
      404 => const ApiException('资源不存在', code: 404),
      429 => const ApiException('请求过于频繁，请稍后再试', code: 429),
      500 => const ApiException('服务器内部错误', code: 500),
      503 => const ApiException('服务暂不可用，请稍后再试', code: 503),
      _ => ApiException(serverMessage ?? fallbackMessage, code: statusCode),
    };
  }
}

/// API 异常类
class ApiException implements Exception {
  final String message;
  final int? code;

  const ApiException(this.message, {this.code});

  @override
  String toString() => code != null ? '[$code] $message' : message;
}
