import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const playable = `file://${path.join(root, 'playables/sagaforge-app/index.html')}`;
const assetDir = path.join(root, 'assets');
const artifactDir = path.join(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-069/screenshots');
fs.mkdirSync(assetDir, { recursive: true });
fs.mkdirSync(artifactDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 980 }, deviceScaleFactor: 1 });
const consoleMessages = [];
page.on('console', msg => consoleMessages.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', err => consoleMessages.push(`pageerror: ${err.message}`));
await page.goto(playable);
await page.getByText('Trial 069: 第一段階を触れる日課ループへ固定').waitFor({ timeout: 5000 });
await page.screenshot({ path: path.join(assetDir, '2026-07-09-character-collection-rpg-trial-069-home.png'), fullPage: true });
await page.screenshot({ path: path.join(artifactDir, '2026-07-09-character-collection-rpg-trial-069-home.png'), fullPage: true });
await page.getByRole('button', { name: '日課ループ' }).click();
await page.waitForFunction(() => document.querySelector('.screen.active')?.id === 'quests', null, { timeout: 5000 });
await page.screenshot({ path: path.join(assetDir, '2026-07-09-character-collection-rpg-trial-069-quest.png'), fullPage: true });
await page.screenshot({ path: path.join(artifactDir, '2026-07-09-character-collection-rpg-trial-069-quest.png'), fullPage: true });
await page.evaluate(() => window.trial069Act('battle'));
await page.getByText('Trial 069: Round/BP/OD連携を勝利まで解決').waitFor({ timeout: 5000 });
await page.screenshot({ path: path.join(assetDir, '2026-07-09-character-collection-rpg-trial-069-battle-result.png'), fullPage: true });
await page.screenshot({ path: path.join(artifactDir, '2026-07-09-character-collection-rpg-trial-069-battle-result.png'), fullPage: true });
const state = await page.evaluate(() => ({
  title: document.title,
  hasTrial069: document.body.innerText.includes('Trial 069'),
  activeScreen: document.querySelector('.screen.active')?.id,
  log: document.querySelector('#trial069Log')?.textContent || '',
  result: document.querySelector('#result')?.textContent || '',
  timeline: [...document.querySelectorAll('#trial069Timeline .trial069-step')].map((e) => e.textContent?.trim())
}));
await browser.close();
console.log(JSON.stringify({ playable, state, consoleMessages }, null, 2));
