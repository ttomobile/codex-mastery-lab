"use client";

import { useMemo, useState } from "react";
import { createBudget, evaluateBudgetGate, requiredBudgetFields, type BudgetMode } from "../src/lib/verification-run";

const modeLabels: Record<BudgetMode, string> = { empty: "empty", ready: "ready", failure: "failure" };

export default function Home() {
  const [mode, setMode] = useState<BudgetMode>("empty");
  const budget = useMemo(() => createBudget(mode), [mode]);
  const review = useMemo(() => evaluateBudgetGate(budget), [budget]);

  return (
    <main className="shell">
      <section className="hero" aria-label="Codex Run Budget Gate">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP052</p>
          <h1>Codex Run Budget Gate</h1>
          <p className="lead">
            採用済みRepair DeltaをCodexへ渡す前に、利用枠、停止条件、fallback action、3ブラウザ検証を確認します。
            go / brake / stopを先に決めることで、長時間ループと証跡欠けを防ぎます。
          </p>
        </div>
        <div className={`statusBadge ${review.status === "go" ? "ready" : review.status === "stop" ? "failure" : ""}`}>
          <span>状態</span>
          <strong>{review.status}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="状態切替">
        {(["empty", "ready", "failure"] as BudgetMode[]).map((item) => (
          <button key={item} type="button" className={mode === item ? "active" : ""} onClick={() => setMode(item)}>
            {modeLabels[item]}サンプル
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Run Gate</p>
            <h2>Codex実行判断: {review.status}</h2>
          </div>
          {review.status === "empty" && (
            <div className="emptyBox" aria-label="empty state">
              <h3>実行候補packet未選択</h3>
              <p>採用済みdeltaを含むAI Task Packetがないため、Codexを開始できません。</p>
            </div>
          )}
          {review.status === "go" && (
            <div className="readyBox" aria-label="ready summary">
              <h3>go: Codex実行前チェックを通過</h3>
              <p>利用枠、停止条件、fallback action、Verification Evidence接続、Chromium / Firefox / WebKitを確認しました。</p>
            </div>
          )}
          {review.status === "stop" && (
            <div className="failureBox" aria-label="failure findings">
              <h3>stop: 実行前ブロック</h3>
              <ul>{review.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
              {review.publishBlockReasons.map((reason) => <p className="blockReason" key={reason}>{reason}</p>)}
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Usage</p><h2>Codex利用枠</h2></div>
          <dl className="compactList">
            <div><dt>usage band</dt><dd>{review.usageBand}</dd></div>
            <div><dt>primary usage</dt><dd>{budget.primaryUsagePercent ?? "未測定"}%</dd></div>
            <div><dt>secondary usage</dt><dd>{budget.secondaryUsagePercent ?? "未測定"}%</dd></div>
            <div><dt>max runtime</dt><dd>{budget.maxRuntimeMinutes ?? "未設定"}分</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Required</p><h2>実行前必須項目</h2></div>
          <ul className="checkList">
            {requiredBudgetFields.map((field) => <li key={field} className={review.status === "go" ? "ok" : "ng"}>{field}</li>)}
          </ul>
        </article>

        <article className="panel primary">
          <div className="panelHeader"><p className="eyebrow">Packet</p><h2>対象AI Task Packet</h2></div>
          <dl className="detailList single">
            <div><dt>source packet id</dt><dd>{budget.sourcePacketId}</dd></div>
            <div><dt>accepted repair delta</dt><dd>{budget.acceptedRepairDelta || "未設定"}</dd></div>
            <div><dt>stop condition</dt><dd>{budget.stopCondition || "不足"}</dd></div>
            <div><dt>fallback action</dt><dd>{budget.fallbackAction || "不足"}</dd></div>
            <div><dt>browser projects</dt><dd>{budget.browserProjects.join(" / ") || "不足"}</dd></div>
          </dl>
        </article>

        <article className="panel primary">
          <div className="panelHeader"><p className="eyebrow">Verification</p><h2>実行後に残す証跡</h2></div>
          <ul className="checkList" aria-label="verification commands">
            {budget.verificationCommands.length === 0 ? <li className="ng">検証コマンド未設定</li> : budget.verificationCommands.map((command) => <li className="ok" key={command}>{command}</li>)}
          </ul>
        </article>

        <article className="panel primary">
          <div className="panelHeader"><p className="eyebrow">Codex Prompt Preview</p><h2>goの時だけpromptへ進める</h2></div>
          {review.promptPreview.length === 0 ? <p className="muted">stop/emptyではCodex prompt previewを出しません。</p> : <pre>{review.promptPreview.join("\n")}</pre>}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">AIDD-Spec</p><h2>標準接続</h2></div>
          <ul className="checkList">
            {[budget.verificationEvidenceConnection, budget.reviewRecordConnection, budget.learningLogConnection, budget.maintenanceRunbookConnection, budget.aiddSpecConnection].map((item, index) => <li key={index} className={item ? "ok" : "ng"}>{item || "接続不足"}</li>)}
          </ul>
        </article>
      </section>
    </main>
  );
}
