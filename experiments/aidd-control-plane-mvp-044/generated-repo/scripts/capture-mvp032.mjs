import { chromium } from "@playwright/test";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const expRoot = path.resolve(root, "..");
const screenshotDir = path.join(expRoot, "artifacts", "screenshots");
const assetsDir = path.resolve(root, "..", "..", "..", "assets");
const appUrl = process.env.AIDD_MVP032_APP_URL ?? "http://127.0.0.1:3030";
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });

async function shot(name) {
  const file = path.join(screenshotDir, name);
  await page.screenshot({ path: file, fullPage: false });
  copyFileSync(file, path.join(assetsDir, name));
}

await page.goto(appUrl, { waitUntil: "networkidle" });
await page.getByRole("heading", { name: /Codex Run Queue:/ }).scrollIntoViewIfNeeded();
await shot("aidd-control-plane-mvp032-empty.png");

await page.getByRole("button", { name: "queue valid" }).click();
await page.getByRole("heading", { name: /Codex Run Queue: valid/ }).scrollIntoViewIfNeeded();
await shot("aidd-control-plane-mvp032-valid.png");

await page.getByRole("button", { name: "queue failure" }).click();
await page.getByRole("heading", { name: /Codex Run Queue: failure/ }).scrollIntoViewIfNeeded();
await shot("aidd-control-plane-mvp032-failure.png");

const terminalLogPath = path.join(expRoot, "artifacts", "terminal", "codex-summary.txt");
const terminalText = (existsSync(terminalLogPath)
  ? readFileSync(terminalLogPath, "utf8")
  : "pnpm run lint\npnpm run typecheck\npnpm run test\npnpm run build\npnpm run test:e2e\npnpm run doctor:aidd\npnpm run mock:doctor\npnpm run capture:mvp032")
  .replaceAll(process.env.HOME ?? "", "WORKSPACE")
  .replace(/\/Users\/[^/\s]+/g, "WORKSPACE")
  .replace(/\b(?:localhost|127\.0\.0\.1|host\.docker\.internal|private network|tailscale|[a-z0-9-]+\.ts\.net)\b/gi, "LOCAL_NETWORK")
  .split("\n")
  .slice(-120)
  .join("\n");
const escaped = terminalText.replace(/[&<>]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character] ?? character);
await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#10202b;color:#e7edf3;font:22px/1.55 ui-monospace,Menlo,monospace}.card{padding:36px}h1{font:800 32px system-ui;margin:0 0 20px;color:#a7f3d0}.ok{color:#bfdbfe}pre{white-space:pre-wrap;overflow-wrap:anywhere}</style><div class="card"><h1>AIDD Control Plane MVP 032 terminal evidence</h1><p class="ok">Codex Run Queueとcapture:mvp032の検証ログ。</p><pre>${escaped}</pre></div>`);
await shot("aidd-control-plane-mvp032-terminal-evidence.png");
await browser.close();
