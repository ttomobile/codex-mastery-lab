import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("WatchFlow E2E", () => {
  test("ホームから動画詳細へ移動できる", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "いま見たい動画" })).toBeVisible();
    await page.getByRole("link", { name: /小さな動画サービスを設計する/ }).first().click();
    await expect(page.getByRole("heading", { name: /小さな動画サービスを設計する/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /再生|一時停止/ })).toBeVisible();
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

  test("認証と課金の失敗状態を表示できる", async ({ page }) => {
    await page.goto("/states?auth=session_expired&billing=payment_failed");
    await expect(page.getByRole("heading", { name: "セッション期限切れ" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "支払い確認が必要" })).toBeVisible();
  });

  test("オフライン状態とタイムアウト状態を表示できる", async ({ page }) => {
    await page.goto("/search?state=offline");
    await expect(page.getByRole("heading", { name: "ネットワークに接続できません" })).toBeVisible();
    await page.goto("/search?state=timeout");
    await expect(page.getByRole("heading", { name: "応答が時間内に完了しませんでした" })).toBeVisible();
  });

  test("基本ページで axe 違反がない", async ({ page }) => {
    for (const path of ["/", "/search?q=TypeScript", "/watch/vf-001", "/states?auth=anonymous&billing=free"]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
      expect(results.violations).toEqual([]);
    }
  });
});
