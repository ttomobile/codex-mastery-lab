import { expect, test } from "@playwright/test";

const states = ["empty", "planned", "failure", "blocked"] as const;

for (const state of states) {
  test(`MVP082 ${state} 状態を表示する`, async ({ page }) => {
    await page.goto(`/?state=${state}`);
    await expect(page.getByText("AIDD Control Plane / MVP082")).toBeVisible();
    await expect(page.getByRole("link", { name: state })).toBeVisible();
    await expect(page.getByText("Smoke Receipt Repair Summary")).toBeVisible();
  });
}

test("plannedではexecute_nowだけをpromptへ入れる", async ({ page }) => {
  await page.goto("/?state=planned");
  await expect(page.getByText("execute_nowのみ")).toBeVisible();
  await expect(page.getByText("preview/assets/mvp082-terminal-evidence.png").first()).toBeVisible();
  await expect(page.getByText("next_increment / learning_log 分離")).toBeVisible();
});

test("failureではHTTP失敗をReview Findingへ変換する", async ({ page }) => {
  await page.goto("/?state=failure");
  await expect(page.getByText("HTTP 404 / 0 byte")).toBeVisible();
  await expect(page.getByText("failure screenshot不足")).toBeVisible();
  await expect(page.getByText("review_finding:")).toBeVisible();
});

test("blockedでは公開前に止める条件を表示する", async ({ page }) => {
  await page.goto("/?state=blocked");
  await expect(page.getByText("private URL混入")).toBeVisible();
  await expect(page.getByText("local path混入")).toBeVisible();
  await expect(page.getByText("Firefox除外", { exact: true })).toBeVisible();
  await expect(page.getByText("AIDD-Spec接続不足", { exact: true })).toBeVisible();
});
