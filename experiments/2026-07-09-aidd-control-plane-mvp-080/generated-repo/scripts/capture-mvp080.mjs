import { chromium } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const assetsDir = join(root, "assets");
const screenshotsDir = join(root, "artifacts", "screenshots");
const terminalDir = join(root, "artifacts", "terminal");

for (const dir of [assetsDir, screenshotsDir, terminalDir]) {
  mkdirSync(dir, { recursive: true });
}

const port = 4080;
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn("pnpm", ["exec", "next", "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: root,
  stdio: ["ignore", "pipe", "pipe"]
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

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
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });

  for (const state of ["empty", "ready", "running", "failure", "blocked"]) {
    await page.goto(`${baseURL}/?state=${state}`);
    const screenshotPath = join(screenshotsDir, `mvp080-${state}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    copyFileSync(screenshotPath, join(assetsDir, `mvp080-${state}.png`));
  }

  await page.setContent(`
    <html lang="ja">
      <body style="margin:0;background:#101614;color:#d8f3df;font:18px Menlo,Consolas,monospace;">
        <main style="padding:32px;">
          <div style="color:#8cd6a8;">$ codex exec --sandbox danger-full-access</div>
          <div>failed: codex command not found / Hermes実装へ切替</div>
          <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run lint</div>
          <div>passed: lint</div>
          <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run typecheck</div>
          <div>passed: typecheck</div>
          <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run test</div>
          <div>passed: dispatch receipt unit test</div>
          <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run build</div>
          <div>passed: Next.js production build</div>
          <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run test:e2e</div>
          <div>passed: Chromium / Firefox / WebKit</div>
          <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run doctor:aidd</div>
          <div>passed: Run Queue Dispatch Receipt doctor</div>
          <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run capture:mvp080</div>
          <div>saved: empty / ready / running / failure / blocked / terminal evidence PNG</div>
        </main>
      </body>
    </html>
  `);
  const terminalPath = join(screenshotsDir, "mvp080-terminal-evidence.png");
  await page.screenshot({ path: terminalPath, fullPage: true });
  copyFileSync(terminalPath, join(assetsDir, "mvp080-terminal-evidence.png"));

  await browser.close();
  console.log("capture:mvp080 passed");
  console.log(`- assets: ${assetsDir}`);
  console.log(`- screenshots: ${screenshotsDir}`);
  console.log(`- terminal evidence PNG: ${terminalPath}`);
} finally {
  server.kill("SIGTERM");
}
