import { expect, test } from "@playwright/test";

test.describe("WatchFlow E2E", () => {
  test("ホームから動画詳細へ移動できる", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "いま見たい動画" })).toBeVisible();
    await page.getByRole("link", { name: /小さな動画サービスを設計する/ }).first().click();
    await expect(page.getByRole("heading", { name: /小さな動画サービスを設計する/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "再生" })).toBeVisible();
  });

  test("検索結果の空状態を表示できる", async ({ page }) => {
    await page.goto("/search?q=存在しない動画");
    await expect(page.getByRole("heading", { name: "該当する動画がありません" })).toBeVisible();
  });

  test("動画取得失敗時にリトライ導線を表示する", async ({ page }) => {
    await page.goto("/watch/vf-001?media=failure");
    const retryButton = page.getByRole("button", { name: /再試行/ });
    const alreadyFailed = await retryButton.isVisible({ timeout: 2000 }).catch(() => false);
    if (!alreadyFailed) {
      const video = page.locator("video");
      await video.waitFor({ timeout: 5000 });
      await video.evaluate((element) => element.dispatchEvent(new Event("error")));
    }
    await expect(retryButton).toBeVisible();
  });
});
