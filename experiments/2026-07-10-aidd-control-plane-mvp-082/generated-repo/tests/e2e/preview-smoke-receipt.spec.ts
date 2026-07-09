import { expect, test } from "@playwright/test";

test("旧E2Eファイル名でもMVP082 Repair Action Plannerを確認する", async ({ page }) => {
  await page.goto("/?state=planned");
  await expect(page.getByText("AIDD Control Plane / MVP082")).toBeVisible();
  await expect(page.getByText("Smoke Receipt Repair Summary")).toBeVisible();
});
