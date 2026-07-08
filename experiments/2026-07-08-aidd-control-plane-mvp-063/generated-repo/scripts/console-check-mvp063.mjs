import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const terminalDir = path.join(root, 'artifacts', 'terminal');
mkdirSync(terminalDir, { recursive: true });
const port = '3065';
const server = spawn('pnpm', ['exec', 'next', 'dev', '--hostname', '127.0.0.1', '--port', port], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
const serverLogs = [];
server.stdout.on('data', d => serverLogs.push(d.toString()));
server.stderr.on('data', d => serverLogs.push(d.toString()));
async function waitReady() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}`);
      if (res.ok) return;
    } catch (error) {
      serverLogs.push(`health retry: ${error instanceof Error ? error.message : String(error)}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('server not ready');
}
const messages = [];
try {
  await waitReady();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => messages.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => messages.push(`pageerror: ${err.message}`));
  await page.goto(`http://127.0.0.1:${port}`);
  for (const label of ['待機中', '実行中', '成功', '失敗', '証跡不足', '空']) {
    await page.getByRole('button', { name: label }).click();
    await page.waitForTimeout(150);
  }
  await browser.close();
  writeFileSync(path.join(terminalDir, 'browser-console-mvp063.txt'), messages.length ? messages.join('\n') : 'console errors/warnings: none\n');
  console.log(messages.length ? messages.join('\n') : 'console errors/warnings: none');
} finally {
  server.kill('SIGTERM');
}
