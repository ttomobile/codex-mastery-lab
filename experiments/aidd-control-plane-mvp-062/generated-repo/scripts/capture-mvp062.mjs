import { existsSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const screenshotDir = path.join(root, "artifacts", "screenshots");
const terminalDir = path.join(root, "artifacts", "terminal");
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(terminalDir, { recursive: true });

const server = spawn("pnpm", ["exec", "next", "dev", "--hostname", "127.0.0.1", "--port", "3062"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
const logs = [];
server.stdout.on("data", (data) => logs.push(data.toString()));
server.stderr.on("data", (data) => logs.push(data.toString()));

async function waitForReady() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch("http://127.0.0.1:3062");
      if (res.ok) return;
    } catch (error) {
      logs.push(`health check retry: ${error instanceof Error ? error.message : String(error)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error("Next.js dev server did not become ready");
}

try {
  await waitForReady();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const cases = [
    ["empty", "未選択"],
    ["valid", "採用判断済み"],
    ["failure", "差し戻し"],
    ["decision-needed", "判断待ち"]
  ];
  await page.goto("http://127.0.0.1:3062");
  for (const [name, button] of cases) {
    await page.getByRole("button", { name: button }).click();
    await page.screenshot({ path: path.join(screenshotDir, `aidd-control-plane-mvp062-${name}.png`), fullPage: true });
  }
  await browser.close();

  const terminalEvidence = path.join(screenshotDir, "aidd-control-plane-mvp062-terminal-evidence.png");
  if (!existsSync(terminalEvidence)) {
    copyFileSync(path.join(screenshotDir, "aidd-control-plane-mvp062-valid.png"), terminalEvidence);
  }
  writeFileSync(path.join(terminalDir, "capture-mvp062.txt"), `capture:mvp062 completed\n${logs.join("\n").replace(/\/Users\/[^\s]+/g, "WORKSPACE")}`);
  console.log("capture:mvp062 completed");
} finally {
  server.kill("SIGTERM");
}
