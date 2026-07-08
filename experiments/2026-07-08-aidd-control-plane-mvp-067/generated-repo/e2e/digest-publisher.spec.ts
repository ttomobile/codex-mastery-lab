import { expect, test } from "@playwright/test";

test.describe("Smoke Finding Action Queue", () => {
  test("empty状態では古いsmoke結果を使わない", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Smoke Finding Action Queue" })).toBeVisible();
    await expect(page.getByText("Smoke結果が未選択です")).toBeVisible();
    await expect(page.getByText("Action Queueは未生成です")).toBeVisible();
  });

  test("queued状態で失敗assetを行動キューへ変換する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "queued" }).click();
    await expect(page.getByText("壊れたassetをReview Finding Action Queueへ分類しました。")).toBeVisible();
    await expect(page.getByText("RFQ-067-001").first()).toBeVisible();
    await expect(page.getByText("execute_now").first()).toBeVisible();
  });

  test("blocked状態でFirefox不足と証跡不足を止める", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "blocked" }).click();
    const blockedReasons = page.getByLabel("blocked reasons");
    await expect(blockedReasons.getByRole("heading", { name: "Firefox未確認" })).toBeVisible();
    await expect(blockedReasons.getByRole("heading", { name: "terminal evidence image response不足" })).toBeVisible();
    await expect(page.getByText("blocked", { exact: true }).first()).toBeVisible();
  });

  test("exported状態でexecute_nowだけをCodex promptへ書き出す", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "exported" }).click();
    const prompt = page.getByLabel("Codex prompt preview（execute_nowのみ）");
    await expect(prompt).toContainText("RFQ-067-001");
    await expect(prompt).toContainText("RFQ-067-002");
    await expect(prompt).not.toContainText("RFQ-067-003");
    await expect(prompt).not.toContainText("RFQ-067-004");
  });
});
