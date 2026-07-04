import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const previewDir = path.join(root, 'preview');
const assetsDir = path.join(root, 'assets');
const terminalDir = path.join(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-028/terminal');
const port = 4208;
const shots = [
  ['home', '2026-07-05-character-collection-rpg-trial-028-home.png'],
  ['battle', '2026-07-05-character-collection-rpg-trial-028-battle-stage.png'],
  ['training', '2026-07-05-character-collection-rpg-trial-028-training-return.png'],
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
const lines = [];
try {
  await mkdir(terminalDir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 930 }, deviceScaleFactor: 1 });
  const url = `http://127.0.0.1:${port}/sagaforge-app/index.html`;
  await page.goto(url);
  await page.getByText('非侵害スマホRPG体験パターン / Trial 028').waitFor();
  await page.locator('#home').getByText('今回潰す差分').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[0][1]), fullPage: true });

  await page.getByRole('button', { name: '戦闘' }).click();
  await page.getByText('技演出ステップ / OD段階').waitFor();
  await page.getByRole('button', { name: '弱点優先で自動予約' }).click();
  await page.getByText(/二段連携候補|三段連携候補|単発解決候補/).waitFor();
  await page.getByRole('button', { name: '予約ターン実行' }).click();
  await page.locator('#logs').getByText(/技演出ステップ/).waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[1][1]), fullPage: true });

  await page.getByRole('button', { name: '育成' }).click();
  await page.getByRole('button', { name: '覚醒' }).first().click();
  await page.locator('#trainLog').getByText(/技覚醒|不足/).waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[2][1]), fullPage: true });

  const evidence = await page.evaluate(() => ({
    title: document.title,
    trial: document.querySelector('.eyebrow')?.textContent,
    skillStages: [...document.querySelectorAll('#skillStages span')].map((e) => e.textContent),
    tabs: [...document.querySelectorAll('.bottom-nav button')].map((b) => b.textContent),
  }));
  lines.push('screenshots captured: ' + shots.map(([, file]) => file).join(', '));
  lines.push('evidence: ' + JSON.stringify(evidence));
  lines.push('verified: Trial 028 playable exposes skill stage timeline, chain tier preview, reserved turn execution log, and training return path');
  console.log(lines.join('\n'));
  await writeFile(path.join(terminalDir, 'trial-028-playable-preview.log'), lines.join('\n') + '\n');
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
