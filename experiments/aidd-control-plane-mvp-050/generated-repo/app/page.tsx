"use client";

import { useMemo, useState } from "react";
import {
  createRepairPacket,
  evaluateRepairDeltaGenerator,
  requiredDeltaFields,
  type DetailMode
} from "../src/lib/verification-run";

const modeLabels: Record<DetailMode, string> = {
  empty: "empty",
  ready: "ready",
  failure: "failure"
};

export default function Home() {
  const [mode, setMode] = useState<DetailMode>("empty");
  const packet = useMemo(() => createRepairPacket(mode), [mode]);
  const review = useMemo(() => evaluateRepairDeltaGenerator(packet), [packet]);

  return (
    <main className="shell">
      <section className="hero" aria-label="Evidence Repair Delta Generator">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP050</p>
          <h1>Evidence Repair Delta Generator</h1>
          <p className="lead">
            Verification Run Detailで見つかったfailed / evidence_missing / timeoutのfindingを、次回AI Task
            Packet delta、Codex prompt delta、検証command、rollback条件、Learning Logへ変換します。
          </p>
        </div>
        <div className={`statusBadge ${review.status}`}>
          <span>状態</span>
          <strong>{review.status}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="状態切替">
        {(["empty", "ready", "failure"] as DetailMode[]).map((item) => (
          <button
            key={item}
            type="button"
            className={mode === item ? "active" : ""}
            onClick={() => setMode(item)}
          >
            {modeLabels[item]}サンプル
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Generator</p>
            <h2>Repair Delta状態: {review.status}</h2>
          </div>

          {review.status === "empty" && (
            <div className="emptyBox" aria-label="empty state">
              <h3>finding未読込</h3>
              <p>
                Verification Run Detailのfindingが未選択です。次回AI Task Packetへ戻す材料がないため、失敗分類、優先度、修正指示、検証command、Learning
                Log案を生成できません。
              </p>
            </div>
          )}

          {review.status === "ready" && (
            <div className="readyBox" aria-label="ready summary">
              <h3>ready: delta候補を{review.deltas.length}件生成済み</h3>
              <p>
                failed、evidence_missing、timeoutを、それぞれ次回Packet、Codex prompt、検証command、rollback条件、Learning
                Logへ接続しました。
              </p>
            </div>
          )}

          {review.status === "failure" && (
            <div className="failureBox" aria-label="failure findings">
              <h3>Review Finding draft: 不足検出</h3>
              <ul>
                {review.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
              {review.reviewFindingDraft.publishBlockReasons.map((reason) => (
                <p className="blockReason" key={reason}>
                  {reason}
                </p>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Source</p>
            <h2>Verification Run Detail</h2>
          </div>
          <dl className="compactList">
            <div>
              <dt>source run</dt>
              <dd>{packet.sourceRun}</dd>
            </div>
            <div>
              <dt>finding count</dt>
              <dd>{packet.findings.length}</dd>
            </div>
            <div>
              <dt>AIDD-Spec接続</dt>
              <dd>{packet.aiddSpecConnected ? "接続済み" : "不足"}</dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Required</p>
            <h2>delta必須項目</h2>
          </div>
          <ul className="checkList">
            {requiredDeltaFields.map((field) => (
              <li key={field} className={review.status === "ready" ? "ok" : "ng"}>
                {field}
              </li>
            ))}
          </ul>
        </article>

        <article className="panel primary deltaPanel">
          <div className="panelHeader">
            <p className="eyebrow">Repair Delta</p>
            <h2>次回AI Task Packetへ戻すdelta候補</h2>
          </div>
          {review.deltas.length === 0 ? (
            <p className="muted">readyになるまでdelta候補は表示されません。failureでは不足を補ってから再生成します。</p>
          ) : (
            <div className="deltaGrid" aria-label="repair delta candidates">
              {review.deltas.map((delta) => (
                <section className="deltaCard" key={delta.findingId}>
                  <div className="deltaTitle">
                    <h3>{delta.findingId}</h3>
                    <span>{delta.priority}</span>
                  </div>
                  <dl className="detailList single">
                    <div>
                      <dt>失敗分類</dt>
                      <dd>{delta.failureCategory}</dd>
                    </div>
                    <div>
                      <dt>理想状態</dt>
                      <dd>{delta.idealState}</dd>
                    </div>
                    <div>
                      <dt>修正指示</dt>
                      <dd>{delta.repairInstruction}</dd>
                    </div>
                    <div>
                      <dt>AI Task Packet delta</dt>
                      <dd>{delta.aiTaskPacketDelta}</dd>
                    </div>
                    <div>
                      <dt>Codex prompt delta</dt>
                      <dd>{delta.codexPromptDelta}</dd>
                    </div>
                    <div>
                      <dt>verification command</dt>
                      <dd>{delta.verificationCommand}</dd>
                    </div>
                    <div>
                      <dt>rollback condition</dt>
                      <dd>{delta.rollbackCondition}</dd>
                    </div>
                    <div>
                      <dt>Learning Log案</dt>
                      <dd>{delta.learningLogProposal}</dd>
                    </div>
                    <div>
                      <dt>AIDD-Spec接続</dt>
                      <dd>{delta.aiddSpecConnection}</dd>
                    </div>
                  </dl>
                </section>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Publish Gate</p>
            <h2>公開前ブロック</h2>
          </div>
          <div className={review.reviewFindingDraft.publishBlockReasons.length > 0 ? "failureBox" : "readyBox"}>
            {review.reviewFindingDraft.publishBlockReasons.length > 0 ? (
              review.reviewFindingDraft.publishBlockReasons.map((reason) => <p key={reason}>{reason}</p>)
            ) : (
              <p>local path、host名、private network URLの混入は検出されていません。</p>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Learning</p>
            <h2>Learning Log連携</h2>
          </div>
          <ul className="checkList">
            {packet.notes.map((note) => (
              <li key={note} className={review.status === "failure" ? "ng" : "ok"}>
                {note}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
