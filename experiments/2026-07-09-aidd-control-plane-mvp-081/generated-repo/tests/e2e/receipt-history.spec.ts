import { expect, test } from "@playwright/test";

const states = ["empty", "valid", "improved", "regression", "blocked"] as const;

test.describe("Dispatch Receipt履歴比較", () => {
  for (const state of states) {
    test(`${state}状態を日本語UIで表示できる`, async ({ page }) => {
      await page.goto(`/?state=${state}`);
      await expect(page.getByText("AIDD Control Plane / MVP081")).toBeVisible();
      await expect(page.getByRole("navigation", { name: "状態切り替え" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "History Comparator Summary" })).toBeVisible();
      await expect(page.getByText("execute_nowのみ")).toBeVisible();
    });
  }

  test("valid状態では3件のReceiptと3ブラウザ証跡を比較できる", async ({ page }) => {
    await page.goto("/?state=valid");
    await expect(page.getByText("receipt-080-a")).toBeVisible();
    await expect(page.getByText("receipt-080-b")).toBeVisible();
    await expect(page.getByText("receipt-080-c")).toBeVisible();
    await expect(page.getByText("Chromium / Firefox / WebKit").first()).toBeVisible();
  });

  test("improved状態では改善findingと有効なRepair Actionを表示する", async ({ page }) => {
    await page.goto("/?state=improved");
    await expect(page.getByText("同じ失敗が減っています")).toBeVisible();
    await expect(page.getByText("terminal evidence不足").first()).toBeVisible();
    await expect(page.getByText("failure state captureを必須証跡へ昇格").first()).toBeVisible();
  });

  test("regression状態ではReview Finding YAMLとrollback対象を表示する", async ({ page }) => {
    await page.goto("/?state=regression");
    await expect(page.getByText("再発findingが見つかりました")).toBeVisible();
    await expect(page.getByText("Evidence Regression")).toBeVisible();
    await expect(page.getByText("pnpm run doctor:aidd")).toBeVisible();
  });

  test("blocked状態では公開前ブロックを表示する", async ({ page }) => {
    await page.goto("/?state=blocked");
    await expect(page.getByText("公開前ブロック: 履歴比較に危険な証跡が混入しています")).toBeVisible();
    await expect(page.getByText("local path混入").first()).toBeVisible();
    await expect(page.getByText("execute_now以外混入").first()).toBeVisible();
  });
});
