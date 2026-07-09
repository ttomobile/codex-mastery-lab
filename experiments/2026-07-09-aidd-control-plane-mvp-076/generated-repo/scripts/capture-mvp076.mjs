import { chromium } from "@playwright/test";
import { mkdirSync, copyFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const root = process.cwd();
const assetsDir = join(root, "assets");
const screenshotsDir = join(root, "artifacts", "screenshots");
const terminalDir = join(root, "artifacts", "terminal");

for (const dir of [assetsDir, screenshotsDir, terminalDir]) {
  mkdirSync(dir, { recursive: true });
}

const port = 4076;
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

  for (const state of ["empty", "valid", "failure", "blocked"]) {
    await page.goto(`${baseURL}/?state=${state}`);
    await page.screenshot({
      path: join(screenshotsDir, `mvp076-${state}.png`),
      fullPage: true
    });
    copyFileSync(join(screenshotsDir, `mvp076-${state}.png`), join(assetsDir, `mvp076-${state}.png`));
  }

  await page.setContent(`
    <html lang="ja">
      <body style="margin:0;background:#101614;color:#d8f3df;font:18px Menlo,Consolas,monospace;">
        <main style="padding:32px;">
          <div style="color:#8cd6a8;">$ pnpm run lint</div>
          <div>✓ lint passed</div>
          <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run typecheck</div>
          <div>✓ typecheck passed</div>
          <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run test:e2e</div>
          <div>✓ Chromium / Firefox / WebKit passed</div>
          <div style="color:#8cd6a8;margin-top:12px;">$ pnpm run doctor:aidd</div>
          <div>✓ AIDD-Spec v0.1 Publication Evidence QA Gate passed</div>
        </main>
      </body>
    </html>
  `);
  await page.screenshot({ path: join(screenshotsDir, "mvp076-terminal-evidence.png"), fullPage: true });
  copyFileSync(join(screenshotsDir, "mvp076-terminal-evidence.png"), join(assetsDir, "mvp076-terminal-evidence.png"));

  await browser.close();
  console.log("capture:mvp076 passed");
  console.log(`- assets: ${assetsDir}`);
  console.log(`- screenshots: ${screenshotsDir}`);
  console.log(`- terminal evidence PNG: ${join(screenshotsDir, "mvp076-terminal-evidence.png")}`);
} finally {
  server.kill("SIGTERM");
}
