import { expect, test } from "@playwright/test";

test.describe("Publication Evidence QA Gate", () => {
  test("empty / valid / failure / blockedを切り替えられる", async ({ page }) => {
    await page.goto("/");

    for (const state of ["empty", "valid", "failure", "blocked"]) {
      await page.getByRole("button", { name: state }).click();
      await expect(page.getByRole("heading", { name: "Publication Evidence QA Gate" })).toBeVisible();
    }

    await page.getByRole("button", { name: "valid" }).click();
    await expect(page.getByLabel("公開候補ダイジェスト", { exact: true })).toContainText("MVP065-PUBLICATION-EVIDENCE-QA-20260708");
    await expect(page.getByLabel("publish checklist")).toContainText("source digest idを確認");
    await expect(page.getByLabel("QA判定サマリー")).toContainText("判定: valid");
  });

  test("公開QAに必要な項目を画面で確認できる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "valid" }).click();

    await expect(page.getByLabel("公開候補ダイジェスト入力")).toContainText("source digest id");
    await expect(page.getByLabel("公開候補ダイジェスト入力")).toContainText("article path");
    await expect(page.getByLabel("公開候補ダイジェスト入力")).toContainText("preview");
    await expect(page.getByLabel("公開候補ダイジェスト入力")).toContainText("asset copy");
    await expect(page.getByLabel("terminal evidence")).toContainText("console status");
    await expect(page.getByLabel("initial filled failure screenshots")).toContainText("initial screenshot");
    await expect(page.getByLabel("sanitization scan")).toContainText("AIDD-Spec接続");
    await expect(page.getByRole("heading", { name: "Review Record" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Learning Log" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Task Packet delta" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Codex prompt delta" })).toBeVisible();
  });

  test("blockedでは5件のReview Findingを表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "blocked" }).click();

    const findingList = page.getByRole("list", { name: "Review Finding一覧" });
    await expect(findingList).toContainText("local path / host / private network URL混入");
    await expect(findingList).toContainText("Firefox除外");
    await expect(findingList).toContainText("terminal evidence不足");
    await expect(findingList).toContainText("記事観点不足");
    await expect(findingList).toContainText("AIDD-Spec接続不足");
  });

  test("3ブラウザcoverageを画面で確認できる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "valid" }).click();

    const coverage = page.getByLabel("Chromium Firefox WebKit");
    await expect(coverage).toContainText("Chromium");
    await expect(coverage).toContainText("Firefox");
    await expect(coverage).toContainText("WebKit");
    await expect(coverage).toContainText("通過");
  });
});
