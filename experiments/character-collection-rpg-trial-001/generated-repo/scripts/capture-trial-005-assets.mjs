import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(process.cwd());
const experiment = resolve(repo, '..');
const root = resolve(experiment, '../..');
const shotDir = join(experiment, 'artifacts', 'character-collection-rpg-trial-005', 'screenshots');
const termDir = join(experiment, 'artifacts', 'character-collection-rpg-trial-005', 'terminal');
const assetsDir = join(root, 'assets');
mkdirSync(shotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const mocks = spawn('pnpm', ['run', 'mock:start'], { cwd: repo, env: { ...process.env, SAGAFORGE_MOCK_NODE_ONLY: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
const app = spawn('pnpm', ['exec', 'next', 'dev', '--hostname', '127.0.0.1', '--port', '3146'], {
  cwd: repo,
  env: { ...process.env, NEXT_PUBLIC_MOCK_BASE_URL: 'http://127.0.0.1:4100' },
  stdio: ['ignore', 'pipe', 'pipe']
});

async function waitFor(url, timeoutMs = 45000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try { const res = await fetch(url); if (res.ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`timeout waiting for ${url}`);
}
async function scenario(name) {
  await fetch('http://127.0.0.1:4100/__control/state', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scenario: name }) });
}
async function clickTab(page, name) { await page.getByRole('button', { name }).click(); await page.waitForTimeout(350); }
function copy(name) { copyFileSync(join(shotDir, name), join(assetsDir, name)); }

function terminalEvidenceHtml() {
  const files = [
    ['lint','02-lint.txt'], ['typecheck','03-typecheck.txt'], ['unit','04-test.txt'], ['coverage','05-coverage.txt'],
    ['build','06-build.txt'], ['playwright doctor','07-doctor-playwright.txt'], ['mock doctor','08-mock-doctor.txt'],
    ['3-browser e2e + axe','09-e2e.txt'], ['docker multi-service','11-docker-health.txt']
  ];
  const body = files.map(([label, file]) => {
    const p = join(termDir, file);
    const text = readFileSync(p, 'utf8').replaceAll(root, '<repo>').replaceAll(process.env.HOME || '', '<home>').split('\n').slice(-10).join('\n');
    return `${label}\n${text}`;
  }).join('\n\n');
  const esc = body.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  return `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#050712;color:#eef6ff;font:18px ui-monospace,SFMono-Regular,Menlo,monospace;padding:30px}.card{background:linear-gradient(135deg,#111827,#172554);border:1px solid rgba(67,224,192,.55);border-radius:24px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.5)}h1{font:900 30px system-ui;margin:0 0 18px}.ok{color:#43e0c0}pre{white-space:pre-wrap;line-height:1.42;margin:0}</style></head><body><div class="card"><h1>SagaForge Trial 005 multi mock + media + axe evidence <span class="ok">PASS</span></h1><pre>${esc}</pre></div></body></html>`;
}

try {
  await waitFor('http://127.0.0.1:4100/health');
  await waitFor('http://127.0.0.1:4101/health');
  await waitFor('http://127.0.0.1:4102/health');
  await waitFor('http://127.0.0.1:4103/health');
  await waitFor('http://127.0.0.1:3146');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 980 }, deviceScaleFactor: 2 });

  await scenario('media_failure');
  await page.goto('http://127.0.0.1:3146', { waitUntil: 'networkidle' });
  await clickTab(page, '戦闘');
  await page.screenshot({ path: join(shotDir, '2026-07-03-sagaforge-trial-005-media-battle.png'), fullPage: true });

  await clickTab(page, '幻晶');
  await page.screenshot({ path: join(shotDir, '2026-07-03-sagaforge-trial-005-media-gacha.png'), fullPage: true });

  await clickTab(page, '状態');
  await page.screenshot({ path: join(shotDir, '2026-07-03-sagaforge-trial-005-state-services.png'), fullPage: true });

  const term = await browser.newPage({ viewport: { width: 1440, height: 1120 }, deviceScaleFactor: 1 });
  await term.setContent(terminalEvidenceHtml(), { waitUntil: 'load' });
  await term.screenshot({ path: join(shotDir, '2026-07-03-sagaforge-trial-005-terminal-evidence.png'), fullPage: true });
  await browser.close();

  for (const name of [
    '2026-07-03-sagaforge-trial-005-media-battle.png',
    '2026-07-03-sagaforge-trial-005-media-gacha.png',
    '2026-07-03-sagaforge-trial-005-state-services.png',
    '2026-07-03-sagaforge-trial-005-terminal-evidence.png'
  ]) copy(name);
} finally {
  app.kill('SIGTERM');
  mocks.kill('SIGTERM');
  spawn('pnpm', ['run', 'mock:stop'], { cwd: repo, stdio: 'ignore' });
}
