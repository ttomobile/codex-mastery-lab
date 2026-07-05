import { expect, test } from "@playwright/test";

test("empty状態ではrepair delta未選択とpacketへ進めない理由を表示する", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP051")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Repair Delta Priority Decision Workspace", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Priority Decision状態: empty" })).toBeVisible();
  await expect(page.getByLabel("empty state").getByText("repair delta未選択")).toBeVisible();
  await expect(page.getByLabel("empty state").getByText("次回AI Task Packetへ進めません")).toBeVisible();
});

test("ready状態では採用済みdeltaだけをnext packet previewへ入れる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "readyサンプル" }).click();

  await expect(page.getByRole("heading", { name: "Priority Decision状態: ready" })).toBeVisible();
  await expect(page.getByLabel("ready summary").getByText("採用済みdeltaを1件だけ次回へ進める")).toBeVisible();

  const decisions = page.getByLabel("repair delta decisions");
  for (const deltaId of ["RD-050-FX-TIMEOUT", "RD-050-SHOT-MISSING", "RD-050-MOCK-HEALTH"]) {
    await expect(decisions.getByText(deltaId)).toBeVisible();
  }
  for (const decision of ["採用", "保留", "却下"]) {
    await expect(decisions.getByText(decision, { exact: true })).toBeVisible();
  }
  for (const label of [
    "priority reason",
    "decision owner",
    "review evidence",
    "rollback condition",
    "Codex prompt patch",
    "Verification Evidence接続",
    "Review Record接続",
    "Learning Log接続",
    "AIDD-Spec接続"
  ]) {
    await expect(decisions.getByText(label).first()).toBeVisible();
  }
  await expect(page.getByLabel("next packet preview").getByText("Acceptance Criteria / Verification Commands")).toBeVisible();
  await expect(page.locator("pre").getByText("execute_now: Firefox timeout")).toBeVisible();
  await expect(page.getByText("chromium / firefox / webkit").first()).toBeVisible();
});

test("failure状態では未判断と未採用delta混入と公開前ブロックを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "failureサンプル" }).click();

  await expect(page.getByRole("heading", { name: "Priority Decision状態: failure" })).toBeVisible();
  const findings = page.getByLabel("failure findings");
  for (const issue of [
    "未判断",
    "理由不足",
    "証跡不足",
    "rollback不足",
    "Firefox除外",
    "未採用delta混入",
    "AIDD-Spec接続不足",
    "local path / host / private network URL混入"
  ]) {
    await expect(findings.getByText(issue)).toBeVisible();
  }
  await expect(findings.getByText("公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています")).toBeVisible();
});
