"use client";

import { useMemo, useState } from "react";
import {
  createRunResultReviewInput,
  reviewFields,
  synthesizeRunResultReview,
  type EvidenceRepairDelta,
  type ReviewCase,
  type ReviewFinding,
  type RunResultReviewRecord
} from "../src/lib/run-result-review-synthesizer";

const caseLabels: Record<ReviewCase, string> = {
  empty: "empty",
  valid: "valid",
  failure: "failure",
  evidence_missing: "evidence_missing"
};

export default function Home() {
  const [caseName, setCaseName] = useState<ReviewCase>("empty");
  const input = useMemo(() => createRunResultReviewInput(caseName), [caseName]);
  const synthesized = useMemo(() => synthesizeRunResultReview(input), [input]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP058">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP058</p>
          <h1>Run Result Review Synthesizer</h1>
          <p className="lead">
            Codex Run Queueの実行結果を、Review Finding、AI Task Packet Delta、Codex Prompt Delta、Verification command、Learning Logへ合成します。
          </p>
        </div>
        <div className={`statusBadge ${synthesized.decision}`}>
          <span>判定</span>
          <strong>{synthesized.decision}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="ケース切替">
        {(["empty", "valid", "failure", "evidence_missing"] as ReviewCase[]).map((item) => (
          <button key={item} type="button" className={caseName === item ? "active" : ""} onClick={() => setCaseName(item)}>
            {caseLabels[item]}ケース
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Synthesizer</p>
            <h2>Run Result Review判定: {synthesized.decision}</h2>
          </div>
          {synthesized.decision === "empty" && (
            <div className="emptyBox" aria-label="empty summary">
              <h3>empty: source_run_idがありません</h3>
              <p>MVP057 Codex Run Queue Status Trackerから実行結果が届いていないため、Review Recordは生成しません。</p>
            </div>
          )}
          {synthesized.decision === "valid" && (
            <div className="readyBox" aria-label="valid summary">
              <h3>valid: Run Result Reviewを表示</h3>
              <p>成功結果をscore、証跡、3ブラウザ、doctor:aidd、rollback、privacy、delta、Learning Logへ合成済みです。</p>
            </div>
          )}
          {synthesized.decision === "failure" && (
            <div className="failureBox" aria-label="failure summary">
              <h3>failure: 標準Review Findingへ変換</h3>
              <p>command失敗、Firefox未実行、doctor:aidd失敗、危険command、rollback不足、未サニタイズ情報を修正対象にします。</p>
            </div>
          )}
          {synthesized.decision === "evidence_missing" && (
            <div className="brakeBox" aria-label="evidence missing summary">
              <h3>evidence_missing: 成功結果でも証跡不足</h3>
              <p>terminal evidence、empty-valid-failure screenshot、Playwright report、Review Record出力不足をEvidence Repair Delta / Learning Logへ戻します。</p>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Source</p><h2>Run Queueからの入力</h2></div>
          <dl className="compactList">
            <div><dt>source_run_id</dt><dd>{input.sourceRunId || "未受信"}</dd></div>
            <div><dt>outcome</dt><dd>{input.outcome}</dd></div>
            <div><dt>score</dt><dd>{input.score}</dd></div>
            <div><dt>browser_coverage</dt><dd>{input.browserCoverage.join(" / ") || "未確認"}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Required</p><h2>Review必須項目</h2></div>
          <ul className="checkList" aria-label="review fields">
            {reviewFields.map((field) => <li key={field} className={synthesized.review ? "ok" : "pending"}>{field}</li>)}
          </ul>
        </article>

        <FindingsPanel findings={synthesized.reviewFindings} />
        <RepairPanel deltas={synthesized.evidenceRepairDeltas} learningLog={input.learningLog} />

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Sanitize</p><h2>公開用コマンドプレビュー</h2></div>
          {synthesized.sanitizedPreview ? <pre>{synthesized.sanitizedPreview}</pre> : <p className="muted">プレビューはありません。</p>}
        </article>

        <ReviewPanel review={synthesized.review} />
      </section>
    </main>
  );
}

function FindingsPanel({ findings }: { findings: ReviewFinding[] }) {
  return (
    <article className="panel primary">
      <div className="panelHeader"><p className="eyebrow">Review Finding</p><h2>失敗から合成した標準Finding</h2></div>
      {findings.length === 0 ? (
        <p className="muted">Review Findingはありません。</p>
      ) : (
        <ul className="findingList" aria-label="review findings">
          {findings.map((finding) => (
            <li key={finding.category}>
              <h3>{finding.category}</h3>
              <dl className="compactList">
                <div><dt>category</dt><dd>{finding.category}</dd></div>
                <div><dt>finding</dt><dd>{finding.finding}</dd></div>
                <div><dt>severity</dt><dd>{finding.severity}</dd></div>
                <div><dt>observed_by</dt><dd>{finding.observed_by}</dd></div>
                <div><dt>ideal_state</dt><dd>{finding.ideal_state}</dd></div>
                <div><dt>fix_instruction</dt><dd>{finding.fix_instruction}</dd></div>
                <div><dt>needed_upstream_info</dt><dd>{finding.needed_upstream_info}</dd></div>
                <div><dt>standard_update</dt><dd>{finding.standard_update}</dd></div>
                <div><dt>codex_prompt_delta</dt><dd>{finding.codex_prompt_delta}</dd></div>
                <div><dt>verification</dt><dd>{finding.verification}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function RepairPanel({ deltas, learningLog }: { deltas: EvidenceRepairDelta[]; learningLog: string }) {
  return (
    <article className="panel primary" aria-label="evidence repair deltas">
      <div className="panelHeader"><p className="eyebrow">Evidence Repair Delta</p><h2>不足証跡の戻し先</h2></div>
      {deltas.length === 0 ? (
        <p className="muted">不足証跡はありません。</p>
      ) : (
        <>
          <ul className="checkList">
            {deltas.map((delta) => (
              <li key={delta.id} className="warn">
                <strong>{delta.missing}</strong>
                <span>{delta.fix_instruction}</span>
                <em>{delta.return_to}へ戻す</em>
              </li>
            ))}
          </ul>
          <p className="repairNote">Learning Log: {learningLog}</p>
        </>
      )}
    </article>
  );
}

function ReviewPanel({ review }: { review: RunResultReviewRecord | null }) {
  if (!review) {
    return (
      <article className="panel primary" aria-label="review empty">
        <div className="panelHeader"><p className="eyebrow">Review</p><h2>Run Result Review Record</h2></div>
        <p className="muted">validになるまでRun Result Review Recordは生成しません。</p>
      </article>
    );
  }

  return (
    <article className="panel primary" aria-label="run result review">
      <div className="panelHeader"><p className="eyebrow">Review</p><h2>Run Result Review Record</h2></div>
      <section className="proposalGrid">
        <LedgerText title="source_run_id" value={review.source_run_id} />
        <LedgerText title="outcome" value={review.outcome} />
        <LedgerText title="score" value={String(review.score)} />
        <LedgerText title="score_reason" value={review.score_reason} />
        <LedgerList title="terminal_evidence" items={review.terminal_evidence} />
        <LedgerList title="screenshot_evidence" items={review.screenshot_evidence} />
        <LedgerList title="browser_coverage" items={review.browser_coverage} />
        <LedgerText title="doctor_aidd" value={review.doctor_aidd} />
        <LedgerText title="rollback" value={review.rollback} />
        <LedgerText title="privacy_scan" value={review.privacy_scan} />
        <LedgerList title="review_findings" items={review.review_findings.map((item) => item.category)} />
        <LedgerList title="needed_upstream_info" items={review.needed_upstream_info} />
        <LedgerText title="standard_update" value={review.standard_update} />
        <LedgerText title="ai_task_packet_delta" value={review.ai_task_packet_delta} />
        <LedgerText title="codex_prompt_delta" value={review.codex_prompt_delta} />
        <LedgerText title="verification_command" value={review.verification_command} />
        <LedgerText title="learning_log" value={review.learning_log} />
        <div className="proposalItem">
          <h3>aidd_spec_connections</h3>
          <ul>{review.aidd_spec_connections.map((item) => <li key={item.id}>{item.label}: {item.status}</li>)}</ul>
        </div>
      </section>
    </article>
  );
}

function LedgerList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="proposalItem">
      <h3>{title}</h3>
      {items.length === 0 ? <p>なし</p> : <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>}
    </div>
  );
}

function LedgerText({ title, value }: { title: string; value: string }) {
  return (
    <div className="proposalItem">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
