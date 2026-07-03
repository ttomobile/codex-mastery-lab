import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const previewDir = path.join(root, 'preview');
const assetsDir = path.join(root, 'assets');
const port = 4186;
const shots = [
  ['home', '2026-07-04-character-collection-rpg-trial-016-playable-home.png'],
  ['styles', '2026-07-04-character-collection-rpg-trial-016-style-cards.png'],
  ['party', '2026-07-04-character-collection-rpg-trial-016-formation.png'],
  ['battle', '2026-07-04-character-collection-rpg-trial-016-battle-tempo.png'],
  ['gacha', '2026-07-04-character-collection-rpg-trial-016-gacha-results.png'],
  ['state', '2026-07-04-character-collection-rpg-trial-016-failure-state.png'],
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

  await page.getByRole('button', { name: 'スタイル' }).click();
  await page.getByText('Style Lv.42').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[1][1]), fullPage: true });

  await page.getByRole('button', { name: '編成' }).click();
  await page.getByText('総戦闘力').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[2][1]), fullPage: true });

  await page.getByRole('button', { name: 'クエスト' }).click();
  await page.getByRole('button', { name: '選択中' }).waitFor();
  await page.getByRole('button', { name: '選択中' }).click().catch(() => {});
  await page.getByRole('button', { name: '選択クエストへ出撃' }).click();
  await page.getByRole('button', { name: /瞬閃/ }).click();
  await page.getByText('BPを管理').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[3][1]), fullPage: true });

  await page.getByRole('button', { name: '召喚' }).click();
  await page.getByRole('button', { name: '10連スタイル召喚' }).click();
  await page.getByText('重複→ピース40').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[4][1]), fullPage: true });

  await page.getByRole('button', { name: '状態' }).click();
  await page.getByRole('button', { name: '通信エラー' }).click();
  await page.getByText('通信できないためホーム情報を更新できません').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[5][1]), fullPage: true });

  const visibleTabs = await page.locator('.bottom-nav button').allTextContents();
  console.log('screenshots captured:', shots.map(([, file]) => file).join(', '));
  console.log('visible bottom nav:', visibleTabs.join(' / '));
  console.log('verified: home, styles, party, quest-to-battle, BP/Round battle, gacha, failure state');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
