import {
  getPublicationEvidenceQa,
  normalizeQaState,
  type EvidenceFile,
  type PublicationEvidenceQa
} from "../src/domain/publication-evidence-qa";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const qa = getPublicationEvidenceQa(normalizeQaState(params?.state));

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD Control Plane / MVP076</p>
          <h1>{qa.title}</h1>
          <p className="lead">
            Run Result Digest を note/preview 公開へ進める直前に、記事、画像、terminal evidence、3ブラウザ、console、サニタイズ、AIDD-Spec接続を確認します。
          </p>
        </div>
        <DecisionBadge qa={qa} />
      </header>

      <nav className="stateNav" aria-label="状態切り替え">
        {(["empty", "valid", "failure", "blocked"] as const).map((state) => (
          <a key={state} className={qa.state === state ? "active" : ""} href={`/?state=${state}`}>
            {state}
          </a>
        ))}
      </nav>

      <section className="grid two">
        <Panel title="Source Digest">
          <KeyValue label="source digest id" value={qa.sourceDigestId ?? "未選択"} />
          <KeyValue label="判定" value={qa.decision} />
          <KeyValue label="console status" value={qa.consoleStatus} />
          <KeyValue label="sanitization scan" value={qa.sanitizationScan.status} />
        </Panel>

        <Panel title="AIDD-Spec Connection">
          <KeyValue label="spec" value={qa.aiddSpecConnection.specVersion} />
          <KeyValue label="standard" value={qa.aiddSpecConnection.standardPath} />
          <KeyValue label="feature" value={qa.aiddSpecConnection.featureName} />
          <KeyValue label="target" value={qa.aiddSpecConnection.conformanceTarget} />
          <p>{qa.aiddSpecConnection.summary}</p>
        </Panel>
      </section>

      {qa.state === "empty" ? <RequiredInputs qa={qa} /> : <EvidenceOverview qa={qa} />}

      <section className="grid two">
        <Panel title="Chromium / Firefox / WebKit Coverage">
          <ul className="statusList">
            {qa.browserCoverage.map((item) => (
              <li key={item.browser}>
                <span>{item.browser}</span>
                <strong className={item.status === "確認済み" ? "ok" : "ng"}>{item.status}</strong>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Sanitization Scan">
          <p>
            local path / private host / private network URL 混入は blocked として公開前停止にします。
          </p>
          <div className="chips">
            {qa.sanitizationScan.checkedTerms.map((term) => (
              <span key={term}>{term}</span>
            ))}
          </div>
        </Panel>
      </section>

      {qa.sanitizationScan.findings.length > 0 && (
        <Panel title="ブロック理由">
          <div className="findingGrid">
            {qa.sanitizationScan.findings.map((finding) => (
              <article className="finding danger" key={`${finding.target}-${finding.detected}`}>
                <h3>{finding.target}</h3>
                <KeyValue label="detected" value={finding.detected} />
                <KeyValue label="reason" value={finding.reason} />
                <KeyValue label="fix_instruction" value={finding.fix_instruction} />
                <KeyValue label="verification command" value={finding.verification_command} />
              </article>
            ))}
          </div>
        </Panel>
      )}

      {qa.reviewFindings.length > 0 && (
        <Panel title="Review Finding">
          <div className="findingGrid">
            {qa.reviewFindings.map((finding) => (
              <article className={`finding ${finding.severity}`} key={finding.category}>
                <h3>{finding.category}</h3>
                <KeyValue label="severity" value={finding.severity} />
                <KeyValue label="ideal_state" value={finding.ideal_state} />
                <KeyValue label="fix_instruction" value={finding.fix_instruction} />
                <KeyValue label="verification command" value={finding.verification_command} />
                <KeyValue label="needed_upstream_info" value={finding.needed_upstream_info} />
              </article>
            ))}
          </div>
        </Panel>
      )}

      {qa.state !== "empty" && (
        <section className="grid two">
          <Panel title="Review Record excerpt">
            <p>{qa.reviewRecordExcerpt}</p>
          </Panel>
          <Panel title="Learning Log excerpt">
            <p>{qa.learningLogExcerpt}</p>
          </Panel>
          <Panel title="AI Task Packet delta">
            <p>{qa.aiTaskPacketDelta}</p>
          </Panel>
          <Panel title="Codex prompt delta">
            <p>{qa.codexPromptDelta}</p>
          </Panel>
        </section>
      )}

      <Panel title="Publish Checklist">
        <ul className="checklist">
          {qa.publishChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Panel>
    </main>
  );
}

function DecisionBadge({ qa }: { qa: PublicationEvidenceQa }) {
  return (
    <aside className={`decision ${qa.decisionTone}`} aria-label="公開判定">
      <span>公開判定</span>
      <strong>{qa.decision}</strong>
    </aside>
  );
}

function RequiredInputs({ qa }: { qa: PublicationEvidenceQa }) {
  return (
    <Panel title="公開前に必要な入力">
      <ul className="checklist">
        {qa.requiredInputs.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Panel>
  );
}

function EvidenceOverview({ qa }: { qa: PublicationEvidenceQa }) {
  return (
    <section className="grid two">
      <Panel title="Article / Preview / Evidence">
        <EvidenceRow file={qa.articlePath} />
        <EvidenceRow file={qa.previewPath} />
        <EvidenceRow file={qa.assetCopy} />
        <EvidenceRow file={qa.terminalEvidence} />
      </Panel>
      <Panel title="必須スクリーンショット">
        {qa.screenshots.map((file) => (
          <EvidenceRow file={file} key={file.label} />
        ))}
      </Panel>
    </section>
  );
}

function EvidenceRow({ file }: { file: EvidenceFile }) {
  return (
    <div className="evidenceRow">
      <span>{file.label}</span>
      <code>{file.path}</code>
      <strong className={file.status === "確認済み" ? "ok" : file.status === "ブロック" ? "block" : "ng"}>
        {file.status}
      </strong>
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
