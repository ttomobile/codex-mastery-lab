"use client";

import { useMemo, useState } from "react";
import {
  CommandKey,
  commandDefinitions,
  createMissingLogsEvidenceForm,
  createMissingScreenshotsEvidenceForm,
  emptyEvidenceForm,
  evaluateEvidence,
  EvidenceForm,
  sampleEvidenceForm,
  statusLabel
} from "../src/lib/evidence";

const reportFields = [
  { key: "ciRunUrl", label: "CI run URL" },
  { key: "playwrightReport", label: "Playwright report" },
  { key: "coverageReport", label: "coverage report" }
] as const;

export default function Home() {
  const [form, setForm] = useState<EvidenceForm>(emptyEvidenceForm);
  const evidence = useMemo(() => evaluateEvidence(form), [form]);
  const previewJson = useMemo(() => JSON.stringify(evidence, null, 2), [evidence]);

  function updateCommandLog(key: CommandKey, log: string) {
    setForm((current) => ({
      ...current,
      commandLogs: { ...current.commandLogs, [key]: log }
    }));
  }

  function updateScreenshotPath(id: string, path: string) {
    setForm((current) => ({
      ...current,
      screenshots: current.screenshots.map((item) => (item.id === id ? { ...item, path } : item))
    }));
  }

  function updateReportLink(key: keyof EvidenceForm["reports"], value: string) {
    setForm((current) => ({
      ...current,
      reports: { ...current.reports, [key]: value }
    }));
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AIDD-Spec v0.1 / Verification Evidence</p>
          <h1>Evidence Collector Dashboard</h1>
          <p className="lead">
            Command Log Collector、Screenshot Evidence Collector、CI and Report Linksを画面内でまとめ、
            Verification Evidence Preview JSONとして確認します。外部API未接続でログイン不要です。
          </p>
        </div>
        <section className={`statusPanel ${evidence.overall_status}`} aria-live="polite">
          <span>readiness score</span>
          <strong data-testid="readiness-score">{evidence.readiness_score}</strong>
          <small data-testid="overall-status">{statusLabel(evidence.overall_status)}</small>
        </section>
      </header>

      <section className="actionBar" aria-label="証跡シナリオ">
        <button type="button" onClick={() => setForm(sampleEvidenceForm)}>
          サンプル証跡を入れる
        </button>
        <button type="button" onClick={() => setForm(createMissingLogsEvidenceForm())}>
          必須ログを消して失敗を見る
        </button>
        <button type="button" onClick={() => setForm(createMissingScreenshotsEvidenceForm())}>
          スクリーンショットを消して失敗を見る
        </button>
        <button type="button" onClick={() => setForm(emptyEvidenceForm)}>
          リセット
        </button>
      </section>

      <section className="summaryBand" aria-labelledby="summary-title">
        <div className="sectionHeading">
          <p>Evidence Collector Dashboard</p>
          <h2 id="summary-title">準備状況</h2>
        </div>
        <div className="summaryGrid">
          <article>
            <span>Command Log Collector</span>
            <strong>{evidence.command_logs.filter((item) => item.log.trim().length > 0).length} / 6</strong>
          </article>
          <article>
            <span>Screenshot Evidence Collector</span>
            <strong>{evidence.screenshots.filter((item) => item.path.trim().length > 0).length} / {evidence.screenshots.length}</strong>
          </article>
          <article>
            <span>CI and Report Links</span>
            <strong>{evidence.reports.filter((item) => item.url.trim().length > 0).length} / 3</strong>
          </article>
        </div>
      </section>

      <section className="collectorSection" aria-labelledby="logs-title">
        <div className="sectionHeading">
          <p>Command Log Collector</p>
          <h2 id="logs-title">必須コマンドログ</h2>
        </div>
        <div className="logGrid">
          {commandDefinitions.map((definition) => (
            <label className="fieldBlock" key={definition.key}>
              <span>{definition.command}</span>
              <textarea
                aria-label={`${definition.label} command log`}
                value={form.commandLogs[definition.key]}
                onChange={(event) => updateCommandLog(definition.key, event.target.value)}
                placeholder={`${definition.command} の実行ログを貼り付け`}
                spellCheck={false}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="collectorSection" aria-labelledby="screenshots-title">
        <div className="sectionHeading">
          <p>Screenshot Evidence Collector</p>
          <h2 id="screenshots-title">画面とterminal evidence画像</h2>
        </div>
        <div className="compactGrid">
          {form.screenshots.map((item) => (
            <label className="inputBlock" key={item.id}>
              <span>{item.label}</span>
              <input
                aria-label={`${item.label} path`}
                value={item.path}
                onChange={(event) => updateScreenshotPath(item.id, event.target.value)}
                placeholder="assets/example.png"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="collectorSection" aria-labelledby="reports-title">
        <div className="sectionHeading">
          <p>CI and Report Links</p>
          <h2 id="reports-title">CIとレポートリンク</h2>
        </div>
        <div className="compactGrid">
          {reportFields.map((field) => (
            <label className="inputBlock" key={field.key}>
              <span>{field.label}</span>
              <input
                aria-label={field.label}
                value={form.reports[field.key]}
                onChange={(event) => updateReportLink(field.key, event.target.value)}
                placeholder={field.key === "ciRunUrl" ? "https://example.invalid/actions/runs/..." : `${field.label}.html`}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="results" aria-labelledby="results-title">
        <div className="sectionHeading">
          <p>missing evidence list</p>
          <h2 id="results-title">不足とwarning</h2>
        </div>
        <div className="resultGrid">
          <article>
            <h3>missing evidence list</h3>
            {evidence.missing_evidence.length === 0 ? (
              <p data-testid="missing-evidence">不足証跡はありません。</p>
            ) : (
              <ul data-testid="missing-evidence">
                {evidence.missing_evidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </article>
          <article>
            <h3>warning</h3>
            <ul>
              {evidence.warnings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="preview" aria-labelledby="preview-title">
        <div className="sectionHeading">
          <p>Verification Evidence Preview JSON</p>
          <h2 id="preview-title">プレビュー</h2>
        </div>
        <pre data-testid="preview-json">{previewJson}</pre>
      </section>
    </main>
  );
}
