import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appRoot = path.join(root, 'generated-repo');
const { chromium } = await import(path.join(appRoot, 'node_modules/@playwright/test/index.mjs'));
const out = path.join(root, 'artifacts/trial-002/screenshots');
await fs.mkdir(out, { recursive: true });
const base = 'http://127.0.0.1:3002';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
async function shot(url, name) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(out, name), fullPage: true });
}
await shot(`${base}/`, 'watchflow-home.png');
await shot(`${base}/watch/vf-001`, 'watchflow-watch-detail.png');
await shot(`${base}/states?auth=session_expired&billing=payment_failed&network=offline`, 'watchflow-states-error.png');
await shot(`${base}/design-system`, 'watchflow-design-system.png');
await shot(`${base}/search?q=存在しない動画`, 'watchflow-search-empty.png');
const mobile = await browser.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 1, isMobile: true });
await mobile.goto(`${base}/`, { waitUntil: 'networkidle' });
await mobile.screenshot({ path: path.join(out, 'watchflow-home-mobile.png'), fullPage: true });
await mobile.close();

const report = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await report.goto(`file://${appRoot}/playwright-report/index.html`, { waitUntil: 'load' });
await report.screenshot({ path: path.join(out, 'playwright-report.png'), fullPage: true });
await report.close();

const terminalFiles = [
  ['03-pnpm-run-typecheck.txt', 'terminal-typecheck.png'],
  ['04-pnpm-run-test.txt', 'terminal-unit.png'],
  ['05-pnpm-run-test-coverage.txt', 'terminal-coverage.png'],
  ['06-pnpm-run-build.txt', 'terminal-build.png'],
  ['07-pnpm-run-doctor-playwright.txt', 'terminal-doctor.png'],
  ['11-playwright-chromium-webkit-final.txt', 'terminal-e2e.png'],
  ['12-pnpm-run-lint-final.txt', 'terminal-lint.png'],
];
for (const [file, png] of terminalFiles) {
  let text = await fs.readFile(path.join(root, 'artifacts/trial-002/terminal', file), 'utf8');
  const localRepo = path.resolve(root, '../..');
  const localHome = process.env.HOME ?? '';
  text = text
    .replaceAll(appRoot, '/path/to/project-root/experiments/watchflow-trial-002/generated-repo')
    .replaceAll(localRepo, '/path/to/project-root')
    .replaceAll(localHome, '/path/to/home');
  const p = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#0f172a;color:#dbeafe;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;}
    .bar{background:#111827;color:#93c5fd;padding:14px 22px;font:700 18px -apple-system,BlinkMacSystemFont,'Noto Sans JP',sans-serif;border-bottom:1px solid #334155;}
    pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:18px;line-height:1.55;padding:24px;margin:0;}
  </style><div class="bar">${file}</div><pre></pre>`);
  await p.locator('pre').evaluate((el, value) => { el.textContent = value; }, text.slice(-11000));
  await p.screenshot({ path: path.join(out, png), fullPage: true });
  await p.close();
}

const card = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
await card.setContent(`<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#f8fafc;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Noto Sans JP',sans-serif;}main{padding:54px 70px;}h1{font-size:42px;margin:0 0 18px;}p{font-size:20px;color:#475569;}.score{font-size:74px;font-weight:900;color:#16a34a;margin:20px 0;}table{border-collapse:collapse;width:100%;font-size:20px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 18px 45px #0f172a18;}th,td{border:1px solid #e2e8f0;padding:14px 18px;text-align:left;}th{background:#dcfce7;}
</style><main><h1>WatchFlow Trial 002 採点速報</h1><p>Trial 001の61点から、pnpm化、VideoPlayer分割、doctor、axe、coverage、状態UI、Design Systemを追加。</p><div class="score">75 / 100</div><table><tr><th>上がった点</th><th>まだ弱い点</th></tr><tr><td>Chromium/WebKitでE2E+Visual+axeが17件成功。coverage 63%。pnpm固定。状態UIとDesign System追加。</td><td>Firefox実ブラウザは未導入。Docker mockはplaceholder。動画ストリーミング/課金/履歴はまだ浅い。</td></tr></table></main>`);
await card.screenshot({ path: path.join(out, 'score-card.png'), fullPage: true });
await card.close();
await browser.close();
console.log(`screenshots written to ${out}`);
