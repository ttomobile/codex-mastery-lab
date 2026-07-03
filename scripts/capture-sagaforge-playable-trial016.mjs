import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = resolve('preview');
const mime = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css'],
  ['.js', 'text/javascript'],
  ['.png', 'image/png'],
]);

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const path = url.pathname === '/' ? '/index.html' : url.pathname;
    const file = join(root, decodeURIComponent(path));
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': mime.get(extname(file)) ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

await new Promise((resolveListen) => server.listen(4176, '127.0.0.1', resolveListen));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 860 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:4176/sagaforge-app/index.html');
await page.screenshot({ path: 'assets/2026-07-04-character-collection-rpg-trial-016-playable-home.png', fullPage: true });
await page.getByRole('button', { name: 'スタイル' }).click();
await page.screenshot({ path: 'assets/2026-07-04-character-collection-rpg-trial-016-style-cards.png', fullPage: true });
await page.getByRole('button', { name: '編成' }).click();
await page.getByText('入替').first().click();
await page.screenshot({ path: 'assets/2026-07-04-character-collection-rpg-trial-016-formation.png', fullPage: true });
await page.getByRole('button', { name: 'クエスト' }).click();
await page.getByText('裂光の丘 1-1').click();
await page.getByRole('button', { name: '選択クエストへ出撃' }).click();
await page.getByText('双竜破').click();
await page.getByText('星紋連携').click();
await page.screenshot({ path: 'assets/2026-07-04-character-collection-rpg-trial-016-battle-tempo.png', fullPage: true });
const visible = await page.locator('text=Round').first().isVisible();
const styleCount = await page.locator('.style-card').count();
const resultCount = await page.locator('.result').count();
console.log(JSON.stringify({ visibleRound: visible, styleCards: styleCount, gachaResults: resultCount }));
await browser.close();
server.close();
