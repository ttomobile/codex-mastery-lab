import { describe, expect, it } from "vitest";
import {
  advanceBattleTurn,
  calculateReadinessScore,
  createRecruitFromSeed,
  canRecruitFromGacha,
  canUsePremiumTraining,
  mapGachaResults,
  previewBattleCommand,
  resolveScenarioServices,
  swapPartyMember,
  trainCharacter,
  type Character
} from "./rpg";

const party: Character[] = [
  { id: "c1", name: "アステル", role: "前衛", rank: 3, level: 42, power: 620, symbol: "剣" },
  { id: "c2", name: "ミナト", role: "支援", rank: 2, level: 38, power: 540, symbol: "奏" },
  { id: "c3", name: "シオン", role: "術師", rank: 2, level: 36, power: 500, symbol: "晶" }
];

describe("編成妥当性", () => {
  it("前衛と支援を含む3名以上の編成を出撃可能にする", () => {
    expect(calculateReadinessScore(party)).toMatchObject({ valid: true });
  });

  it("支援がいない編成を不正にする", () => {
    const invalid = party.filter((member) => member.role !== "支援");
    expect(calculateReadinessScore(invalid)).toMatchObject({ valid: false, reason: "3名以上の隊員が必要です。" });
  });
});

describe("戦闘状態", () => {
  it("出撃可能な編成では敵HPを減らしログを追加する", () => {
    const next = advanceBattleTurn({ enemyName: "影紋核", heroHp: 100, enemyHp: 50, turn: 1, logs: [] }, party);
    expect(next.enemyHp).toBe(22);
    expect(next.heroHp).toBe(90);
    expect(next.logs[0]?.text).toContain("ターン2");
  });

  it("星紋技コマンドでは通常より大きく敵HPを減らす", () => {
    const state = { enemyName: "影紋核", heroHp: 100, enemyHp: 80, turn: 1, logs: [] };
    const normal = previewBattleCommand(state, party, "通常攻撃");
    const special = previewBattleCommand(state, party, "星紋技");
    expect(special.enemyHp).toBeLessThan(normal.enemyHp);
    expect(special.logs[0]?.text).toContain("星紋技を選択");
  });
});

describe("画面内操作", () => {
  it("控え隊員と編成枠を入れ替える", () => {
    expect(swapPartyMember(["c1", "c2", "c3"], "c3", "c4")).toEqual(["c1", "c2", "c4"]);
  });

  it("強化でレベルと戦力を上げる", () => {
    const trained = trainCharacter(party[0]);
    expect(trained.level).toBe(43);
    expect(trained.power).toBeGreaterThan(party[0].power);
  });
});

describe("幻晶結果", () => {
  it("seedを独自の結果ラベルへ変換する", () => {
    const results = mapGachaResults(["forge", "basalt", "citrine"]);
    expect(results).toHaveLength(3);
    expect(results.map((result) => result.gradeLabel)).toContain("閃光星紋");
  });

  it("seedから非公式IPを含まない新隊員候補を生成する", () => {
    const recruit = createRecruitFromSeed("aurora");
    expect(recruit.name).toMatch(/^星紋候補/);
    expect(["前衛", "支援"]).toContain(recruit.role);
  });
});

describe("状態別ready判定", () => {
  it("payment_failedをbilling失敗として公開する", () => {
    expect(resolveScenarioServices("payment_failed")).toMatchObject({ billing: "payment_failed", api: "online" });
  });

  it("auth_premiumだけをプレミアム育成可能として扱う", () => {
    expect(resolveScenarioServices("auth_premium")).toMatchObject({ auth: "premium" });
    expect(canUsePremiumTraining("premium")).toBe(true);
    expect(canUsePremiumTraining("anonymous")).toBe(false);
  });

  it("billing失敗中は召喚加入を止める", () => {
    expect(canRecruitFromGacha("sandbox_ready")).toBe(true);
    expect(canRecruitFromGacha("payment_failed")).toBe(false);
  });
});
