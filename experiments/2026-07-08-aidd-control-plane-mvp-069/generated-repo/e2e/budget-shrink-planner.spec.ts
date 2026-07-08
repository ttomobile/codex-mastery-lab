import { expect, test } from "@playwright/test";

test.describe("Codex Run Budget Shrink Planner", () => {
  test("ready状態では予算内の縮小packetを表示する", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Codex Run Budget Shrink Planner" })).toBeVisible();
    await expect(page.getByText("run budget state")).toBeVisible();
    await expect(page.getByText("ATP-069-preview-smoke")).toBeVisible();
    await expect(page.getByLabel("keep_nowとdefer_next_increment").getByText("Public Preview Smoke Verifierのasset copy確認を1件実行する")).toBeVisible();
  });

  test("brake状態でkeep_nowとdefer_next_incrementを分ける", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "brake" }).click();
    await expect(page.getByText("brakeではkeep_nowを1件に絞り")).toBeVisible();
    const shrinkPanel = page.getByLabel("keep_nowとdefer_next_increment");
    await expect(shrinkPanel.getByText("壊れたpreview asset URLを1件だけ修正する")).toBeVisible();
    await expect(shrinkPanel.getByText("CI artifact API連携")).toBeVisible();
  });

  test("stop状態で最低検証と証跡不足を止める", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "stop" }).click();
    const reasons = page.getByLabel("stop block reasons");
    await expect(reasons.getByRole("heading", { name: "最低検証不足" })).toBeVisible();
    await expect(reasons.getByRole("heading", { name: "3ブラウザ不足" })).toBeVisible();
    await expect(reasons.getByRole("heading", { name: "rollback不足" })).toBeVisible();
    await expect(reasons.getByRole("heading", { name: "prompt混入" })).toBeVisible();
  });

  test("sanitized状態で公開用promptにkeep_nowだけを残す", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "sanitized" }).click();
    const prompt = page.getByLabel("Codex prompt preview（keep_nowのみ）");
    await expect(prompt).toContainText("MVP069 keep_now");
    await expect(prompt).not.toContainText("defer_next_increment");
    await expect(prompt).not.toContainText("private-preview");
    await expect(page.getByText("local path / private host / private network URLなし")).toBeVisible();
  });
});
