import { expect, test, type APIRequestContext } from "@playwright/test";

const mockBaseUrl = "http://127.0.0.1:4100";

async function setScenario(request: APIRequestContext, scenario: string) {
  await request.post(`${mockBaseUrl}/__control/state`, { data: { scenario } });
}

test.beforeEach(async ({ request }) => {
  await setScenario(request, "success");
});

test("ホームから編成、遠征、戦闘、幻晶結果まで確認できる", async ({ page, request }) => {
  await setScenario(request, "gacha_result");
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "星紋遠征隊" })).toBeVisible();
  await expect(page.getByTestId("home-screen")).toContainText("裂光の丘");

  await page.getByRole("button", { name: "編成" }).click();
  await expect(page.getByTestId("party-screen")).toContainText("出撃可能な編成");

  await page.getByRole("button", { name: "遠征" }).click();
  await expect(page.getByTestId("quest-screen")).toContainText("裂光の丘");

  await setScenario(request, "battle_win");
  await page.reload();
  await page.getByRole("button", { name: "戦闘" }).click();
  await expect(page.getByTestId("battle-result")).toContainText("勝利");

  await setScenario(request, "gacha_result");
  await page.reload();
  await page.getByRole("button", { name: "幻晶" }).click();
  await expect(page.getByTestId("gacha-screen")).toContainText("星紋");
});

test("empty_rosterでは名簿の空状態を表示する", async ({ page, request }) => {
  await setScenario(request, "empty_roster");
  await page.goto("/");
  await page.getByRole("button", { name: "名簿" }).click();
  await expect(page.getByTestId("failure-panel")).toContainText("隊員名簿が空です");
});

test("party_invalidでは戦闘前に編成不備を表示する", async ({ page, request }) => {
  await setScenario(request, "party_invalid");
  await page.goto("/");
  await page.getByRole("button", { name: "戦闘" }).click();
  await expect(page.getByTestId("failure-panel")).toContainText("前衛と支援");
});

test("payment_failedでは幻晶画面に決済失敗を表示する", async ({ page, request }) => {
  await setScenario(request, "payment_failed");
  await page.goto("/");
  await page.getByRole("button", { name: "幻晶" }).click();
  await expect(page.getByTestId("failure-panel")).toContainText("mock決済が失敗");
});

test("状態画面からofflineとtimeoutへ切り替えられる", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "状態" }).click();
  await page.getByRole("button", { name: "offline" }).click();
  await expect(page.getByTestId("current-scenario")).toHaveText("offline");
  await expect(page.getByTestId("status-pill")).toContainText("要確認");

  await page.getByRole("button", { name: "timeout" }).click();
  await expect(page.getByTestId("current-scenario")).toHaveText("timeout");
});
