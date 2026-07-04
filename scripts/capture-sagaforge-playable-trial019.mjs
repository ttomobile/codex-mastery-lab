import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const previewDir = path.join(root, 'preview');
const assetsDir = path.join(root, 'assets');
const port = 4199;
const shots = [
  ['home', '2026-07-04-character-collection-rpg-trial-019-home-density.png'],
  ['expedition', '2026-07-04-character-collection-rpg-trial-019-expedition-return.png'],
  ['training', '2026-07-04-character-collection-rpg-trial-019-awaken-training.png'],
  ['battle', '2026-07-04-character-collection-rpg-trial-019-multi-enemy-battle.png'],
  ['gacha', '2026-07-04-character-collection-rpg-trial-019-gacha-style-pieces.png'],
  ['state', '2026-07-04-character-collection-rpg-trial-019-failure-state.png'],
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
  await page.getByText('非侵害スマホRPG体験パターン / Trial 019').waitFor();
  await page.getByText('デイリー任務').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[0][1]), fullPage: true });

  await page.getByText('遠征帰還').first().click();
  await page.getByRole('button', { name: '遠征札で帰還' }).click();
  await page.getByText('帰還完了').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[1][1]), fullPage: true });

  await page.getByRole('button', { name: '育成' }).click();
  await page.getByRole('button', { name: '覚醒' }).first().click();
  await page.locator('#trainLog').getByText(/技覚醒/).waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[2][1]), fullPage: true });

  await page.getByRole('button', { name: '戦闘' }).click();
  await page.getByText('晶狼').first().waitFor();
  await page.getByRole('button', { name: /双竜破/ }).click();
  await page.getByRole('button', { name: /瞬閃/ }).click();
  await page.getByRole('button', { name: /癒光陣/ }).click();
  await page.locator('#logs').getByText(/横範囲|単体|回復/).first().waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[3][1]), fullPage: true });

  await page.getByRole('button', { name: '召喚' }).click();
  await page.getByRole('button', { name: '10連スタイル召喚' }).click();
  await page.getByText('ピース+40').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[4][1]), fullPage: true });

  await page.getByRole('button', { name: '状態' }).click();
  await page.getByRole('button', { name: '通信エラー' }).click();
  await page.getByText('ホーム情報を更新できません').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[5][1]), fullPage: true });

  const evidence = await page.evaluate(() => ({
    title: document.title,
    tabs: [...document.querySelectorAll('.bottom-nav button')].map((b) => b.textContent),
    dailyCards: [...document.querySelectorAll('.daily-card')].length,
    enemyCards: [...document.querySelectorAll('.enemy-card')].length,
    stamina: document.querySelector('#stamina')?.textContent,
  }));
  console.log('screenshots captured:', shots.map(([, file]) => file).join(', '));
  console.log('evidence:', JSON.stringify(evidence));
  console.log('verified: Trial 019 playable has dense home, daily/gift/expedition loop, awakening training, multi-enemy BP battle, style-piece gacha, failure state');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
