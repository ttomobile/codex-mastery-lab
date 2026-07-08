"use client";

import { useMemo, useState } from "react";
import {
  createPublicationDigestViewModel,
  digestStates,
  requiredBrowsers,
  type DigestState,
  type PublicationDigestInput,
  type ReviewFinding
} from "../src/domain/digest-publisher";

const stateDescriptions: Record<DigestState, string> = {
  empty: "入力待ち",
  valid: "公開候補OK",
  failure: "失敗調査中",
  blocked: "公開不可"
};

export default function Home() {
  const [state, setState] = useState<DigestState>("empty");
  const view = useMemo(() => createPublicationDigestViewModel(state), [state]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP065">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP065</p>
          <h1>Publication Evidence QA Gate</h1>
          <p className="lead">
            公開候補ダイジェストをempty / valid / failure / blockedで判定し、記事、preview、asset copy、terminal evidence、3ブラウザ、console、sanitization scan、Review Record、Learning Log、AI Task Packet delta、Codex prompt delta、publish checklistを同じ画面で確認します。
          </p>
        </div>
        <div className={`readiness ${view.state}`}>
          <span>publish readiness</span>
          <strong>{view.input.publishReadiness}</strong>
          <small>{stateDescriptions[view.state]}</small>
        </div>
      </section>

      <section className="toolbar" aria-label="Digest状態切替">
        {digestStates.map((item) => (
          <button key={item} type="button" className={state === item ? "active" : ""} onClick={() => setState(item)}>
            {item}
          </button>
        ))}
      </section>

      <section className="grid">
        <DigestSummary input={view.input} state={view.state} />
        <EvidencePanel input={view.input} />
        <ScreenshotPanel input={view.input} />
        <BrowserPanel input={view.input} />
        <ScanPanel input={view.input} />
        <RecordPanel title="Review Record" body={view.input.reviewRecord} />
        <RecordPanel title="Learning Log" body={view.input.learningLog} />
        <RecordPanel title="AI Task Packet delta" body={view.input.aiTaskPacketDelta} />
        <RecordPanel title="Codex prompt delta" body={view.input.codexPromptDelta} />
        <ChecklistPanel items={view.input.publishChecklist} />
        <FindingsPanel findings={view.findings} />
        {view.state === "valid" ? (
          <>
            <OutputPanel title="公開候補ダイジェスト" body={view.candidateMarkdown} />
            <OutputPanel title="QA判定サマリー" body={view.qaSummary} />
          </>
        ) : (
          <OutputPanel title="QA判定サマリー" body={view.qaSummary} />
        )}
      </section>
    </main>
  );
}

function DigestSummary({ input, state }: { input: PublicationDigestInput; state: DigestState }) {
  return (
    <article className="panel primary" aria-label="公開候補ダイジェスト入力">
      <div className="panelHeader">
        <p className="eyebrow">Publication Candidate</p>
        <h2>公開候補の入力</h2>
      </div>
      <dl className="detailList">
        <div><dt>source digest id</dt><dd>{input.sourceDigestId || "未入力"}</dd></div>
        <div><dt>article path</dt><dd>{input.articlePath || "未入力"}</dd></div>
        <div><dt>preview</dt><dd>{input.preview}</dd></div>
        <div><dt>asset copy</dt><dd>{input.assetCopy}</dd></div>
        <div><dt>publish readiness</dt><dd>{input.publishReadiness}</dd></div>
      </dl>
      {state === "empty" ? <p className="note">emptyでは公開候補の証跡を確定せず、入力待ちだけを示します。</p> : null}
      {state === "failure" ? <p className="note danger">failureは失敗調査中として保存し、公開候補OKとしては扱いません。</p> : null}
      {state === "blocked" ? <p className="note danger">blockedではReview Findingを解消するまで公開しません。</p> : null}
    </article>
  );
}

function EvidencePanel({ input }: { input: PublicationDigestInput }) {
  return (
    <article className="panel" aria-label="terminal evidence">
      <div className="panelHeader">
        <p className="eyebrow">Evidence</p>
        <h2>terminal evidence</h2>
      </div>
      <dl className="detailList compact">
        <div><dt>terminal evidence</dt><dd>{input.terminalEvidence}</dd></div>
        <div><dt>console status</dt><dd>{input.consoleStatus}</dd></div>
      </dl>
    </article>
  );
}

function ScreenshotPanel({ input }: { input: PublicationDigestInput }) {
  return (
    <article className="panel" aria-label="initial filled failure screenshots">
      <div className="panelHeader">
        <p className="eyebrow">Screenshots</p>
        <h2>initial / filled / failure screenshots</h2>
      </div>
      <dl className="detailList compact">
        <div><dt>initial screenshot</dt><dd>{input.screenshots.initial}</dd></div>
        <div><dt>filled screenshot</dt><dd>{input.screenshots.filled}</dd></div>
        <div><dt>failure screenshot</dt><dd>{input.screenshots.failure}</dd></div>
        <div><dt>terminal evidence PNG</dt><dd>{input.screenshots.terminal}</dd></div>
      </dl>
    </article>
  );
}

function BrowserPanel({ input }: { input: PublicationDigestInput }) {
  return (
    <article className="panel" aria-label="Chromium Firefox WebKit">
      <div className="panelHeader">
        <p className="eyebrow">Coverage</p>
        <h2>Chromium / Firefox / WebKit</h2>
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

function ScanPanel({ input }: { input: PublicationDigestInput }) {
  return (
    <article className="panel" aria-label="sanitization scan">
      <div className="panelHeader">
        <p className="eyebrow">Public QA</p>
        <h2>sanitization scan</h2>
      </div>
      <dl className="detailList compact">
        <div><dt>sanitization scan</dt><dd>{input.sanitizationScan}</dd></div>
        <div><dt>記事観点</dt><dd>{input.articlePerspective}</dd></div>
        <div><dt>AIDD-Spec接続</dt><dd>{input.aiddSpecConnection}</dd></div>
      </dl>
    </article>
  );
}

function RecordPanel({ title, body }: { title: string; body: string }) {
  return (
    <article className="panel">
      <div className="panelHeader">
        <p className="eyebrow">Delta</p>
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

function ChecklistPanel({ items }: { items: string[] }) {
  return (
    <article className="panel" aria-label="publish checklist">
      <div className="panelHeader">
        <p className="eyebrow">Checklist</p>
        <h2>publish checklist</h2>
      </div>
      {items.length === 0 ? <p className="muted">publish checklistは未入力です。</p> : (
        <ul className="checkList">
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
    </article>
  );
}

function OutputPanel({ title, body }: { title: string; body: string }) {
  return (
    <article className="panel output" aria-label={title}>
      <div className="panelHeader">
        <p className="eyebrow">Output</p>
        <h2>{title}</h2>
      </div>
      <pre>{body}</pre>
    </article>
  );
}
