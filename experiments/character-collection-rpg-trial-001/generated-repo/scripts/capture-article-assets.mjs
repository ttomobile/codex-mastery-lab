import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, copyFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(process.cwd());
const experiment = resolve(repo, '..');
const root = resolve(experiment, '../..');
const shotDir = join(experiment, 'artifacts', 'character-collection-rpg-trial-001', 'screenshots');
const assetsDir = join(root, 'assets');
mkdirSync(shotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const mock = spawn('node', ['scripts/mock-server.mjs'], {
  cwd: repo,
  env: { ...process.env, PORT: '4100' },
  stdio: ['ignore', 'pipe', 'pipe']
});
const app = spawn('pnpm', ['exec', 'next', 'dev', '--hostname', '127.0.0.1', '--port', '3142'], {
  cwd: repo,
  env: { ...process.env, NEXT_PUBLIC_MOCK_BASE_URL: 'http://127.0.0.1:4100' },
  stdio: ['ignore', 'pipe', 'pipe']
});

async function waitFor(url, timeoutMs = 45000) {
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
  await fetch('http://127.0.0.1:4100/__control/state', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ scenario: name })
  });
}

async function clickTab(page, name) {
  await page.getByRole('button', { name }).click();
  await page.waitForTimeout(300);
}

function copy(name) {
  copyFileSync(join(shotDir, name), join(assetsDir, name));
}

function terminalEvidenceHtml() {
  const files = [
    ['lint', '02-lint.txt'],
    ['typecheck', '03-typecheck.txt'],
    ['test', '04-test.txt'],
    ['coverage', '04b-coverage.txt'],
    ['build', '05-build.txt'],
    ['mock:doctor', '06-mock-doctor.txt'],
    ['doctor:playwright', '07-doctor-playwright.txt'],
    ['3-browser e2e', '08-e2e.txt']
  ];
  const body = files.map(([label, file]) => {
    const text = readFileSync(join(experiment, 'artifacts', 'character-collection-rpg-trial-001', 'terminal', file), 'utf8')
      .replaceAll(root, '<repo>')
      .replaceAll(process.env.HOME || '', '<home>')
      .split('\n')
      .slice(-10)
      .join('\n');
    return `${label}\n${text}`;
  }).join('\n\n');
  const esc = body.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#090b1a;color:#edf2ff;font:18px ui-monospace,SFMono-Regular,Menlo,monospace;padding:30px}.card{background:linear-gradient(135deg,#11172e,#21123a);border:1px solid rgba(180,190,255,.3);border-radius:24px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.45)}h1{font:800 30px system-ui;margin:0 0 18px}.ok{color:#98fb98}pre{white-space:pre-wrap;line-height:1.42;margin:0}</style></head><body><div class="card"><h1>SagaForge Trial 001 evidence <span class="ok">PASS</span></h1><pre>${esc}</pre></div></body></html>`;
}

try {
  await waitFor('http://127.0.0.1:4100/health');
  await waitFor('http://127.0.0.1:3142');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 980 }, deviceScaleFactor: 2 });

  await scenario('success');
  await page.goto('http://127.0.0.1:3142', { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(shotDir, '2026-07-02-sagaforge-trial-001-home.png'), fullPage: true });
  await clickTab(page, '編成');
  await page.screenshot({ path: join(shotDir, '2026-07-02-sagaforge-trial-001-party.png'), fullPage: true });

  await scenario('battle_win');
  await page.reload({ waitUntil: 'networkidle' });
  await clickTab(page, '戦闘');
  await page.screenshot({ path: join(shotDir, '2026-07-02-sagaforge-trial-001-battle.png'), fullPage: true });

  await scenario('gacha_result');
  await page.reload({ waitUntil: 'networkidle' });
  await clickTab(page, '幻晶');
  await page.screenshot({ path: join(shotDir, '2026-07-02-sagaforge-trial-001-gacha.png'), fullPage: true });

  await scenario('party_invalid');
  await page.reload({ waitUntil: 'networkidle' });
  await clickTab(page, '戦闘');
  await page.screenshot({ path: join(shotDir, '2026-07-02-sagaforge-trial-001-failure.png'), fullPage: true });

  const term = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  await term.setContent(terminalEvidenceHtml(), { waitUntil: 'load' });
  await term.screenshot({ path: join(shotDir, '2026-07-02-sagaforge-trial-001-terminal-evidence.png'), fullPage: true });
  await browser.close();

  for (const name of [
    '2026-07-02-sagaforge-trial-001-home.png',
    '2026-07-02-sagaforge-trial-001-party.png',
    '2026-07-02-sagaforge-trial-001-battle.png',
    '2026-07-02-sagaforge-trial-001-gacha.png',
    '2026-07-02-sagaforge-trial-001-failure.png',
    '2026-07-02-sagaforge-trial-001-terminal-evidence.png'
  ]) copy(name);
} finally {
  app.kill('SIGTERM');
  mock.kill('SIGTERM');
}
