import { chromium } from '@playwright/test';
import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('../../..');
const playable = resolve(root, 'playables/sagaforge-app/index.html');
const artifactDir = resolve(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-047');
const screenshotDir = resolve(artifactDir, 'screenshots');
const terminalDir = resolve(artifactDir, 'terminal');
const assetDir = resolve(root, 'assets');
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(terminalDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 920 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));
await page.goto('file://' + playable);
await page.waitForSelector('text=Trial 047');
await page.screenshot({ path: resolve(screenshotDir, '2026-07-07-character-collection-rpg-trial-047-home.png'), fullPage: true });
copyFileSync(resolve(screenshotDir, '2026-07-07-character-collection-rpg-trial-047-home.png'), resolve(assetDir, '2026-07-07-character-collection-rpg-trial-047-home.png'));

await page.getByRole('button', { name: '戦闘' }).click();
await page.evaluate(() => { od = 100; renderBattle(); });
await page.getByRole('button', { name: 'OD連携発動' }).click();
await page.waitForFunction(() => document.querySelectorAll('#odCutinBoard .cutin-card').length >= 5);
const odSummary = await page.locator('#odCutinSummary').innerText();
const odCards = await page.locator('#odCutinBoard .cutin-card').count();
await page.screenshot({ path: resolve(screenshotDir, '2026-07-07-character-collection-rpg-trial-047-od-cutin.png'), fullPage: true });
copyFileSync(resolve(screenshotDir, '2026-07-07-character-collection-rpg-trial-047-od-cutin.png'), resolve(assetDir, '2026-07-07-character-collection-rpg-trial-047-od-cutin.png'));

await page.getByRole('button', { name: 'ホーム' }).click();
const loopText = await page.locator('#postBattleLoop').innerText();
await page.screenshot({ path: resolve(screenshotDir, '2026-07-07-character-collection-rpg-trial-047-loop.png'), fullPage: true });
copyFileSync(resolve(screenshotDir, '2026-07-07-character-collection-rpg-trial-047-loop.png'), resolve(assetDir, '2026-07-07-character-collection-rpg-trial-047-loop.png'));

const result = {
  title: await page.title(),
  trial: await page.locator('header .eyebrow').innerText(),
  odSummary,
  odCards,
  loopIncludes: {
    replay: loopText.includes('再戦'),
    training: loopText.includes('育成'),
    exchange: loopText.includes('交換'),
    inheritance: loopText.includes('継承変更')
  },
  consoleErrors: errors
};
await browser.close();
writeFileSync(resolve(terminalDir, 'trial047-playable-verification.txt'), 'Trial 047 playable verification\n' + JSON.stringify(result, null, 2) + '\n');
if (errors.length) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(result, null, 2));
