import { expect, test } from "@playwright/test";

test("未選択ケースでは修理deltaなしを表示する", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("AIDD Control Plane MVP062")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Repair Delta Priority Decision Workspace", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "検証判定: 修理deltaなし" })).toBeVisible();
  await expect(page.getByLabel("未選択の要約")).toContainText("判断する修理deltaを選んでください");
});

test("採用判断済みケースでは採用済みdeltaだけを次回promptへ入れる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "採用判断済み" }).click();
  await expect(page.getByRole("heading", { name: "検証判定: 採用済みだけ次へ進む" })).toBeVisible();
  await expect(page.getByLabel("採用判断済みの要約")).toContainText("採用済みdeltaだけを次へ進めます");
  await expect(page.getByLabel("Repair Delta判断一覧")).toContainText("MVP062-REPAIR-DELTA-001");
  await expect(page.getByText("Firefoxを除外せず")).toBeVisible();
  await expect(page.getByText("保留 / 却下deltaはLearning Logへ戻し")).toBeVisible();
});

test("差し戻しケースではReview Finding形式で不足とローカル情報混入をブロックする", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "差し戻し" }).click();
  await expect(page.getByRole("heading", { name: "検証判定: 差し戻し" })).toBeVisible();
  const findings = page.getByLabel("Review Finding一覧");
  for (const text of ["未判断", "理由不足", "証跡不足", "rollback不足", "Firefox除外", "未採用delta混入", "local path / host / private network URL混入", "needed_upstream_info", "standard_update", "verification_command"]) {
    await expect(findings).toContainText(text);
  }
  await expect(page.locator("pre")).toContainText("WORKSPACE/private-url");
  await expect(page.locator("pre")).not.toContainText("/Users/");
  await expect(page.locator("pre")).not.toContainText("10.0.0.62");
});

test("判断待ちケースではadopt_nowだけを次の1回に入れる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "判断待ち" }).click();
  await expect(page.getByRole("heading", { name: "検証判定: 次の1回へ絞り込み" })).toBeVisible();
  const lanes = page.getByLabel("decision_neededのlane分類");
  for (const text of ["adopt_now", "hold_next_increment", "reject_to_learning_log", "MVP062-REPAIR-DELTA-001", "MVP062-REPAIR-DELTA-002"]) {
    await expect(lanes).toContainText(text);
  }
  await expect(page.getByText("Firefoxを除外せず")).toBeVisible();
  await expect(lanes).toContainText("hold_next_increment");
});
