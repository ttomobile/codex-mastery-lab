"use client";

import { useMemo, useState } from "react";
import {
  createPublicationDigestViewModel,
  digestStates,
  requiredBrowsers,
  type PublicPreviewSmokeInput,
  type ReviewFinding,
  type SmokeState
} from "../src/domain/digest-publisher";

const stateDescriptions: Record<SmokeState, string> = {
  empty: "入力待ち",
  valid: "HTTP smoke通過",
  failure: "asset失敗調査中",
  blocked: "公開確認不可"
};

export default function Home() {
  const [state, setState] = useState<SmokeState>("empty");
  const view = useMemo(() => createPublicationDigestViewModel(state), [state]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP066">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP066</p>
          <h1>Public Preview Smoke Verifier</h1>
          <p className="lead">
            MVP065 Publication Evidence QA Gateの後段として、公開preview HTMLとassetsがHTTP経路で読めるかをempty / valid / failure / blockedで判定します。AIDD-Spec v0.1、AIDD Control Plane MVP v0.1、Verification Evidence、Release Checklistへの接続も同じ画面で確認します。
          </p>
        </div>
        <div className={`readiness ${view.state}`}>
          <span>smoke readiness</span>
          <strong>{view.input.smokeReadiness}</strong>
          <small>{stateDescriptions[view.state]}</small>
        </div>
      </section>

      <section className="toolbar" aria-label="Smoke状態切替">
        {digestStates.map((item) => (
          <button key={item} type="button" className={state === item ? "active" : ""} onClick={() => setState(item)}>
            {item}
          </button>
        ))}
      </section>

      <section className="grid">
        <SmokeSummary input={view.input} state={view.state} />
        <CheckedUrlsPanel input={view.input} />
        <ConnectionPanel input={view.input} />
        <EvidencePanel input={view.input} />
        <BrowserPanel input={view.input} />
        <ScanPanel input={view.input} />
        <RecordPanel title="Review Finding" body={view.input.reviewRecord} />
        <RecordPanel title="Learning Log" body={view.input.learningLog} />
        <RecordPanel title="AI Task Packet delta" body={view.input.aiTaskPacketDelta} />
        <RecordPanel title="Codex prompt delta" body={view.input.codexPromptDelta} />
        <RerunPanel command={view.input.rerunCommand} />
        <FindingsPanel findings={view.findings} />
        {view.state === "valid" ? (
          <>
            <OutputPanel title="公開preview smoke digest" body={view.candidateMarkdown} />
            <OutputPanel title="QA判定サマリー" body={view.qaSummary} />
          </>
        ) : (
          <OutputPanel title="QA判定サマリー" body={view.qaSummary} />
        )}
      </section>
    </main>
  );
}

function SmokeSummary({ input, state }: { input: PublicPreviewSmokeInput; state: SmokeState }) {
  return (
    <article className="panel primary" aria-label="公開preview smoke入力">
      <div className="panelHeader">
        <p className="eyebrow">Public Preview Smoke</p>
        <h2>公開previewの入力</h2>
      </div>
      <dl className="detailList">
        <div><dt>smoke run id</dt><dd>{input.smokeRunId || "未入力"}</dd></div>
        <div><dt>article path</dt><dd>{input.articlePath || "未入力"}</dd></div>
        <div><dt>preview URL/path</dt><dd>{input.previewPath || "未入力"}</dd></div>
        <div><dt>checked URLs</dt><dd>{input.checkedUrls.length === 0 ? "未入力" : `${input.checkedUrls.length}件`}</dd></div>
        <div><dt>smoke readiness</dt><dd>{input.smokeReadiness}</dd></div>
      </dl>
      {state === "empty" ? <p className="note">emptyでは公開preview smokeの証跡を確定せず、入力待ちだけを示します。</p> : null}
      {state === "failure" ? <p className="note danger">failureは失敗assetを保持し、公開preview確認OKとしては扱いません。</p> : null}
      {state === "blocked" ? <p className="note danger">blockedではReview Findingを解消するまで公開preview確認を通しません。</p> : null}
    </article>
  );
}

