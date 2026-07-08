import { expect, test } from "@playwright/test";

test.describe("Smoke Finding Action Queue画面", () => {
  test("emptyからqueuedへ切り替え、finding詳細とpatchを表示する", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Smoke Finding Action Queue" })).toBeVisible();
    await expect(page.getByTestId("empty-panel")).toContainText("Smoke Findingはありません");

    await page.getByRole("button", { name: "queued" }).click();

    await expect(page.getByTestId("queue-status")).toHaveText("queued");
    await expect(page.getByTestId("finding-summary")).toContainText("broken URL");
    await expect(page.getByTestId("finding-summary")).toContainText("HTTP status");
    await expect(page.getByTestId("finding-summary")).toContainText("byte size");
    await expect(page.getByTestId("finding-summary")).toContainText("content type");
    await expect(page.getByTestId("finding-summary")).toContainText("finding category");
    await expect(page.getByTestId("finding-summary")).toContainText("severity");
    await expect(page.getByTestId("finding-summary")).toContainText("lane");
    await expect(page.getByTestId("finding-summary")).toContainText("priority reason");
    await expect(page.getByText("AI Task Packet patch")).toBeVisible();
    await expect(page.getByText("Codex prompt patch")).toBeVisible();
    await expect(page.getByRole("heading", { name: "verification commands" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "required evidence" })).toBeVisible();
    await expect(page.getByTestId("finding-summary")).toContainText("rollback condition");
    await expect(page.getByText("AIDD-Spec接続")).toBeVisible();
  });

  test("exportedではexecute_nowだけをCodex prompt previewへ入れる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "exported" }).click();

    await expect(page.getByTestId("queue-status")).toHaveText("exported");
    const preview = page.getByTestId("codex-prompt-preview");
    await expect(preview).toContainText("execute_now 1: broken URLの参照元と生成元を特定する");
    await expect(preview).toContainText("execute_now 3: terminal evidenceとスクリーンショットをartifactsへ保存する");
    await expect(preview).not.toContainText("context:");
    await expect(preview).not.toContainText("defer:");
    await expect(preview).not.toContainText("外部監視SaaS連携");
  });

  test("blockedではAction Queueの停止条件を表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "blocked" }).click();

    await expect(page.getByTestId("queue-status")).toHaveText("blocked");
    await expect(page.getByTestId("blocked-panel")).toContainText("private URL混入");
    await expect(page.getByTestId("blocked-panel")).toContainText("Firefox未確認");
    await expect(page.getByTestId("blocked-panel")).toContainText("terminal evidence不足");
    await expect(page.getByTestId("blocked-panel")).toContainText("AIDD-Spec接続不足");
    await expect(page.getByTestId("blocked-panel")).toContainText("execute_now以外のprompt混入");
  });
});
