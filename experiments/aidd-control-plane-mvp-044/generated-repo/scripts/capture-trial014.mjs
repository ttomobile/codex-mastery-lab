import { chromium } from "@playwright/test";
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dogfoodRoot = path.resolve(root, "..", "..", "character-collection-rpg-trial-001");
const screenshotDir = path.join(dogfoodRoot, "artifacts", "character-collection-rpg-trial-014", "screenshots");
const assetsDir = path.resolve(root, "..", "..", "..", "assets");
const appUrl = process.env.AIDD_TRIAL014_APP_URL ?? "http://127.0.0.1:3019";
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
await page.getByRole("heading", { name: /Bundle Decision Ledger:/ }).scrollIntoViewIfNeeded();
await shot("2026-07-03-character-collection-rpg-trial-014-bundle-ledger-empty.png");

await page.getByRole("button", { name: "bundle valid" }).click();
await page.getByRole("button", { name: "ledger valid" }).click();
await page.getByRole("heading", { name: /Bundle Decision Ledger: valid/ }).scrollIntoViewIfNeeded();
await shot("2026-07-03-character-collection-rpg-trial-014-bundle-ledger-valid.png");

await page.getByRole("button", { name: "ledger failure" }).click();
await page.getByRole("heading", { name: /Bundle Decision Ledger: failure/ }).scrollIntoViewIfNeeded();
await shot("2026-07-03-character-collection-rpg-trial-014-bundle-ledger-failure.png");

await browser.close();
