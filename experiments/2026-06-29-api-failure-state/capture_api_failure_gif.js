const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
async function shot(page, dir, i, label) {
  await page.screenshot({ path: path.join(dir, `frame-${String(i).padStart(3, '0')}-${label}.png`), fullPage: false });
}
async function count(locator) { try { return await locator.count(); } catch { return 0; } }

async function main() {
  const appDir = process.argv[2];
  const outGif = process.argv[3];
  if (!appDir || !outGif) {
    console.error('Usage: node capture_api_failure_gif.js <app-dir> <out.gif>');
    process.exit(2);
  }
  const index = path.resolve(appDir, 'index.html');
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aidd-api-state-'));
  fs.mkdirSync(path.dirname(path.resolve(outGif)), { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 1 });
  const messages = [];
  page.on('console', (msg) => messages.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', (err) => messages.push(`pageerror: ${err.message}`));
  await page.goto('file://' + index, { waitUntil: 'load' });
  let i = 1;
  await sleep(900);
  await shot(page, frameDir, i++, 'initial');
  const search = page.locator('input[type="search"]').first();
  if (await count(search)) {
    await search.click();
    await search.type('アクセシビリティ', { delay: 80 });
    await sleep(500);
    await shot(page, frameDir, i++, 'search');
  }
  const scenarios = [
    ['offline', 'offline'],
    ['timeout', 'timeout'],
    ['server-error', 'server-error'],
    ['success', 'recovered-success'],
  ];
  for (const [value, label] of scenarios) {
    const radio = page.locator(`input[name="scenario"][value="${value}"]`).first();
    if (await count(radio)) {
      await radio.check();
      const retry = page.locator('#retry-button, button').first();
      if (await count(retry)) await retry.click();
      await sleep(value === 'timeout' ? 1200 : 700);
      await shot(page, frameDir, i++, label);
    }
  }
  await browser.close();
  fs.writeFileSync(path.resolve(outGif).replace(/\.gif$/i, '.console.txt'), messages.join('\n') || 'No console messages captured.');
  const pattern = path.join(frameDir, 'frame-*.png');
  const palette = path.join(frameDir, 'palette.png');
  execFileSync('ffmpeg', ['-y', '-framerate', '1', '-pattern_type', 'glob', '-i', pattern, '-vf', 'scale=390:-1:flags=lanczos,palettegen', palette], { stdio: 'ignore' });
  execFileSync('ffmpeg', ['-y', '-framerate', '1', '-pattern_type', 'glob', '-i', pattern, '-i', palette, '-lavfi', 'scale=390:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3', outGif], { stdio: 'ignore' });
  console.log(`GIF: ${outGif}`);
  console.log(`Console log: ${path.resolve(outGif).replace(/\.gif$/i, '.console.txt')}`);
  console.log(`Frames: ${frameDir}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
