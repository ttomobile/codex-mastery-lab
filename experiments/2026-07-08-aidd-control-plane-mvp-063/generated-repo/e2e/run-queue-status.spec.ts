import { expect, test } from "@playwright/test";

test("empty状態ではRun Queueが空であることを表示する", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("AIDD Control Plane MVP063")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Codex Run Queue Status Tracker", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Run Queue状態: 空" })).toBeVisible();
  await expect(page.getByLabel("empty状態の要約")).toContainText("Run Queueは空です");
  await expect(page.getByLabel("Run Queue空詳細")).toContainText("古いRun証跡を表示しない");
});

test("waiting状態では実行待ちのコマンドと3ブラウザ範囲を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "待機中" }).click();
  await expect(page.getByRole("heading", { name: "Run Queue状態: 待機中" })).toBeVisible();
  const detail = page.getByLabel("Run Queue詳細");
  await expect(detail).toContainText("pnpm run lint");
  await expect(detail).toContainText("Chromium / Firefox / WebKit");
  await expect(page.getByText("Review Findingはありません")).toBeVisible();
});

test("running状態では完了扱いにせずLearning Logへ待機条件を出す", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "実行中" }).click();
  await expect(page.getByRole("heading", { name: "Run Queue状態: 実行中" })).toBeVisible();
  await expect(page.getByText("running中は完了判定を出さず")).toBeVisible();
  await expect(page.getByLabel("証跡一覧")).toContainText("terminal evidence");
});

test("succeeded状態では成功証跡とReview Record出力を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "成功" }).click();
  await expect(page.getByRole("heading", { name: "Run Queue状態: 成功" })).toBeVisible();
  await expect(page.getByLabel("証跡一覧")).toContainText("aidd-control-plane-mvp063-succeeded.png");
  await expect(page.getByText("lint/typecheck/test/build/test:e2e/doctor/capture")).toBeVisible();
});

test("failed状態では足りないものをReview Findingとして表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "失敗" }).click();
  await expect(page.getByRole("heading", { name: "Run Queue状態: 失敗" })).toBeVisible();
  const findings = page.getByLabel("Review Finding一覧");
  await expect(findings).toContainText("実行失敗");
  await expect(findings).toContainText("成功した検証コマンド");
  await expect(findings).toContainText("succeeded状態のterminal evidence");
  await expect(findings).toContainText("pnpm run test:e2e");
});

test("evidence_missing状態ではterminalとscreenshotの不足をReview Findingとして表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "証跡不足" }).click();
  await expect(page.getByRole("heading", { name: "Run Queue状態: 証跡不足" })).toBeVisible();
  const findings = page.getByLabel("Review Finding一覧");
  await expect(findings).toContainText("証跡不足");
  await expect(findings).toContainText("screenshot evidence");
  await expect(findings).toContainText("pnpm run capture:mvp063 && pnpm run doctor:aidd");
  await expect(page.getByLabel("証跡一覧")).toContainText("不足");
});
