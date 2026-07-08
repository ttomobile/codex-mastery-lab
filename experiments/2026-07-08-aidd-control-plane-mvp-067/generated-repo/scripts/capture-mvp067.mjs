import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const screenshotDir = path.join(root, "..", "artifacts", "screenshots");
const terminalDir = path.join(root, "..", "artifacts", "terminal");
const assetDir = path.join(root, "..", "assets");
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(terminalDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const port = "3167";
const server = spawn("pnpm", ["exec", "next", "dev", "--hostname", "127.0.0.1", "--port", port], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
const logs = [];
server.stdout.on("data", (data) => logs.push(data.toString()));
server.stderr.on("data", (data) => logs.push(data.toString()));

async function waitForReady() {
  for (let i = 0; i < 90; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}`);
      if (res.ok) return;
    } catch (error) {
      logs.push(`health check retry: ${error instanceof Error ? error.message : String(error)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error("Next.js dev server did not become ready");
}
function sanitizeLog(text) {
  return text.replace(/\/Users\/[^\s]+/g, "WORKSPACE").replace(/127\.0\.0\.1:\d+/g, "LOCAL_APP");
}
try {
  await waitForReady();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1240 } });
  const cases = [
    ["empty", "aidd-control-plane-mvp067-empty.png"],
    ["queued", "aidd-control-plane-mvp067-queued.png"],
    ["blocked", "aidd-control-plane-mvp067-blocked.png"],
    ["exported", "aidd-control-plane-mvp067-exported.png"]
  ];
  await page.goto(`http://127.0.0.1:${port}`);
  for (const [button, file] of cases) {
    await page.getByRole("button", { name: button }).click();
    const fullPath = path.join(screenshotDir, file);
    await page.screenshot({ path: fullPath, fullPage: true });
    copyFileSync(fullPath, path.join(assetDir, file));
  }
  await page.getByRole("button", { name: "exported" }).click();
  await page.getByLabel("Codex prompt preview（execute_nowのみ）", { exact: true }).scrollIntoViewIfNeeded();
  const terminalFile = "aidd-control-plane-mvp067-terminal-evidence.png";
  const terminalPath = path.join(screenshotDir, terminalFile);
  await page.screenshot({ path: terminalPath, fullPage: true });
  copyFileSync(terminalPath, path.join(assetDir, terminalFile));
  await browser.close();
  writeFileSync(path.join(terminalDir, "capture-mvp067.txt"), sanitizeLog(`capture:mvp067 completed\n${logs.join("\n")}`));
  console.log("capture:mvp067 completed");
} finally {
  server.kill("SIGTERM");
}
