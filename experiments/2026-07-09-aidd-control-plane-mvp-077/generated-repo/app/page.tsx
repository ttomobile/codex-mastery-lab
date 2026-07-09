import {
  getReceiptBinder,
  normalizeReceiptState,
  type BrowserReceipt,
  type CheckedUrl,
  type ReceiptBinder
} from "../src/domain/preview-smoke-receipt";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const binder = getReceiptBinder(normalizeReceiptState(params?.state));

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD Control Plane / MVP077</p>
          <h1>{binder.title}</h1>
          <p className="lead">
            MVP076 Publication Evidence QA Gate の後段として、公開preview HTML / asset / terminal evidence image がHTTP経路で読めた事実をReceiptとして束ねます。
          </p>
        </div>
        <DecisionBadge binder={binder} />
      </header>

      <nav className="stateNav" aria-label="状態切り替え">
        {(["empty", "valid", "failure", "blocked"] as const).map((state) => (
          <a key={state} className={binder.state === state ? "active" : ""} href={`/?state=${state}`}>
            {state}
          </a>
        ))}
      </nav>

      <Panel title="Receipt Summary">
        <p className="message">{binder.message}</p>
        <div className="summaryGrid">
          <KeyValue label="receipt id" value={binder.receiptId} />
          <KeyValue label="source QA gate id" value={binder.sourceQaGateId} />
          <KeyValue label="console status" value={binder.consoleStatus} />
          <KeyValue label="sanitization scan" value={binder.sanitizationScan.status} />
        </div>
      </Panel>

      <Panel title="Checked URLs">
        <div className="urlGrid">
          {binder.checkedUrls.map((url) => (
            <UrlCard key={`${url.label}-${url.url}`} url={url} />
          ))}
        </div>
      </Panel>

      <section className="grid two">
        <Panel title="Chromium / Firefox / WebKit">
          <div className="browserList">
            {binder.browsers.map((browser) => (
              <BrowserRow key={browser.browser} browser={browser} />
            ))}
          </div>
        </Panel>

        <Panel title="AIDD-Spec接続">
          <KeyValue label="spec" value={binder.aiddSpecConnection.specVersion} />
          <KeyValue label="standard" value={binder.aiddSpecConnection.standardPath} />
          <KeyValue label="upstream gate" value={binder.aiddSpecConnection.upstreamGate} />
          <KeyValue label="feature" value={binder.aiddSpecConnection.featureName} />
          <p>{binder.aiddSpecConnection.summary}</p>
        </Panel>
      </section>

      <Panel title="Sanitization Scan">
        <p>{binder.sanitizationScan.summary}</p>
        <div className="chips">
          <span>private URL</span>
          <span>local path</span>
          <span>localhost</span>
          <span>内部IP</span>
          <span>AIDD-Spec接続</span>
        </div>
      </Panel>

      {binder.reviewFindings.length > 0 && (
        <Panel title="Review Finding">
          <div className="findingGrid">
            {binder.reviewFindings.map((finding) => (
              <article className={`finding ${finding.severity}`} key={finding.category}>
                <h3>{finding.category}</h3>
                <KeyValue label="severity" value={finding.severity} />
                <KeyValue label="observed" value={finding.observed} />
                <KeyValue label="expected" value={finding.expected} />
                <KeyValue label="fix instruction" value={finding.fixInstruction} />
              </article>
            ))}
          </div>
        </Panel>
      )}

      {binder.stopReasons.length > 0 && (
        <Panel title="公開前停止">
          <div className="findingGrid">
            {binder.stopReasons.map((reason) => (
              <article className="finding blocker" key={reason.category}>
                <h3>{reason.category}</h3>
                <KeyValue label="severity" value={reason.severity} />
                <KeyValue label="reason" value={reason.reason} />
                <KeyValue label="publish impact" value={reason.publishImpact} />
              </article>
            ))}
          </div>
        </Panel>
      )}
    </main>
  );
}

function DecisionBadge({ binder }: { binder: ReceiptBinder }) {
  return (
    <aside className={`decision ${binder.decisionTone}`} aria-label="Receipt判定">
      <span>Receipt判定</span>
      <strong>{binder.decision}</strong>
    </aside>
  );
}

function UrlCard({ url }: { url: CheckedUrl }) {
  return (
    <article className="urlCard">
      <h3>{url.label}</h3>
      <code>{url.url}</code>
      <KeyValue label="HTTP status" value={String(url.httpStatus)} />
      <KeyValue label="byte size" value={String(url.byteSize)} />
      <KeyValue label="content type" value={url.contentType} />
      <KeyValue label="latency ms" value={String(url.latencyMs)} />
      <KeyValue label="checked_at" value={url.checkedAt} />
      <KeyValue label="evidence path" value={url.evidencePath} />
    </article>
  );
}

function BrowserRow({ browser }: { browser: BrowserReceipt }) {
  const statusClass = browser.status === "確認済み" ? "ok" : browser.status === "失敗" ? "ng" : "block";
  return (
    <div className="browserRow">
      <strong>{browser.browser}</strong>
      <span className={statusClass}>{browser.status}</span>
      <span>{browser.consoleStatus}</span>
      <code>{browser.evidencePath}</code>
    </div>
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
