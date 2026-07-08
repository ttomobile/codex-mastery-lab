"use client";

import { useMemo, useState } from "react";
import { getQueueViewModel, type QueueMode } from "../src/ledger";

const modes: { key: QueueMode; label: string }[] = [
  { key: "empty", label: "empty" },
  { key: "queued", label: "queued" },
  { key: "rejected", label: "rejected" },
  { key: "evidence_missing", label: "evidence_missing" }
];

export default function Page() {
  const [mode, setMode] = useState<QueueMode>("empty");
  const viewModel = useMemo(() => getQueueViewModel(mode), [mode]);
  const item = viewModel.item;

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP073</p>
          <h1>Smoke Action Run Queue Intake</h1>
        </div>
        <div className={`status-pill status-${mode}`} data-testid="queue-status">
          {mode}
        </div>
      </header>

      <nav className="mode-tabs" aria-label="run queue state">
        {modes.map((itemMode) => (
          <button
            key={itemMode.key}
            type="button"
            className={mode === itemMode.key ? "active" : ""}
            onClick={() => setMode(itemMode.key)}
          >
            {itemMode.label}
          </button>
        ))}
      </nav>

      {mode === "empty" ? (
        <section className="empty-panel" data-testid="empty-panel">
          <h2>投入待ちのSmoke Actionはありません</h2>
          <p>
            export済みSmoke Actionを受け取ると、Run Queue item、Codex command、sandbox、検証command、3ブラウザ証跡を投入前に確認します。
          </p>
        </section>
      ) : null}

      {item ? (
        <section className="queue-grid">
          <article className="panel primary" data-testid="queue-summary">
            <h2>Run Queue intake</h2>
            <dl>
              <div>
                <dt>source smoke action id</dt>
                <dd>{item.sourceSmokeActionId}</dd>
              </div>
              <div>
                <dt>queue item id</dt>
                <dd>{item.queueItemId}</dd>
              </div>
              <div>
                <dt>Codex command</dt>
                <dd>
                  <code>{item.codexCommand}</code>
                </dd>
              </div>
              <div>
                <dt>sandbox mode</dt>
                <dd>{item.sandboxMode}</dd>
              </div>
              <div>
                <dt>rollback plan</dt>
                <dd>{item.rollbackPlan}</dd>
              </div>
            </dl>
          </article>

          <article className="panel">
            <h2>required verification commands</h2>
            <ul>
              {item.requiredVerificationCommands.map((command) => (
                <li key={command}>
                  <code>{command}</code>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h2>Chromium / Firefox / WebKit</h2>
            <div className="spec-list" data-testid="browser-list">
              {item.requiredBrowsers.map((browser) => (
                <span key={browser}>{browser}</span>
              ))}
            </div>
          </article>

          <article className="panel">
            <h2>required evidence</h2>
            <ul>
              {item.requiredEvidence.map((evidence) => (
                <li key={evidence}>
                  <code>{evidence}</code>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h2>AIDD-Spec接続</h2>
            <div className="spec-list">
              {item.aiddSpecConnections.map((connection) => (
                <span key={connection}>{connection}</span>
              ))}
            </div>
          </article>

          <article className="panel command" data-testid="command-preview-panel">
            <h2>Codex command preview</h2>
            <pre data-testid="codex-command-preview">{viewModel.codexCommandPreview}</pre>
          </article>

          <article className="panel command" data-testid="payload-panel">
            <h2>Run Queue payload</h2>
            <pre data-testid="run-queue-payload">{viewModel.runQueuePayloadPreview}</pre>
          </article>

          {mode === "rejected" ? (
            <article className="panel danger" data-testid="rejected-panel">
              <h2>rejected検出</h2>
              <ul>
                {viewModel.rejectedFindings.map((finding) => (
                  <li key={finding.key}>
                    <strong>{finding.label}</strong>
                    <span>{finding.detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {mode === "evidence_missing" ? (
            <article className="panel danger" data-testid="evidence-missing-panel">
              <h2>evidence_missing検出</h2>
              <ul>
                {viewModel.evidenceMissingFindings.map((finding) => (
                  <li key={finding.key}>
                    <strong>{finding.label}</strong>
                    <span>{finding.detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
