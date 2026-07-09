import { expect, test } from "@playwright/test";

const states = ["empty", "prioritized", "conflict", "blocked"] as const;

test.describe("MVP083 Smoke Repair Priority Gate", () => {
  for (const state of states) {
    test(`${state} 状態を表示できる`, async ({ page }) => {
      await page.goto(`/?state=${state}`);
      await expect(page.getByText("AIDD Control Plane / MVP083")).toBeVisible();
      await expect(page.getByRole("link", { name: state })).toHaveClass(/active/);
      await expect(page.getByText("Smoke Repair Priority Gate Summary")).toBeVisible();
    });
  }

  test("prioritizedではexecute_nowだけをpromptに入れる", async ({ page }) => {
    await page.goto("/?state=prioritized");
    await expect(page.getByText("ready: 1件に絞り込み済み")).toBeVisible();
    await expect(page.getByText("execute_nowのみ")).toBeVisible();
    const prompt = page.getByText(/execute_now:\n/);
    await expect(prompt).toContainText("terminal evidence画像のHTTP 404");
    await expect(prompt).not.toContainText("defer_next_increment:");
    await expect(prompt).not.toContainText("return_to_learning_log:");
  });

  test("conflictでは優先順位衝突を止める", async ({ page }) => {
    await page.goto("/?state=conflict");
    await expect(page.getByText("conflict: 判断保留")).toBeVisible();
    await expect(page.getByText("高severity候補が複数ある")).toBeVisible();
    await expect(page.getByText("実行予算が1回分を超過")).toBeVisible();
  });

  test("blockedでは公開前ブロック条件を表示する", async ({ page }) => {
    await page.goto("/?state=blocked");
    await expect(page.getByText("blocked", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("private URL混入", { exact: true })).toBeVisible();
    await expect(page.getByText("Firefox除外", { exact: true })).toBeVisible();
    await expect(page.getByText("rollback不足", { exact: true })).toBeVisible();
  });
});
