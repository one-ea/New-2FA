# 2FA OTP 验证器

基于 Cloudflare Workers + R2 的两步验证管理器，配合 Flutter App 使用。

## 架构

```
┌─────────────┐     ┌───────────────────┐     ┌─────────┐
│ Flutter App  │ ──→ │ Cloudflare Worker  │ ──→ │   R2    │ 密钥数据 + 备份
│ (Android/iOS)│     │   (API + Web UI)   │ ──→ │   KV    │ 认证信息
└─────────────┘     └───────────────────┘     └─────────┘
```

- **R2**: 存储密钥数据 (`data/secrets.json`) 和自动备份 (`backups/`)
- **KV**: 仅存储密码哈希、JWT 密钥等认证信息（低延迟）
- **备份**: 每天自动备份到 R2，保留 30 天

## 部署

```bash
# 1. 安装依赖
npm install

# 2. 登录 Cloudflare（首次需要）
npx wrangler login

# 3. 一键部署（自动创建 KV + R2 + 迁移数据 + 部署）
npm run deploy

# 4.（可选）设置加密密钥
npx wrangler secret put ENCRYPTION_KEY
```

`npm run deploy` 会自动：
- 创建 KV 命名空间（存认证信息）
- 创建 R2 Bucket（存密钥数据 + 备份）
- 更新 `wrangler.toml` 绑定配置
- 迁移现有 KV 数据到 R2（如有）
- 部署 Worker

## Flutter App

```bash
cd app
flutter pub get
flutter run
```

## 致谢

基于 [wuzf/2fa](https://github.com/wuzf) 项目二次开发。

## 许可证

[MIT License](LICENSE)
