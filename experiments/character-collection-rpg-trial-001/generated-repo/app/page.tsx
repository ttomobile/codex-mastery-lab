"use client";

import { useEffect, useMemo, useState } from "react";
import {
  advanceBattleTurn,
  calculateReadinessScore,
  canRecruitFromGacha,
  canUsePremiumTraining,
  evaluateRewardClaim,
  mapGachaResults,
  previewBattleCommand,
  swapPartyMember,
  trainCharacter,
  type BattleLog,
  type BattleCommand,
  type Character,
  type MockScenario,
  type Quest,
  type Reward
} from "../src/domain/rpg";

type MockState = {
  scenario: MockScenario;
  roster: Character[];
  party: string[];
  quests: Quest[];
  rewards: Reward[];
  rewardLedger: {
    claimed: boolean;
    claimId: string;
    evidencePath: string;
    claimedAt?: string;
  };
  battle: {
    enemyName: string;
    heroHp: number;
    enemyHp: number;
    turn: number;
    logs: BattleLog[];
  };
  gachaSeeds: string[];
  services: {
    api: string;
    media: string;
    auth: string;
    billing: string;
  };
};

const mockBaseUrl = process.env.NEXT_PUBLIC_MOCK_BASE_URL ?? "http://127.0.0.1:4100";
const asset = (name: string) => `/game-assets/${name}`;

