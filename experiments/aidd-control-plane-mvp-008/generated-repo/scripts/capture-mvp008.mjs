import { chromium } from '@playwright/test';
import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const expRoot = path.resolve(root, '..');
const screenshotDir = path.join(expRoot, 'artifacts', 'screenshots');
const assetsDir = path.resolve(root, '..', '..', '..', 'assets');
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

async function shot(name) {
  const file = path.join(screenshotDir, name);
  await page.screenshot({ path: file, fullPage: true });
  copyFileSync(file, path.join(assetsDir, name));
}

await shot('aidd-control-plane-mvp008-empty.png');
await page.getByLabel(/学習支援/).check();
await page.getByRole('button', { name: 'テンプレートを適用' }).click();
await page.getByRole('button', { name: 'validサンプルを適用' }).click();
await page.getByLabel('何を作りたいですか？').fill('StudyFlow');
await page.getByLabel('誰のどんな問題を解決しますか？ 対象ユーザー').fill('学習を継続したい社会人');
await page.getByLabel('解決したい問題').fill('教材が散らばり、今日やることを決められない');
await shot('aidd-control-plane-mvp008-valid.png');
await page.getByRole('button', { name: 'failureサンプルを適用' }).click();
await shot('aidd-control-plane-mvp008-failure.png');

const terminalText = readFileSync(path.join(expRoot, 'artifacts', 'terminal', '06-e2e.txt'), 'utf8')
  .replaceAll(process.env.HOME ?? '', 'HOME_DIR')
  .replace(/\/Users\/tto/g, 'HOME_DIR')
  .split('\n')
  .slice(-46)
  .join('\n');
const escaped = terminalText.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#0f172a;color:#e2e8f0;font:22px/1.55 ui-monospace,Menlo,monospace}.card{padding:36px}h1{font:800 32px system-ui;margin:0 0 20px;color:#bfdbfe}pre{white-space:pre-wrap;overflow-wrap:anywhere}</style><div class="card"><h1>AIDD Control Plane MVP 008 terminal evidence</h1><pre>${escaped}</pre></div>`);
await page.screenshot({ path: path.join(screenshotDir, 'aidd-control-plane-mvp008-terminal-evidence.png'), fullPage: true });
copyFileSync(path.join(screenshotDir, 'aidd-control-plane-mvp008-terminal-evidence.png'), path.join(assetsDir, 'aidd-control-plane-mvp008-terminal-evidence.png'));
await browser.close();
