import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const root = process.cwd().replace('/experiments/character-collection-rpg-trial-001/generated-repo', '');
const out = `${root}/experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-068/screenshots`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 920 }, deviceScaleFactor: 1 });
await page.goto(`file://${root}/preview/sagaforge-app/index.html`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#trial068Board');
await page.screenshot({ path: `${out}/2026-07-09-character-collection-rpg-trial-068-home.png`, fullPage: true });
await page.getByRole('button', { name: '日課→出撃' }).click();
await page.waitForSelector('#questList');
await page.screenshot({ path: `${out}/2026-07-09-character-collection-rpg-trial-068-quest.png`, fullPage: true });
await page.getByRole('button', { name: 'ホーム' }).click();
await page.getByRole('button', { name: 'Round連携' }).click();
await page.waitForSelector('#resultCards');
await page.screenshot({ path: `${out}/2026-07-09-character-collection-rpg-trial-068-battle-result.png`, fullPage: true });
await page.getByRole('button', { name: 'ホーム' }).click();
await page.getByRole('button', { name: '10連結果', exact: true }).click();
await page.waitForSelector('#results');
await page.screenshot({ path: `${out}/2026-07-09-character-collection-rpg-trial-068-gacha.png`, fullPage: true });
const state = await page.evaluate(() => ({
  title: document.title,
  visibleScreen: [...document.querySelectorAll('.screen.active')].map((n) => n.id),
  resultCards: document.querySelectorAll('#results .result').length,
  trial068Cards: document.querySelectorAll('#trial068Board .trial068-card').length,
}));
console.log(JSON.stringify(state, null, 2));
await browser.close();
