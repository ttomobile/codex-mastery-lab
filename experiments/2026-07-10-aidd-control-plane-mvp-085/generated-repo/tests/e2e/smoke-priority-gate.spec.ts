import { expect, test } from "@playwright/test";

test("MVP085 Final Receipt Failure Handoff Queueへ置き換わっている", async ({ page }) => {
  await page.goto("/?state=exported");
  await expect(page.getByText("AIDD Control Plane / MVP085")).toBeVisible();
  await expect(page.getByText("Final Receipt Failure Handoff Queue").first()).toBeVisible();
  await expect(page.getByText("execute_nowのみ").first()).toBeVisible();
});
