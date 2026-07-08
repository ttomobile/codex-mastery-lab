"use client";

import { useMemo, useState } from "react";
import { createActionQueueViewModel, queueStates, requiredBrowsers, type QueueState, type SmokeFindingAction } from "../src/domain/digest-publisher";

const stateLabels: Record<QueueState, string> = {
  empty: "入力待ち",
  queued: "行動キュー化",
  blocked: "実行前ブロック",
  exported: "execute_now書き出し"
};

export default function Home() {
  const [state, setState] = useState<QueueState>("empty");
  const view = useMemo(() => createActionQueueViewModel(state), [state]);
  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP067">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP067</p>
          <h1>Smoke Finding Action Queue</h1>
          <p className="lead">Public Preview Smoke Verifierで見つけた壊れたasset、0 byte画像、private URL、証跡不足を、Review Finding Action Queueへ変換します。AIDD-Spec v0.1のVerification Evidence / Review Record / Learning Logへ戻し、execute_nowだけを次回Codex promptへ渡します。</p>
        </div>
        <div className={`readiness ${view.readiness}`}>
          <span>one-run readiness</span>
          <strong>{view.readiness}</strong>
          <small>{stateLabels[state]}</small>
        </div>
      </section>

      <section className="toolbar" aria-label="Action Queue状態切替">
        {queueStates.map((item) => <button key={item} className={state === item ? "active" : ""} onClick={() => setState(item)} type="button">{item}</button>)}
      </section>

      <section className="grid">
        <SummaryPanel state={state} view={view} />
        <LanePanel title="execute_now" actions={view.executeNow} />
        <LanePanel title="next_increment" actions={view.nextIncrement} />
        <LanePanel title="learning_log" actions={view.learningLog} />
        <BrowserPanel coverage={view.input.browserCoverage} />
        <BlockPanel reasons={view.input.blockedReasons} promptLeakage={view.promptLeakage} />
        <ActionTable actions={view.input.actions} />
        <OutputPanel title="AI Task Packet patch preview" body={state === "empty" ? "未生成" : view.packetPatchPreview} />
        <OutputPanel title="Codex prompt preview（execute_nowのみ）" body={state === "empty" ? "未生成" : view.codexPromptPreview} />
      </section>
    </main>
  );
}

function SummaryPanel({ state, view }: { state: QueueState; view: ReturnType<typeof createActionQueueViewModel> }) {
  return <article className="panel primary" aria-label="Smoke Finding Action Queue概要">
    <div className="panelHeader"><p className="eyebrow">Source Smoke</p><h2>{stateLabels[state]}</h2></div>
    <dl className="detailList">
      <div><dt>source smoke run id</dt><dd>{view.input.sourceSmokeRunId || "未選択"}</dd></div>
      <div><dt>article path</dt><dd>{view.input.articlePath || "未選択"}</dd></div>
      <div><dt>summary</dt><dd>{view.input.summary}</dd></div>
      <div><dt>terminal evidence image response</dt><dd>{view.input.terminalEvidenceImageResponse}</dd></div>
      <div><dt>AIDD-Spec接続</dt><dd>{view.input.aiddSpecConnection}</dd></div>
    </dl>
    {state === "empty" ? <p className="note">emptyでは古いsmoke結果を使い回さず、入力待ちとして止めます。</p> : null}
    {state === "blocked" ? <p className="note danger">blockedではReview Findingを実行キューへ進めません。</p> : null}
  </article>;
}

function LanePanel({ title, actions }: { title: string; actions: SmokeFindingAction[] }) {
  return <article className="panel" aria-label={`${title} lane`}>
    <div className="panelHeader"><p className="eyebrow">Lane</p><h2>{title}</h2></div>
    {actions.length === 0 ? <p className="muted">対象なし</p> : <ul className="checkList">{actions.map((action) => <li key={action.id}><strong>{action.id}</strong><span>{action.findingCategory}</span><small>{action.priorityReason}</small></li>)}</ul>}
  </article>;
}

function BrowserPanel({ coverage }: { coverage: Record<(typeof requiredBrowsers)[number], string> }) {
  return <article className="panel" aria-label="Chromium Firefox WebKit">
    <div className="panelHeader"><p className="eyebrow">Coverage</p><h2>Chromium / Firefox / WebKit</h2></div>
    <ul className="browserList">{requiredBrowsers.map((browser) => <li key={browser} className={coverage[browser] === "通過" ? "pass" : "skip"}><span>{browser}</span><strong>{coverage[browser]}</strong></li>)}</ul>
  </article>;
}

function BlockPanel({ reasons, promptLeakage }: { reasons: string[]; promptLeakage: boolean }) {
  return <article className="panel" aria-label="blocked reasons">
    <div className="panelHeader"><p className="eyebrow">Gate</p><h2>実行前ブロック</h2></div>
    {reasons.length === 0 && !promptLeakage ? <p className="note">private URL、local path、Firefox不足、terminal evidence不足、AIDD-Spec接続不足は検出されていません。</p> : <ul className="findingList">{reasons.map((reason) => <li key={reason}><div><h3>{reason}</h3><span>blocked</span></div><p>解消するまでCodex Run Queueへ渡しません。</p></li>)}{promptLeakage ? <li><div><h3>execute_now以外のprompt混入</h3><span>blocked</span></div><p>next_increment / learning_log は今回のCodex promptから除外してください。</p></li> : null}</ul>}
  </article>;
}

function ActionTable({ actions }: { actions: SmokeFindingAction[] }) {
  return <article className="panel primary" aria-label="Review Finding Action Queue">
    <div className="panelHeader"><p className="eyebrow">Review Finding Action Queue</p><h2>Smoke失敗から次の行動へ</h2></div>
    {actions.length === 0 ? <p className="muted">Action Queueは未生成です。</p> : <div className="urlTable"><div className="urlTableHead"><span>ID</span><span>broken URL</span><span>status / bytes</span><span>lane</span><span>verification</span></div>{actions.map((action) => <div className={`urlRow ${action.lane}`} key={action.id}><span><strong>{action.id}</strong><small>{action.findingCategory}</small></span><span>{action.brokenUrl}</span><span>{action.httpStatus} / {action.byteSize}</span><span>{action.lane}</span><span>{action.verificationCommands.join(" / ")}</span></div>)}</div>}
  </article>;
}

function OutputPanel({ title, body }: { title: string; body: string }) {
  return <article className="panel output" aria-label={title}><div className="panelHeader"><p className="eyebrow">Export</p><h2>{title}</h2></div><pre>{body}</pre></article>;
}