function CheckedUrlsPanel({ input }: { input: PublicPreviewSmokeInput }) {
  return (
    <article className="panel primary" aria-label="checked URLs">
      <div className="panelHeader">
        <p className="eyebrow">HTTP Smoke</p>
        <h2>checked URLs</h2>
      </div>
      {input.checkedUrls.length === 0 ? <p className="muted">checked URLsは未入力です。</p> : (
        <div className="urlTable">
          <div className="urlTableHead">
            <span>対象</span>
            <span>HTTP status</span>
            <span>byte size</span>
            <span>content type</span>
            <span>latency ms</span>
          </div>
          {input.checkedUrls.map((item) => (
            <div key={`${item.label}-${item.url}`} className={`urlRow ${item.response}`}>
              <span><strong>{item.label}</strong><small>{item.url}</small></span>
              <span>{item.httpStatus}</span>
              <span>{item.byteSize}</span>
              <span>{item.contentType}</span>
              <span>{item.latencyMs}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function ConnectionPanel({ input }: { input: PublicPreviewSmokeInput }) {
  return (
    <article className="panel primary" aria-label="AIDD-Spec v0.1 AIDD Control Plane MVP v0.1 Verification Evidence Release Checklist">
      <div className="panelHeader">
        <p className="eyebrow">Connections</p>
        <h2>AIDD接続</h2>
      </div>
      <dl className="detailList">
        <div><dt>AIDD-Spec v0.1</dt><dd>{input.aiddSpecConnection}</dd></div>
        <div><dt>AIDD Control Plane MVP v0.1</dt><dd>{input.controlPlaneConnection}</dd></div>
        <div><dt>Verification Evidence</dt><dd>{input.verificationEvidenceConnection}</dd></div>
        <div><dt>Release Checklist</dt><dd>{input.releaseChecklistConnection}</dd></div>
      </dl>
    </article>
  );
}

function EvidencePanel({ input }: { input: PublicPreviewSmokeInput }) {
  return (
    <article className="panel" aria-label="terminal evidence image response">
      <div className="panelHeader">
        <p className="eyebrow">Evidence</p>
        <h2>terminal evidence image response</h2>
      </div>
      <dl className="detailList compact">
        <div><dt>terminal evidence image response</dt><dd>{input.terminalEvidenceImageResponse}</dd></div>
        <div><dt>console status</dt><dd>{input.consoleStatus}</dd></div>
      </dl>
    </article>
  );
}

function BrowserPanel({ input }: { input: PublicPreviewSmokeInput }) {
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

function ScanPanel({ input }: { input: PublicPreviewSmokeInput }) {
  return (
    <article className="panel" aria-label="sanitization scan">
      <div className="panelHeader">
        <p className="eyebrow">Public QA</p>
        <h2>sanitization scan</h2>
      </div>
      <dl className="detailList compact">
        <div><dt>sanitization scan</dt><dd>{input.sanitizationScan}</dd></div>
        <div><dt>console status</dt><dd>{input.consoleStatus}</dd></div>
      </dl>
    </article>
  );
}

function RecordPanel({ title, body }: { title: string; body: string }) {
  return (
    <article className="panel">
      <div className="panelHeader">
        <p className="eyebrow">Record</p>
        <h2>{title}</h2>
      </div>
      <p className="recordText">{body}</p>
    </article>
  );
}

function RerunPanel({ command }: { command: string }) {
  return (
    <article className="panel" aria-label="rerun command">
      <div className="panelHeader">
        <p className="eyebrow">Command</p>
        <h2>rerun command</h2>
      </div>
      <pre className="command">{command}</pre>
    </article>
  );
}

function FindingsPanel({ findings }: { findings: ReviewFinding[] }) {
  return (
    <article className="panel primary" aria-label="Review Finding一覧">
      <div className="panelHeader">
        <p className="eyebrow">Review Finding</p>
        <h2>公開前の指摘</h2>
      </div>
      {findings.length === 0 ? (
        <p className="muted">Review Findingはありません。</p>
      ) : (
        <ul className="findingList" aria-label="Review Finding">
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
        <p className="eyebrow">Output</p>
        <h2>{title}</h2>
      </div>
      <pre>{body}</pre>
    </article>
  );
}
