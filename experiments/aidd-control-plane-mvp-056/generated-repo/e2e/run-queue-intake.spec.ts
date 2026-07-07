import { expect, test } from "@playwright/test";

test("emptyケースではRun Queue Intakeを生成しない", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP056")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Run Queue Intake", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Run Queue Intake判定: empty" })).toBeVisible();
  await expect(page.getByLabel("empty summary").getByText("判断対象のDecision Ledgerがありません")).toBeVisible();
  await expect(page.getByLabel("run queue intake empty")).toContainText("queuedになるまでRun Queue Intakeは生成しません。");
});

test("queuedケースではRun Queue Intakeを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "queuedケース" }).click();

  await expect(page.getByRole("heading", { name: "Run Queue Intake判定: queued" })).toBeVisible();
  await expect(page.getByLabel("queued summary").getByText("Run Queue Intakeを生成")).toBeVisible();
  const intake = page.getByRole("article", { name: "run queue intake" });
  await expect(intake).toBeVisible();

  for (const field of [
    "source_decision_id",
    "queue_item_id",
    "run_status",
    "codex_command",
    "sandbox_mode",
    "required_verification_commands",
    "browser_projects",
    "required_evidence",
    "rollback_plan",
    "aidd_spec_connections"
  ]) {
    await expect(intake.getByRole("heading", { name: field, exact: true })).toBeVisible();
  }

  await expect(intake).toContainText("MVP055-HANDOFF-DECISION-APPROVED-2026-07-07");
  await expect(intake).toContainText("MVP056-RUN-QUEUE-INTAKE-001");
  await expect(intake).toContainText("ready_for_codex_run_queue");
  await expect(intake).toContainText("assets/aidd-control-plane-mvp056-queued.png");
  await expect(intake).toContainText("Codex Run Queue: connected");
  await expect(page.getByText("拒否理由はありません。")).toBeVisible();
});

test("rejectedケースでは拒否理由と修正指示を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "rejectedケース" }).click();

  await expect(page.getByRole("heading", { name: "Run Queue Intake判定: rejected" })).toBeVisible();
  await expect(page.getByLabel("rejected summary").getByText("Codex Run Queueへ投入しません")).toBeVisible();
  const reasons = page.getByLabel("rejection reasons");

  for (const text of [
    "held / blocked / unapproved decision",
    "危険なcommand",
    "sandbox不足",
    "Firefox除外",
    "浅い検証",
    "rollback不足",
    "未サニタイズのlocal path/private host/private network URL",
    "Review Recordでapproved判断へ進め",
    "Playwright projectsへchromium / firefox / webkit",
    "WORKSPACEまたはHOME表記へ置換"
  ]) {
    await expect(reasons).toContainText(text);
  }

  await expect(page.getByLabel("run queue intake empty")).toContainText("queuedになるまでRun Queue Intakeは生成しません。");
  await expect(page.locator("pre")).toContainText("WORKSPACE/private-url");
  await expect(page.locator("pre")).not.toContainText("/Users/");
  await expect(page.locator("pre")).not.toContainText("127.0.0.1");
});

test("evidence_missingケースでは不足証跡と戻し先を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "evidence_missingケース" }).click();

  await expect(page.getByRole("heading", { name: "Run Queue Intake判定: evidence_missing" })).toBeVisible();
  await expect(page.getByLabel("evidence missing summary").getByText("approved判断の証跡が不足しています")).toBeVisible();
  const warnings = page.getByLabel("evidence warnings");

  for (const text of [
    "terminal evidence不足",
    "empty/queued/rejected/evidence_missing screenshot不足",
    "Playwright report不足",
    "Review Recordへ戻す",
    "Learning Logへ戻す"
  ]) {
    await expect(warnings).toContainText(text);
  }

  await expect(page.getByLabel("run queue intake empty")).toContainText("queuedになるまでRun Queue Intakeは生成しません。");
});
