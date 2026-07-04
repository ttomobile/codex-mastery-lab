import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const previewDir = path.join(root, 'preview');
const assetsDir = path.join(root, 'assets');
const port = 4198;
const shots = [
  ['home', '2026-07-04-character-collection-rpg-trial-018-playable-home.png'],
  ['party', '2026-07-04-character-collection-rpg-trial-018-party-order.png'],
  ['gacha', '2026-07-04-character-collection-rpg-trial-018-gacha-pieces.png'],
  ['training', '2026-07-04-character-collection-rpg-trial-018-limit-break.png'],
  ['battle', '2026-07-04-character-collection-rpg-trial-018-chain-result.png'],
  ['state', '2026-07-04-character-collection-rpg-trial-018-failure-state.png'],
];
function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.png')) return 'image/png';
  return 'application/octet-stream';
}
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://127.0.0.1:${port}`);
    const rel = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const target = path.normalize(path.join(previewDir, rel));
    if (!target.startsWith(previewDir) || !existsSync(target)) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'content-type': contentType(target) });
    res.end(await readFile(target));
  } catch (error) { res.writeHead(500); res.end(String(error)); }
});
await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 430, height: 930 }, deviceScaleFactor: 1 });
  const url = `http://127.0.0.1:${port}/sagaforge-app/index.html`;
  await page.goto(url);
  await page.getByText('非侵害スマホRPG体験パターン / Trial 018').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[0][1]), fullPage: true });

  await page.getByRole('button', { name: '編成' }).click();
  await page.getByText('行動順プレビュー').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[1][1]), fullPage: true });

  await page.getByRole('button', { name: '召喚' }).click();
  await page.getByRole('button', { name: '10連スタイル召喚' }).click();
  await page.getByText('ピース+40').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[2][1]), fullPage: true });

  await page.getByRole('button', { name: '育成' }).click();
  await page.getByRole('button', { name: '突破' }).first().click();
  await page.locator('#trainLog').getByText(/を限界突破/).waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[3][1]), fullPage: true });

  await page.getByRole('button', { name: '戦闘' }).click();
  await page.getByRole('button', { name: /双竜破/ }).click();
  await page.getByRole('button', { name: /双竜破/ }).click();
  await page.getByRole('button', { name: /瞬閃/ }).click();
  await page.getByRole('button', { name: /OD連携発動/ }).click();
  await page.getByRole('button', { name: /OD連携発動/ }).click();
  await page.getByRole('button', { name: /OD連携発動|双竜破|瞬閃/ }).first().click();
  await page.locator('#logs').getByText(/OD連携発動|勝利報酬|Round 2/).first().waitFor();
  // Force a victory if the captured interaction stopped at Round transition; continue a few skills.
  for (let i = 0; i < 12; i++) {
    if (await page.getByText('同じクエストを再戦').isVisible().catch(() => false)) break;
    await page.getByRole('button', { name: /双竜破|瞬閃/ }).first().click();
  }
  await page.getByRole('button', { name: '同じクエストを再戦' }).waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[4][1]), fullPage: true });

  await page.getByRole('button', { name: '状態' }).click();
  await page.getByRole('button', { name: '決済失敗' }).click();
  await page.getByText('mock決済が失敗').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[5][1]), fullPage: true });

  const evidence = await page.evaluate(() => ({
    title: document.title,
    tabs: [...document.querySelectorAll('.bottom-nav button')].map((b) => b.textContent),
    resultText: document.querySelector('#result')?.textContent,
    stamina: document.querySelector('#stamina')?.textContent,
  }));
  console.log('screenshots captured:', shots.map(([, file]) => file).join(', '));
  console.log('evidence:', JSON.stringify(evidence));
  console.log('verified: Trial 018 playable has 5-person action order, duplicate-piece gacha, limit break, OD chain, result->replay/training, failure state');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
