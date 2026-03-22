import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_provider.dart';

/// 登录页
/// 支持：服务器地址配置、密码登录、生物识别快速解锁
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _serverUrlController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _passwordVisible = false;
  bool _showServerConfig = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _init());
  }

  Future<void> _init() async {
    final auth = context.read<AuthProvider>();
    // 预填服务器地址
    if (auth.serverUrl != null) {
      _serverUrlController.text = auth.serverUrl!;
    } else {
      // 首次使用，显示服务器配置
      setState(() => _showServerConfig = true);
    }
    // 尝试生物识别自动解锁
    if (auth.biometricEnabled && auth.biometricAvailable) {
      await Future.delayed(const Duration(milliseconds: 500));
      if (mounted) await auth.authenticateWithBiometric();
      if (mounted && auth.isAuthenticated) context.go('/home');
    }
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    final auth = context.read<AuthProvider>();

    // 如果服务器 URL 已改变，先更新
    if (_serverUrlController.text.trim() != auth.serverUrl) {
      await auth.setServerUrl(_serverUrlController.text.trim());
    }

    final success = await auth.login(_passwordController.text);
    if (mounted && success) {
      context.go('/home');
    }
  }

  Future<void> _biometricLogin() async {
    final auth = context.read<AuthProvider>();
    final success = await auth.authenticateWithBiometric();
    if (mounted && success) context.go('/home');
  }

  @override
  void dispose() {
    _serverUrlController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;

    return Scaffold(
      backgroundColor: colors.surface,
      body: SafeArea(
        child: Consumer<AuthProvider>(
          builder: (context, auth, _) {
            return SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const SizedBox(height: 48),

                    // App 图标 + 标题
                    _buildHeader(colors),

                    const SizedBox(height: 48),

                    // 服务器地址（可折叠）
                    _buildServerSection(auth, colors),

                    const SizedBox(height: 16),

                    // 密码输入
                    _buildPasswordField(auth),

                    const SizedBox(height: 8),

                    // 错误提示
                    if (auth.error != null)
                      _buildError(auth.error!, colors),

                    const SizedBox(height: 24),

                    // 登录按钮
                    _buildLoginButton(auth, colors),

                    const SizedBox(height: 16),

                    // 生物识别按钮
                    if (auth.biometricAvailable && auth.biometricEnabled)
                      _buildBiometricButton(colors),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildHeader(ColorScheme colors) {
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: colors.primaryContainer,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Icon(
            Icons.security_rounded,
            size: 40,
            color: colors.onPrimaryContainer,
          ),
        ).animate().scale(
          delay: 100.ms,
          duration: 400.ms,
          curve: Curves.elasticOut,
        ),
        const SizedBox(height: 20),
        Text(
          '2FA 验证器',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.w700,
          ),
        ).animate().fadeIn(delay: 200.ms),
        const SizedBox(height: 8),
        Text(
          '安全管理您的两步验证',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: colors.onSurfaceVariant,
          ),
        ).animate().fadeIn(delay: 300.ms),
      ],
    );
  }

  Widget _buildServerSection(AuthProvider auth, ColorScheme colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // 折叠/展开服务器配置
        if (!_showServerConfig && auth.serverUrl != null)
          InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () => setState(() => _showServerConfig = true),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                children: [
                  Icon(Icons.cloud_outlined, size: 16, color: colors.primary),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      auth.serverUrl!,
                      style: TextStyle(
                        color: colors.primary,
                        fontSize: 13,
                        decoration: TextDecoration.underline,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  Icon(Icons.edit_outlined, size: 16, color: colors.primary),
                ],
              ),
            ),
          ),

        if (_showServerConfig)
          Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _serverUrlController,
                keyboardType: TextInputType.url,
                autocorrect: false,
                decoration: const InputDecoration(
                  labelText: '服务器地址',
                  hintText: 'https://your-worker.workers.dev',
                  prefixIcon: Icon(Icons.cloud_outlined),
                ),
                validator: (v) {
                  if (v == null || v.trim().isEmpty) return '请输入服务器地址';
                  if (!v.startsWith('https://') && !v.startsWith('http://')) {
                    return '请输入完整的 URL（以 https:// 开头）';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 8),
              if (auth.serverUrl != null)
                TextButton(
                  onPressed: () => setState(() => _showServerConfig = false),
                  child: const Text('取消'),
                ),
            ],
          ),
      ],
    ).animate().fadeIn(delay: 350.ms);
  }

  Widget _buildPasswordField(AuthProvider auth) {
    return TextFormField(
      controller: _passwordController,
      obscureText: !_passwordVisible,
      enabled: !auth.isLoading,
      onFieldSubmitted: (_) => _login(),
      decoration: InputDecoration(
        labelText: '密码',
        prefixIcon: const Icon(Icons.lock_outline_rounded),
        suffixIcon: IconButton(
          onPressed: () => setState(() => _passwordVisible = !_passwordVisible),
          icon: Icon(_passwordVisible
              ? Icons.visibility_off_outlined
              : Icons.visibility_outlined),
        ),
      ),
      validator: (v) {
        if (v == null || v.isEmpty) return '请输入密码';
        return null;
      },
    ).animate().fadeIn(delay: 400.ms);
  }

  Widget _buildError(String error, ColorScheme colors) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: colors.errorContainer,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(Icons.error_outline, color: colors.error, size: 18),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              error,
              style: TextStyle(color: colors.onErrorContainer, fontSize: 14),
            ),
          ),
        ],
      ),
    ).animate().shake();
  }

  Widget _buildLoginButton(AuthProvider auth, ColorScheme colors) {
    return FilledButton(
      onPressed: auth.isLoading ? null : _login,
      child: auth.isLoading
          ? SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: colors.onPrimary,
              ),
            )
          : const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.login_rounded),
                SizedBox(width: 8),
                Text('登录'),
              ],
            ),
    ).animate().fadeIn(delay: 450.ms);
  }

  Widget _buildBiometricButton(ColorScheme colors) {
    return OutlinedButton.icon(
      onPressed: _biometricLogin,
      icon: const Icon(Icons.fingerprint_rounded),
      label: const Text('使用生物识别解锁'),
    ).animate().fadeIn(delay: 500.ms);
  }
}
