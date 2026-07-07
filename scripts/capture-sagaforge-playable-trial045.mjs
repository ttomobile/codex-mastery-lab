import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const playable = `file://${root}/playables/sagaforge-app/index.html`;
const assetDir = `${root}/assets`;
const artifactDir = `${root}/experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-045`;
mkdirSync(assetDir, { recursive: true });
mkdirSync(`${artifactDir}/screenshots`, { recursive: true });
mkdirSync(`${artifactDir}/terminal`, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 1100 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));
await page.goto(playable);
await page.screenshot({ path: `${assetDir}/2026-07-07-character-collection-rpg-trial-045-home.png`, fullPage: true });

await page.getByRole('button', { name: '編成' }).click();
await page.getByRole('button', { name: '弱点一致' }).click();
await page.screenshot({ path: `${assetDir}/2026-07-07-character-collection-rpg-trial-045-filter.png`, fullPage: true });

await page.getByRole('button', { name: '適性順' }).click();
await page.locator('#inheritanceBoard').scrollIntoViewIfNeeded();
await page.getByRole('button', { name: /逆風斬り BP4/ }).click();
await page.screenshot({ path: `${assetDir}/2026-07-07-character-collection-rpg-trial-045-inherit.png`, fullPage: true });

await page.getByRole('button', { name: '周回' }).click();
await page.locator('#questRecommendedSwapBoard').scrollIntoViewIfNeeded();
await page.screenshot({ path: `${assetDir}/2026-07-07-character-collection-rpg-trial-045-quest-recommend.png`, fullPage: true });

const data = await page.evaluate(() => ({
  title: document.title,
  trial: document.querySelector('.eyebrow')?.textContent,
  candidateCards: document.querySelectorAll('#candidateBoard .advice').length,
  recommended: document.querySelectorAll('#recommendedSwapBoard .advice').length,
  questRecommended: document.querySelectorAll('#questRecommendedSwapBoard .advice').length,
  inheritance: document.querySelectorAll('#inheritanceBoard .advice').length,
  sortButton: document.querySelector('#candidateSortButton')?.textContent,
  inheritCommand: document.querySelector('#inheritCommand')?.textContent,
  log: document.querySelector('#trainLog')?.textContent,
}));
data.consoleErrors = errors;
await browser.close();
if (errors.length) {
  console.error(JSON.stringify(data, null, 2));
  process.exit(1);
}
const log = `Trial 045 playable verification\n${JSON.stringify(data, null, 2)}\n`;
writeFileSync(`${artifactDir}/terminal/trial045-playable-verification.txt`, log);
writeFileSync(`${assetDir}/2026-07-07-character-collection-rpg-trial-045-terminal.txt`, log);
for (const name of ['home','filter','inherit','quest-recommend']) {
  await import('node:fs').then(fs => fs.copyFileSync(`${assetDir}/2026-07-07-character-collection-rpg-trial-045-${name}.png`, `${artifactDir}/screenshots/2026-07-07-character-collection-rpg-trial-045-${name}.png`));
}
console.log(log);
