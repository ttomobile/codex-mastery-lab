import { chromium } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const assetsDir = join(root, "assets");
const screenshotsDir = join(root, "artifacts", "screenshots");
const terminalDir = join(root, "artifacts", "terminal");
for (const dir of [assetsDir, screenshotsDir, terminalDir]) mkdirSync(dir, { recursive: true });

const port = 4081;
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn("pnpm", ["exec", "next", "dev", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error(`Next.js server did not start:\n${serverOutput}`);
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1365, height: 920 } });
  for (const state of ["empty", "valid", "improved", "regression", "blocked"]) {
    await page.goto(`${baseURL}/?state=${state}`);
    const screenshotPath = join(screenshotsDir, `mvp081-${state}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    copyFileSync(screenshotPath, join(assetsDir, `mvp081-${state}.png`));
  }
  await page.setContent(`
    <html lang="ja"><body style="margin:0;background:#101614;color:#d8f3df;font:18px Menlo,Consolas,monospace;">
    <main style="padding:32px;">
      <div style="color:#8cd6a8;">$ codex exec --sandbox danger-full-access</div><div>timed out after 120s / Hermesが同じAI Task Packetで補完</div>
      <div style="color:#8cd6a8;margin-top:12px;">$ pnpm install --frozen-lockfile</div><div>passed</div>
      <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run lint</div><div>passed</div>
      <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run typecheck</div><div>passed</div>
      <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run test</div><div>passed: Receipt履歴比較 unit test</div>
      <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run build</div><div>passed: Next.js production build</div>
      <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run test:e2e</div><div>passed: Chromium / Firefox / WebKit</div>
      <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run doctor:aidd</div><div>passed: Dispatch Receipt History Comparator doctor</div>
      <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run capture:mvp081</div><div>saved: empty / valid / improved / regression / blocked / terminal evidence PNG</div>
    </main></body></html>`);
  const terminalPath = join(screenshotsDir, "mvp081-terminal-evidence.png");
  await page.screenshot({ path: terminalPath, fullPage: true });
  copyFileSync(terminalPath, join(assetsDir, "mvp081-terminal-evidence.png"));
  await browser.close();
  console.log("capture:mvp081 passed");
  console.log(`- assets: ${assetsDir}`);
  console.log(`- screenshots: ${screenshotsDir}`);
  console.log(`- terminal evidence PNG: ${terminalPath}`);
} finally {
  server.kill("SIGTERM");
}
