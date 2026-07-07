"use client";

import { useMemo, useState } from "react";
import {
  createNextIncrementPlannerInput,
  planFields,
  planNextIncrement,
  type EvidenceRepairIncrement,
  type NextIncrementPlan,
  type PlannerCase,
  type ReviewFinding
} from "../src/domain/next-increment-planner";

const caseLabels: Record<PlannerCase, string> = {
  empty: "未受信",
  valid: "準備完了",
  failure: "差し戻し",
  evidence_missing: "証跡不足"
};

const decisionLabels = {
  empty: "未受信",
  ready: "実行可能",
  blocked: "差し戻し",
  evidence_missing: "証跡不足"
};

export default function Home() {
  const [caseName, setCaseName] = useState<PlannerCase>("empty");
  const input = useMemo(() => createNextIncrementPlannerInput(caseName), [caseName]);
  const result = useMemo(() => planNextIncrement(input), [input]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP059">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP059</p>
          <h1>次インクリメントプランナー</h1>
          <p className="lead">
            source reviewから次に実行する1インクリメントを選び、証跡不足や差し戻し条件をAI Task Packet delta、Codex prompt delta、verification commandへ戻します。
          </p>
        </div>
        <div className={`statusBadge ${result.decision}`}>
          <span>判定</span>
          <strong>{decisionLabels[result.decision]}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="ケース切替">
        {(["empty", "valid", "failure", "evidence_missing"] as PlannerCase[]).map((item) => (
          <button key={item} type="button" className={caseName === item ? "active" : ""} onClick={() => setCaseName(item)}>
            {caseLabels[item]}
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">判定結果</p>
            <h2>計画判定: {decisionLabels[result.decision]}</h2>
          </div>
          {result.decision === "empty" && (
            <div className="emptyBox" aria-label="未受信の要約">
              <h3>レビュー元がありません</h3>
              <p>前段のsource reviewが届いていないため、次インクリメントは提案しません。</p>
            </div>
          )}
          {result.decision === "ready" && (
            <div className="readyBox" aria-label="準備完了の要約">
              <h3>次の1インクリメントがready</h3>
              <p>source review、優先度、3ブラウザE2E、証跡、rollback、AIDD-Spec接続を確認済みです。</p>
            </div>
          )}
          {result.decision === "blocked" && (
            <div className="failureBox" aria-label="差し戻しの要約">
              <h3>標準Review Finding形式で差し戻し</h3>
              <p>不足項目をAI Task Packet delta、Codex prompt delta、verification commandへ戻します。</p>
            </div>
          )}
          {result.decision === "evidence_missing" && (
            <div className="brakeBox" aria-label="証跡不足の要約">
              <h3>証跡不足を最優先で修復</h3>
              <p>実装前進よりもterminal evidenceと4状態screenshotの回収を先に提案します。</p>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">入力</p><h2>レビュー入力</h2></div>
          <dl className="compactList">
            <div><dt>source_review_id</dt><dd>{input.sourceReviewId || "未受信"}</dd></div>
            <div><dt>source_run_id</dt><dd>{input.sourceRunId || "未受信"}</dd></div>
            <div><dt>3ブラウザE2E</dt><dd>{input.browserCoverage.join(" / ") || "未確認"}</dd></div>
            <div><dt>優先度シグナル</dt><dd>{input.prioritySignals.join(" / ") || "不足"}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">必須項目</p><h2>readyで表示する項目</h2></div>
          <ul className="checkList" aria-label="計画必須項目">
            {planFields.map((field) => <li key={field} className={result.plan ? "ok" : "pending"}>{field}</li>)}
          </ul>
        </article>

        <FindingsPanel findings={result.findings} />
        <EvidencePanel increment={result.evidenceRepairIncrement} />

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">公開前確認</p><h2>サニタイズ後プレビュー</h2></div>
          {result.sanitizedPreview ? <pre>{result.sanitizedPreview}</pre> : <p className="muted">表示する公開用メモはありません。</p>}
        </article>

        <PlanPanel plan={result.plan} />
      </section>
    </main>
  );
}

function FindingsPanel({ findings }: { findings: ReviewFinding[] }) {
  return (
    <article className="panel primary">
      <div className="panelHeader"><p className="eyebrow">差し戻し</p><h2>標準レビュー指摘形式</h2></div>
      {findings.length === 0 ? (
        <p className="muted">Review Findingはありません。</p>
      ) : (
        <ul className="findingList" aria-label="Review Finding一覧">
          {findings.map((finding) => (
            <li key={finding.category}>
              <h3>{finding.category}</h3>
              <dl className="compactList">
                <div><dt>category</dt><dd>{finding.category}</dd></div>
                <div><dt>finding</dt><dd>{finding.finding}</dd></div>
                <div><dt>severity</dt><dd>{finding.severity}</dd></div>
                <div><dt>observed_by</dt><dd>{finding.observed_by}</dd></div>
                <div><dt>ideal_state</dt><dd>{finding.ideal_state}</dd></div>
                <div><dt>fix_instruction</dt><dd>{finding.fix_instruction}</dd></div>
                <div><dt>ai_task_packet_delta</dt><dd>{finding.ai_task_packet_delta}</dd></div>
                <div><dt>codex_prompt_delta</dt><dd>{finding.codex_prompt_delta}</dd></div>
                <div><dt>verification_command</dt><dd>{finding.verification_command}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function EvidencePanel({ increment }: { increment: EvidenceRepairIncrement | null }) {
  return (
    <article className="panel primary" aria-label="証跡修復インクリメント">
      <div className="panelHeader"><p className="eyebrow">証跡修復</p><h2>最優先インクリメント</h2></div>
      {!increment ? (
        <p className="muted">証跡修復インクリメントはありません。</p>
      ) : (
        <section className="proposalGrid">
          <LedgerText title="recommended_increment" value={increment.recommended_increment} />
          <LedgerText title="priority_reason" value={increment.priority_reason} />
          <LedgerList title="target_artifacts" items={increment.target_artifacts} />
          <LedgerList title="acceptance_criteria" items={increment.acceptance_criteria} />
          <LedgerList title="verification_commands" items={increment.verification_commands} />
          <LedgerList title="required_evidence" items={increment.required_evidence} />
          <LedgerList title="codex_prompt_draft" items={increment.codex_prompt_draft.map((draft) => `${draft.mode}: ${draft.prompt}`)} />
          <LedgerText title="rollback_condition" value={increment.rollback_condition} />
        </section>
      )}
    </article>
  );
}

function PlanPanel({ plan }: { plan: NextIncrementPlan | null }) {
  if (!plan) {
    return (
      <article className="panel primary" aria-label="計画なし">
        <div className="panelHeader"><p className="eyebrow">計画</p><h2>次インクリメント計画</h2></div>
        <p className="muted">readyになるまで次インクリメント計画は生成しません。</p>
      </article>
    );
  }

  return (
    <article className="panel primary" aria-label="次インクリメント計画">
      <div className="panelHeader"><p className="eyebrow">計画</p><h2>次インクリメント計画</h2></div>
      <section className="proposalGrid">
        <LedgerText title="source_review_id" value={plan.source_review_id} />
        <LedgerText title="source_run_id" value={plan.source_run_id} />
        <LedgerText title="recommended_increment" value={plan.recommended_increment} />
        <LedgerText title="priority_reason" value={plan.priority_reason} />
        <LedgerList title="target_artifacts" items={plan.target_artifacts} />
        <LedgerList title="acceptance_criteria" items={plan.acceptance_criteria} />
        <LedgerList title="verification_commands" items={plan.verification_commands} />
        <LedgerList title="required_evidence" items={plan.required_evidence} />
        <LedgerList title="codex_prompt_draft" items={plan.codex_prompt_draft.map((draft) => `${draft.mode}: ${draft.prompt}`)} />
        <LedgerText title="rollback_condition" value={plan.rollback_condition} />
        <LedgerText title="note_article_angle" value={plan.note_article_angle} />
        <LedgerText title="learning_log_connection" value={plan.learning_log_connection} />
        <div className="proposalItem">
          <h3>aidd_spec_connections</h3>
          <ul>{plan.aidd_spec_connections.map((item) => <li key={item.id}>{item.label}: {item.status}</li>)}</ul>
        </div>
      </section>
    </article>
  );
}

function LedgerList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="proposalItem">
      <h3>{title}</h3>
      {items.length === 0 ? <p>なし</p> : <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>}
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
