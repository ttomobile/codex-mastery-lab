import { expect, test } from "@playwright/test";

test("旧E2Eファイル名でもMVP081履歴比較を確認する", async ({ page }) => {
  await page.goto("/?state=valid");
  await expect(page.getByText("AIDD Control Plane / MVP081")).toBeVisible();
  await expect(page.getByText("receipt-080-a")).toBeVisible();
});
