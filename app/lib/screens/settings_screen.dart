import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/settings_provider.dart';

/// 设置页
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _serverController = TextEditingController();
  bool _testingConnection = false;
  String? _connectionResult;

  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthProvider>();
    _serverController.text = auth.serverUrl ?? '';
  }

  @override
  void dispose() {
    _serverController.dispose();
    super.dispose();
  }

  Future<void> _testConnection() async {
    final url = _serverController.text.trim();
    if (url.isEmpty) return;

    setState(() {
      _testingConnection = true;
      _connectionResult = null;
    });

    final auth = context.read<AuthProvider>();
    final ok = await auth.testConnection(url);

    if (mounted) {
      setState(() {
        _testingConnection = false;
        _connectionResult = ok ? '✓ 连接正常' : '✗ 连接失败，请检查地址';
      });
    }
  }

  Future<void> _saveServerUrl() async {
    final url = _serverController.text.trim();
    if (url.isEmpty) return;
    await context.read<AuthProvider>().setServerUrl(url);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('服务器地址已保存')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(title: const Text('设置')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // 服务器配置
          const _SectionHeader('服务器'),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextField(
                    controller: _serverController,
                    decoration: const InputDecoration(
                      labelText: '服务器地址',
                      hintText: 'https://your.workers.dev',
                      prefixIcon: Icon(Icons.cloud_outlined),
                    ),
                    keyboardType: TextInputType.url,
                  ),
                  if (_connectionResult != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        _connectionResult!,
                        style: TextStyle(
                          color: _connectionResult!.startsWith('✓')
                              ? colors.primary
                              : colors.error,
                          fontSize: 13,
                        ),
                      ),
                    ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed:
                              _testingConnection ? null : _testConnection,
                          icon: _testingConnection
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child:
                                      CircularProgressIndicator(strokeWidth: 2),
                                )
                              : const Icon(Icons.wifi_tethering_rounded),
                          label: const Text('测试连接'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: FilledButton.icon(
                          onPressed: _saveServerUrl,
                          icon: const Icon(Icons.save_outlined),
                          label: const Text('保存'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // 外观
          const _SectionHeader('外观'),
          Card(
            child: Consumer<SettingsProvider>(
              builder: (context, settings, _) => Column(
                children: [
                  RadioListTile<ThemeMode>(
                    title: const Text('跟随系统'),
                    secondary: const Icon(Icons.brightness_auto_rounded),
                    value: ThemeMode.system,
                    groupValue: settings.themeMode,
                    onChanged: (v) => settings.setThemeMode(v!),
                  ),
                  RadioListTile<ThemeMode>(
                    title: const Text('浅色模式'),
                    secondary: const Icon(Icons.light_mode_rounded),
                    value: ThemeMode.light,
                    groupValue: settings.themeMode,
                    onChanged: (v) => settings.setThemeMode(v!),
                  ),
                  RadioListTile<ThemeMode>(
                    title: const Text('深色模式'),
                    secondary: const Icon(Icons.dark_mode_rounded),
                    value: ThemeMode.dark,
                    groupValue: settings.themeMode,
                    onChanged: (v) => settings.setThemeMode(v!),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // 安全
          const _SectionHeader('安全'),
          Card(
            child: Consumer<AuthProvider>(
              builder: (context, auth, _) => Column(
                children: [
                  if (auth.biometricAvailable)
                    SwitchListTile(
                      secondary: const Icon(Icons.fingerprint_rounded),
                      title: const Text('生物识别解锁'),
                      subtitle: const Text('使用指纹或面容 ID 快速解锁'),
                      value: auth.biometricEnabled,
                      onChanged: auth.setBiometricEnabled,
                    ),
                  ListTile(
                    leading: const Icon(Icons.logout_rounded),
                    title: const Text('退出登录'),
                    subtitle: const Text('清除登录凭证，需要重新输入密码'),
                    onTap: () => _logout(context),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // 关于
          const _SectionHeader('关于'),
          Card(
            child: Column(
              children: [
                const ListTile(
                  leading: Icon(Icons.info_outline_rounded),
                  title: Text('版本'),
                  trailing: Text('1.0.0'),
                ),
                ListTile(
                  leading: const Icon(Icons.code_rounded),
                  title: const Text('开源地址'),
                  trailing: const Icon(Icons.open_in_new_rounded, size: 16),
                  onTap: () {},
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  void _logout(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('退出登录'),
        content: const Text('确认退出？将清除登录凭证，下次需要重新输入密码。'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('取消'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.read<AuthProvider>().logout();
            },
            child: const Text('退出'),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader(this.title);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 0, 0, 8),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: Theme.of(context).colorScheme.primary,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
