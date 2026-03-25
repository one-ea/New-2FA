import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:file_picker/file_picker.dart';
import 'package:share_plus/share_plus.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

import '../models/secret_entry.dart';
import '../providers/auth_provider.dart';
import '../providers/secrets_provider.dart';
import '../services/webdav_service.dart';

/// 备份管理页
/// 功能：本地导出/导入、WebDAV 云备份、服务器 KV 快照
class BackupScreen extends StatefulWidget {
  const BackupScreen({super.key});

  @override
  State<BackupScreen> createState() => _BackupScreenState();
}

class _BackupScreenState extends State<BackupScreen> {
  // ── 服务器备份 ──
  List<Map<String, dynamic>> _serverBackups = [];
  bool _loadingServerBackups = false;

  // ── R2 ──
  List<Map<String, dynamic>> _r2Backups = [];
  bool _loadingR2 = false;

  // ── WebDAV ──
  final WebDavService _webdav = WebDavService();
  List<WebDavBackupFile> _webdavFiles = [];
  bool _loadingWebdav = false;
  bool _webdavInitDone = false;

  @override
  void initState() {
    super.initState();
    _initWebDav();
    _loadServerBackups();
    _loadR2Backups();
  }

  Future<void> _initWebDav() async {
    await _webdav.init();
    setState(() => _webdavInitDone = true);
    if (_webdav.isConfigured) {
      _loadWebDavFiles();
    }
  }

  // ════════════════════════════════════════════════════
  //  服务器 KV 备份
  // ════════════════════════════════════════════════════

  Future<void> _loadServerBackups() async {
    final api = context.read<AuthProvider>().api;
    setState(() => _loadingServerBackups = true);
    try {
      _serverBackups = await api.getBackups();
    } catch (_) {}
    if (mounted) setState(() => _loadingServerBackups = false);
  }

  Future<void> _createServerBackup() async {
    final api = context.read<AuthProvider>().api;
    try {
      await api.createBackup();
      _showSnack('服务器备份快照已创建');
      _loadServerBackups();
    } catch (e) {
      _showSnack('创建失败：$e');
    }
  }

  Future<void> _restoreServerBackup(String key) async {
    if (!await _confirmRestore()) return;
    final api = context.read<AuthProvider>().api;
    try {
      await api.restoreBackup(key);
      _showSnack('还原成功');
      if (mounted) context.read<SecretsProvider>().refresh();
    } catch (e) {
      _showSnack('还原失败：$e');
    }
  }

  // ════════════════════════════════════════════════════
  //  R2 异地备份
  // ════════════════════════════════════════════════════

  Future<void> _loadR2Backups() async {
    final api = context.read<AuthProvider>().api;
    setState(() => _loadingR2 = true);
    try {
      _r2Backups = await api.getR2Backups();
    } catch (_) {}
    if (mounted) setState(() => _loadingR2 = false);
  }

  Future<void> _restoreR2Backup(String key) async {
    if (!await _confirmRestore()) return;
    final api = context.read<AuthProvider>().api;
    try {
      await api.restoreR2Backup(key);
      _showSnack('R2 还原成功');
      if (mounted) context.read<SecretsProvider>().refresh();
    } catch (e) {
      _showSnack('R2 还原失败：$e');
    }
  }

  // ════════════════════════════════════════════════════
  //  本地导出/导入
  // ════════════════════════════════════════════════════

  String _buildBackupJson() {
    final secrets = context.read<SecretsProvider>().allSecrets;
    final data = {
      'version': '1.0',
      'exportedAt': DateTime.now().toIso8601String(),
      'count': secrets.length,
      'secrets': secrets.map((s) => s.toJson()).toList(),
    };
    return const JsonEncoder.withIndent('  ').convert(data);
  }

  Future<void> _exportJson() async {
    final secrets = context.read<SecretsProvider>().allSecrets;
    if (secrets.isEmpty) {
      _showSnack('没有可导出的账户');
      return;
    }

    final json = _buildBackupJson();
    final dir = await getApplicationDocumentsDirectory();
    final fileName = '2fa_backup_${DateTime.now().millisecondsSinceEpoch}.json';
    final file = File('${dir.path}/$fileName');
    await file.writeAsString(json);

    await Share.shareXFiles(
      [XFile(file.path)],
      subject: '2FA 密钥备份',
      text: '包含 ${secrets.length} 个账户的 2FA 备份',
    );
  }

