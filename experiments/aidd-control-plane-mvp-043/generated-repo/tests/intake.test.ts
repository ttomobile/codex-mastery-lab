import { describe, expect, it } from "vitest";
import {
  APP_TYPE_TEMPLATES,
  buildIntakeDraft,
  createDogfoodPacketMarkdownReview,
  createEmptyPacketApplyCommandComposer,
  createEmptyCiWorkflowArtifactAuditor,
  createEmptySpecUpdateProposalQueue,
  createEmptyTaskPacketDeltaApplyPreview,
  createEmptyDeltaDecisionReview,
  createEmptyAdoptedDeltaMarkdownExport,
  createEmptyPacketFileApplyPlanner,
  createEmptyPacketDraftWorkspace,
  createEmptySafePatchReviewWorkspace,
  createEmptyDiffBundleRollbackEvidenceWorkspace,
  createEmptyDiffBundleDecisionLedger,
  createEmptyAdoptedBundleExporter,
  createEmptyExportedPacketPreflightReviewer,
  createEmptyRunAuthorizationGate,
  createEmptyCodexRunQueue,
  createEmptyVerificationRunDetail,
  createEmptyEvidenceRepairDeltaGenerator,
  createEmptyRepairDeltaPriorityDecisionWorkspace,
  createEmptyExecutionPrioritySetBuilder,
  createEmptyOneRunHandoffPackReviewer,
  createEmptyCodexRunStartReceiptAuditor,
  createEmptyVerificationEvidenceReceiptBinder,
  createEmptyReviewRecordReceiptSynthesizer,
  createEmptyReviewFindingActionQueue,
  createEmptyRunResultReview,
  createEmptyNextIncrementPlan,
  createEvidenceMissingVerificationRun,
  createFailureVerificationRun,
  createFailureCiWorkflowArtifactAuditor,
  createFailureSpecUpdateProposalQueue,
  createFailureTaskPacketDeltaApplyPreview,
  createFailureDeltaDecisionReview,
  createFailureAdoptedDeltaMarkdownExport,
  createFailurePacketFileApplyPlanner,
  createFailurePacketDraftWorkspace,
  createFailureSafePatchReviewWorkspace,
  createFailureDiffBundleRollbackEvidenceWorkspace,
  createFailureDiffBundleDecisionLedger,
  createFailureAdoptedBundleExporter,
  createFailureExportedPacketPreflightReviewer,
  createFailurePacketApplyCommandComposer,
  createFailureRunAuthorizationGate,
  createFailureCodexRunQueue,
  createFailureVerificationRunDetail,
  createFailureEvidenceRepairDeltaGenerator,
  createFailureRepairDeltaPriorityDecisionWorkspace,
  createFailureExecutionPrioritySetBuilder,
  createFailureOneRunHandoffPackReviewer,
  createFailureCodexRunStartReceiptAuditor,
  createFailureVerificationEvidenceReceiptBinder,
  createFailureReviewRecordReceiptSynthesizer,
  createFailureReviewFindingActionQueue,
  createFailureRunResultReview,
  createFailureNextIncrementPlan,
  createSuccessVerificationRun,
  createValidCiWorkflowArtifactAuditor,
  createValidSpecUpdateProposalQueue,
  createValidTaskPacketDeltaApplyPreview,
  createValidDeltaDecisionReview,
  createValidAdoptedDeltaMarkdownExport,
  createValidPacketFileApplyPlanner,
  createValidPacketDraftWorkspace,
  createValidSafePatchReviewWorkspace,
  createValidDiffBundleRollbackEvidenceWorkspace,
  createValidDiffBundleDecisionLedger,
  createValidAdoptedBundleExporter,
  createValidExportedPacketPreflightReviewer,
  createValidPacketApplyCommandComposer,
  createValidRunAuthorizationGate,
  createValidCodexRunQueue,
  createValidVerificationRunDetail,
  createValidEvidenceRepairDeltaGenerator,
  createValidRepairDeltaPriorityDecisionWorkspace,
  createValidExecutionPrioritySetBuilder,
  createValidOneRunHandoffPackReviewer,
  createValidCodexRunStartReceiptAuditor,
  createValidVerificationEvidenceReceiptBinder,
  createValidReviewRecordReceiptSynthesizer,
  createValidReviewFindingActionQueue,
  createValidRunResultReview,
  createValidNextIncrementPlan,
  evaluateCiArtifactImport,
  evaluateCiWorkflowArtifactAuditor,
  evaluateTaskPacketDeltaApplyPreview,
  evaluateDeltaDecisionReview,
  evaluateAdoptedDeltaMarkdownExport,
  evaluatePacketFileApplyPlanner,
  evaluatePacketDraftWorkspace,
  evaluateSafePatchReviewWorkspace,
  evaluateDiffBundleRollbackEvidenceWorkspace,
  evaluateDiffBundleDecisionLedger,
  evaluateAdoptedBundleExporter,
  evaluateExportedPacketPreflightReviewer,
  evaluatePacketApplyCommandComposer,
  evaluateRunAuthorizationGate,
  evaluateCodexRunQueue,
  evaluateVerificationRunDetail,
  evaluateEvidenceRepairDeltaGenerator,
  evaluateRepairDeltaPriorityDecisionWorkspace,
  evaluateExecutionPrioritySetBuilder,
  evaluateOneRunHandoffPackReviewer,
  evaluateCodexRunStartReceiptAuditor,
  evaluateVerificationEvidenceReceiptBinder,
  evaluateReviewRecordReceiptSynthesizer,
  evaluateReviewFindingActionQueue,
  evaluateRunResultReview,
  evaluateNextIncrementPlan,
  evaluateEvidenceGapRepairPlan,
  evaluateGitHubActionsFetchPlan,
  evaluateArtifactEvidenceBinder,
  parseGitHubActionsRunUrl,
  evaluateReadiness,
  evaluateSpecUpdateProposalQueue,
  evaluateVerificationRun,
  generateCodexPrompt,
  generateDogfoodAppIdeaPacketSeed,
  generateLearningLog,
  generateProductBrief,
  generateReviewRecord,
  generateTaskPacket,
  generateVerificationPlan,
  type IntakeInput
} from "../src/lib/intake";

const baseInput: IntakeInput = {
  appName: "",
  appType: "",
  targetUser: "",
  userProblem: "",
  keyFeaturesText: "",
  nonGoalsText: "",
  externalIntegrationsText: "",
  stateContract: [],
  qualityGates: [],
  selectedTemplateId: "",
  appliedTemplateId: ""
};

