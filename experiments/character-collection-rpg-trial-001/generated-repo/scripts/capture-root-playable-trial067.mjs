import { chromium } from '@playwright/test';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), '../../..');
const url = `file://${root}/preview/sagaforge-app/index.html`;
const outDir = `${root}/experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-067/screenshots`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 1 });
await page.goto(url);
await page.getByText('Trial 067').first().waitFor({ timeout: 10_000 });
await page.screenshot({ path: `${outDir}/2026-07-09-character-collection-rpg-trial-067-home.png`, fullPage: true });
await page.getByRole('button', { name: '日課から出撃' }).click();
await page.getByText('クエスト / 周回').waitFor({ timeout: 10_000 });
await page.screenshot({ path: `${outDir}/2026-07-09-character-collection-rpg-trial-067-quest.png`, fullPage: true });
await page.getByRole('button', { name: 'ホーム' }).click();
await page.getByRole('button', { name: 'Round解決' }).click();
await page.getByText('Trial 067 第一段階リザルト').waitFor({ timeout: 10_000 });
await page.screenshot({ path: `${outDir}/2026-07-09-character-collection-rpg-trial-067-battle-result.png`, fullPage: true });
const summary = await page.evaluate(() => ({
  title: document.title,
  hasTrial067: document.body.innerText.includes('Trial 067'),
  hasResult: document.body.innerText.includes('Trial 067 第一段階リザルト'),
  activeScreen: [...document.querySelectorAll('.screen')].find(e => e.classList.contains('active'))?.id,
}));
console.log(JSON.stringify({ url, summary }, null, 2));
await browser.close();
