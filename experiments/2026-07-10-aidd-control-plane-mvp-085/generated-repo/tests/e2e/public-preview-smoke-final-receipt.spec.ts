import { expect, test } from "@playwright/test";

const states = ["empty", "queued", "blocked", "exported"] as const;

test.describe("MVP085 Final Receipt Failure Handoff Queue", () => {
  for (const state of states) {
    test(`${state}状態を日本語UIで確認できる`, async ({ page }) => {
      await page.goto(`/?state=${state}`);
      await expect(page.getByText("AIDD Control Plane / MVP085")).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByText("source receipt id")).toBeVisible();
      await expect(page.getByText("broken URL")).toBeVisible();
      await expect(page.getByText("Chromium", { exact: true }).first()).toBeVisible();
      await expect(page.getByText("Firefox", { exact: true }).first()).toBeVisible();
      await expect(page.getByText("WebKit", { exact: true }).first()).toBeVisible();
    });
  }

  test("queuedでは3 laneを混ぜずに表示する", async ({ page }) => {
    await page.goto("/?state=queued");
    await expect(page.getByRole("heading", { name: "execute_now", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "next_increment", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "learning_log", exact: true })).toBeVisible();
    await expect(page.getByText("action-mvp085-execute-now").first()).toBeVisible();
  });

  test("exportedではexecute_nowだけがCodex prompt previewに入る", async ({ page }) => {
    await page.goto("/?state=exported");
    const prompt = page.locator("section", { hasText: "Codex prompt preview" }).locator("pre");
    await expect(prompt).toContainText("execute_nowのみ");
    await expect(prompt).toContainText("terminal evidence画像");
    await expect(prompt).not.toContainText("latency超過をPublic Preview Smoke Verifierへ戻す");
    await expect(prompt).not.toContainText("Learning Logへ");
  });

  test("blockedでは公開前ブロック理由を表示する", async ({ page }) => {
    await page.goto("/?state=blocked");
    await expect(page.getByText("private URL混入").first()).toBeVisible();
    await expect(page.getByText("local path混入").first()).toBeVisible();
    await expect(page.getByText("Firefox未確認").first()).toBeVisible();
    await expect(page.getByText("terminal evidence不足").first()).toBeVisible();
    await expect(page.getByText("rollback不足").first()).toBeVisible();
  });
});
