import { expect, test } from "@playwright/test";

test("emptyケースではStatus Trackerを生成しない", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP057")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Codex Run Queue Status Tracker", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Status Tracker判定: empty" })).toBeVisible();
  await expect(page.getByLabel("empty summary").getByText("判断対象のRun Queue Intakeがありません")).toBeVisible();
  await expect(page.getByLabel("status tracker empty")).toContainText("succeededになるまでStatus Trackerは生成しません。");
});

test("succeededケースではCodex Run Queue Status Trackerを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "succeededケース" }).click();

  await expect(page.getByRole("heading", { name: "Status Tracker判定: succeeded" })).toBeVisible();
  await expect(page.getByLabel("succeeded summary").getByText("Codex Run Queue Status Trackerを表示")).toBeVisible();
  const tracker = page.getByRole("article", { name: "status tracker" });
  await expect(tracker).toBeVisible();

  for (const field of [
    "source_intake_id",
    "queue_item_id",
    "run_status",
    "actual_results",
    "verification_summary",
    "browser_projects",
    "terminal_evidence",
    "screenshot_evidence",
    "playwright_report",
    "rollback_plan",
    "review_record_output",
    "learning_log_output",
    "aidd_spec_connections"
  ]) {
    await expect(tracker.getByRole("heading", { name: field, exact: true })).toBeVisible();
  }

  await expect(tracker).toContainText("MVP056-RUN-QUEUE-INTAKE-001");
  await expect(tracker).toContainText("MVP057-CODEX-RUN-STATUS-001");
  await expect(tracker).toContainText("succeeded");
  await expect(tracker).toContainText("assets/aidd-control-plane-mvp057-succeeded.png");
  await expect(tracker).toContainText("playwright-report/index.html");
  await expect(tracker).toContainText("Verification Evidence: connected");
  await expect(page.getByText("失敗理由はありません。")).toBeVisible();
});

test("failedケースでは失敗理由と修正指示を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "failedケース" }).click();

  await expect(page.getByRole("heading", { name: "Status Tracker判定: failed" })).toBeVisible();
  await expect(page.getByLabel("failed summary").getByText("Codex実行結果を失敗扱いにします")).toBeVisible();
  const reasons = page.getByLabel("failure reasons");

  for (const text of [
    "command失敗",
    "Firefox未実行",
    "doctor:aidd失敗",
    "危険なcommand",
    "rollback不足",
    "未サニタイズのlocal path/private host/private network URL",
    "再帰的削除、pipe経由のshell実行、no-sandbox相当",
    "Playwright projectsへchromium / firefox / webkit",
    "WORKSPACEまたはHOME表記へ置換"
  ]) {
    await expect(reasons).toContainText(text);
  }

  await expect(page.getByLabel("status tracker empty")).toContainText("succeededになるまでStatus Trackerは生成しません。");
  await expect(page.locator("pre")).toContainText("WORKSPACE/private-url");
  await expect(page.locator("pre")).not.toContainText("/Users/");
  await expect(page.locator("pre")).not.toContainText("127.0.0.1");
});

test("evidence_missingケースでは不足証跡と戻し先を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "evidence_missingケース" }).click();

  await expect(page.getByRole("heading", { name: "Status Tracker判定: evidence_missing" })).toBeVisible();
  await expect(page.getByLabel("evidence missing summary").getByText("実行成功後の証跡が不足しています")).toBeVisible();
  const warnings = page.getByLabel("evidence warnings");

  for (const text of [
    "terminal evidence不足",
    "empty/succeeded/failed/evidence_missing screenshot不足",
    "Playwright report不足",
    "Review Record出力不足",
    "Evidence Repair Deltaへ戻す",
    "Learning Logへ戻す"
  ]) {
    await expect(warnings).toContainText(text);
  }

  await expect(page.getByLabel("status tracker empty")).toContainText("succeededになるまでStatus Trackerは生成しません。");
});
