import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

(async () => {
  const root = process.cwd();
  const url = 'file://' + path.join(root, 'playables/sagaforge-app/index.html');
  const outDir = path.join(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-046/screenshots');
  const assetDir = path.join(root, 'assets');
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(assetDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 1200 }, deviceScaleFactor: 1 });
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(err.message));
  await page.goto(url);
  await page.screenshot({ path: path.join(outDir, '2026-07-07-character-collection-rpg-trial-046-home.png'), fullPage: true });
  await page.getByRole('button', { name: '戦闘' }).click();
  await page.getByRole('button', { name: '弱点優先で自動予約' }).click();
  await page.getByRole('button', { name: '予約ターン実行' }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: '次へ' }).click();
  await page.getByRole('button', { name: 'AUTO再生' }).click();
  await page.waitForTimeout(1400);
  const result = await page.evaluate(() => ({
    title: document.title,
    trial: document.querySelector('.eyebrow')?.textContent,
    tempoSummary: document.querySelector('#tempoLiveSummary')?.textContent,
    tempoCards: [...document.querySelectorAll('#tempoLiveBoard .tempo-card')].map(e => e.textContent.trim()).slice(0, 6),
    resolveSummary: document.querySelector('#turnResolveSummary')?.textContent,
    liveCards: document.querySelectorAll('#tempoLiveBoard .tempo-card.live').length,
    meter: document.querySelector('#tempoMeter')?.style.width,
    logHead: document.querySelector('#logs li')?.textContent,
  }));
  await page.screenshot({ path: path.join(outDir, '2026-07-07-character-collection-rpg-trial-046-tempo-reel.png'), fullPage: true });
  await page.getByRole('button', { name: '召喚' }).click();
  await page.screenshot({ path: path.join(outDir, '2026-07-07-character-collection-rpg-trial-046-gacha.png'), fullPage: true });
  await browser.close();
  for (const name of ['home', 'tempo-reel', 'gacha']) {
    fs.copyFileSync(
      path.join(outDir, `2026-07-07-character-collection-rpg-trial-046-${name}.png`),
      path.join(assetDir, `2026-07-07-character-collection-rpg-trial-046-${name}.png`)
    );
  }
  const report = { ...result, consoleErrors };
  console.log('Trial 046 playable verification');
  console.log(JSON.stringify(report, null, 2));
  if (!result.title.includes('Trial 046')) throw new Error('title does not include Trial 046');
  if (!result.tempoSummary?.includes('STEP')) throw new Error('tempo reel did not update');
  if (result.liveCards !== 1) throw new Error('expected exactly one live tempo card');
  if (consoleErrors.length) throw new Error('console errors: ' + consoleErrors.join('\n'));
})();
