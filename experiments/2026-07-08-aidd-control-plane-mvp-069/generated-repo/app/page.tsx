"use client";

import { useMemo, useState } from "react";
import {
  createShrinkPlanViewModel,
  plannerStates,
  requiredBrowsers,
  type PlannerState
} from "../src/domain/budget-shrink-planner";

const stateLabels: Record<PlannerState, string> = {
  ready: "実行可能",
  brake: "予算縮小",
  stop: "実行停止",
  sanitized: "公開用サニタイズ済み"
};

export default function Home() {
  const [state, setState] = useState<PlannerState>("ready");
  const view = useMemo(() => createShrinkPlanViewModel(state), [state]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP069">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP069</p>
          <h1>Codex Run Budget Shrink Planner</h1>
          <p className="lead">
            Codex Runへ渡す前に、残り予算へ合わせてkeep_nowを絞り込みます。brakeでは1件だけ実行し、
            defer_next_incrementを次回送りに表示します。stopでは最低検証、3ブラウザ、terminal/failure screenshot、
            rollback不足をブロック理由として固定表示します。
          </p>
        </div>
        <div className={`readiness ${view.runState}`}>
          <span>run budget state</span>
          <strong>{view.runState}</strong>
          <small>{stateLabels[state]}</small>
        </div>
      </section>

      <section className="toolbar" aria-label="Budget Shrink Planner状態切替">
        {plannerStates.map((item) => (
          <button key={item} className={state === item ? "active" : ""} onClick={() => setState(item)} type="button">
            {item}
          </button>
        ))}
      </section>

      <section className="grid">
        <SummaryPanel state={state} view={view} />
        <KeepNowPanel keepNow={view.input.keepNow} deferNextIncrement={view.input.deferNextIncrement} state={state} />
        <VerificationPanel view={view} />
        <BrowserPanel coverage={view.input.browserProjects} missing={view.missingBrowser} />
        <BlockPanel reasons={view.hardBlockers} promptLeakage={view.promptLeakage} />
        <OutputPanel title="Codex prompt preview（keep_nowのみ）" body={view.input.promptPreview} />
      </section>
    </main>
  );
}

function SummaryPanel({ state, view }: { state: PlannerState; view: ReturnType<typeof createShrinkPlanViewModel> }) {
  return (
    <article className="panel primary" aria-label="Codex Run Budget Shrink Planner概要">
      <div className="panelHeader">
        <p className="eyebrow">AI Task Packet</p>
        <h2>{stateLabels[state]}</h2>
      </div>
      <dl className="detailList">
        <div>
          <dt>source packet id</dt>
          <dd>{view.input.sourcePacketId}</dd>
        </div>
        <div>
          <dt>usage band</dt>
          <dd>{view.input.usageBand}</dd>
        </div>
        <div>
          <dt>fallback action</dt>
          <dd>{view.input.fallbackAction}</dd>
        </div>
        <div>
          <dt>resume condition</dt>
          <dd>{view.input.resumeCondition}</dd>
        </div>
        <div>
          <dt>AIDD-Spec接続</dt>
          <dd>{view.input.aiddSpecConnection}</dd>
        </div>
        <div>
          <dt>sanitization scan</dt>
          <dd>{view.input.sanitizationScan}</dd>
        </div>
      </dl>
      {view.canRunShrunkPacket ? (
        <p className="note">Codex Runへ渡せます。brakeの場合はkeep_now 1件だけを実行対象にします。</p>
      ) : (
        <p className="note danger">stopです。ブロック理由を解消するまでCodex Runへ渡しません。</p>
      )}
    </article>
  );
}

