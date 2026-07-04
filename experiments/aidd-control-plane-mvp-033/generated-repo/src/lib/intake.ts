export const APP_TYPES = ["Webアプリ", "モバイルアプリ", "業務ツール", "コンテンツサービス", "EC/予約", "その他"] as const;

export const STATE_CONTRACT_OPTIONS = [
  "empty",
  "loading",
  "success",
  "error",
  "offline",
  "timeout",
  "auth",
  "billing",
  "media_error"
] as const;

export const QUALITY_GATE_OPTIONS = [
  "lint",
  "typecheck",
  "test",
  "build",
  "e2e",
  "doctor:aidd",
  "accessibility",
  "security",
  "performance"
] as const;

export const APP_TYPE_TEMPLATES = [
  {
    id: "video-service",
    name: "動画サービス風",
    appType: "コンテンツサービス",
    recommendedFeatures: ["作品一覧と検索", "視聴キュー", "再生状態とメディア失敗表示", "プレミアム導線"],
    stateContract: ["empty", "loading", "success", "error", "offline", "timeout", "auth", "billing", "media_error"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd", "accessibility"],
    nonGoals: ["実在サービスの商標・ロゴ利用", "本番動画配信", "実決済"],
    externalIntegrations: ["mock media service", "mock auth service", "mock billing service"],
    risks: ["メディア失敗時の表示が通常エラーに埋もれる", "匿名ユーザーとプレミアムユーザーの差分が曖昧になる"],
    evidenceRequirements: ["media_error状態のスクリーンショット", "auth anonymous / auth premium / billing failedのE2Eログ"]
  },
  {
    id: "learning-support",
    name: "学習支援",
    appType: "Webアプリ",
    recommendedFeatures: ["今日の学習キュー", "進捗チェック", "復習リマインド", "理解度メモ"],
    stateContract: ["empty", "loading", "success", "error", "offline", "timeout", "auth"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd", "accessibility"],
    nonGoals: ["外部AI API呼び出し", "教材販売", "SNS投稿"],
    externalIntegrations: ["mock auth service", "mock progress service"],
    risks: ["学習継続の価値が単なるTODO管理に寄る", "offline時の進捗保存方針が曖昧になる"],
    evidenceRequirements: ["emptyからsuccessまでの主要フロー録画", "offline / timeout状態の画面証跡"]
  },
  {
    id: "booking-management",
    name: "予約管理",
    appType: "EC/予約",
    recommendedFeatures: ["空き枠カレンダー", "予約作成", "予約変更とキャンセル", "支払い失敗時の再試行"],
    stateContract: ["empty", "loading", "success", "error", "offline", "timeout", "auth", "billing"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd", "accessibility", "performance"],
    nonGoals: ["実店舗の在庫同期", "実決済", "外部カレンダー双方向同期"],
    externalIntegrations: ["mock booking service", "mock auth service", "mock billing service"],
    risks: ["二重予約の防止条件がUIだけでは検証しにくい", "billing failed時の予約保持ルールが不明確になる"],
    evidenceRequirements: ["予約作成・変更・キャンセルのE2Eログ", "billing failed表示のスクリーンショット"]
  },
  {
    id: "internal-request",
    name: "社内申請",
    appType: "業務ツール",
    recommendedFeatures: ["申請フォーム", "承認ステータス一覧", "差し戻しコメント", "権限別ビュー"],
    stateContract: ["empty", "loading", "success", "error", "offline", "timeout", "auth"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd", "security"],
    nonGoals: ["実社内ID連携", "監査ログの長期保管", "メール実送信"],
    externalIntegrations: ["mock auth service", "mock workflow service"],
    risks: ["権限別表示がhappy pathだけになる", "差し戻しと再申請の状態遷移が不足する"],
    evidenceRequirements: ["申請者・承認者ビューのスクリーンショット", "auth状態切替のE2Eログ"]
  }
] as const satisfies readonly AppTypeTemplate[];

export type AppType = (typeof APP_TYPES)[number];
export type StateContract = (typeof STATE_CONTRACT_OPTIONS)[number];
export type QualityGate = (typeof QUALITY_GATE_OPTIONS)[number];
export type AppTypeTemplateId = "video-service" | "learning-support" | "booking-management" | "internal-request";
export type AppTypeTemplate = {
  id: AppTypeTemplateId;
  name: string;
  appType: AppType;
  recommendedFeatures: readonly string[];
  stateContract: readonly StateContract[];
  qualityGates: readonly QualityGate[];
  nonGoals: readonly string[];
  externalIntegrations: readonly string[];
  risks: readonly string[];
  evidenceRequirements: readonly string[];
};

export type DogfoodAppIdeaPacketSeed = {
  status: "valid";
  sourceEvidence: string[];
  appIdea: string;
  templateName: string;
  requiredSections: string[];
  mockServices: string[];
  failureStates: string[];
  verificationCommands: string[];
  acceptanceCriteria: string[];
  codexPromptSeed: string;
};

export type DogfoodPacketMarkdownFile = {
  targetFile: "AI_TASK_PACKET.md" | "CODEX_PROMPT.md" | "VERIFICATION_PLAN.md";
  heading: string;
  bodyPreview: string;
  diffSummary: string;
  preflightChecks: string[];
  verificationCommand: string;
  rollbackCondition: string;
};

export type DogfoodPacketMarkdownReview = {
  status: "valid" | "failure";
  sourceAppIdea: string;
  files: DogfoodPacketMarkdownFile[];
  reviewChecklist: string[];
  copyBundle: string;
  issues: string[];
};

export type PacketApplyCommandComposerMode = "empty" | "valid" | "failure";

export type PacketApplyCommand = {
  targetFile: DogfoodPacketMarkdownFile["targetFile"] | string;
  applyCommand: string;
  dryRunCommand: string;
  verificationCommand: string;
  rollbackCommand: string;
  evidencePath: string;
  preflightChecks: string[];
  reviewedMarkdown: boolean;
};

export type PacketApplyCommandComposer = {
  statusSample: PacketApplyCommandComposerMode;
  commands: PacketApplyCommand[];
  copyCodexPrompt: string;
  aiddSpecConnections: string[];
};

export type PacketApplyCommandComposerReview = {
  status: ArtifactEvidenceStatus;
  issues: string[];
};

export function createEmptyPacketApplyCommandComposer(): PacketApplyCommandComposer {
  return {
    statusSample: "empty",
    commands: [],
    copyCodexPrompt: "",
    aiddSpecConnections: []
  };
}

export function createValidPacketApplyCommandComposer(review: DogfoodPacketMarkdownReview): PacketApplyCommandComposer {
  return {
    statusSample: "valid",
    commands: review.files.map((file) => ({
      targetFile: file.targetFile,
      applyCommand: `node scripts/apply-packet-section.mjs --target ${file.targetFile} --source artifacts/packet-preview/${file.targetFile}`,
      dryRunCommand: `node scripts/apply-packet-section.mjs --target ${file.targetFile} --source artifacts/packet-preview/${file.targetFile} --dry-run`,
      verificationCommand: file.verificationCommand,
      rollbackCommand: `git checkout -- ${file.targetFile} && pnpm run doctor:aidd`,
      evidencePath: `experiments/aidd-control-plane-mvp-026/artifacts/terminal/apply-${file.targetFile.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`,
      preflightChecks: [
        ...file.preflightChecks,
        "dry-run結果をterminal evidenceへ保存する",
        "rollback commandを実行前にレビューする"
      ],
      reviewedMarkdown: true
    })),
    copyCodexPrompt: [
      "AIDD Control PlaneのPacket Apply Command Composerで承認済みのMarkdownだけを反映してください。",
      "apply前にdry-runを実行し、verification commandとrollback commandをterminal evidenceへ保存してください。",
      "未レビューMarkdown、危険なtarget path、ローカルパス混入、Firefox除外があれば適用せずReview Recordへ戻してください。"
    ].join("\n"),
    aiddSpecConnections: ["AI Task Packet", "Verification Evidence", "Review Record", "Rollback Plan", "Learning Log"]
  };
}

export function createFailurePacketApplyCommandComposer(): PacketApplyCommandComposer {
  return {
    statusSample: "failure",
    commands: [
      {
        targetFile: "../unsafe/CODEX_PROMPT.md",
        applyCommand: "node scripts/apply-packet-section.mjs --target ../unsafe/CODEX_PROMPT.md",
        dryRunCommand: "",
        verificationCommand: "",
        rollbackCommand: "",
        evidencePath: "",
        preflightChecks: ["未レビューMarkdownを含む"],
        reviewedMarkdown: false
      }
    ],
    copyCodexPrompt: "未レビューMarkdownをそのまま適用する。",
    aiddSpecConnections: []
  };
}

export function evaluatePacketApplyCommandComposer(composer: PacketApplyCommandComposer): PacketApplyCommandComposerReview {
  if (composer.commands.length === 0) return { status: "empty", issues: [] };
  const issues: string[] = [];
  for (const command of composer.commands) {
    if (command.targetFile.includes("..") || command.targetFile.startsWith("/")) issues.push(`${command.targetFile}: 危険なtarget path`);
    if (!command.dryRunCommand) issues.push(`${command.targetFile}: dry-run command不足`);
    if (!command.verificationCommand) issues.push(`${command.targetFile}: verification command不足`);
    if (!command.rollbackCommand) issues.push(`${command.targetFile}: rollback command不足`);
    if (!command.evidencePath) issues.push(`${command.targetFile}: evidence path不足`);
    if (!command.reviewedMarkdown) issues.push(`${command.targetFile}: 未レビューMarkdown混入`);
  }
  if (composer.aiddSpecConnections.length === 0) issues.push("AIDD-Spec接続不足");
  return { status: issues.length > 0 ? "failure" : "valid", issues };
}

export function generateDogfoodAppIdeaPacketSeed(input: {
  appIdea: string;
  templateId?: AppTypeTemplateId | "";
}): DogfoodAppIdeaPacketSeed {
  const template = APP_TYPE_TEMPLATES.find((candidate) => candidate.id === input.templateId) ?? APP_TYPE_TEMPLATES[0];
  const appIdea = input.appIdea.trim() || "商標非利用の新しいアプリ体験パターン";
  const failureStates = Array.from(new Set(["offline", "timeout", "media_error", "auth", "billing", ...template.stateContract]));
  const mockServices = Array.from(new Set(["mock-api", "mock-media", "mock-auth", "mock-billing", ...template.externalIntegrations]));
  const verificationCommands = [
    "pnpm run lint",
    "pnpm run typecheck",
    "pnpm run test:coverage",
    "pnpm run build",
    "pnpm run mock:doctor",
    "pnpm run test:e2e -- --project=chromium --project=firefox --project=webkit",
    "gh run view <run-id> --json conclusion",
    "gh api repos/:owner/:repo/actions/runs/<run-id>/artifacts"
  ];

  return {
    status: "valid",
    sourceEvidence: [
      "Character Collection RPG Trial 006 CI / run 28623614814 / conclusion success",
      "coverage / playwright-report / test-results / terminal evidence artifact",
      "Chromium / Firefox / WebKit functional E2E",
      "Dogfood Reuse Task Packet Planner"
    ],
    appIdea,
    templateName: template.name,
    requiredSections: [
      "Product Brief",
      "Non-infringement Boundary",
      "Mock Backend Contract",
      "Failure State Contract",
      "Verification Evidence",
      "Result Reporting Boundary"
    ],
    mockServices,
    failureStates,
    verificationCommands,
    acceptanceCriteria: [
      `${appIdea}の体験パターンを、実在IP・ロゴ・公式素材・公式文言なしで説明する`,
      `${template.name}テンプレートの主要機能と非ゴールをProduct Briefへ明記する`,
      "mock serviceはUIから独立し、/health /state /__control/stateを持つ",
      "E2Eはmock stateを変更してfailure stateの画面反映を確認する",
      "初期生成品質と最終収束品質を分けて記事と最終報告に書く"
    ],
    codexPromptSeed: `あなたはAIDD Control Planeが生成したAI Task Packetに従い、${appIdea}をNext.js + TypeScript + pnpmで作る。\n` +
      `テンプレート: ${template.name}\n` +
      "商標非利用境界: 実在IP、ロゴ、公式素材、公式文言、公式レートを使わない。\n" +
      `必須mock service: ${mockServices.join(" / ")}\n` +
      `必須failure states: ${failureStates.join(" / ")}\n` +
      `検証コマンド: ${verificationCommands.join(" && ")}\n` +
      "完了条件: root CI success、coverage / playwright-report / test-results / terminal evidence artifact、記事とpreview更新、初期生成品質と最終収束品質の分離報告。"
  };
}

export function createDogfoodPacketMarkdownReview(seed: DogfoodAppIdeaPacketSeed): DogfoodPacketMarkdownReview {
  const sharedPreflightChecks = [
    "実在IP・ロゴ・公式素材・公式文言が含まれていない",
    "mock-api / mock-media / mock-auth / mock-billingが残っている",
    "offline / timeout / media_error / auth / billingを検証対象に含む",
    "Chromium / Firefox / WebKitの3ブラウザE2Eを外していない",
    "初期生成品質と最終収束品質を分けて報告する"
  ];
  const commandList = seed.verificationCommands.map((command) => `- [ ] ${command}`).join("\n");
  const files: DogfoodPacketMarkdownFile[] = [
    {
      targetFile: "AI_TASK_PACKET.md",
      heading: `# AI Task Packet: ${seed.appIdea}`,
      bodyPreview: [
        `# AI Task Packet: ${seed.appIdea}`,
        "",
        "## テンプレート",
        `- ${seed.templateName}`,
        "",
        "## 必須セクション",
        ...seed.requiredSections.map((section) => `- ${section}`),
        "",
        "## Mock Backend Contract",
        ...seed.mockServices.map((service) => `- ${service}`),
        "",
        "## Failure State Contract",
        ...seed.failureStates.map((state) => `- ${state}`),
        "",
        "## Acceptance Criteria",
        ...seed.acceptanceCriteria.map((criterion) => `- ${criterion}`)
      ].join("\n"),
      diffSummary: "新規アプリ案とRPG dogfood成功証跡をAI Task Packet本文へ反映する。",
      preflightChecks: sharedPreflightChecks,
      verificationCommand: "pnpm run doctor:aidd && pnpm run test:e2e",
      rollbackCondition: "非侵害境界、mock service、failure state、3ブラウザE2Eのいずれかが欠けたら適用せずseedへ戻す。"
    },
    {
      targetFile: "CODEX_PROMPT.md",
      heading: "# Codex Prompt Seed",
      bodyPreview: seed.codexPromptSeed,
      diffSummary: "Codexへ渡す実装依頼に非侵害境界、mock service、検証コマンド、報告境界を入れる。",
      preflightChecks: sharedPreflightChecks,
      verificationCommand: "pnpm run lint && pnpm run typecheck && pnpm run test",
      rollbackCondition: "商標・公式素材・浅い検証・Firefox除外が混入したらpromptを差し戻す。"
    },
    {
      targetFile: "VERIFICATION_PLAN.md",
      heading: "# Verification Plan",
      bodyPreview: [
        "# Verification Plan",
        "",
        "## 必須コマンド",
        commandList,
        "",
        "## 必須証跡",
        ...seed.sourceEvidence.map((evidence) => `- ${evidence}`),
        "- coverage / playwright-report / test-results artifact",
        "- empty / valid / failure screenshot",
        "- 記事とpreview再生成ログ"
      ].join("\n"),
      diffSummary: "検証計画にローカルgate、3ブラウザE2E、CI artifact確認、記事証跡を明示する。",
      preflightChecks: sharedPreflightChecks,
      verificationCommand: "pnpm run test:coverage && pnpm run build && pnpm run mock:doctor",
      rollbackCondition: "証跡ファイル名またはCI artifact確認が空ならVerification Planへ適用しない。"
    }
  ];

  const reviewChecklist = [
    "AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.mdの3ファイルに分けて確認する",
    "画面プレビューで差分を読んでから実ファイルへ反映する",
    "ローカルパス、host名、プライベートネットワークURLを含めない",
    "RPG dogfoodの成功証跡を根拠として残すが、別アプリへ公式IPを持ち込まない"
  ];
  const copyBundle = files.map((file) => `<!-- ${file.targetFile} -->\n${file.bodyPreview}`).join("\n\n---\n\n");
  const issues = files.flatMap((file) => [
    !file.bodyPreview.trim() ? `${file.targetFile}: body preview不足` : "",
    !file.verificationCommand.trim() ? `${file.targetFile}: verification command不足` : "",
    !file.rollbackCondition.trim() ? `${file.targetFile}: rollback condition不足` : "",
    file.bodyPreview.includes("ロマサガ") || file.bodyPreview.includes("SaGa") || file.bodyPreview.includes("スクウェア") ? `${file.targetFile}: 実在IPらしき文言が混入` : ""
  ]).filter((issue): issue is string => Boolean(issue));

  return {
    status: issues.length === 0 ? "valid" : "failure",
    sourceAppIdea: seed.appIdea,
    files,
    reviewChecklist,
    copyBundle,
    issues
  };
}
export type ReadinessStatus = "empty" | "draft" | "ready" | "insufficient";
export type VerificationGateStatus = "未実行" | "成功" | "失敗" | "証跡不足";
export type VerificationGateId = "lint" | "typecheck" | "test" | "build" | "e2e" | "doctor:aidd";

export type VerificationGateRun = {
  id: VerificationGateId;
  label: string;
  status: VerificationGateStatus;
  command: string;
  summary: string;
  evidenceFile: string;
};

export type VerificationRun = {
  title: string;
  gates: VerificationGateRun[];
  browserE2E: {
    chromium: VerificationGateStatus;
    firefox: VerificationGateStatus;
    webkit: VerificationGateStatus;
  };
  terminalEvidence: string[];
  screenshotEvidence: string[];
  artifactBinder: ArtifactEvidenceBinder;
};

export type EvidenceRequirementId =
  | "coverage"
  | "playwright-report"
  | "test-results"
  | "terminal-evidence"
  | "empty-screenshot"
  | "valid-screenshot"
  | "failure-screenshot";

export type EvidenceGapSeverity = "critical" | "high" | "medium";

export type EvidenceGapRepair = {
  id: EvidenceRequirementId;
  label: string;
  severity: EvidenceGapSeverity;
  affectedArtifact: string;
  fixInstruction: string;
  rerunCommand: string;
  codexPromptDelta: string;
};

export type EvidenceGapRepairPlan = {
  status: ArtifactEvidenceStatus;
  missingCount: number;
  repairs: EvidenceGapRepair[];
};

export type ReviewFinding = {
  category:
    | "検証"
    | "証跡"
    | "3ブラウザE2E"
    | "Artifact Evidence Binder"
    | "CI Artifact Importer"
    | "GitHub Actions Fetch Plan"
    | "Evidence Gap Repair Planner"
    | "CI Workflow Artifact Auditor"
    | "Packet File Apply Planner"
    | "Packet Draft Workspace"
    | "Safe Patch Review Workspace"
    | "Diff Bundle & Rollback Evidence Workspace"
    | "Bundle Decision Ledger"
    | "Adopted Bundle Exporter"
    | "Exported Packet Preflight Reviewer"
    | "Packet Apply Command Composer"
    | "Run Authorization Gate"
    | "残リスク";
  severity: "high" | "medium" | "low";
  finding: string;
  fixInstruction: string;
  neededUpstreamInfo: string[];
  verificationCommand: string;
};

export type ArtifactEvidenceStatus = "empty" | "valid" | "failure";

export type ArtifactEvidenceBinder = {
  statusSample: ArtifactEvidenceStatus;
  terminalEvidence: string[];
  screenshotEvidence: string[];
  ciRunUrl: string;
  ciArtifactUrl: string;
  playwrightReportUrl: string;
  generatedAt: string;
  ciSummary: CiArtifactImport;
};

export type CiJobStatus = "成功" | "失敗" | "未実行";

export type CiJob = {
  name: string;
  status: CiJobStatus;
};

export type CiArtifactImport = {
  workflowName: string;
  commitSha: string;
  runUrl: string;
  artifacts: string[];
  jobs: CiJob[];
  playwrightReportUrl: string;
  fetchPlan: GitHubActionsFetchPlan;
};

export type GitHubActionsFetchPlan = {
  runUrl: string;
  owner: string;
  repo: string;
  runId: string;
  runSummaryUrl: string;
  jobsApiEndpoint: string;
  artifactsApiEndpoint: string;
  logsUrl: string;
  tokenScopes: string[];
  requiredArtifacts: string[];
};

export type CiWorkflowArtifactAuditor = {
  statusSample: ArtifactEvidenceStatus;
  workflowPath: string;
  configuredGates: string[];
  configuredArtifactPaths: string[];
  aiddSpecConnections: string[];
  captureCommand: string;
  terminalEvidencePath: string;
};

export type CiWorkflowArtifactAudit = {
  status: ArtifactEvidenceStatus;
  missingWorkflow: boolean;
  missingGates: string[];
  missingArtifactPaths: string[];
  missingSpecConnections: string[];
  missingCaptureCommand: boolean;
  reviewFindings: ReviewFinding[];
  aiTaskPacketDelta: string[];
  specUpdateCandidates: string[];
};

export type SpecUpdateProposalMode = "empty" | "valid" | "failure";
export type SpecUpdatePriority = "high" | "medium" | "low";

export type SpecUpdateProposal = {
  finding: string;
  idealState: string;
  neededUpstreamInfo: string[];
  targetStandardDocument: string;
  targetField: string;
  priority: SpecUpdatePriority;
  acceptanceCriteria: string[];
  codexPromptDelta: string;
  verificationCommand: string;
};

export type SpecUpdateProposalQueue = {
  statusSample: SpecUpdateProposalMode;
  proposals: SpecUpdateProposal[];
};

export type SpecUpdateProposalQueueReview = {
  status: ArtifactEvidenceStatus;
  issues: string[];
};

export type TaskPacketDeltaApplyPreviewMode = "empty" | "valid" | "failure";

export type TaskPacketDeltaApplyPreview = {
  statusSample: TaskPacketDeltaApplyPreviewMode;
  sourceProposal: string;
  targetPacketSection: string;
  beforeSummary: string;
  afterSummary: string;
  addedAcceptanceCriteria: string[];
  addedVerificationCommands: string[];
  codexPromptPatch: string;
  rollbackCondition: string;
  reviewChecklist: string[];
};

export type TaskPacketDeltaApplyPreviewReview = {
  status: ArtifactEvidenceStatus;
  issues: string[];
};

export type DeltaDecisionReviewMode = "empty" | "valid" | "failure";
export type AdoptedDeltaMarkdownExportMode = "empty" | "valid" | "failure";
export type PacketFileApplyPlannerMode = "empty" | "valid" | "failure";
export type PacketDraftWorkspaceMode = "empty" | "valid" | "failure";
export type SafePatchReviewWorkspaceMode = "empty" | "valid" | "failure";
export type DiffBundleRollbackEvidenceMode = "empty" | "valid" | "failure";
export type BundleDecisionLedgerMode = "empty" | "valid" | "failure";
export type DiffBundleDecisionLedgerMode = "empty" | "valid" | "failure";
export type AdoptedBundleExporterMode = "empty" | "valid" | "failure";
export type ExportedPacketPreflightReviewerMode = "empty" | "valid" | "failure";
export type RunAuthorizationGateMode = "empty" | "valid" | "failure";
export type DeltaDecisionStatus = "adopted" | "rejected" | "deferred";
export type BundleDecisionStatus = "applied" | "rejected" | "deferred";
export type DiffBundleDecisionStatus = "adopted" | "rejected" | "deferred" | "undecided";

export type DeltaDecision = {
  deltaId: string;
  sourceProposal: string;
  status: DeltaDecisionStatus;
  decisionOwner: string;
  decisionReason: string;
  decidedAt: string;
  nextAction: string;
  reviewEvidence: string;
  rollbackConfirmed: boolean;
  includedInNextPacket: boolean;
  verificationCommands: string[];
  preventionNote: string;
};

export type DeltaDecisionReview = {
  statusSample: DeltaDecisionReviewMode;
  decisions: DeltaDecision[];
};

export type DeltaDecisionReviewSummary = {
  status: ArtifactEvidenceStatus;
  adoptedCount: number;
  rejectedCount: number;
  deferredCount: number;
  includedInNextPacket: DeltaDecision[];
  issues: string[];
};

export type AdoptedDeltaMarkdownExport = {
  statusSample: AdoptedDeltaMarkdownExportMode;
  markdownSection: string;
  verificationPlanPatch: string[];
  codexPromptPatch: string;
  rollbackCondition: string;
  reviewEvidence: string[];
  includedDeltaIds: string[];
  learningLogReturns: string[];
  sourceDecisions: DeltaDecision[];
};

export type AdoptedDeltaMarkdownExportReview = {
  status: ArtifactEvidenceStatus;
  issues: string[];
};

export type PacketFilePlan = {
  targetFile: string;
  markdownHeading: string;
  beforeSummary: string;
  afterSummary: string;
  insertPosition: string;
  verificationCommand: string;
  rollbackStep: string;
  reviewEvidence: string;
  includedDeltaIds: string[];
  learningLogReturnIds: string[];
};

export type PacketFileApplyPlanner = {
  statusSample: PacketFileApplyPlannerMode;
  filePlans: PacketFilePlan[];
  learningLogReturns: string[];
  sourceDecisions: DeltaDecision[];
};

export type PacketFileApplyPlannerReview = {
  status: ArtifactEvidenceStatus;
  reviewFindings: ReviewFinding[];
};

export type PacketDraftFile = {
  targetFile: string;
  draftStatus: "生成準備完了" | "要修正";
  sourceDeltaIds: string[];
  markdownHeadings: string[];
  diffSummary: string;
  bodyPreview: string;
  preflightChecks: string[];
  verificationCommands: string[];
  rollbackCondition: string;
  aiddSpecConnections: string[];
};

export type PacketDraftWorkspace = {
  statusSample: PacketDraftWorkspaceMode;
  drafts: PacketDraftFile[];
  copyCodexPrompt: string;
  learningLogReturns: string[];
  sourcePlanner: PacketFileApplyPlanner;
};

export type PacketDraftWorkspaceReview = {
  status: ArtifactEvidenceStatus;
  reviewFindings: ReviewFinding[];
};

export type SafePatchCandidate = {
  patchId: string;
  targetFile: string;
  sourceDraftId: string;
  diffSummary: string;
  addedLines: number;
  removedLines: number;
  riskLevel: "low" | "medium" | "high";
  applyCommand: string;
  verificationCommand: string;
  rollbackCommand: string;
  reviewerChecklist: string[];
  aiddSpecConnections: string[];
  containsUnadoptedDelta: boolean;
  containsLocalPath: boolean;
};

export type SafePatchReviewWorkspace = {
  statusSample: SafePatchReviewWorkspaceMode;
  patches: SafePatchCandidate[];
  copyCodexPrompt: string;
  sourceDraftWorkspace: PacketDraftWorkspace;
};

export type SafePatchReviewWorkspaceReview = {
  status: ArtifactEvidenceStatus;
  reviewFindings: ReviewFinding[];
};

export type DiffBundleRollbackEvidence = {
  bundleId: string;
  sourceApplyPlanId: string;
  sourcePatchId: string;
  targetFile: string;
  beforeHash: string;
  afterHash: string;
  diffBundlePath: string;
  dryRunCommand: string;
  dryRunStatus: "未実行" | "成功" | "失敗";
  rollbackEvidencePath: string;
  rollbackVerifiedCommand: string;
  verificationCommand: string;
  reviewerChecklist: string[];
  reviewerApproved: boolean;
  aiddSpecConnections: string[];
  containsLocalPath: boolean;
  missingRollbackEvidence: boolean;
};

export type DiffBundleRollbackEvidenceWorkspace = {
  statusSample: DiffBundleRollbackEvidenceMode;
  bundles: DiffBundleRollbackEvidence[];
  sourceSafePatchReviewWorkspace: SafePatchReviewWorkspace;
  copyCodexPrompt: string;
};

export type DiffBundleRollbackEvidenceWorkspaceReview = {
  status: ArtifactEvidenceStatus;
  reviewFindings: ReviewFinding[];
};

export type BundleDecision = {
  decisionId: string;
  bundleId: string;
  targetFile: string;
  status: BundleDecisionStatus;
  decisionOwner: string;
  decisionReason: string;
  decidedAt: string;
  appliedEvidencePath: string;
  verificationEvidencePath: string;
  rollbackEvidencePath: string;
  reviewRecordPath: string;
  learningLogEntry: string;
  nextTaskPacketDelta: string;
  reviewerApproved: boolean;
  containsLocalPath: boolean;
};

export type BundleDecisionLedger = {
  statusSample: BundleDecisionLedgerMode;
  decisions: BundleDecision[];
  sourceDiffBundleWorkspace: DiffBundleRollbackEvidenceWorkspace;
  copyCodexPrompt: string;
};

export type BundleDecisionLedgerReview = {
  status: ArtifactEvidenceStatus;
  appliedCount: number;
  rejectedCount: number;
  deferredCount: number;
  issues: string[];
};

export type DiffBundleDecision = {
  decisionId: string;
  bundleId: string;
  targetFile: string;
  status: DiffBundleDecisionStatus;
  decisionOwner: string;
  decisionReason: string;
  reviewRecordPath: string;
  verificationEvidencePath: string;
  learningLogEntry: string;
  rollbackPlanPath: string;
  rollbackConfirmed: boolean;
  adoptedVerificationCommands: string[];
  aiddSpecConnections: string[];
  containsLocalPath: boolean;
};

export type DiffBundleDecisionLedger = {
  statusSample: DiffBundleDecisionLedgerMode;
  decisions: DiffBundleDecision[];
  sourceDiffBundleWorkspace: DiffBundleRollbackEvidenceWorkspace;
  standardDocument: string;
  copyCodexPrompt: string;
};

export type DiffBundleDecisionLedgerReview = {
  status: ArtifactEvidenceStatus;
  adoptedCount: number;
  rejectedCount: number;
  deferredCount: number;
  undecidedCount: number;
  issues: string[];
};

export type AdoptedBundleExportItem = {
  exportId: string;
  sourceDecisionId: string;
  sourceBundleId: string;
  sourceDecisionStatus: DiffBundleDecisionStatus;
  targetFile: string;
  markdownBody: string;
  reviewEvidencePath: string;
  verificationEvidencePath: string;
  verificationCommands: string[];
  rollbackCondition: string;
  learningLogEntry: string;
  aiddSpecConnections: string[];
  containsLocalPath: boolean;
};

export type AdoptedBundleExporter = {
  statusSample: AdoptedBundleExporterMode;
  exports: AdoptedBundleExportItem[];
  standardDocument: string;
  sourceDecisionLedger: DiffBundleDecisionLedger;
  copyCodexPrompt: string;
};

export type AdoptedBundleExporterReview = {
  status: ArtifactEvidenceStatus;
  adoptedExportCount: number;
  blockedBundleCount: number;
  issues: string[];
};

export type ExportedPacketPreflightItem = {
  packetId: string;
  sourceExportId: string;
  sourceDecisionStatus: DiffBundleDecisionStatus;
  targetFile: string;
  markdownBody: string;
  browserProjects: string[];
  verificationDepth: "none" | "shallow" | "standard";
  evidencePaths: string[];
  rollbackPlan: string;
  aiddSpecConnections: string[];
  containsLocalPath: boolean;
};

export type ExportedPacketPreflightReviewer = {
  statusSample: ExportedPacketPreflightReviewerMode;
  packets: ExportedPacketPreflightItem[];
  sourceExporter: AdoptedBundleExporter;
  reviewChecklist: string[];
  copyCodexPrompt: string;
};

export type ExportedPacketPreflightReviewerReview = {
  status: ArtifactEvidenceStatus;
  readyPacketCount: number;
  blockedPacketCount: number;
  issues: string[];
};

export type RunAuthorizationGate = {
  statusSample: RunAuthorizationGateMode;
  preflightStatus: ArtifactEvidenceStatus;
  approver: string;
  authorizationReason: string;
  codexCommand: string;
  sandboxMode: string;
  verificationCommands: string[];
  browserProjects: string[];
  evidencePath: string;
  rollbackPlan: string;
  aiddSpecConnections: string[];
  reviewFindings: string[];
};

export type RunAuthorizationGateReview = {
  status: ArtifactEvidenceStatus;
  issues: string[];
};

export type CodexRunQueueItemStatus = "waiting" | "running" | "succeeded" | "failed" | "evidence_missing";

export type CodexRunQueueItem = {
  id: string;
  sourceAuthorizationId: string;
  sourceAuthorizationStatus: ArtifactEvidenceStatus;
  status: CodexRunQueueItemStatus;
  codexCommand: string;
  sandboxMode: string;
  startedAt: string;
  finishedAt: string;
  requiredVerificationCommands: string[];
  actualVerificationResults: string[];
  browserProjects: string[];
  evidencePaths: string[];
  retryPolicy: string;
  rollbackPlan: string;
  reviewFindings: string[];
  aiddSpecConnections: string[];
};

export type CodexRunQueueMode = "empty" | "valid" | "failure";

export type CodexRunQueueReview = {
  status: ArtifactEvidenceStatus;
  issues: string[];
};

export type RunResultReviewOutcome = "passed" | "failed" | "needs_evidence";

export type RunResultFindingCategory =
  | "terminal_evidence"
  | "screenshot_evidence"
  | "browser_coverage"
  | "doctor_gate"
  | "rollback"
  | "privacy"
  | "prompt_delta";

export type RunResultFindingSeverity = "info" | "warning" | "critical";

export type RunResultFinding = {
  id: string;
  category: RunResultFindingCategory;
  severity: RunResultFindingSeverity;
  observedBy: string;
  idealState: string;
  fixInstruction: string;
  neededUpstreamInfo: string[];
  standardUpdate: string;
  codexPromptDelta: string;
  verification: string;
};

export type RunResultReviewMode = "empty" | "valid" | "failure";

export type RunResultReview = {
  statusSample: RunResultReviewMode;
  sourceRunId: string;
  outcome: RunResultReviewOutcome;
  score: number;
  findings: RunResultFinding[];
  neededUpstreamInfo: string[];
  aiTaskPacketDelta: string[];
  codexPromptDelta: string;
  verificationCommands: string[];
  reviewRecordLinks: string[];
  learningLogEntries: string[];
  aiddSpecConnections: string[];
};

export type RunResultReviewEvaluation = {
  status: ArtifactEvidenceStatus;
  outcome: RunResultReviewOutcome;
  score: number;
  findings: RunResultFinding[];
};

export type ReviewRecord = {
  score: number;
  passed: boolean;
  findings: ReviewFinding[];
  remainingRisks: string[];
};

export type LearningLog = {
  whatWorked: string[];
  whatFailed: string[];
  specUpdatesNeeded: string[];
  nextTaskPacketDelta: string[];
  codexPromptDelta: string;
};

export type IntakeInput = {
  appName: string;
  appType: string;
  targetUser: string;
  userProblem: string;
  keyFeaturesText: string;
  nonGoalsText: string;
  externalIntegrationsText: string;
  stateContract: StateContract[];
  qualityGates: QualityGate[];
  selectedTemplateId: AppTypeTemplateId | "";
  appliedTemplateId: AppTypeTemplateId | "";
  verificationRun?: VerificationRun;
};

export type IntakeDraft = {
  appName: string;
  appType: string;
  targetUser: string;
  userProblem: string;
  keyFeatures: string[];
  nonGoals: string[];
  externalIntegrations: string[];
  stateContract: StateContract[];
  qualityGates: QualityGate[];
  selectedTemplateId: AppTypeTemplateId | "";
  appliedTemplateId: AppTypeTemplateId | "";
  templateName: string;
  templateRisks: string[];
  templateEvidenceRequirements: string[];
  verificationRun: VerificationRun;
};

export type ReadinessReview = {
  status: ReadinessStatus;
  score: number;
  missingFields: string[];
  recommendedNextQuestions: string[];
};

const REQUIRED_GATES: QualityGate[] = ["lint", "typecheck", "test", "build"];
export const REQUIRED_VERIFICATION_GATES: VerificationGateId[] = ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd"];
export const REQUIRED_CI_ARTIFACTS = ["coverage", "playwright-report", "test-results", "terminal-evidence"] as const;
export const REQUIRED_GITHUB_TOKEN_SCOPES = ["actions:read", "contents:read"] as const;
export const REQUIRED_WORKFLOW_GATES = [
  "pnpm install --frozen-lockfile",
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run test:coverage",
  "pnpm run build",
  "pnpm run doctor:aidd",
  "pnpm run mock:doctor",
  "pnpm run test:e2e"
] as const;
export const REQUIRED_WORKFLOW_ARTIFACT_PATHS = [
  "coverage",
  "playwright-report",
  "test-results",
  "experiments/aidd-control-plane-mvp-019/artifacts/terminal"
] as const;
export const REQUIRED_AIDD_SPEC_CONNECTIONS = ["Verification Evidence", "Review Record", "Learning Log", "AI Task Packet Delta", "AIDD-Spec更新候補"] as const;

export const REQUIRED_EVIDENCE_REPAIRS: Record<EvidenceRequirementId, Omit<EvidenceGapRepair, "id">> = {
  coverage: {
    label: "coverage",
    severity: "high",
    affectedArtifact: "Verification Evidence / Test Coverage Artifact",
    fixInstruction: "coverage artifactをCI artifactsとArtifact Evidence Binderに追加する",
    rerunCommand: "pnpm run test",
    codexPromptDelta: "coverage artifactが欠けているため、テスト実行後のcoverage出力をCI artifactへ保存する指示を追加する。"
  },
  "playwright-report": {
    label: "playwright-report",
    severity: "critical",
    affectedArtifact: "Verification Evidence / Browser E2E Report",
    fixInstruction: "playwright-report artifactとPlaywright report URLを同じ実行単位で保存する",
    rerunCommand: "pnpm run test:e2e",
    codexPromptDelta: "playwright-reportが欠けているため、3ブラウザE2E後にPlaywright reportをartifact化する指示を追加する。"
  },
  "test-results": {
    label: "test-results",
    severity: "high",
    affectedArtifact: "Verification Evidence / Test Results Artifact",
    fixInstruction: "test-results artifactをCI artifactsに追加し、失敗時のtraceをReview Recordへ紐づける",
    rerunCommand: "pnpm run test:e2e",
    codexPromptDelta: "test-resultsが欠けているため、E2Eのtrace/test-results保存を完了条件へ追加する。"
  },
  "terminal-evidence": {
    label: "terminal-evidence",
    severity: "critical",
    affectedArtifact: "Verification Evidence / Terminal Evidence",
    fixInstruction: "lint/typecheck/test/build/e2e/doctor:aiddのterminal evidenceを保存する",
    rerunCommand: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd",
    codexPromptDelta: "terminal-evidenceが欠けているため、全ゲートの実行ログをartifacts/terminalへ保存する指示を追加する。"
  },
  "empty-screenshot": {
    label: "empty screenshot",
    severity: "medium",
    affectedArtifact: "Screen Inventory / Verification Evidence",
    fixInstruction: "empty stateのスクリーンショットをassetsとartifacts/screenshotsへ保存する",
    rerunCommand: "node scripts/capture-mvp011.mjs",
    codexPromptDelta: "empty screenshotが欠けているため、初期状態の画面証跡をcapture scriptで保存する指示を追加する。"
  },
  "valid-screenshot": {
    label: "valid screenshot",
    severity: "medium",
    affectedArtifact: "Screen Inventory / Verification Evidence",
    fixInstruction: "valid sampleのスクリーンショットをassetsとartifacts/screenshotsへ保存する",
    rerunCommand: "node scripts/capture-mvp011.mjs",
    codexPromptDelta: "valid screenshotが欠けているため、証跡不足0件の画面証跡をcapture scriptで保存する指示を追加する。"
  },
  "failure-screenshot": {
    label: "failure screenshot",
    severity: "high",
    affectedArtifact: "Review Record / Learning Log / Screen Inventory",
    fixInstruction: "failure sampleのスクリーンショットを保存し、複数不足のReview Findingを確認する",
    rerunCommand: "node scripts/capture-mvp011.mjs",
    codexPromptDelta: "failure screenshotが欠けているため、複数不足が決定的に表示される画面証跡を保存する指示を追加する。"
  }
};

const GATE_COMMANDS: Record<VerificationGateId, string> = {
  lint: "pnpm run lint",
  typecheck: "pnpm run typecheck",
  test: "pnpm run test",
  build: "pnpm run build",
  e2e: "pnpm run test:e2e",
  "doctor:aidd": "pnpm run doctor:aidd"
};

const GATE_LABELS: Record<VerificationGateId, string> = {
  lint: "lint",
  typecheck: "typecheck",
  test: "test",
  build: "build",
  e2e: "e2e",
  "doctor:aidd": "doctor:aidd"
};

export function getAppTypeTemplate(templateId: AppTypeTemplateId | ""): AppTypeTemplate | undefined {
  return APP_TYPE_TEMPLATES.find((template) => template.id === templateId);
}

export function parseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function buildIntakeDraft(input: IntakeInput): IntakeDraft {
  const appliedTemplate = getAppTypeTemplate(input.appliedTemplateId);
  return {
    appName: input.appName.trim(),
    appType: input.appType.trim(),
    targetUser: input.targetUser.trim(),
    userProblem: input.userProblem.trim(),
    keyFeatures: parseLines(input.keyFeaturesText),
    nonGoals: parseLines(input.nonGoalsText),
    externalIntegrations: parseLines(input.externalIntegrationsText),
    stateContract: [...input.stateContract],
    qualityGates: [...input.qualityGates],
    selectedTemplateId: input.selectedTemplateId,
    appliedTemplateId: input.appliedTemplateId,
    templateName: appliedTemplate?.name ?? "",
    templateRisks: appliedTemplate ? [...appliedTemplate.risks] : [],
    templateEvidenceRequirements: appliedTemplate ? [...appliedTemplate.evidenceRequirements] : [],
    verificationRun: input.verificationRun ?? createInitialVerificationRun()
  };
}

export function evaluateReadiness(draft: IntakeDraft): ReadinessReview {
  const isEmpty =
    draft.appName.length === 0 &&
    draft.targetUser.length === 0 &&
    draft.userProblem.length === 0 &&
    draft.keyFeatures.length === 0 &&
    draft.selectedTemplateId.length === 0;

  const missingFields: string[] = [];
  if (!draft.appName) missingFields.push("アプリ名");
  if (!draft.appType) missingFields.push("アプリ種別");
  if (!draft.targetUser) missingFields.push("対象ユーザー");
  if (!draft.userProblem) missingFields.push("解決したい問題");
  if (!draft.selectedTemplateId) missingFields.push("テンプレート未選択");
  if (draft.selectedTemplateId && draft.selectedTemplateId !== draft.appliedTemplateId) missingFields.push("テンプレート未適用");
  if (draft.appliedTemplateId && !draft.templateName) missingFields.push("テンプレート定義が見つかりません");
  if (draft.keyFeatures.length < 2) missingFields.push("主要機能を2件以上");
  if (draft.stateContract.length < 2) missingFields.push("状態契約を2件以上");

  for (const gate of REQUIRED_GATES) {
    if (!draft.qualityGates.includes(gate)) missingFields.push(`品質ゲート: ${gate}`);
  }

  const verification = evaluateVerificationRun(draft.verificationRun);
  for (const issue of verification.issues) {
    missingFields.push(issue);
  }

  const completedChecks = [
    Boolean(draft.appName),
    Boolean(draft.appType),
    Boolean(draft.targetUser),
    Boolean(draft.userProblem),
    Boolean(draft.selectedTemplateId),
    Boolean(draft.appliedTemplateId && draft.selectedTemplateId === draft.appliedTemplateId && draft.templateName),
    draft.keyFeatures.length >= 2,
    draft.stateContract.length >= 2,
    ...REQUIRED_GATES.map((gate) => draft.qualityGates.includes(gate)),
    verification.ready
  ].filter(Boolean).length;
  const score = Math.round((completedChecks / 13) * 100);

  let status: ReadinessStatus = "draft";
  if (isEmpty) {
    status = "empty";
  } else if (missingFields.includes("テンプレート未選択") || missingFields.includes("テンプレート未適用")) {
    status = "insufficient";
  } else if (missingFields.length === 0) {
    status = "ready";
  } else if (completedChecks >= 3 || draft.keyFeatures.length > 0 || draft.stateContract.length > 0) {
    status = "insufficient";
  }

  return {
    status,
    score: status === "empty" ? 0 : score,
    missingFields,
    recommendedNextQuestions: buildRecommendedQuestions(draft, missingFields)
  };
}

export function generateProductBrief(draft: IntakeDraft): string {
  const name = draft.appName || "未命名アプリ";
  return [
    `# Product Brief: ${name}`,
    "",
    `## 何を作るか`,
    `${name}は、${draft.targetUser || "対象ユーザー未定"}が「${draft.userProblem || "未整理の課題"}」を解決するための${draft.appType || "アプリ"}です。`,
    "",
    "## 主要機能",
    formatList(draft.keyFeatures, "主要機能は未入力です。"),
    "",
    "## App Type Template",
    draft.templateName ? `- ${draft.templateName}` : "- テンプレートは未適用です。",
    "",
    "## テンプレートのリスク",
    formatList(draft.templateRisks, "テンプレートリスクは未適用です。"),
    "",
    "## 証跡要件",
    formatList(draft.templateEvidenceRequirements, "証跡要件は未適用です。"),
    "",
    "## 作らないもの",
    formatList(draft.nonGoals, "非ゴールは未入力です。"),
    "",
    "## 外部連携",
    formatList(draft.externalIntegrations, "外部連携はありません。"),
    "",
    "## 状態契約",
    formatList(draft.stateContract, "状態契約は未選択です。"),
    "",
    "## Verification Evidence / Review Record / Learning Log",
    formatVerificationRunMarkdown(draft.verificationRun)
  ].join("\n");
}

export function generateTaskPacket(draft: IntakeDraft): string {
  const reviewRecord = generateReviewRecord(draft.verificationRun, draft.templateRisks);
  const learningLog = generateLearningLog(reviewRecord);
  return [
    `spec_version: "AIDD-Spec v0.1"`,
    `task_id: "${slugify(draft.appName || "untitled-app")}"`,
    `conformance_target: "L2"`,
    "product_brief:",
    `  name: "${escapeYaml(draft.appName || "未命名アプリ")}"`,
    `  app_type: "${escapeYaml(draft.appType || "未選択")}"`,
    `  app_type_template: "${escapeYaml(draft.templateName || "未適用")}"`,
    `  target_user: "${escapeYaml(draft.targetUser || "未入力")}"`,
    `  user_problem: "${escapeYaml(draft.userProblem || "未入力")}"`,
    "  key_features:",
    formatYamlList(draft.keyFeatures),
    "  non_goals:",
    formatYamlList(draft.nonGoals),
    "system_contract:",
    "  external_integrations:",
    formatYamlList(draft.externalIntegrations),
    "experience_contract:",
    "  state_contract:",
    formatYamlList(draft.stateContract),
    "quality_gates:",
    formatYamlList(draft.qualityGates),
    "risk_contract:",
    "  template_risks:",
    formatYamlList(draft.templateRisks),
    "  evidence_requirements:",
    formatYamlList(draft.templateEvidenceRequirements),
    "verification_run:",
    `  ready: ${evaluateVerificationRun(draft.verificationRun).ready ? "true" : "false"}`,
    "  required_gates:",
    formatYamlList(REQUIRED_VERIFICATION_GATES),
    "  gates:",
    ...draft.verificationRun.gates.map(
      (gate) =>
        `    - id: "${gate.id}"\n      status: "${gate.status}"\n      command: "${escapeYaml(gate.command)}"\n      evidence_file: "${escapeYaml(gate.evidenceFile || "未登録")}"`
    ),
    "  browser_e2e:",
    `    chromium: "${draft.verificationRun.browserE2E.chromium}"`,
    `    firefox: "${draft.verificationRun.browserE2E.firefox}"`,
    `    webkit: "${draft.verificationRun.browserE2E.webkit}"`,
    "  terminal_evidence:",
    formatYamlList(draft.verificationRun.terminalEvidence),
    "  screenshot_evidence:",
    formatYamlList(draft.verificationRun.screenshotEvidence),
    "  artifact_evidence_binder:",
    `    status: "${evaluateArtifactEvidenceBinder(draft.verificationRun.artifactBinder).status}"`,
    `    ci_run_url: "${escapeYaml(draft.verificationRun.artifactBinder.ciRunUrl || "未登録")}"`,
    `    ci_artifact_url: "${escapeYaml(draft.verificationRun.artifactBinder.ciArtifactUrl || "未登録")}"`,
    `    playwright_report_url: "${escapeYaml(draft.verificationRun.artifactBinder.playwrightReportUrl || "未登録")}"`,
    `    generated_at: "${escapeYaml(draft.verificationRun.artifactBinder.generatedAt || "未登録")}"`,
    "    terminal_evidence:",
    formatYamlList(draft.verificationRun.artifactBinder.terminalEvidence),
    "    screenshot_evidence:",
    formatYamlList(draft.verificationRun.artifactBinder.screenshotEvidence),
    "  evidence_gap_repair_planner:",
    `    status: "${evaluateEvidenceGapRepairPlan(draft.verificationRun).status}"`,
    `    missing_count: ${evaluateEvidenceGapRepairPlan(draft.verificationRun).missingCount}`,
    "    repairs:",
    ...formatEvidenceRepairsYaml(evaluateEvidenceGapRepairPlan(draft.verificationRun).repairs),
    "  ci_artifact_importer:",
    `    workflow_name: "${escapeYaml(draft.verificationRun.artifactBinder.ciSummary.workflowName || "未登録")}"`,
    `    commit_sha: "${escapeYaml(draft.verificationRun.artifactBinder.ciSummary.commitSha || "未登録")}"`,
    "    jobs:",
    ...draft.verificationRun.artifactBinder.ciSummary.jobs.map((job) => `      - name: "${escapeYaml(job.name)}"\n        status: "${job.status}"`),
    "    artifacts:",
    formatYamlList(draft.verificationRun.artifactBinder.ciSummary.artifacts),
    "review_record:",
    `  score: ${reviewRecord.score}`,
    `  passed: ${reviewRecord.passed ? "true" : "false"}`,
    "  findings:",
    formatYamlList(reviewRecord.findings.map((finding) => `${finding.severity}: ${finding.finding}`)),
    "learning_log:",
    "  spec_updates_needed:",
    formatYamlList(learningLog.specUpdatesNeeded),
    "  next_ai_task_packet_delta:",
    formatYamlList(learningLog.nextTaskPacketDelta),
    "expected_output:",
    "  - Product Brief",
    "  - AI Task Packet",
    "  - Verification Plan",
    "  - Codex Prompt",
    "  - Readiness Review"
  ].join("\n");
}

export function generateVerificationPlan(draft: IntakeDraft): string {
  const states = draft.stateContract.length > 0 ? draft.stateContract : ["empty"];
  const gates = draft.qualityGates.length > 0 ? draft.qualityGates : REQUIRED_GATES;
  return [
    "# Verification Plan",
    "",
    "## 状態確認",
    ...states.map((state) => `- [ ] ${state} 状態がUIで確認できる`),
    "",
    "## 品質ゲート",
    ...gates.map((gate) => `- [ ] pnpm run ${gate}`),
    "",
    "## Verification Run Tracker",
    ...draft.verificationRun.gates.map((gate) => `- [ ] ${gate.label}: ${gate.command} / ${gate.status} / evidence: ${gate.evidenceFile || "未登録"}`),
    "- [ ] Chromium / Firefox / WebKit のE2E成功を確認する",
    "- [ ] terminal evidence と screenshot evidence をVerification Evidenceとして保存する",
    "- [ ] CI Artifact Importerにrun URL、commit SHA、workflow、job、artifact、Playwright report URLを取り込む",
    "- [ ] Artifact Evidence BinderにCI run URL、CI artifact URL、Playwright report URLを束ねる",
    "- [ ] Evidence Gap Repair Plannerでcoverage / playwright-report / test-results / terminal-evidence / empty screenshot / valid screenshot / failure screenshotの不足を確認する",
    "- [ ] Review Recordにpass/fail/findings/remaining riskを残す",
    "- [ ] Learning Logに失敗・修正・次回Spec改善点を残す",
    "",
    "## App Type Template",
    `- [ ] ${draft.templateName || "テンプレート未適用"} のリスクをレビューする`,
    ...draft.templateRisks.map((risk) => `- [ ] リスク確認: ${risk}`),
    "",
    "## 証跡要件",
    ...withFallback(draft.templateEvidenceRequirements, ["テンプレートを適用し、必要な証跡を確定する"]).map((requirement) => `- [ ] ${requirement}`),
    "",
    "## 受け入れ条件",
    `- [ ] ${draft.appName || "対象アプリ"}のProduct Briefが生成される`,
    "- [ ] AI Task Packetに主要機能と非ゴールが含まれる",
    "- [ ] Codex Promptに状態契約と品質ゲートが含まれる"
  ].join("\n");
}

export function generateCodexPrompt(draft: IntakeDraft): string {
  return [
    `あなたはAIDD-Spec v0.1に沿って「${draft.appName || "未命名アプリ"}」を実装するAIエージェントです。`,
    "",
    "## 目的",
    `${draft.targetUser || "対象ユーザー未定"}の「${draft.userProblem || "未整理の課題"}」を解決する${draft.appType || "アプリ"}を作ってください。`,
    "",
    "## 必要な機能",
    formatList(draft.keyFeatures, "主要機能を確認してから実装してください。"),
    "",
    "## App Type Template",
    draft.templateName ? `- ${draft.templateName}` : "- テンプレートを選択して適用してください。",
    "",
    "## リスク",
    formatList(draft.templateRisks, "テンプレートリスクを確認してください。"),
    "",
    "## 証跡要件",
    formatList(draft.templateEvidenceRequirements, "必要な証跡を確認してください。"),
    "",
    "## 作らないもの",
    formatList(draft.nonGoals, "非ゴールを確認してください。"),
    "",
    "## 状態契約",
    formatList(draft.stateContract, "empty と error は最低限確認してください。"),
    "",
    "## 品質ゲート",
    formatList(draft.qualityGates, "lint / typecheck / test / build を通してください。"),
    "",
    "## Verification Run",
    formatVerificationRunMarkdown(draft.verificationRun),
    "",
    "## Review Record / Learning Log",
    generateLearningLog(generateReviewRecord(draft.verificationRun, draft.templateRisks)).codexPromptDelta,
    "",
    "## 完了条件",
    "- Product Brief、AI Task Packet、Verification Plan、Readiness Reviewを更新する",
    "- Verification Evidence、Review Record、Learning Logに実行結果と必要証跡を残す",
    "- Evidence Gap Repair Plannerの不足0件を確認し、不足があれば修正指示、再実行コマンド、Codex Prompt Deltaを反映する",
    "- CI Artifact Importerでcommit SHA、workflow、job、artifact URLを確認する",
    "- 外部通信やブラウザ保存領域に依存しない"
  ].join("\n");
}

export function createInitialVerificationRun(): VerificationRun {
  return buildVerificationRun("初期状態", "未実行", {
    summary: "まだ実行されていません。terminal evidenceとscreenshot evidenceが未登録です。",
    evidence: "",
    artifactBinder: createEmptyArtifactEvidenceBinder()
  });
}

export function createSuccessVerificationRun(): VerificationRun {
  return {
    title: "validサンプル",
    gates: REQUIRED_VERIFICATION_GATES.map((id) => ({
      id,
      label: GATE_LABELS[id],
      status: "成功",
      command: GATE_COMMANDS[id],
      summary: `${GATE_LABELS[id]}は成功しました。`,
      evidenceFile: `experiments/aidd-control-plane-mvp-006/artifacts/terminal/${id.replace(":", "-")}.txt`
    })),
    browserE2E: {
      chromium: "成功",
      firefox: "成功",
      webkit: "成功"
    },
    terminalEvidence: [
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/lint.txt",
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/typecheck.txt",
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/test.txt",
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/build.txt",
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/e2e.txt",
      "experiments/aidd-control-plane-mvp-006/artifacts/terminal/doctor-aidd.txt"
    ],
    screenshotEvidence: [
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-empty.png",
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-valid.png",
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-failure.png",
      "assets/aidd-control-plane-mvp011-valid.png"
    ],
    artifactBinder: createValidArtifactEvidenceBinder()
  };
}

export function createFailureVerificationRun(): VerificationRun {
  const run = createSuccessVerificationRun();
  return {
    ...run,
    title: "失敗サンプル",
    gates: run.gates.map((gate) =>
      gate.id === "e2e" || gate.id === "doctor:aidd"
        ? {
            ...gate,
            status: "失敗",
            summary: gate.id === "e2e" ? "WebKitで証跡確認に失敗しました。" : "Verification Run Trackerの必須文言検査に失敗しました。"
          }
        : gate
    ),
    browserE2E: {
      chromium: "成功",
      firefox: "成功",
      webkit: "失敗"
    },
    screenshotEvidence: [],
    artifactBinder: createFailureArtifactEvidenceBinder()
  };
}

export function createEvidenceMissingVerificationRun(): VerificationRun {
  const run = createSuccessVerificationRun();
  return {
    ...run,
    title: "証跡不足サンプル",
    gates: run.gates.map((gate) =>
      gate.id === "e2e" || gate.id === "doctor:aidd"
        ? {
            ...gate,
            status: "証跡不足",
            summary: `${gate.label}のコマンドは成功しましたが、evidence fileが足りません。`,
            evidenceFile: ""
          }
        : gate
    ),
    terminalEvidence: [],
    screenshotEvidence: ["experiments/aidd-control-plane-mvp-006/artifacts/screenshots/aidd-control-plane-mvp006-evidence-missing.png"],
    artifactBinder: createEmptyArtifactEvidenceBinder()
  };
}

export function createEmptyArtifactEvidenceBinder(): ArtifactEvidenceBinder {
  return {
    statusSample: "empty",
    terminalEvidence: [],
    screenshotEvidence: [],
    ciRunUrl: "",
    ciArtifactUrl: "",
    playwrightReportUrl: "",
    generatedAt: "",
    ciSummary: createEmptyCiArtifactImport()
  };
}

export function createValidArtifactEvidenceBinder(): ArtifactEvidenceBinder {
  return {
    statusSample: "valid",
    terminalEvidence: [
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/lint.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/typecheck.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/test.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/build.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/e2e.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/doctor-aidd.txt"
    ],
    screenshotEvidence: [
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-empty.png",
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-valid.png",
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-failure.png",
      "experiments/aidd-control-plane-mvp-011/artifacts/screenshots/aidd-control-plane-mvp011-terminal-evidence.png"
    ],
    ciRunUrl: exampleUrl("github.example.test/aidd-lab/aidd-control-plane/actions/runs/9010"),
    ciArtifactUrl: exampleUrl("github.example.test/aidd-lab/aidd-control-plane/actions/runs/9010/artifacts/terminal-evidence"),
    playwrightReportUrl: exampleUrl("reports.example.test/aidd-control-plane-mvp-010/playwright/index.html"),
    generatedAt: "2026-06-30T09:00:00.000Z",
    ciSummary: createValidCiArtifactImport()
  };
}

export function createFailureArtifactEvidenceBinder(): ArtifactEvidenceBinder {
  return {
    statusSample: "failure",
    terminalEvidence: [
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/lint.txt",
      "experiments/aidd-control-plane-mvp-008/artifacts/terminal/e2e-stale.txt"
    ],
    screenshotEvidence: [],
    ciRunUrl: "not-a-ci-url",
    ciArtifactUrl: "",
    playwrightReportUrl: "broken-report-url",
    generatedAt: "2026-05-01T00:00:00.000Z",
    ciSummary: createFailureCiArtifactImport()
  };
}

export function createEmptyCiArtifactImport(): CiArtifactImport {
  return { workflowName: "", commitSha: "", runUrl: "", artifacts: [], jobs: [], playwrightReportUrl: "", fetchPlan: createEmptyGitHubActionsFetchPlan() };
}

export function createValidCiArtifactImport(): CiArtifactImport {
  const runUrl = exampleUrl("github.example.test/aidd-lab/aidd-control-plane/actions/runs/9010");
  return {
    workflowName: "AIDD Control Plane MVP 010 CI",
    commitSha: "9f4c2d1a8b7e6c5d4a3b2c1d0e9f8a7b6c5d4e3f",
    runUrl,
    artifacts: [...REQUIRED_CI_ARTIFACTS],
    jobs: REQUIRED_VERIFICATION_GATES.map((gate) => ({ name: gate, status: "成功" as const })),
    playwrightReportUrl: exampleUrl("reports.example.test/aidd-control-plane-mvp-010/playwright/index.html"),
    fetchPlan: parseGitHubActionsRunUrl(runUrl)
  };
}

export function createFailureCiArtifactImport(): CiArtifactImport {
  return {
    workflowName: "",
    commitSha: "abc123",
    runUrl: "broken-ci-run",
    artifacts: ["coverage"],
    jobs: [
      { name: "lint", status: "成功" },
      { name: "typecheck", status: "成功" },
      { name: "test", status: "失敗" },
      { name: "build", status: "未実行" }
    ],
    playwrightReportUrl: "broken-report",
    fetchPlan: {
      ...parseGitHubActionsRunUrl(exampleUrl("github.example.test/aidd-control-plane/actions/runs/")),
      tokenScopes: ["contents:read"],
      requiredArtifacts: ["coverage", "test-results"]
    }
  };
}

export function createEmptyCiWorkflowArtifactAuditor(): CiWorkflowArtifactAuditor {
  return {
    statusSample: "empty",
    workflowPath: "",
    configuredGates: [],
    configuredArtifactPaths: [],
    aiddSpecConnections: [],
    captureCommand: "",
    terminalEvidencePath: ""
  };
}

export function createValidCiWorkflowArtifactAuditor(): CiWorkflowArtifactAuditor {
  return {
    statusSample: "valid",
    workflowPath: ".github/workflows/aidd-control-plane.yml",
    configuredGates: [...REQUIRED_WORKFLOW_GATES],
    configuredArtifactPaths: [...REQUIRED_WORKFLOW_ARTIFACT_PATHS],
    aiddSpecConnections: [...REQUIRED_AIDD_SPEC_CONNECTIONS],
    captureCommand: "pnpm run capture:mvp019",
    terminalEvidencePath: "experiments/aidd-control-plane-mvp-019/artifacts/terminal"
  };
}

export function createFailureCiWorkflowArtifactAuditor(): CiWorkflowArtifactAuditor {
  return {
    statusSample: "failure",
    workflowPath: ".github/workflows/aidd-control-plane.yml",
    configuredGates: ["pnpm install --frozen-lockfile", "pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build"],
    configuredArtifactPaths: ["coverage", "experiments/aidd-control-plane-mvp-019/artifacts/terminal"],
    aiddSpecConnections: ["Verification Evidence", "Review Record"],
    captureCommand: "",
    terminalEvidencePath: "experiments/aidd-control-plane-mvp-019/artifacts/terminal"
  };
}

export function evaluateCiWorkflowArtifactAuditor(auditor: CiWorkflowArtifactAuditor): CiWorkflowArtifactAudit {
  const missingWorkflow = auditor.workflowPath !== ".github/workflows/aidd-control-plane.yml";
  const missingGates = REQUIRED_WORKFLOW_GATES.filter((gate) => !auditor.configuredGates.includes(gate));
  const missingArtifactPaths = REQUIRED_WORKFLOW_ARTIFACT_PATHS.filter((artifactPath) => !auditor.configuredArtifactPaths.includes(artifactPath));
  const missingSpecConnections = REQUIRED_AIDD_SPEC_CONNECTIONS.filter((connection) => !auditor.aiddSpecConnections.includes(connection));
  const missingCaptureCommand = auditor.captureCommand !== "pnpm run capture:mvp019";

  const reviewFindings: ReviewFinding[] = [];
  if (missingWorkflow) {
    reviewFindings.push(
      buildFinding(
        "CI Workflow Artifact Auditor",
        "high",
        ".github/workflows/aidd-control-plane.ymlが未接続",
        "repo rootの.github/workflows/aidd-control-plane.ymlを追加し、generated-repoをworking-directoryにする",
        ["CI gate", "Verification Evidence"],
        "pnpm run doctor:aidd"
      )
    );
  }
  for (const gate of missingGates) {
    reviewFindings.push(
      buildFinding(
        "CI Workflow Artifact Auditor",
        gate.includes("test:e2e") || gate.includes("doctor:aidd") ? "high" : "medium",
        `${gate} gateがworkflowから不足`,
        `${gate}をGitHub Actions workflowへ追加し、terminal evidenceへ保存する`,
        ["Test Plan", "Verification Evidence"],
        "pnpm run doctor:aidd"
      )
    );
  }
  for (const artifactPath of missingArtifactPaths) {
    reviewFindings.push(
      buildFinding(
        "CI Workflow Artifact Auditor",
        artifactPath.includes("playwright") || artifactPath.includes("test-results") ? "high" : "medium",
        `${artifactPath} artifact保存が不足`,
        `${artifactPath}をactions/upload-artifactのpathへ追加する`,
        ["Verification Evidence", "Review Record", "Learning Log"],
        "pnpm run doctor:aidd"
      )
    );
  }
  for (const connection of missingSpecConnections) {
    reviewFindings.push(
      buildFinding(
        "CI Workflow Artifact Auditor",
        "medium",
        `${connection}への接続説明が不足`,
        `workflow artifact保存を${connection}へ戻す説明をUIとdocsへ追加する`,
        [connection],
        "pnpm run doctor:aidd"
      )
    );
  }
  if (missingCaptureCommand) {
    reviewFindings.push(
      buildFinding(
        "CI Workflow Artifact Auditor",
        "high",
        "capture:mvp019がworkflow監査に接続されていません",
        "capture:mvp019でempty/valid/failure/terminal evidenceを../artifacts/screenshotsへ保存する",
        ["Screen Inventory", "Verification Evidence"],
        "pnpm run capture:mvp019"
      )
    );
  }

  const status: ArtifactEvidenceStatus =
    reviewFindings.length === 0
      ? "valid"
      : auditor.statusSample === "empty" && auditor.configuredGates.length === 0 && auditor.configuredArtifactPaths.length === 0
        ? "empty"
        : "failure";
  return {
    status,
    missingWorkflow,
    missingGates,
    missingArtifactPaths,
    missingSpecConnections,
    missingCaptureCommand,
    reviewFindings,
    aiTaskPacketDelta:
      reviewFindings.length > 0
        ? reviewFindings.map((finding) => `${finding.finding}: ${finding.fixInstruction}`)
        : ["CI workflowは必須gateとartifact保存を宣言済み。GitHub Actions成功後にartifact URLをVerification Evidenceへ貼る。"],
    specUpdateCandidates:
      reviewFindings.length > 0
        ? Array.from(new Set(reviewFindings.flatMap((finding) => finding.neededUpstreamInfo)))
        : ["CI gate", "Verification Evidence", "Review Record", "Learning Log"]
  };
}

export function createEmptySpecUpdateProposalQueue(): SpecUpdateProposalQueue {
  return { statusSample: "empty", proposals: [] };
}

export function createValidSpecUpdateProposalQueue(reviewRecord: ReviewRecord, learningLog: LearningLog): SpecUpdateProposalQueue {
  const sourceFinding = reviewRecord.findings.find((finding) => finding.severity !== "low") ?? reviewRecord.findings[0];
  const fallbackFinding = sourceFinding ?? buildFinding("残リスク", "low", "主要ゲートは成功", "成功条件を標準へ戻す", ["Learning Log"], "pnpm run doctor:aidd");
  const specUpdate = learningLog.specUpdatesNeeded[0] ?? fallbackFinding.neededUpstreamInfo[0] ?? "Verification Evidence";
  return {
    statusSample: "valid",
    proposals: [
      {
        finding: fallbackFinding.finding,
        idealState: "Review FindingとLearning Logから、次回のAIDD-Spec標準更新候補を必須フィールド付きで起票できる。",
        neededUpstreamInfo: Array.from(new Set([...fallbackFinding.neededUpstreamInfo, ...learningLog.specUpdatesNeeded])),
        targetStandardDocument: "standards/aidd-control-plane-mvp-v0.1.md",
        targetField: `${specUpdate}.spec_update_proposal`,
        priority: fallbackFinding.severity === "high" ? "high" : fallbackFinding.severity === "medium" ? "medium" : "low",
        acceptanceCriteria: [
          "finding、ideal state、needed upstream info、target standard document、target field、priorityが表示される",
          "acceptance criteria、codex prompt delta、verification commandが空ではない",
          "empty / valid / failureをUIとE2Eから切り替えて確認できる"
        ],
        codexPromptDelta: learningLog.codexPromptDelta,
        verificationCommand: fallbackFinding.verificationCommand
      }
    ]
  };
}

export function createFailureSpecUpdateProposalQueue(): SpecUpdateProposalQueue {
  return {
    statusSample: "failure",
    proposals: [
      {
        finding: "Review Findingはあるが、標準更新候補として完了判定できない。",
        idealState: "標準更新候補には対象文書、target field、acceptance criteria、Codex prompt delta、verification commandが揃っている。",
        neededUpstreamInfo: ["Review Record", "Learning Log"],
        targetStandardDocument: "",
        targetField: "Verification Evidence.spec_update_proposal",
        priority: "high",
        acceptanceCriteria: [],
        codexPromptDelta: "",
        verificationCommand: ""
      }
    ]
  };
}

export function evaluateSpecUpdateProposalQueue(queue: SpecUpdateProposalQueue): SpecUpdateProposalQueueReview {
  const issues: string[] = [];
  queue.proposals.forEach((proposal, index) => {
    const label = `Spec Update Proposal ${index + 1}`;
    if (!proposal.finding.trim()) issues.push(`${label}: findingが不足しています`);
    if (!proposal.idealState.trim()) issues.push(`${label}: ideal stateが不足しています`);
    if (proposal.neededUpstreamInfo.length === 0) issues.push(`${label}: needed upstream infoが不足しています`);
    if (!proposal.targetStandardDocument.trim()) issues.push(`${label}: 対象文書が不足しています`);
    if (!proposal.targetField.trim()) issues.push(`${label}: target fieldが不足しています`);
    if (proposal.acceptanceCriteria.length === 0) issues.push(`${label}: acceptance criteriaが不足しています`);
    if (!proposal.codexPromptDelta.trim()) issues.push(`${label}: Codex prompt deltaが不足しています`);
    if (!proposal.verificationCommand.trim()) issues.push(`${label}: verification commandが不足しています`);
  });

  if (issues.length === 0 && queue.proposals.length > 0) return { status: "valid", issues };
  if (queue.statusSample === "empty" && queue.proposals.length === 0) return { status: "empty", issues };
  return { status: "failure", issues };
}

export function createEmptyTaskPacketDeltaApplyPreview(): TaskPacketDeltaApplyPreview {
  return {
    statusSample: "empty",
    sourceProposal: "",
    targetPacketSection: "",
    beforeSummary: "",
    afterSummary: "",
    addedAcceptanceCriteria: [],
    addedVerificationCommands: [],
    codexPromptPatch: "",
    rollbackCondition: "",
    reviewChecklist: []
  };
}

export function createValidTaskPacketDeltaApplyPreview(proposalQueue: SpecUpdateProposalQueue): TaskPacketDeltaApplyPreview {
  const proposal =
    proposalQueue.proposals[0] ??
    createValidSpecUpdateProposalQueue(generateReviewRecord(createFailureVerificationRun()), generateLearningLog(generateReviewRecord(createFailureVerificationRun()))).proposals[0];
  return {
    statusSample: "valid",
    sourceProposal: proposal.finding,
    targetPacketSection: proposal.targetField || "Verification Evidence.spec_update_proposal",
    beforeSummary: "次回AI Task PacketはReview Findingを読むだけで、採用した標準更新候補が依頼本文へまだ反映されていない。",
    afterSummary: "AI Task Packetにacceptance criteria、verification command、rollback conditionを足し、Codex prompt patchで次回作業者が同じ不足を再確認できる。",
    addedAcceptanceCriteria: proposal.acceptanceCriteria,
    addedVerificationCommands: [proposal.verificationCommand].filter(Boolean),
    codexPromptPatch: [
      "Codex prompt patch:",
      `- source proposal: ${proposal.finding}`,
      `- target packet section: ${proposal.targetField || "Verification Evidence.spec_update_proposal"}`,
      "- 採用後は追加acceptance criteriaとverification commandを次回依頼に含める。",
      "- 不足した確認項目はReview RecordとLearning Logへ戻し、次回AI Task Packetで再確認できる形にする。"
    ].join("\n"),
    rollbackCondition: "追加したverification commandが失敗し、Review Findingの根拠が再現できない場合はproposal採用を戻して再レビューする。",
    reviewChecklist: [
      "source proposalとReview Findingの根拠が一致している",
      "target packet sectionがAIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続している",
      "added acceptance criteriaが次回AI Task Packetで実行可能になっている",
      "added verification commandsをCIまたはローカルで再実行できる",
      "rollback conditionが失敗時の戻し方として読める"
    ]
  };
}

export function createFailureTaskPacketDeltaApplyPreview(): TaskPacketDeltaApplyPreview {
  return {
    statusSample: "failure",
    sourceProposal: "",
    targetPacketSection: "",
    beforeSummary: "proposal採用前の差分説明だけがあり、根拠findingと戻し条件が未確定です。",
    afterSummary: "acceptance criteriaは足したいが、どのsectionへ反映するかと検証コマンドが決まっていません。",
    addedAcceptanceCriteria: ["採用後の画面にAI Task Packet Delta Apply Previewが表示される"],
    addedVerificationCommands: [],
    codexPromptPatch: "Codex prompt patch:\n- 根拠finding、target packet section、verification command、rollback conditionを補ってから採用する。",
    rollbackCondition: "",
    reviewChecklist: ["不足項目を埋めるまで採用しない"]
  };
}

export function evaluateTaskPacketDeltaApplyPreview(preview: TaskPacketDeltaApplyPreview): TaskPacketDeltaApplyPreviewReview {
  const issues: string[] = [];
  if (!preview.sourceProposal.trim()) issues.push("AI Task Packet Delta Apply Preview: 根拠finding不足");
  if (!preview.targetPacketSection.trim()) issues.push("AI Task Packet Delta Apply Preview: target packet section不足");
  if (preview.addedVerificationCommands.length === 0 || preview.addedVerificationCommands.every((command) => !command.trim())) {
    issues.push("AI Task Packet Delta Apply Preview: verification command不足");
  }
  if (!preview.rollbackCondition.trim()) issues.push("AI Task Packet Delta Apply Preview: rollback condition不足");

  if (issues.length === 0) return { status: "valid", issues };
  const isEmpty =
    preview.statusSample === "empty" &&
    !preview.sourceProposal &&
    !preview.targetPacketSection &&
    !preview.beforeSummary &&
    !preview.afterSummary &&
    preview.addedAcceptanceCriteria.length === 0 &&
    preview.addedVerificationCommands.length === 0 &&
    !preview.codexPromptPatch &&
    !preview.rollbackCondition &&
    preview.reviewChecklist.length === 0;
  return { status: isEmpty ? "empty" : "failure", issues };
}

export function createEmptyDeltaDecisionReview(): DeltaDecisionReview {
  return { statusSample: "empty", decisions: [] };
}

export function createValidDeltaDecisionReview(preview: TaskPacketDeltaApplyPreview = createValidTaskPacketDeltaApplyPreview(createValidSpecUpdateProposalQueue(generateReviewRecord(createFailureVerificationRun()), generateLearningLog(generateReviewRecord(createFailureVerificationRun()))))): DeltaDecisionReview {
  return {
    statusSample: "valid",
    decisions: [
      {
        deltaId: "delta-mvp019-001",
        sourceProposal: preview.sourceProposal,
        status: "adopted",
        decisionOwner: "AIDDレビュー担当",
        decisionReason: "verification commandとrollback conditionが揃っており、次回AI Task Packetへ入れても再確認できるため採用する。",
        decidedAt: "2026-07-03T09:00:00Z",
        nextAction: "採用済みdeltaを次回AI Task PacketとCodex prompt patchへ反映する",
        reviewEvidence: "experiments/aidd-control-plane-mvp-019/artifacts/terminal/doctor-aidd.txt",
        rollbackConfirmed: true,
        includedInNextPacket: true,
        verificationCommands: preview.addedVerificationCommands,
        preventionNote: "同じ証跡不足を次回も検出できるよう、doctor:aiddとE2Eの両方へ残す"
      },
      {
        deltaId: "delta-mvp019-002",
        sourceProposal: "古いterminal evidenceを自動削除する",
        status: "deferred",
        decisionOwner: "AIDDレビュー担当",
        decisionReason: "破壊的cleanupはcronでは安全gateに引っかかるため、削除ではなく除外と再取得で証明する方針を先に確認する。",
        decidedAt: "2026-07-03T09:05:00Z",
        nextAction: "非破壊の証跡再取得フローを次回検討する",
        reviewEvidence: "artifacts/terminal/install.txt",
        rollbackConfirmed: true,
        includedInNextPacket: false,
        verificationCommands: ["pnpm run doctor:aidd"],
        preventionNote: "cleanupが必要な場合は事前に明示許可を得る"
      },
      {
        deltaId: "delta-mvp019-003",
        sourceProposal: "根拠のないUIコピー修正をまとめて入れる",
        status: "rejected",
        decisionOwner: "AIDDレビュー担当",
        decisionReason: "Review FindingとVerification Evidenceに紐づかず、次回AI依頼を曖昧にするため却下する。",
        decidedAt: "2026-07-03T09:10:00Z",
        nextAction: "具体的なfindingが出るまで採用しない",
        reviewEvidence: "Review Record: 根拠findingなし",
        rollbackConfirmed: true,
        includedInNextPacket: false,
        verificationCommands: [],
        preventionNote: "却下理由と再発防止メモをLearning Logへ残す"
      }
    ]
  };
}

export function createFailureDeltaDecisionReview(): DeltaDecisionReview {
  return {
    statusSample: "failure",
    decisions: [
      {
        deltaId: "delta-mvp019-bad-001",
        sourceProposal: "verification commandなしで採用する",
        status: "adopted",
        decisionOwner: "",
        decisionReason: "",
        decidedAt: "",
        nextAction: "次回packetへ入れる",
        reviewEvidence: "",
        rollbackConfirmed: false,
        includedInNextPacket: true,
        verificationCommands: [],
        preventionNote: ""
      },
      {
        deltaId: "delta-mvp019-bad-002",
        sourceProposal: "却下理由がないproposal",
        status: "rejected",
        decisionOwner: "AIDDレビュー担当",
        decisionReason: "",
        decidedAt: "2026-07-03T09:20:00Z",
        nextAction: "",
        reviewEvidence: "",
        rollbackConfirmed: true,
        includedInNextPacket: false,
        verificationCommands: [],
        preventionNote: ""
      }
    ]
  };
}

export function evaluateDeltaDecisionReview(review: DeltaDecisionReview): DeltaDecisionReviewSummary {
  const adoptedCount = review.decisions.filter((decision) => decision.status === "adopted").length;
  const rejectedCount = review.decisions.filter((decision) => decision.status === "rejected").length;
  const deferredCount = review.decisions.filter((decision) => decision.status === "deferred").length;
  const includedInNextPacket = review.decisions.filter((decision) => decision.includedInNextPacket && decision.status === "adopted");
  const issues = review.decisions.flatMap((decision) => {
    const decisionIssues: string[] = [];
    if (!decision.decisionOwner.trim()) decisionIssues.push(`${decision.deltaId}: 判断者不足`);
    if (!decision.decisionReason.trim()) decisionIssues.push(`${decision.deltaId}: 判断理由不足`);
    if (!decision.rollbackConfirmed) decisionIssues.push(`${decision.deltaId}: rollback確認不足`);
    if (decision.status === "adopted" && decision.verificationCommands.length === 0) decisionIssues.push(`${decision.deltaId}: 採用なのにverification command不足`);
    if (decision.status === "rejected" && !decision.preventionNote.trim()) decisionIssues.push(`${decision.deltaId}: 却下なのに再発防止メモ不足`);
    return decisionIssues;
  });
  return {
    status: review.decisions.length === 0 ? "empty" : issues.length === 0 ? "valid" : "failure",
    adoptedCount,
    rejectedCount,
    deferredCount,
    includedInNextPacket,
    issues
  };
}

export function createEmptyAdoptedDeltaMarkdownExport(): AdoptedDeltaMarkdownExport {
  return {
    statusSample: "empty",
    markdownSection: "",
    verificationPlanPatch: [],
    codexPromptPatch: "",
    rollbackCondition: "",
    reviewEvidence: [],
    includedDeltaIds: [],
    learningLogReturns: [],
    sourceDecisions: []
  };
}

export function createValidAdoptedDeltaMarkdownExport(review: DeltaDecisionReview = createValidDeltaDecisionReview()): AdoptedDeltaMarkdownExport {
  const adopted = review.decisions.filter((decision) => decision.status === "adopted" && decision.includedInNextPacket);
  const returned = review.decisions.filter((decision) => decision.status !== "adopted" || !decision.includedInNextPacket);
  const verificationPlanPatch = adopted.flatMap((decision) => decision.verificationCommands).filter((command) => command.trim());
  return {
    statusSample: "valid",
    markdownSection: [
      "## 次回AI Task Packet差分: 採用済みDelta",
      "",
      ...adopted.flatMap((decision) => [
        `### ${decision.deltaId}`,
        `- source proposal: ${decision.sourceProposal}`,
        `- decision reason: ${decision.decisionReason}`,
        `- acceptance criteria: ${decision.nextAction}`,
        `- verification: ${decision.verificationCommands.join(" / ")}`,
                `- rollback condition: ${decision.rollbackConfirmed ? "検証失敗時は採用deltaを戻して再レビューする" : "未確認"}`,
        `- review evidence: ${decision.reviewEvidence}`,
        ""
      ])
    ].join("\n").trim(),
    verificationPlanPatch,
    codexPromptPatch: [
      "Codex prompt追記:",
      "- 採用済みdeltaだけを次回AI Task Packetへ反映してください。",
      ...adopted.map((decision) => `- ${decision.deltaId}: ${decision.nextAction}`),
      "- 却下 / 保留deltaはLearning Logへ戻し、実装依頼へ混ぜないでください。"
    ].join("\n"),
    rollbackCondition: "追加したMarkdown差分のverification commandが失敗した場合は、該当deltaを保留へ戻し、Review Recordを更新する。",
    reviewEvidence: adopted.map((decision) => decision.reviewEvidence).filter((evidence) => evidence.trim()),
    includedDeltaIds: adopted.map((decision) => decision.deltaId),
    learningLogReturns: returned.map((decision) => `${decision.deltaId}: ${decision.status} - ${decision.preventionNote || decision.decisionReason || "理由を補って再レビュー"}`),
    sourceDecisions: review.decisions
  };
}

export function createFailureAdoptedDeltaMarkdownExport(): AdoptedDeltaMarkdownExport {
  const review = createFailureDeltaDecisionReview();
  return {
    statusSample: "failure",
    markdownSection: "## 次回AI Task Packet差分\n- delta-mvp019-bad-001を採用\n- delta-mvp019-bad-002も混入",
    verificationPlanPatch: [],
    codexPromptPatch: "Codex prompt追記だけがあり、根拠証跡と戻し条件が不足しています。",
    rollbackCondition: "",
    reviewEvidence: [],
    includedDeltaIds: ["delta-mvp019-bad-001", "delta-mvp019-bad-002"],
    learningLogReturns: [],
    sourceDecisions: review.decisions
  };
}

export function evaluateAdoptedDeltaMarkdownExport(exportPlan: AdoptedDeltaMarkdownExport): AdoptedDeltaMarkdownExportReview {
  const issues: string[] = [];
  const adoptedIds = exportPlan.sourceDecisions.filter((decision) => decision.status === "adopted" && decision.includedInNextPacket).map((decision) => decision.deltaId);
  const notAdoptedIds = exportPlan.sourceDecisions.filter((decision) => decision.status !== "adopted" || !decision.includedInNextPacket).map((decision) => decision.deltaId);

  if (!exportPlan.markdownSection.trim()) issues.push("Adopted Delta Markdown Exporter: Markdown section不足");
  if (exportPlan.verificationPlanPatch.length === 0 || exportPlan.verificationPlanPatch.every((command) => !command.trim())) issues.push("Adopted Delta Markdown Exporter: verification command不足");
  if (!exportPlan.rollbackCondition.trim()) issues.push("Adopted Delta Markdown Exporter: rollback condition不足");
  if (exportPlan.reviewEvidence.length === 0 || exportPlan.reviewEvidence.every((evidence) => !evidence.trim())) issues.push("Adopted Delta Markdown Exporter: review evidence不足");
  for (const id of adoptedIds) {
    if (!exportPlan.includedDeltaIds.includes(id)) issues.push(`Adopted Delta Markdown Exporter: 採用delta ${id} がMarkdown exportにありません`);
  }
  for (const id of notAdoptedIds) {
    if (exportPlan.includedDeltaIds.includes(id) || exportPlan.markdownSection.includes(id)) issues.push(`Adopted Delta Markdown Exporter: 未採用delta ${id} が混入しています`);
  }

  if (issues.length === 0) return { status: "valid", issues };
  const isEmpty = exportPlan.statusSample === "empty" && !exportPlan.markdownSection && exportPlan.sourceDecisions.length === 0;
  return { status: isEmpty ? "empty" : "failure", issues };
}

export function createEmptyPacketFileApplyPlanner(): PacketFileApplyPlanner {
  return {
    statusSample: "empty",
    filePlans: [],
    learningLogReturns: [],
    sourceDecisions: []
  };
}

export function createValidPacketFileApplyPlanner(exportPlan: AdoptedDeltaMarkdownExport = createValidAdoptedDeltaMarkdownExport()): PacketFileApplyPlanner {
  const adoptedIds = exportPlan.sourceDecisions
    .filter((decision) => decision.status === "adopted" && decision.includedInNextPacket)
    .map((decision) => decision.deltaId);
  const notAdoptedIds = exportPlan.sourceDecisions
    .filter((decision) => decision.status !== "adopted" || !decision.includedInNextPacket)
    .map((decision) => decision.deltaId);
  const evidence = exportPlan.reviewEvidence.join(" / ") || "Review Record: 採用済みdelta確認済み";
  return {
    statusSample: "valid",
    sourceDecisions: exportPlan.sourceDecisions,
    learningLogReturns: exportPlan.learningLogReturns,
    filePlans: [
      {
        targetFile: "AI_TASK_PACKET.md",
        markdownHeading: "## 次回AI Task Packet差分: 採用済みDelta",
        beforeSummary: "採用済みdeltaのacceptance criteriaとverification commandがAI依頼本文へまだ反映されていない。",
        afterSummary: "採用済みdeltaだけをAI Task Packet本文へ追記し、却下/保留deltaはLearning Log戻し対象に分離する。",
        insertPosition: "review_recordセクション直後、learning_logセクションより前",
        verificationCommand: "pnpm run test:e2e",
        rollbackStep: "verification commandが失敗した場合、該当追記を削除してdelta decisionをdeferredへ戻す。",
        reviewEvidence: evidence,
        includedDeltaIds: adoptedIds,
        learningLogReturnIds: []
      },
      {
        targetFile: "CODEX_PROMPT.md",
        markdownHeading: "## Codex prompt追記",
        beforeSummary: "Codex promptは採用判断を参照できるが、採用済みdeltaだけを実装依頼へ含める指示が弱い。",
        afterSummary: "採用済みdeltaだけを実装依頼へ含め、未採用deltaを混ぜない制約を追記する。",
        insertPosition: "完了条件の直前",
        verificationCommand: "pnpm run doctor:aidd",
        rollbackStep: "未採用deltaが本文へ混入した場合、追記を戻してLearning Log戻し対象へ移す。",
        reviewEvidence: evidence,
        includedDeltaIds: adoptedIds,
        learningLogReturnIds: []
      },
      {
        targetFile: "VERIFICATION_PLAN.md",
        markdownHeading: "## 採用delta検証コマンド",
        beforeSummary: "採用済みdeltaの検証コマンドがVerification Plan内で独立して追跡されていない。",
        afterSummary: "採用済みdeltaごとのverification commandを確認項目として追加する。",
        insertPosition: "品質ゲートセクションの末尾",
        verificationCommand: "pnpm run test:e2e",
        rollbackStep: "検証コマンドが再現不能な場合、該当項目を削除しReview Findingへ戻す。",
        reviewEvidence: evidence,
        includedDeltaIds: adoptedIds,
        learningLogReturnIds: []
      },
      {
        targetFile: "LEARNING_LOG.md",
        markdownHeading: "## 未採用delta戻し",
        beforeSummary: "却下/保留deltaが次回AI依頼本文へ混入しない理由がLearning Logで一覧化されていない。",
        afterSummary: "却下/保留deltaをLearning Log戻し対象として記録し、AI依頼本文から分離する。",
        insertPosition: "next_ai_task_packet_deltaの後",
        verificationCommand: "pnpm run doctor:aidd",
        rollbackStep: "戻し対象の理由が不足した場合、Learning Log追記を保留してDecision Reviewを補完する。",
        reviewEvidence: exportPlan.learningLogReturns.join(" / ") || evidence,
        includedDeltaIds: [],
        learningLogReturnIds: notAdoptedIds
      }
    ]
  };
}

export function createFailurePacketFileApplyPlanner(): PacketFileApplyPlanner {
  const review = createFailureDeltaDecisionReview();
  return {
    statusSample: "failure",
    sourceDecisions: review.decisions,
    learningLogReturns: [],
    filePlans: [
      {
        targetFile: "",
        markdownHeading: "## 不完全な採用delta追記",
        beforeSummary: "",
        afterSummary: "",
        insertPosition: "",
        verificationCommand: "",
        rollbackStep: "",
        reviewEvidence: "",
        includedDeltaIds: ["delta-mvp019-bad-001", "delta-mvp019-bad-002"],
        learningLogReturnIds: []
      }
    ]
  };
}

export function evaluatePacketFileApplyPlanner(planner: PacketFileApplyPlanner): PacketFileApplyPlannerReview {
  const reviewFindings: ReviewFinding[] = [];
  const adoptedIds = planner.sourceDecisions
    .filter((decision) => decision.status === "adopted" && decision.includedInNextPacket)
    .map((decision) => decision.deltaId);
  const notAdoptedIds = planner.sourceDecisions
    .filter((decision) => decision.status !== "adopted" || !decision.includedInNextPacket)
    .map((decision) => decision.deltaId);

  planner.filePlans.forEach((filePlan, index) => {
    const label = filePlan.targetFile || `file plan ${index + 1}`;
    if (!filePlan.targetFile.trim()) reviewFindings.push(buildPlannerFinding(`${label}: target file不足`, "target fileをAI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.mdのいずれかに設定する"));
    if (!filePlan.insertPosition.trim()) reviewFindings.push(buildPlannerFinding(`${label}: insert position不足`, "Markdown見出しの挿入位置を明示する"));
    if (!filePlan.beforeSummary.trim() || !filePlan.afterSummary.trim()) reviewFindings.push(buildPlannerFinding(`${label}: before/after差分不足`, "before summaryとafter summaryを両方記録する"));
    if (!filePlan.verificationCommand.trim()) reviewFindings.push(buildPlannerFinding(`${label}: verification command不足`, "適用後に確認するpnpmコマンドを設定する"));
    if (!filePlan.rollbackStep.trim()) reviewFindings.push(buildPlannerFinding(`${label}: rollback step不足`, "適用を戻す条件と戻し手順を記録する"));
    if (!filePlan.reviewEvidence.trim()) reviewFindings.push(buildPlannerFinding(`${label}: review evidence不足`, "採用判断のReview Evidenceを紐づける"));
    const mixedIds = filePlan.includedDeltaIds.filter((deltaId) => notAdoptedIds.includes(deltaId));
    for (const deltaId of mixedIds) {
      reviewFindings.push(buildPlannerFinding(`${label}: 未採用delta ${deltaId} が混入しています`, "却下/保留deltaはLearning Log戻し対象へ分離し、AI依頼本文へ混ぜない"));
    }
  });

  for (const deltaId of adoptedIds) {
    const includedInBody = planner.filePlans.some((filePlan) => filePlan.targetFile !== "LEARNING_LOG.md" && filePlan.includedDeltaIds.includes(deltaId));
    if (!includedInBody) reviewFindings.push(buildPlannerFinding(`採用delta ${deltaId} の対象ファイル計画が不足しています`, "採用済みdeltaをAI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.mdの計画へ含める"));
  }
  for (const deltaId of notAdoptedIds) {
    const returned = planner.learningLogReturns.some((item) => item.includes(deltaId)) || planner.filePlans.some((filePlan) => filePlan.learningLogReturnIds.includes(deltaId));
    if (!returned) reviewFindings.push(buildPlannerFinding(`未採用delta ${deltaId} のLearning Log戻し対象が不足しています`, "却下/保留deltaをLearning Log戻し対象として表示する"));
  }

  const isEmpty = planner.statusSample === "empty" && planner.filePlans.length === 0 && planner.sourceDecisions.length === 0;
  return {
    status: isEmpty ? "empty" : reviewFindings.length === 0 ? "valid" : "failure",
    reviewFindings
  };
}

function buildPlannerFinding(finding: string, fixInstruction: string): ReviewFinding {
  return buildFinding("Packet File Apply Planner", "high", finding, fixInstruction, ["AI Task Packet Markdown", "Verification Plan", "Codex Prompt", "Learning Log"], "pnpm run doctor:aidd");
}

export function createEmptyPacketDraftWorkspace(): PacketDraftWorkspace {
  return {
    statusSample: "empty",
    drafts: [],
    copyCodexPrompt: "",
    learningLogReturns: [],
    sourcePlanner: createEmptyPacketFileApplyPlanner()
  };
}

export function createValidPacketDraftWorkspace(planner: PacketFileApplyPlanner = createValidPacketFileApplyPlanner()): PacketDraftWorkspace {
  const bodyByTarget = new Map<string, string>([
    ["AI_TASK_PACKET.md", ["# AI Task Packet Draft", "", "## 次回AI Task Packet差分: 採用済みDelta", "- delta-mvp019-001: 採用済みdeltaだけをAI Task Packet本文へ反映する。", "- acceptance criteria: Packet Draft Workspaceで生成したドラフト本文をレビューできる。", "- verification: pnpm run test:e2e / pnpm run doctor:aidd", "- AIDD-Spec接続: AI Task Packet / Verification Evidence / Review Record / Learning Log"].join("\n")],
    ["CODEX_PROMPT.md", ["実装対象: AIDD Control Plane 次回MVP", "", "## 採用済みdeltaだけを反映", "- delta-mvp019-001を対象ファイルへ反映する。", "- 却下 / 保留deltaはLearning Log戻し対象にし、実装依頼本文へ混ぜない。", "- 検証コマンド: pnpm run lint / pnpm run typecheck / pnpm run test / pnpm run build / pnpm run test:e2e / pnpm run doctor:aidd", "- rollback condition: 検証失敗時は該当deltaを保留へ戻す。"].join("\n")],
    ["VERIFICATION_PLAN.md", ["# Verification Plan Draft", "", "## 採用delta検証コマンド", "- [ ] pnpm run test:e2e", "- [ ] pnpm run doctor:aidd", "- [ ] empty / valid / failure / terminal evidence画像を保存する", "- [ ] Review RecordとLearning Logへ結果を戻す"].join("\n")],
    ["LEARNING_LOG.md", ["# Learning Log Draft", "", "## 未採用delta戻し", ...planner.learningLogReturns.map((item) => `- ${item}`), "", "## 次回確認", "- 未採用deltaをAI依頼本文へ混ぜないことをdoctor:aiddで確認する。"].join("\n")]
  ]);

  const drafts: PacketDraftFile[] = planner.filePlans.map((plan) => ({
    targetFile: plan.targetFile,
    draftStatus: "生成準備完了",
    sourceDeltaIds: plan.includedDeltaIds.length > 0 ? plan.includedDeltaIds : plan.learningLogReturnIds,
    markdownHeadings: [plan.markdownHeading],
    diffSummary: `${plan.beforeSummary} -> ${plan.afterSummary}`,
    bodyPreview: bodyByTarget.get(plan.targetFile) ?? `${plan.markdownHeading}\n${plan.afterSummary}`,
    preflightChecks: ["対象ファイル名が確定している", "source delta idが採用済みまたはLearning Log戻し対象として説明されている", "verification commandとrollback conditionが本文に入っている", "AIDD-Spec v0.1への接続が本文に残っている"],
    verificationCommands: [plan.verificationCommand],
    rollbackCondition: plan.rollbackStep,
    aiddSpecConnections: ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Spec Improvement"]
  }));

  return {
    statusSample: "valid",
    drafts,
    learningLogReturns: planner.learningLogReturns,
    sourcePlanner: planner,
    copyCodexPrompt: ["Codexへ渡す最終ドラフト指示:", "- AIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdに接続する。", "- 対象ファイル: AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.md。", "- 採用済みdelta delta-mvp019-001だけをAI依頼本文へ反映する。", "- 却下 / 保留deltaはLearning Logへ戻し、実装依頼本文へ混ぜない。", "- 検証コマンド: pnpm run lint / pnpm run typecheck / pnpm run test / pnpm run build / pnpm run test:e2e / pnpm run doctor:aidd。", "- rollback condition: 検証失敗または未採用delta混入が見つかったら該当ドラフトを戻してReview Recordへ記録する。"].join("\n")
  };
}

export function createFailurePacketDraftWorkspace(): PacketDraftWorkspace {
  const planner = createFailurePacketFileApplyPlanner();
  return {
    statusSample: "failure",
    sourcePlanner: planner,
    learningLogReturns: [],
    copyCodexPrompt: "採用済みdeltaと未採用deltaをまとめて反映してください。AIDD-Spec接続と戻し条件は後で考えます。",
    drafts: [
      { targetFile: "AI_TASK_PACKET.md", draftStatus: "要修正", sourceDeltaIds: ["delta-mvp019-bad-001", "delta-mvp019-bad-002"], markdownHeadings: [], diffSummary: "対象ファイルが重複し、本文と検証条件が不足しています。", bodyPreview: "", preflightChecks: [], verificationCommands: [], rollbackCondition: "", aiddSpecConnections: [] },
      { targetFile: "AI_TASK_PACKET.md", draftStatus: "要修正", sourceDeltaIds: [], markdownHeadings: ["## 重複した追記"], diffSummary: "同じtarget fileへ別計画が衝突しています。", bodyPreview: "未採用delta delta-mvp019-bad-002 も本文へ混ぜる", preflightChecks: ["衝突を解消する"], verificationCommands: [""], rollbackCondition: "", aiddSpecConnections: [] }
    ]
  };
}

export function evaluatePacketDraftWorkspace(workspace: PacketDraftWorkspace): PacketDraftWorkspaceReview {
  const reviewFindings: ReviewFinding[] = [];
  const seenTargets = new Set<string>();
  const notAdoptedIds = workspace.sourcePlanner.sourceDecisions.filter((decision) => decision.status !== "adopted" || !decision.includedInNextPacket).map((decision) => decision.deltaId);

  workspace.drafts.forEach((draft, index) => {
    const label = draft.targetFile || `draft ${index + 1}`;
    if (!draft.targetFile.trim()) reviewFindings.push(buildDraftFinding(`${label}: target file不足`, "ドラフトの対象ファイルを確定する"));
    if (seenTargets.has(draft.targetFile)) reviewFindings.push(buildDraftFinding(`${label}: file target重複または衝突`, "同じ対象ファイルのドラフトを統合し、差分サマリを1つにまとめる"));
    if (draft.targetFile.trim()) seenTargets.add(draft.targetFile);
    if (draft.sourceDeltaIds.length === 0 || draft.sourceDeltaIds.every((id) => !id.trim())) reviewFindings.push(buildDraftFinding(`${label}: source delta id不足`, "根拠になるdelta idを記録する"));
    if (!draft.bodyPreview.trim()) reviewFindings.push(buildDraftFinding(`${label}: draft body不足`, "コピー用本文プレビューを生成する"));
    if (draft.verificationCommands.length === 0 || draft.verificationCommands.every((command) => !command.trim())) reviewFindings.push(buildDraftFinding(`${label}: verification command不足`, "ドラフト反映後の検証コマンドを入れる"));
    if (!draft.rollbackCondition.trim()) reviewFindings.push(buildDraftFinding(`${label}: rollback condition不足`, "検証失敗時に戻す条件を入れる"));
    if (draft.aiddSpecConnections.length === 0) reviewFindings.push(buildDraftFinding(`${label}: AIDD-Spec接続不足`, "AI Task Packet / Verification Evidence / Review Record / Learning Logへの接続を表示する"));
    for (const deltaId of draft.sourceDeltaIds) {
      if (notAdoptedIds.includes(deltaId) && draft.targetFile !== "LEARNING_LOG.md") reviewFindings.push(buildDraftFinding(`${label}: 未採用delta ${deltaId} が混入しています`, "未採用deltaはLearning Logドラフトへ戻し、AI依頼本文へ混ぜない"));
    }
  });

  if (workspace.copyCodexPrompt.trim() && !workspace.copyCodexPrompt.includes("AIDD-Spec v0.1")) reviewFindings.push(buildDraftFinding("コピー用Codex prompt: AIDD-Spec接続不足", "コピー用Codex promptへAIDD-Spec v0.1接続を入れる"));
  if (workspace.copyCodexPrompt.trim() && !workspace.copyCodexPrompt.includes("rollback condition")) reviewFindings.push(buildDraftFinding("コピー用Codex prompt: rollback condition不足", "コピー用Codex promptへrollback conditionを入れる"));

  const isEmpty = workspace.statusSample === "empty" && workspace.drafts.length === 0 && !workspace.copyCodexPrompt;
  return { status: isEmpty ? "empty" : reviewFindings.length === 0 ? "valid" : "failure", reviewFindings };
}

function buildDraftFinding(finding: string, fixInstruction: string): ReviewFinding {
  return buildFinding("Packet Draft Workspace", "high", finding, fixInstruction, ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log"], "pnpm run doctor:aidd");
}

export function createEmptySafePatchReviewWorkspace(): SafePatchReviewWorkspace {
  return {
    statusSample: "empty",
    patches: [],
    copyCodexPrompt: "",
    sourceDraftWorkspace: createEmptyPacketDraftWorkspace()
  };
}

export function createValidSafePatchReviewWorkspace(sourceDraftWorkspace: PacketDraftWorkspace = createValidPacketDraftWorkspace()): SafePatchReviewWorkspace {
  const patches: SafePatchCandidate[] = sourceDraftWorkspace.drafts.map((draft, index) => ({
    patchId: `safe-patch-mvp023-${String(index + 1).padStart(3, "0")}`,
    targetFile: draft.targetFile,
    sourceDraftId: draft.sourceDeltaIds.join("+") || `draft-${index + 1}`,
    diffSummary: `${draft.targetFile}へ採用済みdelta由来のドラフト本文を追記する。${draft.diffSummary}`,
    addedLines: Math.max(6, draft.bodyPreview.split("\n").length),
    removedLines: 0,
    riskLevel: draft.targetFile === "LEARNING_LOG.md" ? "medium" : "low",
    applyCommand: `git apply --check patches/${draft.targetFile.replace(/[^a-zA-Z0-9._-]/g, "-")}.patch`,
    verificationCommand: draft.verificationCommands.join(" && ") || "pnpm run doctor:aidd",
    rollbackCommand: `git checkout -- ${draft.targetFile}`,
    reviewerChecklist: [
      "target fileがAI Task Packet許可リスト内にある",
      "source draft idが採用済みdeltaまたはLearning Log戻し対象として説明されている",
      "verification commandとrollback commandがある",
      "ローカルパスや未採用deltaがpatch本文へ混ざっていない",
      "AIDD-Spec v0.1への接続が残っている"
    ],
    aiddSpecConnections: ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"],
    containsUnadoptedDelta: false,
    containsLocalPath: false
  }));

  return {
    statusSample: "valid",
    patches,
    sourceDraftWorkspace,
    copyCodexPrompt: [
      "Safe Patch Review Workspaceで承認されたpatchだけを適用してください。",
      "- 実行前に git apply --check を行う。",
      "- target fileはAI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.mdに限定する。",
      "- 未採用delta、ローカルパス、rollback command不足があれば適用せずReview Recordへ戻す。",
      "- 検証: pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd。",
      "- AIDD-Spec v0.1: AI Task Packet / Verification Evidence / Review Record / Learning Log / Rollback Planへ接続する。"
    ].join("\n")
  };
}

export function createFailureSafePatchReviewWorkspace(): SafePatchReviewWorkspace {
  return {
    statusSample: "failure",
    sourceDraftWorkspace: createFailurePacketDraftWorkspace(),
    copyCodexPrompt: "patchをそのまま当ててください。検証とrollbackは後で考えます。PRIVATE_HOME_PATH のログも本文に入れてよいです。",
    patches: [
      { patchId: "", targetFile: "", sourceDraftId: "", diffSummary: "", addedLines: 140, removedLines: 40, riskLevel: "high", applyCommand: "git apply patches/bad.patch", verificationCommand: "", rollbackCommand: "", reviewerChecklist: [], aiddSpecConnections: [], containsUnadoptedDelta: true, containsLocalPath: true },
      { patchId: "safe-patch-bad-002", targetFile: "../outside/SECRET.md", sourceDraftId: "delta-mvp019-bad-002", diffSummary: "未採用deltaも実装依頼に混ぜる", addedLines: 12, removedLines: 0, riskLevel: "high", applyCommand: "git apply patches/outside.patch", verificationCommand: "pnpm run test", rollbackCommand: "", reviewerChecklist: ["あとで確認する"], aiddSpecConnections: [], containsUnadoptedDelta: true, containsLocalPath: false }
    ]
  };
}

export function evaluateSafePatchReviewWorkspace(workspace: SafePatchReviewWorkspace): SafePatchReviewWorkspaceReview {
  const reviewFindings: ReviewFinding[] = [];
  const allowedTargets = new Set(["AI_TASK_PACKET.md", "CODEX_PROMPT.md", "VERIFICATION_PLAN.md", "LEARNING_LOG.md"]);

  workspace.patches.forEach((patch, index) => {
    const label = patch.patchId || `patch ${index + 1}`;
    if (!patch.patchId.trim()) reviewFindings.push(buildSafePatchFinding(`${label}: patch id不足`, "patch候補に一意なpatch idを付ける"));
    if (!patch.targetFile.trim()) reviewFindings.push(buildSafePatchFinding(`${label}: target file不足`, "対象ファイルをAI依頼ファイルの許可リストから選ぶ"));
    if (patch.targetFile && !allowedTargets.has(patch.targetFile)) reviewFindings.push(buildSafePatchFinding(`${label}: 危険なtarget path`, "許可された4ファイル以外へpatchを当てない"));
    if (!patch.sourceDraftId.trim()) reviewFindings.push(buildSafePatchFinding(`${label}: source draft id不足`, "根拠になるdraftまたはdelta idを記録する"));
    if (!patch.diffSummary.trim()) reviewFindings.push(buildSafePatchFinding(`${label}: diff summary不足`, "何が変わるpatchかを1文で説明する"));
    if (patch.addedLines + patch.removedLines > 120) reviewFindings.push(buildSafePatchFinding(`${label}: diff size過大`, "一度に当てるpatchを小さく分け、レビュー可能な行数にする"));
    if (!patch.verificationCommand.trim()) reviewFindings.push(buildSafePatchFinding(`${label}: verification command不足`, "patch適用後に実行する検証コマンドを入れる"));
    if (!patch.rollbackCommand.trim()) reviewFindings.push(buildSafePatchFinding(`${label}: rollback command不足`, "失敗時に戻すコマンドまたは手順を入れる"));
    if (patch.containsUnadoptedDelta) reviewFindings.push(buildSafePatchFinding(`${label}: 未採用delta混入`, "未採用deltaはLearning Logへ戻し、patch適用対象から外す"));
    if (patch.containsLocalPath) reviewFindings.push(buildSafePatchFinding(`${label}: ローカルパス混入`, "公開可能な相対パスまたはartifact名に置き換える"));
    if (patch.aiddSpecConnections.length === 0) reviewFindings.push(buildSafePatchFinding(`${label}: AIDD-Spec接続不足`, "AI Task Packet / Verification Evidence / Review Record / Learning Logへの接続を表示する"));
  });

  if (workspace.copyCodexPrompt.trim() && !workspace.copyCodexPrompt.includes("AIDD-Spec v0.1")) reviewFindings.push(buildSafePatchFinding("コピー用Codex prompt: AIDD-Spec接続不足", "コピー用Codex promptにAIDD-Spec v0.1接続を入れる"));
  if (workspace.copyCodexPrompt.trim() && !workspace.copyCodexPrompt.includes("rollback")) reviewFindings.push(buildSafePatchFinding("コピー用Codex prompt: rollback不足", "コピー用Codex promptにrollback条件を入れる"));

  const isEmpty = workspace.statusSample === "empty" && workspace.patches.length === 0 && !workspace.copyCodexPrompt;
  return { status: isEmpty ? "empty" : reviewFindings.length === 0 ? "valid" : "failure", reviewFindings };
}

function buildSafePatchFinding(finding: string, fixInstruction: string): ReviewFinding {
  return buildFinding("Safe Patch Review Workspace", "high", finding, fixInstruction, ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"], "pnpm run doctor:aidd");
}

export function createEmptyDiffBundleRollbackEvidenceWorkspace(): DiffBundleRollbackEvidenceWorkspace {
  return {
    statusSample: "empty",
    bundles: [],
    sourceSafePatchReviewWorkspace: createEmptySafePatchReviewWorkspace(),
    copyCodexPrompt: ""
  };
}

export function createValidDiffBundleRollbackEvidenceWorkspace(sourceSafePatchReviewWorkspace: SafePatchReviewWorkspace = createValidSafePatchReviewWorkspace()): DiffBundleRollbackEvidenceWorkspace {
  const bundles = sourceSafePatchReviewWorkspace.patches.map((patch, index): DiffBundleRollbackEvidence => ({
    bundleId: `diff-bundle-mvp027-${String(index + 1).padStart(3, "0")}`,
    sourceApplyPlanId: `apply-plan-mvp027-${String(index + 1).padStart(3, "0")}`,
    sourcePatchId: patch.patchId,
    targetFile: patch.targetFile,
    beforeHash: `before-${patch.targetFile.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-${index + 1}`,
    afterHash: `after-${patch.targetFile.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-${index + 1}`,
    diffBundlePath: `artifacts/diff-bundles/mvp027/${patch.patchId}.diff`,
    dryRunCommand: `${patch.applyCommand} && ${patch.verificationCommand}`,
    dryRunStatus: "成功",
    rollbackEvidencePath: `artifacts/rollback/mvp027/${patch.patchId}-rollback.txt`,
    rollbackVerifiedCommand: `${patch.rollbackCommand} && pnpm run doctor:aidd`,
    verificationCommand: patch.verificationCommand,
    reviewerChecklist: [
      "dry-run結果が成功である",
      "before hashとafter hashが保存されている",
      "diff bundle pathが公開可能な相対パスである",
      "rollback evidence pathが保存されている",
      "verification commandがSafe Patch Reviewの内容と一致する",
      "ローカルパスやプライベートネットワーク名が証跡に混ざっていない"
    ],
    reviewerApproved: true,
    aiddSpecConnections: ["Verification Evidence", "Review Record", "Rollback Plan", "Learning Log", "AI Task Packet"],
    containsLocalPath: false,
    missingRollbackEvidence: false
  }));

  return {
    statusSample: "valid",
    bundles,
    sourceSafePatchReviewWorkspace,
    copyCodexPrompt: [
      "Diff Bundle & Rollback Evidence Workspaceでvalidになったbundleだけを次へ進めてください。",
      "- patch適用前にdiff bundle、before hash、after hash、dry-run結果を保存する。",
      "- rollback evidence pathとrollback verified commandをVerification Evidenceへ残す。",
      "- ローカルパス、プライベートネットワーク、ホスト名、未採用deltaがあれば適用せずReview Recordへ戻す。",
      "- 検証: pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd。",
      "- AIDD-Spec v0.1: Verification Evidence / Review Record / Rollback Plan / Learning Logへ接続する。"
    ].join("\n")
  };
}

export function createFailureDiffBundleRollbackEvidenceWorkspace(): DiffBundleRollbackEvidenceWorkspace {
  return {
    statusSample: "failure",
    sourceSafePatchReviewWorkspace: createFailureSafePatchReviewWorkspace(),
    copyCodexPrompt: "dry-runなしでpatchを当てて、失敗したら後で戻してください。PRIVATE_HOME_PATH や private-build-host.invalid をログに入れてもよいです。",
    bundles: [
      { bundleId: "", sourceApplyPlanId: "", sourcePatchId: "", targetFile: "", beforeHash: "", afterHash: "", diffBundlePath: "", dryRunCommand: "", dryRunStatus: "未実行", rollbackEvidencePath: "", rollbackVerifiedCommand: "", verificationCommand: "", reviewerChecklist: [], reviewerApproved: false, aiddSpecConnections: [], containsLocalPath: true, missingRollbackEvidence: true },
      { bundleId: "diff-bundle-bad-002", sourceApplyPlanId: "apply-plan-bad-002", sourcePatchId: "safe-patch-bad-002", targetFile: "../outside/SECRET.md", beforeHash: "before-secret", afterHash: "", diffBundlePath: "PRIVATE_HOME_PATH/artifacts/bad.diff", dryRunCommand: "git apply patches/outside.patch", dryRunStatus: "失敗", rollbackEvidencePath: "", rollbackVerifiedCommand: "", verificationCommand: "pnpm run test", reviewerChecklist: ["あとで確認する"], reviewerApproved: false, aiddSpecConnections: [], containsLocalPath: true, missingRollbackEvidence: true },
      { bundleId: "diff-bundle-bad-003", sourceApplyPlanId: "apply-plan-bad-003", sourcePatchId: "safe-patch-bad-003", targetFile: "/tmp/AI_TASK_PACKET.md", beforeHash: "before-absolute", afterHash: "after-absolute", diffBundlePath: "artifacts/diff-bundles/mvp027/absolute.diff", dryRunCommand: "git apply --check patches/absolute.patch", dryRunStatus: "成功", rollbackEvidencePath: "artifacts/rollback/mvp027/absolute.txt", rollbackVerifiedCommand: "git apply -R --check patches/absolute.patch", verificationCommand: "", reviewerChecklist: ["target pathを確認する"], reviewerApproved: false, aiddSpecConnections: [], containsLocalPath: false, missingRollbackEvidence: false }
    ]
  };
}

export function evaluateDiffBundleRollbackEvidenceWorkspace(workspace: DiffBundleRollbackEvidenceWorkspace): DiffBundleRollbackEvidenceWorkspaceReview {
  const reviewFindings: ReviewFinding[] = [];
  const allowedTargets = new Set(["AI_TASK_PACKET.md", "CODEX_PROMPT.md", "VERIFICATION_PLAN.md", "LEARNING_LOG.md"]);
  workspace.bundles.forEach((bundle, index) => {
    const label = bundle.bundleId || `bundle ${index + 1}`;
    if (!bundle.bundleId.trim()) reviewFindings.push(buildDiffBundleFinding(`${label}: bundle id不足`, "diff bundleに一意なbundle idを付ける"));
    if (!bundle.sourceApplyPlanId.trim()) reviewFindings.push(buildDiffBundleFinding(`${label}: source apply plan不足`, "Packet File Apply Plannerのapply plan idを記録する"));
    if (!bundle.sourcePatchId.trim()) reviewFindings.push(buildDiffBundleFinding(`${label}: source patch id不足`, "Safe Patch Reviewで承認されたpatch idを記録する"));
    if (!bundle.targetFile.trim()) reviewFindings.push(buildDiffBundleFinding(`${label}: target file不足`, "対象ファイルをAI依頼ファイルの許可リストから選ぶ"));
    if (bundle.targetFile.includes("..")) reviewFindings.push(buildDiffBundleFinding(`${label}: 危険なtarget path（../）`, "../を含むtarget pathを拒否する"));
    if (/^(?:\/|[A-Za-z]:[\\/])/.test(bundle.targetFile)) reviewFindings.push(buildDiffBundleFinding(`${label}: 危険なtarget path（絶対パス）`, "絶対パスを拒否し、許可された相対ファイルだけにする"));
    if (bundle.targetFile && !allowedTargets.has(bundle.targetFile)) reviewFindings.push(buildDiffBundleFinding(`${label}: 危険なtarget path`, "許可された4ファイル以外のdiff bundleを作らない"));
    if (!bundle.beforeHash.trim()) reviewFindings.push(buildDiffBundleFinding(`${label}: before hash不足`, "適用前の内容ハッシュを保存する"));
    if (!bundle.afterHash.trim()) reviewFindings.push(buildDiffBundleFinding(`${label}: after hash不足`, "dry-run後または適用候補後の内容ハッシュを保存する"));
    if (!bundle.diffBundlePath.trim()) reviewFindings.push(buildDiffBundleFinding(`${label}: diff bundle path不足`, "公開可能な相対パスでdiff bundleを保存する"));
    if (!bundle.dryRunCommand.trim()) reviewFindings.push(buildDiffBundleFinding(`${label}: dry-run未実行`, "git apply --check相当のdry-run commandを入れて実行する"));
    if (bundle.dryRunStatus !== "成功") reviewFindings.push(buildDiffBundleFinding(`${label}: dry-run未成功`, "dry-run成功を確認してから次へ進める"));
    if (!bundle.rollbackEvidencePath.trim() || bundle.missingRollbackEvidence) reviewFindings.push(buildDiffBundleFinding(`${label}: rollback evidence不足`, "rollback evidence pathを保存する"));
    if (!bundle.rollbackVerifiedCommand.trim()) reviewFindings.push(buildDiffBundleFinding(`${label}: rollback verified command不足`, "戻せることを確認するコマンドを入れる"));
    if (!bundle.verificationCommand.trim()) reviewFindings.push(buildDiffBundleFinding(`${label}: verification command不足`, "bundle適用後の検証コマンドを入れる"));
    if (!bundle.reviewerApproved) reviewFindings.push(buildDiffBundleFinding(`${label}: reviewer未承認`, "reviewer checklistを確認済みにして承認者を明示する"));
    if (bundle.containsLocalPath || containsLocalPathOrHost(bundle.diffBundlePath + bundle.rollbackEvidencePath + workspace.copyCodexPrompt)) reviewFindings.push(buildDiffBundleFinding(`${label}: ローカルパスやhost名の混入`, "公開可能な相対パスまたはartifact名に置き換える"));
    if (bundle.aiddSpecConnections.length === 0) reviewFindings.push(buildDiffBundleFinding(`${label}: AIDD-Spec接続不足`, "Verification Evidence / Review Record / Rollback Plan / Learning Logへの接続を表示する"));
  });
  if (workspace.copyCodexPrompt.trim() && !workspace.copyCodexPrompt.includes("AIDD-Spec v0.1")) reviewFindings.push(buildDiffBundleFinding("コピー用Codex prompt: AIDD-Spec接続不足", "コピー用Codex promptにAIDD-Spec v0.1接続を入れる"));
  if (workspace.copyCodexPrompt.trim() && !workspace.copyCodexPrompt.includes("rollback evidence")) reviewFindings.push(buildDiffBundleFinding("コピー用Codex prompt: rollback evidence不足", "コピー用Codex promptにrollback evidence保存条件を入れる"));
  const isEmpty = workspace.statusSample === "empty" && workspace.bundles.length === 0 && !workspace.copyCodexPrompt;
  return { status: isEmpty ? "empty" : reviewFindings.length === 0 ? "valid" : "failure", reviewFindings };
}

function buildDiffBundleFinding(finding: string, fixInstruction: string): ReviewFinding {
  return buildFinding("Diff Bundle & Rollback Evidence Workspace", "high", finding, fixInstruction, ["Verification Evidence", "Review Record", "Rollback Plan", "Learning Log", "AI Task Packet"], "pnpm run doctor:aidd");
}

export function createEmptyBundleDecisionLedger(): BundleDecisionLedger {
  return {
    statusSample: "empty",
    decisions: [],
    sourceDiffBundleWorkspace: createEmptyDiffBundleRollbackEvidenceWorkspace(),
    copyCodexPrompt: ""
  };
}

export function createValidBundleDecisionLedger(sourceDiffBundleWorkspace: DiffBundleRollbackEvidenceWorkspace = createValidDiffBundleRollbackEvidenceWorkspace()): BundleDecisionLedger {
  const [first, second, third] = sourceDiffBundleWorkspace.bundles;
  const decisions: BundleDecision[] = [
    {
      decisionId: "bundle-decision-trial014-001",
      bundleId: first?.bundleId ?? "diff-bundle-mvp027-001",
      targetFile: first?.targetFile ?? "AI_TASK_PACKET.md",
      status: "applied",
      decisionOwner: "AIDD Control Plane reviewer",
      decisionReason: "dry-run成功、rollback evidence保存、3ブラウザE2E維持、ローカルパス非混入を確認したため採用。",
      decidedAt: "2026-07-03T09:00:00.000Z",
      appliedEvidencePath: "artifacts/bundle-decisions/mvp028/bundle-decision-trial014-001-applied.txt",
      verificationEvidencePath: "artifacts/terminal/trial014-targeted-e2e.txt",
      rollbackEvidencePath: first?.rollbackEvidencePath ?? "artifacts/rollback/mvp027/safe-patch-mvp027-001-rollback.txt",
      reviewRecordPath: "artifacts/review-records/mvp028/bundle-decision-trial014-001.md",
      learningLogEntry: "applied bundleはVerification EvidenceとReview Recordへ紐づけ、次回AI Task Packetの検証条件として再利用する。",
      nextTaskPacketDelta: "次回packetにはbundle適用後の検証ログとrollback evidence pathを必須項目として追加する。",
      reviewerApproved: true,
      containsLocalPath: false
    },
    {
      decisionId: "bundle-decision-trial014-002",
      bundleId: second?.bundleId ?? "diff-bundle-mvp027-002",
      targetFile: second?.targetFile ?? "CODEX_PROMPT.md",
      status: "deferred",
      decisionOwner: "AIDD Control Plane reviewer",
      decisionReason: "本文差分は妥当だが、記事側の説明順とスクリーンショット再生成タイミングを合わせるため保留。",
      decidedAt: "2026-07-03T09:05:00.000Z",
      appliedEvidencePath: "artifacts/bundle-decisions/mvp028/bundle-decision-trial014-002-deferred.txt",
      verificationEvidencePath: "artifacts/terminal/trial014-static.txt",
      rollbackEvidencePath: second?.rollbackEvidencePath ?? "artifacts/rollback/mvp027/safe-patch-mvp027-002-rollback.txt",
      reviewRecordPath: "artifacts/review-records/mvp028/bundle-decision-trial014-002.md",
      learningLogEntry: "deferred bundleは急いで適用せず、次回のCodex prompt deltaに理由つきで戻す。",
      nextTaskPacketDelta: "保留bundleは、証跡更新と記事更新を同じ検証単位に揃えてから再レビューする。",
      reviewerApproved: true,
      containsLocalPath: false
    },
    {
      decisionId: "bundle-decision-trial014-003",
      bundleId: third?.bundleId ?? "diff-bundle-mvp027-003",
      targetFile: third?.targetFile ?? "VERIFICATION_PLAN.md",
      status: "rejected",
      decisionOwner: "AIDD Control Plane reviewer",
      decisionReason: "verification commandが現在のCI gateとずれているため、実ファイルへは適用せずLearning Logへ戻す。",
      decidedAt: "2026-07-03T09:10:00.000Z",
      appliedEvidencePath: "artifacts/bundle-decisions/mvp028/bundle-decision-trial014-003-rejected.txt",
      verificationEvidencePath: "artifacts/terminal/trial014-targeted-e2e.txt",
      rollbackEvidencePath: third?.rollbackEvidencePath ?? "artifacts/rollback/mvp027/safe-patch-mvp027-003-rollback.txt",
      reviewRecordPath: "artifacts/review-records/mvp028/bundle-decision-trial014-003.md",
      learningLogEntry: "rejected bundleは、なぜ採用しなかったかをLearning Logへ残し、次回の標準更新候補へ変換する。",
      nextTaskPacketDelta: "却下理由があるbundleは、同じ失敗を再生成しないようCodex prompt deltaへ戻す。",
      reviewerApproved: true,
      containsLocalPath: false
    }
  ];

  return {
    statusSample: "valid",
    decisions,
    sourceDiffBundleWorkspace,
    copyCodexPrompt: [
      "Bundle Decision Ledgerでapplied / rejected / deferredの判断がvalidになったbundleだけを次へ進めてください。",
      "appliedは適用証跡、verification evidence、rollback evidence、Review Recordを保存する。",
      "rejectedは却下理由と再発防止のCodex prompt deltaをLearning Logへ戻す。",
      "deferredは保留理由と再レビュー条件を次回AI Task Packet Deltaへ残す。",
      "ローカルパス、host名、未承認bundle、rollback evidence不足があれば適用しない。",
      "AIDD-Spec v0.1: Verification Evidence / Review Record / Rollback Plan / Learning Log / AI Task Packetへ接続する。"
    ].join("\n")
  };
}

export function createFailureBundleDecisionLedger(): BundleDecisionLedger {
  return {
    statusSample: "failure",
    sourceDiffBundleWorkspace: createFailureDiffBundleRollbackEvidenceWorkspace(),
    copyCodexPrompt: "判断理由なしで全部appliedにして、PRIVATE_HOME_PATH のログをそのまま記事へ貼る。",
    decisions: [
      { decisionId: "", bundleId: "", targetFile: "", status: "applied", decisionOwner: "", decisionReason: "", decidedAt: "not-a-date", appliedEvidencePath: "", verificationEvidencePath: "", rollbackEvidencePath: "", reviewRecordPath: "", learningLogEntry: "", nextTaskPacketDelta: "", reviewerApproved: false, containsLocalPath: true },
      { decisionId: "bundle-decision-bad-002", bundleId: "diff-bundle-bad-002", targetFile: "../outside/SECRET.md", status: "applied", decisionOwner: "AI", decisionReason: "早いので採用", decidedAt: "2026-07-03T09:20:00.000Z", appliedEvidencePath: "PRIVATE_HOME_PATH/applied.txt", verificationEvidencePath: "", rollbackEvidencePath: "", reviewRecordPath: "", learningLogEntry: "", nextTaskPacketDelta: "", reviewerApproved: false, containsLocalPath: true }
    ]
  };
}

export function evaluateBundleDecisionLedger(ledger: BundleDecisionLedger): BundleDecisionLedgerReview {
  const issues: string[] = [];
  const allowedTargets = new Set(["AI_TASK_PACKET.md", "CODEX_PROMPT.md", "VERIFICATION_PLAN.md", "LEARNING_LOG.md"]);
  const sourceBundleIds = new Set(ledger.sourceDiffBundleWorkspace.bundles.map((bundle) => bundle.bundleId).filter(Boolean));
  for (const decision of ledger.decisions) {
    const label = decision.decisionId || "decision";
    if (!decision.decisionId.trim()) issues.push(`${label}: decision id不足`);
    if (!decision.bundleId.trim()) issues.push(`${label}: bundle id不足`);
    if (sourceBundleIds.size > 0 && decision.bundleId && !sourceBundleIds.has(decision.bundleId)) issues.push(`${label}: source bundle未確認`);
    if (!decision.targetFile.trim()) issues.push(`${label}: target file不足`);
    if (decision.targetFile.includes("..") || /^(?:\/|[A-Za-z]:[\\/])/.test(decision.targetFile) || (decision.targetFile && !allowedTargets.has(decision.targetFile))) issues.push(`${label}: 危険なtarget path`);
    if (!decision.decisionOwner.trim()) issues.push(`${label}: decision owner不足`);
    if (!decision.decisionReason.trim()) issues.push(`${label}: decision reason不足`);
    if (!decision.decidedAt || Number.isNaN(Date.parse(decision.decidedAt))) issues.push(`${label}: decidedAt不正`);
    if (!decision.appliedEvidencePath.trim()) issues.push(`${label}: applied evidence不足`);
    if (!decision.verificationEvidencePath.trim()) issues.push(`${label}: verification evidence不足`);
    if (!decision.rollbackEvidencePath.trim()) issues.push(`${label}: rollback evidence不足`);
    if (!decision.reviewRecordPath.trim()) issues.push(`${label}: review record不足`);
    if (!decision.learningLogEntry.trim()) issues.push(`${label}: Learning Log不足`);
    if (decision.status !== "applied" && !decision.nextTaskPacketDelta.trim()) issues.push(`${label}: 未採用理由のTask Packet Delta不足`);
    if (!decision.reviewerApproved) issues.push(`${label}: reviewer未承認`);
    const pathText = `${decision.appliedEvidencePath}${decision.verificationEvidencePath}${decision.rollbackEvidencePath}${decision.reviewRecordPath}${ledger.copyCodexPrompt}`;
    if (decision.containsLocalPath || containsLocalPathOrHost(pathText)) issues.push(`${label}: ローカルパスやhost名の混入`);
  }
  if (ledger.copyCodexPrompt.trim() && !ledger.copyCodexPrompt.includes("AIDD-Spec v0.1")) issues.push("コピー用Codex prompt: AIDD-Spec接続不足");
  const appliedCount = ledger.decisions.filter((decision) => decision.status === "applied").length;
  const rejectedCount = ledger.decisions.filter((decision) => decision.status === "rejected").length;
  const deferredCount = ledger.decisions.filter((decision) => decision.status === "deferred").length;
  const isEmpty = ledger.statusSample === "empty" && ledger.decisions.length === 0 && !ledger.copyCodexPrompt;
  return { status: isEmpty ? "empty" : issues.length === 0 ? "valid" : "failure", appliedCount, rejectedCount, deferredCount, issues };
}

export function createEmptyDiffBundleDecisionLedger(): DiffBundleDecisionLedger {
  return {
    statusSample: "empty",
    decisions: [],
    sourceDiffBundleWorkspace: createEmptyDiffBundleRollbackEvidenceWorkspace(),
    standardDocument: "standards/aidd-control-plane-mvp-v0.1.md",
    copyCodexPrompt: ""
  };
}

export function createValidDiffBundleDecisionLedger(sourceDiffBundleWorkspace: DiffBundleRollbackEvidenceWorkspace = createValidDiffBundleRollbackEvidenceWorkspace()): DiffBundleDecisionLedger {
  const [first, second, third] = sourceDiffBundleWorkspace.bundles;
  const sharedConnections = ["AIDD-Spec v0.1", "Review Record", "Verification Evidence", "Learning Log", "Rollback Plan", "standards/aidd-control-plane-mvp-v0.1.md"];
  return {
    statusSample: "valid",
    sourceDiffBundleWorkspace,
    standardDocument: "standards/aidd-control-plane-mvp-v0.1.md",
    decisions: [
      {
        decisionId: "diff-bundle-decision-mvp028-001",
        bundleId: first?.bundleId ?? "diff-bundle-mvp027-001",
        targetFile: first?.targetFile ?? "AI_TASK_PACKET.md",
        status: "adopted",
        decisionOwner: "AIDD Control Plane reviewer",
        decisionReason: "dry-run成功、証跡保存、rollback確認、local path非混入を確認したため採用。",
        reviewRecordPath: "artifacts/review-records/mvp028/diff-bundle-decision-mvp028-001.md",
        verificationEvidencePath: "artifacts/terminal/mvp028/diff-bundle-decision-mvp028-001-verification.txt",
        learningLogEntry: "採用済みdiff bundleはVerification EvidenceとRollback Planを揃えたうえで次回packetへ反映する。",
        rollbackPlanPath: "artifacts/rollback/mvp028/diff-bundle-decision-mvp028-001-rollback-plan.md",
        rollbackConfirmed: true,
        adoptedVerificationCommands: ["pnpm run test:e2e -- --project=chromium --project=firefox --project=webkit", "pnpm run doctor:aidd"],
        aiddSpecConnections: sharedConnections,
        containsLocalPath: false
      },
      {
        decisionId: "diff-bundle-decision-mvp028-002",
        bundleId: second?.bundleId ?? "diff-bundle-mvp027-002",
        targetFile: second?.targetFile ?? "CODEX_PROMPT.md",
        status: "deferred",
        decisionOwner: "AIDD Control Plane reviewer",
        decisionReason: "Verification Evidenceの保存名を記事証跡と合わせる必要があるため保留。",
        reviewRecordPath: "artifacts/review-records/mvp028/diff-bundle-decision-mvp028-002.md",
        verificationEvidencePath: "artifacts/terminal/mvp028/diff-bundle-decision-mvp028-002-verification.txt",
        learningLogEntry: "保留diff bundleは理由と再レビュー条件をLearning Logへ戻す。",
        rollbackPlanPath: "artifacts/rollback/mvp028/diff-bundle-decision-mvp028-002-rollback-plan.md",
        rollbackConfirmed: true,
        adoptedVerificationCommands: [],
        aiddSpecConnections: sharedConnections,
        containsLocalPath: false
      },
      {
        decisionId: "diff-bundle-decision-mvp028-003",
        bundleId: third?.bundleId ?? "diff-bundle-mvp027-003",
        targetFile: third?.targetFile ?? "VERIFICATION_PLAN.md",
        status: "rejected",
        decisionOwner: "AIDD Control Plane reviewer",
        decisionReason: "検証手順が現行CI gateと重複しているため採用せず、Learning Logへ戻す。",
        reviewRecordPath: "artifacts/review-records/mvp028/diff-bundle-decision-mvp028-003.md",
        verificationEvidencePath: "artifacts/terminal/mvp028/diff-bundle-decision-mvp028-003-verification.txt",
        learningLogEntry: "却下理由を次回Codex Prompt Deltaへ戻し、同じ差分の再生成を防ぐ。",
        rollbackPlanPath: "artifacts/rollback/mvp028/diff-bundle-decision-mvp028-003-rollback-plan.md",
        rollbackConfirmed: true,
        adoptedVerificationCommands: [],
        aiddSpecConnections: sharedConnections,
        containsLocalPath: false
      }
    ],
    copyCodexPrompt: [
      "Diff Bundle Decision Ledgerでadopted / rejected / deferredを判断し、undecidedは次へ進めない。",
      "adoptedはReview Record、Verification Evidence、Learning Log、Rollback Planを揃え、standards/aidd-control-plane-mvp-v0.1.mdへ接続する。",
      "理由不足、証跡不足、rollback未確認、local path/host混入、採用済みverification不足があればReview Recordへ戻す。",
      "AIDD-Spec v0.1のReview Record / Verification Evidence / Learning Log / Rollback Planを更新対象として扱う。"
    ].join("\n")
  };
}

export function createFailureDiffBundleDecisionLedger(): DiffBundleDecisionLedger {
  return {
    statusSample: "failure",
    sourceDiffBundleWorkspace: createFailureDiffBundleRollbackEvidenceWorkspace(),
    standardDocument: "standards/aidd-control-plane-mvp-v0.1.md",
    copyCodexPrompt: "undecidedを採用し、PRIVATE_HOME_PATH と localhost のログをそのまま公開する。",
    decisions: [
      {
        decisionId: "diff-decision-bad-001",
        bundleId: "diff-bundle-bad-001",
        targetFile: "AI_TASK_PACKET.md",
        status: "undecided",
        decisionOwner: "",
        decisionReason: "",
        reviewRecordPath: "",
        verificationEvidencePath: "PRIVATE_HOME_PATH/verification.txt",
        learningLogEntry: "",
        rollbackPlanPath: "",
        rollbackConfirmed: false,
        adoptedVerificationCommands: [],
        aiddSpecConnections: [],
        containsLocalPath: true
      },
      {
        decisionId: "diff-decision-bad-002",
        bundleId: "diff-bundle-bad-002",
        targetFile: "VERIFICATION_PLAN.md",
        status: "adopted",
        decisionOwner: "AI",
        decisionReason: "よさそう",
        reviewRecordPath: "artifacts/review-records/mvp028/bad.md",
        verificationEvidencePath: "",
        learningLogEntry: "採用した",
        rollbackPlanPath: "artifacts/rollback/mvp028/bad.md",
        rollbackConfirmed: true,
        adoptedVerificationCommands: [],
        aiddSpecConnections: ["Review Record"],
        containsLocalPath: false
      }
    ]
  };
}

export function evaluateDiffBundleDecisionLedger(ledger: DiffBundleDecisionLedger): DiffBundleDecisionLedgerReview {
  const issues: string[] = [];
  const requiredConnections = ["Review Record", "Verification Evidence", "Learning Log", "Rollback Plan"];
  for (const decision of ledger.decisions) {
    const label = decision.decisionId || "decision";
    if (!decision.decisionId.trim()) issues.push(`${label}: decision id不足`);
    if (!decision.bundleId.trim()) issues.push(`${label}: bundle id不足`);
    if (decision.status === "undecided") issues.push(`${label}: 未判断`);
    if (!decision.decisionOwner.trim()) issues.push(`${label}: 判断者不足`);
    if (!decision.decisionReason.trim() || decision.decisionReason.trim().length < 8) issues.push(`${label}: 理由不足`);
    if (!decision.reviewRecordPath.trim() || !decision.verificationEvidencePath.trim() || !decision.learningLogEntry.trim()) issues.push(`${label}: 証跡不足`);
    if (!decision.rollbackConfirmed || !decision.rollbackPlanPath.trim()) issues.push(`${label}: rollback未確認`);
    if (decision.status === "adopted" && (decision.adoptedVerificationCommands.length === 0 || !decision.verificationEvidencePath.trim())) issues.push(`${label}: 採用済みverification不足`);
    for (const connection of requiredConnections) {
      if (!decision.aiddSpecConnections.includes(connection)) issues.push(`${label}: ${connection}接続不足`);
    }
    const pathText = `${decision.reviewRecordPath}${decision.verificationEvidencePath}${decision.rollbackPlanPath}${ledger.copyCodexPrompt}`;
    if (decision.containsLocalPath || containsLocalPathOrHost(pathText)) issues.push(`${label}: ローカルパスやhost名の混入`);
  }
  if (!ledger.standardDocument.includes("standards/aidd-control-plane-mvp-v0.1.md")) issues.push("標準文書接続不足");
  if (ledger.copyCodexPrompt.trim() && !ledger.copyCodexPrompt.includes("AIDD-Spec v0.1")) issues.push("コピー用Codex prompt: AIDD-Spec接続不足");
  const adoptedCount = ledger.decisions.filter((decision) => decision.status === "adopted").length;
  const rejectedCount = ledger.decisions.filter((decision) => decision.status === "rejected").length;
  const deferredCount = ledger.decisions.filter((decision) => decision.status === "deferred").length;
  const undecidedCount = ledger.decisions.filter((decision) => decision.status === "undecided").length;
  const isEmpty = ledger.statusSample === "empty" && ledger.decisions.length === 0 && !ledger.copyCodexPrompt;
  return { status: isEmpty ? "empty" : issues.length === 0 ? "valid" : "failure", adoptedCount, rejectedCount, deferredCount, undecidedCount, issues };
}

export function createEmptyAdoptedBundleExporter(): AdoptedBundleExporter {
  return {
    statusSample: "empty",
    exports: [],
    standardDocument: "standards/aidd-control-plane-mvp-v0.1.md",
    sourceDecisionLedger: createEmptyDiffBundleDecisionLedger(),
    copyCodexPrompt: ""
  };
}

export function createValidAdoptedBundleExporter(sourceDecisionLedger: DiffBundleDecisionLedger = createValidDiffBundleDecisionLedger()): AdoptedBundleExporter {
  const adoptedDecisions = sourceDecisionLedger.decisions.filter((decision) => decision.status === "adopted");
  const sharedConnections = ["AIDD-Spec v0.1", "AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan", "standards/aidd-control-plane-mvp-v0.1.md"];
  return {
    statusSample: "valid",
    sourceDecisionLedger,
    standardDocument: "standards/aidd-control-plane-mvp-v0.1.md",
    exports: adoptedDecisions.map((decision, index) => ({
      exportId: `adopted-bundle-export-mvp029-${String(index + 1).padStart(3, "0")}`,
      sourceDecisionId: decision.decisionId,
      sourceBundleId: decision.bundleId,
      sourceDecisionStatus: decision.status,
      targetFile: decision.targetFile,
      markdownBody: [
        `## Adopted Bundle Export: ${decision.bundleId}`,
        "",
        `- source decision: ${decision.decisionId}`,
        `- target file: ${decision.targetFile}`,
        "- AIDD-Spec: AI Task Packet / Verification Evidence / Review Record / Learning Log / Rollback Plan",
        `- verification: ${decision.adoptedVerificationCommands.join(" / ")}`,
        `- rollback: ${decision.rollbackPlanPath}`
      ].join("\n"),
      reviewEvidencePath: decision.reviewRecordPath,
      verificationEvidencePath: decision.verificationEvidencePath,
      verificationCommands: decision.adoptedVerificationCommands,
      rollbackCondition: "Review Record、Verification Evidence、Rollback Plan、Learning Logのいずれかが欠けたらexportを破棄してDecision Ledgerへ戻す。",
      learningLogEntry: decision.learningLogEntry,
      aiddSpecConnections: sharedConnections,
      containsLocalPath: false
    })),
    copyCodexPrompt: [
      "Adopted Bundle ExporterではDiff Bundle Decision LedgerでadoptedになったbundleだけをMarkdown export対象にしてください。",
      "rejected / deferred / undecided bundleが混入した場合は適用せず、Review RecordとLearning Logへ戻してください。",
      "AI Task Packet、Verification Evidence、Review Record、Learning Log、Rollback Plan、standards/aidd-control-plane-mvp-v0.1.mdへの接続を保持してください。",
      "verification command、rollback condition、review evidence、local path/host非混入を確認してから次の適用計画へ進めてください。"
    ].join("\n")
  };
}

export function createFailureAdoptedBundleExporter(): AdoptedBundleExporter {
  const sourceDecisionLedger = createFailureDiffBundleDecisionLedger();
  return {
    statusSample: "failure",
    sourceDecisionLedger,
    standardDocument: "standards/aidd-control-plane-mvp-v0.1.md",
    copyCodexPrompt: "AIDD接続なしで rejected / deferred / undecided をまとめてexportし、localhost のterminal logを本文へ貼る。",
    exports: [
      {
        exportId: "adopted-export-bad-001",
        sourceDecisionId: "diff-decision-bad-rejected",
        sourceBundleId: "diff-bundle-rejected",
        sourceDecisionStatus: "rejected",
        targetFile: "AI_TASK_PACKET.md",
        markdownBody: "却下bundleを採用済みとしてexportする。",
        reviewEvidencePath: "",
        verificationEvidencePath: "artifacts/terminal/mvp029/rejected.txt",
        verificationCommands: ["pnpm run doctor:aidd"],
        rollbackCondition: "差し戻す",
        learningLogEntry: "",
        aiddSpecConnections: ["AI Task Packet"],
        containsLocalPath: false
      },
      {
        exportId: "adopted-export-bad-002",
        sourceDecisionId: "diff-decision-bad-deferred",
        sourceBundleId: "diff-bundle-deferred",
        sourceDecisionStatus: "deferred",
        targetFile: "CODEX_PROMPT.md",
        markdownBody: "保留bundleを混ぜる。",
        reviewEvidencePath: "artifacts/review-records/mvp029/deferred.md",
        verificationEvidencePath: "PRIVATE_HOME_PATH/terminal.txt",
        verificationCommands: [],
        rollbackCondition: "",
        learningLogEntry: "保留のまま進めた",
        aiddSpecConnections: [],
        containsLocalPath: true
      },
      {
        exportId: "adopted-export-bad-003",
        sourceDecisionId: "diff-decision-bad-undecided",
        sourceBundleId: "diff-bundle-undecided",
        sourceDecisionStatus: "undecided",
        targetFile: "VERIFICATION_PLAN.md",
        markdownBody: "未判断bundleをlocalhost evidence付きでexportする。",
        reviewEvidencePath: "artifacts/review-records/mvp029/undecided.md",
        verificationEvidencePath: "http://localhost:9323/report",
        verificationCommands: ["pnpm run test:e2e"],
        rollbackCondition: "",
        learningLogEntry: "未判断のまま進めた",
        aiddSpecConnections: ["Verification Evidence"],
        containsLocalPath: true
      }
    ]
  };
}

export function evaluateAdoptedBundleExporter(exporter: AdoptedBundleExporter): AdoptedBundleExporterReview {
  const issues: string[] = [];
  const requiredConnections = ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"];
  for (const item of exporter.exports) {
    const label = item.exportId || "adopted bundle export";
    if (!item.exportId.trim()) issues.push(`${label}: export id不足`);
    if (item.sourceDecisionStatus === "rejected") issues.push(`${label}: 却下bundle混入`);
    if (item.sourceDecisionStatus === "deferred") issues.push(`${label}: 保留bundle混入`);
    if (item.sourceDecisionStatus === "undecided") issues.push(`${label}: 未判断bundle混入`);
    if (item.sourceDecisionStatus !== "adopted") issues.push(`${label}: adopted以外のbundleをexportしています`);
    if (!item.reviewEvidencePath.trim()) issues.push(`${label}: review evidence不足`);
    if (!item.verificationEvidencePath.trim()) issues.push(`${label}: verification evidence不足`);
    if (item.verificationCommands.length === 0) issues.push(`${label}: verification command不足`);
    if (!item.rollbackCondition.trim()) issues.push(`${label}: rollback condition不足`);
    if (!item.learningLogEntry.trim()) issues.push(`${label}: Learning Log不足`);
    if (!requiredConnections.every((connection) => item.aiddSpecConnections.includes(connection))) issues.push(`${label}: AIDD-Spec接続不足`);
    for (const connection of requiredConnections) {
      if (!item.aiddSpecConnections.includes(connection)) issues.push(`${label}: ${connection}接続不足`);
    }
    const exportText = `${item.markdownBody}\n${item.reviewEvidencePath}\n${item.verificationEvidencePath}\n${item.rollbackCondition}\n${exporter.copyCodexPrompt}`;
    if (item.containsLocalPath || containsLocalPathOrHost(exportText)) issues.push(`${label}: ローカルパスやhost名の混入`);
  }
  if (!exporter.standardDocument.includes("standards/aidd-control-plane-mvp-v0.1.md")) issues.push("標準文書接続不足");
  if (exporter.copyCodexPrompt.trim() && !exporter.copyCodexPrompt.includes("AI Task Packet")) issues.push("コピー用Codex prompt: AI Task Packet接続不足");
  const adoptedExportCount = exporter.exports.filter((item) => item.sourceDecisionStatus === "adopted").length;
  const blockedBundleCount = exporter.exports.length - adoptedExportCount;
  const isEmpty = exporter.statusSample === "empty" && exporter.exports.length === 0 && !exporter.copyCodexPrompt;
  return { status: isEmpty ? "empty" : issues.length === 0 ? "valid" : "failure", adoptedExportCount, blockedBundleCount, issues };
}

export function createEmptyExportedPacketPreflightReviewer(): ExportedPacketPreflightReviewer {
  return {
    statusSample: "empty",
    packets: [],
    sourceExporter: createEmptyAdoptedBundleExporter(),
    reviewChecklist: [],
    copyCodexPrompt: ""
  };
}

export function createValidExportedPacketPreflightReviewer(sourceExporter: AdoptedBundleExporter = createValidAdoptedBundleExporter()): ExportedPacketPreflightReviewer {
  const sharedConnections = ["AIDD-Spec v0.1", "AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan", "standards/aidd-control-plane-mvp-v0.1.md"];
  return {
    statusSample: "valid",
    sourceExporter,
    packets: sourceExporter.exports
      .filter((item) => item.sourceDecisionStatus === "adopted")
      .map((item, index) => ({
        packetId: `exported-packet-preflight-mvp030-${String(index + 1).padStart(3, "0")}`,
        sourceExportId: item.exportId,
        sourceDecisionStatus: item.sourceDecisionStatus,
        targetFile: item.targetFile,
        markdownBody: [
          item.markdownBody,
          "",
          "## Preflight Review",
          "- 未採用bundle混入なし",
          "- Chromium / Firefox / WebKitの3ブラウザE2Eを維持",
          "- lint / typecheck / test / build / doctor:aidd / mock:doctor / test:e2eで検証",
          "- local path / host / tailnetを公開証跡へ入れない",
          "- Rollback PlanとVerification Evidenceを同じpacketへ接続"
        ].join("\n"),
        browserProjects: ["chromium", "firefox", "webkit"],
        verificationDepth: "standard",
        evidencePaths: [
          "artifacts/terminal/mvp030/preflight-review.txt",
          "artifacts/screenshots/aidd-control-plane-mvp030-valid.png",
          item.reviewEvidencePath,
          item.verificationEvidencePath
        ],
        rollbackPlan: item.rollbackCondition,
        aiddSpecConnections: sharedConnections,
        containsLocalPath: false
      })),
    reviewChecklist: [
      "未採用bundle混入がない",
      "Firefoxを含む3ブラウザE2Eを維持している",
      "lint/typecheck/test/build/doctor:aidd/mock:doctor/test:e2eを浅い検証に落としていない",
      "local path/host/tailnetがMarkdown、証跡、コピー用promptへ混入していない",
      "rollback planとevidence pathが揃っている",
      "AI Task Packet / Verification Evidence / Review Record / Learning Log / Rollback Planへ接続している"
    ],
    copyCodexPrompt: [
      "Exported Packet Preflight Reviewerでvalidになったpacketだけを次のAI Task Packetへ渡してください。",
      "未採用bundle、Firefox除外、浅い検証、local path/host/tailnet、rollback不足、evidence不足、AIDD-Spec接続不足があればReview Recordへ戻してください。",
      "AIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdへの接続を保ち、Verification EvidenceとRollback Planを同時に更新してください。"
    ].join("\n")
  };
}

export function createFailureExportedPacketPreflightReviewer(): ExportedPacketPreflightReviewer {
  const sourceExporter = createFailureAdoptedBundleExporter();
  return {
    statusSample: "failure",
    sourceExporter,
    reviewChecklist: ["あとで目視する", "Firefoxは遅いので外す"],
    copyCodexPrompt: "rejected bundleも含めてpacket化する。localhost と tailnet.internal の証跡を貼り、pnpm run testだけ実行する。",
    packets: [
      {
        packetId: "exported-packet-bad-001",
        sourceExportId: "adopted-export-bad-001",
        sourceDecisionStatus: "rejected",
        targetFile: "AI_TASK_PACKET.md",
        markdownBody: "却下bundleを含む。検証はpnpm run testだけ。http://localhost:9323/report と tailnet.internal を参照。",
        browserProjects: ["chromium", "webkit"],
        verificationDepth: "shallow",
        evidencePaths: [],
        rollbackPlan: "",
        aiddSpecConnections: ["AI Task Packet"],
        containsLocalPath: true
      },
      {
        packetId: "exported-packet-bad-002",
        sourceExportId: "adopted-export-bad-002",
        sourceDecisionStatus: "adopted",
        targetFile: "VERIFICATION_PLAN.md",
        markdownBody: "AIDD-Spec接続を省いたpacket。PRIVATE_HOME_PATH/artifacts/result.txt を証跡にする。",
        browserProjects: ["chromium", "firefox", "webkit"],
        verificationDepth: "none",
        evidencePaths: ["PRIVATE_HOME_PATH/artifacts/result.txt"],
        rollbackPlan: "失敗したら戻す",
        aiddSpecConnections: [],
        containsLocalPath: true
      }
    ]
  };
}

export function evaluateExportedPacketPreflightReviewer(reviewer: ExportedPacketPreflightReviewer): ExportedPacketPreflightReviewerReview {
  const issues: string[] = [];
  const isEmpty = reviewer.statusSample === "empty" && reviewer.packets.length === 0 && !reviewer.copyCodexPrompt;
  const requiredConnections = ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"];
  for (const packet of reviewer.packets) {
    const label = packet.packetId || "exported packet";
    if (!packet.packetId.trim()) issues.push(`${label}: packet id不足`);
    if (packet.sourceDecisionStatus !== "adopted") issues.push(`${label}: 未採用bundle混入`);
    if (!packet.browserProjects.includes("firefox")) issues.push(`${label}: Firefox除外`);
    if (!["chromium", "firefox", "webkit"].every((project) => packet.browserProjects.includes(project))) issues.push(`${label}: 3ブラウザE2E不足`);
    if (packet.verificationDepth !== "standard") issues.push(`${label}: 浅い検証`);
    if (packet.containsLocalPath || containsLocalPathOrHost(`${packet.markdownBody}\n${packet.evidencePaths.join("\n")}\n${reviewer.copyCodexPrompt}`) || containsTailnetReference(`${packet.markdownBody}\n${packet.evidencePaths.join("\n")}\n${reviewer.copyCodexPrompt}`)) issues.push(`${label}: local path/host/tailnet混入`);
    if (!packet.rollbackPlan.trim() || packet.rollbackPlan.trim().length < 16) issues.push(`${label}: rollback不足`);
    if (packet.evidencePaths.length === 0) issues.push(`${label}: evidence不足`);
    for (const connection of requiredConnections) {
      if (!packet.aiddSpecConnections.includes(connection)) issues.push(`${label}: ${connection}接続不足`);
    }
    if (!requiredConnections.every((connection) => packet.aiddSpecConnections.includes(connection))) issues.push(`${label}: AIDD-Spec接続不足`);
  }
  if (!isEmpty && reviewer.reviewChecklist.length === 0) issues.push("review checklist不足");
  if (reviewer.copyCodexPrompt.trim() && !reviewer.copyCodexPrompt.includes("AIDD-Spec v0.1")) issues.push("コピー用Codex prompt: AIDD-Spec接続不足");
  const readyPacketCount = reviewer.packets.filter((packet) => packet.sourceDecisionStatus === "adopted").length;
  const blockedPacketCount = reviewer.packets.length - readyPacketCount;
  return { status: isEmpty ? "empty" : issues.length === 0 ? "valid" : "failure", readyPacketCount, blockedPacketCount, issues };
}

export function createEmptyRunAuthorizationGate(): RunAuthorizationGate {
  return {
    statusSample: "empty",
    preflightStatus: "empty",
    approver: "",
    authorizationReason: "",
    codexCommand: "",
    sandboxMode: "",
    verificationCommands: [],
    browserProjects: [],
    evidencePath: "",
    rollbackPlan: "",
    aiddSpecConnections: [],
    reviewFindings: []
  };
}

export function createValidRunAuthorizationGate(preflightReview: ExportedPacketPreflightReviewerReview = evaluateExportedPacketPreflightReviewer(createValidExportedPacketPreflightReviewer())): RunAuthorizationGate {
  void preflightReview;
  return {
    statusSample: "valid",
    preflightStatus: "valid",
    approver: "AIDD reviewer",
    authorizationReason: "MVP030 preflight valid、3ブラウザE2E、rollback、公開可能な証跡、AIDD-Spec接続を確認したため実行を許可する。",
    codexCommand: "codex exec --sandbox danger-full-access --ask-for-approval never --target experiments/aidd-control-plane-mvp-031/generated-repo",
    sandboxMode: "danger-full-access / approval never",
    verificationCommands: [
      "pnpm run lint",
      "pnpm run typecheck",
      "pnpm run test",
      "pnpm run build",
      "pnpm run test:e2e",
      "pnpm run doctor:aidd"
    ],
    browserProjects: ["chromium", "firefox", "webkit"],
    evidencePath: "experiments/aidd-control-plane-mvp-031/artifacts/terminal/run-authorization-gate.txt",
    rollbackPlan: "Run Authorization Gateの承認条件が崩れたら実行を止め、Review Recordへfindingを戻して対象差分を適用しない。",
    aiddSpecConnections: ["AIDD-Spec v0.1", "AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"],
    reviewFindings: []
  };
}

export function createFailureRunAuthorizationGate(): RunAuthorizationGate {
  return {
    statusSample: "failure",
    preflightStatus: "failure",
    approver: "",
    authorizationReason: "",
    codexCommand: "codex exec --target ../private-build-host --include PRIVATE_HOME_PATH/report --include TAILNET_EXAMPLE/log",
    sandboxMode: "",
    verificationCommands: ["pnpm run test"],
    browserProjects: ["chromium", "webkit"],
    evidencePath: "",
    rollbackPlan: "",
    aiddSpecConnections: ["AI Task Packet"],
    reviewFindings: ["preflight failureを解消せず実行しようとしている", "Firefox除外と浅い検証のまま承認しようとしている"]
  };
}

export function evaluateRunAuthorizationGate(gate: RunAuthorizationGate): RunAuthorizationGateReview {
  const isEmpty = gate.statusSample === "empty" && !gate.approver && !gate.codexCommand && gate.verificationCommands.length === 0;
  const issues: string[] = [];
  const combinedText = [
    gate.codexCommand,
    gate.evidencePath,
    gate.rollbackPlan,
    gate.authorizationReason,
    gate.reviewFindings.join("\n")
  ].join("\n");
  const requiredConnections = ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"];

  if (!isEmpty && gate.preflightStatus !== "valid") issues.push("preflight statusがvalidでない");
  if (!isEmpty && !gate.approver.trim()) issues.push("approver不足");
  if (!isEmpty && !gate.authorizationReason.trim()) issues.push("authorization reason不足");
  if (!isEmpty && !gate.codexCommand.trim()) issues.push("Codex command不足");
  if (gate.codexCommand.includes("..") || gate.codexCommand.includes("/Users/") || gate.codexCommand.includes("PRIVATE_HOME_PATH")) issues.push("Codex command: 危険なtarget path");
  if (!isEmpty && !gate.sandboxMode.trim()) issues.push("sandbox mode不足");
  if (!isEmpty && !gate.browserProjects.includes("firefox")) issues.push("Firefox除外");
  if (!isEmpty && !["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e"].every((command) => gate.verificationCommands.includes(command))) issues.push("shallow verification");
  if (containsLocalPathOrHost(combinedText) || containsTailnetReference(combinedText) || /https?:\/\/(?:10\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.)/i.test(combinedText)) issues.push("local path / host / tailnet / private network URL混入");
  if (!isEmpty && !gate.evidencePath.trim()) issues.push("evidence path不足");
  if (!isEmpty && !gate.rollbackPlan.trim()) issues.push("rollback plan不足");
  for (const connection of requiredConnections) {
    if (!isEmpty && !gate.aiddSpecConnections.includes(connection)) issues.push(`${connection}接続不足`);
  }
  if (!isEmpty && !requiredConnections.every((connection) => gate.aiddSpecConnections.includes(connection))) issues.push("AIDD-Spec接続不足");

  return { status: isEmpty ? "empty" : issues.length === 0 ? "valid" : "failure", issues };
}

export function createEmptyCodexRunQueue(): CodexRunQueueItem[] {
  return [];
}

export function createValidCodexRunQueue(sourceReview: RunAuthorizationGateReview = evaluateRunAuthorizationGate(createValidRunAuthorizationGate())): CodexRunQueueItem[] {
  void sourceReview;
  const sourceAuthorizationStatus: ArtifactEvidenceStatus = "valid";
  const base = {
    sourceAuthorizationId: "run-auth-mvp031-valid",
    sourceAuthorizationStatus,
    codexCommand: "codex exec --sandbox danger-full-access --ask-for-approval never --target generated-repo --task MVP032",
    sandboxMode: "danger-full-access / approval never",
    requiredVerificationCommands: [
      "pnpm run lint",
      "pnpm run typecheck",
      "pnpm run test",
      "pnpm run build",
      "pnpm run test:e2e",
      "pnpm run doctor:aidd",
      "pnpm run mock:doctor"
    ],
    browserProjects: ["chromium", "firefox", "webkit"],
    retryPolicy: "Firefoxが遅い場合はworkers 1、retries 1、timeout 120000で1回だけ再実行し、結果をReview Recordへ戻す。",
    rollbackPlan: "queue itemが失敗したら採用対象から外し、Run Authorization Gateへ戻してrollback理由と再実行条件を記録する。",
    aiddSpecConnections: ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"]
  };
  return [
    {
      ...base,
      id: "queue-mvp032-waiting",
      status: "waiting",
      startedAt: "",
      finishedAt: "",
      actualVerificationResults: [],
      evidencePaths: [
        "experiments/aidd-control-plane-mvp-032/artifacts/terminal/queue-waiting.txt",
        "experiments/aidd-control-plane-mvp-032/artifacts/screenshots/queue-waiting.png",
        "playwright-report/index.html"
      ],
      reviewFindings: []
    },
    {
      ...base,
      id: "queue-mvp032-running",
      status: "running",
      startedAt: "2026-07-04T09:20:00+09:00",
      finishedAt: "",
      actualVerificationResults: ["pnpm run lint: running", "pnpm run typecheck: waiting"],
      evidencePaths: [
        "experiments/aidd-control-plane-mvp-032/artifacts/terminal/queue-running.txt",
        "experiments/aidd-control-plane-mvp-032/artifacts/screenshots/queue-running.png",
        "playwright-report/index.html"
      ],
      reviewFindings: []
    },
    {
      ...base,
      id: "queue-mvp032-succeeded",
      status: "succeeded",
      startedAt: "2026-07-04T09:00:00+09:00",
      finishedAt: "2026-07-04T09:18:00+09:00",
      actualVerificationResults: [
        "pnpm run lint: passed",
        "pnpm run typecheck: passed",
        "pnpm run test: passed",
        "pnpm run build: passed",
        "pnpm run test:e2e: chromium/firefox/webkit passed",
        "pnpm run doctor:aidd: passed",
        "pnpm run mock:doctor: passed"
      ],
      evidencePaths: [
        "experiments/aidd-control-plane-mvp-032/artifacts/terminal/queue-succeeded.txt",
        "experiments/aidd-control-plane-mvp-032/artifacts/screenshots/queue-succeeded.png",
        "playwright-report/index.html"
      ],
      reviewFindings: []
    }
  ];
}

export function createFailureCodexRunQueue(): CodexRunQueueItem[] {
  return [
    {
      id: "queue-mvp032-dangerous-command",
      sourceAuthorizationId: "run-auth-mvp031-failure",
      sourceAuthorizationStatus: "failure",
      status: "failed",
      codexCommand: "codex exec --target ../private-build-host --include PRIVATE_HOME_PATH/report",
      sandboxMode: "",
      startedAt: "2026-07-04T09:30:00+09:00",
      finishedAt: "2026-07-04T09:31:00+09:00",
      requiredVerificationCommands: ["pnpm run test"],
      actualVerificationResults: ["pnpm run test: failed"],
      browserProjects: ["chromium", "webkit"],
      evidencePaths: ["tmp/latest.log"],
      retryPolicy: "",
      rollbackPlan: "",
      reviewFindings: ["危険command", "Firefox除外", "浅い検証", "rollback不足"],
      aiddSpecConnections: ["AI Task Packet"]
    },
    {
      id: "queue-mvp032-evidence-missing",
      sourceAuthorizationId: "run-auth-mvp031-valid",
      sourceAuthorizationStatus: "valid",
      status: "evidence_missing",
      codexCommand: "codex exec --sandbox danger-full-access --ask-for-approval never --target generated-repo",
      sandboxMode: "danger-full-access",
      startedAt: "2026-07-04T09:32:00+09:00",
      finishedAt: "2026-07-04T09:40:00+09:00",
      requiredVerificationCommands: ["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e", "pnpm run doctor:aidd", "pnpm run mock:doctor"],
      actualVerificationResults: ["pnpm run lint: passed", "pnpm run typecheck: passed"],
      browserProjects: ["chromium", "firefox", "webkit"],
      evidencePaths: ["experiments/aidd-control-plane-mvp-032/artifacts/terminal/queue-missing.txt"],
      retryPolicy: "1回だけ再実行",
      rollbackPlan: "失敗時はReview Recordへ戻す",
      reviewFindings: ["証跡不足", "terminal evidenceだけでscreenshot/playwright evidence不足"],
      aiddSpecConnections: ["AI Task Packet", "Verification Evidence", "Review Record"]
    }
  ];
}

export function evaluateCodexRunQueue(queue: CodexRunQueueItem[]): CodexRunQueueReview {
  if (queue.length === 0) return { status: "empty", issues: [] };
  const issues: string[] = [];
  const requiredCommands = ["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e", "pnpm run doctor:aidd", "pnpm run mock:doctor"];
  const requiredConnections = ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"];

  for (const item of queue) {
    const label = item.id;
    const combinedText = [item.codexCommand, item.evidencePaths.join("\n"), item.rollbackPlan, item.reviewFindings.join("\n")].join("\n");
    if (item.sourceAuthorizationStatus !== "valid") issues.push(`${label}: Run Authorization Gate valid由来でない`);
    if (!item.codexCommand.trim()) issues.push(`${label}: Codex command不足`);
    if (item.codexCommand.includes("..") || item.codexCommand.includes("/Users/") || item.codexCommand.includes("PRIVATE_HOME_PATH")) issues.push(`${label}: 危険なcommand`);
    if (!item.sandboxMode.trim()) issues.push(`${label}: sandbox mode不足`);
    for (const project of ["chromium", "firefox", "webkit"]) {
      if (!item.browserProjects.includes(project)) issues.push(`${label}: ${project}不足`);
    }
    if (!item.browserProjects.includes("firefox")) issues.push(`${label}: Firefox除外`);
    if (!requiredCommands.every((command) => item.requiredVerificationCommands.includes(command))) issues.push(`${label}: 浅い検証`);
    if (!item.evidencePaths.some((path) => path.includes("terminal"))) issues.push(`${label}: terminal evidence不足`);
    if (!item.evidencePaths.some((path) => path.includes("screenshot"))) issues.push(`${label}: screenshot evidence不足`);
    if (!item.evidencePaths.some((path) => path.includes("playwright"))) issues.push(`${label}: playwright evidence不足`);
    if (containsLocalPathOrHost(combinedText) || containsTailnetReference(combinedText)) issues.push(`${label}: local path / host / tailnet混入`);
    if (!item.retryPolicy.trim()) issues.push(`${label}: retry policy不足`);
    if (!item.rollbackPlan.trim() || item.rollbackPlan.trim().length < 16) issues.push(`${label}: rollback不足`);
    for (const connection of requiredConnections) {
      if (!item.aiddSpecConnections.includes(connection)) issues.push(`${label}: ${connection}接続不足`);
    }
    if (!requiredConnections.every((connection) => item.aiddSpecConnections.includes(connection))) issues.push(`${label}: AIDD-Spec接続不足`);
  }

  return { status: issues.length === 0 ? "valid" : "failure", issues };
}

function createRunResultFinding(input: RunResultFinding): RunResultFinding {
  return input;
}

export function createEmptyRunResultReview(): RunResultReview {
  return {
    statusSample: "empty",
    sourceRunId: "",
    outcome: "needs_evidence",
    score: 0,
    findings: [],
    neededUpstreamInfo: [],
    aiTaskPacketDelta: [],
    codexPromptDelta: "",
    verificationCommands: [],
    reviewRecordLinks: [],
    learningLogEntries: [],
    aiddSpecConnections: []
  };
}

export function createValidRunResultReview(queue: CodexRunQueueItem[] = createValidCodexRunQueue()): RunResultReview {
  const source = queue.find((item) => item.status === "succeeded") ?? queue[0];
  return {
    statusSample: "valid",
    sourceRunId: source?.id ?? "queue-mvp032-succeeded",
    outcome: "passed",
    score: 96,
    findings: [
      createRunResultFinding({
        id: "run-review-mvp033-valid-001",
        category: "prompt_delta",
        severity: "info",
        observedBy: "Run Result Review Synthesizer",
        idealState: "成功runからReview Record、Learning Log、AI Task Packet delta、Codex prompt deltaを同時に生成できる。",
        fixInstruction: "次回依頼へ成功条件、証跡保存先、再実行条件を追記する。",
        neededUpstreamInfo: ["成功run id", "terminal evidence", "3ブラウザE2E結果"],
        standardUpdate: "Run Result Review Synthesizerはpassed runでも再利用可能な学習をLearning Logへ残す。",
        codexPromptDelta: "成功runの検証コマンド、証跡、残リスクを次回Codex promptへ短く継承してください。",
        verification: "pnpm run doctor:aidd"
      })
    ],
    neededUpstreamInfo: ["source runのartifact一覧", "成功時のterminal evidence要約", "次回AI Task Packetへ残す差分判断"],
    aiTaskPacketDelta: [
      "Run Result Review SynthesizerをMVP033の次段として追加する。",
      "成功runからReview Record / Learning Log / prompt deltaを生成する。",
      "失敗runでは不足証跡と公開不可情報を標準findingへ変換する。"
    ],
    codexPromptDelta: [
      "Run Result Review SynthesizerでsourceRunId、outcome、score、Review Findingを確認してください。",
      "passedでもReview Record、Learning Log、AI Task Packet delta、Codex prompt delta、verification commandを残してください。",
      "local path / host / tailnet混入、Firefox除外、doctor:aidd未実行、rollback未確認があればfailedまたはneeds_evidenceとして扱ってください。"
    ].join("\n"),
    verificationCommands: [
      "pnpm run lint",
      "pnpm run typecheck",
      "pnpm run test",
      "pnpm run build",
      "pnpm run test:e2e",
      "pnpm run doctor:aidd"
    ],
    reviewRecordLinks: [
      "docs/review-record.md#run-result-review-synthesizer",
      "experiments/aidd-control-plane-mvp-033/artifacts/terminal/run-result-review.txt"
    ],
    learningLogEntries: [
      "Learning Log: 成功runはscoreとoutcomeだけで終わらせず、次回prompt deltaまで保存する。",
      "Review Findingはcategory/severity/observedBy/idealState/fixInstruction/neededUpstreamInfo/standardUpdate/codexPromptDelta/verificationで揃える。"
    ],
    aiddSpecConnections: ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"]
  };
}

export function createFailureRunResultReview(): RunResultReview {
  return {
    statusSample: "failure",
    sourceRunId: "queue-mvp032-evidence-missing",
    outcome: "failed",
    score: 34,
    findings: [
      createRunResultFinding({
        id: "run-review-mvp033-terminal",
        category: "terminal_evidence",
        severity: "critical",
        observedBy: "terminal evidence監査",
        idealState: "lint/typecheck/test/build/e2e/doctor:aiddのterminal evidenceが保存されている。",
        fixInstruction: "全検証コマンドの出力をartifacts/terminalへ保存して再レビューする。",
        neededUpstreamInfo: ["terminal evidence保存先", "実行した検証コマンド一覧"],
        standardUpdate: "Run result reviewはterminal evidence不足をneeds_evidenceとして扱う。",
        codexPromptDelta: "terminal evidenceが不足している場合は完了報告せず、保存先と再実行手順を提示してください。",
        verification: "pnpm run test"
      }),
      createRunResultFinding({
        id: "run-review-mvp033-screenshot",
        category: "screenshot_evidence",
        severity: "warning",
        observedBy: "screenshot evidence監査",
        idealState: "empty/valid/failure/terminal evidenceのスクリーンショットが保存されている。",
        fixInstruction: "capture:mvp033で不足スクリーンショットを生成する。",
        neededUpstreamInfo: ["スクリーンショット保存先", "対象画面状態"],
        standardUpdate: "capture scriptはempty/valid/failure/terminal evidenceを標準保存する。",
        codexPromptDelta: "画面変更後はcapture:mvp033を実行し、保存された画像名を報告してください。",
        verification: "pnpm run capture:mvp033"
      }),
      createRunResultFinding({
        id: "run-review-mvp033-firefox",
        category: "browser_coverage",
        severity: "critical",
        observedBy: "3ブラウザE2E監査",
        idealState: "Chromium / Firefox / WebKitを除外せず実行している。",
        fixInstruction: "Firefoxを含む3ブラウザでtest:e2eを再実行する。",
        neededUpstreamInfo: ["Playwright project一覧", "Firefox失敗時のログ"],
        standardUpdate: "Firefox除外はReview Findingへ戻す。",
        codexPromptDelta: "Firefoxが遅い場合はtimeout/retries/workersで安定化し、除外しないでください。",
        verification: "pnpm run test:e2e"
      }),
      createRunResultFinding({
        id: "run-review-mvp033-doctor",
        category: "doctor_gate",
        severity: "critical",
        observedBy: "doctor:aidd gate監査",
        idealState: "doctor:aiddが実行済みでMVP033 tokenを確認している。",
        fixInstruction: "doctor:aiddへMVP033チェックを追加し実行する。",
        neededUpstreamInfo: ["doctor:aiddログ", "required token一覧"],
        standardUpdate: "新MVP追加時はdoctor:aiddにcapture scriptとUI/test tokenを追加する。",
        codexPromptDelta: "完了前にpnpm run doctor:aiddを実行し、失敗tokenを修正してください。",
        verification: "pnpm run doctor:aidd"
      }),
      createRunResultFinding({
        id: "run-review-mvp033-rollback",
        category: "rollback",
        severity: "warning",
        observedBy: "rollback確認監査",
        idealState: "失敗時のrollback確認と採用可否がReview Recordに残っている。",
        fixInstruction: "rollback確認結果と再実行条件をReview Recordへ追記する。",
        neededUpstreamInfo: ["rollback command", "rollback確認結果"],
        standardUpdate: "Run result reviewはrollback未確認をwarning以上で扱う。",
        codexPromptDelta: "rollback未確認の場合は採用せず、確認コマンドと記録先を次回taskへ追加してください。",
        verification: "pnpm run build"
      }),
      createRunResultFinding({
        id: "run-review-mvp033-local-path",
        category: "privacy",
        severity: "critical",
        observedBy: "公開前sanitize監査",
        idealState: "local path / host / tailnetが記事・証跡・prompt deltaに混入していない。",
        fixInstruction: "ローカル環境名をWORKSPACEまたはLOCAL_NETWORKへ置換して再生成する。",
        neededUpstreamInfo: ["sanitize対象ファイル", "混入箇所"],
        standardUpdate: "公開可能artifactではlocal path/host/tailnet混入をcritical findingにする。",
        codexPromptDelta: "公開前にlocal path、host、tailnet、private network URLを検索して除去してください。",
        verification: "pnpm run doctor:aidd"
      }),
      createRunResultFinding({
        id: "run-review-mvp033-prompt-delta",
        category: "prompt_delta",
        severity: "warning",
        observedBy: "prompt delta監査",
        idealState: "失敗原因、必要な上流情報、標準更新、次回Codex prompt deltaが揃っている。",
        fixInstruction: "prompt delta不足をLearning LogとAI Task Packet deltaへ追記する。",
        neededUpstreamInfo: ["次回依頼へ戻す制約", "標準更新候補"],
        standardUpdate: "Run result reviewはprompt delta不足を独立findingとして扱う。",
        codexPromptDelta: "失敗runでは不足証跡だけでなく、次回Codexが迷わないprompt deltaを必ず出してください。",
        verification: "pnpm run test"
      })
    ],
    neededUpstreamInfo: ["terminal evidence", "screenshot evidence", "Firefox実行ログ", "doctor:aiddログ", "rollback確認結果", "sanitize結果"],
    aiTaskPacketDelta: ["terminal evidence必須化", "capture:mvp033追加", "Firefox除外禁止", "doctor:aidd必須化", "rollback確認必須化", "local path/host/tailnet除去", "prompt delta必須化"],
    codexPromptDelta: "",
    verificationCommands: ["pnpm run test", "pnpm run test:e2e"],
    reviewRecordLinks: [],
    learningLogEntries: ["failure sampleは証跡不足、Firefox除外、doctor未実行、rollback未確認、公開不可情報混入、prompt delta不足をまとめてReview Findingへ戻す。"],
    aiddSpecConnections: ["AI Task Packet", "Verification Evidence"]
  };
}

export function evaluateRunResultReview(review: RunResultReview): RunResultReviewEvaluation {
  const isEmpty = review.statusSample === "empty" && !review.sourceRunId && review.findings.length === 0;
  if (isEmpty) return { status: "empty", outcome: "needs_evidence", score: 0, findings: [] };

  const findings = [...review.findings];
  const requiredConnections = ["AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"];
  const requiredCommands = ["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e", "pnpm run doctor:aidd"];
  const combinedText = [
    review.sourceRunId,
    review.aiTaskPacketDelta.join("\n"),
    review.codexPromptDelta,
    review.reviewRecordLinks.join("\n"),
    review.learningLogEntries.join("\n")
  ].join("\n");

  function addFinding(id: string, category: RunResultFindingCategory, severity: RunResultFindingSeverity, observedBy: string, idealState: string, fixInstruction: string, verification: string) {
    if (findings.some((finding) => finding.id === id)) return;
    findings.push(createRunResultFinding({
      id,
      category,
      severity,
      observedBy,
      idealState,
      fixInstruction,
      neededUpstreamInfo: [idealState],
      standardUpdate: `${idealState} をRun Result Review Synthesizerの必須条件にする。`,
      codexPromptDelta: fixInstruction,
      verification
    }));
  }

  if (!review.sourceRunId.trim()) addFinding("run-review-auto-source", "terminal_evidence", "critical", "source run監査", "sourceRunIdが登録されている。", "sourceRunIdをReview Recordへ追加する。", "pnpm run test");
  if (!review.reviewRecordLinks.length) addFinding("run-review-auto-review-record", "terminal_evidence", "warning", "Review Record監査", "Review Record linkが登録されている。", "Review Recordへのリンクを追加する。", "pnpm run doctor:aidd");
  if (!review.learningLogEntries.length) addFinding("run-review-auto-learning-log", "prompt_delta", "warning", "Learning Log監査", "Learning Log entryが登録されている。", "Learning Log entryを追加する。", "pnpm run test");
  if (!review.codexPromptDelta.trim()) addFinding("run-review-auto-prompt-delta", "prompt_delta", "warning", "Codex prompt delta監査", "Codex prompt deltaが登録されている。", "次回Codex prompt deltaを追加する。", "pnpm run test");
  if (!requiredCommands.every((command) => review.verificationCommands.includes(command))) addFinding("run-review-auto-verification", "doctor_gate", "critical", "verification command監査", "標準検証コマンドが揃っている。", "lint/typecheck/test/build/test:e2e/doctor:aiddをverificationCommandsへ追加する。", "pnpm run doctor:aidd");
  if (containsLocalPathOrHost(combinedText) || containsTailnetReference(combinedText)) addFinding("run-review-auto-local-path", "privacy", "critical", "sanitize監査", "local path / host / tailnetが混入していない。", "公開不可のローカル情報を除去する。", "pnpm run doctor:aidd");
  for (const connection of requiredConnections) {
    if (!review.aiddSpecConnections.includes(connection)) addFinding(`run-review-auto-connection-${connection.replace(/\s+/g, "-").toLowerCase()}`, "prompt_delta", "warning", "AIDD-Spec接続監査", `${connection}接続がある。`, `${connection}接続を追加する。`, "pnpm run doctor:aidd");
  }

  const hasBlockingFinding = findings.some((finding) => finding.severity === "critical" || finding.severity === "warning");
  const status: ArtifactEvidenceStatus = hasBlockingFinding || review.outcome !== "passed" ? "failure" : "valid";
  const outcome: RunResultReviewOutcome = hasBlockingFinding ? "needs_evidence" : review.outcome;
  return { status, outcome, score: Math.max(0, Math.min(100, review.score)), findings };
}

function containsLocalPathOrHost(text: string): boolean {
  return /(?:PRIVATE_HOME_PATH|\/Users\/|C:\\Users\\|localhost|127\.0\.0\.1|host\.docker\.internal|private-build-host\.invalid|[a-z0-9-]+\.local)\b/i.test(text);
}

function containsTailnetReference(text: string): boolean {
  return /(?:tailscale|[a-z0-9-]*tailnet[a-z0-9-]*\.(?:internal|ts\.net)|\.ts\.net)\b/i.test(text);
}

export function createEmptyGitHubActionsFetchPlan(): GitHubActionsFetchPlan {
  return { runUrl: "", owner: "", repo: "", runId: "", runSummaryUrl: "", jobsApiEndpoint: "", artifactsApiEndpoint: "", logsUrl: "", tokenScopes: [], requiredArtifacts: [] };
}

export function parseGitHubActionsRunUrl(runUrl: string): GitHubActionsFetchPlan {
  const empty = createEmptyGitHubActionsFetchPlan();
  try {
    const parsed = new URL(runUrl);
    const match = parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/actions\/runs\/(\d+)\/?$/);
    if (!match) return { ...empty, runUrl };
    const [, owner, repo, runId] = match;
    const apiBase = exampleUrl(`api.github.example.test/repos/${owner}/${repo}/actions/runs/${runId}`);
    const webBase = `${parsed.protocol}//${parsed.host}/${owner}/${repo}/actions/runs/${runId}`;
    return {
      runUrl,
      owner,
      repo,
      runId,
      runSummaryUrl: webBase,
      jobsApiEndpoint: `${apiBase}/jobs`,
      artifactsApiEndpoint: `${apiBase}/artifacts`,
      logsUrl: `${apiBase}/logs`,
      tokenScopes: [...REQUIRED_GITHUB_TOKEN_SCOPES],
      requiredArtifacts: [...REQUIRED_CI_ARTIFACTS]
    };
  } catch {
    return { ...empty, runUrl };
  }
}

export function evaluateGitHubActionsFetchPlan(plan: GitHubActionsFetchPlan): { status: ArtifactEvidenceStatus; issues: string[] } {
  const issues: string[] = [];
  if (!isValidUrl(plan.runUrl)) issues.push("GitHub Actions Fetch Plan: run URLが壊れています");
  if (!plan.owner) issues.push("GitHub Actions Fetch Plan: ownerが未抽出です");
  if (!plan.repo) issues.push("GitHub Actions Fetch Plan: repoが未抽出です");
  if (!/^\d+$/.test(plan.runId)) issues.push("GitHub Actions Fetch Plan: run idが未抽出です");
  if (!isValidUrl(plan.jobsApiEndpoint)) issues.push("GitHub Actions Fetch Plan: jobs API endpointが未生成です");
  if (!isValidUrl(plan.artifactsApiEndpoint)) issues.push("GitHub Actions Fetch Plan: artifacts API endpointが未生成です");
  if (!isValidUrl(plan.logsUrl)) issues.push("GitHub Actions Fetch Plan: logs URLが未生成です");
  for (const scope of REQUIRED_GITHUB_TOKEN_SCOPES) {
    if (!plan.tokenScopes.includes(scope)) issues.push(`GitHub Actions Fetch Plan: ${scope} token scopeが不足しています`);
  }
  for (const artifact of REQUIRED_CI_ARTIFACTS) {
    if (!plan.requiredArtifacts.includes(artifact)) issues.push(`GitHub Actions Fetch Plan: ${artifact}取得計画が不足しています`);
  }
  if (issues.length === 0) return { status: "valid", issues };
  const isEmpty = !plan.runUrl && !plan.owner && !plan.repo && !plan.runId && plan.tokenScopes.length === 0 && plan.requiredArtifacts.length === 0;
  return { status: isEmpty ? "empty" : "failure", issues };
}

export function evaluateCiArtifactImport(summary: CiArtifactImport): { status: ArtifactEvidenceStatus; issues: string[] } {
  const issues: string[] = [];
  if (!summary.workflowName.trim()) issues.push("CI Artifact Importer: workflow名が未登録です");
  if (!/^[0-9a-f]{40}$/i.test(summary.commitSha)) issues.push("CI Artifact Importer: commit SHAが短すぎます");
  if (!isValidUrl(summary.runUrl)) issues.push("CI Artifact Importer: CI run URLが壊れています");
  if (!isValidUrl(summary.playwrightReportUrl)) issues.push("CI Artifact Importer: Playwright report URLが壊れています");
  issues.push(...evaluateGitHubActionsFetchPlan(summary.fetchPlan).issues);
  for (const gate of REQUIRED_VERIFICATION_GATES) {
    const job = summary.jobs.find((item) => item.name === gate);
    if (!job) issues.push(`CI Artifact Importer: ${gate} jobが未登録です`);
    else if (job.status !== "成功") issues.push(`CI Artifact Importer: ${gate} jobが${job.status}`);
  }
  for (const artifact of REQUIRED_CI_ARTIFACTS) {
    if (!summary.artifacts.includes(artifact)) issues.push(`CI Artifact Importer: ${artifact} artifactが不足しています`);
  }
  if (issues.length === 0) return { status: "valid", issues };
  const isEmpty = !summary.workflowName && !summary.commitSha && !summary.runUrl && summary.artifacts.length === 0 && summary.jobs.length === 0 && !summary.playwrightReportUrl && evaluateGitHubActionsFetchPlan(summary.fetchPlan).status === "empty";
  return { status: isEmpty ? "empty" : "failure", issues };
}

export function evaluateArtifactEvidenceBinder(binder: ArtifactEvidenceBinder, now = new Date("2026-06-30T00:00:00.000Z")): { status: ArtifactEvidenceStatus; issues: string[] } {
  const issues: string[] = [];
  if (binder.terminalEvidence.length === 0) issues.push("Artifact Evidence Binder: terminal evidence不足");
  if (binder.screenshotEvidence.length === 0) issues.push("Artifact Evidence Binder: screenshot evidence不足");
  if (!isValidUrl(binder.ciRunUrl)) issues.push("Artifact Evidence Binder: CI run URLが壊れています");
  if (!isValidUrl(binder.ciArtifactUrl)) issues.push("Artifact Evidence Binder: CI artifact URLが不足または壊れています");
  if (!isValidUrl(binder.playwrightReportUrl)) issues.push("Artifact Evidence Binder: Playwright report URLが壊れています");
  issues.push(...evaluateCiArtifactImport(binder.ciSummary).issues);
  if (!binder.generatedAt || Number.isNaN(Date.parse(binder.generatedAt))) {
    issues.push("Artifact Evidence Binder: generatedAtが未登録です");
  } else {
    const ageMs = now.getTime() - Date.parse(binder.generatedAt);
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    if (ageMs > maxAgeMs) issues.push("Artifact Evidence Binder: terminal evidenceが古いログです");
  }

  if (issues.length === 0) return { status: "valid", issues };
  const status = binder.statusSample === "empty" && isBinderEmpty(binder) ? "empty" : "failure";
  return { status, issues };
}

export function evaluateEvidenceGapRepairPlan(run: VerificationRun): EvidenceGapRepairPlan {
  const repairs: EvidenceGapRepair[] = [];
  const artifacts = new Set(run.artifactBinder.ciSummary.artifacts);
  const terminalEvidence = [...run.terminalEvidence, ...run.artifactBinder.terminalEvidence];
  const screenshotEvidence = [...run.screenshotEvidence, ...run.artifactBinder.screenshotEvidence];

  for (const artifact of REQUIRED_CI_ARTIFACTS) {
    if (!artifacts.has(artifact)) repairs.push(buildEvidenceRepair(artifact));
  }
  if (terminalEvidence.length === 0) pushUniqueRepair(repairs, "terminal-evidence");
  if (!screenshotEvidence.some((file) => /empty/i.test(file))) repairs.push(buildEvidenceRepair("empty-screenshot"));
  if (!screenshotEvidence.some((file) => /valid|ready/i.test(file))) repairs.push(buildEvidenceRepair("valid-screenshot"));
  if (!screenshotEvidence.some((file) => /failure|fail/i.test(file))) repairs.push(buildEvidenceRepair("failure-screenshot"));

  const status: ArtifactEvidenceStatus = repairs.length === 0 ? "valid" : run.artifactBinder.statusSample === "empty" ? "empty" : "failure";
  return { status, missingCount: repairs.length, repairs };
}

export function evaluateVerificationRun(run: VerificationRun): { ready: boolean; issues: string[] } {
  const issues: string[] = [];
  const gateMap = new Map(run.gates.map((gate) => [gate.id, gate]));
  for (const id of REQUIRED_VERIFICATION_GATES) {
    const gate = gateMap.get(id);
    if (!gate) {
      issues.push(`Verification Run: ${id}が未登録`);
      continue;
    }
    if (gate.status !== "成功") issues.push(`Verification Run: ${gate.label}が${gate.status}`);
    if (!gate.evidenceFile.trim()) issues.push(`Verification Evidence: ${gate.label}のevidence file不足`);
  }
  for (const [browser, status] of Object.entries(run.browserE2E)) {
    if (status !== "成功") issues.push(`3ブラウザE2E: ${browser}が${status}`);
  }
  if (run.terminalEvidence.length === 0) issues.push("Verification Evidence: terminal evidence不足");
  if (run.screenshotEvidence.length === 0) issues.push("Verification Evidence: screenshot evidence不足");
  issues.push(...evaluateArtifactEvidenceBinder(run.artifactBinder).issues);
  for (const repair of evaluateEvidenceGapRepairPlan(run).repairs) {
    issues.push(`Evidence Gap Repair Planner: ${repair.label}不足`);
  }
  return { ready: issues.length === 0, issues };
}

export function generateReviewRecord(run: VerificationRun, templateRisks: readonly string[] = []): ReviewRecord {
  const findings: ReviewFinding[] = [];
  const gateMap = new Map(run.gates.map((gate) => [gate.id, gate]));
  for (const id of REQUIRED_VERIFICATION_GATES) {
    const gate = gateMap.get(id);
    if (!gate) {
      findings.push(buildFinding("検証", "high", `${id}が未登録`, `${id}をVerification Run Trackerに追加し、実行ログを保存する`, ["Verification Evidence", "Test Plan"], GATE_COMMANDS[id]));
      continue;
    }
    if (gate.status === "未実行") findings.push(buildFinding("検証", "high", `${gate.label}が未実行`, `${gate.command}を実行し、terminal evidenceへ保存する`, ["Test Plan", "Verification Evidence"], gate.command));
    if (gate.status === "失敗") findings.push(buildFinding("検証", "high", `${gate.label}が失敗`, `${gate.summary} 修正後に${gate.command}を再実行する`, ["Acceptance Criteria Matrix", "Test Plan"], gate.command));
    if (gate.status === "証跡不足" || !gate.evidenceFile.trim()) findings.push(buildFinding("証跡", "medium", `${gate.label}の証跡不足`, `${gate.command}のログをartifacts/terminalへ保存し、Review Recordに紐づける`, ["Verification Evidence", "Review Record"], gate.command));
  }
  for (const [browser, status] of Object.entries(run.browserE2E)) {
    if (status !== "成功") findings.push(buildFinding("3ブラウザE2E", "high", `${browser} E2Eが${status}`, `Chromium / Firefox / WebKitを同じ条件で再実行し、${browser}の失敗ログを残す`, ["Browser Support Matrix", "Verification Evidence"], "pnpm run test:e2e"));
  }
  if (run.terminalEvidence.length === 0) findings.push(buildFinding("証跡", "medium", "terminal evidence不足", "各品質ゲートの実行ログをartifacts/terminal/*.txtに保存する", ["Verification Evidence"], "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build"));
  if (run.screenshotEvidence.length === 0) findings.push(buildFinding("証跡", "medium", "screenshot evidence不足", "empty/filled/failure/terminal evidenceの画面キャプチャを保存する", ["Verification Evidence", "Screen Inventory"], "pnpm run test:e2e"));
  for (const issue of evaluateArtifactEvidenceBinder(run.artifactBinder).issues) {
    findings.push(
      buildFinding(
        issue.startsWith("GitHub Actions Fetch Plan") ? "GitHub Actions Fetch Plan" : issue.startsWith("CI Artifact Importer") ? "CI Artifact Importer" : "Artifact Evidence Binder",
        issue.includes("URL") || issue.includes("古いログ") || issue.includes("job") || issue.includes("commit") || issue.includes("run id") || issue.includes("token scope") ? "high" : "medium",
        issue.replace("Artifact Evidence Binder: ", "").replace("CI Artifact Importer: ", ""),
        `${issue.replace("Artifact Evidence Binder: ", "").replace("CI Artifact Importer: ", "")}を修正し、CI run URL、commit SHA、workflow、job、artifact、Playwright report URLを同じ実行単位で束ねる`,
        ["Verification Evidence", "Review Record", "Learning Log"],
        "pnpm run test:e2e && pnpm run doctor:aidd"
      )
    );
  }
  for (const repair of evaluateEvidenceGapRepairPlan(run).repairs) {
    findings.push(
      buildFinding(
        "Evidence Gap Repair Planner",
        repair.severity === "critical" ? "high" : repair.severity,
        `${repair.label}不足`,
        repair.fixInstruction,
        [repair.affectedArtifact, "AIDD-Spec Artifact"],
        repair.rerunCommand
      )
    );
  }

  const remainingRisks = findings.length === 0 ? [...templateRisks, "CI連携前のため、ローカル成功とGitHub Actions成功の差分は別途確認が必要"] : ["失敗ログを次回AI Task Packetへ戻すまで完了扱いにしない", ...templateRisks];
  const penalty = findings.reduce((sum, finding) => sum + (finding.severity === "high" ? 12 : finding.severity === "medium" ? 7 : 3), 0);
  return {
    score: Math.max(0, 100 - penalty),
    passed: findings.length === 0,
    findings: findings.length > 0 ? findings : [buildFinding("残リスク", "low", "主要ゲートは成功", "成功条件をテンプレートとLearning Logへ戻す", ["Learning Log"], "pnpm run doctor:aidd")],
    remainingRisks
  };
}

export function generateLearningLog(reviewRecord: ReviewRecord): LearningLog {
  const failedFindings = reviewRecord.findings.filter((finding) => finding.severity !== "low");
  const whatWorked = reviewRecord.passed ? ["lint/typecheck/test/build/e2e/doctor:aiddと証跡が揃った", "Review Recordから次回改善案を確認できる"] : ["Verification Run Trackerにより、未実行・失敗・証跡不足を分類できた"];
  const whatFailed = failedFindings.length > 0 ? failedFindings.map((finding) => finding.finding) : ["大きな失敗は検出されていないが、CI連携とチームレビューは未接続"];
  const specUpdatesNeeded = failedFindings.length > 0 ? Array.from(new Set(failedFindings.flatMap((finding) => finding.neededUpstreamInfo))) : ["Verification Evidence", "Review Record", "Learning Log"];
  const nextTaskPacketDelta = failedFindings.length > 0 ? failedFindings.map((finding) => `${finding.fixInstruction}。検証コマンド: ${finding.verificationCommand}`) : ["同じ品質ゲートをCIでも実行し、artifact URLをVerification Evidenceへ追加する"];
  return {
    whatWorked,
    whatFailed,
    specUpdatesNeeded,
    nextTaskPacketDelta,
    codexPromptDelta: ["次回のCodex Prompt Delta:", ...nextTaskPacketDelta.map((delta) => `- ${delta}`), "- 修正後はReview RecordとLearning Logを更新し、失敗が次回依頼へ戻ったことを確認する。"].join("\n")
  };
}

function buildFinding(category: ReviewFinding["category"], severity: ReviewFinding["severity"], finding: string, fixInstruction: string, neededUpstreamInfo: string[], verificationCommand: string): ReviewFinding {
  return { category, severity, finding, fixInstruction, neededUpstreamInfo, verificationCommand };
}

function buildVerificationRun(title: string, status: VerificationGateStatus, options: { summary: string; evidence: string; artifactBinder: ArtifactEvidenceBinder }): VerificationRun {
  return {
    title,
    gates: REQUIRED_VERIFICATION_GATES.map((id) => ({
      id,
      label: GATE_LABELS[id],
      status,
      command: GATE_COMMANDS[id],
      summary: options.summary,
      evidenceFile: options.evidence
    })),
    browserE2E: {
      chromium: status,
      firefox: status,
      webkit: status
    },
    terminalEvidence: [],
    screenshotEvidence: [],
    artifactBinder: options.artifactBinder
  };
}

function formatVerificationRunMarkdown(run: VerificationRun): string {
  const verification = evaluateVerificationRun(run);
  const repairPlan = evaluateEvidenceGapRepairPlan(run);
  return [
    `- Verification Run: ${run.title}`,
    `- Ready: ${verification.ready ? "ready" : "not ready"}`,
    `- 必要ゲート: ${REQUIRED_VERIFICATION_GATES.join(" / ")}`,
    ...run.gates.map((gate) => `- ${gate.label}: ${gate.status} / ${gate.command} / evidence file: ${gate.evidenceFile || "未登録"} / ${gate.summary}`),
    `- 3ブラウザE2E: Chromium=${run.browserE2E.chromium} / Firefox=${run.browserE2E.firefox} / WebKit=${run.browserE2E.webkit}`,
    `- terminal evidence: ${run.terminalEvidence.length > 0 ? run.terminalEvidence.join(" / ") : "未登録"}`,
    `- screenshot evidence: ${run.screenshotEvidence.length > 0 ? run.screenshotEvidence.join(" / ") : "未登録"}`,
    `- Artifact Evidence Binder: ${evaluateArtifactEvidenceBinder(run.artifactBinder).status}`,
    `- CI run URL: ${run.artifactBinder.ciRunUrl || "未登録"}`,
    `- CI artifact URL: ${run.artifactBinder.ciArtifactUrl || "未登録"}`,
    `- Playwright report URL: ${run.artifactBinder.playwrightReportUrl || "未登録"}`,
    `- CI Artifact Importer: workflow=${run.artifactBinder.ciSummary.workflowName || "未登録"} / commit=${run.artifactBinder.ciSummary.commitSha || "未登録"}`,
    `- CI jobs: ${run.artifactBinder.ciSummary.jobs.length > 0 ? run.artifactBinder.ciSummary.jobs.map((job) => `${job.name}=${job.status}`).join(" / ") : "未登録"}`,
    `- CI artifacts: ${run.artifactBinder.ciSummary.artifacts.length > 0 ? run.artifactBinder.ciSummary.artifacts.join(" / ") : "未登録"}`,
    `- Evidence Gap Repair Planner: ${repairPlan.status} / missing count: ${repairPlan.missingCount}`,
    ...repairPlan.repairs.map((repair) => `- Repair: ${repair.label} / ${repair.severity} / ${repair.affectedArtifact} / ${repair.fixInstruction} / ${repair.rerunCommand}`),
    `- Review Record: ${verification.ready ? "passとして記録可能" : "fail/findings/remaining riskを記録する"}`,
    `- Learning Log: ${verification.ready ? "成功条件を次回テンプレートへ戻す" : "失敗・証跡不足・修正方針を残す"}`
  ].join("\n");
}

function buildRecommendedQuestions(draft: IntakeDraft, missingFields: string[]): string[] {
  const questions: string[] = [];
  if (!draft.targetUser) questions.push("このアプリを最初に使う人は誰ですか？");
  if (!draft.userProblem) questions.push("その人は今どの作業で困っていますか？");
  if (!draft.selectedTemplateId) questions.push("どのApp Type Templateを土台にしますか？");
  if (draft.selectedTemplateId && draft.selectedTemplateId !== draft.appliedTemplateId) questions.push("選択したテンプレートを適用して初期値を反映しますか？");
  if (draft.keyFeatures.length < 2) questions.push("最初のリリースに必要な機能を2つ以上に絞ると何ですか？");
  if (draft.nonGoals.length === 0) questions.push("今回あえて作らない機能は何ですか？");
  if (draft.stateContract.length < 2) questions.push("empty/error/offlineなど、最低限どの状態を検証しますか？");
  if (missingFields.some((field) => field.startsWith("品質ゲート"))) questions.push("lint/typecheck/test/buildをどの順番で確認しますか？");
  if (missingFields.some((field) => field.startsWith("Verification Run") || field.startsWith("Verification Evidence") || field.startsWith("3ブラウザE2E"))) {
    questions.push("Verification Evidence、Review Record、Learning Logに残す証跡は揃っていますか？");
  }
  return questions.length > 0 ? questions : ["この内容でCodexに渡してよいか、残リスクを確認してください。"];
}

function formatList(items: readonly string[], fallback: string): string {
  if (items.length === 0) return `- ${fallback}`;
  return items.map((item) => `- ${item}`).join("\n");
}

function formatYamlList(items: readonly string[]): string {
  if (items.length === 0) return "    []";
  return items.map((item) => `    - "${escapeYaml(item)}"`).join("\n");
}

function formatEvidenceRepairsYaml(repairs: readonly EvidenceGapRepair[]): string[] {
  if (repairs.length === 0) return ["      []"];
  return repairs.map(
    (repair) =>
      `      - id: "${repair.id}"\n        severity: "${repair.severity}"\n        affected_artifact: "${escapeYaml(repair.affectedArtifact)}"\n        fix_instruction: "${escapeYaml(repair.fixInstruction)}"\n        rerun_command: "${escapeYaml(repair.rerunCommand)}"\n        codex_prompt_delta: "${escapeYaml(repair.codexPromptDelta)}"`
  );
}

function withFallback(items: readonly string[], fallback: string[]): string[] {
  return items.length > 0 ? [...items] : fallback;
}

function escapeYaml(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function exampleUrl(path: string): string {
  return `https${"://"}${path}`;
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

function isBinderEmpty(binder: ArtifactEvidenceBinder): boolean {
  return (
    binder.terminalEvidence.length === 0 &&
    binder.screenshotEvidence.length === 0 &&
    binder.ciRunUrl.length === 0 &&
    binder.ciArtifactUrl.length === 0 &&
    binder.playwrightReportUrl.length === 0 &&
    binder.generatedAt.length === 0 &&
    evaluateCiArtifactImport(binder.ciSummary).status === "empty"
  );
}

function buildEvidenceRepair(id: EvidenceRequirementId): EvidenceGapRepair {
  return { id, ...REQUIRED_EVIDENCE_REPAIRS[id] };
}

function pushUniqueRepair(repairs: EvidenceGapRepair[], id: EvidenceRequirementId): void {
  if (!repairs.some((repair) => repair.id === id)) repairs.push(buildEvidenceRepair(id));
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "untitled-app";
}
