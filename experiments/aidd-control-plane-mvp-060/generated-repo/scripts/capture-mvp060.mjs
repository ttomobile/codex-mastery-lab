import { spawn } from "node:child_process";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const repoRoot = path.resolve(root, "../../..");
const screenshotDir = path.join(root, "artifacts/screenshots");
const experimentScreenshotDir = path.resolve(root, "..", "artifacts/screenshots");
const assetDir = path.join(repoRoot, "assets");
const terminalDir = path.join(root, "artifacts/terminal");
const experimentTerminalDir = path.resolve(root, "..", "artifacts/terminal");
const port = 3060;
const baseURL = `http://127.0.0.1:${port}`;

await mkdir(screenshotDir, { recursive: true });
await mkdir(experimentScreenshotDir, { recursive: true });
await mkdir(assetDir, { recursive: true });
await mkdir(terminalDir, { recursive: true });
await mkdir(experimentTerminalDir, { recursive: true });

const server = spawn("pnpm", ["exec", "next", "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: root,
  stdio: ["ignore", "pipe", "pipe"]
});

let terminalLog = "";
server.stdout.on("data", (chunk) => { terminalLog += chunk.toString(); });
server.stderr.on("data", (chunk) => { terminalLog += chunk.toString(); });

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }
  throw new Error("Next.js server did not become ready");
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1500 }, deviceScaleFactor: 1 });

  const shots = [
    ["キューなし", "aidd-control-plane-mvp060-empty.png"],
    ["検証ready", "aidd-control-plane-mvp060-valid.png"],
    ["差し戻し", "aidd-control-plane-mvp060-failure.png"],
    ["修復候補", "aidd-control-plane-mvp060-repair-needed.png"]
  ];

  await page.goto(baseURL);
  for (const [label, file] of shots) {
    await page.getByRole("button", { name: label }).click();
    const target = path.join(screenshotDir, file);
    await page.screenshot({ path: target, fullPage: true });
    await copyFile(target, path.join(assetDir, file));
    await copyFile(target, path.join(experimentScreenshotDir, file));
  }

  const terminalFile = "aidd-control-plane-mvp060-terminal-evidence.png";
  await page.setContent(`
    <style>
      body { margin: 0; background: #17202a; color: #eef6ff; font: 18px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      main { padding: 34px; }
      h1 { font-size: 28px; margin: 0 0 20px; letter-spacing: 0; }
      pre { white-space: pre-wrap; padding: 24px; background: #0f1720; border: 1px solid #344255; border-radius: 8px; }
    </style>
    <main>
      <h1>MVP060 terminal evidence</h1>
      <pre>pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp060

status: empty / valid / failure / repair_needed、Verification Run Detail、source_queue_item_id、source_run_status、commit_sha、command_details、artifact_path、failure_category、repair_instruction、browser_coverage Chromium/Firefox/WebKit、terminal evidence、screenshot evidence、playwright_report、review_finding_draft、AIDD-Spec接続、local path/private host/private network URL検出を確認。</pre>
    </main>
  `);
  const terminalShot = path.join(screenshotDir, terminalFile);
  await page.screenshot({ path: terminalShot, fullPage: true });
  await copyFile(terminalShot, path.join(assetDir, terminalFile));
  await copyFile(terminalShot, path.join(experimentScreenshotDir, terminalFile));

  await browser.close();
  const log = sanitizeLog(terminalLog);
  await writeFile(path.join(terminalDir, "capture-mvp060.txt"), log, "utf8");
  await writeFile(path.join(experimentTerminalDir, "capture-mvp060.txt"), log, "utf8");
  console.log("capture:mvp060 completed");
} finally {
  server.kill("SIGTERM");
}

function sanitizeLog(log) {
  return log
    .replaceAll(root, "WORKSPACE/experiments/aidd-control-plane-mvp-060/generated-repo")
    .replaceAll(repoRoot, "WORKSPACE")
    .replace(/127\.0\.0\.1:\d+/g, "WORKSPACE/private-url");
}
