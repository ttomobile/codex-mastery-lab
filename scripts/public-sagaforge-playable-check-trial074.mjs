import { chromium } from 'playwright';

const url = 'https://ttomac-mini.tail352b67.ts.net/sagaforge-app/index.html';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(url, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'スタイル', exact: true }).click();
await page.locator('#styleDetail').getByText('緋炎旋風 BP7', { exact: true }).waitFor();
await page.locator('#styleDetail').getByText('火走り突き BP3', { exact: true }).waitFor();
await page.locator('#styleDetail').getByText('緋炎旋風 BP7', { exact: true }).click();
await page.getByRole('button', { name: '戦闘予約を見る' }).click();
await page.getByText('継承判断').waitFor();
const bodyText = await page.locator('body').innerText();
if (!bodyText.includes('緋炎旋風')) throw new Error('緋炎旋風 not visible after inheritance selection');
if (errors.length) throw new Error(errors.join('\n'));
await browser.close();
console.log('public playable trial074 controls visible and inheritance interaction ok');
