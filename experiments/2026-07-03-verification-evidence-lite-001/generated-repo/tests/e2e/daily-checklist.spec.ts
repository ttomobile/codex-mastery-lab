import { expect, test } from "@playwright/test";

test("AC-001 タスクを追加すると一覧の先頭に表示される", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("タスクを追加").fill("買い物リストを書く");
  await page.getByRole("button", { name: "追加" }).click();

  await expect(page.getByRole("listitem").first()).toContainText("買い物リストを書く");
  await expect(page.getByRole("list", { name: "タスク一覧、4件表示中" })).toBeVisible();
});

test("AC-002 完了を切り替えると完了数が更新される", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("listitem")
    .filter({ hasText: "朝の予定を確認する" })
    .getByRole("checkbox")
    .check();

  await expect(page.getByLabel("3件中2件が完了しています")).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "朝の予定を確認する" })).toHaveClass(/done/);
});

test("AC-003 空入力エラーと未完了なしの空状態が伝わる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "追加" }).click();
  await expect(page.getByRole("status")).toHaveText("タスク名を入力してください。");

  for (const name of ["朝の予定を確認する", "夕方に振り返る"]) {
    await page
      .getByRole("listitem")
      .filter({ hasText: name })
      .getByRole("checkbox")
      .check();
  }

  await page.getByLabel("未完了のみ表示").check();

  await expect(page.getByText("未完了のタスクはありません。すべて完了しています。")).toBeVisible();
  await expect(page.getByRole("list", { name: "タスク一覧、0件表示中" })).toHaveAttribute(
    "aria-describedby",
    "empty-state"
  );
});
