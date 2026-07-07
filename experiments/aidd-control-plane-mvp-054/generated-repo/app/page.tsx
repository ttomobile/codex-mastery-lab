"use client";

import { useMemo, useState } from "react";
import {
  createHandoffPacket,
  requiredReceiptFields,
  reviewHandoffPacket,
  type HandoffReceipt,
  type PublishBlock,
  type ReceiptCase
} from "../src/lib/handoff-receipt";

const caseLabels: Record<ReceiptCase, string> = {
  empty: "empty",
  valid: "valid",
  blocked: "blocked"
};

export default function Home() {
  const [caseName, setCaseName] = useState<ReceiptCase>("empty");
  const packet = useMemo(() => createHandoffPacket(caseName), [caseName]);
  const review = useMemo(() => reviewHandoffPacket(packet), [packet]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP054">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP054</p>
          <h1>縮小版AI Task Packetを次回実行へ渡す前のハンドオフレシート</h1>
          <p className="lead">
            MVP053のShrink Plannerの次段として、縮小結果をempty / valid / blockedで確認し、
            validのときだけ次回実行へ渡せる縮小版ハンドオフレシートを表示します。
          </p>
        </div>
        <div className={`statusBadge ${review.decision}`}>
          <span>判定</span>
          <strong>{review.decision}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="ケース切替">
        {(["empty", "valid", "blocked"] as ReceiptCase[]).map((item) => (
          <button key={item} type="button" className={caseName === item ? "active" : ""} onClick={() => setCaseName(item)}>
            {caseLabels[item]}ケース
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Handoff Gate</p>
            <h2>ハンドオフ判断: {review.decision}</h2>
          </div>
          {review.decision === "empty" && (
            <div className="emptyBox" aria-label="empty summary">
              <h3>empty: 受け渡す縮小計画がありません</h3>
              <p>MVP053からsource_shrink_plan_idが届いていないため、次回実行へ渡すレシートは生成しません。</p>
            </div>
          )}
          {review.decision === "valid" && (
            <div className="readyBox" aria-label="valid summary">
              <h3>valid: 縮小版ハンドオフレシートを生成</h3>
              <p>必須項目、AIDD-Spec接続、3ブラウザ証跡、rollback条件がそろっています。</p>
            </div>
          )}
          {review.decision === "blocked" && (
            <div className="failureBox" aria-label="blocked summary">
              <h3>blocked: 公開前ブロックがあります</h3>
              <p>未サニタイズ情報、検証不足、rollback不足、3ブラウザ不足、evidence不足を修正するまで次回実行へ渡しません。</p>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Source</p><h2>MVP053からの入力</h2></div>
          <dl className="compactList">
            <div><dt>source_shrink_plan_id</dt><dd>{packet.sourceShrinkPlanId || "未受信"}</dd></div>
            <div><dt>execute_now</dt><dd>{packet.executeNow.length}件</dd></div>
            <div><dt>defer_next_increment</dt><dd>{packet.deferNextIncrement.length}件</dd></div>
            <div><dt>browser evidence</dt><dd>{packet.browserEvidence.join(" / ") || "未確認"}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Required</p><h2>レシート必須項目</h2></div>
          <ul className="checkList" aria-label="required receipt fields">
            {requiredReceiptFields.map((field) => <li key={field} className={review.receipt ? "ok" : "pending"}>{field}</li>)}
          </ul>
        </article>

        <BlocksPanel blocks={review.publishBlocks} />

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Sanitize</p><h2>公開用プレビュー</h2></div>
          {review.sanitizedPreview ? <pre>{review.sanitizedPreview}</pre> : <p className="muted">プレビューはありません。</p>}
        </article>

        <ReceiptPanel receipt={review.receipt} />
      </section>
    </main>
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

function ReceiptPanel({ receipt }: { receipt: HandoffReceipt | null }) {
  if (!receipt) {
    return (
      <article className="panel primary" aria-label="handoff receipt empty">
        <div className="panelHeader"><p className="eyebrow">Receipt</p><h2>縮小版ハンドオフレシート</h2></div>
        <p className="muted">validになるまで縮小版ハンドオフレシートは生成しません。</p>
      </article>
    );
  }

  return (
    <article className="panel primary" aria-label="handoff receipt">
      <div className="panelHeader"><p className="eyebrow">Receipt</p><h2>縮小版ハンドオフレシート</h2></div>
      <section className="proposalGrid">
        <ReceiptText title="source_shrink_plan_id" value={receipt.source_shrink_plan_id} />
        <ReceiptList title="execute_now" items={receipt.execute_now} />
        <ReceiptList title="defer_next_increment" items={receipt.defer_next_increment} />
        <ReceiptList title="minimum_verification" items={receipt.minimum_verification} />
        <ReceiptList title="required_evidence" items={receipt.required_evidence} />
        <ReceiptText title="rollback_condition" value={receipt.rollback_condition} />
        <div className="proposalItem">
          <h3>aidd_spec_connections</h3>
          <ul>
            {receipt.aidd_spec_connections.map((item) => <li key={item.id}>{item.label}: {item.status}</li>)}
          </ul>
        </div>
      </section>
      <div className="promptPreview">
        <h3>codex_prompt_preview</h3>
        <pre>{receipt.codex_prompt_preview}</pre>
      </div>
    </article>
  );
}

function ReceiptList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="proposalItem">
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function ReceiptText({ title, value }: { title: string; value: string }) {
  return (
    <div className="proposalItem">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
