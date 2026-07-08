import { expect, test } from "@playwright/test";

test.describe("Smoke Action Run Queue Intake画面", () => {
  test("emptyからqueuedへ切り替え、Run Queue投入項目を表示する", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Smoke Action Run Queue Intake" })
    ).toBeVisible();
    await expect(page.getByTestId("empty-panel")).toContainText(
      "投入待ちのSmoke Actionはありません"
    );

    await page.getByRole("button", { name: "queued" }).click();

    await expect(page.getByTestId("queue-status")).toHaveText("queued");
    await expect(page.getByTestId("queue-summary")).toContainText("source smoke action id");
    await expect(page.getByTestId("queue-summary")).toContainText("queue item id");
    await expect(page.getByTestId("queue-summary")).toContainText("Codex command");
    await expect(page.getByTestId("queue-summary")).toContainText("sandbox mode");
    await expect(page.getByRole("heading", { name: "required verification commands" })).toBeVisible();
    await expect(page.getByTestId("browser-list")).toContainText("Chromium");
    await expect(page.getByTestId("browser-list")).toContainText("Firefox");
    await expect(page.getByTestId("browser-list")).toContainText("WebKit");
    await expect(page.getByRole("heading", { name: "required evidence" })).toBeVisible();
    await expect(page.getByTestId("queue-summary")).toContainText("rollback plan");
    await expect(page.getByText("AIDD-Spec接続")).toBeVisible();
    await expect(page.getByTestId("payload-panel")).toContainText("Run Queue payload");
  });

  test("queuedではpayloadとCodex command previewにexecute_nowだけを入れる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "queued" }).click();

    const payload = page.getByTestId("run-queue-payload");
    const commandPreview = page.getByTestId("codex-command-preview");

    await expect(payload).toContainText('"execute_now"');
    await expect(commandPreview).toContainText('"execute_now"');
    await expect(payload).not.toContainText("next_increment");
    await expect(payload).not.toContainText("learning_log");
    await expect(commandPreview).not.toContainText("next_increment");
    await expect(commandPreview).not.toContainText("learning_log");
  });

  test("rejectedではRun Queue投入拒否理由を表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "rejected" }).click();

    await expect(page.getByTestId("queue-status")).toHaveText("rejected");
    await expect(page.getByTestId("rejected-panel")).toContainText("未export action");
    await expect(page.getByTestId("rejected-panel")).toContainText("execute_now以外混入");
    await expect(page.getByTestId("rejected-panel")).toContainText("危険command");
    await expect(page.getByTestId("rejected-panel")).toContainText("sandbox不足");
    await expect(page.getByTestId("rejected-panel")).toContainText("Firefox除外");
    await expect(page.getByTestId("rejected-panel")).toContainText(
      "local path/private network URL混入"
    );
  });

  test("evidence_missingでは証跡不足を表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "evidence_missing" }).click();

    await expect(page.getByTestId("queue-status")).toHaveText("evidence_missing");
    await expect(page.getByTestId("evidence-missing-panel")).toContainText(
      "terminal evidence不足"
    );
    await expect(page.getByTestId("evidence-missing-panel")).toContainText(
      "failure screenshot不足"
    );
    await expect(page.getByTestId("evidence-missing-panel")).toContainText(
      "Playwright report不足"
    );
  });
});
