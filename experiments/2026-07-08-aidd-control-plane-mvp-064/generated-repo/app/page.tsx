"use client";

import { useMemo, useState } from "react";
import {
  createDigestViewModel,
  digestStates,
  requiredBrowsers,
  type DigestInput,
  type DigestState,
  type ReviewFinding
} from "../src/domain/digest-publisher";

const stateLabels: Record<DigestState, string> = {
  empty: "empty",
  valid: "valid",
  failure: "failure",
  blocked: "blocked"
};

const stateDescriptions: Record<DigestState, string> = {
  empty: "入力待ち",
  valid: "共有準備OK",
  failure: "失敗調査中",
  blocked: "公開不可"
};

export default function Home() {
  const [state, setState] = useState<DigestState>("empty");
  const view = useMemo(() => createDigestViewModel(state), [state]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP064">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP064</p>
          <h1>Run Result Digest Publisher</h1>
          <p className="lead">
            MVP063のCodex Run Queue Status Trackerの後段として、実行結果、証跡、Review Record、Learning Log、次回AI Task Packet deltaを短いMarkdownダイジェストへ変換します。
          </p>
        </div>
        <div className={`readiness ${state}`}>
          <span>publish readiness</span>
          <strong>{view.input.publishReadiness}</strong>
          <small>{stateDescriptions[state]}</small>
        </div>
      </section>

      <section className="toolbar" aria-label="Digest状態切替">
        {digestStates.map((item) => (
          <button key={item} type="button" className={state === item ? "active" : ""} onClick={() => setState(item)}>
            {stateLabels[item]}
          </button>
        ))}
      </section>

      <section className="grid">
        <DigestSummary input={view.input} state={state} />
        <EvidencePanel input={view.input} />
        <BrowserPanel input={view.input} />
        <RecordPanel title="Review Record" body={view.input.reviewRecord} />
        <RecordPanel title="Learning Log" body={view.input.learningLog} />
        <RecordPanel title="AI Task Packet delta" body={view.input.aiTaskPacketDelta} />
        <RecordPanel title="note article angle" body={view.input.noteArticleAngle} />
        <FindingsPanel findings={view.findings} />
        {state === "valid" ? (
          <>
            <OutputPanel title="共有用Markdown" body={view.sharedMarkdown} />
            <OutputPanel title="次回AI Task Packet delta" body={view.input.aiTaskPacketDelta} />
            <OutputPanel title="Codex prompt delta" body={view.codexPromptDelta} />
            <ChecklistPanel items={view.verificationChecklist} />
          </>
        ) : null}
      </section>
    </main>
  );
}

function DigestSummary({ input, state }: { input: DigestInput; state: DigestState }) {
  return (
    <article className="panel primary" aria-label="Digest入力要約">
      <div className="panelHeader">
        <p className="eyebrow">Digest Source</p>
        <h2>実行結果の入力</h2>
      </div>
      <dl className="detailList">
        <div><dt>source run id</dt><dd>{input.sourceRunId || "未入力"}</dd></div>
        <div><dt>run outcome</dt><dd>{input.runOutcome}</dd></div>
        <div><dt>score</dt><dd>{input.score ?? "未入力"}</dd></div>
        <div><dt>console status</dt><dd>{input.consoleStatus}</dd></div>
        <div><dt>publish readiness</dt><dd>{input.publishReadiness}</dd></div>
      </dl>
      {state === "empty" ? <p className="note">emptyでは古いRunの証跡を表示せず、入力待ちだけを示します。</p> : null}
      {state === "failure" ? <p className="note danger">failureは原因と再実行条件を共有し、成功ダイジェストとしては扱いません。</p> : null}
      {state === "blocked" ? <p className="note danger">blockedではReview Findingを解消するまで公開しません。</p> : null}
    </article>
  );
}

function EvidencePanel({ input }: { input: DigestInput }) {
  return (
    <article className="panel" aria-label="Verification Evidence">
      <div className="panelHeader">
        <p className="eyebrow">Evidence</p>
        <h2>terminal evidence / screenshot</h2>
      </div>
      <dl className="detailList compact">
        <div><dt>terminal evidence</dt><dd>{input.terminalEvidence}</dd></div>
        <div><dt>initial screenshot</dt><dd>{input.screenshots.initial}</dd></div>
        <div><dt>filled screenshot</dt><dd>{input.screenshots.filled}</dd></div>
        <div><dt>failure screenshot</dt><dd>{input.screenshots.failure}</dd></div>
        <div><dt>terminal screenshot</dt><dd>{input.screenshots.terminal}</dd></div>
      </dl>
    </article>
  );
}

function BrowserPanel({ input }: { input: DigestInput }) {
  return (
    <article className="panel" aria-label="3ブラウザcoverage">
      <div className="panelHeader">
        <p className="eyebrow">Coverage</p>
        <h2>Chromium / Firefox / WebKit coverage</h2>
      </div>
      <ul className="browserList">
        {requiredBrowsers.map((browser) => (
          <li key={browser} className={input.browserCoverage[browser] === "通過" ? "pass" : input.browserCoverage[browser] === "失敗" ? "fail" : "skip"}>
            <span>{browser}</span>
            <strong>{input.browserCoverage[browser]}</strong>
          </li>
        ))}
      </ul>
    </article>
  );
}

function RecordPanel({ title, body }: { title: string; body: string }) {
  return (
    <article className="panel">
      <div className="panelHeader">
        <p className="eyebrow">Input</p>
        <h2>{title}</h2>
      </div>
      <p className="recordText">{body}</p>
    </article>
  );
}

function FindingsPanel({ findings }: { findings: ReviewFinding[] }) {
  return (
    <article className="panel primary" aria-label="Review Finding">
      <div className="panelHeader">
        <p className="eyebrow">Review Finding</p>
        <h2>公開前の指摘</h2>
      </div>
      {findings.length === 0 ? (
        <p className="muted">Review Findingはありません。</p>
      ) : (
        <ul className="findingList" aria-label="Review Finding一覧">
          {findings.map((finding) => (
            <li key={finding.id}>
              <div>
                <h3>{finding.title}</h3>
                <span>{finding.severity}</span>
              </div>
              <p>{finding.detail}</p>
              <p className="fix">{finding.fixInstruction}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function OutputPanel({ title, body }: { title: string; body: string }) {
  return (
    <article className="panel output" aria-label={title}>
      <div className="panelHeader">
        <p className="eyebrow">Valid Output</p>
        <h2>{title}</h2>
      </div>
      <pre>{body}</pre>
    </article>
  );
}

function ChecklistPanel({ items }: { items: string[] }) {
  return (
    <article className="panel output" aria-label="Verification Evidence checklist">
      <div className="panelHeader">
        <p className="eyebrow">Checklist</p>
        <h2>Verification Evidence checklist</h2>
      </div>
      <ul className="checkList">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}
