"use client";

import { useMemo, useState } from "react";
import {
  createReadinessPacket,
  evaluateOneRunExecutionReadinessGate,
  requiredVerificationCommands,
  type GateMode
} from "../src/lib/readiness";

const modeLabels: Record<GateMode, string> = {
  empty: "empty",
  ready: "ready",
  blocked: "blocked"
};

export default function Home() {
  const [mode, setMode] = useState<GateMode>("empty");
  const packet = useMemo(() => createReadinessPacket(mode), [mode]);
  const review = useMemo(() => evaluateOneRunExecutionReadinessGate(packet), [packet]);

  return (
    <main className="shell">
      <section className="hero" aria-label="One-Run Execution Readiness Gate">
        <div>
          <p className="eyebrow">AIDD Control Plane SaaS</p>
          <h1>MVP 048: One-Run Execution Readiness Gate</h1>
          <p className="lead">
            Review Finding Action Queueからexecute_nowを1件だけ取り出し、Codex実行へ渡す直前に止めるべき条件を確認します。
          </p>
        </div>
        <div className={`statusBadge ${review.status}`}>
          <span>状態</span>
          <strong>{review.status}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="状態切替">
        {(["empty", "ready", "blocked"] as GateMode[]).map((item) => (
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
            <p className="eyebrow">Gate</p>
            <h2>One-Run Execution Readiness Gate: {review.status}</h2>
          </div>

          {review.status === "empty" && (
            <div className="emptyBox">
              <h3>入力待ち</h3>
              <p>必要入力: source queue id / execute_now action / Codex command / sandbox / verification commands / terminal evidence / failure screenshot / rollback stop condition / AIDD-Spec connection</p>
            </div>
          )}

          {review.status === "ready" && review.readyAction && (
            <div className="readyBox" aria-label="ready handoff">
              <h3>手渡し確認: execute_now 1件だけ</h3>
              <dl className="detailList">
                <div>
                  <dt>source queue id</dt>
                  <dd>{packet.sourceQueueId}</dd>
                </div>
                <div>
                  <dt>action</dt>
                  <dd>{review.readyAction.action}</dd>
                </div>
                <div>
                  <dt>title</dt>
                  <dd>{review.readyAction.title}</dd>
                </div>
                <div>
                  <dt>sandbox mode</dt>
                  <dd>{packet.sandboxMode}</dd>
                </div>
              </dl>
            </div>
          )}

          {review.status === "blocked" && (
            <div className="blockedBox" aria-label="blocked findings">
              <h3>実行前に止めるReview Finding</h3>
              <ul>
                {review.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Queue</p>
            <h2>Review Finding Action Queue</h2>
          </div>
          {packet.actions.length === 0 ? (
            <p className="muted">まだactionはありません。</p>
          ) : (
            <div className="queueList" aria-label="Review Finding Action Queue items">
              {packet.actions.map((action) => (
                <div className="queueItem" key={action.id}>
                  <span className={`pill ${action.action}`}>{action.action}</span>
                  <h3>{action.title}</h3>
                  <p>{action.id}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel previewPanel">
          <div className="panelHeader">
            <p className="eyebrow">Codex</p>
            <h2>Codex command preview</h2>
          </div>
          {review.commandPreview.length === 0 ? (
            <p className="muted">readyなexecute_now actionだけがここに入ります。next_incrementやlearning_logは混ぜません。</p>
          ) : (
            <pre aria-label="Codex command preview">{review.commandPreview.join("\n")}</pre>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Verification</p>
            <h2>Required Verification Commands</h2>
          </div>
          <ul className="checkList">
            {requiredVerificationCommands.map((command) => (
              <li key={command} className={packet.verificationCommands.includes(command) ? "ok" : "ng"}>
                {command}
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Evidence</p>
            <h2>Verification Evidence</h2>
          </div>
          <ul className="checkList">
            <li className={packet.evidence.terminalEvidence ? "ok" : "ng"}>terminal evidence</li>
            <li className={packet.evidence.failureScreenshot ? "ok" : "ng"}>failure screenshot</li>
            <li className={packet.browserProjects.includes("firefox") ? "ok" : "ng"}>Chromium / Firefox / WebKit</li>
            <li className={packet.rollbackStopCondition ? "ok" : "ng"}>rollback stop condition</li>
          </ul>
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">AIDD-Spec</p>
            <h2>接続</h2>
          </div>
          <div className="connectionGrid" aria-label="AIDD-Spec connections">
            {["AIDD-Spec v0.1", "Verification Evidence", "Review Record", "Learning Log"].map((connection) => (
              <span key={connection} className={review.connections.includes(connection) ? "connected" : "missing"}>
                {connection}
              </span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
