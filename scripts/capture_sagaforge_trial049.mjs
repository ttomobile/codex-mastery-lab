import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const url = pathToFileURL(resolve('preview/sagaforge-app/index.html')).href;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 1100 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
await page.goto(url);
await page.waitForSelector('text=Trial 049: 出撃確認シート');
await page.screenshot({ path: 'assets/2026-07-08-character-collection-rpg-trial-049-home.png', fullPage: true });
await page.getByRole('button', { name: '出撃確認へ' }).click();
await page.waitForSelector('text=出撃確認シート / Trial 049');
await page.screenshot({ path: 'assets/2026-07-08-character-collection-rpg-trial-049-sortie.png', fullPage: true });
const summary = await page.locator('#sortieBriefQuest').innerText();
console.log(summary.replace(/\n+/g, ' | '));
if (!summary.includes('クエスト判断') || !summary.includes('5人編成') || !summary.includes('戦術プリセット')) {
  throw new Error('出撃確認シートの主要項目が不足しています');
}
if (errors.length) {
  throw new Error(`browser errors: ${errors.join(' / ')}`);
}
await browser.close();
