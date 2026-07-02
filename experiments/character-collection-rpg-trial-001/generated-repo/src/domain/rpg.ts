export type MockScenario =
  | "success"
  | "empty_roster"
  | "offline"
  | "timeout"
  | "battle_win"
  | "battle_lose"
  | "party_invalid"
  | "gacha_result"
  | "payment_failed";

export type Character = {
  id: string;
  name: string;
  role: "前衛" | "支援" | "術師";
  rank: 1 | 2 | 3;
  level: number;
  power: number;
  symbol: string;
};

export type Quest = {
  id: string;
  title: string;
  summary: string;
  requiredPower: number;
};

export type Reward = {
  id: string;
  label: string;
  amount: number;
};

export type BattleLog = {
  id: string;
  text: string;
};

export type BattleState = {
  enemyName: string;
  heroHp: number;
  enemyHp: number;
  turn: number;
  logs: BattleLog[];
};

export function calculateReadinessScore(party: Character[]) {
  if (party.length < 3) {
    return { valid: false, score: 0, reason: "3名以上の隊員が必要です。" };
  }

  const hasFront = party.some((member) => member.role === "前衛");
  const hasSupport = party.some((member) => member.role === "支援");
  if (!hasFront || !hasSupport) {
    return { valid: false, score: 35, reason: "前衛と支援を最低1名ずつ入れてください。" };
  }

  const totalPower = party.reduce((sum, member) => sum + member.power, 0);
  const averageLevel = party.reduce((sum, member) => sum + member.level, 0) / party.length;
  const score = Math.min(100, Math.round(totalPower / 26 + averageLevel));
  return {
    valid: score >= 70,
    score,
    reason: score >= 70 ? "推奨戦力を満たしています。" : "推奨戦力に届いていません。育成で補強してください。"
  };
}

export function advanceBattleTurn(state: BattleState, party: Character[]): BattleState {
  const readiness = calculateReadinessScore(party);
  const heroDamage = readiness.valid ? 28 : 12;
  const enemyDamage = readiness.valid ? 10 : 24;
  const nextTurn = state.turn + 1;
  const nextEnemyHp = Math.max(0, state.enemyHp - heroDamage);
  const nextHeroHp = Math.max(0, state.heroHp - (nextEnemyHp === 0 ? 0 : enemyDamage));

  return {
    ...state,
    turn: nextTurn,
    heroHp: nextHeroHp,
    enemyHp: nextEnemyHp,
    logs: [
      ...state.logs,
      {
        id: `turn-${nextTurn}`,
        text: `ターン${nextTurn}: 星紋連携で${heroDamage}点、反撃で${nextEnemyHp === 0 ? 0 : enemyDamage}点。`
      }
    ]
  };
}

export function mapGachaResults(seeds: string[]) {
  return seeds.map((seed, index) => {
    const total = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) + index;
    const grade = total % 9 === 0 ? 3 : total % 3 === 0 ? 2 : 1;
    return {
      seed,
      grade,
      gradeLabel: grade === 3 ? "閃光星紋" : grade === 2 ? "深翠星紋" : "白銀星紋",
      emblem: grade === 3 ? "煌" : grade === 2 ? "翠" : "銀",
      title: grade === 3 ? "新隊員候補" : grade === 2 ? "強化紋章" : "訓練素材"
    };
  });
}

export function resolveScenarioServices(scenario: MockScenario) {
  return {
    api: scenario === "offline" ? "offline" : scenario === "timeout" ? "timeout" : "online",
    media: scenario === "offline" ? "unavailable" : "placeholder_ready",
    auth: "guest",
    billing: scenario === "payment_failed" ? "payment_failed" : "sandbox_ready"
  };
}
