import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const htmlPath = path.join(root, 'playables/sagaforge-app/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)?.[1];
new Function(script);

const outDir = path.join(root, 'assets');
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
await page.goto('file://' + htmlPath);
await page.waitForSelector('text=Trial 041');
await page.screenshot({ path: path.join(outDir, '2026-07-06-character-collection-rpg-trial-041-home.png'), fullPage: true });
await page.getByRole('button', { name: '召喚', exact: true }).click();
await page.waitForSelector('#gachaClassifier .advice');
await page.screenshot({ path: path.join(outDir, '2026-07-06-character-collection-rpg-trial-041-gacha-classifier.png'), fullPage: true });
await page.getByRole('button', { name: '育成', exact: true }).click();
await page.waitForSelector('#trainingCompare .advice');
await page.screenshot({ path: path.join(outDir, '2026-07-06-character-collection-rpg-trial-041-training-compare.png'), fullPage: true });
await page.getByRole('button', { name: '周回', exact: true }).click();
await page.waitForSelector('#questCompare .advice');
await page.screenshot({ path: path.join(outDir, '2026-07-06-character-collection-rpg-trial-041-quest-compare.png'), fullPage: true });
const summary = await page.evaluate(() => ({
  title: document.title,
  gachaClassifier: document.querySelectorAll('#gachaClassifier .advice').length,
  homeClassifier: document.querySelectorAll('#gachaClassifierHome .advice').length,
  trainingCompare: document.querySelectorAll('#trainingCompare .advice').length,
  questCompare: document.querySelectorAll('#questCompare .advice').length,
  status: document.querySelector('#status')?.textContent,
}));
await browser.close();
if (errors.length) {
  console.error(JSON.stringify({ summary, errors }, null, 2));
  process.exit(1);
}
console.log('node syntax check: OK');
console.log('playwright interaction:', JSON.stringify(summary));
console.log('screenshots: trial041 home/gacha-classifier/training-compare/quest-compare');
