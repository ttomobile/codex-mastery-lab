import { expect, test } from "@playwright/test";

test("emptyではsource run未選択と次の入力を表示する", async ({ page }) => {
  await page.goto("/?state=empty");
  await expect(page.getByText("AIDD Control Plane MVP075")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Run Result Digest Publisher", level: 1 })).toBeVisible();
  await expect(page.getByLabel("source run未選択")).toContainText("source runが未選択です");
  await expect(page.getByText("source run id")).toBeVisible();
  await expect(page.getByLabel("source run未選択")).toContainText("Chromium / Firefox / WebKit coverage");
});

test("validでは共有ダイジェストの必須項目を1画面で表示する", async ({ page }) => {
  await page.goto("/?state=valid");
  await expect(page.getByLabel("共有可能")).toContainText("共有ダイジェストとして採用可能");
  const facts = page.getByLabel("run digest facts");
  await expect(facts).toContainText("run outcome");
  await expect(facts).toContainText("score");
  await expect(facts).toContainText("console errorなし、console warnなし");
  const evidence = page.getByLabel("evidence coverage");
  for (const text of ["terminal evidence", "initial", "filled", "failure", "terminal", "Chromium", "Firefox", "WebKit"]) {
    await expect(evidence).toContainText(text);
  }
  for (const text of ["Review Record excerpt", "Learning Log excerpt", "AI Task Packet delta", "Codex prompt delta", "note article angle"]) {
    await expect(page.getByRole("heading", { name: text })).toBeVisible();
  }
});

test("failureではReview Findingとして不足を表示する", async ({ page }) => {
  await page.goto("/?state=failure");
  await expect(page.getByLabel("レビュー差し戻し")).toContainText("Review Findingとして差し戻し");
  const findings = page.getByLabel("Review Finding一覧");
  for (const text of ["score根拠不足", "Firefox未実行", "console warn", "terminal evidence不足"]) {
    await expect(findings).toContainText(text);
  }
});

test("blockedではlocal pathとprivate URL混入を公開前に止める", async ({ page }) => {
  await page.goto("/?state=blocked");
  await expect(page.getByLabel("公開停止")).toContainText("local path / private host / private network URL混入");
  await expect(page.getByLabel("Review Finding一覧")).toContainText("local path / private host / private network URL混入");
  await expect(page.locator("pre")).toContainText("WORKSPACE/private-url");
  await expect(page.locator("pre")).not.toContainText("/Users/");
  await expect(page.locator("pre")).not.toContainText("10.0.0.75");
});
