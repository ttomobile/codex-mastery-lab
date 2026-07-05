"use client";

import { useMemo, useState } from "react";
import {
  createDecisionPacket,
  evaluatePriorityDecisionWorkspace,
  requiredDecisionFields,
  type DecisionMode
} from "../src/lib/verification-run";

const modeLabels: Record<DecisionMode, string> = {
  empty: "empty",
  ready: "ready",
  failure: "failure"
};

export default function Home() {
  const [mode, setMode] = useState<DecisionMode>("empty");
  const packet = useMemo(() => createDecisionPacket(mode), [mode]);
  const review = useMemo(() => evaluatePriorityDecisionWorkspace(packet), [packet]);

  return (
    <main className="shell">
      <section className="hero" aria-label="Repair Delta Priority Decision Workspace">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP051</p>
          <h1>Repair Delta Priority Decision Workspace</h1>
          <p className="lead">
            Evidence Repair Deltaを採用 / 保留 / 却下に分け、採用済みdeltaだけを次回AI Task PacketとCodex promptへ進めます。
            全部を一度に投げず、次の1インクリメントで実行するものだけを選ぶための判断画面です。
          </p>
        </div>
        <div className={`statusBadge ${review.status}`}>
          <span>状態</span>
          <strong>{review.status}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="状態切替">
        {(["empty", "ready", "failure"] as DecisionMode[]).map((item) => (
          <button key={item} type="button" className={mode === item ? "active" : ""} onClick={() => setMode(item)}>
            {modeLabels[item]}サンプル
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Decision</p>
            <h2>Priority Decision状態: {review.status}</h2>
          </div>

          {review.status === "empty" && (
            <div className="emptyBox" aria-label="empty state">
              <h3>repair delta未選択</h3>
              <p>判断対象のrepair deltaがないため、次回AI Task Packetへ進めません。まず失敗ログからEvidence Repair Deltaを生成してください。</p>
            </div>
          )}

          {review.status === "ready" && (
            <div className="readyBox" aria-label="ready summary">
              <h3>ready: 採用済みdeltaを{review.acceptedDeltas.length}件だけ次回へ進める</h3>
              <p>採用 / 保留 / 却下を分け、execute_nowのdeltaだけを次回AI Task PacketとCodex prompt previewへ入れました。</p>
            </div>
          )}

          {review.status === "failure" && (
            <div className="failureBox" aria-label="failure findings">
              <h3>Decision draft: 不足検出</h3>
              <ul>
                {review.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
              {review.publishBlockReasons.map((reason) => (
                <p className="blockReason" key={reason}>{reason}</p>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Source</p>
            <h2>Evidence Repair Delta</h2>
          </div>
          <dl className="compactList">
            <div><dt>source workspace</dt><dd>{packet.sourceWorkspace}</dd></div>
            <div><dt>decision count</dt><dd>{packet.decisions.length}</dd></div>
            <div><dt>AIDD-Spec接続</dt><dd>{packet.aiddSpecConnected ? "接続済み" : "不足"}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Required</p>
            <h2>判断必須項目</h2>
          </div>
          <ul className="checkList">
            {requiredDecisionFields.map((field) => (
              <li key={field} className={review.status === "ready" ? "ok" : "ng"}>{field}</li>
            ))}
          </ul>
        </article>

        <article className="panel primary deltaPanel">
          <div className="panelHeader">
            <p className="eyebrow">Decision Ledger</p>
            <h2>採用 / 保留 / 却下の判断</h2>
          </div>
          {packet.decisions.length === 0 ? (
            <p className="muted">readyになるまで判断候補は表示されません。emptyではrepair deltaを選択してください。</p>
          ) : (
            <div className="deltaGrid" aria-label="repair delta decisions">
              {packet.decisions.map((decision) => (
                <section className="deltaCard" key={decision.sourceRepairDeltaId ?? "draft"}>
                  <div className="deltaTitle">
                    <h3>{decision.sourceRepairDeltaId}</h3>
                    <span>{decision.decision || "未判断"}</span>
                  </div>
                  <dl className="detailList single">
                    <div><dt>lane</dt><dd>{decision.lane || "未設定"}</dd></div>
                    <div><dt>priority reason</dt><dd>{decision.priorityReason || "不足"}</dd></div>
                    <div><dt>decision owner</dt><dd>{decision.decisionOwner || "不足"}</dd></div>
                    <div><dt>review evidence</dt><dd>{decision.reviewEvidence || "不足"}</dd></div>
                    <div><dt>rollback condition</dt><dd>{decision.rollbackCondition || "不足"}</dd></div>
                    <div><dt>next packet section</dt><dd>{decision.nextPacketSection || "不足"}</dd></div>
                    <div><dt>Codex prompt patch</dt><dd>{decision.codexPromptPatch || "不足"}</dd></div>
                    <div><dt>browser projects</dt><dd>{decision.browserProjects?.join(" / ") || "不足"}</dd></div>
                    <div><dt>Verification Evidence接続</dt><dd>{decision.verificationEvidenceConnection || "不足"}</dd></div>
                    <div><dt>Review Record接続</dt><dd>{decision.reviewRecordConnection || "不足"}</dd></div>
                    <div><dt>Learning Log接続</dt><dd>{decision.learningLogConnection || "不足"}</dd></div>
                    <div><dt>AIDD-Spec接続</dt><dd>{decision.aiddSpecConnection || "不足"}</dd></div>
                  </dl>
                </section>
              ))}
            </div>
          )}
        </article>

        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Next Packet Preview</p>
            <h2>採用済みdeltaだけを次回packetへ進める</h2>
          </div>
          {review.nextPacketPreview.length === 0 ? (
            <p className="muted">採用済みdeltaがないため、次回packet previewは空です。</p>
          ) : (
            <ul className="checkList" aria-label="next packet preview">
              {review.nextPacketPreview.map((item) => <li className="ok" key={item}>{item}</li>)}
            </ul>
          )}
          {review.codexPromptPreview.length > 0 && <pre>{review.codexPromptPreview.join("\n")}</pre>}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Publish Gate</p><h2>公開前ブロック</h2></div>
          <div className={review.publishBlockReasons.length > 0 ? "failureBox" : "readyBox"}>
            {review.publishBlockReasons.length > 0 ? review.publishBlockReasons.map((reason) => <p key={reason}>{reason}</p>) : <p>local path、host名、private network URLの混入は検出されていません。</p>}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Learning</p><h2>Learning Log連携</h2></div>
          <ul className="checkList">
            {packet.notes.map((note) => <li key={note} className={review.status === "failure" ? "ng" : "ok"}>{note}</li>)}
          </ul>
        </article>
      </section>
    </main>
  );
}
