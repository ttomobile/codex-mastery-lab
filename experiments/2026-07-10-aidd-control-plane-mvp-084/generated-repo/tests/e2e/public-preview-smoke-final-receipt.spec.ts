import { expect, test } from "@playwright/test";

const states = ["empty", "verified", "failure", "blocked"] as const;

test.describe("MVP084 Public Preview Smoke Final Receipt", () => {
  for (const state of states) {
    test(`${state} 状態を表示できる`, async ({ page }) => {
      await page.goto(`/?state=${state}`);
      await expect(page.getByText("AIDD Control Plane / MVP084")).toBeVisible();
      await expect(page.getByRole("link", { name: state })).toHaveClass(/active/);
      await expect(page.getByText("Public Preview Smoke Final Receipt Summary")).toBeVisible();
    });
  }

  test("verifiedではHTTPと3ブラウザcoverageを表示する", async ({ page }) => {
    await page.goto("/?state=verified");
    await expect(page.getByText("verified", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("HTTP status").first()).toBeVisible();
    await expect(page.getByText("200").first()).toBeVisible();
    await expect(page.getByText("Chromium", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Firefox", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("WebKit", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("terminal evidence image response")).toBeVisible();
  });

  test("failureではReview Findingとdeltaへ変換する", async ({ page }) => {
    await page.goto("/?state=failure");
    await expect(page.getByText("failure: Review Findingへ変換")).toBeVisible();
    await expect(page.getByText("HTTP 404", { exact: true })).toBeVisible();
    await expect(page.getByText("0 byte", { exact: true })).toBeVisible();
    await expect(page.getByText("content type mismatch", { exact: true })).toBeVisible();
    await expect(page.getByText("latency超過", { exact: true })).toBeVisible();
    await expect(page.getByText(/review_finding:/).first()).toBeVisible();
    await expect(page.getByText(/AI Task Packet delta/).first()).toBeVisible();
    await expect(page.getByText(/Codex prompt delta/).first()).toBeVisible();
  });

  test("blockedでは公開前ブロック条件を止める", async ({ page }) => {
    await page.goto("/?state=blocked");
    await expect(page.getByText("blocked", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("private URL", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("local path", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("host名", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Firefox未確認", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("terminal evidence不足", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("AIDD-Spec接続不足", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("rollback不足", { exact: true }).first()).toBeVisible();
  });
});
