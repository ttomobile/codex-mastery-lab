import { chromium } from 'playwright';
const url = 'https://ttomac-mini.tail352b67.ts.net/sagaforge-app/index.html';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'プレゼント受取' }).click();
await page.getByRole('button', { name: '5人陣形' }).click();
await page.getByRole('button', { name: '周回', exact: true }).click();
await page.getByRole('button', { name: '選択クエストへ出撃' }).click();
const text = await page.locator('body').innerText();
for (const token of ['TRIAL 073', 'ターン方針 / WAVE判断', '勝利報酬']) {
  if (!text.includes(token)) throw new Error(`missing ${token}`);
}
if (errors.length) throw new Error(errors.join('\n'));
await browser.close();
console.log('public browser smoke ok');
