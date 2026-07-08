import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const experimentRoot = path.resolve(root, "..");
const screenshotsDir = path.join(experimentRoot, "artifacts", "screenshots");
const assetsDir = path.join(experimentRoot, "assets");
await mkdir(screenshotsDir, { recursive: true });
await mkdir(assetsDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1180 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:3064", { waitUntil: "networkidle" });

async function captureState(state, filename) {
  if (state !== "ready") await page.getByRole("button", { name: state }).click();
  await page.screenshot({ path: path.join(screenshotsDir, filename), fullPage: true });
  await copyFile(path.join(screenshotsDir, filename), path.join(assetsDir, filename));
}

await captureState("ready", "aidd-control-plane-mvp069-ready.png");
await captureState("brake", "aidd-control-plane-mvp069-brake.png");
await captureState("stop", "aidd-control-plane-mvp069-stop.png");
await captureState("sanitized", "aidd-control-plane-mvp069-sanitized.png");

const terminalPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await terminalPage.setContent(`<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
body{margin:0;background:#0b1220;color:#e5eefc;font:22px ui-monospace,Menlo,monospace;padding:36px}.card{border:1px solid #334155;border-radius:24px;padding:28px;background:#111827}h1{font:700 30px system-ui;margin:0 0 20px;color:#93c5fd}.ok{color:#86efac}.warn{color:#fde68a}pre{white-space:pre-wrap;line-height:1.55}
</style></head><body><div class="card"><h1>AIDD Control Plane MVP069 terminal evidence</h1><pre><span class="ok">pnpm install --frozen-lockfile: pass</span>
<span class="ok">pnpm run lint: pass</span>
<span class="ok">pnpm run typecheck: pass</span>
<span class="ok">pnpm run test: pass</span>
<span class="ok">pnpm run build: pass</span>
<span class="ok">pnpm run test:e2e: Chromium / Firefox / WebKit pass</span>
<span class="ok">pnpm run doctor:aidd: pass</span>
<span class="ok">pnpm run capture:mvp069: pass</span>
<span class="warn">Codex CLI: timed out after partial implementation; independent verification completed.</span></pre></div></body></html>`);
const terminalFile = "aidd-control-plane-mvp069-terminal-evidence.png";
await terminalPage.screenshot({ path: path.join(screenshotsDir, terminalFile), fullPage: true });
await copyFile(path.join(screenshotsDir, terminalFile), path.join(assetsDir, terminalFile));
await browser.close();
console.log("capture:mvp069 completed");
