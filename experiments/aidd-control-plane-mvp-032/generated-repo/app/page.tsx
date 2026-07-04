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
  type PacketDraftWorkspaceMode,
  type PacketFileApplyPlannerMode,
  type SafePatchReviewWorkspaceMode,
  type DiffBundleRollbackEvidenceMode,
  type BundleDecisionLedgerMode,
  type DiffBundleDecisionLedgerMode,
  type AdoptedBundleExporterMode,
  type ExportedPacketPreflightReviewerMode,
  type PacketApplyCommandComposerMode,
  type CodexRunQueueMode,
  type QualityGate,
  type RunAuthorizationGateMode,
  type SpecUpdateProposalMode,
  type StateContract,
  type TaskPacketDeltaApplyPreviewMode,
  type VerificationRun,
  buildIntakeDraft,
  createEmptyTaskPacketDeltaApplyPreview,
  createEmptyDeltaDecisionReview,
  createEmptyAdoptedDeltaMarkdownExport,
  createEmptyPacketFileApplyPlanner,
  createEmptyPacketDraftWorkspace,
  createEmptySafePatchReviewWorkspace,
  createEmptyDiffBundleRollbackEvidenceWorkspace,
  createEmptyBundleDecisionLedger,
  createEmptyDiffBundleDecisionLedger,
  createEmptyAdoptedBundleExporter,
  createEmptyExportedPacketPreflightReviewer,
  createEvidenceMissingVerificationRun,
  createDogfoodPacketMarkdownReview,
  createEmptyPacketApplyCommandComposer,
  createEmptyRunAuthorizationGate,
  createEmptyCodexRunQueue,
  createFailurePacketApplyCommandComposer,
  createFailureRunAuthorizationGate,
  createFailureCodexRunQueue,
  createValidPacketApplyCommandComposer,
  createValidRunAuthorizationGate,
  createValidCodexRunQueue,
  createEmptyCiWorkflowArtifactAuditor,
  createEmptySpecUpdateProposalQueue,
  createFailureVerificationRun,
  createFailureCiWorkflowArtifactAuditor,
  createFailureTaskPacketDeltaApplyPreview,
  createFailureDeltaDecisionReview,
  createFailureAdoptedDeltaMarkdownExport,
  createFailurePacketFileApplyPlanner,
  createFailurePacketDraftWorkspace,
  createFailureSafePatchReviewWorkspace,
  createFailureDiffBundleRollbackEvidenceWorkspace,
  createFailureBundleDecisionLedger,
  createFailureDiffBundleDecisionLedger,
  createFailureAdoptedBundleExporter,
  createFailureExportedPacketPreflightReviewer,
  createFailureSpecUpdateProposalQueue,
  createInitialVerificationRun,
  createSuccessVerificationRun,
  createValidCiWorkflowArtifactAuditor,
  createValidTaskPacketDeltaApplyPreview,
  createValidDeltaDecisionReview,
  createValidAdoptedDeltaMarkdownExport,
  createValidPacketFileApplyPlanner,
  createValidPacketDraftWorkspace,
  createValidSafePatchReviewWorkspace,
  createValidDiffBundleRollbackEvidenceWorkspace,
  createValidBundleDecisionLedger,
  createValidDiffBundleDecisionLedger,
  createValidAdoptedBundleExporter,
  createValidExportedPacketPreflightReviewer,
  createValidSpecUpdateProposalQueue,
  evaluateCiArtifactImport,
  evaluateCiWorkflowArtifactAuditor,
  evaluateTaskPacketDeltaApplyPreview,
  evaluateDeltaDecisionReview,
  evaluateAdoptedDeltaMarkdownExport,
  evaluatePacketFileApplyPlanner,
  evaluatePacketDraftWorkspace,
  evaluateSafePatchReviewWorkspace,
  evaluateDiffBundleRollbackEvidenceWorkspace,
  evaluateBundleDecisionLedger,
  evaluateDiffBundleDecisionLedger,
  evaluateAdoptedBundleExporter,
  evaluateExportedPacketPreflightReviewer,
  evaluatePacketApplyCommandComposer,
  evaluateRunAuthorizationGate,
  evaluateCodexRunQueue,
  evaluateEvidenceGapRepairPlan,
  evaluateGitHubActionsFetchPlan,
  evaluateArtifactEvidenceBinder,
  evaluateReadiness,
  evaluateSpecUpdateProposalQueue,
  evaluateVerificationRun,
  generateCodexPrompt,
  generateDogfoodAppIdeaPacketSeed,
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
  const [packetFileApplyPlannerMode, setPacketFileApplyPlannerMode] = useState<PacketFileApplyPlannerMode>("empty");
  const [packetDraftWorkspaceMode, setPacketDraftWorkspaceMode] = useState<PacketDraftWorkspaceMode>("empty");
  const [safePatchReviewWorkspaceMode, setSafePatchReviewWorkspaceMode] = useState<SafePatchReviewWorkspaceMode>("empty");
  const [diffBundleRollbackEvidenceMode, setDiffBundleRollbackEvidenceMode] = useState<DiffBundleRollbackEvidenceMode>("empty");
  const [bundleDecisionLedgerMode, setBundleDecisionLedgerMode] = useState<BundleDecisionLedgerMode>("empty");
  const [diffBundleDecisionLedgerMode, setDiffBundleDecisionLedgerMode] = useState<DiffBundleDecisionLedgerMode>("empty");
  const [adoptedBundleExporterMode, setAdoptedBundleExporterMode] = useState<AdoptedBundleExporterMode>("empty");
  const [exportedPacketPreflightReviewerMode, setExportedPacketPreflightReviewerMode] = useState<ExportedPacketPreflightReviewerMode>("empty");
  const [packetApplyCommandComposerMode, setPacketApplyCommandComposerMode] = useState<PacketApplyCommandComposerMode>("empty");
  const [runAuthorizationGateMode, setRunAuthorizationGateMode] = useState<RunAuthorizationGateMode>("empty");
  const [codexRunQueueMode, setCodexRunQueueMode] = useState<CodexRunQueueMode>("empty");

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
  const dogfoodAppIdeaPacketSeed = useMemo(
    () => generateDogfoodAppIdeaPacketSeed({ appIdea: appName, templateId: selectedTemplateId }),
    [appName, selectedTemplateId]
  );
  const dogfoodPacketMarkdownReview = useMemo(
    () => createDogfoodPacketMarkdownReview(dogfoodAppIdeaPacketSeed),
    [dogfoodAppIdeaPacketSeed]
  );
  const packetApplyCommandComposer = useMemo(() => {
    if (packetApplyCommandComposerMode === "valid") return createValidPacketApplyCommandComposer(dogfoodPacketMarkdownReview);
    if (packetApplyCommandComposerMode === "failure") return createFailurePacketApplyCommandComposer();
    return createEmptyPacketApplyCommandComposer();
  }, [packetApplyCommandComposerMode, dogfoodPacketMarkdownReview]);
  const packetApplyCommandComposerReview = useMemo(() => evaluatePacketApplyCommandComposer(packetApplyCommandComposer), [packetApplyCommandComposer]);
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
  const packetFileApplyPlanner = useMemo(() => {
    if (packetFileApplyPlannerMode === "valid") return createValidPacketFileApplyPlanner(adoptedDeltaExport);
    if (packetFileApplyPlannerMode === "failure") return createFailurePacketFileApplyPlanner();
    return createEmptyPacketFileApplyPlanner();
  }, [packetFileApplyPlannerMode, adoptedDeltaExport]);
  const packetFileApplyPlannerReview = useMemo(() => evaluatePacketFileApplyPlanner(packetFileApplyPlanner), [packetFileApplyPlanner]);
  const packetDraftWorkspace = useMemo(() => {
    if (packetDraftWorkspaceMode === "valid") return createValidPacketDraftWorkspace(createValidPacketFileApplyPlanner(createValidAdoptedDeltaMarkdownExport(createValidDeltaDecisionReview())));
    if (packetDraftWorkspaceMode === "failure") return createFailurePacketDraftWorkspace();
    return createEmptyPacketDraftWorkspace();
  }, [packetDraftWorkspaceMode]);
  const packetDraftWorkspaceReview = useMemo(() => evaluatePacketDraftWorkspace(packetDraftWorkspace), [packetDraftWorkspace]);
  const safePatchReviewWorkspace = useMemo(() => {
    if (safePatchReviewWorkspaceMode === "valid") return createValidSafePatchReviewWorkspace(createValidPacketDraftWorkspace(createValidPacketFileApplyPlanner(createValidAdoptedDeltaMarkdownExport(createValidDeltaDecisionReview()))));
    if (safePatchReviewWorkspaceMode === "failure") return createFailureSafePatchReviewWorkspace();
    return createEmptySafePatchReviewWorkspace();
  }, [safePatchReviewWorkspaceMode]);
  const safePatchReviewWorkspaceReview = useMemo(() => evaluateSafePatchReviewWorkspace(safePatchReviewWorkspace), [safePatchReviewWorkspace]);
  const diffBundleRollbackEvidenceWorkspace = useMemo(() => {
    if (diffBundleRollbackEvidenceMode === "valid") return createValidDiffBundleRollbackEvidenceWorkspace(createValidSafePatchReviewWorkspace(createValidPacketDraftWorkspace(createValidPacketFileApplyPlanner(createValidAdoptedDeltaMarkdownExport(createValidDeltaDecisionReview())))));
    if (diffBundleRollbackEvidenceMode === "failure") return createFailureDiffBundleRollbackEvidenceWorkspace();
    return createEmptyDiffBundleRollbackEvidenceWorkspace();
  }, [diffBundleRollbackEvidenceMode]);
  const diffBundleRollbackEvidenceReview = useMemo(() => evaluateDiffBundleRollbackEvidenceWorkspace(diffBundleRollbackEvidenceWorkspace), [diffBundleRollbackEvidenceWorkspace]);
  const bundleDecisionLedger = useMemo(() => {
    if (bundleDecisionLedgerMode === "valid") return createValidBundleDecisionLedger(diffBundleRollbackEvidenceWorkspace);
    if (bundleDecisionLedgerMode === "failure") return createFailureBundleDecisionLedger();
    return createEmptyBundleDecisionLedger();
  }, [bundleDecisionLedgerMode, diffBundleRollbackEvidenceWorkspace]);
  const bundleDecisionLedgerReview = useMemo(() => evaluateBundleDecisionLedger(bundleDecisionLedger), [bundleDecisionLedger]);
  const diffBundleDecisionLedger = useMemo(() => {
    if (diffBundleDecisionLedgerMode === "valid") return createValidDiffBundleDecisionLedger(diffBundleRollbackEvidenceWorkspace);
    if (diffBundleDecisionLedgerMode === "failure") return createFailureDiffBundleDecisionLedger();
    return createEmptyDiffBundleDecisionLedger();
  }, [diffBundleDecisionLedgerMode, diffBundleRollbackEvidenceWorkspace]);
  const diffBundleDecisionLedgerReview = useMemo(() => evaluateDiffBundleDecisionLedger(diffBundleDecisionLedger), [diffBundleDecisionLedger]);
  const adoptedBundleExporter = useMemo(() => {
    if (adoptedBundleExporterMode === "valid") return createValidAdoptedBundleExporter(diffBundleDecisionLedger);
    if (adoptedBundleExporterMode === "failure") return createFailureAdoptedBundleExporter();
    return createEmptyAdoptedBundleExporter();
  }, [adoptedBundleExporterMode, diffBundleDecisionLedger]);
  const adoptedBundleExporterReview = useMemo(() => evaluateAdoptedBundleExporter(adoptedBundleExporter), [adoptedBundleExporter]);
  const exportedPacketPreflightReviewer = useMemo(() => {
    if (exportedPacketPreflightReviewerMode === "valid") return createValidExportedPacketPreflightReviewer(adoptedBundleExporter);
    if (exportedPacketPreflightReviewerMode === "failure") return createFailureExportedPacketPreflightReviewer();
    return createEmptyExportedPacketPreflightReviewer();
  }, [exportedPacketPreflightReviewerMode, adoptedBundleExporter]);
  const exportedPacketPreflightReview = useMemo(() => evaluateExportedPacketPreflightReviewer(exportedPacketPreflightReviewer), [exportedPacketPreflightReviewer]);
  const runAuthorizationGate = useMemo(() => {
    if (runAuthorizationGateMode === "valid") return createValidRunAuthorizationGate(exportedPacketPreflightReview);
    if (runAuthorizationGateMode === "failure") return createFailureRunAuthorizationGate();
    return createEmptyRunAuthorizationGate();
  }, [runAuthorizationGateMode, exportedPacketPreflightReview]);
  const runAuthorizationGateReview = useMemo(() => evaluateRunAuthorizationGate(runAuthorizationGate), [runAuthorizationGate]);
  const codexRunQueue = useMemo(() => {
    if (codexRunQueueMode === "valid") return createValidCodexRunQueue(runAuthorizationGateReview);
    if (codexRunQueueMode === "failure") return createFailureCodexRunQueue();
    return createEmptyCodexRunQueue();
  }, [codexRunQueueMode, runAuthorizationGateReview]);
  const codexRunQueueReview = useMemo(() => evaluateCodexRunQueue(codexRunQueue), [codexRunQueue]);
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
          <p className="eyebrow">AIDD Control Plane MVP 032</p>
          <h1 id="hero-title">MVP 032: Codex Run Queue</h1>
          <p>
            Run Authorization Gateの次段として、承認済みCodex実行をqueue化し、waiting / running / succeeded / failed / evidence_missingを追跡します。
            危険command、Firefox除外、浅い検証、証跡不足、retry/rollback不足、AIDD-Spec接続不足はReview Findingとして止めます。
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

      <section className="artifact-binder artifact-valid" aria-labelledby="dogfood-evidence-title">
        <div className="section-heading">
          <p className="eyebrow">Dogfood Evidence Binder</p>
          <h2 id="dogfood-evidence-title">キャラ収集RPG Trial 007 Evidence Binder: valid</h2>
          <p>
            100点へ収束したキャラ収集ターン制RPGのCI証跡を、次のアプリ案でも再利用できるVerification Evidenceテンプレートへ変換します。
            実在IP、ロゴ、公式素材、公式文言を使わず、run結果・artifact・画面証跡・次回AI Task Packet Deltaだけを束ねます。
          </p>
        </div>
        <div className="verification-summary is-ready" aria-live="polite">
          <strong>RPG dogfood証跡はvalidです</strong>
          <span>GitHub Actions success、coverage / playwright-report / test-results / terminal evidence、3ブラウザE2E、記事プレビューを同じ検証単位に束ねました。</span>
        </div>
        <div className="binder-grid" aria-label="RPG Trial 007 evidence binder summary">
          <section>
            <h3>CI run</h3>
            <dl>
              <div><dt>workflow</dt><dd>Character Collection RPG Trial 006 CI</dd></div>
              <div><dt>run id</dt><dd>28623614814</dd></div>
              <div><dt>conclusion</dt><dd>success</dd></div>
            </dl>
          </section>
          <section>
            <h3>required artifacts</h3>
            <ul>
              <li>character-rpg-trial006-coverage</li>
              <li>character-rpg-trial006-playwright-report</li>
              <li>character-rpg-trial006-test-results</li>
              <li>character-rpg-trial006-terminal-evidence</li>
            </ul>
          </section>
          <section>
            <h3>Verification Evidence template</h3>
            <ul>
              <li>Product Brief: 非商標・非公式素材のキャラ収集RPG体験パターン</li>
              <li>Mock backend: api / media / auth / billingの4 service</li>
              <li>Failure states: offline / timeout / media failure / auth / billing</li>
              <li>Browser Matrix: Chromium / Firefox / WebKit</li>
              <li>CI Artifact Confirmation: gh run view + artifact API</li>
            </ul>
          </section>
        </div>
        <pre aria-label="RPG Trial 008 AI Task Packet Delta">{`次回AI Task Packet Delta:
- CI成功だけで完了にせず、run id、conclusion、job、artifact API結果をVerification Evidenceへ転記する。
- coverage / playwright-report / test-results / terminal evidenceの4 artifactがexpired=falseであることを確認する。
- 商標非利用境界とmock service contractをProduct BriefとTesting Contractへ残す。
- 検証コマンド: gh run view <run-id> && gh api repos/:owner/:repo/actions/runs/<run-id>/artifacts && pnpm run test:e2e`}</pre>
      </section>

      <section className="artifact-binder artifact-valid" aria-labelledby="dogfood-reuse-planner-title">
        <div className="section-heading">
          <p className="eyebrow">Dogfood Reuse Task Packet Planner</p>
          <h2 id="dogfood-reuse-planner-title">次回アプリ案への再利用計画: valid</h2>
          <p>
            RPG dogfoodで100点へ収束した証跡を、別の「作りたいアプリ」に移すための初期AI Task Packet候補です。
            成功した結果を貼るだけではなく、非侵害境界、mock service、failure state、3ブラウザE2E、CI artifact確認を最初から依頼本文へ入れます。
          </p>
        </div>
        <div className="verification-summary is-ready" aria-live="polite">
          <strong>再利用計画はvalidです</strong>
          <span>Trial 007/008のEvidence Binderから、次回AI Task Packetの必須セクションと検証コマンドを生成できます。</span>
        </div>
        <div className="binder-grid" aria-label="Dogfood reuse planner requirements">
          <section>
            <h3>次回AI Task Packet必須セクション</h3>
            <ul>
              <li>Product Brief: 対象体験パターン、差別化ゴール、非ゴール</li>
              <li>Non-infringement Boundary: 実在IP、ロゴ、公式素材、公式文言を使わない</li>
              <li>Mock Backend Contract: api / media / auth / billingの独立service</li>
              <li>Failure State Contract: offline / timeout / media failure / anonymous / premium / billing failed</li>
              <li>Verification Evidence: terminal evidence / screenshots / CI artifacts / article preview</li>
            </ul>
          </section>
          <section>
            <h3>引き継ぐ成功証跡</h3>
            <ul>
              <li>root GitHub Actions run 28623614814: success</li>
              <li>coverage / playwright-report / test-results / terminal evidence artifact</li>
              <li>Chromium / Firefox / WebKit functional E2E</li>
              <li>Dogfood Evidence Binder screenshot</li>
            </ul>
          </section>
          <section>
            <h3>次回検証コマンド</h3>
            <ul>
              <li>lint gateを実行する</li>
              <li>typecheck gateを実行する</li>
              <li>coverage gateを実行する</li>
              <li>build gateを実行する</li>
              <li>mock doctor gateを実行する</li>
              <li>3ブラウザE2E gateを実行する</li>
              <li>gh run view &lt;run-id&gt; + artifact API確認</li>
            </ul>
          </section>
        </div>
        <pre aria-label="Dogfood reuse AI Task Packet seed">{`Dogfood reuse AI Task Packet seed:
あなたはAIDD Control Planeが生成したAI Task Packetに従い、商標非利用のアプリ体験パターンをNext.js + TypeScript + pnpmで作る。
過去dogfoodの成功証跡から、mock-api / mock-media / mock-auth / mock-billing、failure states、3ブラウザE2E、root CI artifact確認を最初から必須条件にする。
完了条件はローカルgate passだけでなく、GitHub Actions success、coverage / playwright-report / test-results / terminal evidence artifact、記事とpreview更新まで含める。
過大主張を避け、初期生成品質と最終収束品質を分けて報告する。`}</pre>
      </section>

      <section className="artifact-binder artifact-valid" aria-labelledby="dogfood-app-idea-generator-title">
        <div className="section-heading">
          <p className="eyebrow">Dogfood App Idea Packet Generator</p>
          <h2 id="dogfood-app-idea-generator-title">新規アプリ案AI Task Packet seed: {dogfoodAppIdeaPacketSeed.status}</h2>
          <p>
            画面上の「何を作りたいですか？」と選択テンプレートを、RPG dogfoodの成功証跡に重ねて、次回Codexへ渡す下書きへ変換します。
            空欄の場合も、商標非利用・mock service・failure state・3ブラウザE2E・CI artifact確認が抜けないseedを表示します。
          </p>
        </div>
        <div className="verification-summary is-ready" aria-live="polite">
          <strong>アプリ案seedはvalidです</strong>
          <span>{dogfoodAppIdeaPacketSeed.templateName} / {dogfoodAppIdeaPacketSeed.appIdea}</span>
        </div>
        <div className="binder-grid" aria-label="Dogfood app idea packet seed summary">
          <section>
            <h3>source evidence</h3>
            <ul>{dogfoodAppIdeaPacketSeed.sourceEvidence.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h3>required sections</h3>
            <ul>{dogfoodAppIdeaPacketSeed.requiredSections.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h3>mock services</h3>
            <ul>{dogfoodAppIdeaPacketSeed.mockServices.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h3>failure states</h3>
            <ul>{dogfoodAppIdeaPacketSeed.failureStates.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h3>verification commands</h3>
            <ul>{dogfoodAppIdeaPacketSeed.verificationCommands.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h3>acceptance criteria</h3>
            <ul>{dogfoodAppIdeaPacketSeed.acceptanceCriteria.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>
        <pre aria-label="Dogfood app idea generated Codex prompt seed">{dogfoodAppIdeaPacketSeed.codexPromptSeed}</pre>
      </section>

      <section className={`artifact-binder artifact-${dogfoodPacketMarkdownReview.status}`} aria-labelledby="dogfood-markdown-review-title">
        <div className="section-heading">
          <p className="eyebrow">Dogfood Packet Markdown Review</p>
          <h2 id="dogfood-markdown-review-title">Dogfood Packet Markdown Review: {dogfoodPacketMarkdownReview.status}</h2>
          <p>
            新規アプリ案seedを、AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.mdへ実ファイル反映する前のMarkdownプレビューに変換します。
            まだ書き換えず、差分サマリ、実行前チェック、検証コマンド、rollback条件を画面上で確認します。
          </p>
        </div>
        <div className={`verification-summary ${dogfoodPacketMarkdownReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{dogfoodPacketMarkdownReview.status === "valid" ? "Dogfood packet markdown reviewはvalidです" : `Dogfood packet markdown review issues: ${dogfoodPacketMarkdownReview.issues.length}件`}</strong>
          <span>{dogfoodPacketMarkdownReview.sourceAppIdea} / 対象ファイル: {dogfoodPacketMarkdownReview.files.length}件</span>
        </div>
        <div className="proposal-list file-plan-list" aria-label="Dogfood packet markdown review files">
          {dogfoodPacketMarkdownReview.files.map((file) => (
            <article className="proposal-card" key={file.targetFile} aria-label={`${file.targetFile} markdown preview`}>
              <h3>{file.targetFile}</h3>
              <dl>
                <div><dt>heading</dt><dd>{file.heading}</dd></div>
                <div><dt>diff summary</dt><dd>{file.diffSummary}</dd></div>
                <div><dt>verification command</dt><dd>{file.verificationCommand}</dd></div>
                <div><dt>rollback condition</dt><dd>{file.rollbackCondition}</dd></div>
              </dl>
              <h4>実行前チェック</h4>
              <ul>{file.preflightChecks.map((check) => <li key={check}>{check}</li>)}</ul>
              <pre aria-label={`${file.targetFile} Dogfood markdown body preview`}>{file.bodyPreview}</pre>
            </article>
          ))}
        </div>
        <article className="proposal-card" aria-label="Dogfood packet markdown review checklist">
          <h3>review checklist</h3>
          <ul>{dogfoodPacketMarkdownReview.reviewChecklist.map((check) => <li key={check}>{check}</li>)}</ul>
        </article>
        <pre aria-label="Dogfood packet markdown copy bundle">{dogfoodPacketMarkdownReview.copyBundle}</pre>
        {dogfoodPacketMarkdownReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Dogfood packet markdown review issues">
            {dogfoodPacketMarkdownReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${packetApplyCommandComposerReview.status}`} aria-labelledby="packet-apply-command-composer-title">
        <div className="section-heading">
          <p className="eyebrow">Packet Apply Command Composer</p>
          <h2 id="packet-apply-command-composer-title">Packet Apply Command Composer: {packetApplyCommandComposerReview.status}</h2>
          <p>
            Dogfood Packet Markdown Reviewで承認したMarkdownを、実ファイルへ反映する直前のapply command / dry-run / verification / rollback / evidence pathへ変換します。
            ここでも自動適用せず、未レビューMarkdownや危険なtarget pathをReview Recordへ戻します。
          </p>
        </div>
        <div className={`verification-summary ${packetApplyCommandComposerReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{packetApplyCommandComposerReview.status === "valid" ? "packet apply command composerはvalidです" : `packet apply command composer issues: ${packetApplyCommandComposerReview.issues.length}件`}</strong>
          <span>対象コマンド: {packetApplyCommandComposer.commands.length}件 / AIDD-Spec接続: {packetApplyCommandComposer.aiddSpecConnections.join(" / ") || "未接続"}</span>
        </div>
        <div className="sample-actions" aria-label="Packet Apply Command Composerサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setPacketApplyCommandComposerMode("empty")}>composer empty</button>
          <button type="button" className="primary-button" onClick={() => setPacketApplyCommandComposerMode("valid")}>composer valid</button>
          <button type="button" className="secondary-button" onClick={() => setPacketApplyCommandComposerMode("failure")}>composer failure</button>
        </div>
        {packetApplyCommandComposer.commands.length > 0 ? (
          <div className="proposal-list file-plan-list" aria-label="Packet Apply Command Composer command plans">
            {packetApplyCommandComposer.commands.map((command) => (
              <article className="proposal-card" key={command.targetFile} aria-label={`${command.targetFile} apply command plan`}>
                <h3>{command.targetFile}</h3>
                <dl>
                  <div><dt>apply command</dt><dd>{command.applyCommand || "未登録"}</dd></div>
                  <div><dt>dry-run command</dt><dd>{command.dryRunCommand || "未登録"}</dd></div>
                  <div><dt>verification command</dt><dd>{command.verificationCommand || "未登録"}</dd></div>
                  <div><dt>rollback command</dt><dd>{command.rollbackCommand || "未登録"}</dd></div>
                  <div><dt>evidence path</dt><dd>{command.evidencePath || "未登録"}</dd></div>
                  <div><dt>reviewed markdown</dt><dd>{command.reviewedMarkdown ? "承認済み" : "未レビュー"}</dd></div>
                </dl>
                <h4>実行前チェック</h4>
                <ul>{command.preflightChecks.map((check) => <li key={check}>{check}</li>)}</ul>
              </article>
            ))}
          </div>
        ) : (
          <p className="failure-state">まだapply command planはありません。composer validで承認済みMarkdownからdry-run付きの適用計画を生成します。</p>
        )}
        <pre aria-label="Packet Apply Command Composer copy Codex prompt">{packetApplyCommandComposer.copyCodexPrompt || "composer valid後にコピー用Codex promptを表示します。"}</pre>
        {packetApplyCommandComposerReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Packet Apply Command Composer issues">
            {packetApplyCommandComposerReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : packetApplyCommandComposerReview.status === "valid" ? (
          <p className="applied-state">dry-run、verification、rollback、terminal evidence pathを確認済みです。</p>
        ) : null}
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
          <span>採用したproposalを次回の手順と確認コマンドへ戻します。</span>
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

      <section className={`artifact-binder artifact-${packetFileApplyPlannerReview.status}`} aria-labelledby="packet-file-apply-planner-title">
        <div className="section-heading">
          <p className="eyebrow">Packet File Apply Planner</p>
          <h2 id="packet-file-apply-planner-title">Packet File Apply Planner: {packetFileApplyPlannerReview.status}</h2>
          <p>
            書き出したMarkdownをAI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.mdへ反映する前に、対象ファイル、Markdown見出し、before / after、insert position、verification command、rollback step、review evidenceを確認します。今回は実ファイルを自動書き換えません。
          </p>
        </div>
        <div className={`verification-summary ${packetFileApplyPlannerReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{packetFileApplyPlannerReview.status === "valid" ? "packet file apply plannerはvalidです" : `Packet File Apply Planner Review Finding: ${packetFileApplyPlannerReview.reviewFindings.length}件`}</strong>
          <span>対象ファイル計画: {packetFileApplyPlanner.filePlans.length}件 / Learning Log戻し対象: {packetFileApplyPlanner.learningLogReturns.length}件</span>
        </div>
        <div className="sample-actions" aria-label="Packet File Apply Plannerサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setPacketFileApplyPlannerMode("empty")}>planner empty</button>
          <button type="button" className="primary-button" onClick={() => setPacketFileApplyPlannerMode("valid")}>planner valid</button>
          <button type="button" className="secondary-button" onClick={() => setPacketFileApplyPlannerMode("failure")}>planner failure</button>
        </div>
        {packetFileApplyPlannerReview.status === "empty" ? (
          <p className="failure-state">まだ適用計画はありません。export validの後にplanner validで採用済みdeltaだけの対象ファイル計画を生成します。</p>
        ) : (
          <div className="proposal-list file-plan-list" aria-label="Packet File Apply Planner file plans">
            {packetFileApplyPlanner.filePlans.map((filePlan, index) => (
              <article className="proposal-card" key={`${filePlan.targetFile || "missing-target"}-${index}`}>
                <h3>{filePlan.targetFile || "target file未登録"}</h3>
                <dl>
                  <div><dt>Markdown見出し</dt><dd>{filePlan.markdownHeading || "未登録"}</dd></div>
                  <div><dt>before summary</dt><dd>{filePlan.beforeSummary || "未登録"}</dd></div>
                  <div><dt>after summary</dt><dd>{filePlan.afterSummary || "未登録"}</dd></div>
                  <div><dt>insert position</dt><dd>{filePlan.insertPosition || "未登録"}</dd></div>
                  <div><dt>verification command</dt><dd>{filePlan.verificationCommand || "未登録"}</dd></div>
                  <div><dt>rollback step</dt><dd>{filePlan.rollbackStep || "未登録"}</dd></div>
                  <div><dt>review evidence</dt><dd>{filePlan.reviewEvidence || "未登録"}</dd></div>
                  <div><dt>採用済みdelta</dt><dd>{filePlan.includedDeltaIds.length > 0 ? filePlan.includedDeltaIds.join(" / ") : "AI依頼本文には追加しない"}</dd></div>
                  <div><dt>Learning Log戻し対象</dt><dd>{filePlan.learningLogReturnIds.length > 0 ? filePlan.learningLogReturnIds.join(" / ") : "なし"}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        )}
        <article className="proposal-card" aria-label="Learning Log戻し対象">
          <h3>Learning Log戻し対象</h3>
          {packetFileApplyPlanner.learningLogReturns.length > 0 ? (
            <ul>{packetFileApplyPlanner.learningLogReturns.map((item) => <li key={item}>{item}</li>)}</ul>
          ) : (
            <p className="failure-state">却下/保留deltaの戻し対象は未登録です。</p>
          )}
        </article>
        {packetFileApplyPlannerReview.reviewFindings.length > 0 ? (
          <ul className="binder-issues" aria-label="Packet File Apply Planner Review Findings">
            {packetFileApplyPlannerReview.reviewFindings.map((finding) => <li key={finding.finding}><strong>{finding.severity}</strong> / {finding.finding}<br />修正指示: {finding.fixInstruction}<br />検証: {finding.verificationCommand}</li>)}
          </ul>
        ) : packetFileApplyPlannerReview.status === "valid" ? (
          <p className="applied-state">採用済みdeltaだけがAI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.mdの計画に入り、却下/保留deltaはLearning Log戻し対象として分離されています。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${packetDraftWorkspaceReview.status}`} aria-labelledby="packet-draft-workspace-title">
        <div className="section-heading">
          <p className="eyebrow">Packet Draft Workspace</p>
          <h2 id="packet-draft-workspace-title">Packet Draft Workspace: {packetDraftWorkspaceReview.status}</h2>
          <p>
            Packet File Apply Plannerの対象ファイル計画から、AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.mdの最終ドラフト本文を画面上で組み立てます。実ファイルはまだ書き換えず、draft body、source delta id、verification command、rollback condition、AIDD-Spec接続、未採用delta混入を確認します。
          </p>
        </div>
        <div className={`verification-summary ${packetDraftWorkspaceReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{packetDraftWorkspaceReview.status === "valid" ? "packet draft workspaceはvalidです" : `Packet Draft Workspace Review Finding: ${packetDraftWorkspaceReview.reviewFindings.length}件`}</strong>
          <span>ドラフト: {packetDraftWorkspace.drafts.length}件 / Learning Log戻し対象: {packetDraftWorkspace.learningLogReturns.length}件</span>
        </div>
        <div className="sample-actions" aria-label="Packet Draft Workspaceサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setPacketDraftWorkspaceMode("empty")}>draft empty</button>
          <button type="button" className="primary-button" onClick={() => setPacketDraftWorkspaceMode("valid")}>draft valid</button>
          <button type="button" className="secondary-button" onClick={() => setPacketDraftWorkspaceMode("failure")}>draft failure</button>
        </div>
        {packetDraftWorkspaceReview.status === "empty" ? (
          <p className="failure-state">まだドラフト本文はありません。planner validの後にdraft validで4種類の次回ファイルドラフトを生成します。</p>
        ) : (
          <div className="proposal-list file-plan-list" aria-label="Packet Draft Workspace draft files">
            {packetDraftWorkspace.drafts.map((draftFile, index) => (
              <article className="proposal-card" key={`${draftFile.targetFile || "missing-draft"}-${index}`}>
                <h3>{draftFile.targetFile || "target file未登録"}</h3>
                <dl>
                  <div><dt>draft status</dt><dd>{draftFile.draftStatus}</dd></div>
                  <div><dt>source delta id</dt><dd>{draftFile.sourceDeltaIds.length > 0 ? draftFile.sourceDeltaIds.join(" / ") : "未登録"}</dd></div>
                  <div><dt>反映されたMarkdown見出し</dt><dd>{draftFile.markdownHeadings.length > 0 ? draftFile.markdownHeadings.join(" / ") : "未登録"}</dd></div>
                  <div><dt>差分サマリ</dt><dd>{draftFile.diffSummary || "未登録"}</dd></div>
                  <div><dt>実行前チェック</dt><dd>{draftFile.preflightChecks.length > 0 ? draftFile.preflightChecks.join(" / ") : "未登録"}</dd></div>
                  <div><dt>verification command</dt><dd>{draftFile.verificationCommands.length > 0 ? draftFile.verificationCommands.join(" / ") : "未登録"}</dd></div>
                  <div><dt>rollback condition</dt><dd>{draftFile.rollbackCondition || "未登録"}</dd></div>
                  <div><dt>AIDD-Spec接続</dt><dd>{draftFile.aiddSpecConnections.length > 0 ? draftFile.aiddSpecConnections.join(" / ") : "未登録"}</dd></div>
                </dl>
                <pre aria-label={`${draftFile.targetFile || "未登録"} コピー用本文プレビュー`}>{draftFile.bodyPreview || "未登録"}</pre>
              </article>
            ))}
          </div>
        )}
        <article className="proposal-card" aria-label="コピー用Codex prompt">
          <h3>コピー用Codex prompt</h3>
          <pre>{packetDraftWorkspace.copyCodexPrompt || "未登録"}</pre>
        </article>
        {packetDraftWorkspaceReview.reviewFindings.length > 0 ? (
          <ul className="binder-issues" aria-label="Packet Draft Workspace Review Findings">
            {packetDraftWorkspaceReview.reviewFindings.map((finding) => <li key={finding.finding}><strong>{finding.severity}</strong> / {finding.finding}<br />修正指示: {finding.fixInstruction}<br />検証: {finding.verificationCommand}</li>)}
          </ul>
        ) : packetDraftWorkspaceReview.status === "valid" ? (
          <p className="applied-state">4種類のドラフト本文、コピー用Codex prompt、verification command、rollback condition、AIDD-Spec接続を確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${safePatchReviewWorkspaceReview.status}`} aria-labelledby="safe-patch-review-workspace-title">
        <div className="section-heading">
          <p className="eyebrow">Safe Patch Review Workspace</p>
          <h2 id="safe-patch-review-workspace-title">Safe Patch Review Workspace: {safePatchReviewWorkspaceReview.status}</h2>
          <p>
            Packet Draft Workspaceで確認した4種類のドラフト本文を、実ファイルへ反映する直前のpatch候補として確認します。まだ自動適用はせず、target file、source draft id、diff summary、diff size、verification command、rollback command、危険なtarget path、未採用delta混入、ローカルパス混入を止めます。
          </p>
        </div>
        <div className={`verification-summary ${safePatchReviewWorkspaceReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{safePatchReviewWorkspaceReview.status === "valid" ? "safe patch review workspaceはvalidです" : `Safe Patch Review Workspace Review Finding: ${safePatchReviewWorkspaceReview.reviewFindings.length}件`}</strong>
          <span>patch候補: {safePatchReviewWorkspace.patches.length}件 / source draft: {safePatchReviewWorkspace.sourceDraftWorkspace.drafts.length}件</span>
        </div>
        <div className="sample-actions" aria-label="Safe Patch Review Workspaceサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setSafePatchReviewWorkspaceMode("empty")}>patch empty</button>
          <button type="button" className="primary-button" onClick={() => setSafePatchReviewWorkspaceMode("valid")}>patch valid</button>
          <button type="button" className="secondary-button" onClick={() => setSafePatchReviewWorkspaceMode("failure")}>patch failure</button>
        </div>
        {safePatchReviewWorkspaceReview.status === "empty" ? (
          <p className="failure-state">まだpatch候補はありません。draft validの後にpatch validで4種類の安全なpatch候補を生成します。</p>
        ) : (
          <div className="proposal-list file-plan-list" aria-label="Safe Patch Review Workspace patch candidates">
            {safePatchReviewWorkspace.patches.map((patchCandidate, index) => (
              <article className="proposal-card" key={`${patchCandidate.patchId || "missing-patch"}-${index}`}>
                <h3>{patchCandidate.patchId || "patch id未登録"}</h3>
                <dl>
                  <div><dt>target file</dt><dd>{patchCandidate.targetFile || "未登録"}</dd></div>
                  <div><dt>source draft id</dt><dd>{patchCandidate.sourceDraftId || "未登録"}</dd></div>
                  <div><dt>diff summary</dt><dd>{patchCandidate.diffSummary || "未登録"}</dd></div>
                  <div><dt>diff size</dt><dd>追加 {patchCandidate.addedLines}行 / 削除 {patchCandidate.removedLines}行</dd></div>
                  <div><dt>risk level</dt><dd>{patchCandidate.riskLevel}</dd></div>
                  <div><dt>apply command</dt><dd>{patchCandidate.applyCommand || "未登録"}</dd></div>
                  <div><dt>verification command</dt><dd>{patchCandidate.verificationCommand || "未登録"}</dd></div>
                  <div><dt>rollback command</dt><dd>{patchCandidate.rollbackCommand || "未登録"}</dd></div>
                  <div><dt>AIDD-Spec接続</dt><dd>{patchCandidate.aiddSpecConnections.length > 0 ? patchCandidate.aiddSpecConnections.join(" / ") : "未登録"}</dd></div>
                </dl>
                <h4>reviewer checklist</h4>
                {patchCandidate.reviewerChecklist.length > 0 ? (
                  <ul>{patchCandidate.reviewerChecklist.map((item) => <li key={item}>{item}</li>)}</ul>
                ) : (
                  <p className="failure-state">reviewer checklist未登録</p>
                )}
                {patchCandidate.containsUnadoptedDelta ? <p className="failure-state">未採用delta混入あり</p> : <p className="applied-state">未採用delta混入なし</p>}
                {patchCandidate.containsLocalPath ? <p className="failure-state">ローカルパス混入あり</p> : <p className="applied-state">ローカルパス混入なし</p>}
              </article>
            ))}
          </div>
        )}
        <article className="proposal-card" aria-label="Safe Patch Review Workspace コピー用Codex prompt">
          <h3>コピー用Codex prompt</h3>
          <pre>{safePatchReviewWorkspace.copyCodexPrompt || "未登録"}</pre>
        </article>
        {safePatchReviewWorkspaceReview.reviewFindings.length > 0 ? (
          <ul className="binder-issues" aria-label="Safe Patch Review Workspace Review Findings">
            {safePatchReviewWorkspaceReview.reviewFindings.map((finding) => <li key={finding.finding}><strong>{finding.severity}</strong> / {finding.finding}<br />修正指示: {finding.fixInstruction}<br />検証: {finding.verificationCommand}</li>)}
          </ul>
        ) : safePatchReviewWorkspaceReview.status === "valid" ? (
          <p className="applied-state">4種類のpatch候補、git apply --check、verification command、rollback command、AIDD-Spec接続、ローカルパス非混入を確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${diffBundleRollbackEvidenceReview.status}`} aria-labelledby="diff-bundle-rollback-title">
        <div className="section-heading">
          <p className="eyebrow">Diff Bundle & Rollback Evidence Workspace</p>
          <h2 id="diff-bundle-rollback-title">Diff Bundle & Rollback Evidence Workspace: {diffBundleRollbackEvidenceReview.status}</h2>
          <p>
            Safe Patch Reviewで承認されたpatch候補から、source apply plan / patch id、diff bundle、before hash、after hash、dry-run結果、rollback evidence、rollback verified commandを保存する直前確認です。自動適用に進む前に、戻せる証跡、reviewer承認、公開可能な相対パスだけを許可します。
          </p>
        </div>
        <div className={`verification-summary ${diffBundleRollbackEvidenceReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{diffBundleRollbackEvidenceReview.status === "valid" ? "diff bundle rollback evidence workspaceはvalidです" : `Diff Bundle Rollback Evidence Review Finding: ${diffBundleRollbackEvidenceReview.reviewFindings.length}件`}</strong>
          <span>bundle: {diffBundleRollbackEvidenceWorkspace.bundles.length}件 / source patch: {diffBundleRollbackEvidenceWorkspace.sourceSafePatchReviewWorkspace.patches.length}件</span>
        </div>
        <div className="sample-actions" aria-label="Diff Bundle Rollback Evidence Workspaceサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setDiffBundleRollbackEvidenceMode("empty")}>bundle empty</button>
          <button type="button" className="primary-button" onClick={() => setDiffBundleRollbackEvidenceMode("valid")}>bundle valid</button>
          <button type="button" className="secondary-button" onClick={() => setDiffBundleRollbackEvidenceMode("failure")}>bundle failure</button>
        </div>
        {diffBundleRollbackEvidenceReview.status === "empty" ? (
          <p className="failure-state">まだdiff bundleはありません。patch validの後にbundle validで、dry-run結果とrollback evidenceを保存する計画を生成します。</p>
        ) : (
          <div className="proposal-list file-plan-list" aria-label="Diff Bundle Rollback Evidence Workspace bundles">
            {diffBundleRollbackEvidenceWorkspace.bundles.map((bundle, index) => (
              <article className="proposal-card" key={`${bundle.bundleId || "missing-bundle"}-${index}`}>
                <h3>{bundle.bundleId || "bundle id未登録"}</h3>
                <dl>
                  <div><dt>source apply plan / patch id</dt><dd>{bundle.sourceApplyPlanId || "未登録"} / {bundle.sourcePatchId || "未登録"}</dd></div>
                  <div><dt>target file</dt><dd>{bundle.targetFile || "未登録"}</dd></div>
                  <div><dt>before hash</dt><dd>{bundle.beforeHash || "未登録"}</dd></div>
                  <div><dt>after hash</dt><dd>{bundle.afterHash || "未登録"}</dd></div>
                  <div><dt>diff bundle path</dt><dd>{bundle.diffBundlePath || "未登録"}</dd></div>
                  <div><dt>dry-run command</dt><dd>{bundle.dryRunCommand || "未登録"}</dd></div>
                  <div><dt>dry-run status</dt><dd>{bundle.dryRunStatus}</dd></div>
                  <div><dt>rollback evidence path</dt><dd>{bundle.rollbackEvidencePath || "未登録"}</dd></div>
                  <div><dt>rollback verified command</dt><dd>{bundle.rollbackVerifiedCommand || "未登録"}</dd></div>
                  <div><dt>verification command</dt><dd>{bundle.verificationCommand || "未登録"}</dd></div>
                  <div><dt>reviewer approval</dt><dd>{bundle.reviewerApproved ? "承認済み" : "未承認"}</dd></div>
                  <div><dt>AIDD-Spec接続</dt><dd>{bundle.aiddSpecConnections.length > 0 ? bundle.aiddSpecConnections.join(" / ") : "未登録"}</dd></div>
                </dl>
                <h4>reviewer checklist</h4>
                {bundle.reviewerChecklist.length > 0 ? <ul>{bundle.reviewerChecklist.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="failure-state">reviewer checklist未登録</p>}
                {bundle.reviewerApproved ? <p className="applied-state">reviewer承認済み</p> : <p className="failure-state">reviewer未承認</p>}
                {bundle.containsLocalPath ? <p className="failure-state">ローカルパスやhost名の混入あり</p> : <p className="applied-state">ローカルパスやhost名の混入なし</p>}
                {bundle.missingRollbackEvidence ? <p className="failure-state">rollback evidence不足</p> : <p className="applied-state">rollback evidence保存済み</p>}
              </article>
            ))}
          </div>
        )}
        <article className="proposal-card" aria-label="Diff Bundle Rollback Evidence Workspace コピー用Codex prompt">
          <h3>コピー用Codex prompt</h3>
          <pre>{diffBundleRollbackEvidenceWorkspace.copyCodexPrompt || "未登録"}</pre>
        </article>
        {diffBundleRollbackEvidenceReview.reviewFindings.length > 0 ? (
          <ul className="binder-issues" aria-label="Diff Bundle Rollback Evidence Workspace Review Findings">
            {diffBundleRollbackEvidenceReview.reviewFindings.map((finding) => <li key={finding.finding}><strong>{finding.severity}</strong> / {finding.finding}<br />修正指示: {finding.fixInstruction}<br />検証: {finding.verificationCommand}</li>)}
          </ul>
        ) : diffBundleRollbackEvidenceReview.status === "valid" ? (
          <p className="applied-state">4種類のdiff bundle、dry-run成功、rollback evidence、rollback verified command、reviewer承認、AIDD-Spec接続、ローカルパスやhost名の非混入を確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${bundleDecisionLedgerReview.status}`} aria-labelledby="bundle-decision-ledger-title">
        <div className="section-heading">
          <p className="eyebrow">Bundle Decision Ledger</p>
          <h2 id="bundle-decision-ledger-title">Bundle Decision Ledger: {bundleDecisionLedgerReview.status}</h2>
          <p>
            Diff Bundleを実ファイルへ進める前後で、applied / rejected / deferredの判断、理由、適用証跡、verification evidence、rollback evidence、Review Record、Learning Log戻し先を同じ台帳に残します。自動適用より先に、判断の説明責任を検証します。
          </p>
        </div>
        <div className={`verification-summary ${bundleDecisionLedgerReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{bundleDecisionLedgerReview.status === "valid" ? "bundle decision ledgerはvalidです" : `Bundle Decision Ledger Review Finding: ${bundleDecisionLedgerReview.issues.length}件`}</strong>
          <span>applied: {bundleDecisionLedgerReview.appliedCount}件 / rejected: {bundleDecisionLedgerReview.rejectedCount}件 / deferred: {bundleDecisionLedgerReview.deferredCount}件</span>
        </div>
        <div className="sample-actions" aria-label="Bundle Decision Ledgerサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setBundleDecisionLedgerMode("empty")}>ledger empty</button>
          <button type="button" className="primary-button" onClick={() => setBundleDecisionLedgerMode("valid")}>ledger valid</button>
          <button type="button" className="secondary-button" onClick={() => setBundleDecisionLedgerMode("failure")}>ledger failure</button>
        </div>
        {bundleDecisionLedgerReview.status === "empty" ? (
          <p className="failure-state">まだbundle判断はありません。bundle validの後にledger validで、採用・却下・保留の判断と証跡保存先を生成します。</p>
        ) : (
          <div className="proposal-list file-plan-list" aria-label="Bundle Decision Ledger decisions">
            {bundleDecisionLedger.decisions.map((decision, index) => (
              <article className="proposal-card" key={`${decision.decisionId || "missing-decision"}-${index}`}>
                <h3>{decision.decisionId || "decision id未登録"}</h3>
                <dl>
                  <div><dt>bundle id</dt><dd>{decision.bundleId || "未登録"}</dd></div>
                  <div><dt>target file</dt><dd>{decision.targetFile || "未登録"}</dd></div>
                  <div><dt>decision status</dt><dd>{decision.status}</dd></div>
                  <div><dt>decision owner</dt><dd>{decision.decisionOwner || "未登録"}</dd></div>
                  <div><dt>decision reason</dt><dd>{decision.decisionReason || "未登録"}</dd></div>
                  <div><dt>decided at</dt><dd>{decision.decidedAt || "未登録"}</dd></div>
                  <div><dt>applied evidence</dt><dd>{decision.appliedEvidencePath || "未登録"}</dd></div>
                  <div><dt>verification evidence</dt><dd>{decision.verificationEvidencePath || "未登録"}</dd></div>
                  <div><dt>rollback evidence</dt><dd>{decision.rollbackEvidencePath || "未登録"}</dd></div>
                  <div><dt>review record</dt><dd>{decision.reviewRecordPath || "未登録"}</dd></div>
                  <div><dt>Learning Log</dt><dd>{decision.learningLogEntry || "未登録"}</dd></div>
                  <div><dt>Next Task Packet Delta</dt><dd>{decision.nextTaskPacketDelta || "未登録"}</dd></div>
                </dl>
                {decision.reviewerApproved ? <p className="applied-state">reviewer承認済み</p> : <p className="failure-state">reviewer未承認</p>}
                {decision.containsLocalPath ? <p className="failure-state">ローカルパスやhost名の混入あり</p> : <p className="applied-state">ローカルパスやhost名の混入なし</p>}
              </article>
            ))}
          </div>
        )}
        <article className="proposal-card" aria-label="Bundle Decision Ledger コピー用Codex prompt">
          <h3>コピー用Codex prompt</h3>
          <pre>{bundleDecisionLedger.copyCodexPrompt || "未登録"}</pre>
        </article>
        {bundleDecisionLedgerReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Bundle Decision Ledger issues">
            {bundleDecisionLedgerReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : bundleDecisionLedgerReview.status === "valid" ? (
          <p className="applied-state">applied / rejected / deferredの判断、理由、証跡path、rollback evidence、Review Record、Learning Log、次回Task Packet Delta、ローカルパス非混入を確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${diffBundleDecisionLedgerReview.status}`} aria-labelledby="diff-bundle-decision-ledger-title">
        <div className="section-heading">
          <p className="eyebrow">Diff Bundle Decision Ledger</p>
          <h2 id="diff-bundle-decision-ledger-title">Diff Bundle Decision Ledger: {diffBundleDecisionLedgerReview.status}</h2>
          <p>
            MVP028では、Diff Bundleを採用 / 却下 / 保留 / 未判断に分け、理由、証跡、rollback確認、採用済みverificationをAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdのReview Record / Verification Evidence / Learning Log / Rollback Planへ接続します。
          </p>
        </div>
        <div className={`verification-summary ${diffBundleDecisionLedgerReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{diffBundleDecisionLedgerReview.status === "valid" ? "diff bundle decision ledgerはvalidです" : `Diff Bundle Decision Ledger Review Finding: ${diffBundleDecisionLedgerReview.issues.length}件`}</strong>
          <span>adopted: {diffBundleDecisionLedgerReview.adoptedCount}件 / rejected: {diffBundleDecisionLedgerReview.rejectedCount}件 / deferred: {diffBundleDecisionLedgerReview.deferredCount}件 / undecided: {diffBundleDecisionLedgerReview.undecidedCount}件</span>
        </div>
        <div className="sample-actions" aria-label="Diff Bundle Decision Ledgerサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setDiffBundleDecisionLedgerMode("empty")}>diff decision empty</button>
          <button type="button" className="primary-button" onClick={() => setDiffBundleDecisionLedgerMode("valid")}>diff decision valid</button>
          <button type="button" className="secondary-button" onClick={() => setDiffBundleDecisionLedgerMode("failure")}>diff decision failure</button>
        </div>
        {diffBundleDecisionLedgerReview.status === "empty" ? (
          <p className="failure-state">まだDiff Bundle判断はありません。bundle validの後にdiff decision validで、判断台帳と標準接続を生成します。</p>
        ) : (
          <div className="proposal-list file-plan-list" aria-label="Diff Bundle Decision Ledger decisions">
            {diffBundleDecisionLedger.decisions.map((decision, index) => (
              <article className="proposal-card" key={`${decision.decisionId || "missing-diff-decision"}-${index}`}>
                <h3>{decision.decisionId || "decision id未登録"}</h3>
                <dl>
                  <div><dt>bundle id</dt><dd>{decision.bundleId || "未登録"}</dd></div>
                  <div><dt>target file</dt><dd>{decision.targetFile || "未登録"}</dd></div>
                  <div><dt>decision status</dt><dd>{decision.status}</dd></div>
                  <div><dt>decision owner</dt><dd>{decision.decisionOwner || "未登録"}</dd></div>
                  <div><dt>decision reason</dt><dd>{decision.decisionReason || "未登録"}</dd></div>
                  <div><dt>Review Record</dt><dd>{decision.reviewRecordPath || "未登録"}</dd></div>
                  <div><dt>Verification Evidence</dt><dd>{decision.verificationEvidencePath || "未登録"}</dd></div>
                  <div><dt>Learning Log</dt><dd>{decision.learningLogEntry || "未登録"}</dd></div>
                  <div><dt>Rollback Plan</dt><dd>{decision.rollbackPlanPath || "未登録"}</dd></div>
                  <div><dt>rollback confirmed</dt><dd>{decision.rollbackConfirmed ? "確認済み" : "未確認"}</dd></div>
                  <div><dt>adopted verification</dt><dd>{decision.adoptedVerificationCommands.length > 0 ? decision.adoptedVerificationCommands.join(" / ") : "未登録"}</dd></div>
                  <div><dt>AIDD-Spec接続</dt><dd>{decision.aiddSpecConnections.length > 0 ? decision.aiddSpecConnections.join(" / ") : "未登録"}</dd></div>
                </dl>
                {decision.containsLocalPath ? <p className="failure-state">ローカルパスやhost名の混入あり</p> : <p className="applied-state">ローカルパスやhost名の混入なし</p>}
              </article>
            ))}
          </div>
        )}
        <article className="proposal-card" aria-label="Diff Bundle Decision Ledger standard connection">
          <h3>標準接続</h3>
          <p>{diffBundleDecisionLedger.standardDocument}</p>
          <p>AIDD-Spec v0.1 / Review Record / Verification Evidence / Learning Log / Rollback Plan</p>
        </article>
        <article className="proposal-card" aria-label="Diff Bundle Decision Ledger コピー用Codex prompt">
          <h3>コピー用Codex prompt</h3>
          <pre>{diffBundleDecisionLedger.copyCodexPrompt || "未登録"}</pre>
        </article>
        {diffBundleDecisionLedgerReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Diff Bundle Decision Ledger issues">
            {diffBundleDecisionLedgerReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : diffBundleDecisionLedgerReview.status === "valid" ? (
          <p className="applied-state">未判断なし、理由、証跡、rollback確認、local path非混入、採用済みverification、標準接続を確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${adoptedBundleExporterReview.status}`} aria-labelledby="adopted-bundle-exporter-title">
        <div className="section-heading">
          <p className="eyebrow">Adopted Bundle Exporter</p>
          <h2 id="adopted-bundle-exporter-title">Adopted Bundle Exporter: {adoptedBundleExporterReview.status}</h2>
          <p>
            MVP029では、Diff Bundle Decision LedgerでadoptedになったbundleだけをAI Task Packetへ渡すexportに変換します。
            却下・保留・未判断bundle混入、review evidence不足、rollback condition不足、verification command不足、local path/host混入、AIDD-Spec接続不足を止めます。
          </p>
        </div>
        <div className={`verification-summary ${adoptedBundleExporterReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{adoptedBundleExporterReview.status === "valid" ? "adopted bundle exporterはvalidです" : `Adopted Bundle Exporter Review Finding: ${adoptedBundleExporterReview.issues.length}件`}</strong>
          <span>adopted export: {adoptedBundleExporterReview.adoptedExportCount}件 / blocked bundle: {adoptedBundleExporterReview.blockedBundleCount}件 / 標準: {adoptedBundleExporter.standardDocument}</span>
        </div>
        <div className="sample-actions" aria-label="Adopted Bundle Exporterサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setAdoptedBundleExporterMode("empty")}>exporter empty</button>
          <button type="button" className="primary-button" onClick={() => setAdoptedBundleExporterMode("valid")}>exporter valid</button>
          <button type="button" className="secondary-button" onClick={() => setAdoptedBundleExporterMode("failure")}>exporter failure</button>
        </div>
        {adoptedBundleExporterReview.status === "empty" ? (
          <p className="failure-state">まだ採用済みbundle exportはありません。diff decision validの後にexporter validで、adoptedだけを次段へ渡します。</p>
        ) : (
          <div className="proposal-list file-plan-list" aria-label="Adopted Bundle Exporter exports">
            {adoptedBundleExporter.exports.map((item, index) => (
              <article className="proposal-card" key={`${item.exportId || "missing-adopted-export"}-${index}`}>
                <h3>{item.exportId || "export id未登録"}</h3>
                <dl>
                  <div><dt>source decision</dt><dd>{item.sourceDecisionId || "未登録"}</dd></div>
                  <div><dt>source bundle</dt><dd>{item.sourceBundleId || "未登録"}</dd></div>
                  <div><dt>source status</dt><dd>{item.sourceDecisionStatus}</dd></div>
                  <div><dt>target file</dt><dd>{item.targetFile || "未登録"}</dd></div>
                  <div><dt>Review Record</dt><dd>{item.reviewEvidencePath || "未登録"}</dd></div>
                  <div><dt>Verification Evidence</dt><dd>{item.verificationEvidencePath || "未登録"}</dd></div>
                  <div><dt>verification command</dt><dd>{item.verificationCommands.length > 0 ? item.verificationCommands.join(" / ") : "未登録"}</dd></div>
                  <div><dt>Rollback Plan</dt><dd>{item.rollbackCondition || "未登録"}</dd></div>
                  <div><dt>Learning Log</dt><dd>{item.learningLogEntry || "未登録"}</dd></div>
                  <div><dt>AIDD-Spec接続</dt><dd>{item.aiddSpecConnections.length > 0 ? item.aiddSpecConnections.join(" / ") : "未登録"}</dd></div>
                </dl>
                <pre aria-label={`${item.exportId} markdown export`}>{item.markdownBody}</pre>
                {item.containsLocalPath ? <p className="failure-state">ローカルパスやhost名の混入あり</p> : <p className="applied-state">ローカルパスやhost名の混入なし</p>}
              </article>
            ))}
          </div>
        )}
        <article className="proposal-card" aria-label="Adopted Bundle Exporter standard connection">
          <h3>標準接続</h3>
          <p>{adoptedBundleExporter.standardDocument}</p>
          <p>AIDD-Spec v0.1 / AI Task Packet / Verification Evidence / Review Record / Learning Log / Rollback Plan</p>
        </article>
        <article className="proposal-card" aria-label="Adopted Bundle Exporter コピー用Codex prompt">
          <h3>コピー用Codex prompt</h3>
          <pre>{adoptedBundleExporter.copyCodexPrompt || "未登録"}</pre>
        </article>
        {adoptedBundleExporterReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Adopted Bundle Exporter issues">
            {adoptedBundleExporterReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : adoptedBundleExporterReview.status === "valid" ? (
          <p className="applied-state">adoptedのみ、review evidence、verification command、rollback condition、Learning Log、local path非混入、AIDD-Spec接続を確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${exportedPacketPreflightReview.status}`} aria-labelledby="exported-packet-preflight-title">
        <div className="section-heading">
          <p className="eyebrow">Exported Packet Preflight Reviewer</p>
          <h2 id="exported-packet-preflight-title">Exported Packet Preflight Reviewer: {exportedPacketPreflightReview.status}</h2>
          <p>
            MVP030では、export済みpacketを次工程へ渡す直前に、未採用bundle混入、Firefox除外、浅い検証、local path/host/tailnet、rollback不足、evidence不足、AIDD-Spec接続不足を検査します。
          </p>
        </div>
        <div className={`verification-summary ${exportedPacketPreflightReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{exportedPacketPreflightReview.status === "valid" ? "exported packet preflight reviewerはvalidです" : `Exported Packet Preflight Reviewer issues: ${exportedPacketPreflightReview.issues.length}件`}</strong>
          <span>ready packet: {exportedPacketPreflightReview.readyPacketCount}件 / blocked packet: {exportedPacketPreflightReview.blockedPacketCount}件</span>
        </div>
        <div className="sample-actions" aria-label="Exported Packet Preflight Reviewerサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setExportedPacketPreflightReviewerMode("empty")}>preflight empty</button>
          <button type="button" className="primary-button" onClick={() => setExportedPacketPreflightReviewerMode("valid")}>preflight valid</button>
          <button type="button" className="secondary-button" onClick={() => setExportedPacketPreflightReviewerMode("failure")}>preflight failure</button>
        </div>
        {exportedPacketPreflightReview.status === "empty" ? (
          <p className="failure-state">まだpreflight対象のexported packetはありません。exporter validの後にpreflight validで次工程へ渡せるpacketを確認します。</p>
        ) : (
          <div className="proposal-list file-plan-list" aria-label="Exported Packet Preflight Reviewer packets">
            {exportedPacketPreflightReviewer.packets.map((packet, index) => (
              <article className="proposal-card" key={`${packet.packetId || "missing-preflight"}-${index}`}>
                <h3>{packet.packetId || "packet id未登録"}</h3>
                <dl>
                  <div><dt>source export</dt><dd>{packet.sourceExportId || "未登録"}</dd></div>
                  <div><dt>source status</dt><dd>{packet.sourceDecisionStatus}</dd></div>
                  <div><dt>target file</dt><dd>{packet.targetFile || "未登録"}</dd></div>
                  <div><dt>browser projects</dt><dd>{packet.browserProjects.length > 0 ? packet.browserProjects.join(" / ") : "未登録"}</dd></div>
                  <div><dt>verification depth</dt><dd>{packet.verificationDepth}</dd></div>
                  <div><dt>evidence paths</dt><dd>{packet.evidencePaths.length > 0 ? packet.evidencePaths.join(" / ") : "未登録"}</dd></div>
                  <div><dt>rollback plan</dt><dd>{packet.rollbackPlan || "未登録"}</dd></div>
                  <div><dt>AIDD-Spec接続</dt><dd>{packet.aiddSpecConnections.length > 0 ? packet.aiddSpecConnections.join(" / ") : "未登録"}</dd></div>
                </dl>
                <pre aria-label={`${packet.packetId} preflight markdown`}>{packet.markdownBody || "未登録"}</pre>
                {packet.containsLocalPath ? <p className="failure-state">local path/host/tailnet混入あり</p> : <p className="applied-state">local path/host/tailnet混入なし</p>}
              </article>
            ))}
          </div>
        )}
        <article className="proposal-card" aria-label="Exported Packet Preflight Reviewer checklist">
          <h3>review checklist</h3>
          {exportedPacketPreflightReviewer.reviewChecklist.length > 0 ? (
            <ul>{exportedPacketPreflightReviewer.reviewChecklist.map((item) => <li key={item}>{item}</li>)}</ul>
          ) : (
            <p className="failure-state">review checklist未登録</p>
          )}
        </article>
        <article className="proposal-card" aria-label="Exported Packet Preflight Reviewer コピー用Codex prompt">
          <h3>コピー用Codex prompt</h3>
          <pre>{exportedPacketPreflightReviewer.copyCodexPrompt || "未登録"}</pre>
        </article>
        {exportedPacketPreflightReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Exported Packet Preflight Reviewer issues">
            {exportedPacketPreflightReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : exportedPacketPreflightReview.status === "valid" ? (
          <p className="applied-state">未採用bundleなし、Firefox含む3ブラウザ、標準検証、公開可能な証跡、rollback、AIDD-Spec接続を確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${runAuthorizationGateReview.status}`} aria-labelledby="run-authorization-gate-title">
        <div className="section-heading">
          <p className="eyebrow">Run Authorization Gate</p>
          <h2 id="run-authorization-gate-title">Run Authorization Gate: {runAuthorizationGateReview.status}</h2>
          <p>
            MVP031では、preflight valid後の実行許可を明示し、approver、authorization reason、Codex command、sandbox mode、検証コマンド、3ブラウザ、証跡保存先、rollback、AIDD-Spec接続が揃うまで実行を止めます。
          </p>
        </div>
        <div className={`verification-summary ${runAuthorizationGateReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{runAuthorizationGateReview.status === "valid" ? "run authorization gateはvalidです" : `Run Authorization Gate Review Finding: ${runAuthorizationGateReview.issues.length}件`}</strong>
          <span>preflight status: {runAuthorizationGate.preflightStatus} / approver: {runAuthorizationGate.approver || "未登録"}</span>
        </div>
        <div className="sample-actions" aria-label="Run Authorization Gateサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setRunAuthorizationGateMode("empty")}>empty</button>
          <button type="button" className="primary-button" onClick={() => setRunAuthorizationGateMode("valid")}>valid</button>
          <button type="button" className="secondary-button" onClick={() => setRunAuthorizationGateMode("failure")}>failure</button>
        </div>
        {runAuthorizationGateReview.status === "empty" ? (
          <p className="failure-state">まだ実行承認はありません。preflight validの後にvalidでRun Authorization Gateを確認します。</p>
        ) : (
          <div className="proposal-list file-plan-list" aria-label="Run Authorization Gate details">
            <article className="proposal-card">
              <h3>実行承認</h3>
              <dl>
                <div><dt>approver</dt><dd>{runAuthorizationGate.approver || "未登録"}</dd></div>
                <div><dt>authorization reason</dt><dd>{runAuthorizationGate.authorizationReason || "未登録"}</dd></div>
                <div><dt>Codex command</dt><dd>{runAuthorizationGate.codexCommand || "未登録"}</dd></div>
                <div><dt>sandbox mode</dt><dd>{runAuthorizationGate.sandboxMode || "未登録"}</dd></div>
                <div><dt>検証コマンド</dt><dd>{runAuthorizationGate.verificationCommands.length > 0 ? runAuthorizationGate.verificationCommands.join(" / ") : "未登録"}</dd></div>
                <div><dt>3ブラウザ</dt><dd>{runAuthorizationGate.browserProjects.length > 0 ? runAuthorizationGate.browserProjects.join(" / ") : "未登録"}</dd></div>
                <div><dt>証跡保存先</dt><dd>{runAuthorizationGate.evidencePath || "未登録"}</dd></div>
                <div><dt>rollback</dt><dd>{runAuthorizationGate.rollbackPlan || "未登録"}</dd></div>
                <div><dt>AIDD-Spec接続</dt><dd>{runAuthorizationGate.aiddSpecConnections.length > 0 ? runAuthorizationGate.aiddSpecConnections.join(" / ") : "未登録"}</dd></div>
              </dl>
            </article>
          </div>
        )}
        {runAuthorizationGate.reviewFindings.length > 0 ? (
          <article className="proposal-card" aria-label="Run Authorization Gate upstream findings">
            <h3>実行前に止めるべきReview Finding</h3>
            <ul>{runAuthorizationGate.reviewFindings.map((finding) => <li key={finding}>{finding}</li>)}</ul>
          </article>
        ) : null}
        {runAuthorizationGateReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Run Authorization Gate Review Finding">
            {runAuthorizationGateReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : runAuthorizationGateReview.status === "valid" ? (
          <p className="applied-state">実行承認、検証コマンド、3ブラウザ、証跡保存先、rollback、AIDD-Spec接続を確認済みです。</p>
        ) : null}
      </section>

      <section className={`artifact-binder artifact-${codexRunQueueReview.status}`} aria-labelledby="codex-run-queue-title">
        <div className="section-heading">
          <p className="eyebrow">Codex Run Queue</p>
          <h2 id="codex-run-queue-title">Codex Run Queue: {codexRunQueueReview.status}</h2>
          <p>
            MVP032では、Run Authorization Gate valid由来の実行だけをqueueに載せ、検証コマンド、3ブラウザ、terminal/screenshot/playwright evidence、retry/rollback、AIDD-Spec接続をqueue itemごとに確認します。
          </p>
        </div>
        <div className={`verification-summary ${codexRunQueueReview.status === "valid" ? "is-ready" : "is-not-ready"}`} aria-live="polite">
          <strong>{codexRunQueueReview.status === "valid" ? "codex run queueはvalidです" : `Codex Run Queue Review Finding: ${codexRunQueueReview.issues.length}件`}</strong>
          <span>queue item: {codexRunQueue.length}件 / source: Run Authorization Gate {runAuthorizationGateReview.status}</span>
        </div>
        <div className="sample-actions" aria-label="Codex Run Queueサンプル操作">
          <button type="button" className="secondary-button" onClick={() => setCodexRunQueueMode("empty")}>queue empty</button>
          <button type="button" className="primary-button" onClick={() => setCodexRunQueueMode("valid")}>queue valid</button>
          <button type="button" className="secondary-button" onClick={() => setCodexRunQueueMode("failure")}>queue failure</button>
        </div>
        {codexRunQueueReview.status === "empty" ? (
          <p className="failure-state">まだCodex Run Queueはありません。Run Authorization Gate validの後にqueue validで実行待ち・実行中・成功を確認します。</p>
        ) : (
          <div className="proposal-list file-plan-list" aria-label="Codex Run Queue item cards">
            {codexRunQueue.map((item) => (
              <article className="proposal-card" key={item.id} aria-label={`Codex Run Queue item ${item.status}`}>
                <h3>{item.id}: {item.status}</h3>
                <dl>
                  <div><dt>source authorization</dt><dd>{item.sourceAuthorizationId} / {item.sourceAuthorizationStatus}</dd></div>
                  <div><dt>Codex command</dt><dd>{item.codexCommand}</dd></div>
                  <div><dt>sandbox mode</dt><dd>{item.sandboxMode || "未登録"}</dd></div>
                  <div><dt>started / finished</dt><dd>{item.startedAt || "未開始"} / {item.finishedAt || "未完了"}</dd></div>
                  <div><dt>検証コマンド</dt><dd>{item.requiredVerificationCommands.join(" / ") || "未登録"}</dd></div>
                  <div><dt>実行結果</dt><dd>{item.actualVerificationResults.join(" / ") || "未実行"}</dd></div>
                  <div><dt>3ブラウザ</dt><dd>{item.browserProjects.join(" / ") || "未登録"}</dd></div>
                  <div><dt>証跡</dt><dd>{item.evidencePaths.join(" / ") || "未登録"}</dd></div>
                  <div><dt>retry policy</dt><dd>{item.retryPolicy || "未登録"}</dd></div>
                  <div><dt>rollback</dt><dd>{item.rollbackPlan || "未登録"}</dd></div>
                  <div><dt>AIDD-Spec接続</dt><dd>{item.aiddSpecConnections.join(" / ") || "未登録"}</dd></div>
                </dl>
                {item.reviewFindings.length > 0 ? <ul>{item.reviewFindings.map((finding) => <li key={finding}>{finding}</li>)}</ul> : null}
              </article>
            ))}
          </div>
        )}
        {codexRunQueueReview.issues.length > 0 ? (
          <ul className="binder-issues" aria-label="Codex Run Queue Review Finding">
            {codexRunQueueReview.issues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        ) : codexRunQueueReview.status === "valid" ? (
          <p className="applied-state">実行待ち・実行中・成功のqueue item、標準検証、3ブラウザ、証跡、retry/rollback、AIDD-Spec接続を確認済みです。</p>
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
