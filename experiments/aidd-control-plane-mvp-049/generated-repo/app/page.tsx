"use client";

import { useMemo, useState } from "react";
import {
  createVerificationRunPacket,
  evaluateVerificationRunDetail,
  requiredCommands,
  type DetailMode
} from "../src/lib/verification-run";

const modeLabels: Record<DetailMode, string> = {
  empty: "empty",
  ready: "ready",
  failure: "failure"
};

const connectionLabels = ["AIDD-Spec v0.1", "Verification Evidence", "Review Record", "Learning Log"];

export default function Home() {
  const [mode, setMode] = useState<DetailMode>("empty");
  const packet = useMemo(() => createVerificationRunPacket(mode), [mode]);
  const review = useMemo(() => evaluateVerificationRunDetail(packet), [packet]);

  return (
    <main className="shell">
      <section className="hero" aria-label="Verification Run Detail Drilldown">
        <div>
          <p className="eyebrow">AIDD Control Plane SaaS</p>
          <h1>MVP 049: Verification Run Detail Drilldown</h1>
          <p className="lead">
            Codex Run Queueの1件をcommand別のVerification Run Detailへ展開し、exit code、duration、artifact、失敗分類、修正指示、3ブラウザ証跡を確認します。
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
            <p className="eyebrow">Run Detail</p>
            <h2>Verification Run Detail: {review.status}</h2>
          </div>

          {review.status === "empty" && (
            <div className="emptyBox">
              <h3>入力待ち</h3>
              <p>
                必要入力: source queue item / source run status / commit SHA / command別detail / exit code / duration / terminal log path /
                artifact path / failure category / repair instruction / browser coverage / screenshot evidence / AIDD-Spec connection
              </p>
            </div>
          )}

          {review.status === "ready" && (
            <div className="readyBox" aria-label="ready detail">
              <h3>ready: command別Verification Run Detail</h3>
              <dl className="detailList">
                <div>
                  <dt>source queue item</dt>
                  <dd>{packet.sourceQueueItem}</dd>
                </div>
                <div>
                  <dt>source run status</dt>
                  <dd>{packet.sourceRunStatus}</dd>
                </div>
                <div>
                  <dt>commit SHA</dt>
                  <dd>{packet.commitSha}</dd>
                </div>
                <div>
                  <dt>browser coverage</dt>
                  <dd>{packet.browserCoverage.join(" / ")}</dd>
                </div>
              </dl>
            </div>
          )}

          {review.status === "failure" && (
            <div className="failureBox" aria-label="failure findings">
              <h3>Review Findingへ渡す不足</h3>
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
            <h2>Source Queue Item</h2>
          </div>
          <dl className="compactList">
            <div>
              <dt>source queue item</dt>
              <dd>{packet.sourceQueueItem ?? "未選択"}</dd>
            </div>
            <div>
              <dt>source run status</dt>
              <dd>{packet.sourceRunStatus ?? "未取得"}</dd>
            </div>
            <div>
              <dt>commit SHA</dt>
              <dd>{packet.commitSha ?? "不足"}</dd>
            </div>
          </dl>
        </article>

        <article className="panel previewPanel">
          <div className="panelHeader">
            <p className="eyebrow">Commands</p>
            <h2>Command別 Detail</h2>
          </div>
          {packet.commandDetails.length === 0 ? (
            <p className="muted">まだcommand別detailはありません。lint / typecheck / test / build / test:e2e / doctor:aiddを束ねます。</p>
          ) : (
            <div className="commandGrid" aria-label="command detail table">
              {packet.commandDetails.map((detail) => (
                <section className="commandCard" key={detail.commandName}>
                  <h3>{detail.commandName}</h3>
                  <dl>
                    <div>
                      <dt>exit code</dt>
                      <dd>{detail.exitCode ?? "不足"}</dd>
                    </div>
                    <div>
                      <dt>duration</dt>
                      <dd>{detail.duration}</dd>
                    </div>
                    <div>
                      <dt>terminal log path</dt>
                      <dd>{detail.terminalLogPath}</dd>
                    </div>
                    <div>
                      <dt>artifact path</dt>
                      <dd>{detail.artifactPath ?? "不足"}</dd>
                    </div>
                    <div>
                      <dt>failure category</dt>
                      <dd>{detail.failureCategory ?? "不足"}</dd>
                    </div>
                    <div>
                      <dt>repair instruction</dt>
                      <dd>{detail.repairInstruction ?? "不足"}</dd>
                    </div>
                  </dl>
                </section>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Coverage</p>
            <h2>Chromium / Firefox / WebKit coverage</h2>
          </div>
          <ul className="checkList">
            {["Chromium", "Firefox", "WebKit"].map((browser) => (
              <li key={browser} className={packet.browserCoverage.includes(browser) ? "ok" : "ng"}>
                {browser}
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">Evidence</p>
            <h2>Screenshot / Terminal Evidence</h2>
          </div>
          <ul className="checkList">
            <li className={packet.evidence.terminal ? "ok" : "ng"}>terminal evidence</li>
            <li className={packet.evidence.emptyScreenshot ? "ok" : "ng"}>empty screenshot evidence</li>
            <li className={packet.evidence.readyScreenshot ? "ok" : "ng"}>ready screenshot evidence</li>
            <li className={packet.evidence.failureScreenshot ? "ok" : "ng"}>failure screenshot evidence</li>
          </ul>
        </article>

        <article className="panel">
          <div className="panelHeader">
            <p className="eyebrow">AIDD-Spec</p>
            <h2>接続</h2>
          </div>
          <div className="connectionGrid" aria-label="AIDD-Spec connections">
            {connectionLabels.map((connection) => (
              <span key={connection} className={review.connectedTo.includes(connection) ? "connected" : "missing"}>
                {connection}
              </span>
            ))}
          </div>
        </article>

        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Review Finding Draft</p>
            <h2>失敗分類と修正指示</h2>
          </div>
          <dl className="detailList">
            <div>
              <dt>失敗分類</dt>
              <dd>{review.reviewFindingDraft.failureCategory}</dd>
            </div>
            <div>
              <dt>理想状態</dt>
              <dd>{review.reviewFindingDraft.idealState}</dd>
            </div>
            <div>
              <dt>修正指示</dt>
              <dd>{review.reviewFindingDraft.repairInstruction}</dd>
            </div>
            <div>
              <dt>必要な上流情報</dt>
              <dd>{review.reviewFindingDraft.upstreamInformation.join(" / ")}</dd>
            </div>
            <div>
              <dt>検証command</dt>
              <dd>{review.reviewFindingDraft.verificationCommands.join(" / ")}</dd>
            </div>
            <div>
              <dt>required command name</dt>
              <dd>{requiredCommands.join(" / ")}</dd>
            </div>
          </dl>
        </article>
      </section>
    </main>
  );
}
