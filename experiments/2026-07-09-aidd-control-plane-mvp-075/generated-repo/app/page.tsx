import Link from "next/link";
import { createDigest, parseDigestState, type DigestState, type ReviewFinding, type RunResultDigest } from "../src/domain/run-result-digest";

const stateLabels: Record<DigestState, string> = {
  empty: "未選択",
  valid: "共有可能",
  failure: "差し戻し",
  blocked: "公開停止"
};

type PageProps = {
  searchParams?: Promise<{ state?: string | string[] }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const state = parseDigestState(params?.state);
  const digest = createDigest(state);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP075">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP075</p>
          <h1>Run Result Digest Publisher</h1>
          <p className="lead">
            Codex Run Queue Status Trackerの実行結果を、Review Record、Learning Log、次回AI Task Packet、note記事化へ渡す短い共有ダイジェストに変換します。
          </p>
        </div>
        <div className={`statusBadge ${state}`}>
          <span>publish readiness</span>
          <strong>{digest.publishReadiness}</strong>
        </div>
      </section>

      <nav className="toolbar" aria-label="状態切替">
        {(["empty", "valid", "failure", "blocked"] as DigestState[]).map((item) => (
          <Link key={item} className={state === item ? "active" : ""} href={`/?state=${item}`}>{stateLabels[item]}</Link>
        ))}
      </nav>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader"><p className="eyebrow">digest</p><h2>{digest.title}: {stateLabels[state]}</h2></div>
          <StateSummary digest={digest} />
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">AIDD-Spec接続</p><h2>共有先</h2></div>
          <ul className="checkList" aria-label="AIDD-Spec接続一覧">
            <li className="ok">AIDD-Spec v0.1</li>
            <li className="ok">Verification Evidence</li>
            <li className="ok">Review Record</li>
            <li className="ok">Learning Log</li>
            <li className="ok">AI Task Packet</li>
            <li className="ok">Codex prompt delta</li>
          </ul>
        </article>

        <DigestFacts digest={digest} />
        <EvidencePanel digest={digest} />
        <TextPanel title="Review Record excerpt" body={digest.reviewRecordExcerpt} />
        <TextPanel title="Learning Log excerpt" body={digest.learningLogExcerpt} />
        <TextPanel title="AI Task Packet delta" body={digest.aiTaskPacketDelta} />
        <TextPanel title="Codex prompt delta" body={digest.codexPromptDelta} />
        <TextPanel title="note article angle" body={digest.noteArticleAngle} />
        <FindingsPanel findings={digest.findings} />
        <BlockedPanel digest={digest} />
      </section>
    </main>
  );
}

function StateSummary({ digest }: { digest: RunResultDigest }) {
  if (digest.state === "empty") {
    return <div className="emptyBox" aria-label="source run未選択"><h3>source runが未選択です</h3><p>次に必要な入力をそろえるまでダイジェストは生成しません。</p><ul>{digest.nextInputs.map((item) => <li key={item}>{item}</li>)}</ul></div>;
  }
  if (digest.state === "failure") {
    return <div className="failureBox" aria-label="レビュー差し戻し"><h3>Review Findingとして差し戻し</h3><p>score根拠不足、Firefox未実行、console warn、terminal evidence不足を修正してください。</p></div>;
  }
  if (digest.state === "blocked") {
    return <div className="failureBox" aria-label="公開停止"><h3>公開前に停止</h3><p>local path / private host / private network URL混入を検出しました。</p></div>;
  }
  return <div className="readyBox" aria-label="共有可能"><h3>共有ダイジェストとして採用可能</h3><p>{digest.summary}</p></div>;
}

function DigestFacts({ digest }: { digest: RunResultDigest }) {
  return (
    <article className="panel primary" aria-label="run digest facts">
      <div className="panelHeader"><p className="eyebrow">1画面サマリー</p><h2>run outcome / score / console / publish readiness</h2></div>
      <dl className="detailList">
        <div><dt>run outcome</dt><dd>{digest.runOutcome}</dd></div>
        <div><dt>score</dt><dd>{digest.score ?? "未採点"}</dd></div>
        <div><dt>console status</dt><dd>{digest.consoleStatus}</dd></div>
        <div><dt>publish readiness</dt><dd>{digest.publishReadiness}</dd></div>
      </dl>
      <h3>score根拠</h3>
      {digest.scoreBasis.length > 0 ? <ul className="checkList">{digest.scoreBasis.map((item) => <li key={item} className="ok">{item}</li>)}</ul> : <p className="muted">score根拠は未入力です。</p>}
    </article>
  );
}

function EvidencePanel({ digest }: { digest: RunResultDigest }) {
  return (
    <article className="panel primary" aria-label="evidence coverage">
      <div className="panelHeader"><p className="eyebrow">証跡</p><h2>terminal evidence / screenshot / 3ブラウザcoverage</h2></div>
      <h3>terminal evidence</h3>
      {digest.terminalEvidence.length > 0 ? <ul className="checkList">{digest.terminalEvidence.map((item) => <li key={item} className="ok">{item}</li>)}</ul> : <p className="muted">terminal evidenceは未入力です。</p>}
      <h3>initial / filled / failure / terminal screenshot</h3>
      <dl className="compactList">{digest.screenshots.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.status}: {item.path}</dd></div>)}</dl>
      <h3>Chromium / Firefox / WebKit coverage</h3>
      <dl className="compactList">{digest.browserCoverage.map((item) => <div key={item.name}><dt>{item.name}</dt><dd>{item.status}: {item.evidence}</dd></div>)}</dl>
    </article>
  );
}

function TextPanel({ title, body }: { title: string; body: string }) {
  return <article className="panel"><div className="panelHeader"><p className="eyebrow">出力</p><h2>{title}</h2></div><p>{body}</p></article>;
}

function FindingsPanel({ findings }: { findings: ReviewFinding[] }) {
  return (
    <article className="panel primary">
      <div className="panelHeader"><p className="eyebrow">Review Finding</p><h2>レビュー指摘</h2></div>
      {findings.length === 0 ? <p className="muted">Review Findingはありません。</p> : (
        <ul className="findingList" aria-label="Review Finding一覧">
          {findings.map((finding) => <li key={finding.category}><h3>{finding.category}</h3><dl className="compactList"><div><dt>severity</dt><dd>{finding.severity}</dd></div><div><dt>finding</dt><dd>{finding.finding}</dd></div><div><dt>evidence_gap</dt><dd>{finding.evidenceGap}</dd></div><div><dt>fix_instruction</dt><dd>{finding.fixInstruction}</dd></div></dl></li>)}
        </ul>
      )}
    </article>
  );
}

function BlockedPanel({ digest }: { digest: RunResultDigest }) {
  return (
    <article className="panel">
      <div className="panelHeader"><p className="eyebrow">公開前ブロック</p><h2>local path / private host / private network URL混入</h2></div>
      {digest.blockedTokens.length > 0 ? <p className="blockReason">検出件数: {digest.blockedTokens.length}</p> : <p className="muted">公開停止対象のlocal path / private host / private network URLはありません。</p>}
      {digest.sanitizedPreview ? <pre>{digest.sanitizedPreview}</pre> : <p className="muted">sanitize previewは未生成です。</p>}
    </article>
  );
}
