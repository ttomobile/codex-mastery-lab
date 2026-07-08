"use client";

import { useMemo, useState } from "react";
import { getQueueViewModel, type QueueMode } from "../src/ledger";

const modes: { key: QueueMode; label: string }[] = [
  { key: "empty", label: "empty" },
  { key: "queued", label: "queued" },
  { key: "blocked", label: "blocked" },
  { key: "exported", label: "exported" }
];

export default function Page() {
  const [mode, setMode] = useState<QueueMode>("empty");
  const viewModel = useMemo(() => getQueueViewModel(mode), [mode]);
  const action = viewModel.action;

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP072</p>
          <h1>Smoke Finding Action Queue</h1>
        </div>
        <div className={`status-pill status-${mode}`} data-testid="queue-status">
          {mode}
        </div>
      </header>

      <nav className="mode-tabs" aria-label="queue state">
        {modes.map((item) => (
          <button
            key={item.key}
            type="button"
            className={mode === item.key ? "active" : ""}
            onClick={() => setMode(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {mode === "empty" ? (
        <section className="empty-panel" data-testid="empty-panel">
          <h2>Smoke Findingはありません</h2>
          <p>
            smoke検出をAction Queueに入れると、URL障害、優先度、修正patch、検証証跡を1件の実行単位として扱います。
          </p>
        </section>
      ) : null}

      {action ? (
        <section className="queue-grid">
          <article className="panel primary" data-testid="finding-summary">
            <h2>Smoke Finding</h2>
            <dl>
              <div>
                <dt>broken URL</dt>
                <dd>{action.brokenUrl}</dd>
              </div>
              <div>
                <dt>HTTP status</dt>
                <dd>{action.httpStatus}</dd>
              </div>
              <div>
                <dt>byte size</dt>
                <dd>{action.byteSize.toLocaleString("ja-JP")} bytes</dd>
              </div>
              <div>
                <dt>content type</dt>
                <dd>{action.contentType}</dd>
              </div>
              <div>
                <dt>finding category</dt>
                <dd>{action.findingCategory}</dd>
              </div>
              <div>
                <dt>severity</dt>
                <dd>{action.severity}</dd>
              </div>
              <div>
                <dt>lane</dt>
                <dd>{action.lane}</dd>
              </div>
              <div>
                <dt>priority reason</dt>
                <dd>{action.priorityReason}</dd>
              </div>
              <div>
                <dt>rollback condition</dt>
                <dd>{action.rollbackCondition}</dd>
              </div>
            </dl>
          </article>

          <article className="panel">
            <h2>AI Task Packet patch</h2>
            <ul>
              {action.aiTaskPacketPatch.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h2>Codex prompt patch</h2>
            <dl>
              <div>
                <dt>execute_now</dt>
                <dd>
                  <ul>
                    {action.codexPromptPatch.executeNow.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>context</dt>
                <dd>
                  <ul>
                    {action.codexPromptPatch.context.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>defer</dt>
                <dd>
                  <ul>
                    {action.codexPromptPatch.defer.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </article>

          {mode === "blocked" ? (
            <article className="panel danger" data-testid="blocked-panel">
              <h2>blocked検出</h2>
              <ul>
                {viewModel.blockedFindings.map((finding) => (
                  <li key={finding.key}>
                    <strong>{finding.label}</strong>
                    <span>{finding.detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {mode === "exported" ? (
            <article className="panel command" data-testid="prompt-preview-panel">
              <h2>Codex prompt preview</h2>
              <pre data-testid="codex-prompt-preview">{viewModel.codexPromptPreview}</pre>
            </article>
          ) : null}

          <article className="panel">
            <h2>verification commands</h2>
            <ul>
              {action.verificationCommands.map((command) => (
                <li key={command}>
                  <code>{command}</code>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h2>required evidence</h2>
            <ul>
              {action.requiredEvidence.map((evidence) => (
                <li key={evidence}>
                  <code>{evidence}</code>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h2>AIDD-Spec接続</h2>
            <div className="spec-list">
              {action.aiddSpecConnections.map((connection) => (
                <span key={connection}>{connection}</span>
              ))}
            </div>
          </article>
        </section>
      ) : null}
    </main>
  );
}
