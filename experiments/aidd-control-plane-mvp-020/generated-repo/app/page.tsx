"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  APP_TYPES,
  APP_TYPE_TEMPLATES,
  QUALITY_GATE_OPTIONS,
  STATE_CONTRACT_OPTIONS,
  type AppTypeTemplateId,
  type DeltaDecisionReviewMode,
  type AdoptedDeltaMarkdownExportMode,
  type QualityGate,
  type SpecUpdateProposalMode,
  type StateContract,
  type TaskPacketDeltaApplyPreviewMode,
  type VerificationRun,
  buildIntakeDraft,
  createEmptyTaskPacketDeltaApplyPreview,
  createEmptyDeltaDecisionReview,
  createEmptyAdoptedDeltaMarkdownExport,
  createEvidenceMissingVerificationRun,
  createEmptyCiWorkflowArtifactAuditor,
  createEmptySpecUpdateProposalQueue,
  createFailureVerificationRun,
  createFailureCiWorkflowArtifactAuditor,
  createFailureTaskPacketDeltaApplyPreview,
  createFailureDeltaDecisionReview,
  createFailureAdoptedDeltaMarkdownExport,
  createFailureSpecUpdateProposalQueue,
  createInitialVerificationRun,
  createSuccessVerificationRun,
  createValidCiWorkflowArtifactAuditor,
  createValidTaskPacketDeltaApplyPreview,
  createValidDeltaDecisionReview,
  createValidAdoptedDeltaMarkdownExport,
  createValidSpecUpdateProposalQueue,
  evaluateCiArtifactImport,
  evaluateCiWorkflowArtifactAuditor,
  evaluateTaskPacketDeltaApplyPreview,
  evaluateDeltaDecisionReview,
  evaluateAdoptedDeltaMarkdownExport,
  evaluateEvidenceGapRepairPlan,
  evaluateGitHubActionsFetchPlan,
  evaluateArtifactEvidenceBinder,
  evaluateReadiness,
  evaluateSpecUpdateProposalQueue,
  evaluateVerificationRun,
  generateCodexPrompt,
  generateLearningLog,
  generateProductBrief,
  generateReviewRecord,
  generateTaskPacket,
  generateVerificationPlan
} from "../src/lib/intake";
import emptyFixture from "../mocks/ci-service/fixtures/empty.json";
import failureFixture from "../mocks/ci-service/fixtures/failure.json";
import rateLimitFixture from "../mocks/ci-service/fixtures/rate_limit.json";
import timeoutFixture from "../mocks/ci-service/fixtures/timeout.json";
import validFixture from "../mocks/ci-service/fixtures/valid.json";

const initialStateContract: StateContract[] = ["empty", "success", "error"];
const initialQualityGates: QualityGate[] = ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd"];

const statusLabels = {
  empty: "empty: 入力待ち",
  draft: "draft: 下書き",
  ready: "ready: AIへ渡せます",
  insufficient: "insufficient: 必須項目が不足"
};

type MockCiMode = "empty" | "valid" | "failure" | "timeout" | "rate_limit";
type WorkflowAuditorMode = "empty" | "valid" | "failure";

const mockCiSamples: Record<MockCiMode, {
  label: string;
  runUrl: string;
  owner: string;
  repo: string;
  runId: string;
  commitSha: string;
  workflow: string;
  jobs: string[];
  artifacts: string[];
  issue: string;
  repair: string;
  promptDelta: string;
  retryAfterSeconds?: number;
  tokenScopeReview?: string[];
  manualEvidence?: string[];
  nextTaskPacketDelta?: string;
}> = {
  empty: emptyFixture,
  valid: validFixture,
  failure: failureFixture,
  timeout: timeoutFixture,
  rate_limit: rateLimitFixture
};

type MockCiServiceState = {
  scenario: MockCiMode;
  ci: (typeof mockCiSamples)[MockCiMode];
};

const mockCiServiceUrl = process.env.NEXT_PUBLIC_MOCK_CI_SERVICE_URL ?? "http://127.0.0.1:4314";

