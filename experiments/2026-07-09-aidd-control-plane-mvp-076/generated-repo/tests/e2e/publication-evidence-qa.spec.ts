import { expect, test } from "@playwright/test";

test.describe("Publication Evidence QA Gate の4状態", () => {
  test("emptyはsource digest未選択と必要入力を表示する", async ({ page }) => {
    await page.goto("/?state=empty");
    await expect(page.getByText("未選択").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "公開前に必要な入力" })).toBeVisible();
    await expect(page.getByText("article path").first()).toBeVisible();
    await expect(page.getByText("AIDD-Spec connection").first()).toBeVisible();
  });

  test("validは公開可能と証跡一式を表示する", async ({ page }) => {
    await page.goto("/?state=valid");
    await expect(page.getByLabel("公開判定")).toContainText("公開可能");
    await expect(page.getByText("Review Record excerpt")).toBeVisible();
    await expect(page.getByText("Learning Log excerpt")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chromium / Firefox / WebKit Coverage" })).toBeVisible();
    await expect(page.getByText("console error / warn なし")).toBeVisible();
  });

  test("failureは修正可能なReview Findingとして表示する", async ({ page }) => {
    await page.goto("/?state=failure");
    await expect(page.getByLabel("公開判定")).toContainText("公開QA不足");
    await expect(page.getByRole("heading", { name: "Review Finding" })).toBeVisible();
    await expect(page.getByText("Firefox を含む3ブラウザE2E")).toBeVisible();
    await expect(page.getByText("needed_upstream_info").first()).toBeVisible();
  });

  test("blockedはサニタイズ混入を公開前停止にする", async ({ page }) => {
    await page.goto("/?state=blocked");
    await expect(page.getByLabel("公開判定")).toContainText("公開前停止");
    await expect(page.getByText("local path / private host / private network URL 混入")).toBeVisible();
    await expect(page.getByText("/Users/sample/private-work/articles/draft.md").first()).toBeVisible();
    await expect(page.getByText("http://192.168.1.23:9323/report").first()).toBeVisible();
    await expect(page.getByText("pnpm run doctor:aidd").first()).toBeVisible();
  });
});
