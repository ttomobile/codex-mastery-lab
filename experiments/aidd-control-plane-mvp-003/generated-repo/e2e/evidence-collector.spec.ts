import { expect, test } from "@playwright/test";

test("サンプル証跡を入れるとreadyでreadiness scoreが100になる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Evidence Collector Dashboard" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "必須コマンドログ" })).toBeVisible();
  await page.getByRole("button", { name: "サンプル証跡を入れる" }).click();

  await expect(page.getByTestId("readiness-score")).toHaveText("100");
  await expect(page.getByTestId("overall-status")).toHaveText("ready");
  await expect(page.getByTestId("missing-evidence")).toHaveText("不足証跡はありません。");
  await expect(page.getByTestId("preview-json")).toContainText('"command_logs"');
  await expect(page.getByTestId("preview-json")).toContainText('"screenshots"');
  await expect(page.getByTestId("preview-json")).toContainText('"reports"');
});

test("必須ログを消すとmissing_logsになる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "必須ログを消して失敗を見る" }).click();

  await expect(page.getByTestId("overall-status")).toHaveText("missing_logs");
  await expect(page.getByTestId("missing-evidence")).toContainText("pnpm run lint のCommand Log Collector入力");
  await expect(page.getByTestId("preview-json")).toContainText('"overall_status": "missing_logs"');
});

test("スクリーンショットを消すとmissing_screenshotsになる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "スクリーンショットを消して失敗を見る" }).click();

  await expect(page.getByTestId("overall-status")).toHaveText("missing_screenshots");
  await expect(page.getByTestId("missing-evidence")).toContainText("Screenshot Evidence Collector入力");
  await expect(page.getByTestId("preview-json")).toContainText('"overall_status": "missing_screenshots"');
});
