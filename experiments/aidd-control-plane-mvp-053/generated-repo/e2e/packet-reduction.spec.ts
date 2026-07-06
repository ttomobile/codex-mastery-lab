import { expect, test } from "@playwright/test";

test("readyケースでは縮小提案を生成しない", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("AIDD Control Plane MVP053")).toBeVisible();
  await expect(page.getByRole("heading", { name: "STOP/BRAKE時にAI Task Packetを自動縮小する提案", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AI Task Packet判断: ready" })).toBeVisible();
  await expect(page.getByLabel("ready summary").getByText("元のAI Task Packetを維持")).toBeVisible();
  await expect(page.getByText("readyでは縮小提案を生成しません。")).toBeVisible();
});

test("brakeケースでは縮小後AI Task Packet提案とサニタイズ表示を出す", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "brakeケース" }).click();

  await expect(page.getByRole("heading", { name: "AI Task Packet判断: brake" })).toBeVisible();
  await expect(page.getByLabel("brake summary").getByText("縮小後AI Task Packet提案を生成")).toBeVisible();
  const proposal = page.getByLabel("reduced packet proposal");
  await expect(proposal).toBeVisible();

  for (const field of ["keep_now", "defer_next_increment", "minimum_verification", "fallback_action", "resume_condition", "evidence_paths", "prompt_preview"]) {
    await expect(proposal.getByRole("heading", { name: field })).toBeVisible();
  }

  await expect(page.getByText("公開前ブロック: local path / private host / private URL")).toBeVisible();
  await expect(page.getByLabel("sanitized evidence paths").getByText("HOME/codex-mastery-lab")).toBeVisible();
  await expect(page.getByLabel("sanitized evidence paths").getByText("WORKSPACE.local")).toBeVisible();
  await expect(page.locator("pre")).toContainText("decision=brake");
  await expect(page.locator("pre")).not.toContainText("/Users/");
  await expect(page.locator("pre")).not.toContainText("tto-mac.local");
});

test("stopケースでは停止fallbackとresume_conditionを表示する", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "stopケース" }).click();

  await expect(page.getByRole("heading", { name: "AI Task Packet判断: stop" })).toBeVisible();
  await expect(page.getByLabel("stop summary").getByText("縮小後AI Task Packet提案を生成")).toBeVisible();
  await expect(page.getByText("実装を停止し、縮小後AI Task Packetだけを証跡へ残して再開条件が満たされるまで進めない")).toBeVisible();
  await expect(page.getByLabel("reduced packet proposal").getByRole("heading", { name: "resume_condition" })).toBeVisible();
  await expect(page.locator("pre")).toContainText("decision=stop");
  await expect(page.getByLabel("unsafe tokens")).toContainText("http://127.0.0.1:3021/debug");
  await expect(page.getByLabel("sanitized evidence paths")).not.toContainText("127.0.0.1");
  await expect(page.getByLabel("sanitized evidence paths")).not.toContainText("/home/");
});
