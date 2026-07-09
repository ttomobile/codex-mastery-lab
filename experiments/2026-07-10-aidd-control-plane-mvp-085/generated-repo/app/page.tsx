import {
  getHandoffView,
  handoffStates,
  normalizeHandoffState,
  type ActionItem,
  type BrowserCoverage,
  type StatusItem
} from "../src/domain/final-receipt-failure-handoff-queue";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = getHandoffView(normalizeHandoffState(params?.state));

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD Control Plane / MVP085</p>
          <h1>{view.title}</h1>
          <p className="lead">公開previewの最終レシートで見つかった失敗を、次の1回で実行するReview Finding actionへ変換します。</p>
        </div>
        <aside className={`decision ${view.tone}`} aria-label="handoff判断">
          <span>handoff判断</span>
          <strong>{view.decision}</strong>
        </aside>
      </header>

      <nav className="stateNav" aria-label="状態切り替え">
        {handoffStates.map((state) => (
          <a key={state} className={view.state === state ? "active" : ""} href={`/?state=${state}`}>
            {state}
          </a>
        ))}
      </nav>

      <Panel title="Final Receipt Failure Handoff Summary">
        <p className="message">{view.message}</p>
        <div className="summaryGrid">
          <KeyValue label="state" value={view.state} />
          <KeyValue label="source receipt id" value={view.sourceReceipt.sourceReceiptId} />
          <KeyValue label="broken URL" value={view.sourceReceipt.brokenUrl} />
          <KeyValue label="HTTP status" value={String(view.sourceReceipt.httpStatus)} />
          <KeyValue label="byte size" value={String(view.sourceReceipt.byteSize)} />
          <KeyValue label="content type" value={view.sourceReceipt.contentType} />
          <KeyValue label="latency ms" value={String(view.sourceReceipt.latencyMs)} />
          <KeyValue label="AIDD-Spec接続" value={view.aiddSpecConnection} />
        </div>
      </Panel>

      <section className="grid three">
        <ActionLane title="execute_now" items={view.executeNow} />
        <ActionLane title="next_increment" items={view.nextIncrement} />
        <ActionLane title="learning_log" items={view.learningLog} />
      </section>

      <section className="grid two">
        <Panel title="Codex prompt preview（execute_nowのみ）">
          <pre>{view.codexPromptPreview}</pre>
        </Panel>
        <Panel title="Chromium / Firefox / WebKit coverage">
          <div className="browserList">{view.browserCoverage.map((item) => <BrowserRow key={item.browser} item={item} />)}</div>
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="terminal evidence / failure screenshot">
          <StatusList items={[...view.terminalEvidenceStatus, ...view.failureScreenshotStatus]} />
        </Panel>
        <Panel title="console status / sanitization scan">
          <StatusList items={[...view.consoleStatus, ...view.sanitizationScan]} />
        </Panel>
      </section>

      <Panel title="Review Finding YAML / Learning Log / AI Task Packet patch">
        <div className="findingGrid">
          {[...view.executeNow, ...view.nextIncrement, ...view.learningLog].map((item) => <FindingCard key={item.id} item={item} />)}
        </div>
      </Panel>

      {view.blockedReasons.length > 0 && (
        <Panel title="公開前ブロック">
          <List items={view.blockedReasons} emptyLabel="ブロック理由なし" />
        </Panel>
      )}
    </main>
  );
}

function ActionLane({ title, items }: { title: string; items: ActionItem[] }) {
  return (
    <Panel title={title}>
      {items.length === 0 ? <p>このlaneのactionはまだありません。</p> : items.map((item) => <article className="action" key={item.id}>
        <h3>{item.id}</h3>
        <KeyValue label="finding category" value={item.findingCategory} />
        <KeyValue label="severity" value={item.severity} />
        <KeyValue label="lane" value={item.lane} />
        <p>{item.priorityReason}</p>
        <KeyValue label="rollback condition" value={item.rollbackCondition} />
      </article>)}
    </Panel>
  );
}

function BrowserRow({ item }: { item: BrowserCoverage }) {
  return <div className={`browserRow ${item.status}`}><strong>{item.browser}</strong><span>{item.status}</span><p>{item.evidence}</p></div>;
}

function StatusList({ items }: { items: StatusItem[] }) {
  return <ul className="plainList">{items.map((item) => <li key={item.label}><strong>{item.label}</strong><span>{item.status}</span><p>{item.detail}</p></li>)}</ul>;
}

function FindingCard({ item }: { item: ActionItem }) {
  return <article className="finding"><h3>{item.id}</h3><pre>{item.reviewFindingYaml}</pre><p>{item.learningLog}</p><p>{item.aiTaskPacketPatch}</p><p>{item.codexPromptPatch}</p><List items={item.verificationCommands} emptyLabel="検証コマンドなし" /><List items={item.requiredEvidence} emptyLabel="必須証跡なし" /></article>;
}

function Panel({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return <section className="panel"><h2>{title}</h2>{children}</section>;
}

function List({ items, emptyLabel }: { items: string[]; emptyLabel: string }) {
  if (items.length === 0) return <p>{emptyLabel}</p>;
  return <ul className="plainList">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return <div className="kv"><span>{label}</span><strong>{value}</strong></div>;
}
