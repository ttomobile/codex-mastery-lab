import { expect, test } from "@playwright/test";

test.describe("Codex Run Queue Status Tracker画面", () => {
  test("emptyでは追跡中のCodex実行がないことを表示する", async ({ page }) => {
    await page.goto("/?state=empty");

    await expect(
      page.getByRole("heading", { name: "Codex Run Queue Status Tracker" })
    ).toBeVisible();
    await expect(page.getByTestId("queue-status")).toHaveText("empty");
    await expect(page.getByTestId("empty-panel")).toContainText("追跡中のCodex実行はありません");
  });

  test("waitingでは実行待ちに必要な項目を表示する", async ({ page }) => {
    await page.goto("/?state=waiting");

    await expect(page.getByTestId("queue-status")).toHaveText("waiting");
    await expect(page.getByTestId("waiting-summary")).toContainText("source intake id");
    await expect(page.getByTestId("waiting-summary")).toContainText("queue item id");
    await expect(page.getByTestId("waiting-summary")).toContainText("Codex command");
    await expect(page.getByTestId("waiting-summary")).toContainText("sandbox");
    await expect(page.getByRole("heading", { name: "required verification commands" })).toBeVisible();
    await expect(page.getByTestId("browser-list")).toContainText("Chromium");
    await expect(page.getByTestId("browser-list")).toContainText("Firefox");
    await expect(page.getByTestId("browser-list")).toContainText("WebKit");
    await expect(page.getByTestId("waiting-summary")).toContainText("rollback plan");
    await expect(page.getByRole("heading", { name: "AIDD-Spec接続" })).toBeVisible();
  });

  test("runningでは実行中の進捗と証跡保存先を表示する", async ({ page }) => {
    await page.goto("/?state=running");

    await expect(page.getByTestId("queue-status")).toHaveText("running");
    await expect(page.getByTestId("running-summary")).toContainText("started at");
    await expect(page.getByTestId("running-summary")).toContainText("operator");
    await expect(page.getByTestId("running-summary")).toContainText("current step");
    await expect(page.getByTestId("running-summary")).toContainText("duration");
    await expect(page.getByTestId("running-summary")).toContainText("evidence root");
    await expect(page.getByTestId("running-summary")).toContainText(
      "browser console collection status"
    );
  });

  test("succeededでは成功結果と証跡出力を表示する", async ({ page }) => {
    await page.goto("/?state=succeeded");

    await expect(page.getByTestId("queue-status")).toHaveText("succeeded");
    await expect(page.getByTestId("actual-results")).toContainText("actual results");
    await expect(page.getByTestId("command-results")).toContainText("command別exit code");
    await expect(page.getByTestId("browser-coverage")).toContainText("Chromium");
    await expect(page.getByTestId("browser-coverage")).toContainText("Firefox");
    await expect(page.getByTestId("browser-coverage")).toContainText("WebKit");
    await expect(page.getByRole("heading", { name: "terminal evidence" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "screenshot evidence" })).toBeVisible();
    await expect(page.getByTestId("playwright-report")).toContainText("playwright-report/index.html");
    await expect(page.getByRole("heading", { name: "Review Record output" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Learning Log output" })).toBeVisible();
  });

  test("failedではReview Findingとして失敗分類を表示する", async ({ page }) => {
    await page.goto("/?state=failed");

    await expect(page.getByTestId("queue-status")).toHaveText("failed");
    await expect(page.getByTestId("failed-findings")).toContainText("command失敗");
    await expect(page.getByTestId("failed-findings")).toContainText("Firefox未実行");
    await expect(page.getByTestId("failed-findings")).toContainText("doctor:aidd失敗");
    await expect(page.getByTestId("failed-findings")).toContainText("危険command");
    await expect(page.getByTestId("failed-findings")).toContainText("rollback不足");
    await expect(page.getByTestId("failed-findings")).toContainText("console error/warn");
    await expect(page.getByTestId("failed-findings")).toContainText(
      "local path/private network URL混入"
    );
  });

  test("evidence_missingでは不足証跡を表示する", async ({ page }) => {
    await page.goto("/?state=evidence_missing");

    await expect(page.getByTestId("queue-status")).toHaveText("evidence_missing");
    await expect(page.getByTestId("evidence-missing-findings")).toContainText(
      "terminal evidence不足"
    );
    await expect(page.getByTestId("evidence-missing-findings")).toContainText(
      "failure screenshot不足"
    );
    await expect(page.getByTestId("evidence-missing-findings")).toContainText(
      "browser console log不足"
    );
    await expect(page.getByTestId("evidence-missing-findings")).toContainText(
      "Playwright report不足"
    );
    await expect(page.getByTestId("evidence-missing-findings")).toContainText("掲載用GIF不足");
  });
});
