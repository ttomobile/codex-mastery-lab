import {
  codexPromptContainsExecuteNowOnly,
  getRepairPlanner,
  normalizeReceiptState,
  type BrowserReceipt,
  type RepairAction,
  type RepairPlanner
} from "../src/domain/preview-smoke-receipt";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const planner = getRepairPlanner(normalizeReceiptState(params?.state));
  const promptIsScoped = codexPromptContainsExecuteNowOnly(planner.action);

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD Control Plane / MVP078</p>
          <h1>{planner.title}</h1>
          <p className="lead">
            Preview Smoke Receiptの失敗を、次の1回で実行する修正Action、検証コマンド、証跡、rollback条件へ畳み込みます。
          </p>
        </div>
        <DecisionBadge planner={planner} />
      </header>

      <nav className="stateNav" aria-label="状態切り替え">
        {(["empty", "planned", "failure", "blocked"] as const).map((state) => (
          <a key={state} className={planner.state === state ? "active" : ""} href={`/?state=${state}`}>
            {state}
          </a>
        ))}
      </nav>

      <Panel title="Repair Action Summary">
        <p className="message">{planner.message}</p>
        <div className="summaryGrid">
          <KeyValue label="receipt id" value={planner.receiptId} />
          <KeyValue label="source receipt" value={planner.action.sourceReceipt} />
          <KeyValue label="broken URL" value={planner.action.brokenUrl} />
          <KeyValue label="finding category" value={planner.action.findingCategory} />
          <KeyValue label="severity" value={planner.action.severity} />
          <KeyValue label="lane" value={planner.action.lane} />
        </div>
      </Panel>

      <section className="grid two">
        <Panel title="Priority And Execute Now">
          <KeyValue label="priority reason" value={planner.action.priorityReason} />
          <KeyValue label="execute_now action" value={planner.action.executeNowAction} />
          <KeyValue label="next_increment" value={planner.action.nextIncrement} />
          <KeyValue label="learning_log" value={planner.action.learningLog} />
        </Panel>

        <Panel title="Patch Preview">
          <KeyValue label="AI Task Packet patch" value={planner.action.aiTaskPacketPatch} />
          <PromptPreview action={planner.action} promptIsScoped={promptIsScoped} />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Verification Commands">
          <List items={planner.action.verificationCommands} emptyLabel="未入力" />
        </Panel>

        <Panel title="Required Evidence">
          <List items={planner.action.requiredEvidence} emptyLabel="未入力" />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Rollback Condition">
          <p>{planner.action.rollbackCondition}</p>
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

function DecisionBadge({ planner }: { planner: RepairPlanner }) {
  return (
    <aside className={`decision ${planner.decisionTone}`} aria-label="Action判定">
      <span>Action判定</span>
      <strong>{planner.decision}</strong>
    </aside>
  );
}

function PromptPreview({ action, promptIsScoped }: { action: RepairAction; promptIsScoped: boolean }) {
  return (
    <div className="promptBox" aria-label="Codex prompt preview">
      <div className={promptIsScoped ? "scope ok" : "scope block"}>
        {promptIsScoped ? "execute_nowのみ" : "execute_now以外のprompt混入"}
      </div>
      <KeyValue label="Codex prompt patch" value={action.codexPromptPatch} />
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
