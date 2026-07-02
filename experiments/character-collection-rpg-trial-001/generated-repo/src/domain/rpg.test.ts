import { describe, expect, it } from "vitest";
import { advanceBattleTurn, calculateReadinessScore, mapGachaResults, resolveScenarioServices, type Character } from "./rpg";

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
});

describe("幻晶結果", () => {
  it("seedを独自の結果ラベルへ変換する", () => {
    const results = mapGachaResults(["forge", "basalt", "citrine"]);
    expect(results).toHaveLength(3);
    expect(results.map((result) => result.gradeLabel)).toContain("閃光星紋");
  });
});

describe("状態別ready判定", () => {
  it("payment_failedをbilling失敗として公開する", () => {
    expect(resolveScenarioServices("payment_failed")).toMatchObject({ billing: "payment_failed", api: "online" });
  });
});
