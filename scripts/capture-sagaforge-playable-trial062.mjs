import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requireFromGenerated = createRequire(resolve(root, 'experiments/character-collection-rpg-trial-001/generated-repo/package.json'));
const { chromium } = requireFromGenerated('@playwright/test');
const playable = resolve(root, 'playables/sagaforge-app/index.html');
const outDir = resolve(root, 'assets');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 1120 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
await page.goto(`file://${playable}`, { waitUntil: 'networkidle' });
await page.screenshot({ path: resolve(outDir, '2026-07-09-character-collection-rpg-trial-062-home.png'), fullPage: true });
await page.getByRole('button', { name: '連携リール準備' }).click();
await page.waitForTimeout(250);
await page.getByRole('button', { name: '次ステップ解決' }).click();
await page.getByRole('button', { name: '次ステップ解決' }).click();
await page.screenshot({ path: resolve(outDir, '2026-07-09-character-collection-rpg-trial-062-reel.png'), fullPage: true });
await page.getByRole('button', { name: '勝利報酬まで短縮' }).click();
await page.waitForTimeout(250);
await page.screenshot({ path: resolve(outDir, '2026-07-09-character-collection-rpg-trial-062-battle-result.png'), fullPage: true });
const state = await page.evaluate(() => ({
  title: document.title,
  active: document.querySelector('.screen.active')?.id,
  cards: document.querySelectorAll('.trial062-card').length,
  rewards: document.querySelectorAll('.trial062-reward').length,
  log: document.querySelector('#trial062Log')?.textContent,
  result: document.querySelector('#result')?.textContent,
  bp: document.querySelector('#bp')?.textContent,
  od: document.querySelector('#od')?.textContent,
  meter: document.querySelector('#trial062Meter')?.style.width
}));
await browser.close();
console.log(JSON.stringify({ errors, state }, null, 2));
if (errors.length) process.exit(1);
if (state.title !== '星紋遠征隊 SagaForge Trial 062') process.exit(2);
if (state.cards < 5 || state.rewards < 4) process.exit(3);
if (!state.log?.includes('勝利')) process.exit(4);
