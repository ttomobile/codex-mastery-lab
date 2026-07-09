import { chromium } from 'playwright';

const url = 'https://ttomac-mini.tail352b67.ts.net/sagaforge-app/index.html';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.getByText('Trial 075').first().waitFor();
await page.getByRole('button', { name: '全員継承' }).click();
await page.getByText('継承枠:').first().waitFor();
await page.getByRole('button', { name: '召喚' }).click();
await page.getByRole('button', { name: '10連結果を更新' }).click();
await page.getByText('継承候補解放').first().waitFor();
const gachaText = await page.locator('body').innerText();
await page.getByRole('button', { name: 'ホーム' }).click();
const bodyText = await page.locator('body').innerText();
for (const token of ['5人全員継承', '予約BP']) {
  if (!bodyText.includes(token)) throw new Error(`${token} not visible on public playable`);
}
if (!gachaText.includes('継承候補解放')) throw new Error('継承候補解放 not visible on public playable');
if (errors.length) throw new Error(errors.join('\n'));
await browser.close();
console.log('public playable trial075 controls visible and all-inherit/gacha interaction ok');