  Future<void> _importJson() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['json'],
    );
    if (result == null || result.files.isEmpty) return;

    final file = File(result.files.first.path!);
    final content = await file.readAsString();

    try {
      final data = jsonDecode(content) as Map<String, dynamic>;
      final List<dynamic> list = data['secrets'] as List? ?? [];
      final entries = list
          .map((j) => SecretEntry.fromJson(j as Map<String, dynamic>))
          .toList();

      if (entries.isEmpty) {
        _showSnack('文件中没有账户数据');
        return;
      }

      if (!mounted) return;
      final ok = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('确认导入'),
          content: Text('导入 ${entries.length} 个账户，重复不覆盖。'),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(ctx, false),
                child: const Text('取消')),
            FilledButton(
                onPressed: () => Navigator.pop(ctx, true),
                child: const Text('导入')),
          ],
        ),
      );
      if (ok != true || !mounted) return;

      final r = await context.read<SecretsProvider>().importSecrets(entries);
      _showSnack('导入成功：${r['added'] ?? entries.length} 个账户');
    } catch (e) {
      _showSnack('文件格式错误：$e');
    }
  }

  // ════════════════════════════════════════════════════
  //  WebDAV
  // ════════════════════════════════════════════════════

  Future<void> _showWebDavConfig() async {
    final urlCtrl = TextEditingController(text: _webdav.url ?? '');
    final userCtrl = TextEditingController(text: _webdav.user ?? '');
    final passCtrl = TextEditingController();
    final pathCtrl = TextEditingController(text: _webdav.remotePath);
    bool testing = false;
    String? testResult;

    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: const Text('WebDAV 配置'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: urlCtrl,
                  decoration: const InputDecoration(
                    labelText: '服务器地址',
                    hintText: 'https://dav.example.com',
                    prefixIcon: Icon(Icons.cloud_outlined),
                  ),
                  keyboardType: TextInputType.url,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: userCtrl,
                  decoration: const InputDecoration(
                    labelText: '用户名',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: passCtrl,
                  decoration: const InputDecoration(
                    labelText: '密码',
                    hintText: '留空则使用已保存的密码',
                    prefixIcon: Icon(Icons.lock_outline),
                  ),
                  obscureText: true,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: pathCtrl,
                  decoration: const InputDecoration(
                    labelText: '远程目录',
                    hintText: '/2fa-backup',
                    prefixIcon: Icon(Icons.folder_outlined),
                  ),
                ),
                const SizedBox(height: 16),
                if (testResult != null)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: testResult == 'ok'
                          ? Colors.green.withOpacity(0.1)
                          : Colors.red.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      testResult == 'ok' ? '✅ 连接成功' : '❌ $testResult',
                      style: TextStyle(
                        color: testResult == 'ok' ? Colors.green : Colors.red,
                        fontSize: 13,
                      ),
                    ),
                  ),
              ],
            ),
          ),
          actions: [
            // 清除配置
            if (_webdav.isConfigured)
              TextButton(
                onPressed: () async {
                  await _webdav.clearConfig();
                  if (mounted) {
                    setState(() => _webdavFiles = []);
                    Navigator.pop(ctx);
                    _showSnack('WebDAV 配置已清除');
                  }
                },
                child: Text('清除',
                    style: TextStyle(color: Theme.of(ctx).colorScheme.error)),
              ),
            // 测试
            TextButton(
              onPressed: testing
                  ? null
                  : () async {
                      setDialogState(() {
                        testing = true;
                        testResult = null;
                      });
                      await _webdav.saveConfig(
                        url: urlCtrl.text.trim(),
                        user: userCtrl.text.trim(),
                        pass: passCtrl.text.isNotEmpty
                            ? passCtrl.text
                            : (_webdav.isConfigured ? '' : ''),
                        path: pathCtrl.text.trim(),
                      );
                      final r = await _webdav.testConnection();
                      setDialogState(() {
                        testing = false;
                        testResult = r;
                      });
                    },
              child: testing
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2))
                  : const Text('测试连接'),
            ),
            // 保存
            FilledButton(
              onPressed: () async {
                final pass = passCtrl.text.isNotEmpty
                    ? passCtrl.text
                    : (_webdav.isConfigured ? '' : '');
                if (pass.isEmpty && !_webdav.isConfigured) {
                  setDialogState(() => testResult = '请输入密码');
                  return;
                }
                await _webdav.saveConfig(
                  url: urlCtrl.text.trim(),
                  user: userCtrl.text.trim(),
                  pass: pass,
                  path: pathCtrl.text.trim(),
                );
                if (mounted) {
                  Navigator.pop(ctx);
                  setState(() {});
                  _loadWebDavFiles();
                }
              },
              child: const Text('保存'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _loadWebDavFiles() async {
    if (!_webdav.isConfigured) return;
    setState(() => _loadingWebdav = true);
    try {
      _webdavFiles = await _webdav.listBackups();
    } catch (e) {
      _showSnack('WebDAV 列表加载失败：$e');
    }
    if (mounted) setState(() => _loadingWebdav = false);
  }

  Future<void> _uploadToWebDav() async {
    final secrets = context.read<SecretsProvider>().allSecrets;
    if (secrets.isEmpty) {
      _showSnack('没有可备份的账户');
      return;
    }

    try {
      final json = _buildBackupJson();
      final path = await _webdav.uploadBackup(json);
      _showSnack('已上传到 $path');
      _loadWebDavFiles();
    } catch (e) {
      _showSnack('上传失败：$e');
    }
  }

  Future<void> _restoreFromWebDav(WebDavBackupFile file) async {
    if (!await _confirmRestore()) return;

    try {
      final json = await _webdav.downloadBackup(file.path);
      final data = jsonDecode(json) as Map<String, dynamic>;
      final List<dynamic> list = data['secrets'] as List? ?? [];
      final entries = list
          .map((j) => SecretEntry.fromJson(j as Map<String, dynamic>))
          .toList();

      if (!mounted) return;
      final r = await context.read<SecretsProvider>().importSecrets(entries);
      _showSnack('从 WebDAV 导入 ${r['added'] ?? entries.length} 个账户');
    } catch (e) {
      _showSnack('导入失败：$e');
    }
  }

  Future<void> _deleteWebDavFile(WebDavBackupFile file) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('删除确认'),
        content: Text('确认删除 ${file.name}？'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('取消')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('删除'),
          ),
        ],
      ),
    );
    if (ok != true) return;

    try {
      await _webdav.deleteBackup(file.path);
      _showSnack('已删除');
      _loadWebDavFiles();
    } catch (e) {
      _showSnack('删除失败：$e');
    }
  }

  // ════════════════════════════════════════════════════
  //  通用
  // ════════════════════════════════════════════════════

  Future<bool> _confirmRestore() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('⚠️ 确认还原'),
        content: const Text('还原/导入会与现有数据合并，重复不覆盖。'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('取消')),
          FilledButton(
              onPressed: () => Navigator.pop(ctx, true),
              child: const Text('确认')),
        ],
      ),
    );
    return ok == true;
  }

  void _showSnack(String msg) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  // ════════════════════════════════════════════════════
  //  UI 构建
  // ════════════════════════════════════════════════════

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('备份管理')),
      body: RefreshIndicator(
        onRefresh: () async {
          await Future.wait(
              [_loadWebDavFiles(), _loadServerBackups(), _loadR2Backups()]);
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // ── 1. 本地导出/导入 ──
            _sectionTitle('📦 本地备份', colors),
            const SizedBox(height: 8),
            Card(
              child: Column(children: [
                ListTile(
                  leading: Icon(Icons.upload_rounded, color: colors.primary),
                  title: const Text('导出 JSON'),
                  subtitle: const Text('导出所有账户到本地文件'),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: _exportJson,
                ),
                const Divider(height: 1, indent: 56),
                ListTile(
                  leading: Icon(Icons.download_rounded, color: colors.primary),
                  title: const Text('导入 JSON'),
                  subtitle: const Text('从 JSON 文件批量导入'),
                  trailing: const Icon(Icons.chevron_right_rounded),
                  onTap: _importJson,
                ),
              ]),
            ),

            const SizedBox(height: 24),

            // ── 2. WebDAV 备份 ──
            Row(children: [
              Expanded(child: _sectionTitle('☁️ WebDAV 备份', colors)),
              IconButton(
                icon: const Icon(Icons.settings_outlined, size: 20),
                tooltip: '配置 WebDAV',
                onPressed: _showWebDavConfig,
              ),
            ]),
            const SizedBox(height: 8),

            if (!_webdavInitDone)
              const Center(child: CircularProgressIndicator())
            else if (!_webdav.isConfigured)
              Card(
                child: InkWell(
                  onTap: _showWebDavConfig,
                  borderRadius: BorderRadius.circular(12),
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(children: [
                      Icon(Icons.cloud_upload_outlined,
                          size: 40, color: colors.primary),
                      const SizedBox(height: 12),
                      const Text('点击配置 WebDAV 服务器'),
                      const SizedBox(height: 4),
                      Text(
                        '支持坚果云、NextCloud、Alist 等',
                        style: TextStyle(
                            fontSize: 12, color: colors.onSurfaceVariant),
                      ),
                    ]),
                  ),
                ),
              )
            else ...[
              // WebDAV 已配置：操作按钮
              Card(
                child: Column(children: [
                  ListTile(
                    leading:
                        Icon(Icons.cloud_upload_rounded, color: colors.primary),
                    title: const Text('立即备份到 WebDAV'),
                    subtitle: Text(_webdav.url ?? '',
                        style: const TextStyle(fontSize: 12)),
                    trailing: const Icon(Icons.chevron_right_rounded),
                    onTap: _uploadToWebDav,
                  ),
                ]),
              ),
              const SizedBox(height: 8),

              // WebDAV 文件列表
              _buildWebDavList(colors),
            ],

            const SizedBox(height: 24),

            // ── 3. 服务器 KV 快照 ──
            Row(children: [
              Expanded(child: _sectionTitle('🗄️ 服务器快照', colors)),
              TextButton.icon(
                onPressed: _createServerBackup,
                icon: const Icon(Icons.add_rounded, size: 18),
                label: const Text('手动创建'),
              ),
            ]),
            const SizedBox(height: 4),
            Text(
              '每天北京 0:00 自动快照（数据变化时），保留 100 个，存在 KV 内。',
              style: TextStyle(fontSize: 12, color: colors.onSurfaceVariant),
            ),
            const SizedBox(height: 8),
            _buildServerBackupList(colors),

            const SizedBox(height: 24),

            // ── 4. R2 异地备份 ──
            _sectionTitle('🗄️ R2 异地备份', colors),
            const SizedBox(height: 4),
            Text(
              '与 KV 独立存储，KV 丢失时仍可恢复。保留 30 天。',
              style: TextStyle(fontSize: 12, color: colors.onSurfaceVariant),
            ),
            const SizedBox(height: 8),
            _buildR2BackupList(colors),

            const SizedBox(height: 16),

            // 安全提示
            Card(
              color: colors.errorContainer,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.warning_amber_rounded,
                        color: colors.onErrorContainer, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        '导出文件含明文密钥，请妥善保管。\n'
                        'WebDAV 传输建议使用 HTTPS。',
                        style: TextStyle(
                          color: colors.onErrorContainer,
                          fontSize: 13,
                          height: 1.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String title, ColorScheme colors) {
    return Text(title,
        style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: colors.onSurface));
  }

  // ── WebDAV 文件列表 ──

  Widget _buildWebDavList(ColorScheme colors) {
    if (_loadingWebdav) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (_webdavFiles.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Center(
            child: Text('WebDAV 上暂无备份',
                style: TextStyle(color: colors.onSurfaceVariant)),
          ),
        ),
      );
    }

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: _webdavFiles.asMap().entries.map((e) {
          final idx = e.key;
          final f = e.value;
          String timeText = f.name;
          if (f.lastModified != null) {
            final d = f.lastModified!.toLocal();
            timeText = '${d.year}-${_p(d.month)}-${_p(d.day)} '
                '${_p(d.hour)}:${_p(d.minute)}';
          }
          return Column(children: [
            if (idx > 0) const Divider(height: 1, indent: 56),
            ListTile(
              dense: true,
              leading: Icon(Icons.description_outlined,
                  color: colors.primary, size: 20),
              title: Text(timeText, style: const TextStyle(fontSize: 14)),
              subtitle: Text(f.sizeText, style: const TextStyle(fontSize: 12)),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextButton(
                    onPressed: () => _restoreFromWebDav(f),
                    child: const Text('导入'),
                  ),
                  IconButton(
                    icon: Icon(Icons.delete_outline,
                        size: 18, color: colors.error),
                    onPressed: () => _deleteWebDavFile(f),
                  ),
                ],
              ),
            ),
          ]);
        }).toList(),
      ),
    );
  }

  // ── 服务器快照列表 ──

  Widget _buildServerBackupList(ColorScheme colors) {
    if (_loadingServerBackups) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (_serverBackups.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Center(
            child: Text('暂无服务器备份',
                style: TextStyle(color: colors.onSurfaceVariant)),
          ),
        ),
      );
    }

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: _serverBackups.asMap().entries.map((e) {
          final idx = e.key;
          final b = e.value;
          final key = b['key']?.toString() ?? '';
          final ts = b['timestamp']?.toString() ?? '';
          final count = b['count'] ?? '?';
          String display = ts;
          try {
            final d = DateTime.parse(ts).toLocal();
            display = '${d.year}-${_p(d.month)}-${_p(d.day)} '
                '${_p(d.hour)}:${_p(d.minute)}';
          } catch (_) {}
          return Column(children: [
            if (idx > 0) const Divider(height: 1, indent: 56),
            ListTile(
              dense: true,
              leading: Icon(Icons.inventory_2_outlined,
                  color: colors.primary, size: 20),
              title: Text(display, style: const TextStyle(fontSize: 14)),
              subtitle:
                  Text('$count 个密钥', style: const TextStyle(fontSize: 12)),
              trailing: TextButton(
                onPressed: () => _restoreServerBackup(key),
                child: const Text('还原'),
              ),
            ),
          ]);
        }).toList(),
      ),
    );
  }

  // ── R2 备份列表 ──

  Widget _buildR2BackupList(ColorScheme colors) {
    if (_loadingR2) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Center(child: CircularProgressIndicator()),
      );
    }

    if (_r2Backups.isEmpty) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Center(
            child: Text('暂无 R2 备份（需部署后生效）',
                style: TextStyle(color: colors.onSurfaceVariant, fontSize: 13)),
          ),
        ),
      );
    }

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: _r2Backups.asMap().entries.map((e) {
          final idx = e.key;
          final b = e.value;
          final key = b['key']?.toString() ?? '';
          final ts = b['timestamp']?.toString() ?? '';
          final count = b['secretCount'];
          final size = b['size'] as int? ?? 0;
          String display = ts;
          try {
            final d = DateTime.parse(ts).toLocal();
            display = '${d.year}-${_p(d.month)}-${_p(d.day)} '
                '${_p(d.hour)}:${_p(d.minute)}';
          } catch (_) {}
          final sizeText = size < 1024
              ? '$size B'
              : '${(size / 1024).toStringAsFixed(1)} KB';
          return Column(children: [
            if (idx > 0) const Divider(height: 1, indent: 56),
            ListTile(
              dense: true,
              leading: const Icon(Icons.storage_rounded,
                  color: Colors.teal, size: 20),
              title: Text(display, style: const TextStyle(fontSize: 14)),
              subtitle: Text('${count != null ? "$count 个密钥 · " : ""}$sizeText',
                  style: const TextStyle(fontSize: 12)),
              trailing: TextButton(
                onPressed: () => _restoreR2Backup(key),
                child: const Text('还原'),
              ),
            ),
          ]);
        }).toList(),
      ),
    );
  }

  String _p(int n) => n.toString().padLeft(2, '0');
}
