import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const root = resolve(import.meta.dirname, '..');
const url = pathToFileURL(resolve(root, 'preview/sagaforge-app/index.html')).href;
const shotDir = resolve(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-075/screenshots');
const assetDir = resolve(root, 'assets');
mkdirSync(shotDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-075-home.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-075-home.png'), fullPage: true });
await page.getByRole('button', { name: '全員継承' }).click();
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-075-party-inherit-all.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-075-party-inherit-all.png'), fullPage: true });
await page.getByRole('button', { name: '周回へ' }).click();
await page.getByRole('button', { name: '選択クエストへ出撃' }).click();
await page.locator('#battlePlan').getByText('全員継承', { exact: true }).waitFor();
await page.getByRole('button', { name: '弱点連携' }).click();
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-075-battle-all-inherit.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-075-battle-all-inherit.png'), fullPage: true });
await page.getByRole('button', { name: '召喚' }).click();
await page.getByRole('button', { name: '10連結果を更新' }).click();
await page.getByText('継承候補解放').first().waitFor();
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-075-gacha-unlock.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-075-gacha-unlock.png'), fullPage: true });
const gachaText = await page.locator('body').innerText();
await page.getByRole('button', { name: 'ホーム' }).click();
const finalText = await page.locator('body').innerText();
const htmlText = readFileSync(resolve(root, 'playables/sagaforge-app/index.html'), 'utf8');
for (const token of ['Trial 075', '5人全員継承', 'slotInherits', 'unlockedFromGacha']) {
  if (!htmlText.includes(token)) throw new Error(`missing source token: ${token}`);
}
for (const token of ['全員継承', '予約BP']) {
  if (!finalText.includes(token)) throw new Error(`missing visible token: ${token}`);
}
if (!gachaText.includes('継承候補解放')) throw new Error('missing visible token: 継承候補解放');
if (errors.length) throw new Error(errors.join('\n'));
await browser.close();
console.log(`captured trial075 screenshots from ${url}`);
