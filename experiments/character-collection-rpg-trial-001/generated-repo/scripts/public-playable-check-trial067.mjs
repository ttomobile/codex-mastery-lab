import { chromium } from '@playwright/test';
const url = 'https://ttomac-mini.tail352b67.ts.net/sagaforge-app/index.html';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 900 }, ignoreHTTPSErrors: true });
await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.getByText('Trial 067').first().waitFor({ timeout: 15000 });
await page.getByRole('button', { name: 'Round解決' }).click();
await page.getByText('Trial 067 第一段階リザルト').waitFor({ timeout: 15000 });
const result = await page.evaluate(() => ({
  title: document.title,
  trial067: document.body.innerText.includes('Trial 067'),
  result: document.body.innerText.includes('Trial 067 第一段階リザルト'),
  buttons: [...document.querySelectorAll('button')].slice(0, 8).map(b => b.textContent?.trim()),
}));
console.log(JSON.stringify({ httpBrowser: 'ok', result }, null, 2));
await browser.close();
