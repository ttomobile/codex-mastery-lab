import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('..', 'assets');
const logDir = path.resolve('..', 'logs');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(logDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true });
const page = await context.newPage();
const messages = [];
page.on('console', (msg) => messages.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', (err) => messages.push(`pageerror: ${err.message}`));
await page.goto('http://127.0.0.1:3101');
await page.getByRole('button', { name: '追加' }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, 'verification-evidence-lite-fixed-error.png'), fullPage: true });
await page.getByLabel('タスクを追加').fill('証拠ファイルを確認する');
await page.getByRole('button', { name: '追加' }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, 'verification-evidence-lite-fixed-added.png'), fullPage: true });
await page.getByRole('listitem').filter({ hasText: '証拠ファイルを確認する' }).getByRole('checkbox').check();
for (const name of ['朝の予定を確認する', '夕方に振り返る']) {
  await page.getByRole('listitem').filter({ hasText: name }).getByRole('checkbox').check();
}
await page.getByLabel('未完了のみ表示').check();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, 'verification-evidence-lite-fixed-empty.png'), fullPage: true });
fs.writeFileSync(path.join(logDir, 'browser-console-fixed.txt'), messages.join('\n') || '(console messageなし)');
await browser.close();
