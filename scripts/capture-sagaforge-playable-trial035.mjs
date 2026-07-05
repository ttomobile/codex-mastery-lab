import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const previewDir = path.join(root, 'preview');
const assetsDir = path.join(root, 'assets');
const terminalDir = path.join(root, 'experiments/character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-035/terminal');
const port = 4215;
const shots = [
  ['home', '2026-07-05-character-collection-rpg-trial-035-home.png'],
  ['battle', '2026-07-05-character-collection-rpg-trial-035-battle-counters.png'],
  ['result', '2026-07-05-character-collection-rpg-trial-035-result-timeline.png'],
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
  await page.getByText('非侵害スマホRPG体験パターン / Trial 035').waitFor();
  await page.getByText('勝利リザルトを段階表示').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[0][1]), fullPage: true });

  await page.getByRole('button', { name: '戦闘' }).click();
  await page.getByText('ミッション進捗カウンタ').waitFor();
  await page.getByRole('button', { name: '弱点優先で自動予約' }).click();
  await page.getByRole('button', { name: '予約ターン実行' }).click();
  await page.locator('#missionCounter').getByText(/弱点/).waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[1][1]), fullPage: true });

  await page.evaluate(() => eval(`
    weakHitCount = 3;
    odChainCount = 1;
    missionState = [true, true, true];
    enemies.forEach((enemy) => { enemy.hp = 0; });
    round = quests[lastQuest].waves;
    nextRound();
  `));
  await page.getByText('勝利リザルト段階表示').waitFor();
  await page.locator('#resultTimelineList').getByText('4 星ミッション').waitFor();
  await page.screenshot({ path: path.join(assetsDir, shots[2][1]), fullPage: true });

  const evidence = await page.evaluate(() => ({
    title: document.title,
    trial: document.querySelector('.eyebrow')?.textContent,
    missionCounter: document.querySelector('#missionCounter')?.textContent?.replace(/\s+/g, ' ').trim(),
    resultTimeline: [...document.querySelectorAll('#resultTimelineList .result-card b')].map((e) => e.textContent),
    resultCards: document.querySelector('#resultCards')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 260),
  }));
  lines.push('screenshots captured: ' + shots.map(([, file]) => file).join(', '));
  lines.push('evidence: ' + JSON.stringify(evidence));
  lines.push('verified: Trial 035 playable exposes mission counters and staged victory result timeline');
  console.log(lines.join('\n'));
  await writeFile(path.join(terminalDir, 'trial035-playable-check.txt'), lines.join('\n') + '\n');
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
