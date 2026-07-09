import { expect, test } from "@playwright/test";

test.describe("Run Queue Dispatch Receipt の5状態", () => {
  test("emptyはqueue item未選択と必須フィールド名を表示する", async ({ page }) => {
    await page.goto("/?state=empty");
    await expect(page.getByRole("heading", { name: "Run Queue Dispatch Receipt" })).toBeVisible();
    await expect(page.getByLabel("Dispatch判定")).toContainText("未選択");
    await expect(page.getByText("queue item", { exact: true })).toBeVisible();
    await expect(page.getByText("execute_now summary", { exact: true })).toBeVisible();
    await expect(page.getByText("dispatch command", { exact: true })).toBeVisible();
  });

  test("readyはexecute_nowだけのdispatch payloadとReceipt発行可能を表示する", async ({ page }) => {
    await page.goto("/?state=ready");
    await expect(page.getByLabel("Dispatch判定")).toContainText("Dispatch可能");
    await expect(page.getByText("Dispatch Receiptを発行できます")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dispatch Payload" })).toBeVisible();
    await expect(page.getByLabel("Dispatch payload preview")).toContainText("execute_nowのみ");
    await expect(page.getByLabel("Dispatch payload preview")).not.toContainText("次回: Dispatch履歴");
    await expect(page.getByText("verification gate")).toBeVisible();
    await expect(page.getByText("evidence gate")).toBeVisible();
    await expect(page.getByText("rollback gate")).toBeVisible();
    await expect(page.getByText("sanitize gate")).toBeVisible();
    await expect(page.getByText("pnpm run doctor:aidd")).toBeVisible();
    await expect(page.getByText("artifacts/screenshots/mvp080-terminal-evidence.png")).toBeVisible();
    await expect(page.getByText("AIDD-Spec v0.1")).toBeVisible();
    await expect(page.getByText("MVP079 Repair Action Run Queue Intake")).toBeVisible();
  });

  test("runningは実行中の証跡収集とpending evidenceを表示する", async ({ page }) => {
    await page.goto("/?state=running");
    await expect(page.getByLabel("Dispatch判定")).toContainText("実行中");
    await expect(page.getByText("実行中の証跡を収集中")).toBeVisible();
    await expect(page.getByText("terminal evidence PNG生成待ち")).toBeVisible();
  });

  test("failureは不足ゲートとReview Finding YAML風カードを表示する", async ({ page }) => {
    await page.goto("/?state=failure");
    await expect(page.getByLabel("Dispatch判定")).toContainText("Review Findingあり");
    await expect(page.getByRole("heading", { name: "Review Finding YAML" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "dispatch command失敗" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "証跡ゲート不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "rollbackゲート発火" })).toBeVisible();
    await expect(page.getByText("review_finding:").first()).toBeVisible();
  });

  test("blockedはDispatch停止条件と破壊的cleanup要求を表示する", async ({ page }) => {
    await page.goto("/?state=blocked");
    await expect(page.getByLabel("Dispatch判定")).toContainText("Dispatch停止");
    await expect(page.getByRole("heading", { name: "Dispatch停止" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "private URL" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "local path" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Firefox除外" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "terminal evidence不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "failure screenshot不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "next_increment混入" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "learning_log混入" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "破壊的cleanup要求" })).toBeVisible();
    await expect(page.getByLabel("Dispatch payload preview")).toContainText("execute_now以外のpayload混入");
    await expect(page.getByText("rm -rf .next test-results playwright-report")).toBeVisible();
  });
});
