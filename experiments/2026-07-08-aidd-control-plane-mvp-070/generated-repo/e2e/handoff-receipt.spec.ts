import { test, expect } from "@playwright/test";

test.describe("Shrunk Packet Handoff Receipt", () => {
  test("emptyは未選択としてblockedを表示する", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Shrunk Packet Handoff Receipt" })).toBeVisible();
    await expect(page.getByText("source shrink plan不足")).toBeVisible();
  });

  test("validはexecute_nowだけをCodex promptへ表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "valid" }).click();
    await expect(page.getByText("handoff receipt state")).toBeVisible();
    await expect(page.getByLabel("AIDD Control Plane MVP070").getByText("valid", { exact: true })).toBeVisible();
    await expect(page.getByText("Codexへ渡せます。execute_nowだけを実行し、defer_next_incrementは次回へ送ります。")).toBeVisible();
    const preview = page.getByRole("article", { name: "Codex prompt preview（execute_nowのみ）" });
    await expect(preview).toContainText("execute_now");
    await expect(preview).not.toContainText("defer_next_incrementをまとめて");
  });

  test("blockedはFirefox除外とfailure screenshot不足とrollback不足を止める", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "blocked" }).click();
    await expect(page.getByRole("heading", { name: "Firefox不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "failure screenshot不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "rollback不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "公開用prompt混入" })).toBeVisible();
  });
});
