import Link from "next/link";
import { getQueueViewModel, normalizeState, states } from "../src/ledger";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const params = await searchParams;
  const state = normalizeState(params.state);
  const viewModel = getQueueViewModel(state);
  const item = viewModel.item;

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP074</p>
          <h1>Codex Run Queue Status Tracker</h1>
        </div>
        <div className={`status-pill status-${state}`} data-testid="queue-status">
          {state}
        </div>
      </header>

      <nav className="mode-tabs" aria-label="run queue state">
        {states.map((nextState) => (
          <Link key={nextState} className={state === nextState ? "active" : ""} href={`/?state=${nextState}`}>
            {nextState}
          </Link>
        ))}
      </nav>

      {state === "empty" ? (
        <section className="empty-panel" data-testid="empty-panel">
          <h2>追跡中のCodex実行はありません</h2>
          <p>
            Run Queueに実行予定itemが入ると、実行待ち、実行中、成功、失敗、証跡不足をquery paramで切り替えて確認できます。
          </p>
        </section>
      ) : null}

      {item ? (
        <section className="queue-grid">
          {state === "waiting" ? (
            <>
              <article className="panel primary" data-testid="waiting-summary">
                <h2>実行待ち</h2>
                <dl>
                  <div>
                    <dt>source intake id</dt>
                    <dd>{item.sourceIntakeId}</dd>
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
                    <dt>sandbox</dt>
                    <dd>{item.sandbox}</dd>
                  </div>
                  <div>
                    <dt>rollback plan</dt>
                    <dd>{item.rollbackPlan}</dd>
                  </div>
                </dl>
              </article>

              <ListPanel title="required verification commands" values={item.requiredVerificationCommands} code />
              <PillPanel title="Chromium / Firefox / WebKit" values={item.requiredBrowsers} testId="browser-list" />
              <PillPanel title="AIDD-Spec接続" values={item.aiddSpecConnections} />
            </>
          ) : null}

          {state === "running" ? (
            <article className="panel primary" data-testid="running-summary">
              <h2>実行中</h2>
              <dl>
                <div>
                  <dt>started at</dt>
                  <dd>{item.startedAt}</dd>
                </div>
                <div>
                  <dt>operator</dt>
                  <dd>{item.operator}</dd>
                </div>
                <div>
                  <dt>current step</dt>
                  <dd>{item.currentStep}</dd>
                </div>
                <div>
                  <dt>duration</dt>
                  <dd>{item.duration}</dd>
                </div>
                <div>
                  <dt>evidence root</dt>
                  <dd>
                    <code>{item.evidenceRoot}</code>
                  </dd>
                </div>
                <div>
                  <dt>browser console collection status</dt>
                  <dd>{item.browserConsoleCollectionStatus}</dd>
                </div>
              </dl>
            </article>
          ) : null}

          {state === "succeeded" ? (
            <>
              <ListPanel title="actual results" values={item.actualResults} testId="actual-results" />
              <article className="panel" data-testid="command-results">
                <h2>command別exit code</h2>
                <ul>
                  {item.commandResults.map((result) => (
                    <li key={result.command}>
                      <code>{result.command}</code> exit {result.exitCode}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="panel" data-testid="browser-coverage">
                <h2>3ブラウザcoverage</h2>
                <ul>
                  {Object.entries(item.browserCoverage).map(([browser, result]) => (
                    <li key={browser}>
                      <strong>{browser}</strong>: {result}
                    </li>
                  ))}
                </ul>
              </article>
              <ListPanel title="terminal evidence" values={item.terminalEvidence} code />
              <ListPanel title="screenshot evidence" values={item.screenshotEvidence} code />
              <article className="panel" data-testid="playwright-report">
                <h2>Playwright report</h2>
                <code>{item.playwrightReport}</code>
              </article>
              <ListPanel title="Review Record output" values={item.reviewRecordOutput} />
              <ListPanel title="Learning Log output" values={item.learningLogOutput} />
            </>
          ) : null}

          {state === "failed" ? (
            <article className="panel danger primary" data-testid="failed-findings">
              <h2>Review Finding</h2>
              <ul>
                {viewModel.failedFindings.map((finding) => (
                  <li key={finding.key}>
                    <strong>{finding.label}</strong>
                    <span>{finding.detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {state === "evidence_missing" ? (
            <article className="panel danger primary" data-testid="evidence-missing-findings">
              <h2>証跡不足</h2>
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

function ListPanel({
  title,
  values,
  code = false,
  testId
}: {
  title: string;
  values: string[];
  code?: boolean;
  testId?: string;
}) {
  return (
    <article className="panel" data-testid={testId}>
      <h2>{title}</h2>
      <ul>
        {values.map((value) => (
          <li key={value}>{code ? <code>{value}</code> : value}</li>
        ))}
      </ul>
    </article>
  );
}

function PillPanel({ title, values, testId }: { title: string; values: string[]; testId?: string }) {
  return (
    <article className="panel">
      <h2>{title}</h2>
      <div className="spec-list" data-testid={testId}>
        {values.map((value) => (
          <span key={value}>{value}</span>
        ))}
      </div>
    </article>
  );
}
