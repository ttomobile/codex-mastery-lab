import { expect, test } from "@playwright/test";

test.describe("Handoff Decision Ledger画面", () => {
  test("emptyからapprovedへ切り替え、approved execute_nowだけをdraftへ入れる", async ({
    page
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Handoff Decision Ledger" })).toBeVisible();
    await expect(page.getByTestId("empty-panel")).toContainText("判断材料がありません");

    await page.getByRole("button", { name: "approved" }).click();

    await expect(page.getByTestId("ledger-status")).toHaveText("approved");
    await expect(page.getByText("source handoff receipt")).toBeVisible();
    await expect(page.getByText("decision owner")).toBeVisible();
    await expect(page.getByText("decision reason")).toBeVisible();
    await expect(page.getByText("approved execute_now")).toBeVisible();
    await expect(page.getByText("verification commands")).toBeVisible();
    await expect(page.getByText("required evidence")).toBeVisible();
    await expect(page.getByText("AIDD-Spec接続")).toBeVisible();

    const draft = page.getByTestId("codex-command-draft");
    await expect(draft).toContainText("generated-repo の Handoff Decision Ledger UI を確認する");
    await expect(draft).not.toContainText("外部GitHub API連携");
    await expect(draft).not.toContainText("保留");
  });

  test("heldではhold reasonとLearning Log返却を表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "held" }).click();

    await expect(page.getByTestId("ledger-status")).toHaveText("held");
    await expect(page.getByTestId("held-panel")).toContainText("hold reason");
    await expect(page.getByTestId("held-panel")).toContainText("Learning Log返却");
  });

  test("blockedでは停止理由と公開前サニタイズ違反を表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "blocked" }).click();

    await expect(page.getByTestId("ledger-status")).toHaveText("blocked");
    await expect(page.getByTestId("blocked-panel")).toContainText("未承認");
    await expect(page.getByTestId("blocked-panel")).toContainText("理由不足");
    await expect(page.getByTestId("blocked-panel")).toContainText("3ブラウザ不足");
    await expect(page.getByTestId("blocked-panel")).toContainText("evidence不足");
    await expect(page.getByTestId("blocked-panel")).toContainText("local path混入");
    await expect(page.getByTestId("blocked-panel")).toContainText("private host混入");
    await expect(page.getByTestId("blocked-panel")).toContainText("private network URL混入");
  });
});
