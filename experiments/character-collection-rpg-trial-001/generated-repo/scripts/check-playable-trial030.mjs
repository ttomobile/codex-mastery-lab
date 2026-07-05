import { chromium } from '@playwright/test';

const base = 'http://127.0.0.1:4175/sagaforge-app/index.html';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 920 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
await page.goto(base, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: '星紋遠征隊' }).waitFor();
await page.screenshot({ path: '../../../assets/2026-07-05-character-collection-rpg-trial-030-home.png', fullPage: true });
await page.getByRole('button', { name: '技道場' }).click();
await page.getByRole('heading', { name: /技道場/ }).waitFor();
await page.locator('#dojoList').getByText('閃き候補').first().waitFor();
await page.screenshot({ path: '../../../assets/2026-07-05-character-collection-rpg-trial-030-dojo.png', fullPage: true });
await page.getByRole('button', { name: '周回' }).click();
await page.locator('#quests').getByText('ステージミッション', { exact: true }).waitFor();
await page.getByRole('button', { name: '選択クエストへ出撃' }).click();
await page.getByText('閃き / 技Rank / ミッション').waitFor();
await page.getByRole('button', { name: '弱点優先で自動予約' }).click();
await page.getByRole('button', { name: '予約ターン実行' }).click();
await page.locator('#battle #sparkPanel').waitFor();
await page.waitForFunction(() => (document.querySelector('#logs')?.textContent || '').includes('技Rank候補') || (document.querySelector('#sparkPanel')?.textContent || '').includes('閃き'));
await page.screenshot({ path: '../../../assets/2026-07-05-character-collection-rpg-trial-030-battle.png', fullPage: true });
const snapshot = await page.evaluate(() => ({
  title: document.title,
  active: document.querySelector('.screen.active')?.id,
  nav: Array.from(document.querySelectorAll('.bottom-nav button')).map((b) => b.textContent),
  spark: document.querySelector('#sparkPanel')?.textContent,
  logs: document.querySelector('#logs')?.textContent?.slice(0, 260),
}));
await browser.close();
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(JSON.stringify(snapshot, null, 2));
