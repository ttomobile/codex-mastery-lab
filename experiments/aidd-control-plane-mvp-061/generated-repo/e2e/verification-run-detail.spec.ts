import { expect, test } from "@playwright/test";

test("キューなしケースではsource queue itemなしを表示する", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP061")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Repair Delta Generator", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "検証判定: キューなし" })).toBeVisible();
  await expect(page.getByLabel("キューなしの要約").getByText("source queue itemがありません")).toBeVisible();
  await expect(page.getByLabel("検証実行詳細なし")).toContainText("入力が十分になるまでVerification Run Detailは表示しません。");
});

test("delta生成ケースではVerification Run Detailから修理deltaを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "delta生成" }).click();

  await expect(page.getByRole("heading", { name: "検証判定: delta生成済み" })).toBeVisible();
  await expect(page.getByLabel("delta生成の要約").getByText("修理deltaを生成済み")).toBeVisible();
  const detail = page.getByRole("article", { name: "検証実行詳細", exact: true });
  const delta = page.getByRole("article", { name: "Evidence Repair Delta一覧", exact: true });

  for (const text of [
    "MVP061-QUEUE-EVIDENCE-REPAIR-001",
    "failed",
    "91f4c2a1b9d0e7f6a5c3b2a190fedcba9876543",
    "Chromium: 対象",
    "Firefox: 対象",
    "WebKit: 対象",
    "AIDD-Spec v0.1: connected",
    "AIDD Control Plane MVP v0.1: connected",
    "Verification Evidence: connected",
    "Review Record: connected",
    "Learning Log: connected",
    "AI Task Packet: connected"
  ]) {
    await expect(detail).toContainText(text);
  }

  for (const text of [
    "pnpm run test:e2e",
    "pnpm run test:e2e --project=firefox",
    "pnpm run doctor:aidd",
    "failed",
    "timeout",
    "evidence_missing",
    "ai_task_packet_delta",
    "codex_prompt_delta",
    "verification_command",
    "rollback_condition",
    "Learning Log note",
    "execute_now",
    "next_increment",
    "learning_log"
  ]) {
    await expect(delta).toContainText(text);
  }
});

test("差し戻しケースではReview Finding形式で不足とローカル情報混入をブロックする", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "差し戻し" }).click();

  await expect(page.getByRole("heading", { name: "検証判定: 差し戻し" })).toBeVisible();
  await expect(page.getByLabel("差し戻しの要約").getByText("標準Review Finding形式")).toBeVisible();
  const findings = page.getByLabel("Review Finding一覧");

  for (const text of [
    "source detail不足",
    "失敗分類不足",
    "修正指示不足",
    "Firefox除外",
    "terminal/failure screenshot不足",
    "local path / host / private network URL混入",
    "category",
    "finding",
    "severity",
    "observed_by",
    "ideal_state",
    "fix_instruction",
    "ai_task_packet_delta",
    "codex_prompt_delta",
    "verification_command",
    "WORKSPACEまたはHOME表記へ置換"
  ]) {
    await expect(findings).toContainText(text);
  }

  await expect(page.getByLabel("検証実行詳細なし")).toContainText("入力が十分になるまでVerification Run Detailは表示しません。");
  await expect(page.locator("pre")).toContainText("WORKSPACE/private-url");
  await expect(page.locator("pre")).not.toContainText("/Users/");
  await expect(page.locator("pre")).not.toContainText("10.0.0.61");
  await expect(page.locator("pre")).not.toContainText("mvp061-workstation.local");
});

test("repair_neededケースでは次の1回に入れるdeltaを絞る", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "次の1回" }).click();

  await expect(page.getByRole("heading", { name: "検証判定: 修復絞り込み" })).toBeVisible();
  await expect(page.getByLabel("修復候補の要約").getByText("次の1回に絞り込み")).toBeVisible();
  const delta = page.getByLabel("repair_neededのdelta分類");

  for (const text of [
    "execute_now",
    "next_increment",
    "learning_log",
    "次の1回に入れるdelta",
    "pnpm run test:e2e",
    "今回は保留"
  ]) {
    await expect(delta).toContainText(text);
  }

  await expect(delta).not.toContainText("pnpm run test:e2e --project=firefox");
});
