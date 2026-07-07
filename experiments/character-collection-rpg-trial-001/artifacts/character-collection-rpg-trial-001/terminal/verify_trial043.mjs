import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../../../../..');
const url = 'file://' + path.join(root, 'playables/sagaforge-app/index.html');
const assetDir = path.join(root, 'assets');
const logs = [];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
page.on('console', msg => logs.push(`${msg.type()}: ${msg.text()}`));
page.on('pageerror', err => logs.push(`pageerror: ${err.message}`));
await page.goto(url);
await page.getByRole('heading', { name: '星紋遠征隊' }).waitFor();
await page.screenshot({ path: path.join(assetDir, '2026-07-07-character-collection-rpg-trial-043-home.png'), fullPage: true });

await page.getByRole('button', { name: '編成' }).click();
await page.screenshot({ path: path.join(assetDir, '2026-07-07-character-collection-rpg-trial-043-party-before.png'), fullPage: true });
const beforePower = await page.locator('#partyPower').innerText();
await page.getByRole('button', { name: 'この枠を変更' }).first().click();
await page.waitForTimeout(150);
const afterPower = await page.locator('#partyPower').innerText();
await page.screenshot({ path: path.join(assetDir, '2026-07-07-character-collection-rpg-trial-043-party-after.png'), fullPage: true });

await page.getByRole('button', { name: '周回' }).click();
await page.getByRole('button', { name: '選ぶ' }).nth(1).click();
await page.screenshot({ path: path.join(assetDir, '2026-07-07-character-collection-rpg-trial-043-quest-compare.png'), fullPage: true });

await page.getByRole('button', { name: '戦闘' }).click();
await page.getByRole('button', { name: '弱点優先で自動予約' }).click();
await page.screenshot({ path: path.join(assetDir, '2026-07-07-character-collection-rpg-trial-043-battle-plan.png'), fullPage: true });

await page.getByRole('button', { name: '召喚' }).click();
await page.screenshot({ path: path.join(assetDir, '2026-07-07-character-collection-rpg-trial-043-gacha.png'), fullPage: true });

const summary = await page.evaluate(() => ({
  title: document.title,
  trial: document.querySelector('.eyebrow')?.textContent,
  partyButtons: [...document.querySelectorAll('button')].filter((b) => b.textContent?.includes('この枠を変更')).length,
  beforePower: globalThis.__beforePower,
  styleCards: document.querySelectorAll('.style-card').length,
  questCompare: document.querySelectorAll('#questCompare .advice').length,
  loadoutRows: document.querySelectorAll('#questLoadout .advice').length,
  status: document.querySelector('#status')?.textContent,
}));
summary.beforePower = beforePower;
summary.afterPower = afterPower;
summary.powerChanged = beforePower !== afterPower;
summary.console = logs;
console.log('Trial 043 playable verification');
console.log(JSON.stringify(summary, null, 2));
await browser.close();
