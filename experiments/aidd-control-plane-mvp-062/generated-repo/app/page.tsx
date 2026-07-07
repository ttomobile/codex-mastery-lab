"use client";

import { useMemo, useState } from "react";
import {
  createDecisionInput,
  evaluateDecisionWorkspace,
  type DecisionCase,
  type RepairDeltaDecisionRecord,
  type ReviewFinding
} from "../src/domain/verification-run-detail";

const caseLabels: Record<DecisionCase, string> = {
  empty: "未選択",
  valid: "採用判断済み",
  failure: "差し戻し",
  decision_needed: "判断待ち"
};

const decisionLabels = {
  empty: "修理deltaなし",
  ready: "採用済みだけ次へ進む",
  blocked: "差し戻し",
  decision_needed: "次の1回へ絞り込み"
};

export default function Home() {
  const [caseName, setCaseName] = useState<DecisionCase>("empty");
  const input = useMemo(() => createDecisionInput(caseName), [caseName]);
  const result = useMemo(() => evaluateDecisionWorkspace(input), [input]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AIDD Control Plane MVP062">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP062</p>
          <h1>Repair Delta Priority Decision Workspace</h1>
          <p className="lead">
            Evidence Repair Deltaを採用 / 保留 / 却下に分け、採用済みdeltaだけを次回AI Task PacketとCodex promptへ進めます。旅行の持ち物リストのように、今すぐ入れるもの、次回へ回すもの、メモへ戻すものを混ぜません。
          </p>
        </div>
        <div className={`statusBadge ${result.decision}`}>
          <span>判定</span>
          <strong>{decisionLabels[result.decision]}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="ケース切替">
        {(["empty", "valid", "failure", "decision_needed"] as DecisionCase[]).map((item) => (
          <button key={item} type="button" className={caseName === item ? "active" : ""} onClick={() => setCaseName(item)}>{caseLabels[item]}</button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader"><p className="eyebrow">判定結果</p><h2>検証判定: {decisionLabels[result.decision]}</h2></div>
          {result.decision === "empty" && <div className="emptyBox" aria-label="未選択の要約"><h3>判断する修理deltaを選んでください</h3><p>repair deltaがないため、次回packetへ進めません。</p></div>}
          {result.decision === "ready" && <div className="readyBox" aria-label="採用判断済みの要約"><h3>採用済みdeltaだけを次へ進めます</h3><p>保留 / 却下deltaはLearning Logへ戻し、Codex prompt previewには混ぜません。</p></div>}
          {result.decision === "blocked" && <div className="failureBox" aria-label="差し戻しの要約"><h3>標準Review Finding形式で差し戻し</h3><p>未判断、理由不足、証跡不足、rollback不足、Firefox除外、未採用delta混入、local path / host / private network URL混入を検出しました。</p></div>}
          {result.decision === "decision_needed" && <div className="brakeBox" aria-label="判断待ちの要約"><h3>次の1回へ入れるdeltaを最大1〜2件に絞ります</h3><p>adopt_now / hold_next_increment / reject_to_learning_logを分け、adopt_nowだけをpromptへ入れます。</p></div>}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">標準接続</p><h2>AIDD-Spec接続</h2></div>
          <ul className="checkList" aria-label="AIDD-Spec接続一覧">
            <li className="ok">AIDD-Spec v0.1</li>
            <li className="ok">AIDD Control Plane MVP v0.1</li>
            <li className="ok">Verification Evidence</li>
            <li className="ok">Review Record</li>
            <li className="ok">Learning Log</li>
            <li className="ok">AI Task Packet</li>
          </ul>
        </article>

        <DecisionPanel decisions={result.decisions} mode={caseName} />
        <PatchPanel title="次回AI Task Packet patch" body={result.adoptedPacketPatch} empty="採用済みdeltaがないためpatchは生成しません。" />
        <PatchPanel title="Codex prompt preview" body={result.codexPromptPreview} empty="adopt_nowだけを入れるため、まだpreviewはありません。" />
        <PatchPanel title="Learning Logへ戻すdelta" body={result.learningLogReturn.join("\n")} empty="Learning Logへ戻すdeltaはありません。" />
        <FindingsPanel findings={result.findings} />
        <article className="panel"><div className="panelHeader"><p className="eyebrow">公開前確認</p><h2>サニタイズ後プレビュー</h2></div>{result.sanitizedPreview ? <pre>{result.sanitizedPreview}</pre> : <p className="muted">公開用メモはありません。</p>}</article>
      </section>
    </main>
  );
}

function DecisionPanel({ decisions, mode }: { decisions: RepairDeltaDecisionRecord[]; mode: DecisionCase }) {
  const lanes = ["adopt_now", "hold_next_increment", "reject_to_learning_log"] as const;
  return (
    <article className="panel primary" aria-label="Repair Delta判断一覧">
      <div className="panelHeader"><p className="eyebrow">判断台帳</p><h2>Repair Delta Priority Decision</h2></div>
      {decisions.length === 0 ? <p className="muted">Repair Deltaはありません。</p> : mode === "decision_needed" ? (
        <section className="proposalGrid" aria-label="decision_neededのlane分類">
          {lanes.map((lane) => <div className="proposalItem" key={lane}><h3>{lane}</h3>{decisions.filter((d) => d.lane === lane).map((d) => <DecisionDetail key={d.source_repair_delta_id} decision={d} />)}{!decisions.some((d) => d.lane === lane) && <p className="muted">今回はなし</p>}</div>)}
        </section>
      ) : (
        <section className="proposalGrid">{decisions.map((decision) => <div className="proposalItem" key={decision.source_repair_delta_id}><DecisionDetail decision={decision} /></div>)}</section>
      )}
    </article>
  );
}

function DecisionDetail({ decision }: { decision: RepairDeltaDecisionRecord }) {
  return <dl className="compactList">
    <div><dt>source_repair_delta_id</dt><dd>{decision.source_repair_delta_id}</dd></div>
    <div><dt>decision</dt><dd>{decision.decision}</dd></div>
    <div><dt>lane</dt><dd>{decision.lane}</dd></div>
    <div><dt>priority_reason</dt><dd>{decision.priority_reason || "不足"}</dd></div>
    <div><dt>decision_owner</dt><dd>{decision.decision_owner || "不足"}</dd></div>
    <div><dt>review_evidence</dt><dd>{decision.review_evidence || "不足"}</dd></div>
    <div><dt>rollback_condition</dt><dd>{decision.rollback_condition || "不足"}</dd></div>
    <div><dt>next_packet_section</dt><dd>{decision.next_packet_section}</dd></div>
    <div><dt>Chromium / Firefox / WebKit</dt><dd>{decision.browser_projects.join(" / ")}</dd></div>
  </dl>;
}

function PatchPanel({ title, body, empty }: { title: string; body: string; empty: string }) {
  return <article className="panel"><div className="panelHeader"><p className="eyebrow">出力</p><h2>{title}</h2></div>{body ? <pre>{body}</pre> : <p className="muted">{empty}</p>}</article>;
}

function FindingsPanel({ findings }: { findings: ReviewFinding[] }) {
  return <article className="panel primary"><div className="panelHeader"><p className="eyebrow">差し戻し</p><h2>標準レビュー指摘形式</h2></div>{findings.length === 0 ? <p className="muted">Review Findingはありません。</p> : <ul className="findingList" aria-label="Review Finding一覧">{findings.map((finding) => <li key={finding.category}><h3>{finding.category}</h3><dl className="compactList"><div><dt>category</dt><dd>{finding.category}</dd></div><div><dt>finding</dt><dd>{finding.finding}</dd></div><div><dt>severity</dt><dd>{finding.severity}</dd></div><div><dt>observed_by</dt><dd>{finding.observed_by}</dd></div><div><dt>ideal_state</dt><dd>{finding.ideal_state}</dd></div><div><dt>fix_instruction</dt><dd>{finding.fix_instruction}</dd></div><div><dt>needed_upstream_info</dt><dd>{finding.needed_upstream_info.join(" / ")}</dd></div><div><dt>standard_update</dt><dd>{finding.standard_update}</dd></div><div><dt>ai_task_packet_delta</dt><dd>{finding.ai_task_packet_delta}</dd></div><div><dt>codex_prompt_delta</dt><dd>{finding.codex_prompt_delta}</dd></div><div><dt>verification_command</dt><dd>{finding.verification_command}</dd></div></dl></li>)}</ul>}</article>;
}
