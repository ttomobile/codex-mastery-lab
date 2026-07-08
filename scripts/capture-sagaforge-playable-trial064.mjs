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
await page.screenshot({ path: resolve(outDir, '2026-07-09-character-collection-rpg-trial-064-home.png'), fullPage: true });
await page.getByRole('button', { name: '日課をまとめる' }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: resolve(outDir, '2026-07-09-character-collection-rpg-trial-064-daily.png'), fullPage: true });
await page.getByRole('button', { name: '今日の1周を開始' }).click();
await page.waitForTimeout(200);
await page.evaluate(() => window.trial064BattleBurst());
await page.waitForTimeout(250);
await page.screenshot({ path: resolve(outDir, '2026-07-09-character-collection-rpg-trial-064-battle-result.png'), fullPage: true });
await page.getByRole('button', { name: '報酬を育成へ', exact: true }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: resolve(outDir, '2026-07-09-character-collection-rpg-trial-064-training.png'), fullPage: true });
const state = await page.evaluate(() => ({
  title: document.title,
  active: document.querySelector('.screen.active')?.id,
  cards: document.querySelectorAll('.trial064-card').length,
  steps: document.querySelectorAll('.trial064-step').length,
  log: document.querySelector('#trial064Log')?.textContent,
  trainingLog: document.querySelector('#trainLog')?.textContent,
  result: document.querySelector('#result')?.textContent,
  visibleText: document.body.innerText
}));
await browser.close();
console.log(JSON.stringify({ errors, state }, null, 2));
if (errors.length) process.exit(1);
if (state.title !== '星紋遠征隊 SagaForge Trial 064') process.exit(2);
if (state.cards < 6 || state.steps < 5) process.exit(3);
if (!state.trainingLog?.includes('Trial 064')) process.exit(4);
if (/ロマサガ|Romancing|SaGa|公式/.test(state.visibleText)) process.exit(5);
