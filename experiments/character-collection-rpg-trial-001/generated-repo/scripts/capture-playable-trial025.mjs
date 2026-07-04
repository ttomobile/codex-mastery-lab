import { chromium } from 'playwright';
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const base = 'http://127.0.0.1:4175/sagaforge-app/index.html';
const shotDir = resolve(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-025/screenshots');
const assetDir = resolve(root, 'assets');
mkdirSync(shotDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
const notes = [];
await page.goto(base, { waitUntil: 'networkidle' });
await page.screenshot({ path: `${shotDir}/2026-07-05-character-collection-rpg-trial-025-home-loop.png`, fullPage: true });
notes.push(await page.locator('body').innerText());
await page.getByRole('button', { name: '戦闘' }).click();
await page.getByRole('button', { name: /星紋号令/ }).click();
await page.getByRole('button', { name: /影縛り/ }).click();
await page.getByRole('button', { name: /AUTO判断/ }).click();
await page.screenshot({ path: `${shotDir}/2026-07-05-character-collection-rpg-trial-025-battle-status.png`, fullPage: true });
notes.push(await page.locator('#battle').innerText());
await page.getByRole('button', { name: '召喚' }).click();
for (let i = 0; i < 2; i++) await page.getByRole('button', { name: /10連スタイル召喚/ }).click();
await page.screenshot({ path: `${shotDir}/2026-07-05-character-collection-rpg-trial-025-gacha-exchange.png`, fullPage: true });
notes.push(await page.locator('#gacha').innerText());
await browser.close();
for (const name of ['home-loop','battle-status','gacha-exchange']) {
  cpSync(`${shotDir}/2026-07-05-character-collection-rpg-trial-025-${name}.png`, `${assetDir}/2026-07-05-character-collection-rpg-trial-025-${name}.png`);
}
writeFileSync(resolve(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-025/terminal/playable-dom-screenshots.txt'), notes.join('\n---SCREEN---\n'));
console.log('captured trial025 screenshots and DOM evidence');
