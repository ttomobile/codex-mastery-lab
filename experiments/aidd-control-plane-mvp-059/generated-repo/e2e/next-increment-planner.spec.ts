import { expect, test } from "@playwright/test";

test("未受信ケースではsource reviewなしを表示する", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP059")).toBeVisible();
  await expect(page.getByRole("heading", { name: "次インクリメントプランナー", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "計画判定: 未受信" })).toBeVisible();
  await expect(page.getByLabel("未受信の要約").getByText("レビュー元がありません")).toBeVisible();
  await expect(page.getByLabel("計画なし")).toContainText("readyになるまで次インクリメント計画は生成しません。");
});

test("準備完了ケースでは次の1インクリメントの全フィールドを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "準備完了" }).click();

  await expect(page.getByRole("heading", { name: "計画判定: 実行可能" })).toBeVisible();
  await expect(page.getByLabel("準備完了の要約").getByText("次の1インクリメントがready")).toBeVisible();
  const plan = page.getByRole("article", { name: "次インクリメント計画" });
  await expect(plan).toBeVisible();

  for (const field of [
    "source_review_id",
    "source_run_id",
    "recommended_increment",
    "priority_reason",
    "target_artifacts",
    "acceptance_criteria",
    "verification_commands",
    "required_evidence",
    "codex_prompt_draft",
    "rollback_condition",
    "note_article_angle",
    "learning_log_connection",
    "aidd_spec_connections"
  ]) {
    await expect(plan.getByRole("heading", { name: field, exact: true })).toBeVisible();
  }

  await expect(plan).toContainText("MVP058-REVIEW-READY-001");
  await expect(plan).toContainText("MVP058-CODEX-RUN-REVIEW-001");
  await expect(plan).toContainText("execute_now");
  await expect(plan).not.toContainText("plan_only");
  await expect(plan).not.toContainText("research_only");
  await expect(plan).toContainText("Chromium");
  await expect(plan).toContainText("Firefox");
  await expect(plan).toContainText("WebKit");
  await expect(plan).toContainText("Next Increment Planner: connected");
});

test("差し戻しケースではReview Finding形式で戻し先を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "差し戻し" }).click();

  await expect(page.getByRole("heading", { name: "計画判定: 差し戻し" })).toBeVisible();
  await expect(page.getByLabel("差し戻しの要約").getByText("標準Review Finding形式")).toBeVisible();
  const findings = page.getByLabel("Review Finding一覧");

  for (const text of [
    "source review不足",
    "priority不足",
    "3ブラウザE2E不足",
    "terminal/failure screenshot不足",
    "rollback不足",
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

  await expect(page.getByLabel("計画なし")).toContainText("readyになるまで次インクリメント計画は生成しません。");
  await expect(page.locator("pre")).toContainText("WORKSPACE/private-url");
  await expect(page.locator("pre")).not.toContainText("/Users/");
});

test("証跡不足ケースでは修復インクリメントを最優先で表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "証跡不足" }).click();

  await expect(page.getByRole("heading", { name: "計画判定: 証跡不足" })).toBeVisible();
  await expect(page.getByLabel("証跡不足の要約").getByText("証跡不足を最優先で修復")).toBeVisible();
  const repair = page.getByLabel("証跡修復インクリメント");

  for (const text of [
    "recommended_increment",
    "priority_reason",
    "target_artifacts",
    "acceptance_criteria",
    "verification_commands",
    "required_evidence",
    "codex_prompt_draft",
    "rollback_condition",
    "pnpm run capture:mvp059",
    "aidd-control-plane-mvp059-terminal-evidence.png",
    "evidence_missingへ戻す"
  ]) {
    await expect(repair).toContainText(text);
  }

  await expect(page.getByLabel("計画なし")).toContainText("readyになるまで次インクリメント計画は生成しません。");
});
