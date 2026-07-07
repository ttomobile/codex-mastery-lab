import { expect, test } from "@playwright/test";

test("emptyケースではDecision Ledgerを生成しない", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP055")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Handoff Decision Ledger", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ハンドオフ判断: empty" })).toBeVisible();
  await expect(page.getByLabel("empty summary").getByText("判断対象のハンドオフレシートがありません")).toBeVisible();
  await expect(page.getByLabel("handoff decision ledger empty")).toContainText("approvedになるまでHandoff Decision Ledgerは生成しません。");
});

test("approvedケースではHandoff Decision Ledgerを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "approvedケース" }).click();

  await expect(page.getByRole("heading", { name: "ハンドオフ判断: approved" })).toBeVisible();
  await expect(page.getByLabel("approved summary").getByText("Handoff Decision Ledgerを生成")).toBeVisible();
  const ledger = page.getByLabel("handoff decision ledger");
  await expect(ledger).toBeVisible();

  for (const field of [
    "source_handoff_receipt_id",
    "decision",
    "decision_owner",
    "decision_reason",
    "approved_execute_now",
    "codex_command_draft",
    "verification_commands",
    "required_evidence",
    "rollback_condition",
    "aidd_spec_connections"
  ]) {
    await expect(ledger.getByRole("heading", { name: field, exact: true })).toBeVisible();
  }

  await expect(ledger).toContainText("MVP054-HANDOFF-RECEIPT-READY-2026-07-07");
  await expect(ledger).toContainText("assets/aidd-control-plane-mvp055-approved.png");
  await expect(ledger).toContainText("MVP055 Handoff Decision Ledger: connected");
  await expect(page.getByText("公開前ブロックはありません。")).toBeVisible();
});

test("heldケースでは保留内容を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "heldケース" }).click();

  await expect(page.getByRole("heading", { name: "ハンドオフ判断: held" })).toBeVisible();
  await expect(page.getByLabel("held summary").getByText("追加証跡待ちです")).toBeVisible();
  const held = page.getByLabel("held decision");

  for (const field of ["hold_reason", "additional_evidence_needed", "next_review_condition", "learning_log_return"]) {
    await expect(held.getByRole("heading", { name: field, exact: true })).toBeVisible();
  }

  await expect(held).toContainText("WebKit証跡とterminal-evidence画像が未到着");
  await expect(held).toContainText("assets/aidd-control-plane-mvp055-terminal-evidence.png");
  await expect(page.getByLabel("handoff decision ledger empty")).toContainText("approvedになるまでHandoff Decision Ledgerは生成しません。");
});

test("blockedケースでは公開前ブロック6種類と修正指示を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "blockedケース" }).click();

  await expect(page.getByRole("heading", { name: "ハンドオフ判断: blocked" })).toBeVisible();
  await expect(page.getByLabel("blocked summary").getByText("公開前ブロックがあります")).toBeVisible();
  const blocks = page.getByLabel("publish blocks");

  for (const text of [
    "未承認",
    "理由不足",
    "rollback不足",
    "Chromium/Firefox/WebKit不足",
    "evidence不足",
    "未サニタイズのlocal path/private host/private network URL",
    "approvalStateをapprovedへ進める",
    "WORKSPACEまたはHOME表記へ置換"
  ]) {
    await expect(blocks).toContainText(text);
  }

  await expect(page.getByLabel("handoff decision ledger empty")).toContainText("approvedになるまでHandoff Decision Ledgerは生成しません。");
  await expect(page.locator("pre")).toContainText("WORKSPACE/private-url");
  await expect(page.locator("pre")).not.toContainText("/Users/");
  await expect(page.locator("pre")).not.toContainText("127.0.0.1");
});
