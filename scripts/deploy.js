#!/usr/bin/env node

/**
 * 自动部署脚本
 * 自动创建 KV 命名空间和 R2 Bucket，更新 wrangler.toml 并部署
 *
 * 用法: node scripts/deploy.js [--env development]
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TOML_PATH = resolve(ROOT, 'wrangler.toml');

// 配置
const KV_NAMESPACE_NAME = '2fa-secrets';
const R2_BUCKET_NAME = '2fa-backup';
const KV_BINDING = 'SECRETS_KV';
const R2_BINDING = 'BACKUP_R2';

const env = process.argv.includes('--env') 
  ? process.argv[process.argv.indexOf('--env') + 1] 
  : null;

const envFlag = env ? `--env ${env}` : '';

// ─── 工具函数 ───────────────────────────────────────

function run(cmd, silent = false) {
  try {
    const result = execSync(cmd, { cwd: ROOT, encoding: 'utf-8', stdio: silent ? 'pipe' : 'inherit' });
    return result?.trim() || '';
  } catch (e) {
    return e.stdout?.trim() || e.stderr?.trim() || '';
  }
}

function runJson(cmd) {
  try {
    const result = execSync(cmd, { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe' });
    return JSON.parse(result);
  } catch (e) {
    // 有些 wrangler 命令返回非零但有 JSON 输出
    try {
      return JSON.parse(e.stdout || '');
    } catch {
      return null;
    }
  }
}

function log(msg) { console.log(`\x1b[36m[部署]\x1b[0m ${msg}`); }
function ok(msg)  { console.log(`\x1b[32m  ✔\x1b[0m ${msg}`); }
function warn(msg){ console.log(`\x1b[33m  ⚠\x1b[0m ${msg}`); }
function err(msg) { console.log(`\x1b[31m  ✘\x1b[0m ${msg}`); }

// ─── 1. 创建/获取 KV 命名空间 ─────────────────────────

async function ensureKV() {
  log('检查 KV 命名空间...');

  // 列出现有 KV
  const output = run(`npx wrangler kv namespace list`, true);
  let namespaces = [];
  try { namespaces = JSON.parse(output); } catch { namespaces = []; }

  // 查找已有的
  const existing = namespaces.find(ns => ns.title.includes(KV_NAMESPACE_NAME));

  if (existing) {
    ok(`KV 命名空间已存在: ${existing.title} (${existing.id})`);
    return existing.id;
  }

  // 创建新的
  log('创建 KV 命名空间...');
  const createOutput = run(`npx wrangler kv namespace create "${KV_NAMESPACE_NAME}"`, true);
  
  // 解析输出中的 id
  const idMatch = createOutput.match(/id\s*=\s*"([a-f0-9]+)"/);
  if (idMatch) {
    ok(`KV 命名空间已创建: ${idMatch[1]}`);
    return idMatch[1];
  }

  // 再次尝试列表获取
  const retryOutput = run(`npx wrangler kv namespace list`, true);
  try {
    const retryList = JSON.parse(retryOutput);
    const found = retryList.find(ns => ns.title.includes(KV_NAMESPACE_NAME));
    if (found) {
      ok(`KV 命名空间已创建: ${found.id}`);
      return found.id;
    }
  } catch {}

  err('创建 KV 命名空间失败');
  process.exit(1);
}

// ─── 2. 创建 R2 Bucket ────────────────────────────────

async function ensureR2() {
  log('检查 R2 Bucket...');

  const output = run(`npx wrangler r2 bucket list`, true);

  if (output.includes(R2_BUCKET_NAME)) {
    ok(`R2 Bucket 已存在: ${R2_BUCKET_NAME}`);
    return;
  }

  log('创建 R2 Bucket...');
  run(`npx wrangler r2 bucket create ${R2_BUCKET_NAME}`);
  ok(`R2 Bucket 已创建: ${R2_BUCKET_NAME}`);
}

// ─── 3. 更新 wrangler.toml ───────────────────────────

function updateWranglerToml(kvId) {
  log('更新 wrangler.toml...');

  let toml = readFileSync(TOML_PATH, 'utf-8');

  // 检查是否已有 KV 绑定（非注释状态）
  const hasKVBinding = /^\[\[kv_namespaces\]\]/m.test(toml);

  if (hasKVBinding) {
    // 更新已有的 id
    toml = toml.replace(/(binding\s*=\s*"SECRETS_KV"\s*\n\s*id\s*=\s*")([^"]*)"/, `$1${kvId}"`);
    ok('KV 绑定已更新');
  } else {
    // 移除注释的 KV 配置并添加实际配置
    // 先删除注释掉的 KV 段落
    toml = toml.replace(/# KV.*\n(#.*\n)*/m, '');
    
    // 在 R2 配置之前插入 KV 配置
    const kvConfig = `# KV 命名空间（认证信息）
[[kv_namespaces]]
binding = "${KV_BINDING}"
id = "${kvId}"

`;
    toml = toml.replace(/# R2/, kvConfig + '# R2');
    ok('KV 绑定已添加');
  }

  // 确保 R2 绑定存在且未注释
  if (!/^\[\[r2_buckets\]\]/m.test(toml)) {
    toml += `
# R2 对象存储（主数据 + 备份）
[[r2_buckets]]
binding = "${R2_BINDING}"
bucket_name = "${R2_BUCKET_NAME}"
`;
    ok('R2 绑定已添加');
  }

  writeFileSync(TOML_PATH, toml, 'utf-8');
  ok('wrangler.toml 已更新');
}

