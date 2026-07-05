import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const previewDir = path.join(root, 'preview');
const assetsDir = path.join(root, 'assets');
const terminalDir = path.join(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-032/terminal');
const port = 4212;
const shots = [
  ['home', '2026-07-05-character-collection-rpg-trial-032-home.png'],
  ['battle', '2026-07-05-character-collection-rpg-trial-032-battle-abilities.png'],
  ['expedition', '2026-07-05-character-collection-rpg-trial-032-expedition-result.png'],
  ['gacha', '2026-07-05-character-collection-rpg-trial-032-gacha-steps.png'],
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
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': contentType(target) });
    res.end(await readFile(target));
  } catch (error) {
    res.writeHead(500);
    res.end(String(error));
  }
});

await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
const lines = [];
try {
  await mkdir(terminalDir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 1 });
  const url = `http://127.0.0.1:${port}/sagaforge-app/index.html`;
  await page.goto(url);
  await page.getByText('非侵害スマホRPG体験パターン / Trial 032').waitFor();
  await page.getByText('スタイル別アビリティ').first().waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[0][1]), fullPage: true });

  await page.getByRole('button', { name: '戦闘' }).click();
  await page.getByText('スタイル別アビリティ発動候補').waitFor();
  await page.getByRole('button', { name: '弱点優先で自動予約' }).click();
  await page.getByRole('button', { name: '予約ターン実行' }).click();
  await page.locator('#logs').getByText(/技演出ステップ|アビリティ発動/).first().waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[1][1]), fullPage: true });

  await page.getByRole('button', { name: '遠征' }).click();
  await page.getByRole('button', { name: '遠征札で帰還' }).click();
  await page.locator('#expeditionResult').getByText(/大成功|帰還完了/).first().waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[2][1]), fullPage: true });

  await page.getByRole('button', { name: '召喚' }).click();
  await page.getByRole('button', { name: '10連スタイル召喚' }).click();
  await page.getByText('召喚演出タイムライン').waitFor();
  await page.locator('#gachaSteps span').first().waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[3][1]), fullPage: true });

  const evidence = await page.evaluate(() => ({
    title: document.title,
    trial: document.querySelector('.eyebrow')?.textContent,
    abilityCards: [...document.querySelectorAll('#abilityBoard .advice b')].map((e) => e.textContent),
    logs: [...document.querySelectorAll('#logs li')].slice(0, 4).map((e) => e.textContent?.replace(/\s+/g, ' ').trim()),
    expeditionResult: document.querySelector('#expeditionResult')?.textContent?.replace(/\s+/g, ' ').trim(),
    gachaSteps: [...document.querySelectorAll('#gachaSteps span')].map((e) => e.textContent),
  }));
  lines.push('screenshots captured: ' + shots.map(([, file]) => file).join(', '));
  lines.push('evidence: ' + JSON.stringify(evidence));
  lines.push('verified: Trial 032 playable exposes style abilities in battle, expedition result card, and gacha step timeline');
  console.log(lines.join('\n'));
  await writeFile(path.join(terminalDir, 'trial032-playable-check.txt'), lines.join('\n') + '\n');
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
