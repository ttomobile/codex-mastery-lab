import {
  getDispatchReceipt,
  normalizeDispatchState,
  payloadContainsExecuteNowOnly,
  type BrowserReceipt,
  type DispatchAction,
  type DispatchReceipt
} from "../src/domain/preview-smoke-receipt";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const receipt = getDispatchReceipt(normalizeDispatchState(params?.state));
  const promptIsScoped = payloadContainsExecuteNowOnly(receipt.action);

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD Control Plane / MVP080</p>
          <h1>{receipt.title}</h1>
          <p className="lead">
            queue投入済みのexecute_now payloadを、実行コマンド、証跡、rollback、sanitize結果へ変換してReceipt化します。
          </p>
        </div>
        <DecisionBadge receipt={receipt} />
      </header>

      <nav className="stateNav" aria-label="状態切り替え">
        {(["empty", "ready", "running", "failure", "blocked"] as const).map((state) => (
          <a key={state} className={receipt.state === state ? "active" : ""} href={`/?state=${state}`}>
            {state}
          </a>
        ))}
      </nav>

      <Panel title="Dispatch Receipt Summary">
        <p className="message">{receipt.message}</p>
        <div className="summaryGrid">
          <KeyValue label="receipt id" value={receipt.receiptId} />
          <KeyValue label="queue item" value={receipt.action.queueItem} />
          <KeyValue label="execute_now summary" value={receipt.action.payload.executeNowSummary} />
          <KeyValue label="dispatch command" value={receipt.action.payload.dispatchCommand} />
          <KeyValue label="destructive cleanup request" value={receipt.action.payload.destructiveCleanupRequest} />
        </div>
      </Panel>

      <section className="grid two">
        <Panel title="Dispatch Payload">
          <PromptPreview action={receipt.action} promptIsScoped={promptIsScoped} />
          <KeyValue label="excluded next_increment" value={receipt.action.excludedNextIncrement} />
          <KeyValue label="excluded learning_log" value={receipt.action.excludedLearningLog} />
        </Panel>

        <Panel title="Dispatch Gates">
          <KeyValue label="verification gate" value={receipt.action.verificationGate} />
          <KeyValue label="evidence gate" value={receipt.action.evidenceGate} />
          <KeyValue label="rollback gate" value={receipt.action.rollbackGate} />
          <KeyValue label="sanitize gate" value={receipt.action.sanitizeGate} />
          <KeyValue label="timeout budget" value={receipt.action.payload.timeoutBudget} />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Verification Commands">
          <List items={receipt.action.payload.verificationCommands} emptyLabel="未入力" />
        </Panel>

        <Panel title="Required Evidence">
          <List items={receipt.action.payload.requiredEvidence} emptyLabel="未入力" />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Rollback Condition">
          <p>{receipt.action.payload.rollbackCondition}</p>
        </Panel>

        <Panel title="Running Progress / Pending Evidence">
          <KeyValue label="progress" value={receipt.action.progress} />
          <List items={receipt.action.pendingEvidence} emptyLabel="未入力" />
          <KeyValue label="next repair action" value={receipt.action.nextRepairAction} />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Sanitize Scan">
          <p>{receipt.action.sanitizeGate}</p>
        </Panel>

        <Panel title="AIDD-Spec Connection">
          <KeyValue label="spec" value={receipt.action.aiddSpecConnection.specVersion} />
          <KeyValue label="standard" value={receipt.action.aiddSpecConnection.standardPath} />
          <KeyValue label="upstream gate" value={receipt.action.aiddSpecConnection.upstreamGate} />
          <KeyValue label="feature" value={receipt.action.aiddSpecConnection.featureName} />
          <p>{receipt.action.aiddSpecConnection.summary}</p>
        </Panel>
      </section>

      <Panel title="3 Browser Playwright Evidence">
        <div className="browserList">
          {receipt.browsers.map((browser) => (
            <BrowserRow key={browser.browser} browser={browser} />
          ))}
        </div>
      </Panel>

      {receipt.reviewFindings.length > 0 && (
        <Panel title="Review Finding YAML">
          <div className="findingGrid">
            {receipt.reviewFindings.map((finding) => (
              <article className={`finding ${finding.severity}`} key={finding.id}>
                <h3>{finding.category}</h3>
                <pre>{finding.yaml}</pre>
              </article>
            ))}
          </div>
        </Panel>
      )}

      {receipt.stopReasons.length > 0 && (
        <Panel title="Dispatch停止">
          <div className="findingGrid">
            {receipt.stopReasons.map((reason) => (
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

function DecisionBadge({ receipt }: { receipt: DispatchReceipt }) {
  return (
    <aside className={`decision ${receipt.decisionTone}`} aria-label="Dispatch判定">
      <span>Dispatch判定</span>
      <strong>{receipt.decision}</strong>
    </aside>
  );
}

function PromptPreview({ action, promptIsScoped }: { action: DispatchAction; promptIsScoped: boolean }) {
  return (
    <div className="promptBox" aria-label="Dispatch payload preview">
      <div className={promptIsScoped ? "scope ok" : "scope block"}>
        {promptIsScoped ? "execute_nowのみ" : "execute_now以外のpayload混入"}
      </div>
      <KeyValue label="payload preview" value={action.payload.payloadPreview} />
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
