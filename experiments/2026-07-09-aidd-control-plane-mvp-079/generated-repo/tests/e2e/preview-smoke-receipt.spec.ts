import { expect, test } from "@playwright/test";

test.describe("Repair Action Run Queue Intake の4状態", () => {
  test("emptyはRepair Action未選択と必須フィールド名を表示する", async ({ page }) => {
    await page.goto("/?state=empty");
    await expect(page.getByRole("heading", { name: "Repair Action Run Queue Intake" })).toBeVisible();
    await expect(page.getByLabel("Queue判定")).toContainText("未選択");
    await expect(page.getByText("source repair action", { exact: true })).toBeVisible();
    await expect(page.getByText("execute_now summary", { exact: true })).toBeVisible();
    await expect(page.getByText("excluded next_increment", { exact: true })).toBeVisible();
    await expect(page.getByText("excluded learning_log", { exact: true })).toBeVisible();
  });

  test("readyはexecute_nowだけのqueue payloadとゲート通過を表示する", async ({ page }) => {
    await page.goto("/?state=ready");
    await expect(page.getByLabel("Queue判定")).toContainText("キュー投入可能");
    await expect(page.getByText("実行キュー投入前チェックを通過しました")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Queue Payload" })).toBeVisible();
    await expect(page.getByLabel("Queue payload preview")).toContainText("execute_nowのみ");
    await expect(page.getByLabel("Queue payload preview")).not.toContainText("複数Repair Actionの優先順位付け");
    await expect(page.getByLabel("Queue payload preview")).not.toContainText("Learning Logは別欄");
    await expect(page.getByText("verification gate")).toBeVisible();
    await expect(page.getByText("evidence gate")).toBeVisible();
    await expect(page.getByText("rollback gate")).toBeVisible();
    await expect(page.getByText("sanitize gate")).toBeVisible();
    await expect(page.getByText("pnpm run doctor:aidd")).toBeVisible();
    await expect(page.getByText("artifacts/screenshots/mvp079-terminal-evidence.png")).toBeVisible();
    await expect(page.getByText("AIDD-Spec v0.1")).toBeVisible();
    await expect(page.getByText("MVP078 Smoke Receipt Repair Action Planner")).toBeVisible();
  });

  test("failureは不足ゲートとReview Finding YAML風カードを表示する", async ({ page }) => {
    await page.goto("/?state=failure");
    await expect(page.getByLabel("Queue判定")).toContainText("Review Findingあり");
    await expect(page.getByRole("heading", { name: "Review Finding YAML" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "検証ゲート不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "証跡ゲート不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "rollbackゲート不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AIDD-Spec接続不足" })).toBeVisible();
    await expect(page.getByText("review_finding:").first()).toBeVisible();
  });

  test("blockedは実行前停止条件と破壊的cleanup要求を表示する", async ({ page }) => {
    await page.goto("/?state=blocked");
    await expect(page.getByLabel("Queue判定")).toContainText("実行前停止");
    await expect(page.getByRole("heading", { name: "実行前停止" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "private URL" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "local path" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Firefox除外" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "terminal evidence不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "failure screenshot不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "next_increment混入" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "learning_log混入" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "破壊的cleanup要求" })).toBeVisible();
    await expect(page.getByLabel("Queue payload preview")).toContainText("execute_now以外のpayload混入");
    await expect(page.getByText("rm -rf .next test-results playwright-report")).toBeVisible();
  });
});
