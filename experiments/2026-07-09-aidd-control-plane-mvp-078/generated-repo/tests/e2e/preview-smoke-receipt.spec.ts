import { expect, test } from "@playwright/test";

test.describe("Smoke Receipt Repair Action Planner の4状態", () => {
  test("emptyは修正Action未入力と必須フィールド名を表示する", async ({ page }) => {
    await page.goto("/?state=empty");
    await expect(page.getByRole("heading", { name: "Smoke Receipt Repair Action Planner" })).toBeVisible();
    await expect(page.getByLabel("Action判定")).toContainText("未入力");
    await expect(page.getByText("source receipt", { exact: true })).toBeVisible();
    await expect(page.getByText("broken URL", { exact: true })).toBeVisible();
    await expect(page.getByText("finding category", { exact: true })).toBeVisible();
    await expect(page.getByText("severity", { exact: true })).toBeVisible();
    await expect(page.getByText("lane", { exact: true })).toBeVisible();
    await expect(page.getByText("priority reason", { exact: true })).toBeVisible();
    await expect(page.getByText("execute_now action", { exact: true })).toBeVisible();
    await expect(page.getByText("next_increment", { exact: true })).toBeVisible();
    await expect(page.getByText("learning_log", { exact: true })).toBeVisible();
  });

  test("plannedは次の1回で実行する修正Actionとprompt previewの分離を表示する", async ({ page }) => {
    await page.goto("/?state=planned");
    await expect(page.getByLabel("Action判定")).toContainText("修正Action準備済み");
    await expect(page.getByText("次の1回で実行する修正Actionが準備できました")).toBeVisible();
    await expect(page.getByText("AI Task Packet patch")).toBeVisible();
    await expect(page.getByText("Codex prompt patch")).toBeVisible();
    await expect(page.getByLabel("Codex prompt preview")).toContainText("execute_nowのみ");
    await expect(page.getByLabel("Codex prompt preview")).not.toContainText("修正後、receipt一覧");
    await expect(page.getByLabel("Codex prompt preview")).not.toContainText("Preview生成登録漏れ");
    await expect(page.getByText("pnpm run doctor:aidd")).toBeVisible();
    await expect(page.getByText("pnpm run test:e2e")).toBeVisible();
    await expect(page.getByText("artifacts/screenshots/mvp078-terminal-evidence.png")).toBeVisible();
    await expect(page.getByText("AIDD-Spec v0.1")).toBeVisible();
    await expect(page.getByText("MVP077 Preview Smoke Receipt Binder")).toBeVisible();
  });

  test("failureは4種類のReview Finding YAML風カードを表示する", async ({ page }) => {
    await page.goto("/?state=failure");
    await expect(page.getByLabel("Action判定")).toContainText("Review Findingあり");
    await expect(page.getByRole("heading", { name: "Review Finding YAML" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "検証コマンド不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "証跡不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "rollback不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AIDD-Spec接続不足" })).toBeVisible();
    await expect(page.getByText("review_finding:").first()).toBeVisible();
  });

  test("blockedは実行前停止条件をすべて表示する", async ({ page }) => {
    await page.goto("/?state=blocked");
    await expect(page.getByLabel("Action判定")).toContainText("実行前停止");
    await expect(page.getByRole("heading", { name: "実行前停止" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "private URL" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "local path" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Firefox除外" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "terminal evidence不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "failure screenshot不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "execute_now以外のprompt混入" })).toBeVisible();
    await expect(page.getByLabel("Codex prompt preview")).toContainText("execute_now以外のprompt混入");
  });
});
