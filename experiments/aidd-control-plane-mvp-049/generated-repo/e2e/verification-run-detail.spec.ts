import { expect, test } from "@playwright/test";

test("empty状態ではVerification Run Detailの必要入力を表示する", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "MVP 049: Verification Run Detail Drilldown", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Verification Run Detail: empty" })).toBeVisible();
  await expect(page.getByText("入力待ち")).toBeVisible();
  await expect(page.getByText("必要入力: source queue item / source run status / commit SHA")).toBeVisible();
  await expect(page.getByText("まだcommand別detailはありません")).toBeVisible();
});

test("ready状態ではcommand別明細と3ブラウザ証跡を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "readyサンプル" }).click();

  await expect(page.getByRole("heading", { name: "Verification Run Detail: ready" })).toBeVisible();
  const ready = page.getByLabel("ready detail");
  await expect(ready.getByText("codex-run-queue-mvp049-001")).toBeVisible();
  await expect(ready.getByText("success")).toBeVisible();
  await expect(ready.getByText("8f4c2a9d31b6")).toBeVisible();
  await expect(ready.getByText("Chromium / Firefox / WebKit")).toBeVisible();

  const table = page.getByLabel("command detail table");
  for (const commandName of ["lint", "typecheck", "test", "build", "test:e2e", "doctor:aidd"]) {
    await expect(table.getByText(commandName, { exact: true })).toBeVisible();
  }
  await expect(table.getByText("追加修正なし").first()).toBeVisible();
  await expect(page.getByText("terminal evidence", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AIDD-Spec connections").getByText("AIDD-Spec v0.1")).toBeVisible();
  await expect(page.getByText("修正不要", { exact: true })).toBeVisible();
});

test("failure状態では不足検出とReview Finding draftを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "failureサンプル" }).click();

  await expect(page.getByRole("heading", { name: "Verification Run Detail: failure" })).toBeVisible();
  const findings = page.getByLabel("failure findings");
  await expect(findings.getByText("commit SHA不足")).toBeVisible();
  await expect(findings.getByText("command別detail不足")).toBeVisible();
  await expect(findings.getByText("exit code不足")).toBeVisible();
  await expect(findings.getByText("artifact path不足")).toBeVisible();
  await expect(findings.getByText("失敗分類不足")).toBeVisible();
  await expect(findings.getByText("修正指示不足")).toBeVisible();
  await expect(findings.getByText("Firefox除外")).toBeVisible();
  await expect(findings.getByText("terminal evidence不足")).toBeVisible();
  await expect(findings.getByText("failure screenshot不足")).toBeVisible();
  await expect(findings.getByText("local path / host / private network URL混入")).toBeVisible();
  await expect(findings.getByText("AIDD-Spec connection不足")).toBeVisible();
  await expect(page.getByText("必要な上流情報")).toBeVisible();
  await expect(page.getByText("検証command")).toBeVisible();
  await expect(page.getByText("pnpm run test:e2e").first()).toBeVisible();
});
