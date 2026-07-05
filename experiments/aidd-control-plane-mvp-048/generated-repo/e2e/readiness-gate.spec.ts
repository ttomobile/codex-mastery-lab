import { expect, test } from "@playwright/test";

test("empty状態ではOne-Run Execution Readiness Gateの必要入力を表示する", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "MVP 048: One-Run Execution Readiness Gate", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "One-Run Execution Readiness Gate: empty" })).toBeVisible();
  await expect(page.getByText("入力待ち")).toBeVisible();
  await expect(page.getByText("必要入力: source queue id / execute_now action")).toBeVisible();
  await expect(page.getByText("readyなexecute_now actionだけがここに入ります")).toBeVisible();
});

test("ready状態ではexecute_now 1件だけをCodex command previewへ表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "readyサンプル" }).click();

  await expect(page.getByRole("heading", { name: "One-Run Execution Readiness Gate: ready" })).toBeVisible();
  await expect(page.getByLabel("ready handoff").getByText("手渡し確認: execute_now 1件だけ")).toBeVisible();
  await expect(page.getByLabel("ready handoff").getByText("review-queue-mvp048-001")).toBeVisible();
  await expect(page.getByLabel("ready handoff").getByText("danger-full-access")).toBeVisible();

  const preview = page.getByLabel("Codex command preview");
  await expect(preview).toContainText("codex exec");
  await expect(preview).toContainText("pnpm run doctor:aidd");
  await expect(preview).not.toContainText("next_increment");
  await expect(preview).not.toContainText("learning_log");

  await expect(page.getByLabel("AIDD-Spec connections").getByText("AIDD-Spec v0.1")).toBeVisible();
  await expect(page.getByLabel("AIDD-Spec connections").getByText("Verification Evidence")).toBeVisible();
  await expect(page.getByLabel("AIDD-Spec connections").getByText("Review Record")).toBeVisible();
  await expect(page.getByLabel("AIDD-Spec connections").getByText("Learning Log")).toBeVisible();
});

test("blocked状態では不足と危険条件を日本語で表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "blockedサンプル" }).click();

  await expect(page.getByRole("heading", { name: "One-Run Execution Readiness Gate: blocked" })).toBeVisible();
  const findings = page.getByLabel("blocked findings");
  await expect(findings.getByText("source queue id不足")).toBeVisible();
  await expect(findings.getByText("execute_now以外のaction混入")).toBeVisible();
  await expect(findings.getByText("危険command")).toBeVisible();
  await expect(findings.getByText("sandbox mode不足")).toBeVisible();
  await expect(findings.getByText("required verification commands不足")).toBeVisible();
  await expect(findings.getByText("Firefox除外")).toBeVisible();
  await expect(findings.getByText("terminal evidence不足")).toBeVisible();
  await expect(findings.getByText("failure screenshot不足")).toBeVisible();
  await expect(findings.getByText("rollback stop condition不足")).toBeVisible();
  await expect(findings.getByText("local path / host / private network URL混入")).toBeVisible();
  await expect(findings.getByText("AIDD-Spec connection不足")).toBeVisible();
  await expect(page.getByText("readyなexecute_now actionだけがここに入ります")).toBeVisible();
});