function KeepNowPanel({ keepNow, deferNextIncrement, state }: { keepNow: string[]; deferNextIncrement: string[]; state: PlannerState }) {
  return (
    <article className="panel" aria-label="keep_nowとdefer_next_increment">
      <div className="panelHeader">
        <p className="eyebrow">Shrink Plan</p>
        <h2>keep_now / defer_next_increment</h2>
      </div>
      <h3>keep_now</h3>
      {keepNow.length === 0 ? <p className="muted">実行対象なし</p> : <ul className="checkList">{keepNow.map((item) => <li key={item}>{item}</li>)}</ul>}
      <h3 className="sectionLabel">defer_next_increment</h3>
      {deferNextIncrement.length === 0 ? (
        <p className="muted">次回送りなし</p>
      ) : (
        <ul className="checkList deferred">{deferNextIncrement.map((item) => <li key={item}>{item}</li>)}</ul>
      )}
      {state === "brake" ? <p className="note">brakeではkeep_nowを1件に絞り、defer_next_incrementは次回Packetへ送ります。</p> : null}
    </article>
  );
}

function VerificationPanel({ view }: { view: ReturnType<typeof createShrinkPlanViewModel> }) {
  return (
    <article className="panel" aria-label="最低検証と証跡">
      <div className="panelHeader">
        <p className="eyebrow">Verification Evidence</p>
        <h2>最低検証 / terminal / screenshot</h2>
      </div>
      <h3>minimum verification</h3>
      <ul className="checkList">{view.input.minimumVerification.map((command) => <li key={command}>{command}</li>)}</ul>
      {view.missingMinimumVerification.length ? <p className="note danger">不足: {view.missingMinimumVerification.join("、")}</p> : null}
      <h3 className="sectionLabel">evidence paths</h3>
      <ul className="checkList">{view.input.evidencePaths.map((item) => <li key={item}>{item}</li>)}</ul>
      {view.missingEvidence.length ? <p className="note danger">不足: {view.missingEvidence.join("、")}</p> : null}
    </article>
  );
}

function BrowserPanel({ coverage, missing }: { coverage: Record<(typeof requiredBrowsers)[number], string>; missing: string[] }) {
  return (
    <article className="panel" aria-label="Chromium Firefox WebKit">
      <div className="panelHeader">
        <p className="eyebrow">3 Browser E2E</p>
        <h2>Chromium / Firefox / WebKit</h2>
      </div>
      <ul className="browserList">
        {requiredBrowsers.map((browser) => (
          <li key={browser} className={coverage[browser] === "必須" ? "pass" : "skip"}>
            <span>{browser}</span>
            <strong>{coverage[browser]}</strong>
          </li>
        ))}
      </ul>
      {missing.length ? <p className="note danger">不足: {missing.join("、")}</p> : <p className="note">3ブラウザを必須として確認します。</p>}
    </article>
  );
}

function BlockPanel({ reasons, promptLeakage }: { reasons: string[]; promptLeakage: boolean }) {
  return (
    <article className="panel" aria-label="stop block reasons">
      <div className="panelHeader">
        <p className="eyebrow">Stop Reason</p>
        <h2>ブロック理由</h2>
      </div>
      {reasons.length === 0 && !promptLeakage ? (
        <p className="note">最低検証、3ブラウザ、terminal/failure screenshot、rollback、prompt sanitizationを確認済みです。</p>
      ) : (
        <ul className="findingList">
          {reasons.map((reason) => (
            <li key={reason}>
              <div>
                <h3>{reason}</h3>
                <span>stop</span>
              </div>
              <p>解消するまでCodex Runへ渡しません。</p>
            </li>
          ))}
          {promptLeakage ? (
            <li>
              <div>
                <h3>prompt混入</h3>
                <span>stop</span>
              </div>
              <p>Codex prompt previewはkeep_nowだけにし、local path / private host / private network URLを含めません。</p>
            </li>
          ) : null}
        </ul>
      )}
    </article>
  );
}

function OutputPanel({ title, body }: { title: string; body: string }) {
  return (
    <article className="panel output primary" aria-label={title}>
      <div className="panelHeader">
        <p className="eyebrow">Export</p>
        <h2>{title}</h2>
      </div>
      <pre>{body}</pre>
    </article>
  );
}
