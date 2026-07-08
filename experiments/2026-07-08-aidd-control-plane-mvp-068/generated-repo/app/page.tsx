"use client";

import { useMemo, useState } from "react";
import { createReadinessViewModel, gateStates, requiredBrowsers, type GateState } from "../src/domain/readiness-gate";

const stateLabels: Record<GateState, string> = {
  empty: "入力待ち",
  ready: "実行準備OK",
  blocked: "実行前ブロック",
  sanitized: "公開用サニタイズ済み"
};

export default function Home() {
  const [state, setState] = useState<GateState>("empty");
  const view = useMemo(() => createReadinessViewModel(state), [state]);
  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP068">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP068</p>
          <h1>One-Run Execution Readiness Gate</h1>
          <p className="lead">Smoke Finding Action Queueのexecute_now itemを、Codex Run Queueへ入れる直前に検査します。Codex command、sandbox mode、3ブラウザ、必要証跡、rollback stop condition、AIDD-Spec接続を確認し、危険な実行候補を止めます。</p>
        </div>
        <div className={`readiness ${view.readiness}`}>
          <span>run queue readiness</span>
          <strong>{view.readiness}</strong>
          <small>{stateLabels[state]}</small>
        </div>
      </section>

      <section className="toolbar" aria-label="Readiness Gate状態切替">
        {gateStates.map((item) => <button key={item} className={state === item ? "active" : ""} onClick={() => setState(item)} type="button">{item}</button>)}
      </section>

      <section className="grid">
        <SummaryPanel state={state} view={view} />
        <CommandPanel view={view} />
        <BrowserPanel coverage={view.input.browserProjects} />
        <EvidencePanel evidence={view.input.requiredEvidence} missing={view.missingEvidence} />
        <BlockPanel reasons={view.input.blockedReasons} promptLeakage={view.promptLeakage} />
        <OutputPanel title="Codex prompt preview（execute_nowのみ）" body={view.input.codexPromptPreview} />
      </section>
    </main>
  );
}

function SummaryPanel({ state, view }: { state: GateState; view: ReturnType<typeof createReadinessViewModel> }) {
  return <article className="panel primary" aria-label="One-Run Execution Readiness Gate概要">
    <div className="panelHeader"><p className="eyebrow">Source Action Queue</p><h2>{stateLabels[state]}</h2></div>
    <dl className="detailList">
      <div><dt>source queue id</dt><dd>{view.input.sourceQueueId || "未選択"}</dd></div>
      <div><dt>execute_now action id</dt><dd>{view.input.executeNowActionId || "未選択"}</dd></div>
      <div><dt>lane</dt><dd>{view.input.lane}</dd></div>
      <div><dt>ready reason</dt><dd>{view.input.readyReason}</dd></div>
      <div><dt>AIDD-Spec接続</dt><dd>{view.input.aiddSpecConnection}</dd></div>
      <div><dt>sanitization scan</dt><dd>{view.input.sanitizationScan}</dd></div>
    </dl>
    {state === "empty" ? <p className="note">emptyでは実行候補を選ばず、古いAction QueueをRun Queueへ流しません。</p> : null}
    {view.canQueue ? <p className="note">readyです。Codex Run Queueへ入れる直前の条件が揃っています。</p> : null}
  </article>;
}

function CommandPanel({ view }: { view: ReturnType<typeof createReadinessViewModel> }) {
  return <article className="panel" aria-label="Codex実行条件">
    <div className="panelHeader"><p className="eyebrow">Run Condition</p><h2>Codex command / sandbox</h2></div>
    <dl className="detailList">
      <div><dt>codex command</dt><dd>{view.input.codexCommand}</dd></div>
      <div><dt>sandbox mode</dt><dd>{view.input.sandboxMode}</dd></div>
      <div><dt>rollback stop condition</dt><dd>{view.input.rollbackStopCondition}</dd></div>
    </dl>
    <h3>required verification commands</h3>
    {view.input.requiredVerificationCommands.length === 0 ? <p className="muted">未設定</p> : <ul className="checkList">{view.input.requiredVerificationCommands.map((command) => <li key={command}><strong>{command}</strong><span>個別terminal logへ保存</span></li>)}</ul>}
  </article>;
}

function BrowserPanel({ coverage }: { coverage: Record<(typeof requiredBrowsers)[number], string> }) {
  return <article className="panel" aria-label="Chromium Firefox WebKit">
    <div className="panelHeader"><p className="eyebrow">Coverage</p><h2>Chromium / Firefox / WebKit</h2></div>
    <ul className="browserList">{requiredBrowsers.map((browser) => <li key={browser} className={coverage[browser] === "必須" ? "pass" : "skip"}><span>{browser}</span><strong>{coverage[browser]}</strong></li>)}</ul>
  </article>;
}

function EvidencePanel({ evidence, missing }: { evidence: string[]; missing: string[] }) {
  return <article className="panel" aria-label="必要証跡">
    <div className="panelHeader"><p className="eyebrow">Evidence</p><h2>terminal / screenshots / report</h2></div>
    {evidence.length === 0 ? <p className="muted">必要証跡は未設定です。</p> : <ul className="checkList">{evidence.map((item) => <li key={item}><strong>{item}</strong><span>Verification Evidenceへ保存</span></li>)}</ul>}
    {missing.length ? <p className="note danger">不足: {missing.join("、")}</p> : <p className="note">terminal evidence、failure screenshot、Playwright reportが揃っています。</p>}
  </article>;
}

function BlockPanel({ reasons, promptLeakage }: { reasons: string[]; promptLeakage: boolean }) {
  return <article className="panel" aria-label="blocked reasons">
    <div className="panelHeader"><p className="eyebrow">Gate</p><h2>実行前ブロック</h2></div>
    {reasons.length === 0 && !promptLeakage ? <p className="note">next_increment混入、危険command、sandbox不足、Firefox除外、terminal/failure screenshot不足、rollback不足、local path/private URL、AIDD-Spec接続不足は検出されていません。</p> : <ul className="findingList">{reasons.map((reason) => <li key={reason}><div><h3>{reason}</h3><span>blocked</span></div><p>解消するまでCodex Run Queueへ渡しません。</p></li>)}{promptLeakage ? <li><div><h3>execute_now以外または公開危険文字列のprompt混入</h3><span>blocked</span></div><p>Codex prompt previewはexecute_nowだけ、公開可能な文字列だけにしてください。</p></li> : null}</ul>}
  </article>;
}

function OutputPanel({ title, body }: { title: string; body: string }) {
  return <article className="panel output primary" aria-label={title}><div className="panelHeader"><p className="eyebrow">Export</p><h2>{title}</h2></div><pre>{body}</pre></article>;
}
