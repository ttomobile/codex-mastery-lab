import { chromium, type Browser, type Page } from "@playwright/test";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const screenshotDir = join(root, "artifacts", "screenshots");
const assetDir = join(root, "assets");
const terminalDir = join(root, "artifacts", "terminal");
mkdirSync(screenshotDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });
mkdirSync(terminalDir, { recursive: true });

const port = 3074;
const baseURL = `http://127.0.0.1:${port}`;
const states = ["empty", "waiting", "running", "succeeded", "failed", "evidence_missing"] as const;

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseURL}/?state=empty`);
      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("Next.js dev server did not become ready");
}

function startServer(): ChildProcessWithoutNullStreams {
  const child = spawn(
    "pnpm",
    ["exec", "next", "dev", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: root,
      env: process.env,
      stdio: "pipe"
    }
  );

  const logPath = join(terminalDir, "capture-server.txt");
  child.stdout.on("data", (chunk) => {
    writeFileSync(logPath, chunk, { flag: "a" });
  });
  child.stderr.on("data", (chunk) => {
    writeFileSync(logPath, chunk, { flag: "a" });
  });

  return child;
}

function copyToAssets(filename: string) {
  copyFileSync(join(screenshotDir, filename), join(assetDir, filename));
}

async function screenshotState(page: Page, state: string) {
  const filename = `aidd-control-plane-mvp074-${state.replace("_", "-")}.png`;
  await page.goto(`${baseURL}/?state=${state}`);
  await page.screenshot({ path: join(screenshotDir, filename), fullPage: true });
  copyToAssets(filename);
  return filename;
}

async function screenshotTerminalEvidence(browser: Browser) {
  const filename = "aidd-control-plane-mvp074-terminal-evidence.png";
  const terminalFiles = existsSync(terminalDir)
    ? readdirSync(terminalDir).filter((file) => file.endsWith(".txt")).sort()
    : [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.setContent(`<!doctype html>
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <title>terminal evidence</title>
        <style>
          body { margin: 0; background: #f5f7fb; color: #19212e; font-family: Arial, "Yu Gothic", sans-serif; }
          main { padding: 40px; }
          h1 { margin: 0 0 20px; font-size: 42px; letter-spacing: 0; }
          section { border: 1px solid #d4dbe7; background: #ffffff; padding: 22px; }
          p, li { margin: 12px 0; font-size: 20px; line-height: 1.7; }
          code { background: #f1f5f9; border: 1px solid #d4dbe7; padding: 3px 8px; }
        </style>
      </head>
      <body>
        <main>
          <h1>terminal evidence</h1>
          <section>
            <p>検証ログは artifacts/terminal に保存されています。</p>
            <ul>${terminalFiles.map((file) => `<li><code>${file}</code></li>`).join("")}</ul>
          </section>
        </main>
      </body>
    </html>`);

  await page.screenshot({ path: join(screenshotDir, filename), fullPage: true });
  copyToAssets(filename);
  await page.close();
  return filename;
}

async function main() {
  const child = startServer();
  try {
    await waitForServer();
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

    const filenames = [];
    for (const state of states) {
      filenames.push(await screenshotState(page, state));
    }
    filenames.push(await screenshotTerminalEvidence(browser));

    await page.close();
    await browser.close();
    writeFileSync(
      join(terminalDir, "capture-mvp074.txt"),
      ["capture:mvp074 completed", "screenshots:", ...filenames].join("\n") + "\n"
    );
  } finally {
    child.stdout.destroy();
    child.stderr.destroy();
    child.kill("SIGTERM");
    child.unref();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
