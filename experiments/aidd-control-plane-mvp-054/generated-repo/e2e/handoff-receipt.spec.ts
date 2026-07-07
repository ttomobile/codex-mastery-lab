import { expect, test } from "@playwright/test";

test("emptyケースではレシートを生成しない", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP054")).toBeVisible();
  await expect(page.getByRole("heading", { name: "縮小版AI Task Packetを次回実行へ渡す前のハンドオフレシート", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ハンドオフ判断: empty" })).toBeVisible();
  await expect(page.getByLabel("empty summary").getByText("受け渡す縮小計画がありません")).toBeVisible();
  await expect(page.getByLabel("handoff receipt empty").getByText("validになるまで縮小版ハンドオフレシートは生成しません。")).toBeVisible();
});

test("validケースでは縮小版ハンドオフレシートを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "validケース" }).click();

  await expect(page.getByRole("heading", { name: "ハンドオフ判断: valid" })).toBeVisible();
  await expect(page.getByLabel("valid summary").getByText("縮小版ハンドオフレシートを生成")).toBeVisible();
  const receipt = page.getByLabel("handoff receipt");
  await expect(receipt).toBeVisible();

  for (const field of [
    "source_shrink_plan_id",
    "execute_now",
    "defer_next_increment",
    "minimum_verification",
    "required_evidence",
    "rollback_condition",
    "aidd_spec_connections",
    "codex_prompt_preview"
  ]) {
    await expect(receipt.getByRole("heading", { name: field })).toBeVisible();
  }

  await expect(receipt).toContainText("MVP053-SHRINK-PLAN-READY-2026-07-07");
  await expect(receipt).toContainText("assets/aidd-control-plane-mvp054-valid.png");
  await expect(receipt).toContainText("MVP054 Handoff Receipt: connected");
  await expect(page.getByText("公開前ブロックはありません。")).toBeVisible();
});

test("blockedケースでは公開前ブロック5種類と修正指示を表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "blockedケース" }).click();

  await expect(page.getByRole("heading", { name: "ハンドオフ判断: blocked" })).toBeVisible();
  await expect(page.getByLabel("blocked summary").getByText("公開前ブロックがあります")).toBeVisible();
  const blocks = page.getByLabel("publish blocks");

  for (const text of [
    "未サニタイズのlocal path/private host/private network URL",
    "minimum_verification不足",
    "rollback不足",
    "Chromium/Firefox/WebKit不足",
    "evidence不足",
    "WORKSPACEまたはHOME表記へ置換",
    "PlaywrightのChromium / Firefox / WebKitをすべて実行"
  ]) {
    await expect(blocks).toContainText(text);
  }

  await expect(page.getByLabel("handoff receipt empty")).toContainText("validになるまで縮小版ハンドオフレシートは生成しません。");
  await expect(page.locator("pre")).toContainText("WORKSPACE/private-url");
  await expect(page.locator("pre")).not.toContainText("/Users/");
  await expect(page.locator("pre")).not.toContainText("127.0.0.1");
});
