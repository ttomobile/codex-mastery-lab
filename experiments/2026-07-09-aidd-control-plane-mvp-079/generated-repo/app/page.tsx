import {
  getQueuePlanner,
  normalizeQueueState,
  queuePayloadContainsExecuteNowOnly,
  type BrowserReceipt,
  type QueueAction,
  type QueuePlanner
} from "../src/domain/preview-smoke-receipt";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const planner = getQueuePlanner(normalizeQueueState(params?.state));
  const promptIsScoped = queuePayloadContainsExecuteNowOnly(planner.action);

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD Control Plane / MVP079</p>
          <h1>{planner.title}</h1>
          <p className="lead">
            Repair Actionを実Codex実行キューへ入れる前に、payload、検証、証跡、rollback、sanitizeを確認します。
          </p>
        </div>
        <DecisionBadge planner={planner} />
      </header>

      <nav className="stateNav" aria-label="状態切り替え">
        {(["empty", "ready", "failure", "blocked"] as const).map((state) => (
          <a key={state} className={planner.state === state ? "active" : ""} href={`/?state=${state}`}>
            {state}
          </a>
        ))}
      </nav>

      <Panel title="Run Queue Intake Summary">
        <p className="message">{planner.message}</p>
        <div className="summaryGrid">
          <KeyValue label="queue id" value={planner.queueId} />
          <KeyValue label="source repair action" value={planner.action.sourceRepairAction} />
          <KeyValue label="execute_now summary" value={planner.action.executeNowSummary} />
          <KeyValue label="destructive cleanup request" value={planner.action.queuePayload.destructiveCleanupRequest} />
        </div>
      </Panel>

      <section className="grid two">
        <Panel title="Queue Payload">
          <PromptPreview action={planner.action} promptIsScoped={promptIsScoped} />
          <KeyValue label="excluded next_increment" value={planner.action.excludedNextIncrement} />
          <KeyValue label="excluded learning_log" value={planner.action.excludedLearningLog} />
        </Panel>

        <Panel title="Intake Gates">
          <KeyValue label="verification gate" value={planner.action.verificationGate} />
          <KeyValue label="evidence gate" value={planner.action.evidenceGate} />
          <KeyValue label="rollback gate" value={planner.action.rollbackGate} />
          <KeyValue label="sanitize gate" value={planner.action.sanitizeGate} />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Verification Commands">
          <List items={planner.action.queuePayload.verificationCommands} emptyLabel="未入力" />
        </Panel>

        <Panel title="Required Evidence">
          <List items={planner.action.queuePayload.requiredEvidence} emptyLabel="未入力" />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Rollback Condition">
          <p>{planner.action.queuePayload.rollbackCondition}</p>
        </Panel>

        <Panel title="AIDD-Spec Connection">
          <KeyValue label="spec" value={planner.action.aiddSpecConnection.specVersion} />
          <KeyValue label="standard" value={planner.action.aiddSpecConnection.standardPath} />
          <KeyValue label="upstream gate" value={planner.action.aiddSpecConnection.upstreamGate} />
          <KeyValue label="feature" value={planner.action.aiddSpecConnection.featureName} />
          <p>{planner.action.aiddSpecConnection.summary}</p>
        </Panel>
      </section>

      <Panel title="3 Browser Playwright Evidence">
        <div className="browserList">
          {planner.browsers.map((browser) => (
            <BrowserRow key={browser.browser} browser={browser} />
          ))}
        </div>
      </Panel>

      {planner.reviewFindings.length > 0 && (
        <Panel title="Review Finding YAML">
          <div className="findingGrid">
            {planner.reviewFindings.map((finding) => (
              <article className={`finding ${finding.severity}`} key={finding.id}>
                <h3>{finding.category}</h3>
                <pre>{finding.yaml}</pre>
              </article>
            ))}
          </div>
        </Panel>
      )}

      {planner.stopReasons.length > 0 && (
        <Panel title="実行前停止">
          <div className="findingGrid">
            {planner.stopReasons.map((reason) => (
              <article className="finding blocker" key={reason.category}>
                <h3>{reason.category}</h3>
                <KeyValue label="severity" value={reason.severity} />
                <KeyValue label="reason" value={reason.reason} />
              </article>
            ))}
          </div>
        </Panel>
      )}
    </main>
  );
}

function DecisionBadge({ planner }: { planner: QueuePlanner }) {
  return (
    <aside className={`decision ${planner.decisionTone}`} aria-label="Queue判定">
      <span>Queue判定</span>
      <strong>{planner.decision}</strong>
    </aside>
  );
}

function PromptPreview({ action, promptIsScoped }: { action: QueueAction; promptIsScoped: boolean }) {
  return (
    <div className="promptBox" aria-label="Queue payload preview">
      <div className={promptIsScoped ? "scope ok" : "scope block"}>
        {promptIsScoped ? "execute_nowのみ" : "execute_now以外のpayload混入"}
      </div>
      <KeyValue label="Codex prompt preview" value={action.queuePayload.codexPromptPreview} />
    </div>
  );
}

function BrowserRow({ browser }: { browser: BrowserReceipt }) {
  const statusClass = browser.status === "確認済み" ? "ok" : browser.status === "失敗" ? "ng" : "block";
  return (
    <div className="browserRow">
      <strong>{browser.browser}</strong>
      <span className={statusClass}>{browser.status}</span>
      <code>{browser.evidencePath}</code>
    </div>
  );
}

function List({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) return <p>{emptyLabel}</p>;
  return (
    <ul className="plainList">
      {items.map((item) => (
        <li key={item}>
          <code>{item}</code>
        </li>
      ))}
    </ul>
  );
}

function Panel({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="kv">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
