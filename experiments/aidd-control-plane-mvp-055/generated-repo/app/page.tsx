"use client";

import { useMemo, useState } from "react";
import {
  createHandoffDecisionInput,
  requiredLedgerFields,
  reviewHandoffDecision,
  type HandoffDecisionLedger,
  type HeldDecision,
  type LedgerCase,
  type PublishBlock
} from "../src/lib/handoff-decision-ledger";

const caseLabels: Record<LedgerCase, string> = {
  empty: "empty",
  approved: "approved",
  held: "held",
  blocked: "blocked"
};

export default function Home() {
  const [caseName, setCaseName] = useState<LedgerCase>("empty");
  const input = useMemo(() => createHandoffDecisionInput(caseName), [caseName]);
  const review = useMemo(() => reviewHandoffDecision(input), [input]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP055">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP055</p>
          <h1>Handoff Decision Ledger</h1>
          <p className="lead">
            MVP054の縮小版ハンドオフレシートの次段として、empty / approved / held / blockedの4ケースで
            実行承認、保留理由、公開前ブロックを確認します。
          </p>
        </div>
        <div className={`statusBadge ${review.decision}`}>
          <span>判定</span>
          <strong>{review.decision}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="ケース切替">
        {(["empty", "approved", "held", "blocked"] as LedgerCase[]).map((item) => (
          <button key={item} type="button" className={caseName === item ? "active" : ""} onClick={() => setCaseName(item)}>
            {caseLabels[item]}ケース
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Decision Gate</p>
            <h2>ハンドオフ判断: {review.decision}</h2>
          </div>
          {review.decision === "empty" && (
            <div className="emptyBox" aria-label="empty summary">
              <h3>empty: 判断対象のハンドオフレシートがありません</h3>
              <p>MVP054からsource_handoff_receipt_idが届いていないため、Decision Ledgerは生成しません。</p>
            </div>
          )}
          {review.decision === "approved" && (
            <div className="readyBox" aria-label="approved summary">
              <h3>approved: Handoff Decision Ledgerを生成</h3>
              <p>承認理由、実行案、検証コマンド、証跡、rollback条件、AIDD-Spec接続がそろっています。</p>
            </div>
          )}
          {review.decision === "held" && (
            <div className="brakeBox" aria-label="held summary">
              <h3>held: 追加証跡待ちです</h3>
              <p>実行承認は出さず、追加証跡と次回レビュー条件をlearning logへ戻します。</p>
            </div>
          )}
          {review.decision === "blocked" && (
            <div className="failureBox" aria-label="blocked summary">
              <h3>blocked: 公開前ブロックがあります</h3>
              <p>未承認、理由不足、rollback不足、3ブラウザ不足、evidence不足、未サニタイズ情報を修正するまで公開しません。</p>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Source</p><h2>MVP054からの入力</h2></div>
          <dl className="compactList">
            <div><dt>source_handoff_receipt_id</dt><dd>{input.sourceHandoffReceiptId || "未受信"}</dd></div>
            <div><dt>decision_owner</dt><dd>{input.decisionOwner || "未設定"}</dd></div>
            <div><dt>approved_execute_now</dt><dd>{input.approvedExecuteNow.length}件</dd></div>
            <div><dt>browser evidence</dt><dd>{input.browserEvidence.join(" / ") || "未確認"}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Required</p><h2>Ledger必須項目</h2></div>
          <ul className="checkList" aria-label="required ledger fields">
            {requiredLedgerFields.map((field) => <li key={field} className={review.ledger ? "ok" : "pending"}>{field}</li>)}
          </ul>
        </article>

        <HeldPanel held={review.held} />
        <BlocksPanel blocks={review.publishBlocks} />

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Sanitize</p><h2>公開用コマンドプレビュー</h2></div>
          {review.sanitizedPreview ? <pre>{review.sanitizedPreview}</pre> : <p className="muted">プレビューはありません。</p>}
        </article>

        <LedgerPanel ledger={review.ledger} />
      </section>
    </main>
  );
}

function HeldPanel({ held }: { held: HeldDecision | null }) {
  return (
    <article className="panel primary" aria-label="held decision">
      <div className="panelHeader"><p className="eyebrow">Hold</p><h2>保留時の返却内容</h2></div>
      {!held ? (
        <p className="muted">heldケースで追加証跡と次回レビュー条件を表示します。</p>
      ) : (
        <section className="proposalGrid">
          <LedgerText title="hold_reason" value={held.hold_reason} />
          <LedgerList title="additional_evidence_needed" items={held.additional_evidence_needed} />
          <LedgerText title="next_review_condition" value={held.next_review_condition} />
          <LedgerText title="learning_log_return" value={held.learning_log_return} />
        </section>
      )}
    </article>
  );
}

function BlocksPanel({ blocks }: { blocks: PublishBlock[] }) {
  return (
    <article className="panel primary">
      <div className="panelHeader"><p className="eyebrow">Publish Block</p><h2>公開前ブロックと修正指示</h2></div>
      {blocks.length === 0 ? (
        <p className="muted">公開前ブロックはありません。</p>
      ) : (
        <ul className="checkList" aria-label="publish blocks">
          {blocks.map((block) => (
            <li key={block.id} className="ng">
              <strong>{block.title}</strong>
              <span>{block.detail}</span>
              <em>{block.fixInstruction}</em>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function LedgerPanel({ ledger }: { ledger: HandoffDecisionLedger | null }) {
  if (!ledger) {
    return (
      <article className="panel primary" aria-label="handoff decision ledger empty">
        <div className="panelHeader"><p className="eyebrow">Ledger</p><h2>Handoff Decision Ledger</h2></div>
        <p className="muted">approvedになるまでHandoff Decision Ledgerは生成しません。</p>
      </article>
    );
  }

  return (
    <article className="panel primary" aria-label="handoff decision ledger">
      <div className="panelHeader"><p className="eyebrow">Ledger</p><h2>Handoff Decision Ledger</h2></div>
      <section className="proposalGrid">
        <LedgerText title="source_handoff_receipt_id" value={ledger.source_handoff_receipt_id} />
        <LedgerText title="decision" value={ledger.decision} />
        <LedgerText title="decision_owner" value={ledger.decision_owner} />
        <LedgerText title="decision_reason" value={ledger.decision_reason} />
        <LedgerList title="approved_execute_now" items={ledger.approved_execute_now} />
        <LedgerList title="verification_commands" items={ledger.verification_commands} />
        <LedgerList title="required_evidence" items={ledger.required_evidence} />
        <LedgerText title="rollback_condition" value={ledger.rollback_condition} />
        <div className="proposalItem">
          <h3>aidd_spec_connections</h3>
          <ul>
            {ledger.aidd_spec_connections.map((item) => <li key={item.id}>{item.label}: {item.status}</li>)}
          </ul>
        </div>
      </section>
      <div className="promptPreview">
        <h3>codex_command_draft</h3>
        <pre>{ledger.codex_command_draft}</pre>
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
