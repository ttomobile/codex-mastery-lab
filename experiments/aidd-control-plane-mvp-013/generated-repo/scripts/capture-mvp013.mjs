import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const expRoot = path.resolve(root, '..');
const screenshotDir = path.join(expRoot, 'artifacts', 'screenshots');
const assetsDir = path.resolve(root, '..', '..', '..', 'assets');
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });

async function shot(name) {
  const file = path.join(screenshotDir, name);
  await page.screenshot({ path: file, fullPage: true });
  copyFileSync(file, path.join(assetsDir, name));
}

await shot('aidd-control-plane-mvp013-empty-initial.png');
await page.getByRole('button', { name: '証跡が揃った状態' }).click();
await shot('aidd-control-plane-mvp013-filled-ready.png');
await page.getByRole('button', { name: '証跡不足', exact: true }).click();
await shot('aidd-control-plane-mvp013-failure-insufficient.png');
await page.getByRole('button', { name: '取得タイムアウト' }).click();
await shot('aidd-control-plane-mvp013-timeout-fallback.png');

const terminalLogPath = path.join(expRoot, 'artifacts', 'terminal', 'verification-summary.txt');
const terminalText = (existsSync(terminalLogPath)
  ? readFileSync(terminalLogPath, 'utf8')
  : 'verification summary unavailable')
  .replaceAll(process.env.HOME ?? '', 'WORKSPACE')
  .replace(/\/Users\/tto/g, 'WORKSPACE')
  .split('\n')
  .slice(-70)
  .join('\n');
const escaped = terminalText.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#0f172a;color:#e2e8f0;font:22px/1.55 ui-monospace,Menlo,monospace}.card{padding:36px}h1{font:800 32px system-ui;margin:0 0 20px;color:#bfdbfe}.warn{color:#fecaca}pre{white-space:pre-wrap;overflow-wrap:anywhere}</style><div class="card"><h1>AIDD Control Plane MVP 013 terminal evidence</h1><p class="warn">mock:doctor は未実装のため失敗。この失敗を記事内の一次情報として扱う。</p><pre>${escaped}</pre></div>`);
await page.screenshot({ path: path.join(screenshotDir, 'aidd-control-plane-mvp013-terminal-evidence.png'), fullPage: true });
copyFileSync(path.join(screenshotDir, 'aidd-control-plane-mvp013-terminal-evidence.png'), path.join(assetsDir, 'aidd-control-plane-mvp013-terminal-evidence.png'));
await browser.close();
