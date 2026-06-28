"use client";

import { useMemo, useRef, useState } from "react";
import {
  RuntimeMode,
  createEvidenceSummary,
  createPacketMarkdown,
  defaultDraft,
  defaultQualityGates,
  generateRunbook,
  parseList,
  validatePacketCompleteness
} from "../src/lib/aidd";

type TextAreaField =
  | "nonGoals"
  | "successCriteria"
  | "stateContract"
  | "failureContract"
  | "qualityGates"
  | "reviewFindings"
  | "remainingRisks"
  | "whatWorked"
  | "whatFailed"
  | "specUpdatesNeeded";

const modes: RuntimeMode[] = ["empty", "loading", "success", "error", "offline", "timeout"];

export default function Home() {
  const [draft, setDraft] = useState(defaultDraft);
  const [mode, setMode] = useState<RuntimeMode>("empty");
  const errorRef = useRef<HTMLDivElement>(null);
  const validation = useMemo(() => validatePacketCompleteness(draft), [draft]);
  const packet = useMemo(() => createPacketMarkdown(draft), [draft]);
  const runbook = useMemo(() => generateRunbook(draft), [draft]);
  const evidence = useMemo(() => createEvidenceSummary(draft, mode), [draft, mode]);

  function updateList(field: TextAreaField, value: string) {
    setDraft((current) => ({ ...current, [field]: parseList(value) }));
  }

  function generatePacket() {
    setMode("loading");
    window.setTimeout(() => {
      const nextValidation = validatePacketCompleteness(draft);
      setMode(nextValidation.ready ? "success" : "error");
      if (!nextValidation.ready) errorRef.current?.focus();
    }, 300);
  }

  function addDefaultGates() {
    setDraft((current) => ({ ...current, qualityGates: [...defaultQualityGates] }));
  }

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">AIDD-Spec v0.1 / L3 MVP</p>
          <h1>AIDD Control Plane MVP</h1>
          <p>
            Product Brief、AI Task Packet、Agent Runbook、Review、Learning Logを外部送信なしで一つの流れにまとめます。
          </p>
        </div>
        <aside className="statusPanel" aria-live="polite">
          <span className={`statusDot ${mode}`} />
          <strong>{validation.ready ? "L3準備OK" : "入力不足あり"}</strong>
          <span>現在状態: {mode}</span>
        </aside>
      </header>

      <nav className="modeBar" aria-label="状態切替">
        {modes.map((item) => (
          <button key={item} type="button" className={mode === item ? "active" : ""} onClick={() => setMode(item)}>
            {item}
          </button>
        ))}
      </nav>

      <section className="stateBand" aria-live="polite">
        {mode === "empty" && <p>empty: 初期状態です。必須項目を入力するとPacket Previewが更新されます。</p>}
        {mode === "loading" && <p>loading: Packet生成中です。外部API未接続のため画面内状態だけで処理します。</p>}
        {mode === "success" && <p>success: L3準備OK。RunbookとVerification Evidence要約を確認できます。</p>}
        {mode === "error" && <p>error: プロジェクト名、課題、非ゴール、成功条件、quality gateの不足を確認してください。</p>}
        {mode === "offline" && <p>offline: ローカルMVPです。外部送信なし、DBなし、ブラウザ保存なしで動作します。</p>}
        {mode === "timeout" && <p>timeout: Agent実行待ちが長い想定です。Runbookだけ生成済みとしてレビューできます。</p>}
      </section>

      <div className="grid">
        <section className="panel dashboard" aria-labelledby="dashboard-title">
          <h2 id="dashboard-title">Dashboard</h2>
          <ol className="flow">
            <li>Product Brief</li>
            <li>AI Task Packet</li>
            <li>Agent Run</li>
            <li>Verification Evidence</li>
            <li>Review Record</li>
            <li>Learning Log</li>
          </ol>
          <div className="notice">
            <p>API failure: 外部API未接続</p>
            <p>Auth failure: ログイン不要</p>
            <p>Billing failure: 課金機能は非ゴール</p>
          </div>
        </section>

        <section className="panel" aria-labelledby="brief-title">
          <h2 id="brief-title">Project Brief Builder</h2>
          <label>
            プロジェクト名
            <input
              value={draft.projectName}
              onChange={(event) => setDraft((current) => ({ ...current, projectName: event.target.value }))}
              placeholder="AIDD Control Plane MVP"
            />
          </label>
          <label>
            解く課題
            <textarea
              value={draft.userProblem}
              onChange={(event) => setDraft((current) => ({ ...current, userProblem: event.target.value }))}
              placeholder="AI実装前の入力と検証証跡を一つの流れで作りたい"
            />
          </label>
          <label>
            非ゴール
            <textarea
              value={draft.nonGoals.join("\n")}
              onChange={(event) => updateList("nonGoals", event.target.value)}
              placeholder={"ログイン/ユーザー管理は作らない\n外部API送信はしない"}
            />
          </label>
          <label>
            成功条件
            <textarea
              value={draft.successCriteria.join("\n")}
              onChange={(event) => updateList("successCriteria", event.target.value)}
              placeholder={"AI Task Packetを生成できる\nRunbookを生成できる"}
            />
          </label>
        </section>

        <section className="panel" aria-labelledby="packet-builder-title">
          <h2 id="packet-builder-title">AI Task Packet Builder</h2>
          <label>
            状態契約
            <textarea value={draft.stateContract.join("\n")} onChange={(event) => updateList("stateContract", event.target.value)} />
          </label>
          <label>
            失敗契約
            <textarea value={draft.failureContract.join("\n")} onChange={(event) => updateList("failureContract", event.target.value)} />
          </label>
          <label>
            quality gate
            <textarea
              value={draft.qualityGates.join("\n")}
              onChange={(event) => updateList("qualityGates", event.target.value)}
              placeholder="pnpm run lint"
            />
          </label>
          <div className="actions">
            <button type="button" onClick={addDefaultGates}>
              標準gateを入れる
            </button>
            <button type="button" className="primary" onClick={generatePacket}>
              Packet生成
            </button>
          </div>
          <div ref={errorRef} tabIndex={-1} className="validation" aria-live="polite">
            <h3>不足項目</h3>
            {validation.missing.length === 0 ? <p>不足なし</p> : <ul>{validation.missing.map((item) => <li key={item}>{item}</li>)}</ul>}
            <h3>警告</h3>
            {validation.warnings.length === 0 ? <p>警告なし</p> : <ul>{validation.warnings.map((item) => <li key={item}>{item}</li>)}</ul>}
          </div>
        </section>

        <section className="panel wide" aria-labelledby="preview-title">
          <h2 id="preview-title">Packet Preview</h2>
          <pre>{packet}</pre>
        </section>

        <section className="panel wide" aria-labelledby="runbook-title">
          <h2 id="runbook-title">Agent Runbook</h2>
          <pre>{runbook}</pre>
        </section>

        <section className="panel" aria-labelledby="review-title">
          <h2 id="review-title">Review Dashboard</h2>
          <label>
            findings
            <textarea
              value={draft.reviewFindings.join("\n")}
              onChange={(event) => updateList("reviewFindings", event.target.value)}
              placeholder="状態切替のE2Eを追加した"
            />
          </label>
          <label>
            remaining risks
            <textarea
              value={draft.remainingRisks.join("\n")}
              onChange={(event) => updateList("remainingRisks", event.target.value)}
              placeholder="実CIは未接続"
            />
          </label>
          <ul className="evidence">
            {evidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="panel" aria-labelledby="learning-title">
          <h2 id="learning-title">Learning Log</h2>
          <label>
            what worked
            <textarea value={draft.whatWorked.join("\n")} onChange={(event) => updateList("whatWorked", event.target.value)} />
          </label>
          <label>
            what failed
            <textarea value={draft.whatFailed.join("\n")} onChange={(event) => updateList("whatFailed", event.target.value)} />
          </label>
          <label>
            spec updates needed
            <textarea value={draft.specUpdatesNeeded.join("\n")} onChange={(event) => updateList("specUpdatesNeeded", event.target.value)} />
          </label>
        </section>
      </div>
    </main>
  );
}
