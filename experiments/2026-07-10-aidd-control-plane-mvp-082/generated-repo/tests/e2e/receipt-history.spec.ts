import { expect, test } from "@playwright/test";

test("旧Receipt履歴E2E名でもMVP082へ置換済み", async ({ page }) => {
  await page.goto("/?state=blocked");
  await expect(page.getByText("AIDD Control Plane / MVP082")).toBeVisible();
  await expect(page.getByRole("heading", { name: "公開前ブロック", level: 2 })).toBeVisible();
});
