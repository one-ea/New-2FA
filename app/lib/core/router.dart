import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../screens/login_screen.dart';
import '../screens/home_screen.dart';
import '../screens/add_secret_screen.dart';
import '../screens/scan_qr_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/backup_screen.dart';

/// 应用路由配置（基于 GoRouter）
/// 支持深度链接 otpauth:// 协议
class AppRouter {
  static final GlobalKey<NavigatorState> _rootNavigatorKey =
      GlobalKey<NavigatorState>(debugLabel: 'root');

  static final router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/home',
    debugLogDiagnostics: false,

    // 路由守卫：未登录跳到登录页
    redirect: (context, state) {
      final auth = context.read<AuthProvider>();
      final isLoginPage = state.matchedLocation == '/login';

      if (!auth.isAuthenticated && !isLoginPage) {
        return '/login';
      }
      if (auth.isAuthenticated && isLoginPage) {
        return '/home';
      }
      return null;
    },

    routes: [
      // 登录页
      GoRoute(
        path: '/login',
        name: 'login',
        pageBuilder: (context, state) => const MaterialPage(
          child: LoginScreen(),
        ),
      ),

      // 主页（TOTP 列表）
      GoRoute(
        path: '/home',
        name: 'home',
        pageBuilder: (context, state) => const MaterialPage(
          child: HomeScreen(),
        ),
        routes: [
          // 手动添加账户
          GoRoute(
            path: 'add',
            name: 'add-secret',
            pageBuilder: (context, state) {
              // 支持从 otpauth:// URL 预填充
              final uri = state.uri.queryParameters['uri'];
              return MaterialPage(
                child: AddSecretScreen(otpauthUri: uri),
              );
            },
          ),
          // 扫描二维码
          GoRoute(
            path: 'scan',
            name: 'scan-qr',
            pageBuilder: (context, state) => const MaterialPage(
              child: ScanQrScreen(),
            ),
          ),
          // 备份管理
          GoRoute(
            path: 'backup',
            name: 'backup',
            pageBuilder: (context, state) => const MaterialPage(
              child: BackupScreen(),
            ),
          ),
        ],
      ),

      // 设置页
      GoRoute(
        path: '/settings',
        name: 'settings',
        pageBuilder: (context, state) => const MaterialPage(
          child: SettingsScreen(),
        ),
      ),
    ],
  );
}
