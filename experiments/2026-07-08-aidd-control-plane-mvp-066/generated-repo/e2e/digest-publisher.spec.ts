import { expect, test } from "@playwright/test";

test.describe("Public Preview Smoke Verifier", () => {
  test("empty / valid / failure / blockedの4状態を切り替えられる", async ({ page }) => {
    await page.goto("/");

    for (const state of ["empty", "valid", "failure", "blocked"]) {
      await page.getByRole("button", { name: state }).click();
      await expect(page.getByRole("heading", { name: "Public Preview Smoke Verifier" })).toBeVisible();
      await expect(page.getByLabel("QA判定サマリー")).toContainText(`判定: ${state}`);
    }
  });

  test("公開preview HTMLとassetsのHTTP証跡を表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "valid" }).click();

    await expect(page.getByLabel("公開preview smoke入力")).toContainText("smoke run id");
    await expect(page.getByLabel("公開preview smoke入力")).toContainText("article path");
    await expect(page.getByLabel("公開preview smoke入力")).toContainText("preview URL/path");
    await expect(page.getByLabel("checked URLs")).toContainText("公開preview HTML");
    await expect(page.getByLabel("checked URLs")).toContainText("HTTP status");
    await expect(page.getByLabel("checked URLs")).toContainText("byte size");
    await expect(page.getByLabel("checked URLs")).toContainText("content type");
    await expect(page.getByLabel("checked URLs")).toContainText("latency ms");
    await expect(page.getByLabel("terminal evidence image response")).toContainText("200 image/png");
  });

  test("失敗assetをfailureとして確認できる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "failure" }).click();

    await expect(page.getByLabel("checked URLs")).toContainText("公開asset PNG");
    await expect(page.getByLabel("checked URLs")).toContainText("404");
    await expect(page.getByLabel("Review Finding一覧")).toContainText("失敗asset");
    await expect(page.getByLabel("QA判定サマリー")).toContainText("判定: failure");
  });

  test("再実行コマンドを表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "valid" }).click();

    await expect(page.getByLabel("rerun command")).toContainText("pnpm run doctor:aidd");
    await expect(page.getByLabel("rerun command")).toContainText("pnpm run test:e2e");
    await expect(page.getByLabel("rerun command")).toContainText("pnpm run capture:mvp066");
  });

  test("3ブラウザ表示とAIDD接続文言を確認できる", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "valid" }).click();

    const coverage = page.getByLabel("Chromium Firefox WebKit");
    await expect(coverage).toContainText("Chromium");
    await expect(coverage).toContainText("Firefox");
    await expect(coverage).toContainText("WebKit");
    await expect(coverage).toContainText("通過");
    await expect(page.getByLabel("AIDD-Spec v0.1 AIDD Control Plane MVP v0.1 Verification Evidence Release Checklist")).toContainText("AIDD-Spec v0.1");
    await expect(page.getByLabel("AIDD-Spec v0.1 AIDD Control Plane MVP v0.1 Verification Evidence Release Checklist")).toContainText("AIDD Control Plane MVP v0.1");
    await expect(page.getByLabel("AIDD-Spec v0.1 AIDD Control Plane MVP v0.1 Verification Evidence Release Checklist")).toContainText("Verification Evidence");
    await expect(page.getByLabel("AIDD-Spec v0.1 AIDD Control Plane MVP v0.1 Verification Evidence Release Checklist")).toContainText("Release Checklist");
  });
});
