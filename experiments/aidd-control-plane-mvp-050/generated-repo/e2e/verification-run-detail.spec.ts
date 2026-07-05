import { expect, test } from "@playwright/test";

test("empty状態ではfinding未読込とpacketへ戻す材料不足を表示する", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP050")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Repair Delta Generator", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Repair Delta状態: empty" })).toBeVisible();
  await expect(page.getByLabel("empty state").getByText("finding未読込")).toBeVisible();
  await expect(page.getByText("次回AI Task Packetへ戻す材料がない")).toBeVisible();
});

test("ready状態では3つのrepair delta候補と必須項目を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "readyサンプル" }).click();

  await expect(page.getByRole("heading", { name: "Repair Delta状態: ready" })).toBeVisible();
  await expect(page.getByLabel("ready summary").getByText("delta候補を3件生成済み")).toBeVisible();

  const candidates = page.getByLabel("repair delta candidates");
  for (const findingId of ["VRD-050-FX-TIMEOUT", "VRD-050-SHOT-MISSING", "VRD-050-MOCK-HEALTH"]) {
    await expect(candidates.getByText(findingId)).toBeVisible();
  }
  for (const category of ["failed", "evidence_missing", "timeout"]) {
    await expect(candidates.getByText(category, { exact: true })).toBeVisible();
  }
  for (const label of [
    "AI Task Packet delta",
    "Codex prompt delta",
    "verification command",
    "rollback condition",
    "Learning Log案",
    "AIDD-Spec接続"
  ]) {
    await expect(candidates.getByText(label).first()).toBeVisible();
  }
  await expect(candidates.getByText("pnpm run test:e2e", { exact: true })).toBeVisible();
  await expect(candidates.getByText("pnpm run capture:mvp050", { exact: true })).toBeVisible();
  await expect(candidates.getByText("pnpm run doctor:aidd", { exact: true })).toBeVisible();
});

test("failure状態ではReview Finding draft風に不足と公開前ブロック理由を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "failureサンプル" }).click();

  await expect(page.getByRole("heading", { name: "Repair Delta状態: failure" })).toBeVisible();
  const findings = page.getByLabel("failure findings");
  for (const issue of [
    "finding ID不足",
    "失敗分類不足",
    "優先度不足",
    "AI Task Packet delta不足",
    "Codex prompt delta不足",
    "検証command不足",
    "rollback条件不足",
    "Learning Log不足",
    "AIDD-Spec connection不足",
    "local path / host / private network URL混入"
  ]) {
    await expect(findings.getByText(issue)).toBeVisible();
  }
  await expect(findings.getByText("公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています")).toBeVisible();
});
