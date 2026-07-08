import { expect, test } from "@playwright/test";

test.describe("Run Result Digest Publisher", () => {
  test("empty / valid / failure / blockedを切り替えられる", async ({ page }) => {
    await page.goto("/");

    for (const state of ["empty", "valid", "failure", "blocked"]) {
      await page.getByRole("button", { name: state }).click();
      await expect(page.getByRole("heading", { name: "Run Result Digest Publisher" })).toBeVisible();
    }

    await page.getByRole("button", { name: "valid" }).click();
    await expect(page.getByLabel("共有用Markdown")).toContainText("MVP063-RUN-SUCCEEDED-20260708");
    await expect(page.getByLabel("Codex prompt delta")).toContainText("次回Codex prompt delta");
    await expect(page.getByLabel("Verification Evidence checklist")).toContainText("Chromium / Firefox / WebKit coverageを確認");
  });

  test("blockedでは8件のReview Findingを表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "blocked" }).click();

    const findingList = page.getByRole("list", { name: "Review Finding一覧" });
    await expect(findingList).toContainText("source run id不足");
    await expect(findingList).toContainText("terminal evidence不足");
    await expect(findingList).toContainText("failure screenshot不足");
    await expect(findingList).toContainText("Firefox除外");
    await expect(findingList).toContainText("console error/warn未確認");
    await expect(findingList).toContainText("local path/host/private network URL混入");
    await expect(findingList).toContainText("Learning Log接続不足");
    await expect(findingList).toContainText("note記事観点不足");
  });

  test("3ブラウザcoverageを画面で確認できる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "valid" }).click();

    const coverage = page.getByLabel("3ブラウザcoverage");
    await expect(coverage).toContainText("Chromium");
    await expect(coverage).toContainText("Firefox");
    await expect(coverage).toContainText("WebKit");
    await expect(coverage).toContainText("通過");
  });
});
