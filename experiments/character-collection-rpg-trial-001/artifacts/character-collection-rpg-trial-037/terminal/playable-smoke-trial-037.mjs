import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = process.env.REPO_ROOT ? resolve(process.env.REPO_ROOT) : resolve(process.cwd(), '../../../..');
const require = createRequire(resolve(root, 'experiments/character-collection-rpg-trial-001/generated-repo/package.json'));
const { chromium } = require('@playwright/test');
const playable = resolve(root, 'playables/sagaforge-app/index.html');
const outDir = resolve(root, 'assets');
const pageUrl = pathToFileURL(playable).href;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 920 } });
await page.goto(pageUrl);
await page.locator('.eyebrow').filter({ hasText: 'Trial 037' }).first().waitFor();
await page.getByText('3周AUTO結果予報').waitFor();
await page.screenshot({ path: resolve(outDir, '2026-07-06-character-collection-rpg-trial-037-home-forecast.png'), fullPage: true });
await page.getByRole('button', { name: '予報どおり3周AUTOを予約' }).click();
await page.locator('#quests.screen.active').waitFor();
await page.getByRole('button', { name: 'スタイル' }).click();
await page.getByText('スタイル別 次育成メモ').waitFor();
await page.screenshot({ path: resolve(outDir, '2026-07-06-character-collection-rpg-trial-037-style-plan.png'), fullPage: true });
const checks = await page.evaluate(() => ({
  title: document.title,
  active: document.querySelector('.screen.active')?.id,
  stylePlan: document.querySelector('#stylePlanBoard')?.textContent,
  forecast: document.querySelector('#farmRecipeBoard')?.textContent,
  publicIpLeak: document.body.textContent?.includes('ロマサガ') || document.body.textContent?.includes('RS')
}));
if (!checks.title.includes('Trial 037')) throw new Error('Trial 037 title not visible');
if (checks.active !== 'styles') throw new Error(`expected styles screen, got ${checks.active}`);
if (!checks.stylePlan?.includes('突破')) throw new Error('style plan board missing growth language');
if (checks.publicIpLeak) throw new Error('app body contains real IP wording');
console.log('playable smoke OK', JSON.stringify(checks, null, 2));
await browser.close();
