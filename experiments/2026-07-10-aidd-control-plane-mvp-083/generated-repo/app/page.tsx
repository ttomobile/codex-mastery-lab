import {
  getSmokePriorityView,
  normalizeSmokePriorityState,
  promptContainsExecuteNowOnly,
  smokePriorityStates,
  type RepairCandidate
} from "../src/domain/smoke-priority-gate";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = getSmokePriorityView(normalizeSmokePriorityState(params?.state));
  const promptIsScoped = promptContainsExecuteNowOnly(view);

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD Control Plane / MVP083</p>
          <h1>{view.title}</h1>
          <p className="lead">複数のSmoke Repair候補を、今回実行する1件、次回送り、Learning Log戻しへ分けます。Codex prompt previewにはexecute_nowだけを入れます。</p>
        </div>
        <aside className={`decision ${view.decisionTone}`} aria-label="優先順位判断">
          <span>優先順位判断</span>
          <strong>{view.decision}</strong>
        </aside>
      </header>

      <nav className="stateNav" aria-label="状態切り替え">
        {smokePriorityStates.map((state) => (
          <a key={state} className={view.state === state ? "active" : ""} href={`/?state=${state}`}>
            {state}
          </a>
        ))}
      </nav>

      <Panel title="Smoke Repair Priority Gate Summary">
        <p className="message">{view.message}</p>
        <div className="summaryGrid">
          <KeyValue label="state" value={view.state} />
          <KeyValue label="selected candidate" value={view.selectedCandidate.id} />
          <KeyValue label="source receipt" value={view.selectedCandidate.sourceReceipt} />
          <KeyValue label="AIDD-Spec接続" value={view.aiddSpecConnection} />
        </div>
      </Panel>

      <Panel title="Repair Action候補一覧">
        <div className="findingGrid">
          {view.candidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)}
        </div>
      </Panel>

      <section className="grid two">
        <Panel title="execute_now">
          <p>{view.executeNow}</p>
        </Panel>
        <Panel title="defer_next_increment / return_to_learning_log 分離">
          <h3>defer_next_increment</h3>
          <List items={view.deferNextIncrement} emptyLabel="次回送りなし" />
          <h3>return_to_learning_log</h3>
          <List items={view.returnToLearningLog} emptyLabel="Learning Log戻しなし" />
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

      {view.conflictReasons.length > 0 && (
        <Panel title="優先順位衝突">
          <List items={view.conflictReasons} emptyLabel="衝突理由なし" />
        </Panel>
      )}

      {view.stopReasons.length > 0 && (
        <Panel title="公開前ブロック">
          <List items={view.stopReasons} emptyLabel="ブロック理由なし" />
        </Panel>
      )}
    </main>
  );
}

function CandidateCard({ candidate }: { candidate: RepairCandidate }) {
  return (
    <article className="finding">
      <h3>{candidate.title}</h3>
      <KeyValue label="candidate id" value={candidate.id} />
      <KeyValue label="source receipt" value={candidate.sourceReceipt} />
      <KeyValue label="severity" value={candidate.severity} />
      <KeyValue label="lane" value={candidate.lane} />
      <KeyValue label="priority score" value={String(candidate.priorityScore)} />
      <KeyValue label="effort" value={candidate.effort} />
      <KeyValue label="risk" value={candidate.risk} />
      <KeyValue label="priority reason" value={candidate.priorityReason} />
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
