import { expect, test } from "@playwright/test";

test.describe("AIDD Control Plane MVP", () => {
  test("主要ワークフローでPacket PreviewとRunbookが更新される", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Project Brief Builder" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI Task Packet Builder" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Packet Preview" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Agent Runbook" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Review Dashboard" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Learning Log" })).toBeVisible();

    await expect(page.getByText("入力不足あり")).toBeVisible();
    await page.getByLabel("プロジェクト名").fill("AIDD Control Plane MVP");
    await page.getByLabel("解く課題").fill("AI実装前の入力と検証証跡を一つの流れで作りたい");
    await page.getByLabel("非ゴール").fill("ログイン/ユーザー管理は作らない\n外部API送信はしない\nDB接続はしない");
    await page.getByLabel("成功条件").fill("AI Task Packetを生成できる\nRunbookを生成できる");
    await page.getByRole("button", { name: "標準gateを入れる" }).click();
    await page.getByRole("button", { name: "Packet生成" }).click();

    await expect(page.getByText("L3準備OK")).toBeVisible();
    await expect(page.getByText('name: "AIDD Control Plane MVP"')).toBeVisible();
    await expect(page.getByText("codex exec")).toBeVisible();

    await page.getByLabel("findings").fill("状態切替のE2Eを追加した");
    await page.getByLabel("spec updates needed").fill("doctor:aiddで必須UI tokenを検査する");
    await expect(page.getByText("Review findings: 1件")).toBeVisible();
    await expect(page.getByText("Learning updates: 1件")).toBeVisible();
  });

  test("状態切替でfailure contractの表示を確認できる", async ({ page }) => {
    await page.goto("/");

    for (const mode of ["empty", "loading", "success", "error", "offline", "timeout"]) {
      await page.getByRole("button", { name: mode }).click();
      await expect(page.getByRole("complementary").getByText(`現在状態: ${mode}`)).toBeVisible();
    }

    await expect(page.getByText("外部API未接続")).toBeVisible();
    await expect(page.getByText("ログイン不要")).toBeVisible();
    await expect(page.getByText("課金機能は非ゴール")).toBeVisible();
  });
});
