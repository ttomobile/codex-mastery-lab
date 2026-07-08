"use client";

import { useMemo, useState } from "react";
import { getLedgerViewModel, type LedgerMode } from "../src/ledger";

const modes: { key: LedgerMode; label: string }[] = [
  { key: "empty", label: "empty" },
  { key: "approved", label: "approved" },
  { key: "held", label: "held" },
  { key: "blocked", label: "blocked" }
];

export default function Page() {
  const [mode, setMode] = useState<LedgerMode>("empty");
  const viewModel = useMemo(() => getLedgerViewModel(mode), [mode]);
  const receipt = viewModel.receipt;

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP071</p>
          <h1>Handoff Decision Ledger</h1>
        </div>
        <div className={`status-pill status-${mode}`} data-testid="ledger-status">
          {mode}
        </div>
      </header>

      <nav className="mode-tabs" aria-label="ledger state">
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
          <h2>判断材料がありません</h2>
          <p>
            source handoff receipt を選ぶと、Review Recordとして実行・保留・停止の判断を記録します。
          </p>
        </section>
      ) : null}

      {receipt ? (
        <section className="ledger-grid">
          <article className="panel primary">
            <h2>Review Record</h2>
            <dl>
              <div>
                <dt>source handoff receipt</dt>
                <dd>{receipt.sourceHandoffReceipt}</dd>
              </div>
              <div>
                <dt>decision owner</dt>
                <dd>{receipt.decisionOwner}</dd>
              </div>
              <div>
                <dt>decision reason</dt>
                <dd>{receipt.decisionReason || "理由不足: Review Recordへ返却してください。"}</dd>
              </div>
              <div>
                <dt>rollback condition</dt>
                <dd>{receipt.rollbackCondition}</dd>
              </div>
            </dl>
          </article>

          {mode === "approved" ? (
            <>
              <article className="panel">
                <h2>approved execute_now</h2>
                <ul data-testid="execute-now-list">
                  {receipt.executeNow.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="panel command">
                <h2>Codex command draft</h2>
                <pre data-testid="codex-command-draft">{viewModel.codexCommandDraft}</pre>
              </article>
            </>
          ) : null}

          {mode === "held" ? (
            <article className="panel warning" data-testid="held-panel">
              <h2>Learning Log返却</h2>
              <dl>
                <div>
                  <dt>hold reason</dt>
                  <dd>{receipt.holdReason}</dd>
                </div>
                <div>
                  <dt>Learning Log返却</dt>
                  <dd>{receipt.learningLogReturn}</dd>
                </div>
              </dl>
            </article>
          ) : null}

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

          <article className="panel">
            <h2>verification commands</h2>
            <ul>
              {receipt.verificationCommands.map((command) => (
                <li key={command}>
                  <code>{command}</code>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h2>required evidence</h2>
            <ul>
              {receipt.requiredEvidence.map((evidence) => (
                <li key={evidence}>
                  <code>{evidence}</code>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel">
            <h2>AIDD-Spec接続</h2>
            <div className="spec-list">
              {receipt.aiddSpecConnections.map((connection) => (
                <span key={connection}>{connection}</span>
              ))}
            </div>
          </article>
        </section>
      ) : null}
    </main>
  );
}
