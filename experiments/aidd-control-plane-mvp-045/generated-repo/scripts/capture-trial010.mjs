import { chromium } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const screenshotDir = path.resolve(root, "../../character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-010/screenshots");
const assetsDir = path.resolve(root, "../../../assets");
const appUrl = process.env.AIDD_TRIAL010_APP_URL ?? "http://127.0.0.1:3017";
const fileName = "2026-07-03-character-collection-rpg-trial-010-app-idea-seed.png";

mkdirSync(screenshotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(appUrl, { waitUntil: "networkidle" });
await page.getByRole("radio", { name: /学習支援/ }).check({ force: true });
await page.getByLabel("何を作りたいですか？").fill("音声つき散歩ログアプリ");
await page.getByRole("heading", { name: "新規アプリ案AI Task Packet seed: valid" }).scrollIntoViewIfNeeded();
const screenshotPath = path.join(screenshotDir, fileName);
const section = page.getByLabel("Dogfood App Idea Packet Generator").or(page.locator("#dogfood-app-idea-generator-title").locator("xpath=ancestor::section[1]"));
await section.screenshot({ path: screenshotPath });
copyFileSync(screenshotPath, path.join(assetsDir, fileName));
await browser.close();
console.log(screenshotPath);
