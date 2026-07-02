export const scenarios = [
  "success",
  "empty_roster",
  "offline",
  "timeout",
  "battle_win",
  "battle_lose",
  "party_invalid",
  "gacha_result",
  "payment_failed"
];

export function createState(scenario = "success") {
  const roster = [
    { id: "c1", name: "アステル", role: "前衛", rank: 3, level: 42, power: 620, symbol: "剣" },
    { id: "c2", name: "ミナト", role: "支援", rank: 2, level: 38, power: 540, symbol: "奏" },
    { id: "c3", name: "シオン", role: "術師", rank: 2, level: 36, power: 500, symbol: "晶" },
    { id: "c4", name: "リク", role: "前衛", rank: 1, level: 24, power: 310, symbol: "盾" }
  ];

  return {
    scenario,
    roster: scenario === "empty_roster" ? [] : roster,
    party: scenario === "party_invalid" ? ["c1", "c4"] : ["c1", "c2", "c3"],
    quests: [
      { id: "q1", title: "裂光の丘", summary: "星紋反応が残る丘を短時間で調査する。", requiredPower: 1400 },
      { id: "q2", title: "雨音の旧道", summary: "支援役の回復判断を確認する遠征。", requiredPower: 1180 }
    ],
    rewards:
      scenario === "battle_win"
        ? [
            { id: "r1", label: "星屑", amount: 40 },
            { id: "r2", label: "訓練札", amount: 3 }
          ]
        : [],
    battle: {
      enemyName: "影紋核",
      heroHp: scenario === "battle_lose" ? 0 : 92,
      enemyHp: scenario === "battle_win" ? 0 : 46,
      turn: scenario === "battle_win" || scenario === "battle_lose" ? 5 : 1,
      logs:
        scenario === "battle_win"
          ? [{ id: "win", text: "星紋連携が決まり、影紋核は沈黙した。" }]
          : scenario === "battle_lose"
            ? [{ id: "lose", text: "防御が崩れ、遠征隊は撤退した。" }]
            : [{ id: "start", text: "影紋核が淡く脈動している。" }]
    },
    gachaSeeds: scenario === "gacha_result" ? ["aurora", "basalt", "citrine", "dawn", "ember", "flux"] : ["mist", "nova", "opal"],
    services: {
      api: scenario === "offline" ? "offline" : scenario === "timeout" ? "timeout" : "online",
      media: scenario === "offline" ? "unavailable" : "placeholder_ready",
      auth: "guest",
      billing: scenario === "payment_failed" ? "payment_failed" : "sandbox_ready"
    }
  };
}
