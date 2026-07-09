import { expect, test } from "@playwright/test";

test("MVP084 Public Preview Smoke Final Receiptへ置き換わっている", async ({ page }) => {
  await page.goto("/?state=verified");
  await expect(page.getByText("AIDD Control Plane / MVP084")).toBeVisible();
  await expect(page.getByText("Public Preview Smoke Final Receipt Summary")).toBeVisible();
});
