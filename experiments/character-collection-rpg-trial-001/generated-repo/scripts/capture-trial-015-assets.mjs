import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(process.cwd());
const experiment = resolve(repo, '..');
const root = resolve(experiment, '../..');
const shotDir = join(experiment, 'artifacts', 'character-collection-rpg-trial-015', 'screenshots');
const assetsDir = join(root, 'assets');
mkdirSync(shotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const mocks = spawn('pnpm', ['run', 'mock:start'], { cwd: repo, env: { ...process.env, SAGAFORGE_MOCK_NODE_ONLY: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
const app = spawn('pnpm', ['exec', 'next', 'dev', '--hostname', '127.0.0.1', '--port', '3155'], {
  cwd: repo,
  env: { ...process.env, NEXT_PUBLIC_MOCK_BASE_URL: 'http://127.0.0.1:4100' },
  stdio: ['ignore', 'pipe', 'pipe']
});

async function waitFor(url, timeoutMs = 45_000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`timeout waiting for ${url}`);
}
async function scenario(name) {
  await fetch('http://127.0.0.1:4100/__control/state', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: name }) });
}
function copy(name) { copyFileSync(join(shotDir, name), join(assetsDir, name)); }

try {
  await waitFor('http://127.0.0.1:4100/health');
  await waitFor('http://127.0.0.1:3155');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 980 }, deviceScaleFactor: 2 });

  await scenario('success');
  await page.goto('http://127.0.0.1:3155', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '報酬' }).click();
  await page.screenshot({ path: join(shotDir, '2026-07-04-character-collection-rpg-trial-015-reward-pending.png'), fullPage: true });

  await scenario('battle_win');
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '報酬' }).click();
  await page.screenshot({ path: join(shotDir, '2026-07-04-character-collection-rpg-trial-015-reward-claimable.png'), fullPage: true });
  await page.getByTestId('claim-reward').click();
  await page.screenshot({ path: join(shotDir, '2026-07-04-character-collection-rpg-trial-015-reward-claimed.png'), fullPage: true });

  await browser.close();
  for (const name of [
    '2026-07-04-character-collection-rpg-trial-015-reward-pending.png',
    '2026-07-04-character-collection-rpg-trial-015-reward-claimable.png',
    '2026-07-04-character-collection-rpg-trial-015-reward-claimed.png'
  ]) copy(name);
} finally {
  app.kill('SIGTERM');
  mocks.kill('SIGTERM');
  spawn('pnpm', ['run', 'mock:stop'], { cwd: repo, stdio: 'ignore' });
}
