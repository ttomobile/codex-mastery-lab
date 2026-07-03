import { chromium } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const screenshotDir = path.resolve(root, "../../character-collection-rpg-trial-001/artifacts/character-collection-rpg-trial-013/screenshots");
const assetsDir = path.resolve(root, "../../../assets");
const appUrl = process.env.AIDD_TRIAL013_APP_URL ?? "http://127.0.0.1:3018";
const fileName = "2026-07-03-character-collection-rpg-trial-013-diff-bundle.png";

mkdirSync(screenshotDir, { recursive: true });
mkdirSync(assetsDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
await page.goto(appUrl, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "bundle valid" }).click();
await page.getByRole("heading", { name: "Diff Bundle & Rollback Evidence Workspace: valid" }).scrollIntoViewIfNeeded();
const screenshotPath = path.join(screenshotDir, fileName);
const section = page.locator("#diff-bundle-rollback-title").locator("xpath=ancestor::section[1]");
await section.screenshot({ path: screenshotPath });
copyFileSync(screenshotPath, path.join(assetsDir, fileName));
await browser.close();
console.log(screenshotPath);