describe("Project Intake Wizardのドメインロジック", () => {
  it("empty stateを判定できる", () => {
    const review = evaluateReadiness(buildIntakeDraft(baseInput));

    expect(review.status).toBe("empty");
    expect(review.score).toBe(0);
    expect(review.missingFields).toContain("アプリ名");
    expect(review.missingFields).toContain("テンプレート未選択");
  });

  it("テンプレート選択後に未適用failure stateを判定できる", () => {
    const review = evaluateReadiness(
      buildIntakeDraft({
        ...baseInput,
        selectedTemplateId: "learning-support"
      })
    );

    expect(review.status).toBe("insufficient");
    expect(review.missingFields).toContain("テンプレート未適用");
    expect(review.recommendedNextQuestions).toContain("選択したテンプレートを適用して初期値を反映しますか？");
  });

  it("必須項目が不足しているinsufficient stateを判定できる", () => {
    const draft = buildIntakeDraft({
      ...baseInput,
      appName: "StudyFlow",
      appType: "Webアプリ",
      targetUser: "学習を継続したい社会人",
      userProblem: "今日やる教材を決められない",
      keyFeaturesText: "今日の学習キュー",
      stateContract: ["empty"],
      qualityGates: ["lint", "typecheck", "test"]
    });

    const review = evaluateReadiness(draft);

    expect(review.status).toBe("insufficient");
    expect(review.missingFields).toEqual(expect.arrayContaining(["主要機能を2件以上", "状態契約を2件以上", "品質ゲート: build"]));
  });

  it("ready stateを判定できる", () => {
    const review = evaluateReadiness(readyDraft());

    expect(review.status).toBe("ready");
    expect(review.score).toBe(100);
    expect(review.missingFields).toHaveLength(0);
  });

  it("Packet Apply Command Composerはempty valid failureを判定できる", () => {
    const empty = evaluatePacketApplyCommandComposer(createEmptyPacketApplyCommandComposer());
    expect(empty.status).toBe("empty");

    const seed = generateDogfoodAppIdeaPacketSeed({ appIdea: "商標非利用の動画学習サービス", templateId: "video-service" });
    const review = createDogfoodPacketMarkdownReview(seed);
    const validComposer = createValidPacketApplyCommandComposer(review);
    const valid = evaluatePacketApplyCommandComposer(validComposer);
    expect(valid.status).toBe("valid");
    expect(valid.issues).toHaveLength(0);
    expect(validComposer.commands).toHaveLength(3);
    expect(validComposer.commands[0].dryRunCommand).toContain("--dry-run");
    expect(validComposer.commands[0].rollbackCommand).toContain("git checkout");
    expect(validComposer.aiddSpecConnections).toEqual(expect.arrayContaining(["AI Task Packet", "Verification Evidence", "Rollback Plan"]));

    const failure = evaluatePacketApplyCommandComposer(createFailurePacketApplyCommandComposer());
    expect(failure.status).toBe("failure");
    expect(failure.issues).toEqual(expect.arrayContaining([
      "../unsafe/CODEX_PROMPT.md: 危険なtarget path",
      "../unsafe/CODEX_PROMPT.md: rollback command不足",
      "../unsafe/CODEX_PROMPT.md: verification command不足",
      "../unsafe/CODEX_PROMPT.md: 未レビューMarkdown混入",
      "AIDD-Spec接続不足"
    ]));
  });

  it("Run Authorization Gateはempty valid failureを日本語Review Findingで判定できる", () => {
    const empty = evaluateRunAuthorizationGate(createEmptyRunAuthorizationGate());
    expect(empty.status).toBe("empty");

    const validGate = createValidRunAuthorizationGate();
    const valid = evaluateRunAuthorizationGate(validGate);
    expect(valid.status).toBe("valid");
    expect(valid.issues).toHaveLength(0);
    expect(validGate.approver).toBe("AIDD reviewer");
    expect(validGate.authorizationReason).toContain("MVP030 preflight valid");
    expect(validGate.codexCommand).toContain("codex exec");
    expect(validGate.sandboxMode).toContain("danger-full-access");
    expect(validGate.verificationCommands).toEqual(expect.arrayContaining(["pnpm run lint", "pnpm run typecheck", "pnpm run test:e2e"]));
    expect(validGate.browserProjects).toEqual(["chromium", "firefox", "webkit"]);
    expect(validGate.evidencePath).toContain("aidd-control-plane-mvp-031");
    expect(validGate.rollbackPlan).toContain("Review Record");
    expect(validGate.aiddSpecConnections).toEqual(expect.arrayContaining(["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"]));

    const failure = evaluateRunAuthorizationGate(createFailureRunAuthorizationGate());
    expect(failure.status).toBe("failure");
    expect(failure.issues).toEqual(expect.arrayContaining([
      "preflight statusがvalidでない",
      "approver不足",
      "authorization reason不足",
      "Codex command: 危険なtarget path",
      "sandbox mode不足",
      "Firefox除外",
      "shallow verification",
      "local path / host / private network / private network URL混入",
      "evidence path不足",
      "rollback plan不足",
      "Verification Evidence接続不足",
      "AIDD-Spec接続不足"
    ]));
  });

  it("Codex Run Queueはempty valid failureを日本語Review Findingで判定できる", () => {
    const empty = evaluateCodexRunQueue(createEmptyCodexRunQueue());
    expect(empty.status).toBe("empty");

    const validQueue = createValidCodexRunQueue();
    const valid = evaluateCodexRunQueue(validQueue);
    expect(valid.status).toBe("valid");
    expect(valid.issues).toHaveLength(0);
    expect(validQueue.map((item) => item.status)).toEqual(["waiting", "running", "succeeded"]);
    expect(validQueue[0].sourceAuthorizationStatus).toBe("valid");
    expect(validQueue[0].requiredVerificationCommands).toEqual(expect.arrayContaining(["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e", "pnpm run doctor:aidd", "pnpm run mock:doctor"]));
    expect(validQueue[0].browserProjects).toEqual(["chromium", "firefox", "webkit"]);
    expect(validQueue[0].evidencePaths.join("\n")).toContain("terminal");
    expect(validQueue[0].evidencePaths.join("\n")).toContain("screenshot");
    expect(validQueue[0].evidencePaths.join("\n")).toContain("playwright");
    expect(validQueue[0].retryPolicy).toContain("再実行");
    expect(validQueue[0].rollbackPlan).toContain("Run Authorization Gate");
    expect(validQueue[0].aiddSpecConnections).toEqual(expect.arrayContaining(["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"]));

    const failure = evaluateCodexRunQueue(createFailureCodexRunQueue());
    expect(failure.status).toBe("failure");
    expect(failure.issues).toEqual(expect.arrayContaining([
      "queue-mvp032-dangerous-command: Run Authorization Gate valid由来でない",
      "queue-mvp032-dangerous-command: 危険なcommand",
      "queue-mvp032-dangerous-command: sandbox mode不足",
      "queue-mvp032-dangerous-command: Firefox除外",
      "queue-mvp032-dangerous-command: 浅い検証",
      "queue-mvp032-dangerous-command: screenshot evidence不足",
      "queue-mvp032-dangerous-command: playwright evidence不足",
      "queue-mvp032-dangerous-command: retry policy不足",
      "queue-mvp032-dangerous-command: rollback不足",
      "queue-mvp032-dangerous-command: AIDD-Spec接続不足",
      "queue-mvp032-evidence-missing: screenshot evidence不足",
      "queue-mvp032-evidence-missing: playwright evidence不足"
    ]));
  });

  it("Run Result Review Synthesizerはempty valid failureを標準Review Findingで判定できる", () => {
    const empty = evaluateRunResultReview(createEmptyRunResultReview());
    expect(empty.status).toBe("empty");
    expect(empty.outcome).toBe("needs_evidence");

    const validReview = createValidRunResultReview(createValidCodexRunQueue());
    const valid = evaluateRunResultReview(validReview);
    expect(valid.status).toBe("valid");
    expect(valid.outcome).toBe("passed");
    expect(valid.score).toBe(96);
    expect(validReview.sourceRunId).toBe("queue-mvp032-succeeded");
    expect(validReview.reviewRecordLinks.join("\n")).toContain("docs/review-record.md");
    expect(validReview.learningLogEntries.join("\n")).toContain("Learning Log");
    expect(validReview.aiTaskPacketDelta.join("\n")).toContain("Run Result Review Synthesizer");
    expect(validReview.codexPromptDelta).toContain("sourceRunId");
    expect(validReview.verificationCommands).toEqual(expect.arrayContaining(["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e", "pnpm run doctor:aidd"]));
    expect(valid.findings[0]).toEqual(expect.objectContaining({
      category: "prompt_delta",
      severity: "info",
      observedBy: "Run Result Review Synthesizer",
      idealState: expect.any(String),
      fixInstruction: expect.any(String),
      neededUpstreamInfo: expect.any(Array),
      standardUpdate: expect.any(String),
      codexPromptDelta: expect.any(String),
      verification: "pnpm run doctor:aidd"
    }));

    const failure = evaluateRunResultReview(createFailureRunResultReview());
    expect(failure.status).toBe("failure");
    expect(failure.outcome).toBe("needs_evidence");
    expect(failure.findings.map((finding) => finding.category)).toEqual(expect.arrayContaining([
      "terminal_evidence",
      "screenshot_evidence",
      "browser_coverage",
      "doctor_gate",
      "rollback",
      "privacy",
      "prompt_delta"
    ]));
    expect(failure.findings.map((finding) => finding.fixInstruction).join("\n")).toContain("capture:mvp033");
    expect(failure.findings.map((finding) => finding.idealState).join("\n")).toContain("Chromium / Firefox / WebKit");
    expect(failure.findings.map((finding) => finding.codexPromptDelta).join("\n")).toContain("Firefox");
    expect(failure.findings.map((finding) => finding.standardUpdate).join("\n")).toContain("local path/host/private network");
  });

  it("Next Increment Plannerはレビュー結果を次の1インクリメント計画へ変換できる", () => {
    const empty = evaluateNextIncrementPlan(createEmptyNextIncrementPlan());
    expect(empty.status).toBe("empty");
    expect(empty.planStatus).toBe("empty");

    const validPlan = createValidNextIncrementPlan(createValidRunResultReview(createValidCodexRunQueue()));
    const valid = evaluateNextIncrementPlan(validPlan);
    expect(valid.status).toBe("valid");
    expect(valid.planStatus).toBe("ready");
    expect(valid.score).toBe(97);
    expect(validPlan.recommendedIncrement).toContain("Next Increment Planner");
    expect(validPlan.priorityReason).toContain("1単位");
    expect(validPlan.targetArtifacts).toEqual(expect.arrayContaining(["AI_TASK_PACKET.md", "CODEX_PROMPT.md"]));
    expect(validPlan.acceptanceCriteria.join("\n")).toContain("empty/valid/failure");
    expect(validPlan.requiredEvidence.join("\n")).toContain("failure screenshot");
    expect(validPlan.codexPromptDraft).toContain("1インクリメント");
    expect(valid.findings[0]).toEqual(expect.objectContaining({
      category: "priority",
      severity: "info",
      observedBy: "Next Increment Planner",
      verification: "pnpm run doctor:aidd"
    }));

    const failure = evaluateNextIncrementPlan(createFailureNextIncrementPlan());
    expect(failure.status).toBe("failure");
    expect(failure.planStatus).toBe("blocked");
    expect(failure.findings.map((finding) => finding.category)).toEqual(expect.arrayContaining([
      "source_review",
      "priority",
      "acceptance_criteria",
      "browser_coverage",
      "terminal_evidence",
      "screenshot_evidence",
      "rollback",
      "privacy"
    ]));
    expect(failure.findings.map((finding) => finding.idealState).join("\n")).toContain("Firefox");
    expect(failure.findings.map((finding) => finding.fixInstruction).join("\n")).toContain("採用停止条件");
  });

  it("Verification Runの成功サンプルは全ゲートと3ブラウザE2Eと証跡が揃う", () => {
    const verification = evaluateVerificationRun(createSuccessVerificationRun());

    expect(verification.ready).toBe(true);
    expect(verification.issues).toHaveLength(0);
  });

  it("Artifact Evidence Binderのemptyサンプルは不足証跡として判定できる", () => {
    const binder = evaluateArtifactEvidenceBinder(createEvidenceMissingVerificationRun().artifactBinder);

    expect(binder.status).toBe("empty");
    expect(binder.issues).toEqual(expect.arrayContaining(["Artifact Evidence Binder: terminal evidence不足", "Artifact Evidence Binder: CI run URLが壊れています"]));
  });

  it("Artifact Evidence BinderのvalidサンプルはCI URLとPlaywright report URLを束ねる", () => {
    const binder = createSuccessVerificationRun().artifactBinder;
    const review = evaluateArtifactEvidenceBinder(binder);

    expect(review.status).toBe("valid");
    expect(review.issues).toHaveLength(0);
    expect(binder.ciRunUrl).toContain("actions/runs/9010");
    expect(binder.ciArtifactUrl).toContain("artifacts/terminal-evidence");
    expect(binder.playwrightReportUrl).toContain("playwright/index.html");
  });

  it("Evidence Gap Repair Plannerのvalidサンプルは不足0件になる", () => {
    const plan = evaluateEvidenceGapRepairPlan(createSuccessVerificationRun());

    expect(plan.status).toBe("valid");
    expect(plan.missingCount).toBe(0);
    expect(plan.repairs).toHaveLength(0);
  });

  it("Evidence Gap Repair Plannerのfailureサンプルは複数不足と修理指示を決定的に返す", () => {
    const plan = evaluateEvidenceGapRepairPlan(createFailureVerificationRun());

    expect(plan.status).toBe("failure");
    expect(plan.missingCount).toBeGreaterThanOrEqual(4);
    expect(plan.repairs.map((repair) => repair.id)).toEqual(
      expect.arrayContaining(["playwright-report", "test-results", "terminal-evidence", "empty-screenshot", "valid-screenshot", "failure-screenshot"])
    );
    expect(plan.repairs.find((repair) => repair.id === "playwright-report")?.affectedArtifact).toContain("Browser E2E Report");
    expect(plan.repairs.find((repair) => repair.id === "playwright-report")?.rerunCommand).toBe("pnpm run test:e2e");
    expect(plan.repairs.find((repair) => repair.id === "failure-screenshot")?.codexPromptDelta).toContain("failure screenshot");
  });

  it("Artifact Evidence Binderのfailureサンプルは壊れたURL、不足証跡、古いログを返す", () => {
    const reviewRecord = generateReviewRecord(createFailureVerificationRun());
    const learningLog = generateLearningLog(reviewRecord);

    expect(reviewRecord.findings.map((finding) => finding.finding)).toEqual(
      expect.arrayContaining(["CI run URLが壊れています", "CI artifact URLが不足または壊れています", "screenshot evidence不足", "terminal evidenceが古いログです"])
    );
    expect(learningLog.nextTaskPacketDelta.join("\n")).toContain("CI run URLが壊れています");
    expect(learningLog.nextTaskPacketDelta.join("\n")).toContain("Playwright report URLが壊れています");
  });


  it("CI Artifact Importerのvalidサンプルはcommit SHA、job、artifactを検証できる", () => {
    const result = evaluateCiArtifactImport(createSuccessVerificationRun().artifactBinder.ciSummary);

    expect(result.status).toBe("valid");
    expect(result.issues).toHaveLength(0);
  });

  it("CI Artifact Importerのfailureサンプルは短いcommit SHA、失敗job、不足artifactを返す", () => {
    const result = evaluateCiArtifactImport(createFailureVerificationRun().artifactBinder.ciSummary);

    expect(result.status).toBe("failure");
    expect(result.issues).toEqual(expect.arrayContaining(["CI Artifact Importer: commit SHAが短すぎます", "CI Artifact Importer: test jobが失敗", "CI Artifact Importer: playwright-report artifactが不足しています"]));
  });

  it("GitHub Actions Artifact Fetch Planはrun URLからowner、repo、run idとAPI endpointを生成できる", () => {
    const plan = parseGitHubActionsRunUrl("https://github.example.test/aidd-lab/aidd-control-plane/actions/runs/9010");
    const result = evaluateGitHubActionsFetchPlan(plan);

    expect(result.status).toBe("valid");
    expect(plan.owner).toBe("aidd-lab");
    expect(plan.repo).toBe("aidd-control-plane");
    expect(plan.runId).toBe("9010");
    expect(plan.jobsApiEndpoint).toContain("/actions/runs/9010/jobs");
    expect(plan.artifactsApiEndpoint).toContain("/actions/runs/9010/artifacts");
    expect(plan.tokenScopes).toEqual(expect.arrayContaining(["actions:read", "contents:read"]));
    expect(plan.requiredArtifacts).toEqual(expect.arrayContaining(["coverage", "playwright-report", "test-results", "terminal-evidence"]));
  });

  it("GitHub Actions Artifact Fetch Planのfailureサンプルはrun id、token scope、artifact不足を返す", () => {
    const result = evaluateGitHubActionsFetchPlan(createFailureVerificationRun().artifactBinder.ciSummary.fetchPlan);

    expect(result.status).toBe("failure");
    expect(result.issues).toEqual(expect.arrayContaining(["GitHub Actions Fetch Plan: run idが未抽出です", "GitHub Actions Fetch Plan: actions:read token scopeが不足しています", "GitHub Actions Fetch Plan: playwright-report取得計画が不足しています"]));
  });

  it("CI Workflow Artifact Auditorのemptyサンプルはworkflowとgateとartifact不足を返す", () => {
    const audit = evaluateCiWorkflowArtifactAuditor(createEmptyCiWorkflowArtifactAuditor());

    expect(audit.status).toBe("empty");
    expect(audit.missingWorkflow).toBe(true);
    expect(audit.missingGates).toEqual(expect.arrayContaining(["pnpm run doctor:aidd", "pnpm run mock:doctor", "pnpm run test:e2e"]));
    expect(audit.missingArtifactPaths).toEqual(expect.arrayContaining(["coverage", "playwright-report", "test-results", "experiments/aidd-control-plane-mvp-019/artifacts/terminal"]));
    expect(audit.reviewFindings.map((finding) => finding.category)).toContain("CI Workflow Artifact Auditor");
  });

  it("Spec Update Proposal Queueのemptyサンプルは候補なしとして判定できる", () => {
    const review = evaluateSpecUpdateProposalQueue(createEmptySpecUpdateProposalQueue());

    expect(review.status).toBe("empty");
    expect(review.issues).toHaveLength(0);
  });

  it("Spec Update Proposal QueueのvalidサンプルはReview FindingとLearning Logから標準更新候補を作る", () => {
    const reviewRecord = generateReviewRecord(createFailureVerificationRun());
    const learningLog = generateLearningLog(reviewRecord);
    const queue = createValidSpecUpdateProposalQueue(reviewRecord, learningLog);
    const review = evaluateSpecUpdateProposalQueue(queue);
    const [proposal] = queue.proposals;

    expect(review.status).toBe("valid");
    expect(proposal.finding).toContain("e2e");
    expect(proposal.idealState).toContain("標準更新候補");
    expect(proposal.neededUpstreamInfo).toEqual(expect.arrayContaining(["Verification Evidence"]));
    expect(proposal.targetStandardDocument).toBe("standards/aidd-control-plane-mvp-v0.1.md");
    expect(proposal.targetField).toContain("spec_update_proposal");
    expect(proposal.priority).toBe("high");
    expect(proposal.acceptanceCriteria.join("\n")).toContain("acceptance criteria");
    expect(proposal.codexPromptDelta).toContain("次回のCodex Prompt Delta");
    expect(proposal.verificationCommand).toBe("pnpm run test:e2e");
  });

  it("Spec Update Proposal Queueのfailureサンプルは対象文書とacceptance criteriaとverification commandとprompt delta不足を日本語で返す", () => {
    const review = evaluateSpecUpdateProposalQueue(createFailureSpecUpdateProposalQueue());

    expect(review.status).toBe("failure");
    expect(review.issues).toEqual(
      expect.arrayContaining([
        "Spec Update Proposal 1: 対象文書が不足しています",
        "Spec Update Proposal 1: acceptance criteriaが不足しています",
        "Spec Update Proposal 1: Codex prompt deltaが不足しています",
        "Spec Update Proposal 1: verification commandが不足しています"
      ])
    );
  });

  it("AI Task Packet Delta Apply Previewのemptyサンプルは採用前として判定できる", () => {
    const review = evaluateTaskPacketDeltaApplyPreview(createEmptyTaskPacketDeltaApplyPreview());

    expect(review.status).toBe("empty");
    expect(review.issues).toEqual(
      expect.arrayContaining([
        "AI Task Packet Delta Apply Preview: 根拠finding不足",
        "AI Task Packet Delta Apply Preview: target packet section不足",
        "AI Task Packet Delta Apply Preview: verification command不足",
        "AI Task Packet Delta Apply Preview: rollback condition不足"
      ])
    );
  });

  it("AI Task Packet Delta Apply Previewのvalidサンプルは次回AI Task PacketとCodex prompt patchを生成できる", () => {
    const reviewRecord = generateReviewRecord(createFailureVerificationRun());
    const learningLog = generateLearningLog(reviewRecord);
    const queue = createValidSpecUpdateProposalQueue(reviewRecord, learningLog);
    const preview = createValidTaskPacketDeltaApplyPreview(queue);
    const review = evaluateTaskPacketDeltaApplyPreview(preview);

    expect(review.status).toBe("valid");
    expect(review.issues).toHaveLength(0);
    expect(preview.sourceProposal).toContain("e2e");
    expect(preview.targetPacketSection).toContain("spec_update_proposal");
    expect(preview.beforeSummary).toContain("次回AI Task Packet");
    expect(preview.afterSummary).toContain("rollback condition");
    expect(preview.addedAcceptanceCriteria.join("\n")).toContain("acceptance criteria");
    expect(preview.addedVerificationCommands).toEqual(expect.arrayContaining(["pnpm run test:e2e"]));
    expect(preview.codexPromptPatch).toContain("Codex prompt patch");
    expect(preview.rollbackCondition).toContain("再レビュー");
    expect(preview.reviewChecklist.join("\n")).toContain("AIDD-Spec v0.1");
  });

  it("AI Task Packet Delta Apply Previewのfailureサンプルは不足4項目を日本語で返す", () => {
    const review = evaluateTaskPacketDeltaApplyPreview(createFailureTaskPacketDeltaApplyPreview());

    expect(review.status).toBe("failure");
    expect(review.issues).toEqual([
      "AI Task Packet Delta Apply Preview: 根拠finding不足",
      "AI Task Packet Delta Apply Preview: target packet section不足",
      "AI Task Packet Delta Apply Preview: verification command不足",
      "AI Task Packet Delta Apply Preview: rollback condition不足"
    ]);
  });

  it("Delta Decision Reviewのemptyサンプルは判断待ちなしとして判定できる", () => {
    const summary = evaluateDeltaDecisionReview(createEmptyDeltaDecisionReview());

    expect(summary.status).toBe("empty");
    expect(summary.adoptedCount).toBe(0);
    expect(summary.issues).toHaveLength(0);
  });

  it("Delta Decision Reviewのvalidサンプルは採用済みdeltaだけを次回packet対象にする", () => {
    const preview = createValidTaskPacketDeltaApplyPreview(createValidSpecUpdateProposalQueue(generateReviewRecord(createFailureVerificationRun()), generateLearningLog(generateReviewRecord(createFailureVerificationRun()))));
    const summary = evaluateDeltaDecisionReview(createValidDeltaDecisionReview(preview));

    expect(summary.status).toBe("valid");
    expect(summary.adoptedCount).toBe(1);
    expect(summary.rejectedCount).toBe(1);
    expect(summary.deferredCount).toBe(1);
    expect(summary.includedInNextPacket.map((decision) => decision.deltaId)).toEqual(["delta-mvp019-001"]);
  });

  it("Delta Decision Reviewのfailureサンプルは判断者・理由・rollback・検証コマンド・再発防止不足を返す", () => {
    const summary = evaluateDeltaDecisionReview(createFailureDeltaDecisionReview());

    expect(summary.status).toBe("failure");
    expect(summary.issues).toEqual(expect.arrayContaining([
      "delta-mvp019-bad-001: 判断者不足",
      "delta-mvp019-bad-001: 判断理由不足",
      "delta-mvp019-bad-001: rollback確認不足",
      "delta-mvp019-bad-001: 採用なのにverification command不足",
      "delta-mvp019-bad-002: 却下なのに再発防止メモ不足"
    ]));
  });

  it("Packet File Apply Plannerのemptyサンプルは適用前計画なしとして判定できる", () => {
    const review = evaluatePacketFileApplyPlanner(createEmptyPacketFileApplyPlanner());

    expect(review.status).toBe("empty");
    expect(review.reviewFindings).toHaveLength(0);
  });

  it("Packet File Apply Plannerのvalidサンプルは採用済みdeltaだけを4対象ファイル計画へ含める", () => {
    const decisionReview = createValidDeltaDecisionReview();
    const exportPlan = createValidAdoptedDeltaMarkdownExport(decisionReview);
    const planner = createValidPacketFileApplyPlanner(exportPlan);
    const review = evaluatePacketFileApplyPlanner(planner);

    expect(review.status).toBe("valid");
    expect(review.reviewFindings).toHaveLength(0);
    expect(planner.filePlans.map((plan) => plan.targetFile)).toEqual(["AI_TASK_PACKET.md", "CODEX_PROMPT.md", "VERIFICATION_PLAN.md", "LEARNING_LOG.md"]);
    for (const plan of planner.filePlans) {
      expect(plan.markdownHeading).toBeTruthy();
      expect(plan.beforeSummary).toBeTruthy();
      expect(plan.afterSummary).toBeTruthy();
      expect(plan.insertPosition).toBeTruthy();
      expect(plan.verificationCommand).toMatch(/^pnpm run /);
      expect(plan.rollbackStep).toBeTruthy();
      expect(plan.reviewEvidence).toBeTruthy();
      expect(plan.includedDeltaIds).not.toEqual(expect.arrayContaining(["delta-mvp019-002", "delta-mvp019-003"]));
    }
    expect(planner.filePlans.find((plan) => plan.targetFile === "AI_TASK_PACKET.md")?.includedDeltaIds).toEqual(["delta-mvp019-001"]);
    expect(planner.filePlans.find((plan) => plan.targetFile === "LEARNING_LOG.md")?.learningLogReturnIds).toEqual(["delta-mvp019-002", "delta-mvp019-003"]);
    expect(planner.learningLogReturns.join("\n")).toContain("delta-mvp019-002: deferred");
    expect(planner.learningLogReturns.join("\n")).toContain("delta-mvp019-003: rejected");
  });

  it("Packet File Apply Plannerのfailureサンプルは不足項目と未採用delta混入をReview Findingへ変換する", () => {
    const review = evaluatePacketFileApplyPlanner(createFailurePacketFileApplyPlanner());
    const findings = review.reviewFindings.map((finding) => finding.finding);

    expect(review.status).toBe("failure");
    expect(findings).toEqual(expect.arrayContaining([
      "file plan 1: target file不足",
      "file plan 1: insert position不足",
      "file plan 1: before/after差分不足",
      "file plan 1: verification command不足",
      "file plan 1: rollback step不足",
      "file plan 1: review evidence不足",
      "file plan 1: 未採用delta delta-mvp019-bad-002 が混入しています"
    ]));
    expect(review.reviewFindings.map((finding) => finding.category)).toContain("Packet File Apply Planner");
  });

  it("CI Workflow Artifact Auditorのvalidサンプルは必須gateとartifact保存を確認できる", () => {
    const audit = evaluateCiWorkflowArtifactAuditor(createValidCiWorkflowArtifactAuditor());

    expect(audit.status).toBe("valid");
    expect(audit.reviewFindings).toHaveLength(0);
    expect(audit.aiTaskPacketDelta.join("\n")).toContain("GitHub Actions成功後");
    expect(audit.specUpdateCandidates).toEqual(expect.arrayContaining(["Verification Evidence", "Review Record", "Learning Log"]));
  });

  it("CI Workflow Artifact Auditorのfailureサンプルは不足artifactをReview FindingとAI Task Packet DeltaとAIDD-Spec更新候補に変換する", () => {
    const audit = evaluateCiWorkflowArtifactAuditor(createFailureCiWorkflowArtifactAuditor());

    expect(audit.status).toBe("failure");
    expect(audit.missingGates).toEqual(expect.arrayContaining(["pnpm run doctor:aidd", "pnpm run mock:doctor", "pnpm run test:e2e"]));
    expect(audit.missingArtifactPaths).toEqual(expect.arrayContaining(["playwright-report", "test-results"]));
    expect(audit.reviewFindings.map((finding) => finding.finding)).toEqual(expect.arrayContaining(["playwright-report artifact保存が不足", "test-results artifact保存が不足"]));
    expect(audit.aiTaskPacketDelta.join("\n")).toContain("actions/upload-artifact");
    expect(audit.specUpdateCandidates).toEqual(expect.arrayContaining(["Verification Evidence", "Review Record", "Learning Log", "Screen Inventory"]));
  });

  it("Verification Runの失敗サンプルはreadyではない", () => {
    const verification = evaluateVerificationRun(createFailureVerificationRun());

    expect(verification.ready).toBe(false);
    expect(verification.issues).toEqual(expect.arrayContaining(["Verification Run: e2eが失敗", "Verification Run: doctor:aiddが失敗", "3ブラウザE2E: webkitが失敗"]));
  });

  it("Verification Runの証跡不足サンプルはコマンド成功後もreadyではない", () => {
    const verification = evaluateVerificationRun(createEvidenceMissingVerificationRun());

    expect(verification.ready).toBe(false);
    expect(verification.issues).toEqual(
      expect.arrayContaining(["Verification Run: e2eが証跡不足", "Verification Evidence: e2eのevidence file不足", "Verification Evidence: terminal evidence不足"])
    );
  });

  it("App Type Templatesを4件以上持ち、各テンプレートにリスクと証跡要件がある", () => {
    expect(APP_TYPE_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    expect(APP_TYPE_TEMPLATES.map((template) => template.name)).toEqual(expect.arrayContaining(["動画サービス風", "学習支援", "予約管理", "社内申請"]));
    for (const template of APP_TYPE_TEMPLATES) {
      expect(template.recommendedFeatures.length).toBeGreaterThanOrEqual(2);
      expect(template.stateContract.length).toBeGreaterThanOrEqual(2);
      expect(template.qualityGates).toEqual(expect.arrayContaining(["lint", "typecheck", "test", "build"]));
      expect(template.risks.length).toBeGreaterThanOrEqual(1);
      expect(template.evidenceRequirements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("Generated Product Briefにアプリ名、対象ユーザー、非ゴールが含まれる", () => {
    const brief = generateProductBrief(readyDraft());

    expect(brief).toContain("StudyFlow");
    expect(brief).toContain("学習を継続したい社会人");
    expect(brief).toContain("課金機能");
    expect(brief).toContain("学習支援");
    expect(brief).toContain("offline時の進捗保存方針");
    expect(brief).toContain("offline / timeout状態の画面証跡");
    expect(brief).toContain("Verification Evidence / Review Record / Learning Log");
    expect(brief).toContain("terminal evidence");
  });

  it("AI Task PacketとVerification Planにテンプレート名、リスク、証跡要件、Verification Runが含まれる", () => {
    const taskPacket = generateTaskPacket(readyDraft());
    const verificationPlan = generateVerificationPlan(readyDraft());

    expect(taskPacket).toContain('app_type_template: "学習支援"');
    expect(taskPacket).toContain("template_risks");
    expect(taskPacket).toContain("evidence_requirements");
    expect(taskPacket).toContain("verification_run");
    expect(taskPacket).toContain("artifact_evidence_binder");
    expect(taskPacket).toContain("evidence_gap_repair_planner");
    expect(taskPacket).toContain("browser_e2e");
    expect(taskPacket).toContain("ci_run_url");
    expect(verificationPlan).toContain("学習支援");
    expect(verificationPlan).toContain("offline / timeout状態の画面証跡");
    expect(verificationPlan).toContain("Verification Run Tracker");
    expect(verificationPlan).toContain("Review Record");
    expect(verificationPlan).toContain("Learning Log");
    expect(verificationPlan).toContain("Evidence Gap Repair Planner");
    expect(taskPacket).toContain("ci_artifact_importer");
  });

  it("Review RecordとLearning Logが失敗を次回AI Task Packet Deltaへ戻す", () => {
    const reviewRecord = generateReviewRecord(createFailureVerificationRun(), ["offline時の進捗保存方針が曖昧になる"]);
    const learningLog = generateLearningLog(reviewRecord);

    expect(reviewRecord.passed).toBe(false);
    expect(reviewRecord.findings.map((finding) => finding.finding)).toEqual(expect.arrayContaining(["e2eが失敗", "doctor:aiddが失敗", "webkit E2Eが失敗"]));
    expect(learningLog.specUpdatesNeeded).toEqual(expect.arrayContaining(["Verification Evidence", "Test Plan"]));
    expect(learningLog.codexPromptDelta).toContain("次回のCodex Prompt Delta");
    expect(learningLog.nextTaskPacketDelta.join("\n")).toContain("pnpm run test:e2e");
    expect(learningLog.nextTaskPacketDelta.join("\n")).toContain("playwright-report");
  });

  it("成功サンプルでも残リスクと次回改善案を出せる", () => {
    const reviewRecord = generateReviewRecord(createSuccessVerificationRun());
    const learningLog = generateLearningLog(reviewRecord);

    expect(reviewRecord.passed).toBe(true);
    expect(reviewRecord.score).toBe(100);
    expect(reviewRecord.remainingRisks.join("\n")).toContain("CI連携前");
    expect(learningLog.nextTaskPacketDelta.join("\n")).toContain("CIでも実行");
  });

  it("Generated Codex Promptに品質ゲートと状態契約が含まれる", () => {
    const prompt = generateCodexPrompt(readyDraft());

    expect(prompt).toContain("lint");
    expect(prompt).toContain("typecheck");
    expect(prompt).toContain("empty");
    expect(prompt).toContain("offline");
    expect(prompt).toContain("学習支援");
    expect(prompt).toContain("リスク");
    expect(prompt).toContain("証跡要件");
    expect(prompt).toContain("Verification Run");
    expect(prompt).toContain("screenshot evidence");
    expect(prompt).toContain("Artifact Evidence Binder");
    expect(prompt).toContain("CI Artifact Importer");
    expect(prompt).toContain("Evidence Gap Repair Planner");
  });

  it("Adopted Delta Markdown Exporterのemptyサンプルは書き出し待ちとして判定できる", () => {
    const review = evaluateAdoptedDeltaMarkdownExport(createEmptyAdoptedDeltaMarkdownExport());

    expect(review.status).toBe("empty");
    expect(review.issues).toContain("Adopted Delta Markdown Exporter: Markdown section不足");
  });

  it("Adopted Delta Markdown Exporterのvalidサンプルは採用済みdeltaだけをMarkdownへ入れる", () => {
    const exportPlan = createValidAdoptedDeltaMarkdownExport(createValidDeltaDecisionReview());
    const review = evaluateAdoptedDeltaMarkdownExport(exportPlan);

    expect(review.status).toBe("valid");
    expect(exportPlan.markdownSection).toContain("delta-mvp019-001");
    expect(exportPlan.markdownSection).not.toContain("delta-mvp019-002");
    expect(exportPlan.learningLogReturns.join("\n")).toContain("delta-mvp019-002");
    expect(exportPlan.codexPromptPatch).toContain("採用済みdeltaだけを次回AI Task Packetへ反映");
  });

  it("Adopted Delta Markdown Exporterのfailureサンプルは未採用delta混入と証跡不足を返す", () => {
    const review = evaluateAdoptedDeltaMarkdownExport(createFailureAdoptedDeltaMarkdownExport());

    expect(review.status).toBe("failure");
    expect(review.issues).toEqual(expect.arrayContaining([
      "Adopted Delta Markdown Exporter: verification command不足",
      "Adopted Delta Markdown Exporter: rollback condition不足",
      "Adopted Delta Markdown Exporter: review evidence不足",
      "Adopted Delta Markdown Exporter: 未採用delta delta-mvp019-bad-002 が混入しています"
    ]));
  });

  it("Packet Draft Workspaceのemptyサンプルはドラフト前として判定できる", () => {
    const review = evaluatePacketDraftWorkspace(createEmptyPacketDraftWorkspace());

    expect(review.status).toBe("empty");
    expect(review.reviewFindings).toHaveLength(0);
  });

  it("Packet Draft Workspaceのvalidサンプルは4種類の次回ファイルドラフトとコピー用Codex promptを生成できる", () => {
    const workspace = createValidPacketDraftWorkspace();
    const review = evaluatePacketDraftWorkspace(workspace);

    expect(review.status).toBe("valid");
    expect(review.reviewFindings).toHaveLength(0);
    expect(workspace.drafts.map((draft) => draft.targetFile)).toEqual(["AI_TASK_PACKET.md", "CODEX_PROMPT.md", "VERIFICATION_PLAN.md", "LEARNING_LOG.md"]);
    expect(workspace.drafts.find((draft) => draft.targetFile === "AI_TASK_PACKET.md")?.bodyPreview).toContain("AIDD-Spec接続");
    expect(workspace.drafts.find((draft) => draft.targetFile === "CODEX_PROMPT.md")?.bodyPreview).toContain("rollback condition");
    expect(workspace.copyCodexPrompt).toContain("AIDD-Spec v0.1");
    expect(workspace.copyCodexPrompt).toContain("rollback condition");
    expect(workspace.learningLogReturns.join("\n")).toContain("delta-mvp019-002");
  });

  it("Packet Draft Workspaceのfailureサンプルは本文不足・重複・未採用delta混入をReview Findingへ変換する", () => {
    const review = evaluatePacketDraftWorkspace(createFailurePacketDraftWorkspace());
    const findings = review.reviewFindings.map((finding) => finding.finding);

    expect(review.status).toBe("failure");
    expect(findings).toEqual(expect.arrayContaining([
      "AI_TASK_PACKET.md: draft body不足",
      "AI_TASK_PACKET.md: verification command不足",
      "AI_TASK_PACKET.md: rollback condition不足",
      "AI_TASK_PACKET.md: AIDD-Spec接続不足",
      "AI_TASK_PACKET.md: 未採用delta delta-mvp019-bad-002 が混入しています",
      "AI_TASK_PACKET.md: file target重複または衝突",
      "AI_TASK_PACKET.md: source delta id不足",
      "コピー用Codex prompt: rollback condition不足"
    ]));
    expect(review.reviewFindings.map((finding) => finding.category)).toContain("Packet Draft Workspace");
  });

  it("Safe Patch Review Workspaceのemptyサンプルはpatch候補前として判定できる", () => {
    const review = evaluateSafePatchReviewWorkspace(createEmptySafePatchReviewWorkspace());

    expect(review.status).toBe("empty");
    expect(review.reviewFindings).toHaveLength(0);
  });

  it("Safe Patch Review Workspaceのvalidサンプルは4種類のpatch候補とrollback commandを生成できる", () => {
    const workspace = createValidSafePatchReviewWorkspace();
    const review = evaluateSafePatchReviewWorkspace(workspace);

    expect(review.status).toBe("valid");
    expect(review.reviewFindings).toHaveLength(0);
    expect(workspace.patches.map((patch) => patch.targetFile)).toEqual(["AI_TASK_PACKET.md", "CODEX_PROMPT.md", "VERIFICATION_PLAN.md", "LEARNING_LOG.md"]);
    expect(workspace.patches[0].applyCommand).toContain("git apply --check");
    expect(workspace.patches[0].rollbackCommand).toContain("git checkout -- AI_TASK_PACKET.md");
    expect(workspace.copyCodexPrompt).toContain("AIDD-Spec v0.1");
  });

  it("Safe Patch Review Workspaceのfailureサンプルは危険なpath・diff過大・ローカルパス混入をReview Findingへ変換する", () => {
    const review = evaluateSafePatchReviewWorkspace(createFailureSafePatchReviewWorkspace());
    const findings = review.reviewFindings.map((finding) => finding.finding);

    expect(review.status).toBe("failure");
    expect(findings).toEqual(expect.arrayContaining([
      "patch 1: target file不足",
      "patch 1: diff size過大",
      "patch 1: verification command不足",
      "patch 1: rollback command不足",
      "patch 1: 未採用delta混入",
      "patch 1: ローカルパス混入",
      "safe-patch-bad-002: 危険なtarget path",
      "safe-patch-bad-002: AIDD-Spec接続不足"
    ]));
    expect(review.reviewFindings.map((finding) => finding.category)).toContain("Safe Patch Review Workspace");
  });

  it("Diff Bundle Rollback Evidence Workspaceのemptyサンプルはbundle作成前として判定できる", () => {
    const review = evaluateDiffBundleRollbackEvidenceWorkspace(createEmptyDiffBundleRollbackEvidenceWorkspace());

    expect(review.status).toBe("empty");
    expect(review.reviewFindings).toHaveLength(0);
  });

  it("Diff Bundle Rollback Evidence Workspaceのvalidサンプルはdry-run成功とrollback evidenceとreviewer承認を生成できる", () => {
    const workspace = createValidDiffBundleRollbackEvidenceWorkspace();
    const review = evaluateDiffBundleRollbackEvidenceWorkspace(workspace);

    expect(review.status).toBe("valid");
    expect(review.reviewFindings).toHaveLength(0);
    expect(workspace.bundles.map((bundle) => bundle.targetFile)).toEqual(["AI_TASK_PACKET.md", "CODEX_PROMPT.md", "VERIFICATION_PLAN.md", "LEARNING_LOG.md"]);
    expect(workspace.bundles[0].bundleId).toBe("diff-bundle-mvp027-001");
    expect(workspace.bundles[0].sourceApplyPlanId).toBe("apply-plan-mvp027-001");
    expect(workspace.bundles[0].sourcePatchId).toBe("safe-patch-mvp023-001");
    expect(workspace.bundles[0].diffBundlePath).toContain("artifacts/diff-bundles/mvp027");
    expect(workspace.bundles[0].dryRunStatus).toBe("成功");
    expect(workspace.bundles[0].rollbackEvidencePath).toContain("artifacts/rollback/mvp027");
    expect(workspace.bundles[0].reviewerApproved).toBe(true);
    expect(workspace.copyCodexPrompt).toContain("rollback evidence");
    expect(workspace.copyCodexPrompt).toContain("AIDD-Spec v0.1");
  });

  it("Diff Bundle Rollback Evidence Workspaceのfailureサンプルは危険path・dry-run失敗・rollback不足・未承認をReview Findingへ変換する", () => {
    const review = evaluateDiffBundleRollbackEvidenceWorkspace(createFailureDiffBundleRollbackEvidenceWorkspace());
    const findings = review.reviewFindings.map((finding) => finding.finding);

    expect(review.status).toBe("failure");
    expect(findings).toEqual(expect.arrayContaining([
      "bundle 1: bundle id不足",
      "bundle 1: source apply plan不足",
      "bundle 1: dry-run未実行",
      "bundle 1: dry-run未成功",
      "bundle 1: rollback evidence不足",
      "bundle 1: verification command不足",
      "bundle 1: reviewer未承認",
      "bundle 1: ローカルパスやhost名の混入",
      "diff-bundle-bad-002: 危険なtarget path（../）",
      "diff-bundle-bad-002: 危険なtarget path",
      "diff-bundle-bad-002: after hash不足",
      "diff-bundle-bad-002: rollback verified command不足",
      "diff-bundle-bad-002: reviewer未承認",
      "diff-bundle-bad-002: AIDD-Spec接続不足",
      "diff-bundle-bad-003: 危険なtarget path（絶対パス）",
      "diff-bundle-bad-003: verification command不足"
    ]));
    expect(review.reviewFindings.map((finding) => finding.category)).toContain("Diff Bundle & Rollback Evidence Workspace");
  });

  it("Diff Bundle Decision Ledgerのemptyサンプルは判断前として判定できる", () => {
    const review = evaluateDiffBundleDecisionLedger(createEmptyDiffBundleDecisionLedger());

    expect(review.status).toBe("empty");
    expect(review.issues).toHaveLength(0);
    expect(review.undecidedCount).toBe(0);
  });

  it("Diff Bundle Decision Ledgerのvalidサンプルは標準接続と採用済みverificationを持つ", () => {
    const ledger = createValidDiffBundleDecisionLedger(createValidDiffBundleRollbackEvidenceWorkspace());
    const review = evaluateDiffBundleDecisionLedger(ledger);

    expect(review.status).toBe("valid");
    expect(review.issues).toHaveLength(0);
    expect(review.adoptedCount).toBe(1);
    expect(review.rejectedCount).toBe(1);
    expect(review.deferredCount).toBe(1);
    expect(ledger.standardDocument).toBe("standards/aidd-control-plane-mvp-v0.1.md");
    expect(ledger.decisions[0].aiddSpecConnections).toEqual(expect.arrayContaining(["Review Record", "Verification Evidence", "Learning Log", "Rollback Plan"]));
    expect(ledger.decisions[0].adoptedVerificationCommands).toEqual(expect.arrayContaining(["pnpm run doctor:aidd"]));
    expect(ledger.copyCodexPrompt).toContain("AIDD-Spec v0.1");
  });

  it("Diff Bundle Decision Ledgerのfailureサンプルは未判断、理由不足、証跡不足、rollback未確認、local path、採用済みverification不足を検出する", () => {
    const review = evaluateDiffBundleDecisionLedger(createFailureDiffBundleDecisionLedger());

    expect(review.status).toBe("failure");
    expect(review.issues).toEqual(expect.arrayContaining([
      "diff-decision-bad-001: 未判断",
      "diff-decision-bad-001: 理由不足",
      "diff-decision-bad-001: 証跡不足",
      "diff-decision-bad-001: rollback未確認",
      "diff-decision-bad-001: ローカルパスやhost名の混入",
      "diff-decision-bad-002: 採用済みverification不足"
    ]));
  });

  it("Adopted Bundle Exporterのemptyサンプルはexport前として判定できる", () => {
    const review = evaluateAdoptedBundleExporter(createEmptyAdoptedBundleExporter());

    expect(review.status).toBe("empty");
    expect(review.issues).toHaveLength(0);
    expect(review.adoptedExportCount).toBe(0);
  });

  it("Adopted Bundle Exporterのvalidサンプルは採用済みbundleだけをAIDD-Specへ接続してexportする", () => {
    const exporter = createValidAdoptedBundleExporter(createValidDiffBundleDecisionLedger(createValidDiffBundleRollbackEvidenceWorkspace()));
    const review = evaluateAdoptedBundleExporter(exporter);

    expect(review.status).toBe("valid");
    expect(review.issues).toHaveLength(0);
    expect(review.adoptedExportCount).toBe(1);
    expect(review.blockedBundleCount).toBe(0);
    expect(exporter.exports[0].sourceDecisionStatus).toBe("adopted");
    expect(exporter.exports[0].verificationCommands).toEqual(expect.arrayContaining(["pnpm run doctor:aidd"]));
    expect(exporter.exports[0].rollbackCondition).toContain("Rollback Plan");
    expect(exporter.exports[0].aiddSpecConnections).toEqual(expect.arrayContaining(["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"]));
    expect(exporter.standardDocument).toBe("standards/aidd-control-plane-mvp-v0.1.md");
  });

  it("Adopted Bundle Exporterのfailureサンプルは却下・保留・未判断bundle混入、review evidence不足、rollback condition不足、verification command不足、local path/host混入、AIDD-Spec接続不足を検出する", () => {
    const review = evaluateAdoptedBundleExporter(createFailureAdoptedBundleExporter());

    expect(review.status).toBe("failure");
    expect(review.issues).toEqual(expect.arrayContaining([
      "adopted-export-bad-001: 却下bundle混入",
      "adopted-export-bad-001: review evidence不足",
      "adopted-export-bad-001: AIDD-Spec接続不足",
      "adopted-export-bad-001: Verification Evidence接続不足",
      "adopted-export-bad-001: Review Record接続不足",
      "adopted-export-bad-001: Learning Log不足",
      "adopted-export-bad-001: Rollback Plan接続不足",
      "adopted-export-bad-002: 保留bundle混入",
      "adopted-export-bad-002: verification command不足",
      "adopted-export-bad-002: rollback condition不足",
      "adopted-export-bad-002: ローカルパスやhost名の混入",
      "adopted-export-bad-002: AIDD-Spec接続不足",
      "adopted-export-bad-003: 未判断bundle混入",
      "adopted-export-bad-003: rollback condition不足",
      "adopted-export-bad-003: ローカルパスやhost名の混入"
    ]));
  });

  it("Exported Packet Preflight Reviewerのemptyサンプルは次工程へ渡すpacketなしとして判定できる", () => {
    const review = evaluateExportedPacketPreflightReviewer(createEmptyExportedPacketPreflightReviewer());

    expect(review.status).toBe("empty");
    expect(review.readyPacketCount).toBe(0);
    expect(review.issues).toHaveLength(0);
  });

  it("Exported Packet Preflight ReviewerのvalidサンプルはFirefoxを含む3ブラウザとAIDD-Spec接続を維持する", () => {
    const reviewer = createValidExportedPacketPreflightReviewer(createValidAdoptedBundleExporter(createValidDiffBundleDecisionLedger(createValidDiffBundleRollbackEvidenceWorkspace())));
    const review = evaluateExportedPacketPreflightReviewer(reviewer);

    expect(review.status).toBe("valid");
    expect(review.issues).toHaveLength(0);
    expect(review.readyPacketCount).toBe(1);
    expect(reviewer.packets[0].browserProjects).toEqual(expect.arrayContaining(["chromium", "firefox", "webkit"]));
    expect(reviewer.packets[0].verificationDepth).toBe("standard");
    expect(reviewer.packets[0].aiddSpecConnections).toEqual(expect.arrayContaining(["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"]));
    expect(reviewer.copyCodexPrompt).toContain("AIDD-Spec v0.1");
  });

  it("Exported Packet Preflight Reviewerのfailureサンプルは未採用bundle混入、Firefox除外、浅い検証、local path/host/private network、rollback不足、evidence不足、AIDD-Spec接続不足を検出する", () => {
    const review = evaluateExportedPacketPreflightReviewer(createFailureExportedPacketPreflightReviewer());

    expect(review.status).toBe("failure");
    expect(review.issues).toEqual(expect.arrayContaining([
      "exported-packet-bad-001: 未採用bundle混入",
      "exported-packet-bad-001: Firefox除外",
      "exported-packet-bad-001: 3ブラウザE2E不足",
      "exported-packet-bad-001: 浅い検証",
      "exported-packet-bad-001: local path/host/private network混入",
      "exported-packet-bad-001: rollback不足",
      "exported-packet-bad-001: evidence不足",
      "exported-packet-bad-001: Verification Evidence接続不足",
      "exported-packet-bad-001: AIDD-Spec接続不足",
      "exported-packet-bad-002: 浅い検証",
      "exported-packet-bad-002: local path/host/private network混入",
      "exported-packet-bad-002: AIDD-Spec接続不足"
    ]));
  });

  it("Verification Run Detailはempty valid failureでcommand別exit codeとartifact pathを監査する", () => {
    expect(evaluateVerificationRunDetail(createEmptyVerificationRunDetail()).status).toBe("empty");

    const valid = createValidVerificationRunDetail(createValidCodexRunQueue());
    const validReview = evaluateVerificationRunDetail(valid);
    expect(validReview.status).toBe("valid");
    expect(valid.commands.map((command) => command.command)).toEqual(expect.arrayContaining(["pnpm run lint", "pnpm run test:e2e", "pnpm run doctor:aidd"]));
    expect(valid.commands[0]).toMatchObject({ status: "passed", exitCode: 0 });
    expect(valid.commands[0].artifactPath).toContain("artifacts/terminal");
    expect(valid.commands[0].failureCategory).toBe("");
    expect(valid.browserProjects).toEqual(expect.arrayContaining(["chromium", "firefox", "webkit"]));
    expect(valid.reviewFindingDrafts.join("\n")).toContain("command別exit code");

    const failureReview = evaluateVerificationRunDetail(createFailureVerificationRunDetail());
    expect(failureReview.status).toBe("failure");
    expect(failureReview.issues).toEqual(expect.arrayContaining([
      "commit SHA不足",
      "terminal evidence path不足",
      "screenshot evidence path不足",
      "playwright report path不足",
      "firefox不足",
      "webkit不足",
      "Firefox除外",
      "command別detail不足",
      "pnpm run test: artifact path不足",
      "pnpm run test:e2e -- --project=chromium: artifact path不足",
      "Review Finding draft不足",
      "AI Task Packet接続不足",
      "Review Record接続不足",
      "Learning Log接続不足",
      "Rollback Plan接続不足"
    ]));
  });

  it("Evidence Repair Delta Generatorはfailed evidence_missing timeoutを次回AI Task Packetへ戻す", () => {
    expect(evaluateEvidenceRepairDeltaGenerator(createEmptyEvidenceRepairDeltaGenerator()).status).toBe("empty");

    const valid = createValidEvidenceRepairDeltaGenerator(createFailureVerificationRunDetail());
    const validReview = evaluateEvidenceRepairDeltaGenerator(valid);
    expect(validReview.status).toBe("valid");
    expect(valid.deltas.map((delta) => delta.failureCategory)).toEqual(expect.arrayContaining(["failed", "evidence_missing", "timeout"]));
    expect(valid.deltas[0].aiTaskPacketDelta).toContain("AI Task Packet");
    expect(valid.deltas[1].codexPromptDelta).toContain("証跡が不足");
    expect(valid.deltas[2].verificationCommand).toContain("firefox");
    expect(valid.aiddSpecConnections).toEqual(expect.arrayContaining(["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"]));

    const failureReview = evaluateEvidenceRepairDeltaGenerator(createFailureEvidenceRepairDeltaGenerator());
    expect(failureReview.status).toBe("failure");
    expect(failureReview.issues).toEqual(expect.arrayContaining([
      "source detail不足",
      "terminal evidence不足",
      "failure screenshot不足",
      "failed repair delta不足",
      "evidence_missing repair delta不足",
      "timeout repair delta不足",
      "repair-delta-broken: source detail不足",
      "repair-delta-broken: failure category不足",
      "repair-delta-broken: repair instruction不足",
      "repair-delta-broken: AI Task Packet delta不足",
      "repair-delta-broken: rollback condition不足",
      "repair-delta-broken: Learning Log note不足",
      "repair-delta-broken: evidence path不足",
      "repair-delta-broken: firefox不足",
      "repair-delta-broken: webkit不足",
      "repair-delta-broken: Firefox除外",
      "local path / host / private network混入",
      "AI Task Packet接続不足",
      "Verification Evidence接続不足",
      "Review Record接続不足",
      "Learning Log接続不足",
      "Rollback Plan接続不足"
    ]));
  });

  it("Repair Delta Priority Decision Workspaceは採用済みrepair deltaだけを次回AI Task PacketとCodex promptへ進める", () => {
    expect(evaluateRepairDeltaPriorityDecisionWorkspace(createEmptyRepairDeltaPriorityDecisionWorkspace()).status).toBe("empty");

    const valid = createValidRepairDeltaPriorityDecisionWorkspace(createValidEvidenceRepairDeltaGenerator(createFailureVerificationRunDetail()));
    const validReview = evaluateRepairDeltaPriorityDecisionWorkspace(valid);
    expect(validReview.status).toBe("valid");
    expect(validReview.adoptedCount).toBe(1);
    expect(validReview.deferredCount).toBe(1);
    expect(validReview.rejectedCount).toBe(1);
    expect(valid.decisions.map((decision) => decision.decision)).toEqual(expect.arrayContaining(["adopted", "deferred", "rejected"]));
    expect(valid.adoptedNextAiTaskPacketDelta).toHaveLength(1);
    expect(valid.adoptedCodexPromptDeltas).toHaveLength(1);
    expect(valid.decisions.find((decision) => decision.decision === "deferred")?.aiTaskPacketDelta).not.toBe(valid.adoptedNextAiTaskPacketDelta[0]);
    expect(valid.aiddSpecConnections).toEqual(expect.arrayContaining(["AIDD-Spec v0.1", "Review Record", "Learning Log", "Verification Evidence", "AI Task Packet", "Codex prompt"]));

    const failureReview = evaluateRepairDeltaPriorityDecisionWorkspace(createFailureRepairDeltaPriorityDecisionWorkspace());
    expect(failureReview.status).toBe("failure");
    expect(failureReview.issues).toEqual(expect.arrayContaining([
      "source generator不足",
      "採用判断不足",
      "保留判断不足",
      "却下判断不足",
      "repair-delta-unreviewed: 未判断",
      "repair-delta-unreviewed: 理由不足",
      "repair-delta-unreviewed: 証跡不足",
      "repair-delta-unreviewed: rollback不足",
      "repair-delta-unreviewed: Firefox除外",
      "未採用repair deltaがAI Task Packetへ混入",
      "未採用repair deltaがCodex promptへ混入",
      "local path/host/private network混入",
      "AIDD-Spec v0.1接続不足",
      "Review Record接続不足",
      "Learning Log接続不足",
      "Verification Evidence接続不足",
      "AI Task Packet接続不足",
      "Codex prompt接続不足",
      "Rollback Plan接続不足"
    ]));
  });

  it("Execution Priority Set Builderはexecute_nowだけをCodex prompt previewへ入れる", () => {
    expect(evaluateExecutionPrioritySetBuilder(createEmptyExecutionPrioritySetBuilder()).status).toBe("empty");

    const valid = createValidExecutionPrioritySetBuilder(createValidRepairDeltaPriorityDecisionWorkspace(createValidEvidenceRepairDeltaGenerator(createFailureVerificationRunDetail())));
    const validReview = evaluateExecutionPrioritySetBuilder(valid);
    expect(validReview.status).toBe("valid");
    expect(validReview.executeNowCount).toBe(1);
    expect(validReview.nextIncrementCount).toBe(1);
    expect(validReview.learningLogCount).toBe(1);
    expect(valid.items.map((item) => item.route)).toEqual(expect.arrayContaining(["execute_now", "next_increment", "learning_log"]));
    expect(valid.codexPromptPreview).toContain(valid.items.find((item) => item.route === "execute_now")?.codexPromptDelta);
    expect(valid.codexPromptPreview).not.toContain(valid.items.find((item) => item.route === "next_increment")?.codexPromptDelta);
    expect(valid.codexPromptPreview).not.toContain(valid.items.find((item) => item.route === "learning_log")?.codexPromptDelta);
    expect(valid.items.find((item) => item.route === "execute_now")?.verificationCommands).toEqual(expect.arrayContaining(["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e", "pnpm run doctor:aidd"]));
    expect(valid.aiddSpecConnections).toEqual(expect.arrayContaining(["AIDD-Spec v0.1", "AI Task Packet", "Codex prompt", "Review Record", "Learning Log", "Verification Evidence", "Rollback Plan"]));

    const failureReview = evaluateExecutionPrioritySetBuilder(createFailureExecutionPrioritySetBuilder());
    expect(failureReview.status).toBe("failure");
    expect(failureReview.issues).toEqual(expect.arrayContaining([
      "priority 1: 優先順位重複",
      "repair-delta-failed-command: 実行予算不足",
      "repair-delta-failed-command: rollback不足",
      "repair-delta-failed-command: 検証コマンド不足",
      "repair-delta-failed-command: Firefox除外",
      "repair-delta-evidence-missing: 未採用delta混入",
      "repair-delta-evidence-missing: rollback不足",
      "repair-delta-evidence-missing: 検証コマンド不足",
      "repair-delta-evidence-missing: Firefox除外",
      "local path/host/private network混入",
      "AIDD-Spec v0.1接続不足",
      "Codex prompt接続不足",
      "Review Record接続不足",
      "Learning Log接続不足",
      "Verification Evidence接続不足",
      "Rollback Plan接続不足"
    ]));
  });

  it("One-Run Handoff Pack Reviewerはexecute_nowだけを次の1回の手渡しパックへ変換する", () => {
    expect(evaluateOneRunHandoffPackReviewer(createEmptyOneRunHandoffPackReviewer()).status).toBe("empty");

    const executionSet = createValidExecutionPrioritySetBuilder(createValidRepairDeltaPriorityDecisionWorkspace(createValidEvidenceRepairDeltaGenerator(createFailureVerificationRunDetail())));
    const validPack = createValidOneRunHandoffPackReviewer(executionSet);
    const validReview = evaluateOneRunHandoffPackReviewer(validPack);
    expect(validReview.status).toBe("valid");
    expect(validReview.executeNowDeltaCount).toBe(1);
    expect(validPack.sourceExecutionSetId).toBe(executionSet.sourceDecisionWorkspaceId);
    expect(validPack.sourceExecuteNowDeltaId).toBe(executionSet.items.find((item) => item.route === "execute_now")?.deltaId);
    expect(validPack.aiTaskPacketPatch).toContain("AI Task Packet");
    expect(validPack.codexPrompt).toContain("execute_now delta id");
    expect(validPack.verificationCommands).toEqual(["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e", "pnpm run doctor:aidd"]);
    expect(validPack.browserProjects).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(validPack.requiredEvidence).toEqual(expect.arrayContaining(["terminal", "empty screenshot", "valid screenshot", "failure screenshot", "Playwright report"]));
    expect(validPack.rollbackCondition).toContain("Review Record");
    expect(validPack.noteArticleAngle).toContain("手渡しパック");
    expect(validPack.aiddSpecConnections).toEqual(expect.arrayContaining(["AIDD-Spec v0.1", "AIDD Control Plane MVP v0.1", "AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"]));

    const failureReview = evaluateOneRunHandoffPackReviewer(createFailureOneRunHandoffPackReviewer());
    expect(failureReview.status).toBe("failure");
    expect(failureReview.issues).toEqual(expect.arrayContaining([
      "source execution set / execute_now delta id不足",
      "AI Task Packet patch不足",
      "Codex prompt不足",
      "pnpm run lint不足",
      "pnpm run typecheck不足",
      "pnpm run test不足",
      "pnpm run build不足",
      "pnpm run doctor:aidd不足",
      "Firefox除外または1ブラウザだけの浅い検証",
      "terminal evidence不足",
      "empty screenshot evidence不足",
      "valid screenshot evidence不足",
      "failure screenshot evidence不足",
      "rollback不足",
      "AIDD-Spec v0.1接続不足",
      "AIDD Control Plane MVP v0.1接続不足",
      "local path / host / private network / private network URL混入"
    ]));
  });

  it("Codex Run Start Receipt Auditorは実行開始レシートのempty valid failureを監査できる", () => {
    expect(evaluateCodexRunStartReceiptAuditor(createEmptyCodexRunStartReceiptAuditor()).status).toBe("empty");

    const validReceipt = createValidCodexRunStartReceiptAuditor(createValidOneRunHandoffPackReviewer());
    const validReview = evaluateCodexRunStartReceiptAuditor(validReceipt);
    expect(validReview.status).toBe("valid");
    expect(validReview.issues).toHaveLength(0);
    expect(validReceipt.sourceHandoffPackId).toContain("repair-delta");
    expect(validReceipt.codexCommand).toContain("codex exec --sandbox danger-full-access");
    expect(validReceipt.sandboxMode).toBe("danger-full-access");
    expect(validReceipt.startedAt).toContain("2026-07-05");
    expect(validReceipt.operator).toBe("Codex Mastery Lab agent");
    expect(validReceipt.evidenceRoot).toBe("experiments/aidd-control-plane-mvp-040/artifacts");
    expect(validReceipt.requiredVerificationCommands).toEqual(["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e", "pnpm run doctor:aidd"]);
    expect(validReceipt.browserProjects).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(validReceipt.requiredScreenshots).toEqual(expect.arrayContaining([
      "aidd-control-plane-mvp040-empty.png",
      "aidd-control-plane-mvp040-valid.png",
      "aidd-control-plane-mvp040-failure.png",
      "aidd-control-plane-mvp040-terminal-evidence.png"
    ]));
    expect(validReceipt.rollbackStopCondition).toContain("実行を止め");
    expect(validReceipt.aiddSpecConnections).toEqual(expect.arrayContaining(["AIDD-Spec v0.1", "standards/aidd-control-plane-mvp-v0.1.md", "Verification Evidence", "Rollback Plan"]));

    const failureReview = evaluateCodexRunStartReceiptAuditor(createFailureCodexRunStartReceiptAuditor());
    expect(failureReview.status).toBe("failure");
    expect(failureReview.issues).toEqual(expect.arrayContaining([
      "危険command",
      "sandbox不足",
      "evidence root不足",
      "pnpm run lint不足",
      "pnpm run typecheck不足",
      "pnpm run test不足",
      "pnpm run build不足",
      "pnpm run doctor:aidd不足",
      "Firefox除外",
      "aidd-control-plane-mvp040-failure.png不足",
      "aidd-control-plane-mvp040-terminal-evidence.png不足",
      "terminal screenshot不足",
      "failure screenshot不足",
      "rollback不足",
      "AIDD-Spec v0.1接続不足",
      "standards/aidd-control-plane-mvp-v0.1.md接続不足",
      "Verification Evidence接続不足",
      "local path / host / private network URL混入"
    ]));
  });

  it("Verification Evidence Receipt Binderは検証証跡レシートのempty valid failureを監査できる", () => {
    expect(evaluateVerificationEvidenceReceiptBinder(createEmptyVerificationEvidenceReceiptBinder()).status).toBe("empty");

    const validBinder = createValidVerificationEvidenceReceiptBinder(createValidCodexRunStartReceiptAuditor());
    const validReview = evaluateVerificationEvidenceReceiptBinder(validBinder);
    expect(validReview.status).toBe("valid");
    expect(validReview.issues).toHaveLength(0);
    expect(validBinder.sourceRunStartReceiptId).toContain("repair-delta");
    expect(validBinder.commands.map((command) => command.command)).toEqual(["lint", "typecheck", "test", "build", "e2e", "doctor:aidd"]);
    expect(validBinder.commands.every((command) => command.exitCode === 0)).toBe(true);
    expect(validBinder.commands.every((command) => typeof command.durationMs === "number")).toBe(true);
    expect(validBinder.commands.map((command) => command.terminalLogPath).join("\n")).toContain("terminal");
    expect(validBinder.commands.map((command) => command.artifactPath).join("\n")).toContain("playwright-report");
    expect(validBinder.browserProjects).toEqual(["chromium", "firefox", "webkit"]);
    expect(Object.values(validBinder.screenshots)).toEqual(expect.arrayContaining([
      "experiments/aidd-control-plane-mvp-041/artifacts/screenshots/aidd-control-plane-mvp041-empty.png",
      "experiments/aidd-control-plane-mvp-041/artifacts/screenshots/aidd-control-plane-mvp041-valid.png",
      "experiments/aidd-control-plane-mvp-041/artifacts/screenshots/aidd-control-plane-mvp041-failure.png",
      "experiments/aidd-control-plane-mvp-041/artifacts/screenshots/aidd-control-plane-mvp041-terminal-evidence.png"
    ]));
    expect(validBinder.aiddSpecConnections).toEqual(expect.arrayContaining(["AIDD-Spec v0.1", "standards/aidd-control-plane-mvp-v0.1.md", "Verification Evidence", "Rollback Plan"]));

    const failureReview = evaluateVerificationEvidenceReceiptBinder(createFailureVerificationEvidenceReceiptBinder());
    expect(failureReview.status).toBe("failure");
    expect(failureReview.issues).toEqual(expect.arrayContaining([
      "source不足",
      "typecheck: command別detail不足",
      "lint: exit code不足",
      "lint: artifact不足",
      "lint: 失敗分類不足",
      "lint: 修正指示不足",
      "e2e: terminal log不足",
      "doctor:aidd: command別detail不足",
      "doctor:aidd不足",
      "Firefox除外",
      "terminal screenshot不足",
      "failure screenshot不足",
      "AIDD-Spec v0.1接続不足",
      "standards/aidd-control-plane-mvp-v0.1.md接続不足",
      "Review Record接続不足",
      "local path/host/private network URL混入"
    ]));
  });

  it("Review Record Receipt SynthesizerはReview Record receiptのempty valid failureを監査できる", () => {
    expect(evaluateReviewRecordReceiptSynthesizer(createEmptyReviewRecordReceiptSynthesizer()).status).toBe("empty");

    const validReceipt = createValidReviewRecordReceiptSynthesizer(createValidVerificationEvidenceReceiptBinder());
    const validReview = evaluateReviewRecordReceiptSynthesizer(validReceipt);
    expect(validReview.status).toBe("valid");
    expect(validReview.issues).toHaveLength(0);
    expect(validReceipt.sourceReceiptId).toBeTruthy();
    expect(validReceipt.score).toBe(98);
    expect(validReceipt.scoreReason).toContain("Verification Evidence Receipt Binder");
    expect(validReceipt.findings[0].category).toBe("standard_update");
    expect(validReceipt.findings[0].neededUpstreamInfo).toEqual(expect.arrayContaining(["source receipt id", "command別terminal evidence", "Chromium / Firefox / WebKit結果"]));
    expect(validReceipt.standardUpdate).toContain("Review Record Receipt Synthesizer");
    expect(validReceipt.aiTaskPacketDelta.join("\n")).toContain("MVP042");
    expect(validReceipt.codexPromptDelta).toContain("score根拠");
    expect(validReceipt.verificationCommand).toContain("pnpm run doctor:aidd");
    expect(validReceipt.learningLogNote).toContain("Review Record");
    expect(validReceipt.terminalEvidence).toContain("terminal");
    expect(validReceipt.failureScreenshot).toContain("aidd-control-plane-mvp042-failure.png");
    expect(validReceipt.browserProjects).toEqual(["chromium", "firefox", "webkit"]);
    expect(validReceipt.aiddSpecConnections).toEqual(expect.arrayContaining(["AIDD-Spec v0.1", "AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"]));

    const failureReview = evaluateReviewRecordReceiptSynthesizer(createFailureReviewRecordReceiptSynthesizer());
    expect(failureReview.status).toBe("failure");
    expect(failureReview.issues).toEqual(expect.arrayContaining([
      "source不足",
      "score根拠不足",
      "review-record-receipt-mvp042-broken: finding分類不足",
      "review-record-receipt-mvp042-broken: needed upstream info不足",
      "review-record-receipt-mvp042-broken: standard update不足",
      "review-record-receipt-mvp042-broken: AI Task Packet delta不足",
      "review-record-receipt-mvp042-broken: Codex prompt delta不足",
      "review-record-receipt-mvp042-broken: verification command不足",
      "review-record-receipt-mvp042-broken: Learning Log接続不足",
      "needed upstream info不足",
      "standard update不足",
      "AI Task Packet delta不足",
      "Codex prompt delta不足",
      "verification command不足",
      "Learning Log接続不足",
      "Firefox除外",
      "terminal evidence不足",
      "failure screenshot不足",
      "AIDD-Spec v0.1接続不足",
      "Review Record接続不足",
      "Learning Log接続不足",
      "local path/host/private network URL混入"
    ]));
  });

  it("Review Finding Action QueueはReview Findingを次の行動キューへ変換しempty valid failureを監査できる", () => {
    expect(evaluateReviewFindingActionQueue(createEmptyReviewFindingActionQueue()).status).toBe("empty");

    const validQueue = createValidReviewFindingActionQueue(createValidReviewRecordReceiptSynthesizer());
    const validReview = evaluateReviewFindingActionQueue(validQueue);
    expect(validReview.status).toBe("valid");
    expect(validReview.issues).toHaveLength(0);
    expect(validQueue.sourceReviewId).toBeTruthy();
    expect(validQueue.queueId).toBe("review-finding-action-queue-mvp043");
    expect(validQueue.sourceInputs).toEqual(expect.arrayContaining(["source review receipt", "finding list", "priority rule", "verification command", "evidence requirement"]));
    expect(validQueue.actionItems.map((item) => item.lane)).toEqual(["execute_now", "next_increment", "learning_log"]);
    expect(validQueue.actionItems[0].priorityReason).toContain("次回Codex実行");
    expect(validQueue.actionItems[0].aiTaskPacketPatch).toContain("MVP043");
    expect(validQueue.actionItems[0].verificationCommands).toEqual(expect.arrayContaining(["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run doctor:aidd", "pnpm run test:e2e"]));
    expect(validQueue.actionItems[0].requiredEvidence.join("\n")).toContain("terminal evidence");
    expect(validQueue.actionItems[0].requiredEvidence.join("\n")).toContain("failure screenshot");
    expect(validQueue.actionItems[0].rollbackCondition).toContain("execute_now以外");
    expect(validQueue.actionItems[0].aiddSpecConnection).toEqual(expect.arrayContaining(["AI Task Packet", "Verification Evidence", "Review Record"]));
    expect(validQueue.codexPromptPreview).toContain("action-mvp043-execute-now-001");
    expect(validQueue.codexPromptPreview).not.toContain("action-mvp043-next-increment-001");
    expect(validQueue.codexPromptPreview).not.toContain("action-mvp043-learning-log-001");
    expect(validQueue.excludedLaneNotice).toContain("next_increment と learning_log はCodex prompt previewに混ぜません");

    const failureReview = evaluateReviewFindingActionQueue(createFailureReviewFindingActionQueue());
    expect(failureReview.status).toBe("failure");
    expect(failureReview.issues).toEqual(expect.arrayContaining([
      "source不足",
      "action-mvp043-broken: priority reason不足",
      "action-mvp043-broken: lane不足",
      "action-mvp043-broken: verification command不足",
      "action-mvp043-broken: rollback不足",
      "action-mvp043-broken: required evidence不足",
      "terminal evidence不足",
      "failure screenshot不足",
      "Firefox除外",
      "execute_now以外のprompt混入",
      "action-mvp043-broken: AIDD-Spec接続不足",
      "AIDD-Spec接続不足",
      "local path / host / private network URL混入"
    ]));
  });

  it("Dogfood App Idea Packet Generatorはアプリ案とテンプレートから検証可能なseedを作る", () => {
    const seed = generateDogfoodAppIdeaPacketSeed({
      appIdea: "音声つき散歩ログアプリ",
      templateId: "learning-support"
    });

    expect(seed.status).toBe("valid");
    expect(seed.templateName).toBe("学習支援");
    expect(seed.requiredSections).toEqual(expect.arrayContaining(["Non-infringement Boundary", "Mock Backend Contract", "Verification Evidence"]));
    expect(seed.mockServices).toEqual(expect.arrayContaining(["mock-api", "mock-media", "mock-auth", "mock-billing"]));
    expect(seed.failureStates).toEqual(expect.arrayContaining(["offline", "timeout", "auth", "billing", "media_error"]));
    expect(seed.verificationCommands).toEqual(expect.arrayContaining(["pnpm run mock:doctor", "gh api repos/:owner/:repo/actions/runs/<run-id>/artifacts"]));
    expect(seed.codexPromptSeed).toContain("音声つき散歩ログアプリ");
    expect(seed.codexPromptSeed).toContain("初期生成品質と最終収束品質");
  });

  it("Dogfood Packet Markdown Reviewはseedを3つのMarkdown反映前プレビューへ分ける", () => {
    const seed = generateDogfoodAppIdeaPacketSeed({
      appIdea: "音声つき散歩ログアプリ",
      templateId: "learning-support"
    });
    const review = createDogfoodPacketMarkdownReview(seed);

    expect(review.status).toBe("valid");
    expect(review.issues).toHaveLength(0);
    expect(review.files.map((file) => file.targetFile)).toEqual(["AI_TASK_PACKET.md", "CODEX_PROMPT.md", "VERIFICATION_PLAN.md"]);
    expect(review.files.find((file) => file.targetFile === "AI_TASK_PACKET.md")?.bodyPreview).toContain("Mock Backend Contract");
    expect(review.files.find((file) => file.targetFile === "CODEX_PROMPT.md")?.bodyPreview).toContain("初期生成品質と最終収束品質");
    expect(review.files.find((file) => file.targetFile === "VERIFICATION_PLAN.md")?.bodyPreview).toContain("gh api repos/:owner/:repo/actions/runs/<run-id>/artifacts");
    expect(review.copyBundle).toContain("<!-- AI_TASK_PACKET.md -->");
    expect(review.reviewChecklist.join("\n")).toContain("実ファイルへ反映する");
  });
});

function readyDraft() {
  return buildIntakeDraft({
    ...baseInput,
    appName: "StudyFlow",
    appType: "Webアプリ",
    targetUser: "学習を継続したい社会人",
    userProblem: "教材が散らばり、今日やることを決められない",
    keyFeaturesText: "今日の学習キュー\n進捗チェック",
    nonGoalsText: "課金機能\n外部AI API呼び出し",
    externalIntegrationsText: "なし",
    stateContract: ["empty", "success", "error", "offline"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd"],
    selectedTemplateId: "learning-support",
    appliedTemplateId: "learning-support",
    verificationRun: createSuccessVerificationRun()
  });
}
