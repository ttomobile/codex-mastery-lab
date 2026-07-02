export type MockScenario =
  | "success"
  | "empty_roster"
  | "offline"
  | "timeout"
  | "battle_win"
  | "battle_lose"
  | "party_invalid"
  | "gacha_result"
  | "media_failure"
  | "payment_failed"
  | "auth_anonymous"
  | "auth_premium";

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

export type BattleCommand = "通常攻撃" | "防御" | "星紋技";

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

export function previewBattleCommand(state: BattleState, party: Character[], command: BattleCommand): BattleState {
  const readiness = calculateReadinessScore(party);
  const commandBonus = command === "星紋技" ? 18 : command === "防御" ? -8 : 0;
  const guardBonus = command === "防御" ? 12 : 0;
  const heroDamage = Math.max(6, (readiness.valid ? 24 : 10) + commandBonus);
  const enemyDamage = Math.max(0, (readiness.valid ? 12 : 24) - guardBonus);
  const nextEnemyHp = Math.max(0, state.enemyHp - heroDamage);

  return {
    ...state,
    enemyHp: nextEnemyHp,
    heroHp: Math.max(0, state.heroHp - (nextEnemyHp === 0 ? 0 : enemyDamage)),
    logs: [
      ...state.logs,
      {
        id: `command-${state.turn}-${command}`,
        text: `${command}を選択: 敵へ${heroDamage}点、被害${nextEnemyHp === 0 ? 0 : enemyDamage}点の予測。`
      }
    ]
  };
}

export function swapPartyMember(party: string[], outId: string, inId: string) {
  if (!party.includes(outId) || party.includes(inId)) return party;
  return party.map((id) => (id === outId ? inId : id));
}

export function trainCharacter(character: Character): Character {
  return {
    ...character,
    level: character.level + 1,
    power: character.power + (character.rank === 3 ? 42 : character.rank === 2 ? 34 : 26)
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

export function createRecruitFromSeed(seed: string): Character {
  const total = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return {
    id: `recruit-${seed}`,
    name: `星紋候補${total % 100}`,
    role: total % 2 === 0 ? "前衛" : "支援",
    rank: total % 5 === 0 ? 3 : 2,
    level: 28,
    power: 430 + (total % 80),
    symbol: total % 2 === 0 ? "槍" : "灯"
  };
}

export function resolveScenarioServices(scenario: MockScenario) {
  return {
    api: scenario === "offline" ? "offline" : scenario === "timeout" ? "timeout" : "online",
    media: scenario === "offline" ? "unavailable" : scenario === "media_failure" ? "render_failed" : "placeholder_ready",
    auth: scenario === "auth_premium" ? "premium" : scenario === "auth_anonymous" ? "anonymous" : "guest",
    billing: scenario === "payment_failed" ? "payment_failed" : "sandbox_ready"
  };
}

export function canUsePremiumTraining(auth: string) {
  return auth === "premium";
}

export function canRecruitFromGacha(billing: string) {
  return billing !== "payment_failed";
}
