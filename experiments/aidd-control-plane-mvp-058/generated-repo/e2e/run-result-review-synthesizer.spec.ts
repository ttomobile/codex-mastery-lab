import { expect, test } from "@playwright/test";

test("emptyケースではRun Result Review Recordを生成しない", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP058")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Run Result Review Synthesizer", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Run Result Review判定: empty" })).toBeVisible();
  await expect(page.getByLabel("empty summary").getByText("source_run_idがありません")).toBeVisible();
  await expect(page.getByLabel("review empty")).toContainText("validになるまでRun Result Review Recordは生成しません。");
});

test("validケースではRun Result Review Recordの全フィールドを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "validケース" }).click();

  await expect(page.getByRole("heading", { name: "Run Result Review判定: valid" })).toBeVisible();
  await expect(page.getByLabel("valid summary").getByText("Run Result Reviewを表示")).toBeVisible();
  const record = page.getByRole("article", { name: "run result review" });
  await expect(record).toBeVisible();

  for (const field of [
    "source_run_id",
    "outcome",
    "score",
    "score_reason",
    "terminal_evidence",
    "screenshot_evidence",
    "browser_coverage",
    "doctor_aidd",
    "rollback",
    "privacy_scan",
    "review_findings",
    "needed_upstream_info",
    "standard_update",
    "ai_task_packet_delta",
    "codex_prompt_delta",
    "verification_command",
    "learning_log",
    "aidd_spec_connections"
  ]) {
    await expect(record.getByRole("heading", { name: field, exact: true })).toBeVisible();
  }

  await expect(record).toContainText("MVP057-CODEX-RUN-STATUS-001");
  await expect(record).toContainText("succeeded");
  await expect(record).toContainText("assets/aidd-control-plane-mvp058-valid.png");
  await expect(record).toContainText("Chromium");
  await expect(record).toContainText("Firefox");
  await expect(record).toContainText("WebKit");
  await expect(record).toContainText("doctor:aidd");
  await expect(record).toContainText("Run Result Review Synthesizer: connected");
});

test("failureケースではReview Finding形式で失敗を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "failureケース" }).click();

  await expect(page.getByRole("heading", { name: "Run Result Review判定: failure" })).toBeVisible();
  await expect(page.getByLabel("failure summary").getByText("標準Review Findingへ変換")).toBeVisible();
  const findings = page.getByLabel("review findings");

  for (const text of [
    "command失敗",
    "Firefox未実行",
    "doctor:aidd失敗",
    "危険command",
    "rollback不足",
    "local path/private host/private network URL混入",
    "category",
    "finding",
    "severity",
    "observed_by",
    "ideal_state",
    "fix_instruction",
    "needed_upstream_info",
    "standard_update",
    "codex_prompt_delta",
    "verification",
    "rm -rf、curl | sh、no-sandbox相当",
    "Chromium / Firefox / WebKit",
    "WORKSPACEまたはHOME表記へ置換"
  ]) {
    await expect(findings).toContainText(text);
  }

  await expect(page.getByLabel("review empty")).toContainText("validになるまでRun Result Review Recordは生成しません。");
  await expect(page.locator("pre")).toContainText("WORKSPACE/private-url");
  await expect(page.locator("pre")).not.toContainText("/Users/");
  await expect(page.locator("pre")).not.toContainText("127.0.0.1");
});

test("evidence_missingケースでは不足証跡をRepair DeltaとLearning Logへ戻す", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "evidence_missingケース" }).click();

  await expect(page.getByRole("heading", { name: "Run Result Review判定: evidence_missing" })).toBeVisible();
  await expect(page.getByLabel("evidence missing summary").getByText("成功結果でも証跡不足")).toBeVisible();
  const deltas = page.getByLabel("evidence repair deltas");

  for (const text of [
    "terminal evidence",
    "empty-valid-failure screenshot",
    "Playwright report",
    "Review Record出力",
    "Evidence Repair Deltaへ戻す",
    "Learning Logへ戻す",
    "成功結果でも証跡不足ならEvidence Repair Deltaへ戻し"
  ]) {
    await expect(deltas).toContainText(text);
  }

  await expect(page.getByLabel("review empty")).toContainText("validになるまでRun Result Review Recordは生成しません。");
});
