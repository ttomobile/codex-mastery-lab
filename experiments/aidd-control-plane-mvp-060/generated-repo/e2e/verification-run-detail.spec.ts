import { expect, test } from "@playwright/test";

test("キューなしケースではsource queue itemなしを表示する", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP060")).toBeVisible();
  await expect(page.getByRole("heading", { name: "検証実行詳細", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "検証判定: キューなし" })).toBeVisible();
  await expect(page.getByLabel("キューなしの要約").getByText("source queue itemがありません")).toBeVisible();
  await expect(page.getByLabel("検証実行詳細なし")).toContainText("readyになるまでVerification Run Detailは表示しません。");
});

test("検証readyケースではcommand別Verification Run Detailを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "検証ready" }).click();

  await expect(page.getByRole("heading", { name: "検証判定: ready" })).toBeVisible();
  await expect(page.getByLabel("readyの要約").getByText("Verification Run Detailがready")).toBeVisible();
  const detail = page.getByRole("article", { name: "検証実行詳細", exact: true });
  await expect(detail).toBeVisible();

  for (const field of [
    "source_queue_item_id",
    "source_run_status",
    "commit_sha",
    "command_details",
    "browser_coverage",
    "terminal_evidence",
    "screenshot_evidence",
    "playwright_report",
    "review_finding_draft",
    "aidd_spec_connections"
  ]) {
    await expect(detail.getByRole("heading", { name: field, exact: true })).toBeVisible();
  }

  for (const text of [
    "MVP060-QUEUE-VERIFICATION-001",
    "succeeded",
    "8f4c2a1b9d0e7f6a5c3b2a190fedcba987654321",
    "pnpm run lint",
    "exit_code",
    "duration",
    "status",
    "artifact_path",
    "failure_category",
    "repair_instruction",
    "Chromium: 対象",
    "Firefox: 対象",
    "WebKit: 対象",
    "aidd-control-plane-mvp060-terminal-evidence.png",
    "aidd-control-plane-mvp060-repair-needed.png",
    "playwright-report/index.html",
    "Verification Run Detail: connected"
  ]) {
    await expect(detail).toContainText(text);
  }
});

test("差し戻しケースでは標準Review Finding形式で戻し先を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "差し戻し" }).click();

  await expect(page.getByRole("heading", { name: "検証判定: 差し戻し" })).toBeVisible();
  await expect(page.getByLabel("差し戻しの要約").getByText("標準Review Finding形式")).toBeVisible();
  const findings = page.getByLabel("Review Finding一覧");

  for (const text of [
    "commit SHA不足",
    "artifact path不足",
    "失敗分類不足",
    "修正指示不足",
    "Firefox除外",
    "証跡不足",
    "local path/private host/private network URL混入",
    "category",
    "finding",
    "severity",
    "observed_by",
    "ideal_state",
    "fix_instruction",
    "ai_task_packet_delta",
    "codex_prompt_delta",
    "verification_command",
    "AI Task Packet deltaへ戻し",
    "WORKSPACEまたはHOME表記へ置換"
  ]) {
    await expect(findings).toContainText(text);
  }

  await expect(page.getByLabel("検証実行詳細なし")).toContainText("readyになるまでVerification Run Detailは表示しません。");
  await expect(page.locator("pre")).toContainText("WORKSPACE/private-url");
  await expect(page.locator("pre")).not.toContainText("/Users/");
});

test("修復候補ケースではfailedとtimeoutとevidence_missingをdeltaへ戻す", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "修復候補" }).click();

  await expect(page.getByRole("heading", { name: "検証判定: 修復候補あり" })).toBeVisible();
  await expect(page.getByLabel("修復候補の要約").getByText("次回修復delta候補へ変換")).toBeVisible();
  const repair = page.getByLabel("次回修復delta候補");

  for (const text of [
    "pnpm run lint",
    "pnpm run test:e2e",
    "pnpm run doctor:aidd",
    "failed",
    "timeout",
    "evidence_missing",
    "ai_task_packet_delta",
    "codex_prompt_delta",
    "verification_command",
    "次回修復scope"
  ]) {
    await expect(repair).toContainText(text);
  }

  await expect(page.getByLabel("検証実行詳細なし")).toContainText("readyになるまでVerification Run Detailは表示しません。");
});
