# 2FA Authenticator

基于 Cloudflare Workers + R2 的两步验证管理器（纯 Web 应用）。

## 架构

```
┌───────────────┐     ┌───────────────────┐     ┌─────────┐
│   浏览器       │ ──→ │ Cloudflare Worker  │ ──→ │   R2    │ 密钥 + 备份
│  (Web UI/PWA) │     │  (API + SSR 页面)  │     └─────────┘
└───────────────┘     └───────────────────┘
```

- **R2**: 存储密钥数据 (`data/secrets.json`) 和自动备份 (`backups/`)
- **备份**: 每天自动备份到 R2，保留 30 天

## 功能

- 🔐 TOTP / HOTP 验证码生成
- 📊 安全仪表盘（主页实时评分）
- 🔄 P2P 设备同步（端到端加密）
- ☁️ WebDAV 云备份
- 🔗 URL 智能匹配
- 📷 二维码扫描 / 生成
- 📦 批量导入导出（多格式支持）
- 🎨 深色 / 浅色主题自动切换
- 🔒 应用锁（PIN 码保护）
- 📱 PWA 离线可用

## 项目结构

```
src/
├── worker.js              # Worker 入口
├── api/                   # API 层
│   ├── secrets/           # 密钥 CRUD
│   ├── sync.js            # P2P 同步
│   ├── webdav.js          # WebDAV 备份
│   ├── r2-backup.js       # R2 备份
│   └── favicon.js         # Favicon
├── router/handler.js      # 路由分发
├── otp/generator.js       # OTP 算法
├── utils/                 # 工具层
│   ├── auth.js            # 认证
│   ├── encryption.js      # 加密
│   ├── security.js        # 安全
│   ├── validation.js      # 校验
│   ├── logger.js          # 日志
│   └── ...
└── ui/                    # 前端 UI
    ├── page.js            # 主页面
    ├── toolbar.js         # 工具栏 + 菜单
    ├── setupPage.js       # 初始设置
    ├── styles/            # CSS 模块
    ├── scripts/           # JS 模块
    │   ├── core.js        # 核心逻辑
    │   ├── dashboard.js   # 安全仪表盘
    │   ├── sync.js        # P2P 同步
    │   ├── import/        # 导入模块
    │   ├── export/        # 导出模块
    │   └── tools/         # 实用工具
    └── config/            # 配置
```

## 部署

```bash
# 安装依赖
npm install

# 创建 R2 Bucket
npx wrangler r2 bucket create 2fa-backup

# 部署
npm run deploy

# （可选）设置加密密钥
npx wrangler secret put ENCRYPTION_KEY
```

## 开发

```bash
npm run dev
```

## 许可证

[MIT License](LICENSE)
