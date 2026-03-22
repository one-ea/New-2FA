import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import 'core/router.dart';
import 'core/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/secrets_provider.dart';
import 'providers/settings_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 强制竖屏
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // ✅ 在 runApp 之前 await 完成初始化，确保路由守卫拿到正确的认证状态
  final authProvider = AuthProvider();
  final settingsProvider = SettingsProvider();

  await Future.wait([
    authProvider.init(),
    settingsProvider.init(),
  ]);

  runApp(TwoFaApp(
    authProvider: authProvider,
    settingsProvider: settingsProvider,
  ));
}

class TwoFaApp extends StatelessWidget {
  final AuthProvider authProvider;
  final SettingsProvider settingsProvider;

  const TwoFaApp({
    super.key,
    required this.authProvider,
    required this.settingsProvider,
  });

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: settingsProvider),
        ChangeNotifierProvider.value(value: authProvider),
        ChangeNotifierProxyProvider<AuthProvider, SecretsProvider>(
          create: (_) => SecretsProvider(),
          update: (_, auth, secrets) => secrets!..onAuthChanged(auth),
        ),
      ],
      child: Consumer<SettingsProvider>(
        builder: (context, settings, _) {
          return MaterialApp.router(
            title: '2FA 验证器',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme(),
            darkTheme: AppTheme.darkTheme(),
            themeMode: settings.themeMode,
            routerConfig: AppRouter.router,
          );
        },
      ),
    );
  }
}