export default function Home() {
  const [appName, setAppName] = useState("");
  const [appType, setAppType] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [userProblem, setUserProblem] = useState("");
  const [keyFeaturesText, setKeyFeaturesText] = useState("");
  const [nonGoalsText, setNonGoalsText] = useState("");
  const [externalIntegrationsText, setExternalIntegrationsText] = useState("");
  const [stateContract, setStateContract] = useState<StateContract[]>(initialStateContract);
  const [qualityGates, setQualityGates] = useState<QualityGate[]>(initialQualityGates);
  const [selectedTemplateId, setSelectedTemplateId] = useState<AppTypeTemplateId | "">("");
  const [appliedTemplateId, setAppliedTemplateId] = useState<AppTypeTemplateId | "">("");
  const [verificationRun, setVerificationRun] = useState<VerificationRun>(() => createInitialVerificationRun());
  const [mockCiMode, setMockCiMode] = useState<MockCiMode>("empty");
  const [mockCiState, setMockCiState] = useState<(typeof mockCiSamples)[MockCiMode]>(mockCiSamples.empty);
  const [mockCiConnection, setMockCiConnection] = useState<"loading" | "service" | "fallback">("loading");
  const [workflowAuditorMode, setWorkflowAuditorMode] = useState<WorkflowAuditorMode>("empty");
  const [proposalQueueMode, setProposalQueueMode] = useState<SpecUpdateProposalMode>("empty");
  const [deltaApplyPreviewMode, setDeltaApplyPreviewMode] = useState<TaskPacketDeltaApplyPreviewMode>("empty");
  const [deltaDecisionReviewMode, setDeltaDecisionReviewMode] = useState<DeltaDecisionReviewMode>("empty");
  const [adoptedExportMode, setAdoptedExportMode] = useState<AdoptedDeltaMarkdownExportMode>("empty");

  const refreshMockCiState = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch(`${mockCiServiceUrl}/state`, { signal });
      if (!response.ok) throw new Error(`mock CI service returned ${response.status}`);
      const body = (await response.json()) as MockCiServiceState;
      setMockCiMode(body.scenario);
      setMockCiState(body.ci);
      setMockCiConnection("service");
    } catch {
      if (!signal?.aborted) {
        setMockCiState(mockCiSamples[mockCiMode]);
        setMockCiConnection("fallback");
      }
    }
  }, [mockCiMode]);

  async function updateMockCiScenario(scenario: MockCiMode) {
    try {
      const response = await fetch(`${mockCiServiceUrl}/__control/state`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scenario })
      });
      if (!response.ok) throw new Error(`mock CI service returned ${response.status}`);
      const body = (await response.json()) as MockCiServiceState;
      setMockCiMode(body.scenario);
      setMockCiState(body.ci);
      setMockCiConnection("service");
    } catch {
      setMockCiMode(scenario);
      setMockCiState(mockCiSamples[scenario]);
      setMockCiConnection("fallback");
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2_000);
    refreshMockCiState(controller.signal).finally(() => window.clearTimeout(timeoutId));
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [refreshMockCiState]);

  const draft = useMemo(
    () =>
      buildIntakeDraft({
        appName,
        appType,
        targetUser,
        userProblem,
        keyFeaturesText,
        nonGoalsText,
        externalIntegrationsText,
        stateContract,
        qualityGates,
        selectedTemplateId,
        appliedTemplateId,
        verificationRun
      }),
    [
      appName,
      appType,
      targetUser,
      userProblem,
      keyFeaturesText,
      nonGoalsText,
      externalIntegrationsText,
      stateContract,
      qualityGates,
      selectedTemplateId,
      appliedTemplateId,
      verificationRun
    ]
  );

  const review = useMemo(() => evaluateReadiness(draft), [draft]);
  const verificationReview = useMemo(() => evaluateVerificationRun(verificationRun), [verificationRun]);
  const artifactBinderReview = useMemo(() => evaluateArtifactEvidenceBinder(verificationRun.artifactBinder), [verificationRun]);
  const evidenceGapRepairPlan = useMemo(() => evaluateEvidenceGapRepairPlan(verificationRun), [verificationRun]);
  const reviewRecord = useMemo(() => generateReviewRecord(verificationRun, draft.templateRisks), [verificationRun, draft.templateRisks]);
  const learningLog = useMemo(() => generateLearningLog(reviewRecord), [reviewRecord]);
  const productBrief = useMemo(() => generateProductBrief(draft), [draft]);
  const taskPacket = useMemo(() => generateTaskPacket(draft), [draft]);
  const verificationPlan = useMemo(() => generateVerificationPlan(draft), [draft]);
  const codexPrompt = useMemo(() => generateCodexPrompt(draft), [draft]);
  const selectedTemplate = APP_TYPE_TEMPLATES.find((template) => template.id === selectedTemplateId);
  const mockCi = mockCiState;
  const workflowAuditor = useMemo(() => {
    if (workflowAuditorMode === "valid") return createValidCiWorkflowArtifactAuditor();
    if (workflowAuditorMode === "failure") return createFailureCiWorkflowArtifactAuditor();
    return createEmptyCiWorkflowArtifactAuditor();
  }, [workflowAuditorMode]);
  const workflowAudit = useMemo(() => evaluateCiWorkflowArtifactAuditor(workflowAuditor), [workflowAuditor]);
  const proposalQueue = useMemo(() => {
    if (proposalQueueMode === "valid") return createValidSpecUpdateProposalQueue(reviewRecord, learningLog);
    if (proposalQueueMode === "failure") return createFailureSpecUpdateProposalQueue();
    return createEmptySpecUpdateProposalQueue();
  }, [proposalQueueMode, reviewRecord, learningLog]);
  const proposalQueueReview = useMemo(() => evaluateSpecUpdateProposalQueue(proposalQueue), [proposalQueue]);
  const deltaApplyPreview = useMemo(() => {
    if (deltaApplyPreviewMode === "valid") return createValidTaskPacketDeltaApplyPreview(createValidSpecUpdateProposalQueue(reviewRecord, learningLog));
    if (deltaApplyPreviewMode === "failure") return createFailureTaskPacketDeltaApplyPreview();
    return createEmptyTaskPacketDeltaApplyPreview();
  }, [deltaApplyPreviewMode, reviewRecord, learningLog]);
  const deltaApplyPreviewReview = useMemo(() => evaluateTaskPacketDeltaApplyPreview(deltaApplyPreview), [deltaApplyPreview]);
  const deltaDecisionReview = useMemo(() => {
    if (deltaDecisionReviewMode === "valid") return createValidDeltaDecisionReview(deltaApplyPreview);
    if (deltaDecisionReviewMode === "failure") return createFailureDeltaDecisionReview();
    return createEmptyDeltaDecisionReview();
  }, [deltaDecisionReviewMode, deltaApplyPreview]);
  const deltaDecisionSummary = useMemo(() => evaluateDeltaDecisionReview(deltaDecisionReview), [deltaDecisionReview]);
  const adoptedDeltaExport = useMemo(() => {
    if (adoptedExportMode === "valid") return createValidAdoptedDeltaMarkdownExport(deltaDecisionReview);
    if (adoptedExportMode === "failure") return createFailureAdoptedDeltaMarkdownExport();
    return createEmptyAdoptedDeltaMarkdownExport();
  }, [adoptedExportMode, deltaDecisionReview]);
  const adoptedDeltaExportReview = useMemo(() => evaluateAdoptedDeltaMarkdownExport(adoptedDeltaExport), [adoptedDeltaExport]);
  const templateFailure =
    selectedTemplateId === "" ? "テンプレート未選択" : selectedTemplateId !== appliedTemplateId ? "テンプレート未適用" : "";

  function applySelectedTemplate() {
    if (!selectedTemplate) return;
    setAppType(selectedTemplate.appType);
    setKeyFeaturesText(selectedTemplate.recommendedFeatures.join("\n"));
    setNonGoalsText(selectedTemplate.nonGoals.join("\n"));
    setExternalIntegrationsText(selectedTemplate.externalIntegrations.join("\n"));
    setStateContract([...selectedTemplate.stateContract]);
    setQualityGates([...selectedTemplate.qualityGates]);
    setAppliedTemplateId(selectedTemplate.id);
  }

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">AIDD Control Plane MVP 020</p>
          <h1 id="hero-title">採用済み改善deltaを次回AI Task Packet Markdownへ書き出すSaaS</h1>
          <p>
            Project Intake Wizardは、初めてAIDD Control Planeを使う人が「何を入力すればよいか」を順番に答えられる画面です。
            App Type Templatesで初期値を作り、GitHub Actions Artifact Fetch PlanとCI Workflow Artifact Auditorを壊さず、Review FindingとLearning Logから採用されたdeltaだけをMarkdown差分へ変換し、AIDD-Spec v0.1の次回AI Task Packetへ戻します。
          </p>
        </div>
        <aside className={`status-card status-${review.status}`} aria-labelledby="readiness-mini-title">
          <h2 id="readiness-mini-title">Readiness Review</h2>
          <strong>{statusLabels[review.status]}</strong>
          <span>readiness score: {review.score}</span>
        </aside>
      </section>

      <section className={`artifact-binder artifact-${mockCiMode === "valid" ? "valid" : mockCiMode === "empty" ? "empty" : "failure"}`} aria-labelledby="mock-ci-title">
        <div className="section-heading">
          <p className="eyebrow">独立Mock CI Service</p>
          <h2 id="mock-ci-title">Mock CI Service: {mockCi.label}</h2>
          <p>fixture駆動のJSON contractをDocker Compose経路とNode fallback経路で共有し、NEXT_PUBLIC_MOCK_CI_SERVICE_URLまたはhttp://127.0.0.1:4314からempty / valid / failure / timeout / rate_limitをローカルUIへ反映します。</p>
        </div>
        <div className={`verification-summary ${mockCiConnection === "service" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{mockCiConnection === "service" ? "mock service接続中" : mockCiConnection === "loading" ? "mock service取得中" : "手動Evidence Binder fallback"}</strong>
          <span>{mockCiConnection === "fallback" ? "Node fallback経路の同一contractをUI内fixtureとして使い、手動Artifact Evidence Binderでterminal evidenceとscreenshot evidenceを添付します。" : `Docker Compose経路またはNode fallback経路の同一contractに接続中: ${mockCiServiceUrl}`}</span>
        </div>
        <div className="sample-actions" aria-label="Mock CI Evidence Connectorサンプル操作">
          <button type="button" className="secondary-button" onClick={() => updateMockCiScenario("empty")}>空の状態</button>
          <button type="button" className="primary-button" onClick={() => updateMockCiScenario("valid")}>証跡が揃った状態</button>
          <button type="button" className="secondary-button" onClick={() => updateMockCiScenario("failure")}>証跡不足</button>
          <button type="button" className="secondary-button" onClick={() => updateMockCiScenario("timeout")}>取得タイムアウト</button>
          <button type="button" className="secondary-button" onClick={() => updateMockCiScenario("rate_limit")}>rate limit</button>
        </div>
        <dl aria-label="Mock CI Evidence Connector summary">
          <div><dt>CI run URL</dt><dd>{mockCi.runUrl}</dd></div>
          <div><dt>owner / repo / run id</dt><dd>{mockCi.owner} / {mockCi.repo} / {mockCi.runId}</dd></div>
          <div><dt>commit SHA</dt><dd>{mockCi.commitSha}</dd></div>
          <div><dt>workflow</dt><dd>{mockCi.workflow}</dd></div>
        </dl>
        <div className="binder-grid">
          <section><h3>jobs API結果</h3><ul>{mockCi.jobs.map((job) => <li key={job}>{job}</li>)}</ul></section>
          <section><h3>artifacts API結果</h3><ul>{mockCi.artifacts.map((artifact) => <li key={artifact}>{artifact}</li>)}</ul></section>
          <section><h3>修正指示</h3><p className={mockCiMode === "valid" ? "applied-state" : "failure-state"}>{mockCi.issue}</p><p>{mockCi.repair}</p></section>
        </div>
        {mockCiMode === "rate_limit" ? (
          <div className="binder-grid" aria-label="rate_limit対応">
            <section>
              <h3>待機時間</h3>
              <p>{mockCi.retryAfterSeconds}秒待機してからCI APIを再取得します。</p>
            </section>
            <section>
              <h3>token scope見直し</h3>
              <ul>{mockCi.tokenScopeReview?.map((scope) => <li key={scope}>{scope}</li>)}</ul>
            </section>
            <section>
              <h3>手動証跡添付</h3>
              <ul>{mockCi.manualEvidence?.map((evidence) => <li key={evidence}>{evidence}</li>)}</ul>
            </section>
            <section>
              <h3>次回AI Task Packet Delta</h3>
              <p>{mockCi.nextTaskPacketDelta}</p>
            </section>
          </div>
        ) : null}
        <pre aria-label="Mock CI Codex prompt delta">{mockCi.promptDelta}</pre>
      </section>

      <section className={`artifact-binder artifact-${workflowAudit.status}`} aria-labelledby="workflow-auditor-title">
        <div className="section-heading">
          <p className="eyebrow">CI Workflow Artifact Auditor</p>
          <h2 id="workflow-auditor-title">CI Workflow Artifact Auditor: {workflowAudit.status}</h2>
          <p>
            .github/workflows/aidd-control-plane.ymlを静的監査し、pnpm install --frozen-lockfile / lint / typecheck / test / build / doctor:aidd / mock:doctor / test:e2eとartifact保存をAIDD-Specへ接続します。
          </p>
        </div>
        <div className={`verification-summary ${workflowAudit.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{workflowAudit.status === "valid" ? "workflow artifact監査はvalidです" : `不足項目: ${workflowAudit.reviewFindings.length}件`}</strong>
          <span>{workflowAuditor.workflowPath || ".github/workflows/aidd-control-plane.yml未接続"} / capture:mvp019: {workflowAudit.missingCaptureCommand ? "未接続" : "接続済み"}</span>
        </div>
        <div className="sample-actions" aria-label="CI Workflow Artifact Auditorサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setWorkflowAuditorMode("empty")}>auditor empty</button>
          <button type="button" className="primary-button" onClick={() => setWorkflowAuditorMode("valid")}>auditor valid</button>
          <button type="button" className="secondary-button" onClick={() => setWorkflowAuditorMode("failure")}>auditor failure</button>
        </div>
        <div className="binder-grid">
          <section>
            <h3>required gates</h3>
            <ul>{workflowAuditor.configuredGates.length > 0 ? workflowAuditor.configuredGates.map((gate) => <li key={gate}>{gate}</li>) : <li className="failure-state">gate未設定</li>}</ul>
          </section>
          <section>
            <h3>artifact paths</h3>
            <ul>{workflowAuditor.configuredArtifactPaths.length > 0 ? workflowAuditor.configuredArtifactPaths.map((artifactPath) => <li key={artifactPath}>{artifactPath}</li>) : <li className="failure-state">artifact path未設定</li>}</ul>
          </section>
          <section>
            <h3>AIDD-Spec接続</h3>
            <ul>{workflowAuditor.aiddSpecConnections.length > 0 ? workflowAuditor.aiddSpecConnections.map((connection) => <li key={connection}>{connection}</li>) : <li className="failure-state">AIDD-Spec接続未設定</li>}</ul>
          </section>
        </div>
        {workflowAudit.reviewFindings.length > 0 ? (
          <div className="learning-grid">
            <section aria-labelledby="workflow-findings-title">
              <h3 id="workflow-findings-title">Review Finding</h3>
              <ul>{workflowAudit.reviewFindings.map((finding) => <li key={finding.finding}><strong>{finding.severity}</strong> / {finding.finding}<br />修正指示: {finding.fixInstruction}</li>)}</ul>
            </section>
            <section aria-labelledby="workflow-delta-title">
              <h3 id="workflow-delta-title">AI Task Packet Delta</h3>
              <ul>{workflowAudit.aiTaskPacketDelta.map((delta) => <li key={delta}>{delta}</li>)}</ul>
            </section>
            <section aria-labelledby="workflow-spec-title">
              <h3 id="workflow-spec-title">AIDD-Spec更新候補</h3>
              <ul>{workflowAudit.specUpdateCandidates.map((candidate) => <li key={candidate}>{candidate}</li>)}</ul>
            </section>
          </div>
        ) : (
          <p className="applied-state">coverage / playwright-report / test-results / experiments terminal evidence相当のartifact保存をworkflow監査で確認済みです。</p>
        )}
      </section>

      <section className={`artifact-binder artifact-${proposalQueueReview.status}`} aria-labelledby="spec-update-queue-title">
        <div className="section-heading">
          <p className="eyebrow">Spec Update Proposal Queue</p>
          <h2 id="spec-update-queue-title">Spec Update Proposal Queue: {proposalQueueReview.status}</h2>
          <p>
            Review FindingとLearning Logから、標準更新候補に必要なfinding、ideal state、needed upstream info、target standard document、target field、priority、acceptance criteria、Codex prompt delta、verification commandを確認します。
          </p>
        </div>
        <div className={`verification-summary ${proposalQueueReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{proposalQueueReview.status === "valid" ? "標準更新候補はvalidです" : `標準更新候補の不足: ${proposalQueueReview.issues.length}件`}</strong>
          <span>対象: standards/aidd-control-plane-mvp-v0.1.md / Review Record / Learning Log / Codex Prompt Delta</span>
        </div>
        <div className="sample-actions" aria-label="Spec Update Proposal Queueサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setProposalQueueMode("empty")}>proposal empty</button>
          <button type="button" className="primary-button" onClick={() => setProposalQueueMode("valid")}>proposal valid</button>
          <button type="button" className="secondary-button" onClick={() => setProposalQueueMode("failure")}>proposal failure</button>
        </div>
        {proposalQueue.proposals.length > 0 ? (
          <div className="proposal-list" aria-label="Spec Update Proposal Queue candidates">
            {proposalQueue.proposals.map((proposal, index) => (
              <article key={`${proposal.finding}-${index}`} className="proposal-card">
                <h3>標準更新候補 {index + 1}</h3>
                <dl>
                  <div><dt>finding</dt><dd>{proposal.finding}</dd></div>
                  <div><dt>ideal state</dt><dd>{proposal.idealState}</dd></div>
                  <div><dt>needed upstream info</dt><dd>{proposal.neededUpstreamInfo.join(" / ") || "未登録"}</dd></div>
                  <div><dt>target standard document</dt><dd>{proposal.targetStandardDocument || "未登録"}</dd></div>
                  <div><dt>target field</dt><dd>{proposal.targetField || "未登録"}</dd></div>
                  <div><dt>priority</dt><dd>{proposal.priority}</dd></div>
                  <div><dt>acceptance criteria</dt><dd>{proposal.acceptanceCriteria.length > 0 ? proposal.acceptanceCriteria.join(" / ") : "未登録"}</dd></div>
                  <div><dt>verification command</dt><dd>{proposal.verificationCommand || "未登録"}</dd></div>
                </dl>
                <pre aria-label="Spec Update Proposal Codex prompt delta">{proposal.codexPromptDelta || "未登録"}</pre>
              </article>
            ))}
          </div>
        ) : (
          <p className="failure-state">標準更新候補はまだありません。proposal validでReview FindingとLearning Logから生成します。</p>
        )}
        {proposalQueueReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Spec Update Proposal Queue issues">
            {proposalQueueReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : proposalQueueReview.status === "valid" ? (
          <p className="applied-state">finding / ideal state / needed upstream info / target standard document / target field / priority / acceptance criteria / Codex prompt delta / verification commandを確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${deltaApplyPreviewReview.status}`} aria-labelledby="delta-apply-preview-title">
        <div className="section-heading">
          <p className="eyebrow">AI Task Packet Delta Apply Preview</p>
          <h2 id="delta-apply-preview-title">AI Task Packet Delta Apply Preview: {deltaApplyPreviewReview.status}</h2>
          <p>
            Spec Update Proposal Queueの候補を採用したとき、次回AI Task Packet / Codex prompt / verification planへ何が足されるかをAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdへ接続して確認します。
          </p>
        </div>
        <div className={`verification-summary ${deltaApplyPreviewReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{deltaApplyPreviewReview.status === "valid" ? "delta apply previewはvalidです" : `delta apply preview不足: ${deltaApplyPreviewReview.issues.length}件`}</strong>
          <span>料理の改善メモのように、採用したproposalを次回の手順と確認コマンドへ戻します。</span>
        </div>
        <div className="sample-actions" aria-label="AI Task Packet Delta Apply Previewサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setDeltaApplyPreviewMode("empty")}>delta empty</button>
          <button type="button" className="primary-button" onClick={() => setDeltaApplyPreviewMode("valid")}>delta valid</button>
          <button type="button" className="secondary-button" onClick={() => setDeltaApplyPreviewMode("failure")}>delta failure</button>
        </div>
        {deltaApplyPreviewReview.status === "empty" ? (
          <p className="failure-state">採用プレビューはまだありません。delta validでsource proposalから次回AI Task Packetへの差分を生成します。</p>
        ) : (
          <div className="proposal-list" aria-label="AI Task Packet Delta Apply Preview details">
            <article className="proposal-card">
              <h3>採用差分プレビュー</h3>
              <dl>
                <div><dt>source proposal</dt><dd>{deltaApplyPreview.sourceProposal || "未登録"}</dd></div>
                <div><dt>target packet section</dt><dd>{deltaApplyPreview.targetPacketSection || "未登録"}</dd></div>
                <div><dt>before summary</dt><dd>{deltaApplyPreview.beforeSummary || "未登録"}</dd></div>
                <div><dt>after summary</dt><dd>{deltaApplyPreview.afterSummary || "未登録"}</dd></div>
                <div><dt>added acceptance criteria</dt><dd>{deltaApplyPreview.addedAcceptanceCriteria.length > 0 ? deltaApplyPreview.addedAcceptanceCriteria.join(" / ") : "未登録"}</dd></div>
                <div><dt>added verification commands</dt><dd>{deltaApplyPreview.addedVerificationCommands.length > 0 ? deltaApplyPreview.addedVerificationCommands.join(" / ") : "未登録"}</dd></div>
                <div><dt>rollback condition</dt><dd>{deltaApplyPreview.rollbackCondition || "未登録"}</dd></div>
              </dl>
              <h4>review checklist</h4>
              {deltaApplyPreview.reviewChecklist.length > 0 ? (
                <ul>{deltaApplyPreview.reviewChecklist.map((item) => <li key={item}>{item}</li>)}</ul>
              ) : (
                <p className="failure-state">review checklist未登録</p>
              )}
              <pre aria-label="AI Task Packet Delta Apply Preview Codex prompt patch">{deltaApplyPreview.codexPromptPatch || "未登録"}</pre>
            </article>
          </div>
        )}
        {deltaApplyPreviewReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="AI Task Packet Delta Apply Preview issues">
            {deltaApplyPreviewReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : deltaApplyPreviewReview.status === "valid" ? (
          <p className="applied-state">source proposal / target packet section / before summary / after summary / added acceptance criteria / added verification commands / Codex prompt patch / rollback condition / review checklistを確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${deltaDecisionSummary.status}`} aria-labelledby="delta-decision-title">
        <div className="section-heading">
          <p className="eyebrow">Delta Decision Review</p>
          <h2 id="delta-decision-title">Delta Decision Review: {deltaDecisionSummary.status}</h2>
          <p>
            AI Task Packet Deltaを採用 / 却下 / 保留に分け、誰が・いつ・なぜ判断したかをReview Recordとして残します。採用済みdeltaだけが次回AI Task Packet / Codex promptへ進みます。
          </p>
        </div>
        <div className={`verification-summary ${deltaDecisionSummary.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{deltaDecisionSummary.status === "valid" ? "delta decision reviewはvalidです" : `delta decision review不足: ${deltaDecisionSummary.issues.length}件`}</strong>
          <span>採用: {deltaDecisionSummary.adoptedCount}件 / 却下: {deltaDecisionSummary.rejectedCount}件 / 保留: {deltaDecisionSummary.deferredCount}件</span>
        </div>
        <div className="sample-actions" aria-label="Delta Decision Reviewサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setDeltaDecisionReviewMode("empty")}>decision empty</button>
          <button type="button" className="primary-button" onClick={() => setDeltaDecisionReviewMode("valid")}>decision valid</button>
          <button type="button" className="secondary-button" onClick={() => setDeltaDecisionReviewMode("failure")}>decision failure</button>
        </div>
        {deltaDecisionSummary.status === "empty" ? (
          <p className="failure-state">まだ判断待ちの差分がありません。decision validで採用 / 却下 / 保留のReview Recordを生成します。</p>
        ) : (
          <div className="proposal-list" aria-label="Delta Decision Review details">
            {deltaDecisionReview.decisions.map((decision) => (
              <article className="proposal-card" key={decision.deltaId}>
                <h3>{decision.deltaId}: {decision.status}</h3>
                <dl>
                  <div><dt>source proposal</dt><dd>{decision.sourceProposal}</dd></div>
                  <div><dt>decision owner</dt><dd>{decision.decisionOwner || "未登録"}</dd></div>
                  <div><dt>decision reason</dt><dd>{decision.decisionReason || "未登録"}</dd></div>
                  <div><dt>decided at</dt><dd>{decision.decidedAt || "未登録"}</dd></div>
                  <div><dt>next action</dt><dd>{decision.nextAction || "未登録"}</dd></div>
                  <div><dt>review evidence</dt><dd>{decision.reviewEvidence || "未登録"}</dd></div>
                  <div><dt>rollback confirmed</dt><dd>{decision.rollbackConfirmed ? "確認済み" : "未確認"}</dd></div>
                  <div><dt>included in next packet</dt><dd>{decision.includedInNextPacket ? "次回AI Task Packetへ入れる" : "次回AI Task Packetへ入れない"}</dd></div>
                  <div><dt>verification commands</dt><dd>{decision.verificationCommands.length > 0 ? decision.verificationCommands.join(" / ") : "未登録"}</dd></div>
                  <div><dt>prevention note</dt><dd>{decision.preventionNote || "未登録"}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        )}
        {deltaDecisionSummary.includedInNextPacket.length > 0 ? (
          <div className="applied-state" aria-label="次回AI Task Packetに入る採用済みdelta">
            次回AI Task Packetへ入る採用済みdelta: {deltaDecisionSummary.includedInNextPacket.map((decision) => decision.deltaId).join(" / ")}
          </div>
        ) : null}
        {deltaDecisionSummary.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Delta Decision Review issues">
            {deltaDecisionSummary.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : deltaDecisionSummary.status === "valid" ? (
          <p className="applied-state">採用 / 却下 / 保留、decision owner、decision reason、decided at、next action、review evidence、rollback confirmedを確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${adoptedDeltaExportReview.status}`} aria-labelledby="adopted-export-title">
        <div className="section-heading">
          <p className="eyebrow">Adopted Delta Markdown Exporter</p>
          <h2 id="adopted-export-title">Adopted Delta Markdown Exporter: {adoptedDeltaExportReview.status}</h2>
          <p>
            採用済みdeltaだけを次回AI Task Packet Markdown、Verification Plan追記、Codex prompt追記へ変換します。却下 / 保留deltaはLearning Logへ戻し、実装依頼には混ぜません。
          </p>
        </div>
        <div className={`verification-summary ${adoptedDeltaExportReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{adoptedDeltaExportReview.status === "valid" ? "adopted delta markdown exportはvalidです" : `adopted delta markdown export不足: ${adoptedDeltaExportReview.issues.length}件`}</strong>
          <span>Markdownへ入るdelta: {adoptedDeltaExport.includedDeltaIds.length}件 / Learning Logへ戻すdelta: {adoptedDeltaExport.learningLogReturns.length}件</span>
        </div>
        <div className="sample-actions" aria-label="Adopted Delta Markdown Exporterサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setAdoptedExportMode("empty")}>export empty</button>
          <button type="button" className="primary-button" onClick={() => setAdoptedExportMode("valid")}>export valid</button>
          <button type="button" className="secondary-button" onClick={() => setAdoptedExportMode("failure")}>export failure</button>
        </div>
        {adoptedDeltaExportReview.status === "empty" ? (
          <p className="failure-state">まだ書き出す採用済みdeltaがありません。decision validの後にexport validでMarkdown差分を生成します。</p>
        ) : (
          <div className="proposal-list" aria-label="Adopted Delta Markdown Exporter details">
            <article className="proposal-card">
              <h3>次回AI Task Packet Markdown</h3>
              <pre aria-label="採用済みdeltaのMarkdown export">{adoptedDeltaExport.markdownSection || "未登録"}</pre>
              <dl>
                <div><dt>verification plan patch</dt><dd>{adoptedDeltaExport.verificationPlanPatch.length > 0 ? adoptedDeltaExport.verificationPlanPatch.join(" / ") : "未登録"}</dd></div>
                <div><dt>rollback condition</dt><dd>{adoptedDeltaExport.rollbackCondition || "未登録"}</dd></div>
                <div><dt>review evidence</dt><dd>{adoptedDeltaExport.reviewEvidence.length > 0 ? adoptedDeltaExport.reviewEvidence.join(" / ") : "未登録"}</dd></div>
              </dl>
              <pre aria-label="採用済みdeltaのCodex prompt追記">{adoptedDeltaExport.codexPromptPatch || "未登録"}</pre>
            </article>
            <article className="proposal-card">
              <h3>Learning Logへ戻す未採用delta</h3>
              {adoptedDeltaExport.learningLogReturns.length > 0 ? (
                <ul>{adoptedDeltaExport.learningLogReturns.map((item) => <li key={item}>{item}</li>)}</ul>
              ) : (
                <p className="failure-state">Learning Log戻し対象なし</p>
              )}
            </article>
          </div>
        )}
        {adoptedDeltaExportReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Adopted Delta Markdown Exporter issues">
            {adoptedDeltaExportReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : adoptedDeltaExportReview.status === "valid" ? (
          <p className="applied-state">採用済みdeltaだけがMarkdown exportに入り、却下 / 保留deltaはLearning Logへ戻ることを確認済みです。</p>
        ) : null}
      </section>

      <section className="workspace" aria-label="Project Intake Wizard">
        <form className="wizard" aria-labelledby="wizard-title">
          <div className="section-heading">
            <p className="eyebrow">Project Intake Wizard</p>
            <h2 id="wizard-title">AIに渡す依頼書を生成</h2>
          </div>

          <section className="template-picker" aria-labelledby="template-title">
            <div className="template-picker-header">
              <div>
                <p className="eyebrow">App Type Templates</p>
                <h3 id="template-title">テンプレートを選ぶ</h3>
              </div>
              {templateFailure ? <strong className="failure-state">{templateFailure}</strong> : <strong className="applied-state">テンプレート適用済み</strong>}
            </div>
            <div className="template-grid">
              {APP_TYPE_TEMPLATES.map((template) => (
                <label key={template.id} className={`template-option ${selectedTemplateId === template.id ? "is-selected" : ""}`}>
                  <input
                    type="radio"
                    name="app-type-template"
                    checked={selectedTemplateId === template.id}
                    onChange={() => setSelectedTemplateId(template.id)}
                  />
                  <span>
                    <strong>{template.name}</strong>
                    <small>{template.recommendedFeatures.slice(0, 3).join(" / ")}</small>
                  </span>
                </label>
              ))}
            </div>
            {selectedTemplate ? (
              <div className="template-detail" aria-live="polite">
                <p>
                  <strong>リスク:</strong> {selectedTemplate.risks.join(" / ")}
                </p>
                <p>
                  <strong>証跡要件:</strong> {selectedTemplate.evidenceRequirements.join(" / ")}
                </p>
              </div>
            ) : (
              <p className="template-detail">テンプレート未選択のため、リスクと証跡要件はまだ生成物に入りません。</p>
            )}
            <button type="button" className="primary-button" onClick={applySelectedTemplate} disabled={!selectedTemplate}>
              テンプレートを適用
            </button>
          </section>

          <label>
            <span>何を作りたいですか？</span>
            <input value={appName} onChange={(event) => setAppName(event.target.value)} placeholder="例: StudyFlow" />
          </label>

          <label>
            <span>アプリ種別</span>
            <select value={appType} onChange={(event) => setAppType(event.target.value)}>
              <option value="">選択してください</option>
              {APP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>誰のどんな問題を解決しますか？ 対象ユーザー</span>
            <textarea value={targetUser} onChange={(event) => setTargetUser(event.target.value)} rows={3} placeholder="例: 毎日短時間で学習を進めたい社会人" />
          </label>

          <label>
            <span>解決したい問題</span>
            <textarea value={userProblem} onChange={(event) => setUserProblem(event.target.value)} rows={3} placeholder="例: 教材が散らばり、今日やることを決められない" />
          </label>

          <label>
            <span>必要な機能は何ですか？ 1行に1つ</span>
            <textarea value={keyFeaturesText} onChange={(event) => setKeyFeaturesText(event.target.value)} rows={5} placeholder={"今日の学習キュー\n進捗チェック\n復習リマインド"} />
          </label>

          <label>
            <span>作らないものを決める 1行に1つ</span>
            <textarea value={nonGoalsText} onChange={(event) => setNonGoalsText(event.target.value)} rows={4} placeholder={"外部AI API呼び出し\n課金機能\nSNS投稿"} />
          </label>

          <label>
            <span>外部連携はありますか？ 1行に1つ</span>
            <textarea value={externalIntegrationsText} onChange={(event) => setExternalIntegrationsText(event.target.value)} rows={3} placeholder="なし" />
          </label>

          <fieldset>
            <legend>必要な検証を選ぶ: どんな状態を検証しますか？</legend>
            <div className="checkbox-grid">
              {STATE_CONTRACT_OPTIONS.map((state) => (
                <label key={state} className="check-row">
                  <input
                    type="checkbox"
                    checked={stateContract.includes(state)}
                    onChange={() => setStateContract((current) => toggleItem(current, state))}
                  />
                  <span>{state}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>どの品質ゲートを通しますか？</legend>
            <div className="checkbox-grid">
              {QUALITY_GATE_OPTIONS.map((gate) => (
                <label key={gate} className="check-row">
                  <input
                    type="checkbox"
                    checked={qualityGates.includes(gate)}
                    onChange={() => setQualityGates((current) => toggleItem(current, gate))}
                  />
                  <span>{gate}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </form>

        <aside className="review-panel" aria-labelledby="review-title">
          <div className="section-heading">
            <p className="eyebrow">Readiness Review</p>
            <h2 id="review-title">{statusLabels[review.status]}</h2>
          </div>
          <meter min={0} max={100} value={review.score} aria-label="readiness score" />
          <p className="score">readiness score: {review.score}</p>

          <h3>missing fields</h3>
          {review.missingFields.length > 0 ? (
            <ul>
              {review.missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          ) : (
            <p>必須項目は揃っています。</p>
          )}

          <h3>recommended next questions</h3>
          <ul>
            {review.recommendedNextQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="verification-tracker" aria-labelledby="verification-run-title">
        <div className="section-heading">
          <p className="eyebrow">Verification Run Tracker</p>
          <h2 id="verification-run-title">Verification Run Tracker</h2>
          <p>
            AIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdのVerification Evidence / Review Record / Learning Logに接続する実行状況です。
          </p>
        </div>

        <div className={`verification-summary ${verificationReview.ready ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{verificationReview.ready ? "ready: 必要証跡が揃っています" : "not ready: failure stateがあります"}</strong>
          <span>{verificationRun.title}</span>
        </div>

        <div className="sample-actions" aria-label="Verification Runサンプル操作">
          <button type="button" className="primary-button" onClick={() => setVerificationRun(createSuccessVerificationRun())}>
            validサンプルを適用
          </button>
          <button type="button" className="secondary-button" onClick={() => setVerificationRun(createFailureVerificationRun())}>
            failureサンプルを適用
          </button>
          <button type="button" className="secondary-button" onClick={() => setVerificationRun(createEvidenceMissingVerificationRun())}>
            証跡不足サンプルを適用
          </button>
          <button type="button" className="secondary-button" onClick={() => setVerificationRun(createInitialVerificationRun())}>
            emptyサンプルを適用
          </button>
        </div>

        <div className="gate-grid">
          {verificationRun.gates.map((gate) => (
            <article key={gate.id} className={`gate-card gate-${gate.status}`} aria-label={`${gate.label} ${gate.status}`}>
              <div className="gate-card-header">
                <h3>{gate.label}</h3>
                <strong>{gate.status}</strong>
              </div>
              <dl>
                <div>
                  <dt>command</dt>
                  <dd>{gate.command}</dd>
                </div>
                <div>
                  <dt>summary</dt>
                  <dd>{gate.summary}</dd>
                </div>
                <div>
                  <dt>evidence file</dt>
                  <dd>{gate.evidenceFile || "未登録"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="evidence-grid">
          <section aria-labelledby="browser-e2e-title">
            <h3 id="browser-e2e-title">3ブラウザE2E</h3>
            <ul>
              <li>Chromium: {verificationRun.browserE2E.chromium}</li>
              <li>Firefox: {verificationRun.browserE2E.firefox}</li>
              <li>WebKit: {verificationRun.browserE2E.webkit}</li>
            </ul>
          </section>
          <section aria-labelledby="terminal-evidence-title">
            <h3 id="terminal-evidence-title">terminal evidence</h3>
            {verificationRun.terminalEvidence.length > 0 ? (
              <ul>
                {verificationRun.terminalEvidence.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            ) : (
              <p className="failure-state">terminal evidence不足</p>
            )}
          </section>
          <section aria-labelledby="screenshot-evidence-title">
            <h3 id="screenshot-evidence-title">screenshot evidence</h3>
            {verificationRun.screenshotEvidence.length > 0 ? (
              <ul>
                {verificationRun.screenshotEvidence.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            ) : (
              <p className="failure-state">screenshot evidence不足</p>
            )}
          </section>
        </div>

        <section className={`artifact-binder artifact-${artifactBinderReview.status}`} aria-labelledby="artifact-binder-title">
          <div className="section-heading">
            <p className="eyebrow">Artifact Evidence Binder</p>
            <h3 id="artifact-binder-title">Artifact Evidence Binder: {artifactBinderReview.status}</h3>
            <p>terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを同じ実行単位で判定します。</p>
          </div>

          <section className="ci-importer" aria-labelledby="ci-importer-title">
            <div className="section-heading">
              <p className="eyebrow">CI Artifact Importer</p>
              <h4 id="ci-importer-title">CI Artifact Importer: {evaluateCiArtifactImport(verificationRun.artifactBinder.ciSummary).status}</h4>
              <p>GitHub ActionsなどのCI結果を貼り付けた想定で、commit SHA、workflow、job、artifactを確認します。</p>
            </div>
            <dl aria-label="CI Artifact Importer summary">
              <div><dt>workflow</dt><dd>{verificationRun.artifactBinder.ciSummary.workflowName || "未登録"}</dd></div>
              <div><dt>commit SHA</dt><dd>{verificationRun.artifactBinder.ciSummary.commitSha || "未登録"}</dd></div>
              <div><dt>CI run URL</dt><dd>{verificationRun.artifactBinder.ciSummary.runUrl || "未登録"}</dd></div>
              <div><dt>Playwright report URL</dt><dd>{verificationRun.artifactBinder.ciSummary.playwrightReportUrl || "未登録"}</dd></div>
            </dl>
            <h5>CI jobs</h5>
            {verificationRun.artifactBinder.ciSummary.jobs.length > 0 ? <ul>{verificationRun.artifactBinder.ciSummary.jobs.map((job) => <li key={job.name}>{job.name}: {job.status}</li>)}</ul> : <p className="failure-state">CI jobs未登録</p>}
            <h5>CI artifacts</h5>
            {verificationRun.artifactBinder.ciSummary.artifacts.length > 0 ? <ul>{verificationRun.artifactBinder.ciSummary.artifacts.map((artifact) => <li key={artifact}>{artifact}</li>)}</ul> : <p className="failure-state">CI artifacts未登録</p>}
            <section className="fetch-plan" aria-labelledby="fetch-plan-title">
              <div className="section-heading">
                <p className="eyebrow">GitHub Actions Artifact Fetch Plan</p>
                <h5 id="fetch-plan-title">GitHub Actions Artifact Fetch Plan: {evaluateGitHubActionsFetchPlan(verificationRun.artifactBinder.ciSummary.fetchPlan).status}</h5>
                <p>run URLからowner / repo / run idを抽出し、jobs API、artifacts API、logs URL、必要token scopeを確認します。</p>
              </div>
              <dl aria-label="GitHub Actions Artifact Fetch Plan summary">
                <div><dt>owner</dt><dd>{verificationRun.artifactBinder.ciSummary.fetchPlan.owner || "未抽出"}</dd></div>
                <div><dt>repo</dt><dd>{verificationRun.artifactBinder.ciSummary.fetchPlan.repo || "未抽出"}</dd></div>
                <div><dt>run id</dt><dd>{verificationRun.artifactBinder.ciSummary.fetchPlan.runId || "未抽出"}</dd></div>
                <div><dt>run summary URL</dt><dd>{verificationRun.artifactBinder.ciSummary.fetchPlan.runSummaryUrl || "未生成"}</dd></div>
                <div><dt>jobs API endpoint</dt><dd>{verificationRun.artifactBinder.ciSummary.fetchPlan.jobsApiEndpoint || "未生成"}</dd></div>
                <div><dt>artifacts API endpoint</dt><dd>{verificationRun.artifactBinder.ciSummary.fetchPlan.artifactsApiEndpoint || "未生成"}</dd></div>
                <div><dt>logs URL</dt><dd>{verificationRun.artifactBinder.ciSummary.fetchPlan.logsUrl || "未生成"}</dd></div>
              </dl>
              <h6>必要token scopes</h6>
              {verificationRun.artifactBinder.ciSummary.fetchPlan.tokenScopes.length > 0 ? <ul>{verificationRun.artifactBinder.ciSummary.fetchPlan.tokenScopes.map((scope) => <li key={scope}>{scope}</li>)}</ul> : <p className="failure-state">token scope未登録</p>}
              <h6>取得予定artifact</h6>
              {verificationRun.artifactBinder.ciSummary.fetchPlan.requiredArtifacts.length > 0 ? <ul>{verificationRun.artifactBinder.ciSummary.fetchPlan.requiredArtifacts.map((artifact) => <li key={artifact}>{artifact}</li>)}</ul> : <p className="failure-state">artifact取得計画未登録</p>}
            </section>
          </section>
          <div className="binder-grid">
            <section aria-label="binder terminal evidence">
              <h4>terminal evidence</h4>
              {verificationRun.artifactBinder.terminalEvidence.length > 0 ? (
                <ul>{verificationRun.artifactBinder.terminalEvidence.map((file) => <li key={file}>{file}</li>)}</ul>
              ) : (
                <p className="failure-state">terminal evidence不足</p>
              )}
            </section>
            <section aria-label="binder screenshot evidence">
              <h4>screenshot evidence</h4>
              {verificationRun.artifactBinder.screenshotEvidence.length > 0 ? (
                <ul>{verificationRun.artifactBinder.screenshotEvidence.map((file) => <li key={file}>{file}</li>)}</ul>
              ) : (
                <p className="failure-state">screenshot evidence不足</p>
              )}
            </section>
            <section aria-label="binder ci links">
              <h4>CI / Playwright links</h4>
              <dl>
                <div>
                  <dt>CI run URL</dt>
                  <dd>{verificationRun.artifactBinder.ciRunUrl || "未登録"}</dd>
                </div>
                <div>
                  <dt>CI artifact URL</dt>
                  <dd>{verificationRun.artifactBinder.ciArtifactUrl || "未登録"}</dd>
                </div>
                <div>
                  <dt>Playwright report URL</dt>
                  <dd>{verificationRun.artifactBinder.playwrightReportUrl || "未登録"}</dd>
                </div>
                <div>
                  <dt>generated at</dt>
                  <dd>{verificationRun.artifactBinder.generatedAt || "未登録"}</dd>
                </div>
              </dl>
            </section>
          </div>
          {artifactBinderReview.issues.length > 0 ? (
            <ul className="binder-issues" aria-label="Artifact Evidence Binder issues">
              {artifactBinderReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
            </ul>
          ) : (
            <p className="applied-state">Artifact Evidence Binderはvalidです</p>
          )}
        </section>

        <section className={`repair-planner artifact-${evidenceGapRepairPlan.status}`} aria-labelledby="repair-planner-title">
          <div className="section-heading">
            <p className="eyebrow">Evidence Gap Repair Planner</p>
            <h3 id="repair-planner-title">Evidence Gap Repair Planner: {evidenceGapRepairPlan.status}</h3>
            <p>必須証跡 coverage / playwright-report / test-results / terminal-evidence / empty screenshot / valid screenshot / failure screenshot を評価します。</p>
          </div>
          <div className={`verification-summary ${evidenceGapRepairPlan.missingCount === 0 ? "is-ready" : "is-not-ready"}`} aria-live="polite">
            <strong>不足証跡: {evidenceGapRepairPlan.missingCount}件</strong>
            <span>{evidenceGapRepairPlan.missingCount === 0 ? "valid sampleは不足0件です" : "failure sampleは複数不足を修理計画へ戻します"}</span>
          </div>
          {evidenceGapRepairPlan.repairs.length > 0 ? (
            <ul className="repair-list" aria-label="Evidence Gap Repair Planner repairs">
              {evidenceGapRepairPlan.repairs.map((repair) => (
                <li key={repair.id}>
                  <strong>{repair.severity}</strong> / {repair.label}不足<br />
                  影響するAIDD-Spec artifact: {repair.affectedArtifact}<br />
                  修正指示: {repair.fixInstruction}<br />
                  再実行コマンド: {repair.rerunCommand}<br />
                  Codex prompt delta: {repair.codexPromptDelta}
                </li>
              ))}
            </ul>
          ) : (
            <p className="applied-state">Evidence Gap Repair Plannerは不足0件です</p>
          )}
        </section>
      </section>

      <section className="review-learning" aria-labelledby="review-learning-title">
        <div className="section-heading">
          <p className="eyebrow">Review & Learning Log</p>
          <h2 id="review-learning-title">Review & Learning Log</h2>
          <p>検証結果をReview Recordに採点し、次回のAI Task Packet Deltaへ戻します。</p>
        </div>
        <div className={`verification-summary ${reviewRecord.passed ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{reviewRecord.passed ? "review pass: 次回改善案を確認できます" : "review fail: 次回依頼へ戻す項目があります"}</strong>
          <span>review score: {reviewRecord.score}</span>
        </div>
        <div className="learning-grid">
          <section aria-labelledby="findings-title">
            <h3 id="findings-title">Review Findings</h3>
            <ul>
              {reviewRecord.findings.map((finding) => (
                <li key={`${finding.category}-${finding.finding}`}>
                  <strong>{finding.severity}</strong> / {finding.category}: {finding.finding}<br />
                  修正指示: {finding.fixInstruction}<br />
                  needed upstream information: {finding.neededUpstreamInfo.join(" / ")}<br />
                  verification command: {finding.verificationCommand}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="learning-log-title">
            <h3 id="learning-log-title">Learning Log</h3>
            <h4>what worked</h4>
            <ul>{learningLog.whatWorked.map((item) => <li key={item}>{item}</li>)}</ul>
            <h4>what failed</h4>
            <ul>{learningLog.whatFailed.map((item) => <li key={item}>{item}</li>)}</ul>
            <h4>spec updates needed</h4>
            <ul>{learningLog.specUpdatesNeeded.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section aria-labelledby="packet-delta-title">
            <h3 id="packet-delta-title">Next AI Task Packet Delta</h3>
            <ul>{learningLog.nextTaskPacketDelta.map((item) => <li key={item}>{item}</li>)}</ul>
            <pre>{learningLog.codexPromptDelta}</pre>
          </section>
        </div>
      </section>

      <section className="outputs" aria-label="生成結果">
        <Preview title="Generated Product Brief" content={productBrief} />
        <Preview title="Generated AI Task Packet" content={taskPacket} />
        <Preview title="Verification Plan" content={verificationPlan} />
        <Preview title="Codex Prompt" content={codexPrompt} copyable />
      </section>
    </main>
  );
}

function Preview({ title, content, copyable = false }: { title: string; content: string; copyable?: boolean }) {
  return (
    <article className="preview-card" aria-labelledby={`${title.replaceAll(" ", "-")}-title`}>
      <h2 id={`${title.replaceAll(" ", "-")}-title`}>{title}</h2>
      {copyable ? (
        <textarea aria-label="コピーできるCodex Prompt" readOnly value={content} rows={15} />
      ) : (
        <pre>{content}</pre>
      )}
    </article>
  );
}

function toggleItem<T>(items: T[], item: T): T[] {
  return items.includes(item) ? items.filter((current) => current !== item) : [...items, item];
}
