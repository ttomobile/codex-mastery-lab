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

const port = 3072;
const baseURL = `http://127.0.0.1:${port}`;

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseURL);
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

async function screenshotState(page: Page, state: string, filename: string) {
  await page.goto(baseURL);
  if (state !== "empty") {
    await page.getByRole("button", { name: state }).click();
  }
  await page.screenshot({ path: join(screenshotDir, filename), fullPage: true });
  copyToAssets(filename);
}

async function screenshotTerminalEvidence(browser: Browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const terminalFiles = existsSync(terminalDir)
    ? readdirSync(terminalDir).filter((file) => file.endsWith(".txt")).sort()
    : [];
  const html = `<!doctype html>
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <title>MVP072 terminal evidence</title>
        <style>
          body { margin: 0; background: #f5f7fb; color: #19212e; font-family: Arial, "Yu Gothic", sans-serif; }
          main { padding: 40px; }
          h1 { margin: 0 0 20px; font-size: 42px; letter-spacing: 0; }
          section { border: 1px solid #d4dbe7; background: #ffffff; padding: 22px; }
          li { margin: 12px 0; font-size: 20px; }
          code { background: #f1f5f9; border: 1px solid #d4dbe7; padding: 3px 8px; }
        </style>
      </head>
      <body>
        <main>
          <h1>terminal evidence</h1>
          <section>
            <p>独立検証用ログは artifacts/terminal に保存されています。</p>
            <ul>
              ${terminalFiles.map((file) => `<li><code>${file}</code></li>`).join("")}
            </ul>
          </section>
        </main>
      </body>
    </html>`;

  const filename = "aidd-control-plane-mvp072-terminal-evidence.png";
  await page.setContent(html);
  await page.screenshot({
    path: join(screenshotDir, filename),
    fullPage: true
  });
  copyToAssets(filename);
}

async function main() {
  const child = startServer();
  try {
    await waitForServer();
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

    await screenshotState(page, "empty", "aidd-control-plane-mvp072-empty.png");
    await screenshotState(page, "queued", "aidd-control-plane-mvp072-queued.png");
    await screenshotState(page, "blocked", "aidd-control-plane-mvp072-blocked.png");
    await screenshotState(page, "exported", "aidd-control-plane-mvp072-exported.png");
    await screenshotTerminalEvidence(browser);

    await browser.close();
    writeFileSync(
      join(terminalDir, "capture-mvp072.txt"),
      [
        "capture:mvp072 completed",
        "screenshots:",
        "aidd-control-plane-mvp072-empty.png",
        "aidd-control-plane-mvp072-queued.png",
        "aidd-control-plane-mvp072-blocked.png",
        "aidd-control-plane-mvp072-exported.png",
        "aidd-control-plane-mvp072-terminal-evidence.png"
      ].join("\n") + "\n"
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
