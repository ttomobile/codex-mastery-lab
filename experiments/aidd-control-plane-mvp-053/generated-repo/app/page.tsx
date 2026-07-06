"use client";

import { useMemo, useState } from "react";
import {
  createTaskPacket,
  requiredProposalFields,
  reviewTaskPacket,
  type GateCase,
  type ReducedTaskPacketProposal
} from "../src/lib/packet-reduction";

const caseLabels: Record<GateCase, string> = {
  ready: "ready",
  brake: "brake",
  stop: "stop"
};

export default function Home() {
  const [caseName, setCaseName] = useState<GateCase>("ready");
  const packet = useMemo(() => createTaskPacket(caseName), [caseName]);
  const review = useMemo(() => reviewTaskPacket(packet), [packet]);

  return (
    <main className="shell">
      <section className="hero" aria-label="AI Task Packet Auto Shrink">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP053</p>
          <h1>STOP/BRAKE時にAI Task Packetを自動縮小する提案</h1>
          <p className="lead">
            MVP052のRun Budget Gateの次段として、ready / brake / stopを判定し、
            brakeまたはstopではkeep_now、minimum_verification、resume_conditionを残した縮小案を提示します。
          </p>
        </div>
        <div className={`statusBadge ${review.decision}`}>
          <span>判定</span>
          <strong>{review.decision}</strong>
        </div>
      </section>

      <section className="toolbar" aria-label="ケース切替">
        {(["ready", "brake", "stop"] as GateCase[]).map((item) => (
          <button key={item} type="button" className={caseName === item ? "active" : ""} onClick={() => setCaseName(item)}>
            {caseLabels[item]}ケース
          </button>
        ))}
      </section>

      <section className="grid">
        <article className="panel primary">
          <div className="panelHeader">
            <p className="eyebrow">Run Budget Gate Next</p>
            <h2>AI Task Packet判断: {review.decision}</h2>
          </div>
          {review.decision === "ready" ? (
            <div className="readyBox" aria-label="ready summary">
              <h3>ready: 元のAI Task Packetを維持</h3>
              <p>利用枠に余裕があるため、縮小後AI Task Packet提案は出さず、通常の検証へ進めます。</p>
            </div>
          ) : (
            <div className={review.decision === "brake" ? "brakeBox" : "failureBox"} aria-label={`${review.decision} summary`}>
              <h3>{review.decision}: 縮小後AI Task Packet提案を生成</h3>
              <p>公開前ブロックを検出し、提案内のpathとhostはWORKSPACE/HOMEへサニタイズして表示します。</p>
              {review.publishBlockReasons.map((reason) => <p className="blockReason" key={reason}>{reason}</p>)}
            </div>
          )}
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Usage</p><h2>利用枠</h2></div>
          <dl className="compactList">
            <div><dt>usage band</dt><dd>{review.usageBand}</dd></div>
            <div><dt>primary usage</dt><dd>{packet.primaryUsagePercent}%</dd></div>
            <div><dt>secondary usage</dt><dd>{packet.secondaryUsagePercent}%</dd></div>
            <div><dt>source packet</dt><dd>{packet.sourcePacketId}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Required</p><h2>縮小提案の必須項目</h2></div>
          <ul className="checkList" aria-label="required proposal fields">
            {requiredProposalFields.map((field) => <li key={field} className={review.proposal ? "ok" : "pending"}>{field}</li>)}
          </ul>
        </article>

        <article className="panel primary">
          <div className="panelHeader"><p className="eyebrow">Packet</p><h2>元のAI Task Packet</h2></div>
          <dl className="detailList single">
            <div><dt>run budget gate</dt><dd>{packet.runBudgetGate}</dd></div>
            <div><dt>active goal</dt><dd>{packet.activeGoal}</dd></div>
            <div><dt>resume signal</dt><dd>{packet.resumeSignal}</dd></div>
            <div><dt>prompt draft</dt><dd>{packet.promptDraft}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <div className="panelHeader"><p className="eyebrow">Publish Block</p><h2>公開前ブロック検出</h2></div>
          {review.unsafeTokens.length === 0 ? (
            <p className="muted">local path / private hostは検出されていません。</p>
          ) : (
            <ul className="checkList" aria-label="unsafe tokens">
              {review.unsafeTokens.map((token) => <li key={token} className="ng">{token}</li>)}
            </ul>
          )}
        </article>

        <article className="panel primary">
          <div className="panelHeader"><p className="eyebrow">Evidence</p><h2>公開用にサニタイズした証跡path</h2></div>
          <ul className="checkList" aria-label="sanitized evidence paths">
            {review.sanitizedEvidencePaths.map((item) => <li className="ok" key={item}>{item}</li>)}
          </ul>
        </article>

        <ProposalPanel proposal={review.proposal} />
      </section>
    </main>
  );
}

function ProposalPanel({ proposal }: { proposal: ReducedTaskPacketProposal | null }) {
  if (!proposal) {
    return (
      <article className="panel primary">
        <div className="panelHeader"><p className="eyebrow">Reduced Packet</p><h2>縮小後AI Task Packet提案</h2></div>
        <p className="muted">readyでは縮小提案を生成しません。</p>
      </article>
    );
  }

  return (
    <article className="panel primary" aria-label="reduced packet proposal">
      <div className="panelHeader"><p className="eyebrow">Reduced Packet</p><h2>縮小後AI Task Packet提案</h2></div>
      <section className="proposalGrid">
        <ProposalList title="keep_now" items={proposal.keep_now} />
        <ProposalList title="defer_next_increment" items={proposal.defer_next_increment} />
        <ProposalList title="minimum_verification" items={proposal.minimum_verification} />
        <ProposalText title="fallback_action" value={proposal.fallback_action} />
        <ProposalText title="resume_condition" value={proposal.resume_condition} />
        <ProposalList title="evidence_paths" items={proposal.evidence_paths} />
      </section>
      <div className="promptPreview">
        <h3>prompt_preview</h3>
        <pre>{proposal.prompt_preview}</pre>
      </div>
    </article>
  );
}

function ProposalList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="proposalItem">
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function ProposalText({ title, value }: { title: string; value: string }) {
  return (
    <div className="proposalItem">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
