import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appRoot = path.join(root, 'generated-repo');
const { chromium } = await import(path.join(appRoot, 'node_modules/@playwright/test/index.mjs'));
const out = path.join(root, 'artifacts/trial-001/screenshots');
await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });

async function shot(url, name) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(out, name), fullPage: true });
}

await shot('http://127.0.0.1:3001/', 'watchflow-home.png');
await shot('http://127.0.0.1:3001/watch/vf-001', 'watchflow-watch-detail.png');
await shot('http://127.0.0.1:3001/search?q=存在しない検索語', 'watchflow-search-empty.png');
await shot('http://127.0.0.1:3001/error-demo', 'watchflow-error-state.png');

const mobile = await browser.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 1, isMobile: true });
await mobile.goto('http://127.0.0.1:3001/', { waitUntil: 'networkidle' });
await mobile.screenshot({ path: path.join(out, 'watchflow-home-mobile.png'), fullPage: true });
await mobile.close();

// Playwright HTML report screenshot
const report = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await report.goto(`file://${appRoot}/playwright-report/index.html`, { waitUntil: 'load' });
await report.screenshot({ path: path.join(out, 'playwright-report.png'), fullPage: true });
await report.close();

// Terminal result screenshots as rendered HTML
const terminalFiles = [
  ['01-npm-run-lint.txt', 'terminal-lint.png'],
  ['02-npm-run-typecheck.txt', 'terminal-typecheck.png'],
  ['03-npm-run-test.txt', 'terminal-unit.png'],
  ['04-npm-run-build.txt', 'terminal-build.png'],
  ['07-playwright-chromium-webkit.txt', 'terminal-e2e.png'],
];
for (const [file, png] of terminalFiles) {
  let text = await fs.readFile(`${root}/artifacts/trial-001/terminal/${file}`, 'utf8');
  const localRepo = path.resolve(root, '../..');
  const localHome = process.env.HOME ?? '';
  text = text
    .replaceAll(appRoot, '/path/to/project-root/experiments/watchflow-trial-001/generated-repo')
    .replaceAll(localRepo, '/path/to/project-root')
    .replaceAll(localHome, '/path/to/home');
  const p = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#0f172a;color:#dbeafe;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}
    .bar{background:#111827;color:#93c5fd;padding:14px 22px;font:700 18px -apple-system,BlinkMacSystemFont,'Noto Sans JP',sans-serif;border-bottom:1px solid #334155;}
    pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:18px;line-height:1.55;padding:24px;margin:0;}
  </style><div class="bar">${file}</div><pre></pre>`);
  await p.locator('pre').evaluate((el, value) => { el.textContent = value; }, text.slice(-9000));
  await p.screenshot({ path: path.join(out, png), fullPage: true });
  await p.close();
}

// Simple score card placeholder screenshot generated from current evidence
const card = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
await card.setContent(`<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#f8fafc;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Noto Sans JP',sans-serif;}
main{padding:54px 70px;} h1{font-size:42px;margin:0 0 18px;} p{font-size:20px;color:#475569;} table{border-collapse:collapse;width:100%;font-size:20px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 18px 45px #0f172a18;} th,td{border:1px solid #e2e8f0;padding:14px 18px;text-align:left;} th{background:#e0f2fe;} .score{font-size:74px;font-weight:900;color:#2563eb;margin:20px 0;}
</style><main><h1>WatchFlow Trial 001 採点速報</h1><p>Codexが初回プロンプトから生成したNext.jsアプリを、実行できた検証結果にもとづき暫定採点。</p><div class="score">61 / 100</div><table><tr><th>強い点</th><th>弱い点</th></tr><tr><td>Next.js App Router、mock API、動画プレイヤー、E2E/Visual/Unit、CI/Dependabotまで生成</td><td>Firefox実行環境未完了、動画メディアは簡易、Dockerモックなし、GDPR/国際対応は文書中心</td></tr></table></main>`);
await card.screenshot({ path: path.join(out, 'score-card.png'), fullPage: true });
await card.close();

await browser.close();
console.log(`screenshots written to ${out}`);
