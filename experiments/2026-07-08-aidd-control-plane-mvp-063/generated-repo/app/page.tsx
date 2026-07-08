"use client";

import { useMemo, useState } from "react";
import {
  evaluateQueueStatus,
  queueStatuses,
  requiredEvidence,
  type QueueRun,
  type QueueStatus,
  type ReviewFinding
} from "../src/domain/run-queue-status";

const statusLabels: Record<QueueStatus, string> = {
  empty: "空",
  waiting: "待機中",
  running: "実行中",
  succeeded: "成功",
  failed: "失敗",
  evidence_missing: "証跡不足"
};

const decisionLabels = {
  empty: "Run Queueは空",
  queued: "実行待ち",
  active: "実行中",
  passed: "証跡つき成功",
  blocked: "Review Findingあり",
  evidence_missing: "証跡補完が必要"
};

export default function Home() {
  const [status, setStatus] = useState<QueueStatus>("empty");
  const view = useMemo(() => evaluateQueueStatus(status), [status]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP063">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP063</p>
          <h1>Codex Run Queue Status Tracker</h1>
          <p className="lead">
            Run Queueに入ったCodex実行を、waiting / running / succeeded / failed / evidence_missing / emptyとして確認します。実行コマンド、検証コマンド、3ブラウザ範囲、証跡、rollback、Review Record、Learning Logを同じ判断材料として扱います。
          </p>
        </div>
        <div className={`statusBadge ${view.decision}`}>
          <span>キュー判定</span>
          <strong>{decisionLabels[view.decision]}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="Run Queue状態切替">
        {queueStatuses.map((item) => (
          <button key={item} type="button" className={status === item ? "active" : ""} onClick={() => setStatus(item)}>
            {statusLabels[item]}
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">状態</p>
            <h2>Run Queue状態: {statusLabels[status]}</h2>
          </div>
          {view.run ? <StatusSummary run={view.run} /> : <EmptySummary />}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">必須条件</p>
            <h2>AIDD接続</h2>
          </div>
          <ul className="checkList" aria-label="AIDD接続一覧">
            <li className="ok">AIDD-Spec v0.1</li>
            <li className="ok">AIDD Control Plane MVP v0.1</li>
            <li className="ok">Run Queue</li>
            <li className="ok">Review Record</li>
            <li className="ok">Learning Log</li>
            <li className="ok">Verification Evidence</li>
          </ul>
        </article>

        {view.run ? <RunDetail run={view.run} /> : <EmptyDetail reviewRecord={view.reviewRecord} learningLog={view.learningLog} />}
        <EvidencePanel run={view.run} />
        <RecordPanel title="Review Record出力" body={view.reviewRecord} />
        <RecordPanel title="Learning Log出力" body={view.learningLog} />
        <FindingsPanel findings={view.findings} />
      </section>
    </main>
  );
}

function EmptySummary() {
  return (
    <div className="emptyBox" aria-label="empty状態の要約">
      <h3>Run Queueは空です</h3>
      <p>実行対象がないため、古いterminal evidenceやscreenshot evidenceを完了証跡として表示しません。</p>
    </div>
  );
}

function StatusSummary({ run }: { run: QueueRun }) {
  const className = run.status === "succeeded" ? "readyBox" : run.status === "failed" ? "failureBox" : run.status === "evidence_missing" ? "brakeBox" : "emptyBox";
  return (
    <div className={className} aria-label={`${run.status}状態の要約`}>
      <h3>{run.title}</h3>
      <p>{run.id} / {run.status}</p>
      {run.status === "failed" && <p className="blockReason">失敗原因をReview Findingへ戻すまで完了扱いにしません。</p>}
      {run.status === "evidence_missing" && <p className="blockReason">terminal evidenceとscreenshot evidenceがそろうまで成功扱いにしません。</p>}
    </div>
  );
}

function RunDetail({ run }: { run: QueueRun }) {
  return (
    <article className="panel primary" aria-label="Run Queue詳細">
      <div className="panelHeader">
        <p className="eyebrow">Run詳細</p>
        <h2>実行と検証</h2>
      </div>
      <dl className="detailList">
        <div><dt>実行コマンド</dt><dd>{run.runCommand}</dd></div>
        <div><dt>検証コマンド</dt><dd>{run.verificationCommand}</dd></div>
        <div><dt>ブラウザ範囲</dt><dd>{run.browserScope.join(" / ")}</dd></div>
        <div><dt>rollback plan</dt><dd>{run.rollbackPlan}</dd></div>
      </dl>
    </article>
  );
}

function EmptyDetail({ reviewRecord, learningLog }: { reviewRecord: string; learningLog: string }) {
  return (
    <article className="panel primary" aria-label="Run Queue空詳細">
      <div className="panelHeader">
        <p className="eyebrow">Run詳細</p>
        <h2>empty状態</h2>
      </div>
      <dl className="detailList">
        <div><dt>実行コマンド</dt><dd>なし</dd></div>
        <div><dt>検証コマンド</dt><dd>なし</dd></div>
        <div><dt>ブラウザ範囲</dt><dd>Chromium / Firefox / WebKitの対象Runなし</dd></div>
        <div><dt>rollback plan</dt><dd>古いRun証跡を表示しない。</dd></div>
        <div><dt>Review Record出力</dt><dd>{reviewRecord}</dd></div>
        <div><dt>Learning Log出力</dt><dd>{learningLog}</dd></div>
      </dl>
    </article>
  );
}

function EvidencePanel({ run }: { run: QueueRun | null }) {
  return (
    <article className="panel" aria-label="証跡一覧">
      <div className="panelHeader">
        <p className="eyebrow">Evidence</p>
        <h2>terminal evidence / screenshot evidence</h2>
      </div>
      <ul className="checkList">
        {requiredEvidence.map((item) => <li key={item} className={run ? "ok" : "pending"}>{item}</li>)}
      </ul>
      {run ? (
        <dl className="compactList evidenceList">
          <div><dt>terminal evidence</dt><dd>{run.evidence.terminal.length > 0 ? run.evidence.terminal.join(" / ") : "不足"}</dd></div>
          <div><dt>screenshot evidence</dt><dd>{run.evidence.screenshots.length > 0 ? run.evidence.screenshots.join(" / ") : "不足"}</dd></div>
        </dl>
      ) : <p className="muted evidenceNote">emptyでは証跡を要求しません。</p>}
    </article>
  );
}

function RecordPanel({ title, body }: { title: string; body: string }) {
  return (
    <article className="panel">
      <div className="panelHeader">
        <p className="eyebrow">出力</p>
        <h2>{title}</h2>
      </div>
      <pre>{body}</pre>
    </article>
  );
}

function FindingsPanel({ findings }: { findings: ReviewFinding[] }) {
  return (
    <article className="panel primary">
      <div className="panelHeader">
        <p className="eyebrow">Review Finding</p>
        <h2>不足の指摘</h2>
      </div>
      {findings.length === 0 ? (
        <p className="muted">failed / evidence_missingではないためReview Findingはありません。</p>
      ) : (
        <ul className="findingList" aria-label="Review Finding一覧">
          {findings.map((finding) => (
            <li key={finding.category}>
              <h3>{finding.category}</h3>
              <dl className="compactList">
                <div><dt>severity</dt><dd>{finding.severity}</dd></div>
                <div><dt>finding</dt><dd>{finding.finding}</dd></div>
                <div><dt>足りないもの</dt><dd>{finding.missing.join(" / ")}</dd></div>
                <div><dt>fix_instruction</dt><dd>{finding.fixInstruction}</dd></div>
                <div><dt>verification_command</dt><dd>{finding.verificationCommand}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
