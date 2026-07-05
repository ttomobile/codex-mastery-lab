import { expect, test } from "@playwright/test";

test("empty状態では実行候補packet未選択とCodexを開始できない理由を表示する", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP052")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Codex Run Budget Gate", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Codex実行判断: empty" })).toBeVisible();
  await expect(page.getByLabel("empty state").getByText("実行候補packet未選択")).toBeVisible();
  await expect(page.getByLabel("empty state").getByText("Codexを開始できません")).toBeVisible();
});

test("ready状態ではgo判断とprompt previewを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "readyサンプル" }).click();

  await expect(page.getByRole("heading", { name: "Codex実行判断: go" })).toBeVisible();
  await expect(page.getByLabel("ready summary").getByText("go: Codex実行前チェックを通過")).toBeVisible();
  await expect(page.getByText("ATP-MVP052-RUN-BUDGET-GATE")).toBeVisible();
  await expect(page.getByText("RD-051-FX-TIMEOUTを小さな1インクリメントとして実行する")).toBeVisible();
  await expect(page.getByText("chromium / firefox / webkit", { exact: true })).toBeVisible();

  for (const command of ["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e", "pnpm run doctor:aidd"]) {
    await expect(page.getByLabel("verification commands").getByText(command, { exact: true })).toBeVisible();
  }
  await expect(page.locator("pre").getByText("採用済みdeltaだけをCodexへ渡す")).toBeVisible();
});

test("failure状態では利用枠過多と公開前ブロックを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "failureサンプル" }).click();

  await expect(page.getByRole("heading", { name: "Codex実行判断: stop" })).toBeVisible();
  const findings = page.getByLabel("failure findings");
  for (const issue of [
    "primary usage過多",
    "secondary usage過多",
    "max runtime不足",
    "停止条件不足",
    "fallback action不足",
    "Firefox除外",
    "Verification Evidence接続不足",
    "Review Record接続不足",
    "Learning Log接続不足",
    "Maintenance Runbook接続不足",
    "AIDD-Spec接続不足",
    "local path / host / private network URL混入"
  ]) {
    await expect(findings.getByText(issue)).toBeVisible();
  }
  await expect(findings.getByText("公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています")).toBeVisible();
});
