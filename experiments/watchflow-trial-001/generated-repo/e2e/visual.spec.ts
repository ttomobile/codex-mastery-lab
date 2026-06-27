import { expect, test } from "@playwright/test";

test.describe("WatchFlow Visual Regression", () => {
  test("ホーム画面の基準スクリーンショット", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveScreenshot("home.png", { fullPage: true });
  });

  test("動画詳細画面の基準スクリーンショット", async ({ page }) => {
    await page.goto("/watch/vf-001");
    await expect(page).toHaveScreenshot("watch-detail.png", { fullPage: true, maxDiffPixelRatio: 0.02 });
  });
});
