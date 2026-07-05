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
await page.getByText('スタイル遠征ボード').waitFor();
await page.screenshot({ path: '../../../assets/2026-07-05-character-collection-rpg-trial-031-home.png', fullPage: true });
await page.getByRole('button', { name: '遠征' }).click();
await page.getByText('スタイル派遣枠').waitFor();
await page.getByRole('button', { name: '派遣スタイル変更' }).first().click();
await page.getByRole('button', { name: '即時帰還' }).first().click();
await page.waitForFunction(() => (document.querySelector('#expText')?.textContent || '').includes('帰還'));
await page.screenshot({ path: '../../../assets/2026-07-05-character-collection-rpg-trial-031-expedition.png', fullPage: true });
await page.getByRole('button', { name: '周回' }).click();
await page.locator('#quests').getByText('クエスト前スタイル相性', { exact: true }).waitFor();
await page.getByText('適性あり').first().waitFor();
await page.screenshot({ path: '../../../assets/2026-07-05-character-collection-rpg-trial-031-quest-synergy.png', fullPage: true });
await page.getByRole('button', { name: '選択クエストへ出撃' }).click();
await page.locator('#battle').getByText('5人連携予約 / 1ターン一括解決').waitFor();
await page.getByRole('button', { name: '弱点優先で自動予約' }).click();
await page.getByRole('button', { name: '予約ターン実行' }).click();
await page.waitForFunction(() => (document.querySelector('#logs')?.textContent || '').includes('技演出ステップ') || (document.querySelector('#logs')?.textContent || '').includes('技Rank'));
await page.screenshot({ path: '../../../assets/2026-07-05-character-collection-rpg-trial-031-battle.png', fullPage: true });
const snapshot = await page.evaluate(() => ({
  title: document.title,
  active: document.querySelector('.screen.active')?.id,
  dispatch: document.querySelector('#dispatchBoard')?.textContent?.slice(0, 160),
  synergy: document.querySelector('#styleSynergy')?.textContent?.slice(0, 220),
  logs: document.querySelector('#logs')?.textContent?.slice(0, 260),
}));
await browser.close();
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(JSON.stringify(snapshot, null, 2));
