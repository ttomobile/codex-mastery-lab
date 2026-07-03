import AxeBuilder from "@axe-core/playwright";
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

test("payment_failedでは幻晶画面に決済失敗を表示し加入を止める", async ({ page, request }) => {
  await setScenario(request, "payment_failed");
  await page.goto("/");
  await page.getByRole("button", { name: "幻晶" }).click();
  await expect(page.getByTestId("failure-panel")).toContainText("mock決済が失敗");
  await expect(page.getByRole("button", { name: "加入不可" })).toBeDisabled();
});

test("media_failureでは演出素材の失敗を戦闘と幻晶に表示する", async ({ page, request }) => {
  await setScenario(request, "media_failure");
  await page.goto("/");

  await page.getByRole("button", { name: "戦闘" }).click();
  await expect(page.getByTestId("failure-panel")).toContainText("mock media取得に失敗");
  await expect(page.getByTestId("battle-screen")).toContainText("ログとHPで進行を継続");

  await page.getByRole("button", { name: "幻晶" }).click();
  await expect(page.getByTestId("gacha-screen")).toContainText("結果カードだけ安全に表示");
});

test("主要画面でaxeの重大なアクセシビリティ違反がない", async ({ page, request }) => {
  await setScenario(request, "success");
  await page.goto("/");

  for (const tab of ["ホーム", "編成", "戦闘", "幻晶", "育成", "状態"]) {
    await page.getByRole("button", { name: tab }).click();
    const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
    expect(results.violations, `${tab} のaxe違反`).toEqual([]);
  }
});

test("auth状態で育成枠の表示が切り替わる", async ({ page, request }) => {
  await setScenario(request, "auth_anonymous");
  await page.goto("/");
  await page.getByRole("button", { name: "育成" }).click();
  await expect(page.getByTestId("training-auth-note")).toContainText("通常育成枠");

  await setScenario(request, "auth_premium");
  await page.reload();
  await page.getByRole("button", { name: "育成" }).click();
  await expect(page.getByTestId("training-auth-note")).toContainText("プレミアム育成枠が有効");
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

test("画面内操作でコマンド選択、編成交替、強化、召喚加入が反映される", async ({ page, request }) => {
  await setScenario(request, "gacha_result");
  await page.goto("/");

  await page.getByRole("button", { name: "戦闘" }).click();
  await page.getByRole("button", { name: "星紋技" }).click();
  await expect(page.getByTestId("selected-command")).toContainText("星紋技");
  await expect(page.getByTestId("battle-screen")).toContainText("星紋技を選択");

  await page.getByRole("button", { name: "編成" }).click();
  await page.getByTestId("swap-2").click();
  await expect(page.getByTestId("party-order")).toContainText("リク");

  await page.getByRole("button", { name: "育成" }).click();
  await expect(page.getByTestId("training-c1")).toContainText("Lv.42");
  await page.getByRole("button", { name: "強化" }).first().click();
  await expect(page.getByTestId("training-c1")).toContainText("Lv.43");

  await page.getByRole("button", { name: "幻晶" }).click();
  await expect(page.getByTestId("roster-count-after-gacha")).toContainText("4名");
  await page.getByTestId("recruit-aurora").click();
  await expect(page.getByTestId("roster-count-after-gacha")).toContainText("5名");
});

test("mock backendに編成、育成、召喚加入が保存されリロード後も残る", async ({ page, request }) => {
  await setScenario(request, "gacha_result");
  await page.goto("/");

  await page.getByRole("button", { name: "編成" }).click();
  await page.getByTestId("swap-2").click();
  await expect(page.getByTestId("party-order")).toContainText("リク");
  await page.reload();
  await page.getByRole("button", { name: "編成" }).click();
  await expect(page.getByTestId("party-order")).toContainText("リク");

  await page.getByRole("button", { name: "育成" }).click();
  await page.getByRole("button", { name: "強化" }).first().click();
  await expect(page.getByTestId("training-c1")).toContainText("Lv.43");
  await page.reload();
  await page.getByRole("button", { name: "育成" }).click();
  await expect(page.getByTestId("training-c1")).toContainText("Lv.43");

  await page.getByRole("button", { name: "幻晶" }).click();
  await page.getByTestId("recruit-aurora").click();
  await expect(page.getByTestId("roster-count-after-gacha")).toContainText("5名");
  await page.reload();
  await page.getByRole("button", { name: "幻晶" }).click();
  await expect(page.getByTestId("roster-count-after-gacha")).toContainText("5名");
});

test("報酬台帳で勝利報酬を受け取り、二重受取を止めて保存する", async ({ page, request }) => {
  await setScenario(request, "success");
  await page.goto("/");
  await page.getByRole("button", { name: "報酬" }).click();
  await expect(page.getByTestId("reward-claim-state")).toContainText("保留");
  await expect(page.getByTestId("claim-reward")).toBeDisabled();

  await setScenario(request, "battle_win");
  await page.reload();
  await page.getByRole("button", { name: "報酬" }).click();
  await expect(page.getByTestId("reward-claim-state")).toContainText("未受取");
  await page.getByTestId("claim-reward").click();
  await expect(page.getByTestId("reward-claim-state")).toContainText("受取済");
  await expect(page.getByTestId("claim-reward")).toBeDisabled();

  await page.reload();
  await page.getByRole("button", { name: "報酬" }).click();
  await expect(page.getByTestId("reward-claim-state")).toContainText("受取済");
});

test("billing失敗中は勝利済みでも報酬受取を保留し課金誤認を防ぐ", async ({ page, request }) => {
  await setScenario(request, "battle_win_payment_failed");
  await page.goto("/");
  await page.getByRole("button", { name: "報酬" }).click();

  await expect(page.getByTestId("reward-screen")).toContainText("星屑");
  await expect(page.getByTestId("reward-claim-state")).toContainText("mock billingが失敗中");
  await expect(page.getByTestId("claim-reward")).toBeDisabled();

  const response = await request.post(`${mockBaseUrl}/actions/claim-reward`, { data: {} });
  expect(response.status()).toBe(402);
  const body = await response.json();
  expect(body.message).toContain("billing失敗中");
});
