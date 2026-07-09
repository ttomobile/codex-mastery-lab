import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const root = resolve(import.meta.dirname, '..');
const url = pathToFileURL(resolve(root, 'preview/sagaforge-app/index.html')).href;
const shotDir = resolve(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-074/screenshots');
const assetDir = resolve(root, 'assets');
mkdirSync(shotDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-074-home.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-074-home.png'), fullPage: true });
await page.getByRole('button', { name: 'スタイル', exact: true }).click();
await page.getByText('緋炎旋風 BP7').click();
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-074-style-inherit.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-074-style-inherit.png'), fullPage: true });
await page.getByRole('button', { name: '編成に反映' }).click();
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-074-party-inherit.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-074-party-inherit.png'), fullPage: true });
await page.getByRole('button', { name: '周回へ' }).click();
await page.getByRole('button', { name: '選択クエストへ出撃' }).click();
await page.getByRole('button', { name: '弱点連携' }).click();
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-074-battle-inherit.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-074-battle-inherit.png'), fullPage: true });
const finalText = await page.locator('body').innerText();
const htmlText = readFileSync(resolve(root, 'playables/sagaforge-app/index.html'), 'utf8');
for (const token of ['Trial 074', '同一キャラ別スタイル', '技継承', 'inheritPools']) {
  if (!htmlText.includes(token)) throw new Error(`missing source token: ${token}`);
}
for (const token of ['継承判断', '緋炎旋風', '星紋三連携']) {
  if (!finalText.includes(token)) throw new Error(`missing visible token: ${token}`);
}
if (errors.length) throw new Error(errors.join('\n'));
await browser.close();
console.log(`captured trial074 screenshots from ${url}`);
