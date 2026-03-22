# 2FA 验证器 - Flutter App

与 Cloudflare Workers 后端同步的原生 iOS/Android 两步验证 App。

## 功能特性

- 🔑 **实时 TOTP 验证码** — 本地计算，完全离线可用
- ⏱️ **倒计时进度条** — 精确显示当前码剩余时间 + 下一个码预告
- 📷 **二维码扫描** — 摄像头实时扫描，支持闪光灯和前后翻转
- ☁️ **云端同步** — 与 Cloudflare Workers 后端双向同步
- 🔒 **生物识别解锁** — 支持 Face ID / Touch ID / 指纹
- 🔐 **安全存储** — JWT Token 存储于 iOS Keychain / Android KeyStore
- 📤 **导入/导出** — JSON 格式备份，兼容服务端格式
- 🌓 **深色模式** — 跟随系统 / 手动切换
- 🎯 **Material Design 3** — 现代 UI 设计

## 快速开始

### 环境要求

- Flutter SDK 3.16+（[flutter.dev](https://flutter.dev/docs/get-started/install)）
- Android：Android Studio + Android SDK
- iOS：Xcode 15+（仅 macOS）

### 安装依赖

```bash
cd app
flutter pub get
```

### 运行

```bash
# Android
flutter run

# iOS（需要 macOS + Xcode）
flutter run -d ios

# 指定设备
flutter devices
flutter run -d <device-id>
```

### 打包

```bash
# Android APK
flutter build apk --release

# Android App Bundle（上架 Google Play）
flutter build appbundle --release

# iOS IPA（需要 Apple 开发者账号）
flutter build ios --release
```

## 目录结构

```
app/
├── lib/
│   ├── main.dart              # 应用入口
│   ├── core/
│   │   ├── theme.dart         # Material Design 3 主题
│   │   └── router.dart        # GoRouter 路由配置
│   ├── models/
│   │   └── secret_entry.dart  # 数据模型（含 otpauth:// 解析）
│   ├── services/
│   │   ├── api_service.dart   # Cloudflare Workers API 客户端
│   │   └── otp_engine.dart    # TOTP/HOTP 本地计算引擎
│   ├── providers/
│   │   ├── auth_provider.dart     # 认证状态
│   │   ├── secrets_provider.dart  # 密钥列表状态
│   │   └── settings_provider.dart # 应用设置
│   ├── screens/
│   │   ├── login_screen.dart      # 登录页
│   │   ├── home_screen.dart       # 主页（验证码列表）
│   │   ├── add_secret_screen.dart # 添加账户页
│   │   ├── scan_qr_screen.dart    # 二维码扫描页
│   │   ├── settings_screen.dart   # 设置页
│   │   └── backup_screen.dart     # 备份管理页
│   └── widgets/
│       ├── secret_card.dart       # TOTP 验证码卡片
│       ├── add_menu_sheet.dart    # 添加菜单底部弹窗
│       └── edit_secret_sheet.dart # 编辑账户底部弹窗
├── android/                   # Android 原生配置
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       └── res/xml/network_security_config.xml
└── ios/
    └── Runner/
        └── Info.plist         # iOS 权限声明
```

## 与服务端对接

App 使用以下 API 端点：

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/login` | POST | 登录，获取 JWT |
| `/api/refresh-token` | POST | 刷新 JWT |
| `/api/secrets` | GET | 获取所有密钥 |
| `/api/secrets` | POST | 添加密钥 |
| `/api/secrets/:id` | PUT | 更新密钥 |
| `/api/secrets/:id` | DELETE | 删除密钥 |
| `/api/secrets/batch` | POST | 批量导入 |
| `/api/backup` | GET/POST | 获取/创建备份 |

认证方式：`Authorization: Bearer <jwt_token>`

## 依赖说明

| 包 | 用途 |
|----|------|
| `dio` | HTTP 客户端，含自动 Token 续期拦截器 |
| `flutter_secure_storage` | 安全存储 JWT（Keychain/KeyStore）|
| `mobile_scanner` | 摄像头二维码扫描 |
| `local_auth` | 生物识别（Face ID/指纹）|
| `go_router` | 声明式路由，支持深度链接 |
| `provider` | 轻量状态管理 |
| `flutter_animate` | 流畅入场动画 |
| `otp` + `base32` | TOTP/HOTP 本地计算 |
