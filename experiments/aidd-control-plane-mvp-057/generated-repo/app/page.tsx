"use client";

import { useMemo, useState } from "react";
import {
  createRunQueueResultInput,
  reviewRunQueueStatus,
  statusTrackerFields,
  type CodexRunQueueStatusTracker,
  type EvidenceWarning,
  type FailureReason,
  type TrackerCase
} from "../src/lib/run-queue-status-tracker";

const caseLabels: Record<TrackerCase, string> = {
  empty: "empty",
  waiting: "waiting",
  running: "running",
  succeeded: "succeeded",
  failed: "failed",
  evidence_missing: "evidence_missing"
};

export default function Home() {
  const [caseName, setCaseName] = useState<TrackerCase>("empty");
  const input = useMemo(() => createRunQueueResultInput(caseName), [caseName]);
  const review = useMemo(() => reviewRunQueueStatus(input), [input]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP057">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP057</p>
          <h1>Codex Run Queue Status Tracker</h1>
          <p className="lead">
            MVP056のRun Queue Intakeの次段として、empty / waiting / running / succeeded / failed /
            evidence_missingの6ケースでCodex実行状態と証跡不足を追跡します。
          </p>
        </div>
        <div className={`statusBadge ${review.decision}`}>
          <span>判定</span>
          <strong>{review.decision}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="ケース切替">
        {(["empty", "waiting", "running", "succeeded", "failed", "evidence_missing"] as TrackerCase[]).map((item) => (
          <button key={item} type="button" className={caseName === item ? "active" : ""} onClick={() => setCaseName(item)}>
            {caseLabels[item]}ケース
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Codex Run Queue</p>
            <h2>Status Tracker判定: {review.decision}</h2>
          </div>
          {review.decision === "empty" && (
            <div className="emptyBox" aria-label="empty summary">
              <h3>empty: 判断対象のRun Queue Intakeがありません</h3>
              <p>MVP056からsource_intake_idが届いていないため、Status Trackerは生成しません。</p>
            </div>
          )}
          {review.decision === "waiting" && (
            <div className="brakeBox" aria-label="waiting summary">
              <h3>waiting: Codex実行待ち</h3>
              <p>queue_item_idは採番済みですが、terminal evidenceとVerification Evidenceは未生成です。</p>
            </div>
          )}
          {review.decision === "running" && (
            <div className="brakeBox" aria-label="running summary">
              <h3>running: Codex実行中</h3>
              <p>Playwright report、Review Record、Learning Logの最終出力を待っています。</p>
            </div>
          )}
          {review.decision === "succeeded" && (
            <div className="readyBox" aria-label="succeeded summary">
              <h3>succeeded: Codex Run Queue Status Trackerを表示</h3>
              <p>実行結果、Verification Evidence、3ブラウザ、証跡、Review Record、Learning Log、AIDD-Spec接続がそろっています。</p>
            </div>
          )}
          {review.decision === "failed" && (
            <div className="failureBox" aria-label="failed summary">
              <h3>failed: Codex実行結果を失敗扱いにします</h3>
              <p>command失敗、Firefox未実行、doctor:aidd失敗、危険なcommand、rollback不足、未サニタイズ情報を修正してください。</p>
            </div>
          )}
          {review.decision === "evidence_missing" && (
            <div className="brakeBox" aria-label="evidence missing summary">
              <h3>evidence_missing: 実行成功後の証跡が不足しています</h3>
              <p>terminal evidence、4ケースscreenshot、Playwright report、Review Record出力を補い、Evidence Repair Delta / Learning Logへ戻します。</p>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Source</p><h2>MVP056からの入力</h2></div>
          <dl className="compactList">
            <div><dt>source_intake_id</dt><dd>{input.sourceIntakeId || "未受信"}</dd></div>
            <div><dt>queue_item_id</dt><dd>{input.queueItemId || "未採番"}</dd></div>
            <div><dt>run_status</dt><dd>{input.runStatus}</dd></div>
            <div><dt>browser_projects</dt><dd>{input.browserProjects.join(" / ") || "未確認"}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Required</p><h2>Status Tracker必須項目</h2></div>
          <ul className="checkList" aria-label="status tracker fields">
            {statusTrackerFields.map((field) => <li key={field} className={review.tracker ? "ok" : "pending"}>{field}</li>)}
          </ul>
        </article>

        <FailurePanel reasons={review.failureReasons} />
        <EvidencePanel warnings={review.evidenceWarnings} />

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Sanitize</p><h2>公開用コマンドプレビュー</h2></div>
          {review.sanitizedPreview ? <pre>{review.sanitizedPreview}</pre> : <p className="muted">プレビューはありません。</p>}
        </article>

        <TrackerPanel tracker={review.tracker} />
      </section>
    </main>
  );
}

function FailurePanel({ reasons }: { reasons: FailureReason[] }) {
  return (
    <article className="panel primary">
      <div className="panelHeader"><p className="eyebrow">Failed</p><h2>失敗理由と修正指示</h2></div>
      {reasons.length === 0 ? (
        <p className="muted">失敗理由はありません。</p>
      ) : (
        <ul className="checkList" aria-label="failure reasons">
          {reasons.map((reason) => (
            <li key={reason.id} className="ng">
              <strong>{reason.title}</strong>
              <span>{reason.detail}</span>
              <em>{reason.fixInstruction}</em>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function EvidencePanel({ warnings }: { warnings: EvidenceWarning[] }) {
  return (
    <article className="panel primary" aria-label="evidence warnings">
      <div className="panelHeader"><p className="eyebrow">Evidence</p><h2>不足証跡の戻し先</h2></div>
      {warnings.length === 0 ? (
        <p className="muted">不足証跡はありません。</p>
      ) : (
        <ul className="checkList">
          {warnings.map((warning) => (
            <li key={warning.id} className="warn">
              <strong>{warning.title}</strong>
              <span>{warning.detail}</span>
              <em>{warning.returnTo}へ戻す</em>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function TrackerPanel({ tracker }: { tracker: CodexRunQueueStatusTracker | null }) {
  if (!tracker) {
    return (
      <article className="panel primary" aria-label="status tracker empty">
        <div className="panelHeader"><p className="eyebrow">Tracker</p><h2>Codex Run Queue Status Tracker</h2></div>
        <p className="muted">succeededになるまでStatus Trackerは生成しません。</p>
      </article>
    );
  }

  return (
    <article className="panel primary" aria-label="status tracker">
      <div className="panelHeader"><p className="eyebrow">Tracker</p><h2>Codex Run Queue Status Tracker</h2></div>
      <section className="proposalGrid">
        <LedgerText title="source_intake_id" value={tracker.source_intake_id} />
        <LedgerText title="queue_item_id" value={tracker.queue_item_id} />
        <LedgerText title="run_status" value={tracker.run_status} />
        <LedgerList title="actual_results" items={tracker.actual_results} />
        <LedgerText title="verification_summary" value={tracker.verification_summary} />
        <LedgerList title="browser_projects" items={tracker.browser_projects} />
        <LedgerList title="terminal_evidence" items={tracker.terminal_evidence} />
        <LedgerList title="screenshot_evidence" items={tracker.screenshot_evidence} />
        <LedgerText title="playwright_report" value={tracker.playwright_report} />
        <LedgerText title="rollback_plan" value={tracker.rollback_plan} />
        <LedgerText title="review_record_output" value={tracker.review_record_output} />
        <LedgerText title="learning_log_output" value={tracker.learning_log_output} />
        <div className="proposalItem">
          <h3>aidd_spec_connections</h3>
          <ul>
            {tracker.aidd_spec_connections.map((item) => <li key={item.id}>{item.label}: {item.status}</li>)}
          </ul>
        </div>
      </section>
    </article>
  );
}

function LedgerList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="proposalItem">
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function LedgerText({ title, value }: { title: string; value: string }) {
  return (
    <div className="proposalItem">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
