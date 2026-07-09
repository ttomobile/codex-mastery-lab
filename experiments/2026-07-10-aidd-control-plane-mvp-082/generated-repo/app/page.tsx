import {
  getSmokeRepairView,
  normalizeSmokeRepairState,
  promptContainsExecuteNowOnly,
  smokeRepairStates,
  type SmokeRepairView
} from "../src/domain/smoke-repair-planner";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = getSmokeRepairView(normalizeSmokeRepairState(params?.state));
  const promptIsScoped = promptContainsExecuteNowOnly(view);

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD Control Plane / MVP082</p>
          <h1>{view.title}</h1>
          <p className="lead">公開preview smokeで見つかったfailure / blockedを、次の1回で実行するRepair Actionへ変換します。execute_now、next_increment、learning_logを混ぜずに扱います。</p>
        </div>
        <aside className={`decision ${view.decisionTone}`} aria-label="修正判断">
          <span>修正判断</span>
          <strong>{view.decision}</strong>
        </aside>
      </header>

      <nav className="stateNav" aria-label="状態切り替え">
        {smokeRepairStates.map((state) => (
          <a key={state} className={view.state === state ? "active" : ""} href={`/?state=${state}`}>
            {state}
          </a>
        ))}
      </nav>

      <Panel title="Smoke Receipt Repair Summary">
        <p className="message">{view.message}</p>
        <div className="summaryGrid">
          <KeyValue label="state" value={view.state} />
          <KeyValue label="source receipt" value={view.sourceReceipt} />
          <KeyValue label="broken URL" value={view.finding.brokenUrl} />
          <KeyValue label="AIDD-Spec接続" value={view.aiddSpecConnection} />
        </div>
      </Panel>

      <Panel title="Review Finding Action">
        <div className="findingGrid">
          <FindingCard view={view} />
        </div>
      </Panel>

      <section className="grid two">
        <Panel title="execute_now action">
          <p>{view.executeNowAction}</p>
        </Panel>
        <Panel title="next_increment / learning_log 分離">
          <KeyValue label="next_increment" value={view.nextIncrement} />
          <KeyValue label="learning_log" value={view.learningLog} />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="AI Task Packet patch">
          <p>{view.aiTaskPacketPatch}</p>
        </Panel>
        <Panel title="Codex prompt patch">
          <p>{view.codexPromptPatch}</p>
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Verification commands">
          <List items={view.verificationCommands} emptyLabel="検証コマンド未設定" />
        </Panel>
        <Panel title="Required evidence / rollback">
          <List items={view.requiredEvidence} emptyLabel="必須証跡未設定" />
          <KeyValue label="rollback" value={view.rollbackCondition} />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Codex prompt preview">
          <div className={promptIsScoped ? "scope ok" : "scope block"}>{promptIsScoped ? "execute_nowのみ" : "execute_now以外のprompt混入"}</div>
          <pre>{view.codexPromptPreview}</pre>
        </Panel>
        <Panel title="Review Finding YAML">
          <pre>{view.reviewFindingYaml}</pre>
        </Panel>
      </section>

      {view.stopReasons.length > 0 && (
        <Panel title="公開前ブロック">
          <List items={view.stopReasons} emptyLabel="ブロック理由なし" />
        </Panel>
      )}
    </main>
  );
}

function FindingCard({ view }: { view: SmokeRepairView }) {
  return (
    <article className="finding">
      <h3>{view.finding.category}</h3>
      <KeyValue label="broken URL" value={view.finding.brokenUrl} />
      <KeyValue label="severity" value={view.finding.severity} />
      <KeyValue label="lane" value={view.finding.lane} />
      <KeyValue label="priority reason" value={view.finding.priorityReason} />
    </article>
  );
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
