"use client";

import { useMemo, useState } from "react";
import {
  createHandoffReceiptViewModel,
  receiptStates,
  requiredBrowsers,
  type ReceiptState
} from "../src/domain/handoff-receipt";

const stateLabels: Record<ReceiptState, string> = {
  empty: "未選択",
  valid: "手渡し可能",
  blocked: "ブロック"
};

export default function Home() {
  const [state, setState] = useState<ReceiptState>("empty");
  const view = useMemo(() => createHandoffReceiptViewModel(state), [state]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP070">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP070</p>
          <h1>Shrunk Packet Handoff Receipt</h1>
          <p className="lead">
            MVP069で小さく畳んだAI Task Packetを、Codexへ渡す直前の手渡しレシートとして確認します。
            execute_nowだけをpromptへ入れ、defer_next_increment、3ブラウザ不足、証跡不足、rollback不足、公開危険文字列を混ぜないための入口です。
          </p>
        </div>
        <div className={`readiness ${view.receiptStatus}`}>
          <span>handoff receipt state</span>
          <strong>{view.receiptStatus}</strong>
          <small>{stateLabels[state]}</small>
        </div>
      </section>

      <section className="toolbar" aria-label="Handoff Receipt状態切替">
        {receiptStates.map((item) => (
          <button key={item} className={state === item ? "active" : ""} onClick={() => setState(item)} type="button">
            {item}
          </button>
        ))}
      </section>

      <section className="grid">
        <SummaryPanel state={state} view={view} />
        <ExecutionPanel executeNow={view.input.executeNow} deferNextIncrement={view.input.deferNextIncrement} />
        <VerificationPanel view={view} />
        <BrowserPanel coverage={view.input.browserProjects} missing={view.missingBrowsers} />
        <BlockPanel reasons={view.blockers} unsafePrompt={view.unsafePrompt} />
        <OutputPanel title="Codex prompt preview（execute_nowのみ）" body={view.input.codexPromptPreview} />
      </section>
    </main>
  );
}

function SummaryPanel({ state, view }: { state: ReceiptState; view: ReturnType<typeof createHandoffReceiptViewModel> }) {
  return (
    <article className="panel primary" aria-label="Shrunk Packet Handoff Receipt概要">
      <div className="panelHeader">
        <p className="eyebrow">Handoff Receipt</p>
        <h2>{stateLabels[state]}</h2>
      </div>
      <dl className="detailList">
        <div>
          <dt>source shrink plan</dt>
          <dd>{view.input.sourceShrinkPlan}</dd>
        </div>
        <div>
          <dt>decision note</dt>
          <dd>{view.input.decisionNote}</dd>
        </div>
        <div>
          <dt>rollback condition</dt>
          <dd>{view.input.rollbackCondition}</dd>
        </div>
        <div>
          <dt>AIDD-Spec接続</dt>
          <dd>{view.input.aiddSpecConnection}</dd>
        </div>
      </dl>
      {view.canHandoff ? (
        <p className="note">Codexへ渡せます。execute_nowだけを実行し、defer_next_incrementは次回へ送ります。</p>
      ) : (
        <p className="note danger">blockedです。ブロック理由を解消するまでCodexへ渡しません。</p>
      )}
    </article>
  );
}

function ExecutionPanel({ executeNow, deferNextIncrement }: { executeNow: string[]; deferNextIncrement: string[] }) {
  return (
    <article className="panel" aria-label="execute_nowとdefer_next_increment">
      <div className="panelHeader">
        <p className="eyebrow">Shrunk Packet</p>
        <h2>execute_now / defer_next_increment</h2>
      </div>
      <h3>execute_now</h3>
      {executeNow.length === 0 ? <p className="muted">実行対象なし</p> : <ul className="checkList">{executeNow.map((item) => <li key={item}>{item}</li>)}</ul>}
      <h3 className="sectionLabel">defer_next_increment</h3>
      {deferNextIncrement.length === 0 ? <p className="muted">次回送りなし</p> : <ul className="checkList deferred">{deferNextIncrement.map((item) => <li key={item}>{item}</li>)}</ul>}
      <p className="note">Codex prompt previewへ入れるのはexecute_nowだけです。</p>
    </article>
  );
}

function VerificationPanel({ view }: { view: ReturnType<typeof createHandoffReceiptViewModel> }) {
  return (
    <article className="panel" aria-label="最低検証と証跡">
      <div className="panelHeader">
        <p className="eyebrow">Verification Evidence</p>
        <h2>最低検証 / 必須証跡</h2>
      </div>
      <h3>minimum verification</h3>
      <ul className="checkList">{view.input.minimumVerification.map((command) => <li key={command}>{command}</li>)}</ul>
      {view.missingVerification.length ? <p className="note danger">不足: {view.missingVerification.join("、")}</p> : null}
      <h3 className="sectionLabel">required evidence</h3>
      <ul className="checkList">{view.input.requiredEvidence.map((item) => <li key={item}>{item}</li>)}</ul>
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

function BlockPanel({ reasons, unsafePrompt }: { reasons: string[]; unsafePrompt: boolean }) {
  return (
    <article className="panel" aria-label="blocked reasons">
      <div className="panelHeader">
        <p className="eyebrow">Block Reason</p>
        <h2>ブロック理由</h2>
      </div>
      {reasons.length === 0 && !unsafePrompt ? (
        <p className="note">source、execute_now、検証、証跡、rollback、prompt sanitizationを確認済みです。</p>
      ) : (
        <ul className="findingList">
          {reasons.map((reason) => (
            <li key={reason}>
              <div>
                <h3>{reason}</h3>
                <span>blocked</span>
              </div>
              <p>解消するまでCodexへ渡しません。</p>
            </li>
          ))}
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
