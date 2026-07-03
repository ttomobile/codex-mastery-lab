import { chromium } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const screenshotDir = path.resolve(root, "../../character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-012/screenshots");
const assetsDir = path.resolve(root, "../../../assets");
const appUrl = process.env.AIDD_TRIAL012_APP_URL ?? "http://127.0.0.1:3018";
const fileName = "2026-07-03-character-collection-rpg-trial-012-patch-plan.png";

mkdirSync(screenshotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(appUrl, { waitUntil: "networkidle" });
await page.getByRole("radio", { name: /学習支援/ }).check({ force: true });
await page.getByLabel("何を作りたいですか？").fill("音声つき散歩ログアプリ");
await page.getByRole("heading", { name: "Dogfood Markdown Patch Plan: valid" }).scrollIntoViewIfNeeded();
const screenshotPath = path.join(screenshotDir, fileName);
const section = page.locator("#dogfood-markdown-patch-plan-title").locator("xpath=ancestor::section[1]");
await section.screenshot({ path: screenshotPath });
copyFileSync(screenshotPath, path.join(assetsDir, fileName));
await browser.close();
console.log(screenshotPath);
