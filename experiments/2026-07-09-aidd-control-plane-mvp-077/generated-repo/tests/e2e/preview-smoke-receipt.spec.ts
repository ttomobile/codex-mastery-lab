import { expect, test } from "@playwright/test";

test.describe("Preview Smoke Receipt Binder の4状態", () => {
  test("emptyは未入力Receiptと必要な列名を表示する", async ({ page }) => {
    await page.goto("/?state=empty");
    await expect(page.getByRole("heading", { name: "Preview Smoke Receipt Binder" })).toBeVisible();
    await expect(page.getByLabel("Receipt判定")).toContainText("未入力");
    await expect(page.getByText("receipt id")).toBeVisible();
    await expect(page.getByText("source QA gate id")).toBeVisible();
    await expect(page.getByText("HTTP status")).toBeVisible();
    await expect(page.getByText("byte size")).toBeVisible();
    await expect(page.getByText("content type")).toBeVisible();
    await expect(page.getByText("latency ms")).toBeVisible();
    await expect(page.getByText("checked_at")).toBeVisible();
    await expect(page.getByText("evidence path")).toBeVisible();
  });

  test("validはHTTP証跡保存可能と3ブラウザ確認済みを表示する", async ({ page }) => {
    await page.goto("/?state=valid");
    await expect(page.getByLabel("Receipt判定")).toContainText("Receipt保存可能");
    await expect(page.getByText("公開previewのHTTP証跡を保存できます")).toBeVisible();
    await expect(page.getByText("receipt-mvp077-valid-001")).toBeVisible();
    await expect(page.getByText("Chromium / Firefox / WebKit console error / warn なし")).toBeVisible();
    await expect(page.getByText("AIDD-Spec v0.1")).toBeVisible();
    await expect(page.getByText("standards/aidd-control-plane-mvp-v0.1.md")).toBeVisible();
  });

  test("failureは4種類のReview Findingを表示する", async ({ page }) => {
    await page.goto("/?state=failure");
    await expect(page.getByLabel("Receipt判定")).toContainText("Review Findingあり");
    await expect(page.getByRole("heading", { name: "Review Finding" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "0 byte" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "content type mismatch" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "latency超過" })).toBeVisible();
  });

  test("blockedは公開前停止理由を表示する", async ({ page }) => {
    await page.goto("/?state=blocked");
    await expect(page.getByLabel("Receipt判定")).toContainText("公開前停止");
    await expect(page.getByRole("heading", { name: "公開前停止" })).toBeVisible();
    await expect(page.getByText("private URLがReceipt候補に混入しています。")).toBeVisible();
    await expect(page.getByText("local pathがHTTP証跡の代替として入力されています。")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Firefox未確認" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "receipt保存先不足" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AIDD-Spec接続不足" })).toBeVisible();
  });
});
