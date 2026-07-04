import { chromium } from 'playwright';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const base = 'http://127.0.0.1:4175/sagaforge-app/index.html';
const shotDir = resolve(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-026/screenshots');
const termDir = resolve(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-026/terminal');
const assetDir = resolve(root, 'assets');
mkdirSync(shotDir, { recursive: true });
mkdirSync(termDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
const notes = [];
await page.goto(base, { waitUntil: 'networkidle' });
await page.screenshot({ path: `${shotDir}/2026-07-05-character-collection-rpg-trial-026-home-density.png`, fullPage: true });
notes.push(await page.locator('#home').innerText());
await page.getByRole('button', { name: '周回' }).click();
await page.getByText('第1章 裂光の丘 1-5 HARD').click();
await page.getByRole('button', { name: /3周AUTOリハーサル/ }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${shotDir}/2026-07-05-character-collection-rpg-trial-026-auto-loop.png`, fullPage: true });
notes.push(await page.locator('#quests').innerText());
await page.getByRole('button', { name: '育成' }).click();
await page.screenshot({ path: `${shotDir}/2026-07-05-character-collection-rpg-trial-026-training-after-loop.png`, fullPage: true });
notes.push(await page.locator('#training').innerText());
await browser.close();
for (const name of ['home-density','auto-loop','training-after-loop']) {
  cpSync(`${shotDir}/2026-07-05-character-collection-rpg-trial-026-${name}.png`, `${assetDir}/2026-07-05-character-collection-rpg-trial-026-${name}.png`);
}
writeFileSync(resolve(termDir, 'playable-dom-screenshots.txt'), notes.join('\n---SCREEN---\n'));
console.log('captured trial026 screenshots and DOM evidence');