const tabs = [
  { id: "home", label: "ホーム" },
  { id: "roster", label: "名簿" },
  { id: "party", label: "編成" },
  { id: "quest", label: "遠征" },
  { id: "battle", label: "戦闘" },
  { id: "reward", label: "報酬" },
  { id: "gacha", label: "幻晶" },
  { id: "training", label: "育成" },
  { id: "state", label: "状態" }
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Page() {
  const [state, setState] = useState<MockState | null>(null);
  const [localRoster, setLocalRoster] = useState<Character[]>([]);
  const [localParty, setLocalParty] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [battleCommand, setBattleCommand] = useState<BattleCommand>("通常攻撃");

  async function loadState() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${mockBaseUrl}/state`, { cache: "no-store" });
      if (!response.ok) throw new Error(`mock state error: ${response.status}`);
      const nextState = (await response.json()) as MockState;
      setState(nextState);
      setLocalRoster(nextState.roster);
      setLocalParty(nextState.party);
    } catch {
      setError("mock serviceに接続できません。状態画面でofflineとして扱います。");
    } finally {
      setLoading(false);
    }
  }

  async function changeScenario(scenario: MockScenario) {
    await fetch(`${mockBaseUrl}/__control/state`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ scenario })
    });
    await loadState();
  }

  async function postAction(path: string, body: Record<string, string>) {
    const response = await fetch(`${mockBaseUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = (await response.json()) as { ok?: boolean; message?: string; state?: MockState };
    if (!response.ok || !payload.state) throw new Error(payload.message ?? "mock action failed");
    setState(payload.state);
    setLocalRoster(payload.state.roster);
    setLocalParty(payload.state.party);
    return payload.state;
  }

  async function persistSwap(outId: string, inId: string) {
    setLocalParty((party) => swapPartyMember(party, outId, inId));
    await postAction("/actions/swap-party", { outId, inId });
  }

  async function persistTrain(id: string) {
    setLocalRoster((roster) => roster.map((character) => (character.id === id ? trainCharacter(character) : character)));
    await postAction("/actions/train", { id });
  }

  async function persistRecruit(seed: string) {
    await postAction("/actions/recruit", { seed });
  }

  async function persistRewardClaim() {
    await postAction("/actions/claim-reward", {});
  }

  useEffect(() => {
    // 初回表示時に外部mock serviceから現在状態を同期する。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadState();
  }, []);

  const partyMembers = useMemo(() => {
    return localParty
      .map((id) => localRoster.find((character) => character.id === id))
      .filter((character): character is Character => Boolean(character));
  }, [localParty, localRoster]);

  const readiness = calculateReadinessScore(partyMembers);
  const gachaResults = state ? mapGachaResults(state.gachaSeeds) : [];
  const nextBattle = state ? advanceBattleTurn(state.battle, partyMembers) : null;
  const commandPreview = state ? previewBattleCommand(state.battle, partyMembers, battleCommand) : null;
  const canBattle = readiness.valid && state?.scenario !== "party_invalid";
  const isFailure = state?.scenario === "offline" || state?.scenario === "timeout" || state?.scenario === "payment_failed" || state?.scenario === "media_failure" || Boolean(error);

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="SagaForge Trial 001">
        <header className="top-bar">
          <div>
            <p className="eyebrow">SagaForge Trial 001</p>
            <h1>星紋遠征隊</h1>
          </div>
          <span className={`status-pill ${isFailure ? "danger" : "ok"}`} data-testid="status-pill">
            {isFailure ? "要確認" : "稼働中"}
          </span>
        </header>

        <nav className="tab-strip" aria-label="画面切替">
          {tabs.map((tab) => (
            <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </nav>

        {loading ? <div className="panel">状態を読み込み中...</div> : null}
        {error ? <FailurePanel message={error} scenario="offline" /> : null}
        {!loading && state ? (
          <div className="screen-stack">
            {activeTab === "home" ? <HomeScreen state={state} readiness={readiness.score} /> : null}
            {activeTab === "roster" ? <RosterScreen roster={localRoster} /> : null}
            {activeTab === "party" ? <PartyScreen roster={localRoster} party={localParty} onSwap={persistSwap} members={partyMembers} readiness={readiness} canBattle={canBattle} /> : null}
            {activeTab === "quest" ? <QuestScreen quests={state.quests} /> : null}
            {activeTab === "battle" ? <BattleScreen state={state} nextBattle={nextBattle} commandPreview={commandPreview} command={battleCommand} onCommand={setBattleCommand} canBattle={canBattle} /> : null}
            {activeTab === "reward" ? <RewardScreen state={state} onClaim={persistRewardClaim} /> : null}
            {activeTab === "gacha" ? <GachaScreen results={gachaResults} billing={state.services.billing} media={state.services.media} roster={localRoster} onRecruit={persistRecruit} /> : null}
            {activeTab === "training" ? <TrainingScreen roster={localRoster} auth={state.services.auth} onTrain={persistTrain} /> : null}
            {activeTab === "state" ? <StateScreen state={state} onChange={changeScenario} /> : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function HomeScreen({ state, readiness }: { state: MockState; readiness: number }) {
  const hero = state.roster[0];
  return (
    <section className="screen" data-testid="home-screen">
      <div className="hero-panel premium-hero">
        <div className="key-art" role="img" aria-label="星紋遠征隊のオリジナル隊員キービジュアル" style={{ backgroundImage: `url(${asset("party-key-art.png")})` }}>
          <span>{hero ? hero.symbol : "星"}</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">今日の任務</p>
          <h2>裂光の丘を調査</h2>
          <p>オリジナル隊員と幻晶演出を使い、編成、遠征、戦闘、報酬までの流れをmock状態で検証します。</p>
        </div>
      </div>
      <div className="metric-grid">
        <Metric label="所持隊員" value={`${state.roster.length}名`} />
        <Metric label="準備度" value={`${readiness}点`} />
        <Metric label="幻晶" value={state.scenario === "payment_failed" ? "決済失敗" : "12個"} />
      </div>
    </section>
  );
}

function RosterScreen({ roster }: { roster: Character[] }) {
  if (roster.length === 0) return <FailurePanel scenario="empty_roster" message="隊員名簿が空です。編成と遠征を開始できません。" />;
  return (
    <section className="screen" data-testid="roster-screen">
      {roster.map((character) => (
        <article className="character-card" key={character.id}>
          <span className="avatar">{character.symbol}</span>
          <div>
            <h3>{character.name}</h3>
            <p>{character.role} / 星紋{character.rank}</p>
          </div>
          <strong>Lv.{character.level}</strong>
        </article>
      ))}
    </section>
  );
}

function PartyScreen({
  roster,
  party,
  onSwap,
  members,
  readiness,
  canBattle
}: {
  roster: Character[];
  party: string[];
  onSwap: (outId: string, inId: string) => Promise<void>;
  members: Character[];
  readiness: ReturnType<typeof calculateReadinessScore>;
  canBattle: boolean;
}) {
  const reserves = roster.filter((member) => !party.includes(member.id));
  return (
    <section className="screen" data-testid="party-screen">
      <div className={`panel ${canBattle ? "" : "warning"}`}>
        <h2>{canBattle ? "出撃可能な編成" : "編成条件を確認"}</h2>
        <p>{readiness.reason}</p>
      </div>
      <div className="party-art-strip" role="img" aria-label="出撃前の隊員ビジュアル" style={{ backgroundImage: `url(${asset("party-key-art.png")})` }} />
      <div className="party-grid">
        {members.map((member, index) => (
          <div className="party-slot" key={member.id}>
            <span className="avatar small">{member.symbol}</span>
            <strong>{member.name}</strong>
            <span>{member.role}</span>
            {reserves[0] ? (
              <button data-testid={`swap-${index}`} onClick={() => void onSwap(member.id, reserves[0].id)}>
                {reserves[0].name}と交替
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <p className="helper-text" data-testid="party-order">現在の隊列: {members.map((member) => member.name).join(" / ")}</p>
    </section>
  );
}

function QuestScreen({ quests }: { quests: Quest[] }) {
  return (
    <section className="screen" data-testid="quest-screen">
      {quests.map((quest) => (
        <article className="quest-row" key={quest.id}>
          <div>
            <h3>{quest.title}</h3>
            <p>{quest.summary}</p>
          </div>
          <span>推奨{quest.requiredPower}</span>
        </article>
      ))}
    </section>
  );
}

function BattleScreen({
  state,
  nextBattle,
  commandPreview,
  command,
  onCommand,
  canBattle
}: {
  state: MockState;
  nextBattle: MockState["battle"] | null;
  commandPreview: MockState["battle"] | null;
  command: BattleCommand;
  onCommand: (command: BattleCommand) => void;
  canBattle: boolean;
}) {
  const resolved = state.scenario === "battle_win" || state.scenario === "battle_lose";
  const visibleBattle = commandPreview ?? nextBattle;
  const mediaFailed = state.services.media === "render_failed";
  return (
    <section className="screen" data-testid="battle-screen">
      {!canBattle ? <FailurePanel scenario="party_invalid" message="前衛と支援の組み合わせが不足しています。" /> : null}
      {mediaFailed ? <FailurePanel scenario="media_failure" message="戦闘背景と敵演出のmock media取得に失敗しました。ログとHPで進行を継続します。" /> : null}
      {canBattle ? (
        <>
          <div className="battle-stage" role="img" aria-label="星紋遠征隊と晶狼の戦闘シーン" style={{ backgroundImage: `linear-gradient(180deg, rgba(9,11,20,.08), rgba(9,11,20,.86)), url(${asset("battle-ruins.png")})` }}>
            <div className="party-silhouettes">
              {partyMembersLabel(state).map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className={`enemy-portrait ${mediaFailed ? "media-broken" : ""}`} style={{ backgroundImage: mediaFailed ? "none" : `url(${asset("crystal-guardian.png")})` }}>
              <span>{state.battle.enemyName}</span>
            </div>
            <div className="skill-flash">星紋連携</div>
          </div>
          <div className={`result-banner ${state.scenario === "battle_lose" ? "lose" : "win"}`} data-testid="battle-result">
            {resolved ? (state.scenario === "battle_win" ? "勝利: 星屑報酬を獲得" : "敗北: 再編成が必要") : "交戦中: 次のターンを予測"}
          </div>
          <div className="command-panel" aria-label="戦闘コマンド">
            {(["通常攻撃", "防御", "星紋技"] as BattleCommand[]).map((item) => (
              <button key={item} className={command === item ? "active" : ""} onClick={() => onCommand(item)}>
                {item}
              </button>
            ))}
          </div>
          <p className="helper-text" data-testid="selected-command">選択中: {command}</p>
          <div className="battle-meter">
            <span><b>隊列HP</b><i style={{ width: `${visibleBattle?.heroHp ?? state.battle.heroHp}%` }} />{visibleBattle?.heroHp ?? state.battle.heroHp}</span>
            <span><b>{state.battle.enemyName}</b><i className="enemy" style={{ width: `${visibleBattle?.enemyHp ?? state.battle.enemyHp}%` }} />{visibleBattle?.enemyHp ?? state.battle.enemyHp}</span>
          </div>
          <ul className="log-list battle-log">
            {(visibleBattle?.logs ?? state.battle.logs).map((log) => (
              <li key={log.id}>{log.text}</li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

function RewardScreen({ state, onClaim }: { state: MockState; onClaim: () => Promise<void> }) {
  const claim = evaluateRewardClaim(state.rewards, state.services.billing, state.rewardLedger.claimed);
  return (
    <section className="screen" data-testid="reward-screen">
      <div className={`panel ${claim.claimable ? "" : "warning"}`}>
        <p className="eyebrow">Reward Evidence Ledger</p>
        <h2>報酬受取台帳</h2>
        <p data-testid="reward-claim-state">{claim.state}: {claim.reason}</p>
      </div>
      {state.rewards.length === 0 ? <FailurePanel scenario="reward_pending" message="勝利ログがまだないため、報酬は保留です。battle_winのmock状態で確定報酬を確認します。" /> : null}
      <div className="reward-ledger">
        <div>
          <span>claim id</span>
          <strong>{state.rewardLedger.claimId}</strong>
        </div>
        <div>
          <span>evidence</span>
          <strong>{state.rewardLedger.evidencePath}</strong>
        </div>
        <div>
          <span>claimed at</span>
          <strong>{state.rewardLedger.claimedAt ?? "未記録"}</strong>
        </div>
      </div>
      <div className="reward-grid">
        {state.rewards.map((reward) => (
          <article className="reward-card" key={reward.id}>
            <span>{reward.label}</span>
            <strong>{reward.amount}</strong>
          </article>
        ))}
      </div>
      <button data-testid="claim-reward" disabled={!claim.claimable} onClick={() => void onClaim()}>
        {claim.state === "受取済" ? "受取済み" : claim.claimable ? "報酬を受け取る" : "報酬保留"}
      </button>
    </section>
  );
}

function GachaScreen({
  results,
  billing,
  media,
  roster,
  onRecruit
}: {
  results: ReturnType<typeof mapGachaResults>;
  billing: string;
  media: string;
  roster: Character[];
  onRecruit: (seed: string) => Promise<void>;
}) {
  const canRecruit = canRecruitFromGacha(billing);
  const mediaFailed = media === "render_failed";
  return (
    <section className="screen" data-testid="gacha-screen">
      <div className={`summon-stage ${mediaFailed ? "media-broken" : ""}`} role="img" aria-label="幻晶召喚のオリジナル演出" style={{ backgroundImage: mediaFailed ? "linear-gradient(180deg, #2a1435, #0b1020)" : `linear-gradient(180deg, rgba(5,8,18,.06), rgba(5,8,18,.76)), url(${asset("summon-altar.png")})` }}>
        <div className="summon-orb">幻晶解放</div>
      </div>
      {mediaFailed ? <FailurePanel scenario="media_failure" message="召喚演出のmock media取得に失敗しました。結果カードだけ安全に表示します。" /> : null}
      {billing === "payment_failed" ? <FailurePanel scenario="payment_failed" message="幻晶購入のmock決済が失敗しました。無料演出だけ表示します。" /> : null}
      <div className="result-grid">
        {results.map((result, index) => (
          <article className={`crystal-card grade-${result.grade}`} key={result.seed}>
            <span>{result.emblem}</span>
            <strong>{index === 0 ? "新隊員候補" : result.title}</strong>
            <small>{result.gradeLabel}</small>
            {index === 0 ? (
              <button data-testid={`recruit-${result.seed}`} disabled={!canRecruit} onClick={() => void onRecruit(result.seed)}>
                {canRecruit ? "名簿に迎える" : "加入不可"}
              </button>
            ) : null}
          </article>
        ))}
      </div>
      <p className="helper-text" data-testid="roster-count-after-gacha">現在の名簿: {roster.length}名</p>
    </section>
  );
}

function TrainingScreen({ roster, auth, onTrain }: { roster: Character[]; auth: string; onTrain: (id: string) => Promise<void> }) {
  const premiumTraining = canUsePremiumTraining(auth);
  return (
    <section className="screen" data-testid="training-screen">
      <div className={`panel ${premiumTraining ? "" : "warning"}`} data-testid="training-auth-note">
        <h2>{premiumTraining ? "プレミアム育成枠が有効" : "通常育成枠"}</h2>
        <p>{premiumTraining ? "mock authがpremiumのため、強化時に追加戦力ボーナスを付与します。" : "anonymous / guestでは通常強化のみ実行できます。"}</p>
      </div>
      {roster.slice(0, 3).map((character) => (
        <article className="training-row" key={character.id}>
          <span className="avatar small">{character.symbol}</span>
          <div>
            <h3>{character.name}</h3>
            <p data-testid={`training-${character.id}`}>Lv.{character.level} / 戦力{character.power} / 次の星紋解放まで {Math.max(1, 30 - character.level)} 点</p>
          </div>
          <button onClick={() => void onTrain(character.id)}>強化</button>
        </article>
      ))}
    </section>
  );
}

function StateScreen({ state, onChange }: { state: MockState; onChange: (scenario: MockScenario) => Promise<void> }) {
  const scenarios: MockScenario[] = [
    "success",
    "empty_roster",
    "offline",
    "timeout",
    "battle_win",
    "battle_lose",
    "party_invalid",
    "gacha_result",
    "media_failure",
    "payment_failed",
    "auth_anonymous",
    "auth_premium"
  ];
  return (
    <section className="screen" data-testid="state-screen">
      <div className="panel">
        <h2>mock状態</h2>
        <p data-testid="current-scenario">{state.scenario}</p>
        <dl className="service-list">
          {Object.entries(state.services).map(([name, value]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="state-buttons">
        {scenarios.map((scenario) => (
          <button key={scenario} onClick={() => void onChange(scenario)}>
            {scenario}
          </button>
        ))}
      </div>
    </section>
  );
}

function FailurePanel({ scenario, message }: { scenario: string; message: string }) {
  return (
    <section className="panel failure" data-testid="failure-panel">
      <p className="eyebrow">{scenario}</p>
      <h2>状態を確認してください</h2>
      <p>{message}</p>
    </section>
  );
}

function partyMembersLabel(state: MockState) {
  return state.party
    .map((id) => state.roster.find((character) => character.id === id)?.symbol)
    .filter((symbol): symbol is string => Boolean(symbol));
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
