import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd(), '../../..');
const url = 'http://127.0.0.1:4173/sagaforge-app/index.html';
const outDir = path.join(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-061/screenshots');
fs.mkdirSync(outDir, { recursive: true });
const terminalDir = path.join(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-061/terminal');
fs.mkdirSync(terminalDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 920 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(String(e.message || e)));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(outDir, '2026-07-09-character-collection-rpg-trial-061-home.png'), fullPage: true });
await page.getByRole('button', { name: '弱点適性で入替' }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, '2026-07-09-character-collection-rpg-trial-061-decision.png'), fullPage: true });
await page.getByRole('button', { name: '連携優先で予約' }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, '2026-07-09-character-collection-rpg-trial-061-battle.png'), fullPage: true });
const state = await page.evaluate(() => ({
  title: document.title,
  active: document.querySelector('.screen.active')?.id,
  trial061Cards: document.querySelectorAll('#trial061Board .trial061-card').length,
  trial061Log: document.querySelector('#trial061Log')?.textContent,
  battleResult: document.querySelector('#result')?.textContent,
  bp: document.querySelector('#bp')?.textContent,
  od: document.querySelector('#od')?.textContent,
  hotCards: document.querySelectorAll('#trial061Board .hot').length,
}));
await browser.close();
const result = { errors, state };
fs.writeFileSync(path.join(terminalDir, 'trial061-playwright-check.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exit(1);
if (state.trial061Cards !== 6) throw new Error(`trial061Cards expected 6, got ${state.trial061Cards}`);
if (state.active !== 'battle') throw new Error(`active expected battle, got ${state.active}`);
