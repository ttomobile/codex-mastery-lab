"use client";

import { useMemo, useState } from "react";
import {
  createRunQueueInput,
  reviewRunQueueInput,
  runQueueIntakeFields,
  type EvidenceWarning,
  type IntakeCase,
  type RejectionReason,
  type RunQueueIntake
} from "../src/lib/run-queue-intake";

const caseLabels: Record<IntakeCase, string> = {
  empty: "empty",
  queued: "queued",
  rejected: "rejected",
  evidence_missing: "evidence_missing"
};

export default function Home() {
  const [caseName, setCaseName] = useState<IntakeCase>("empty");
  const input = useMemo(() => createRunQueueInput(caseName), [caseName]);
  const review = useMemo(() => reviewRunQueueInput(input), [input]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP056">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP056</p>
          <h1>Run Queue Intake</h1>
          <p className="lead">
            MVP055のHandoff Decision Ledgerの次段として、empty / queued / rejected / evidence_missingの4ケースで
            Codex Run Queueへ投入できるかを確認します。
          </p>
        </div>
        <div className={`statusBadge ${review.decision}`}>
          <span>判定</span>
          <strong>{review.decision}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="ケース切替">
        {(["empty", "queued", "rejected", "evidence_missing"] as IntakeCase[]).map((item) => (
          <button key={item} type="button" className={caseName === item ? "active" : ""} onClick={() => setCaseName(item)}>
            {caseLabels[item]}ケース
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Codex Run Queue</p>
            <h2>Run Queue Intake判定: {review.decision}</h2>
          </div>
          {review.decision === "empty" && (
            <div className="emptyBox" aria-label="empty summary">
              <h3>empty: 判断対象のDecision Ledgerがありません</h3>
              <p>MVP055からsource_decision_idが届いていないため、Run Queue Intakeは生成しません。</p>
            </div>
          )}
          {review.decision === "queued" && (
            <div className="readyBox" aria-label="queued summary">
              <h3>queued: Run Queue Intakeを生成</h3>
              <p>承認済み判断、検証コマンド、3ブラウザ、証跡、rollback、AIDD-Spec接続がそろっています。</p>
            </div>
          )}
          {review.decision === "rejected" && (
            <div className="failureBox" aria-label="rejected summary">
              <h3>rejected: Codex Run Queueへ投入しません</h3>
              <p>held / blocked / unapproved decision、危険なcommand、sandbox不足、Firefox除外、浅い検証、rollback不足、未サニタイズ情報を修正してください。</p>
            </div>
          )}
          {review.decision === "evidence_missing" && (
            <div className="brakeBox" aria-label="evidence missing summary">
              <h3>evidence_missing: approved判断の証跡が不足しています</h3>
              <p>terminal evidence、4ケースscreenshot、Playwright reportを補い、Review Record / Learning Logへ戻します。</p>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Source</p><h2>MVP055からの入力</h2></div>
          <dl className="compactList">
            <div><dt>source_decision_id</dt><dd>{input.sourceDecisionId || "未受信"}</dd></div>
            <div><dt>decision_state</dt><dd>{input.decisionState}</dd></div>
            <div><dt>queue_item_id</dt><dd>{input.queueItemId || "未採番"}</dd></div>
            <div><dt>browser_projects</dt><dd>{input.browserProjects.join(" / ") || "未確認"}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Required</p><h2>Run Queue Intake必須項目</h2></div>
          <ul className="checkList" aria-label="run queue intake fields">
            {runQueueIntakeFields.map((field) => <li key={field} className={review.intake ? "ok" : "pending"}>{field}</li>)}
          </ul>
        </article>

        <RejectedPanel reasons={review.rejectionReasons} />
        <EvidencePanel warnings={review.evidenceWarnings} />

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Sanitize</p><h2>公開用コマンドプレビュー</h2></div>
          {review.sanitizedPreview ? <pre>{review.sanitizedPreview}</pre> : <p className="muted">プレビューはありません。</p>}
        </article>

        <IntakePanel intake={review.intake} />
      </section>
    </main>
  );
}

function RejectedPanel({ reasons }: { reasons: RejectionReason[] }) {
  return (
    <article className="panel primary">
      <div className="panelHeader"><p className="eyebrow">Rejected</p><h2>拒否理由と修正指示</h2></div>
      {reasons.length === 0 ? (
        <p className="muted">拒否理由はありません。</p>
      ) : (
        <ul className="checkList" aria-label="rejection reasons">
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

function IntakePanel({ intake }: { intake: RunQueueIntake | null }) {
  if (!intake) {
    return (
      <article className="panel primary" aria-label="run queue intake empty">
        <div className="panelHeader"><p className="eyebrow">Intake</p><h2>Run Queue Intake</h2></div>
        <p className="muted">queuedになるまでRun Queue Intakeは生成しません。</p>
      </article>
    );
  }

  return (
    <article className="panel primary" aria-label="run queue intake">
      <div className="panelHeader"><p className="eyebrow">Intake</p><h2>Run Queue Intake</h2></div>
      <section className="proposalGrid">
        <LedgerText title="source_decision_id" value={intake.source_decision_id} />
        <LedgerText title="queue_item_id" value={intake.queue_item_id} />
        <LedgerText title="run_status" value={intake.run_status} />
        <LedgerText title="sandbox_mode" value={intake.sandbox_mode} />
        <LedgerList title="required_verification_commands" items={intake.required_verification_commands} />
        <LedgerList title="browser_projects" items={intake.browser_projects} />
        <LedgerList title="required_evidence" items={intake.required_evidence} />
        <LedgerText title="rollback_plan" value={intake.rollback_plan} />
        <div className="proposalItem">
          <h3>aidd_spec_connections</h3>
          <ul>
            {intake.aidd_spec_connections.map((item) => <li key={item.id}>{item.label}: {item.status}</li>)}
          </ul>
        </div>
      </section>
      <div className="promptPreview">
        <h3>codex_command</h3>
        <pre>{intake.codex_command}</pre>
      </div>
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
