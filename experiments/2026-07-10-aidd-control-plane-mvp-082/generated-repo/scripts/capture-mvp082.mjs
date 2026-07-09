import { chromium } from "@playwright/test";
import { mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const screenshotDir = join(root, "artifacts", "screenshots");
const assetDir = join(root, "assets");
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const port = process.env.PORT ?? "3082";
const baseURL = `http://127.0.0.1:${port}`;
const server = BunMaybeUnsupported();

function BunMaybeUnsupported() {
  return null;
}

async function main() {
  const { spawn } = await import("node:child_process");
  const child = spawn("pnpm", ["exec", "next", "dev", "--hostname", "127.0.0.1", "--port", port], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"]
  });
  let logs = "";
  child.stdout.on("data", (chunk) => { logs += chunk.toString(); });
  child.stderr.on("data", (chunk) => { logs += chunk.toString(); });

  try {
    await waitForServer(baseURL, 120_000);
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
    for (const state of ["empty", "planned", "failure", "blocked"]) {
      await page.goto(`${baseURL}/?state=${state}`, { waitUntil: "networkidle" });
      const file = `mvp082-${state}.png`;
      await page.screenshot({ path: join(screenshotDir, file), fullPage: true });
      copyFileSync(join(screenshotDir, file), join(assetDir, file));
    }
    await browser.close();

    const terminalEvidence = join(screenshotDir, "mvp082-terminal-evidence.png");
    await renderTerminalEvidence(terminalEvidence);
    copyFileSync(terminalEvidence, join(assetDir, "mvp082-terminal-evidence.png"));
    writeFileSync(join(root, "artifacts", "terminal", "capture-mvp082-summary.txt"), "capture:mvp082 passed\n- empty/planned/failure/blocked/terminal evidence screenshots saved\n");
    console.log("capture:mvp082 passed");
  } finally {
    child.kill("SIGTERM");
    if (server) console.log(server);
    if (logs) writeFileSync(join(root, "artifacts", "terminal", "capture-mvp082-server.txt"), logs);
  }
}

async function waitForServer(url, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // サーバー起動待ち中の接続失敗は想定内なので再試行する。
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`server not ready: ${url}`);
}

async function renderTerminalEvidence(outputPath) {
  const terminalDir = join(root, "artifacts", "terminal");
  const names = ["pnpm-install.txt", "lint.txt", "typecheck.txt", "test.txt", "build.txt", "test-e2e.txt", "doctor-aidd.txt"];
  const rows = names.map((name) => {
    const path = join(terminalDir, name);
    if (!existsSync(path)) return `${name}: 未実行`;
    const body = readFileSync(path, "utf8");
    const status = /failed|error|ERR!/i.test(body) && !/0 failed/.test(body) ? "要確認" : "pass";
    return `${name}: ${status}`;
  });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 720 } });
  await page.setContent(`<!doctype html><html lang="ja"><meta charset="utf-8"><body style="margin:0;background:#0f172a;color:#e2e8f0;font:24px ui-monospace,monospace;"><main style="padding:42px"><h1 style="font-size:34px;color:#93c5fd">MVP082 terminal evidence</h1><pre style="white-space:pre-wrap;line-height:1.7">${escapeHtml(rows.join("\n"))}</pre><p style="color:#a7f3d0">Smoke Receipt Repair Action Planner / Chromium Firefox WebKit / doctor:aidd</p></main></body></html>`);
  await page.screenshot({ path: outputPath, fullPage: true });
  await browser.close();
}

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
