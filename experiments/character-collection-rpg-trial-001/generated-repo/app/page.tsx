"use client";

import { useEffect, useMemo, useState } from "react";
import {
  advanceBattleTurn,
  calculateReadinessScore,
  mapGachaResults,
  type BattleLog,
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

const tabs = [
  { id: "home", label: "ホーム" },
  { id: "roster", label: "名簿" },
  { id: "party", label: "編成" },
  { id: "quest", label: "遠征" },
  { id: "battle", label: "戦闘" },
  { id: "gacha", label: "幻晶" },
  { id: "training", label: "育成" },
  { id: "state", label: "状態" }
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Page() {
  const [state, setState] = useState<MockState | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadState() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${mockBaseUrl}/state`, { cache: "no-store" });
      if (!response.ok) throw new Error(`mock state error: ${response.status}`);
      const nextState = (await response.json()) as MockState;
      setState(nextState);
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

  useEffect(() => {
    // 初回表示時に外部mock serviceから現在状態を同期する。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadState();
  }, []);

  const partyMembers = useMemo(() => {
    if (!state) return [];
    return state.party
      .map((id) => state.roster.find((character) => character.id === id))
      .filter((character): character is Character => Boolean(character));
  }, [state]);

  const readiness = calculateReadinessScore(partyMembers);
  const gachaResults = state ? mapGachaResults(state.gachaSeeds) : [];
  const nextBattle = state ? advanceBattleTurn(state.battle, partyMembers) : null;
  const canBattle = readiness.valid && state?.scenario !== "party_invalid";
  const isFailure = state?.scenario === "offline" || state?.scenario === "timeout" || state?.scenario === "payment_failed" || Boolean(error);

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
            {activeTab === "roster" ? <RosterScreen roster={state.roster} /> : null}
            {activeTab === "party" ? <PartyScreen members={partyMembers} readiness={readiness} canBattle={canBattle} /> : null}
            {activeTab === "quest" ? <QuestScreen quests={state.quests} /> : null}
            {activeTab === "battle" ? <BattleScreen state={state} nextBattle={nextBattle} canBattle={canBattle} /> : null}
            {activeTab === "gacha" ? <GachaScreen results={gachaResults} billing={state.services.billing} /> : null}
            {activeTab === "training" ? <TrainingScreen roster={state.roster} /> : null}
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
      <div className="hero-panel">
        <div className="crest" aria-hidden="true">
          {hero ? hero.symbol : "星"}
        </div>
        <div>
          <p className="eyebrow">今日の任務</p>
          <h2>裂光の丘を調査</h2>
          <p>編成、遠征、戦闘、報酬までの流れをmock状態で検証します。</p>
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
  members,
  readiness,
  canBattle
}: {
  members: Character[];
  readiness: ReturnType<typeof calculateReadinessScore>;
  canBattle: boolean;
}) {
  return (
    <section className="screen" data-testid="party-screen">
      <div className={`panel ${canBattle ? "" : "warning"}`}>
        <h2>{canBattle ? "出撃可能な編成" : "編成条件を確認"}</h2>
        <p>{readiness.reason}</p>
      </div>
      <div className="party-grid">
        {members.map((member) => (
          <div className="party-slot" key={member.id}>
            <span className="avatar small">{member.symbol}</span>
            <strong>{member.name}</strong>
            <span>{member.role}</span>
          </div>
        ))}
      </div>
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

function BattleScreen({ state, nextBattle, canBattle }: { state: MockState; nextBattle: MockState["battle"] | null; canBattle: boolean }) {
  const resolved = state.scenario === "battle_win" || state.scenario === "battle_lose";
  return (
    <section className="screen" data-testid="battle-screen">
      {!canBattle ? <FailurePanel scenario="party_invalid" message="前衛と支援の組み合わせが不足しています。" /> : null}
      {canBattle ? (
        <>
          <div className={`result-banner ${state.scenario === "battle_lose" ? "lose" : "win"}`} data-testid="battle-result">
            {resolved ? (state.scenario === "battle_win" ? "勝利: 星屑報酬を獲得" : "敗北: 再編成が必要") : "交戦中: 次のターンを予測"}
          </div>
          <div className="battle-meter">
            <span>隊列HP {state.battle.heroHp}</span>
            <span>{state.battle.enemyName} HP {state.battle.enemyHp}</span>
          </div>
          <ul className="log-list">
            {(nextBattle?.logs ?? state.battle.logs).map((log) => (
              <li key={log.id}>{log.text}</li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

function GachaScreen({ results, billing }: { results: ReturnType<typeof mapGachaResults>; billing: string }) {
  return (
    <section className="screen" data-testid="gacha-screen">
      {billing === "payment_failed" ? <FailurePanel scenario="payment_failed" message="幻晶購入のmock決済が失敗しました。無料演出だけ表示します。" /> : null}
      <div className="result-grid">
        {results.map((result) => (
          <article className={`crystal-card grade-${result.grade}`} key={result.seed}>
            <span>{result.emblem}</span>
            <strong>{result.title}</strong>
            <small>{result.gradeLabel}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrainingScreen({ roster }: { roster: Character[] }) {
  return (
    <section className="screen" data-testid="training-screen">
      {roster.slice(0, 3).map((character) => (
        <article className="training-row" key={character.id}>
          <span className="avatar small">{character.symbol}</span>
          <div>
            <h3>{character.name}</h3>
            <p>次の星紋解放まで {Math.max(1, 30 - character.level)} 点</p>
          </div>
          <button>強化</button>
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
    "payment_failed"
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
