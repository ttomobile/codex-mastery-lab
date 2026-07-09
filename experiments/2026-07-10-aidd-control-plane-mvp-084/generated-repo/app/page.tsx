import {
  getReceiptView,
  normalizeReceiptState,
  receiptStates,
  type BrowserCoverage,
  type FailureTransform,
  type HttpReceipt,
  type ScanItem
} from "../src/domain/public-preview-smoke-final-receipt";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = getReceiptView(normalizeReceiptState(params?.state));

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD Control Plane / MVP084</p>
          <h1>{view.title}</h1>
          <p className="lead">公開previewのHTML、記事内画像、terminal evidence画像をHTTP経路で確認し、最後の公開レシートとして束ねます。</p>
        </div>
        <aside className={`decision ${view.tone}`} aria-label="最終レシート判断">
          <span>最終レシート判断</span>
          <strong>{view.decision}</strong>
        </aside>
      </header>

      <nav className="stateNav" aria-label="状態切り替え">
        {receiptStates.map((state) => (
          <a key={state} className={view.state === state ? "active" : ""} href={`/?state=${state}`}>
            {state}
          </a>
        ))}
      </nav>

      <Panel title="Public Preview Smoke Final Receipt Summary">
        <p className="message">{view.message}</p>
        <div className="summaryGrid">
          <KeyValue label="state" value={view.state} />
          <KeyValue label="receipt id" value={`receipt-mvp084-${view.state}`} />
          <KeyValue label="source gate id" value="publication-qa-gate-mvp083" />
          <KeyValue label="article path" value="articles/2026-07-10-aidd-control-plane-mvp-084.md" />
          <KeyValue label="AIDD-Spec接続" value={view.aiddSpecConnection} />
        </div>
      </Panel>

      <Panel title="checked URLs / HTTP response">
        <div className="receiptGrid">
          {view.receipts.map((receipt) => <ReceiptCard key={receipt.label} receipt={receipt} />)}
        </div>
      </Panel>

      <section className="grid two">
        <Panel title="terminal evidence image response">
          <ReceiptCard receipt={view.terminalEvidenceImageResponse} compact />
        </Panel>
        <Panel title="Chromium / Firefox / WebKit coverage">
          <div className="browserList">{view.browserCoverage.map((item) => <BrowserRow key={item.browser} item={item} />)}</div>
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="console status">
          <ScanList items={view.consoleStatus} />
        </Panel>
        <Panel title="sanitization scan">
          <ScanList items={view.sanitizationScan} />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Verification commands">
          <List items={view.verificationCommands} emptyLabel="検証コマンド未設定" />
        </Panel>
        <Panel title="Required screenshots / rollback condition">
          <List items={view.requiredScreenshots} emptyLabel="必須スクリーンショット未設定" />
          <KeyValue label="rollback" value="HTTP receiptまたは証跡が欠けたら公開完了にせずReview Findingへ戻す" />
        </Panel>
      </section>

      {view.failureTransforms.length > 0 && (
        <Panel title="Review Finding YAML / Learning Log / AI Task Packet delta / Codex prompt delta">
          <div className="findingGrid">{view.failureTransforms.map((item) => <FailureCard key={item.source} item={item} />)}</div>
        </Panel>
      )}

      {view.blockedReasons.length > 0 && (
        <Panel title="公開前ブロック">
          <List items={view.blockedReasons} emptyLabel="ブロック理由なし" />
        </Panel>
      )}
    </main>
  );
}

function ReceiptCard({ receipt, compact = false }: { receipt: HttpReceipt; compact?: boolean }) {
  return (
    <article className={compact ? "receipt compact" : "receipt"}>
      <h3>{receipt.label}</h3>
      <KeyValue label="preview URL" value={receipt.url} />
      <KeyValue label="HTTP status" value={String(receipt.httpStatus)} />
      <KeyValue label="byte size" value={String(receipt.byteSize)} />
      <KeyValue label="content type" value={receipt.contentType} />
      <KeyValue label="latency ms" value={String(receipt.latencyMs)} />
      <KeyValue label="checked_at" value={receipt.checkedAt} />
    </article>
  );
}

function BrowserRow({ item }: { item: BrowserCoverage }) {
  return <div className={`browserRow ${item.status}`}><strong>{item.browser}</strong><span>{item.status}</span><p>{item.evidence}</p></div>;
}

function ScanList({ items }: { items: ScanItem[] }) {
  return <ul className="plainList">{items.map((item) => <li key={item.label}><strong>{item.label}</strong><span>{item.status}</span><p>{item.detail}</p></li>)}</ul>;
}

function FailureCard({ item }: { item: FailureTransform }) {
  return <article className="finding"><h3>{item.source}</h3><pre>{item.reviewFindingYaml}</pre><p>{item.learningLog}</p><p>{item.aiTaskPacketDelta}</p><p>{item.codexPromptDelta}</p></article>;
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
