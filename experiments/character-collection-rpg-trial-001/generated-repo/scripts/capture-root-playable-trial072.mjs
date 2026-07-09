import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const art = 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-072';
fs.mkdirSync(`${art}/screenshots`, { recursive: true });
fs.mkdirSync('assets', { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 1200 }, deviceScaleFactor: 1 });
const url = 'file://' + path.resolve('preview/sagaforge-app/index.html');
await page.goto(url);
await page.getByText('Trial 072').first().waitFor();
await page.screenshot({ path: 'assets/2026-07-10-character-collection-rpg-trial-072-home.png', fullPage: true });
await page.click('button:has-text("日課開始")');
await page.click('button:has-text("選択クエストへ出撃")');
await page.click('button:has-text("弱点連携")');
await page.click('button:has-text("OD号令")');
await page.getByRole('heading', { name: '星紋五連携・暁光突破' }).waitFor();
await page.screenshot({ path: 'assets/2026-07-10-character-collection-rpg-trial-072-battle-chain.png', fullPage: true });
await page.locator('.bottom-nav button[data-id="training"]').click();
await page.getByText('道場 / スタイル強化').waitFor();
await page.click('button:has-text("遠征を即時帰還")');
await page.screenshot({ path: 'assets/2026-07-10-character-collection-rpg-trial-072-training.png', fullPage: true });
await page.locator('.bottom-nav button[data-id="gacha"]').click();
await page.click('button:has-text("10連結果を更新")');
await page.getByText('演出: 虹扉').first().waitFor();
await page.screenshot({ path: 'assets/2026-07-10-character-collection-rpg-trial-072-gacha.png', fullPage: true });
for (const name of ['home', 'battle-chain', 'training', 'gacha']) {
  const src = `assets/2026-07-10-character-collection-rpg-trial-072-${name}.png`;
  const dst = `${art}/screenshots/2026-07-10-character-collection-rpg-trial-072-${name}.png`;
  fs.copyFileSync(src, dst);
}
console.log('captured trial072 screenshots');
await browser.close();
