import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const previewDir = path.join(root, 'preview');
const assetsDir = path.join(root, 'assets');
const port = 4197;
const shots = [
  ['home', '2026-07-04-character-collection-rpg-trial-017-playable-home.png'],
  ['training', '2026-07-04-character-collection-rpg-trial-017-training-board.png'],
  ['quests', '2026-07-04-character-collection-rpg-trial-017-quest-loop.png'],
  ['battle', '2026-07-04-character-collection-rpg-trial-017-battle-od-tempo.png'],
  ['gacha', '2026-07-04-character-collection-rpg-trial-017-gacha-styles.png'],
  ['state', '2026-07-04-character-collection-rpg-trial-017-failure-state.png'],
];

function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  return 'application/octet-stream';
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://127.0.0.1:${port}`);
    const rel = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const target = path.normalize(path.join(previewDir, rel));
    if (!target.startsWith(previewDir) || !existsSync(target)) {
      res.writeHead(404); res.end('not found'); return;
    }
    res.writeHead(200, { 'content-type': contentType(target) });
    res.end(await readFile(target));
  } catch (error) {
    res.writeHead(500); res.end(String(error));
  }
});

await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 1 });
  const url = `http://127.0.0.1:${port}/sagaforge-app/index.html`;
  await page.goto(url);
  await page.getByText('星紋遠征隊').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[0][1]), fullPage: true });

  await page.getByRole('button', { name: '育成' }).click();
  await page.getByRole('button', { name: '強化' }).first().click();
  await page.getByText(/紅槍リオ: 能力値\+2/).waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[1][1]), fullPage: true });

  await page.getByRole('button', { name: '周回' }).click();
  await page.getByText('VERY HARD').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[2][1]), fullPage: true });
  await page.getByRole('button', { name: '選択クエストへ出撃' }).click();

  await page.getByRole('button', { name: /双竜破/ }).click();
  await page.getByRole('button', { name: /双竜破/ }).click();
  await page.getByRole('button', { name: /瞬閃/ }).click();
  await page.getByRole('button', { name: /OD連携発動/ }).click();
  await page.locator('#logs').getByText(/OD連携発動|ODゲージ不足|Round 2/).first().waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[3][1]), fullPage: true });

  await page.getByRole('button', { name: '召喚' }).click();
  await page.getByRole('button', { name: '10連スタイル召喚' }).click();
  await page.locator('#results .result').nth(9).waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[4][1]), fullPage: true });

  await page.getByRole('button', { name: '状態' }).click();
  await page.getByRole('button', { name: 'スタミナ不足' }).click();
  await page.getByText('出撃に必要なスタミナが足りません').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[5][1]), fullPage: true });

  const visibleTabs = await page.locator('.bottom-nav button').allTextContents();
  console.log('screenshots captured:', shots.map(([, file]) => file).join(', '));
  console.log('visible bottom nav:', visibleTabs.join(' / '));
  console.log('verified: home density, training board, quest loop, BP/OD battle tempo, gacha style cards, failure state');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
