import {
  getHistoryView,
  historyStates,
  normalizeHistoryState,
  promptContainsExecuteNowOnly,
  type ReceiptRun
} from "../src/domain/receipt-history";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const view = getHistoryView(normalizeHistoryState(params?.state));
  const promptIsScoped = promptContainsExecuteNowOnly(view);

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD Control Plane / MVP081</p>
          <h1>{view.title}</h1>
          <p className="lead">複数のDispatch Receiptを比較し、同じ失敗が減ったか、どのRepair Actionが効いたかを次回AI Task Packetへ戻します。</p>
        </div>
        <aside className={`decision ${view.state}`} aria-label="比較判定">
          <span>比較判定</span>
          <strong>{view.decision}</strong>
        </aside>
      </header>

      <nav className="stateNav" aria-label="状態切り替え">
        {historyStates.map((state) => (
          <a key={state} className={view.state === state ? "active" : ""} href={`/?state=${state}`}>
            {state}
          </a>
        ))}
      </nav>

      <Panel title="History Comparator Summary">
        <p className="message">{view.message}</p>
        <div className="summaryGrid">
          <KeyValue label="state" value={view.state} />
          <KeyValue label="score delta" value={view.scoreDelta} />
          <KeyValue label="AIDD-Spec接続" value={view.aiddSpecConnection} />
        </div>
      </Panel>

      <Panel title="Dispatch Receipt History">
        {view.receipts.length === 0 ? <p>比較対象Receiptはまだ選択されていません。3件以上のReceiptを選択してください。</p> : <ReceiptTable receipts={view.receipts} />}
      </Panel>

      <section className="grid two">
        <Panel title="減ったfinding">
          <List items={view.reducedFindings} emptyLabel="まだ改善findingはありません" />
        </Panel>
        <Panel title="再発finding">
          <List items={view.recurringFindings} emptyLabel="再発findingはありません" />
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="効いたRepair Action">
          <List items={view.effectiveRepairActions} emptyLabel="効果判定待ち" />
        </Panel>
        <Panel title="次回AI Task Packet delta">
          <p>{view.nextPacketDelta}</p>
        </Panel>
      </section>

      <section className="grid two">
        <Panel title="Codex prompt preview">
          <div className={promptIsScoped ? "scope ok" : "scope block"}>{promptIsScoped ? "execute_nowのみ" : "execute_now以外のprompt混入"}</div>
          <pre>{view.executeNowPrompt}</pre>
        </Panel>
        <Panel title="next_increment / learning_log 分離">
          <KeyValue label="next_increment" value={view.nextIncrement} />
          <KeyValue label="learning_log" value={view.learningLog} />
        </Panel>
      </section>

      <Panel title="Review Finding YAML">
        <pre>{view.reviewFindingYaml}</pre>
      </Panel>

      {view.stopReasons.length > 0 && (
        <Panel title="公開前ブロック">
          <List items={view.stopReasons} emptyLabel="ブロック理由なし" />
        </Panel>
      )}
    </main>
  );
}

function ReceiptTable({ receipts }: { receipts: ReceiptRun[] }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Receipt</th>
            <th>結果</th>
            <th>Score</th>
            <th>Finding</th>
            <th>証跡</th>
            <th>3ブラウザ</th>
            <th>Repair Action</th>
          </tr>
        </thead>
        <tbody>
          {receipts.map((receipt) => (
            <tr key={receipt.id}>
              <td><strong>{receipt.id}</strong><br />{receipt.title}</td>
              <td>{receipt.outcome}</td>
              <td>{receipt.score}</td>
              <td>{receipt.findingCount}</td>
              <td><code>{receipt.terminalEvidence}</code><br /><code>{receipt.screenshotEvidence}</code></td>
              <td>{receipt.browserCoverage.join(" / ")}<br />{receipt.consoleStatus}</td>
              <td>{receipt.repairAction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