// ─── 4. 数据迁移（KV → R2）──────────────────────────

async function migrateData() {
  log('检查是否需要数据迁移（KV → R2）...');

  // 检查 R2 中是否已有主数据
  const r2Check = run(`npx wrangler r2 object get ${R2_BUCKET_NAME}/data/secrets.json --pipe 2>&1`, true);
  
  if (r2Check && !r2Check.includes('not found') && !r2Check.includes('NoSuchKey') && !r2Check.includes('error')) {
    ok('R2 中已有密钥数据，跳过迁移');
    return;
  }

  // 检查 KV 中是否有数据
  warn('R2 中无密钥数据，尝试从 KV 迁移...');
  const kvData = run(`npx wrangler kv key get --binding=${KV_BINDING} "secrets" 2>&1`, true);

  if (!kvData || kvData.includes('not found') || kvData.includes('error')) {
    warn('KV 中也没有数据（首次部署），跳过迁移');
    return;
  }

  // 将 KV 数据写入临时文件再上传到 R2
  const tmpFile = resolve(ROOT, '.tmp_migrate.json');
  writeFileSync(tmpFile, kvData, 'utf-8');
  
  run(`npx wrangler r2 object put ${R2_BUCKET_NAME}/data/secrets.json --file=${tmpFile} --content-type=application/json`);
  
  // 清理临时文件
  try { require('fs').unlinkSync(tmpFile); } catch {}
  
  ok(`数据已从 KV 迁移到 R2`);
}

// ─── 5. 部署 ─────────────────────────────────────────

function deploy() {
  log('开始部署 Worker...');
  run(`npx wrangler deploy ${envFlag}`);
  ok('部署完成！');
}

// ─── 主流程 ──────────────────────────────────────────

async function main() {
  console.log('\n\x1b[1m🚀 2FA Worker 自动部署\x1b[0m\n');

  // 检查 wrangler 登录状态
  const whoami = run('npx wrangler whoami', true);
  if (whoami.includes('not authenticated') || whoami.includes('error')) {
    err('请先登录 Cloudflare: npx wrangler login');
    process.exit(1);
  }
  ok(`Cloudflare 账号已认证`);

  // 1. 确保 KV 存在
  const kvId = await ensureKV();

  // 2. 确保 R2 存在
  await ensureR2();

  // 3. 更新 wrangler.toml
  updateWranglerToml(kvId);

  // 4. 数据迁移
  await migrateData();

  // 5. 部署
  deploy();

  console.log('\n\x1b[32m\x1b[1m✅ 部署完成！\x1b[0m\n');
}

main().catch((e) => {
  err(`部署失败: ${e.message}`);
  process.exit(1);
});
