import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:webdav_client/webdav_client.dart' as webdav;

/// WebDAV 备份服务
/// 负责：配置管理、上传/下载/列表备份文件
class WebDavService {
  static const _keyUrl = 'webdav_url';
  static const _keyUser = 'webdav_user';
  static const _keyPass = 'webdav_pass';
  static const _keyPath = 'webdav_path';

  // 默认远程备份目录
  static const _defaultPath = '/2fa-backup';

  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  String? _url;
  String? _user;
  String? _pass;
  String? _remotePath;
  webdav.Client? _client;

  // ─── 配置 ──────────────────────────────────────────

  /// 是否已配置 WebDAV
  bool get isConfigured =>
      _url != null && _url!.isNotEmpty &&
      _user != null && _user!.isNotEmpty &&
      _pass != null && _pass!.isNotEmpty;

  String? get url => _url;
  String? get user => _user;
  String get remotePath => _remotePath ?? _defaultPath;

  /// 从安全存储加载配置
  Future<void> init() async {
    _url = await _storage.read(key: _keyUrl);
    _user = await _storage.read(key: _keyUser);
    _pass = await _storage.read(key: _keyPass);
    _remotePath = await _storage.read(key: _keyPath) ?? _defaultPath;
    _buildClient();
  }

  /// 保存 WebDAV 配置
  Future<void> saveConfig({
    required String url,
    required String user,
    required String pass,
    String? path,
  }) async {
    _url = url.endsWith('/') ? url.substring(0, url.length - 1) : url;
    _user = user;
    // 空密码不覆盖已保存的密码
    if (pass.isNotEmpty) _pass = pass;
    _remotePath = (path?.isNotEmpty == true) ? path! : _defaultPath;

    await _storage.write(key: _keyUrl, value: _url!);
    await _storage.write(key: _keyUser, value: _user!);
    if (pass.isNotEmpty) await _storage.write(key: _keyPass, value: _pass!);
    await _storage.write(key: _keyPath, value: _remotePath!);

    _buildClient();
  }

  /// 清除 WebDAV 配置
  Future<void> clearConfig() async {
    await _storage.delete(key: _keyUrl);
    await _storage.delete(key: _keyUser);
    await _storage.delete(key: _keyPass);
    await _storage.delete(key: _keyPath);
    _url = _user = _pass = null;
    _remotePath = _defaultPath;
    _client = null;
  }

  void _buildClient() {
    if (!isConfigured) return;
    _client = webdav.newClient(
      _url!,
      user: _user!,
      password: _pass!,
    );
    // 关闭证书验证（自签证书场景）
    _client!.setHeaders({'Accept': '*/*'});
  }

  // ─── 连接测试 ──────────────────────────────────────

  /// 测试连接并自动创建远程目录
  Future<String> testConnection() async {
    if (!isConfigured || _client == null) {
      return '未配置 WebDAV';
    }

    try {
      // 尝试创建远程目录（已存在则忽略）
      try {
        await _client!.mkdir(remotePath);
      } catch (_) {
        // 目录已存在或不支持 MKCOL，忽略
      }

      // 列出目录确认能访问
      await _client!.readDir(remotePath);
      return 'ok';
    } catch (e) {
      debugPrint('WebDAV test failed: $e');
      return '连接失败：${_simplifyError(e)}';
    }
  }

  // ─── 上传备份 ──────────────────────────────────────

  /// 上传备份 JSON 到 WebDAV
  /// [jsonData] 是完整的备份 JSON 字符串
  /// 返回远程文件路径
  Future<String> uploadBackup(String jsonData) async {
    _ensureClient();

    // 确保远程目录存在
    try {
      await _client!.mkdir(remotePath);
    } catch (_) {}

    // 生成文件名：2fa_backup_2026-03-22_163000.json
    final now = DateTime.now();
    final fileName = '2fa_backup_'
        '${now.year}-${_pad(now.month)}-${_pad(now.day)}_'
        '${_pad(now.hour)}${_pad(now.minute)}${_pad(now.second)}'
        '.json';

    final fullPath = '$remotePath/$fileName';

    // 上传文件内容
    await _client!.write(
      fullPath,
      utf8.encode(jsonData),
    );

    return fullPath;
  }

  // ─── 列出备份 ──────────────────────────────────────

  /// 列出 WebDAV 上的备份文件
  Future<List<WebDavBackupFile>> listBackups() async {
    _ensureClient();

    final files = await _client!.readDir(remotePath);

    final backups = <WebDavBackupFile>[];
    for (final f in files) {
      final name = f.name ?? '';
      if (!name.endsWith('.json')) continue;

      backups.add(WebDavBackupFile(
        name: name,
        path: f.path ?? '$remotePath/$name',
        size: f.size ?? 0,
        lastModified: f.mTime,
      ));
    }

    // 按修改时间倒序
    backups.sort((a, b) {
      final at = a.lastModified ?? DateTime(0);
      final bt = b.lastModified ?? DateTime(0);
      return bt.compareTo(at);
    });

    return backups;
  }

  // ─── 下载备份 ──────────────────────────────────────

  /// 下载指定备份文件，返回 JSON 字符串
  Future<String> downloadBackup(String remotePath) async {
    _ensureClient();
    final bytes = await _client!.read(remotePath);
    return utf8.decode(bytes);
  }

  // ─── 删除备份 ──────────────────────────────────────

  /// 删除远程备份文件
  Future<void> deleteBackup(String remotePath) async {
    _ensureClient();
    await _client!.remove(remotePath);
  }

  // ─── 工具 ──────────────────────────────────────────

  void _ensureClient() {
    if (_client == null || !isConfigured) {
      throw Exception('WebDAV 未配置');
    }
  }

  String _pad(int n) => n.toString().padLeft(2, '0');

  String _simplifyError(dynamic e) {
    final msg = e.toString();
    if (msg.contains('401')) return '认证失败（用户名或密码错误）';
    if (msg.contains('404')) return '路径不存在';
    if (msg.contains('403')) return '没有访问权限';
    if (msg.contains('SocketException')) return '无法连接到服务器';
    if (msg.contains('HandshakeException')) return 'SSL 证书问题';
    return msg.length > 80 ? '${msg.substring(0, 80)}…' : msg;
  }
}

/// WebDAV 上的备份文件信息
class WebDavBackupFile {
  final String name;
  final String path;
  final int size;
  final DateTime? lastModified;

  WebDavBackupFile({
    required this.name,
    required this.path,
    required this.size,
    this.lastModified,
  });

  /// 人类可读的文件大小
  String get sizeText {
    if (size < 1024) return '$size B';
    if (size < 1024 * 1024) return '${(size / 1024).toStringAsFixed(1)} KB';
    return '${(size / (1024 * 1024)).toStringAsFixed(1)} MB';
  }
}
