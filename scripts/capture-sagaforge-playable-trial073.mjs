import { chromium } from 'playwright';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const root = resolve(import.meta.dirname, '..');
const url = pathToFileURL(resolve(root, 'preview/sagaforge-app/index.html')).href;
const shotDir = resolve(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-073/screenshots');
const assetDir = resolve(root, 'assets');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-073-home.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-073-home.png'), fullPage: true });
await page.getByRole('button', { name: 'プレゼント受取' }).click();
await page.getByRole('button', { name: '5人陣形' }).click();
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-073-party.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-073-party.png'), fullPage: true });
await page.getByRole('button', { name: '周回', exact: true }).click();
await page.getByRole('button', { name: '選択クエストへ出撃' }).click();
await page.getByRole('button', { name: 'OD号令' }).click();
await page.screenshot({ path: resolve(shotDir, '2026-07-10-character-collection-rpg-trial-073-battle-result.png'), fullPage: true });
await page.screenshot({ path: resolve(assetDir, '2026-07-10-character-collection-rpg-trial-073-battle-result.png'), fullPage: true });
const finalText = await page.locator('body').innerText();
const htmlText = (await import('fs')).readFileSync(resolve(root, 'playables/sagaforge-app/index.html'), 'utf8');
for (const token of ['Trial 073', 'イベント/プレゼント/デイリー', '陣形マップ / 継承枠']) {
  if (!htmlText.includes(token)) throw new Error(`missing source token: ${token}`);
}
for (const token of ['ターン方針 / WAVE判断', '勝利報酬']) {
  if (!finalText.includes(token)) throw new Error(`missing visible token: ${token}`);
}
if (errors.length) throw new Error(errors.join('\n'));
await browser.close();
console.log(`captured trial073 screenshots from ${url}`);
