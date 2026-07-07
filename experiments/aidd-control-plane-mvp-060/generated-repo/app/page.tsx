"use client";

import { useMemo, useState } from "react";
import {
  createVerificationRunInput,
  detailFields,
  evaluateVerificationRun,
  type RepairDelta,
  type ReviewFinding,
  type VerificationCase,
  type VerificationRunDetail
} from "../src/domain/verification-run-detail";

const caseLabels: Record<VerificationCase, string> = {
  empty: "キューなし",
  valid: "検証ready",
  failure: "差し戻し",
  repair_needed: "修復候補"
};

const decisionLabels = {
  empty: "キューなし",
  ready: "ready",
  blocked: "差し戻し",
  repair_needed: "修復候補あり"
};

export default function Home() {
  const [caseName, setCaseName] = useState<VerificationCase>("empty");
  const input = useMemo(() => createVerificationRunInput(caseName), [caseName]);
  const result = useMemo(() => evaluateVerificationRun(input), [input]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP060">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP060</p>
          <h1>検証実行詳細</h1>
          <p className="lead">
            source queue itemから検証runのcommit、コマンド別detail、3ブラウザ、証跡、Review Finding draft、AIDD-Spec接続を確認し、差し戻しや次回修復deltaへ戻します。
          </p>
        </div>
        <div className={`statusBadge ${result.decision}`}>
          <span>判定</span>
          <strong>{decisionLabels[result.decision]}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="ケース切替">
        {(["empty", "valid", "failure", "repair_needed"] as VerificationCase[]).map((item) => (
          <button key={item} type="button" className={caseName === item ? "active" : ""} onClick={() => setCaseName(item)}>
            {caseLabels[item]}
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">判定結果</p>
            <h2>検証判定: {decisionLabels[result.decision]}</h2>
          </div>
          {result.decision === "empty" && (
            <div className="emptyBox" aria-label="キューなしの要約">
              <h3>source queue itemがありません</h3>
              <p>検証run detailを作る入力がないため、ready判定も差し戻しも行いません。</p>
            </div>
          )}
          {result.decision === "ready" && (
            <div className="readyBox" aria-label="readyの要約">
              <h3>Verification Run Detailがready</h3>
              <p>commit SHA、command別detail、3ブラウザ、terminal evidence、screenshot evidence、AIDD-Spec接続を確認済みです。</p>
            </div>
          )}
          {result.decision === "blocked" && (
            <div className="failureBox" aria-label="差し戻しの要約">
              <h3>標準Review Finding形式で差し戻し</h3>
              <p>不足項目をAI Task Packet delta、Codex prompt delta、verification commandへ戻します。</p>
            </div>
          )}
          {result.decision === "repair_needed" && (
            <div className="brakeBox" aria-label="修復候補の要約">
              <h3>次回修復delta候補へ変換</h3>
              <p>failed / timeout / evidence_missingのコマンドを次回の修復入力へ戻します。</p>
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">入力</p><h2>source queue item</h2></div>
          <dl className="compactList">
            <div><dt>source_queue_item_id</dt><dd>{input.sourceQueueItem?.source_queue_item_id || "なし"}</dd></div>
            <div><dt>source_run_status</dt><dd>{input.sourceQueueItem?.source_run_status || "なし"}</dd></div>
            <div><dt>commit_sha</dt><dd>{input.sourceQueueItem?.commit_sha || "不足"}</dd></div>
            <div><dt>3ブラウザ</dt><dd>{input.sourceQueueItem ? formatBrowsers(input.sourceQueueItem) : "未確認"}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">必須項目</p><h2>ready表示項目</h2></div>
          <ul className="checkList" aria-label="検証実行詳細の必須項目">
            {detailFields.map((field) => <li key={field} className={result.detail ? "ok" : "pending"}>{field}</li>)}
          </ul>
        </article>

        <FindingsPanel findings={result.findings} />
        <RepairPanel deltas={result.repairDeltas} />

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">公開前確認</p><h2>サニタイズ後プレビュー</h2></div>
          {result.sanitizedPreview ? <pre>{result.sanitizedPreview}</pre> : <p className="muted">表示する公開用メモはありません。</p>}
        </article>

        <DetailPanel detail={result.detail} />
      </section>
    </main>
  );
}

function FindingsPanel({ findings }: { findings: ReviewFinding[] }) {
  return (
    <article className="panel primary">
      <div className="panelHeader"><p className="eyebrow">差し戻し</p><h2>標準レビュー指摘形式</h2></div>
      {findings.length === 0 ? (
        <p className="muted">Review Findingはありません。</p>
      ) : (
        <ul className="findingList" aria-label="Review Finding一覧">
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
                <div><dt>ai_task_packet_delta</dt><dd>{finding.ai_task_packet_delta}</dd></div>
                <div><dt>codex_prompt_delta</dt><dd>{finding.codex_prompt_delta}</dd></div>
                <div><dt>verification_command</dt><dd>{finding.verification_command}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function RepairPanel({ deltas }: { deltas: RepairDelta[] }) {
  return (
    <article className="panel primary" aria-label="次回修復delta候補">
      <div className="panelHeader"><p className="eyebrow">修復delta</p><h2>次回修復候補</h2></div>
      {deltas.length === 0 ? (
        <p className="muted">次回修復delta候補はありません。</p>
      ) : (
        <section className="proposalGrid">
          {deltas.map((delta) => (
            <div className="proposalItem" key={`${delta.source_command}-${delta.source_status}`}>
              <h3>{delta.source_command}</h3>
              <dl className="compactList">
                <div><dt>source_status</dt><dd>{delta.source_status}</dd></div>
                <div><dt>ai_task_packet_delta</dt><dd>{delta.ai_task_packet_delta}</dd></div>
                <div><dt>codex_prompt_delta</dt><dd>{delta.codex_prompt_delta}</dd></div>
                <div><dt>verification_command</dt><dd>{delta.verification_command}</dd></div>
              </dl>
            </div>
          ))}
        </section>
      )}
    </article>
  );
}

function DetailPanel({ detail }: { detail: VerificationRunDetail | null }) {
  if (!detail) {
    return (
      <article className="panel primary" aria-label="検証実行詳細なし">
        <div className="panelHeader"><p className="eyebrow">詳細</p><h2>検証実行詳細</h2></div>
        <p className="muted">readyになるまでVerification Run Detailは表示しません。</p>
      </article>
    );
  }

  return (
    <article className="panel primary" aria-label="検証実行詳細">
      <div className="panelHeader"><p className="eyebrow">詳細</p><h2>検証実行詳細</h2></div>
      <section className="proposalGrid">
        <LedgerText title="source_queue_item_id" value={detail.source_queue_item_id} />
        <LedgerText title="source_run_status" value={detail.source_run_status} />
        <LedgerText title="commit_sha" value={detail.commit_sha} />
        <div className="proposalItem">
          <h3>browser_coverage</h3>
          <ul>{Object.entries(detail.browser_coverage).map(([browser, covered]) => <li key={browser}>{browser}: {covered ? "対象" : "除外"}</li>)}</ul>
        </div>
        <CommandTable commands={detail.command_details} />
        <LedgerList title="terminal_evidence" items={detail.terminal_evidence} />
        <LedgerList title="screenshot_evidence" items={detail.screenshot_evidence} />
        <LedgerText title="playwright_report" value={detail.playwright_report} />
        <div className="proposalItem">
          <h3>review_finding_draft</h3>
          <ul>{detail.review_finding_draft.map((draft) => <li key={draft.title}>{draft.title}: {draft.body}</li>)}</ul>
        </div>
        <div className="proposalItem">
          <h3>aidd_spec_connections</h3>
          <ul>{detail.aidd_spec_connections.map((item) => <li key={item.id}>{item.label}: {item.status}</li>)}</ul>
        </div>
      </section>
    </article>
  );
}

function CommandTable({ commands }: { commands: VerificationRunDetail["command_details"] }) {
  return (
    <div className="proposalItem wideItem">
      <h3>command_details</h3>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>command</th>
              <th>exit_code</th>
              <th>duration</th>
              <th>status</th>
              <th>artifact_path</th>
              <th>failure_category</th>
              <th>repair_instruction</th>
            </tr>
          </thead>
          <tbody>
            {commands.map((command) => (
              <tr key={command.command}>
                <td>{command.command}</td>
                <td>{command.exit_code ?? "なし"}</td>
                <td>{command.duration}</td>
                <td>{command.status}</td>
                <td>{command.artifact_path}</td>
                <td>{command.failure_category}</td>
                <td>{command.repair_instruction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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

function formatBrowsers(detail: VerificationRunDetail): string {
  return Object.entries(detail.browser_coverage).map(([browser, covered]) => `${browser}:${covered ? "対象" : "除外"}`).join(" / ");
}
