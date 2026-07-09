import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const playable = `file://${path.join(root, 'playables/sagaforge-app/index.html')}`;
const assetDir = path.join(root, 'assets');
const artifactDir = path.join(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-066/screenshots');
fs.mkdirSync(assetDir, { recursive: true });
fs.mkdirSync(artifactDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 980 }, deviceScaleFactor: 1 });
const consoleMessages = [];
page.on('console', msg => consoleMessages.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', err => consoleMessages.push(`pageerror: ${err.message}`));
await page.goto(playable);
await page.getByText('Trial 066: 5人連携の作戦チケット').waitFor({ timeout: 5000 });
await page.screenshot({ path: path.join(assetDir, '2026-07-09-character-collection-rpg-trial-066-home.png'), fullPage: true });
await page.screenshot({ path: path.join(artifactDir, '2026-07-09-character-collection-rpg-trial-066-home.png'), fullPage: true });
await page.getByRole('button', { name: '瞬間火力' }).click();
await page.getByRole('button', { name: '作戦を解決' }).click();
await page.getByText('Trial 066 作戦チケット報酬').waitFor({ timeout: 5000 });
await page.screenshot({ path: path.join(assetDir, '2026-07-09-character-collection-rpg-trial-066-battle.png'), fullPage: true });
await page.screenshot({ path: path.join(artifactDir, '2026-07-09-character-collection-rpg-trial-066-battle.png'), fullPage: true });
const state = await page.evaluate(() => ({
  title: document.title,
  trial066: document.body.innerText.includes('Trial 066'),
  reward: document.body.innerText.includes('Trial 066 作戦チケット報酬'),
  log: document.querySelector('#trial066Log')?.textContent || '',
  result: document.querySelector('#result')?.textContent || ''
}));
await browser.close();
console.log(JSON.stringify({ playable, state, consoleMessages }, null, 2));
