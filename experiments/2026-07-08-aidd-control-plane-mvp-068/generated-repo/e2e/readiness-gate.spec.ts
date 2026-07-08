import { expect, test } from "@playwright/test";

test.describe("One-Run Execution Readiness Gate", () => {
  test("empty状態では古いAction Queueを使わない", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "One-Run Execution Readiness Gate" })).toBeVisible();
    await expect(page.getByText("実行候補が未選択です")).toBeVisible();
    await expect(page.getByText("未選択").first()).toBeVisible();
  });

  test("ready状態でexecute_nowだけをRun Queue直前で許可する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "ready" }).click();
    await expect(page.getByText("execute_nowだけが選ばれ")).toBeVisible();
    await expect(page.getByText("RFQ-067-001").first()).toBeVisible();
    await expect(page.getByLabel("Codex実行条件").getByText("codex exec --sandbox danger-full-access")).toBeVisible();
    await expect(page.getByText("Firefox").first()).toBeVisible();
  });

  test("blocked状態で危険commandとFirefox除外を止める", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "blocked" }).click();
    const blockedReasons = page.getByLabel("blocked reasons");
    await expect(blockedReasons.getByRole("heading", { name: "危険command" })).toBeVisible();
    await expect(blockedReasons.getByRole("heading", { name: "Firefox除外" })).toBeVisible();
    await expect(blockedReasons.getByRole("heading", { name: "terminal/failure screenshot不足" })).toBeVisible();
  });

  test("sanitized状態で公開用promptにexecute_nowだけを残す", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "sanitized" }).click();
    const prompt = page.getByLabel("Codex prompt preview（execute_nowのみ）");
    await expect(prompt).toContainText("RFQ-067-001");
    await expect(prompt).not.toContainText("RFQ-067-003");
    await expect(prompt).not.toContainText("next_increment");
    await expect(page.getByText("local path / host名 / private network URLなし")).toBeVisible();
  });
});
