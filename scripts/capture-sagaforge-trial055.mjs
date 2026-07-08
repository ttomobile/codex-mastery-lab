import { chromium } from 'playwright';
import path from 'node:path';

const root = process.cwd();
const url = 'file://' + path.join(root, 'preview/sagaforge-app/index.html');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 920 }, deviceScaleFactor: 1 });
await page.goto(url);
await page.waitForSelector('#mobileCommandBoard .command-tile');
await page.screenshot({ path: 'assets/2026-07-08-character-collection-rpg-trial-055-home.png', fullPage: true });
const before = await page.evaluate(() => ({
  title: document.title,
  tiles: document.querySelectorAll('#mobileCommandBoard .command-tile').length,
  firstTile: document.querySelector('#mobileCommandBoard .command-tile')?.textContent?.trim(),
  screen: document.querySelector('.screen.active')?.id,
}));
await page.getByRole('button', { name: '司令室から即出撃' }).click();
await page.waitForFunction(() => document.querySelector('.screen.active')?.id === 'quests');
await page.screenshot({ path: 'assets/2026-07-08-character-collection-rpg-trial-055-quest.png', fullPage: true });
const after = await page.evaluate(() => ({
  screen: document.querySelector('.screen.active')?.id,
  selectedQuest: document.querySelector('#questList .quest.selected')?.textContent?.trim(),
  status: document.querySelector('#status')?.textContent?.trim(),
}));
console.log(JSON.stringify({ before, after }, null, 2));
await browser.close();
