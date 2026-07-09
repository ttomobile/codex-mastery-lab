import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const assetDir = path.join(root, "assets");
const terminalDir = path.join(root, "artifacts", "terminal");
mkdirSync(assetDir, { recursive: true });
mkdirSync(terminalDir, { recursive: true });

const port = "3075";
const server = spawn("pnpm", ["exec", "next", "dev", "--hostname", "127.0.0.1", "--port", port], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
const logs = [];
server.stdout.on("data", (data) => logs.push(data.toString()));
server.stderr.on("data", (data) => logs.push(data.toString()));

async function waitForReady() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/?state=empty`);
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
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  const states = ["empty", "valid", "failure", "blocked"];
  for (const state of states) {
    await page.goto(`http://127.0.0.1:${port}/?state=${state}`);
    await page.screenshot({ path: path.join(assetDir, `aidd-control-plane-mvp075-${state}.png`), fullPage: true });
  }
  await browser.close();
  writeFileSync(path.join(terminalDir, "capture-mvp075.txt"), `capture:mvp075 completed\n${logs.join("\n").replace(/\/Users\/[^\s]+/g, "WORKSPACE")}`);
  console.log("capture:mvp075 completed");
} finally {
  server.kill("SIGTERM");
}
