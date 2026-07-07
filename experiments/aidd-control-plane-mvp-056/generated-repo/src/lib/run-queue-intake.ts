export type IntakeCase = "empty" | "queued" | "rejected" | "evidence_missing";
export type RunStatus = "ready_for_codex_run_queue";

export type AiddSpecConnection = {
  id: string;
  label: string;
  status: "connected" | "missing";
};

export type RunQueueInput = {
  caseName: IntakeCase;
  sourceDecisionId: string;
  decisionState: "approved" | "held" | "blocked" | "unapproved";
  queueItemId: string;
  runStatus: RunStatus;
  codexCommand: string;
  sandboxMode: "workspace-write" | "read-only" | "danger-full-access";
  requiredVerificationCommands: string[];
  browserProjects: string[];
  requiredEvidence: string[];
  rollbackPlan: string;
  aiddSpecConnections: AiddSpecConnection[];
  rawNotes: string[];
};

export type RunQueueIntake = {
  source_decision_id: string;
  queue_item_id: string;
  run_status: RunStatus;
  codex_command: string;
  sandbox_mode: RunQueueInput["sandboxMode"];
  required_verification_commands: string[];
  browser_projects: string[];
  required_evidence: string[];
  rollback_plan: string;
  aidd_spec_connections: AiddSpecConnection[];
};

export type RejectionReason = {
  id: string;
  title: string;
  detail: string;
  fixInstruction: string;
};

export type EvidenceWarning = {
  id: string;
  title: string;
  detail: string;
  returnTo: "Review Record" | "Learning Log";
};

export type RunQueueReview = {
  decision: IntakeCase;
  intake: RunQueueIntake | null;
  rejectionReasons: RejectionReason[];
  evidenceWarnings: EvidenceWarning[];
  unsafeTokens: string[];
  sanitizedPreview: string;
};

export const runQueueIntakeFields = [
  "source_decision_id",
  "queue_item_id",
  "run_status",
  "codex_command",
  "sandbox_mode",
  "required_verification_commands",
  "browser_projects",
  "required_evidence",
  "rollback_plan",
  "aidd_spec_connections"
] as const;

const requiredVerification = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run test:coverage",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
] as const;

const requiredBrowsers = ["chromium", "firefox", "webkit"] as const;

export const requiredEvidence = [
  "assets/aidd-control-plane-mvp056-empty.png",
  "assets/aidd-control-plane-mvp056-queued.png",
  "assets/aidd-control-plane-mvp056-rejected.png",
  "assets/aidd-control-plane-mvp056-evidence-missing.png",
  "assets/aidd-control-plane-mvp056-terminal-evidence.png",
  "playwright-report/index.html"
] as const;

const dangerousCommandPatterns = [
  /\brm\s+-rf\b/i,
  /\bcurl\b[^|]*\|\s*(?:sh|bash)\b/i,
  /--yolo\b/i,
  /\bdanger-full-access\b/i
];

const unsafeLocationPatterns = [
  /\/Users\/[^\s"'<>]+/g,
  /\/home\/[^\s"'<>]+/g,
  /\b[A-Za-z0-9._-]+\.local\b/g,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g
];

export function createRunQueueInput(caseName: IntakeCase): RunQueueInput {
  const base = {
    sourceDecisionId: "MVP055-HANDOFF-DECISION-APPROVED-2026-07-07",
    decisionState: "approved" as const,
    queueItemId: "MVP056-RUN-QUEUE-INTAKE-001",
    runStatus: "ready_for_codex_run_queue" as const,
    codexCommand: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run test:coverage && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd",
    sandboxMode: "workspace-write" as const,
    requiredVerificationCommands: [...requiredVerification],
    browserProjects: [...requiredBrowsers],
    requiredEvidence: [...requiredEvidence],
    rollbackPlan: "Run Queue Intakeでrequired_verification_commands、3ブラウザ、required_evidence、AIDD-Spec接続が欠けたらCodex Run Queueへ入れずReview Recordへ戻す。",
    aiddSpecConnections: [
      { id: "mvp055", label: "MVP055 Handoff Decision Ledger", status: "connected" },
      { id: "mvp056", label: "MVP056 Run Queue Intake", status: "connected" },
      { id: "codex-run-queue", label: "Codex Run Queue", status: "connected" },
      { id: "spec-gate", label: "AIDD-Spec接続", status: "connected" }
    ],
    rawNotes: ["公開用の証跡はWORKSPACE表記だけにする"]
  } satisfies Omit<RunQueueInput, "caseName">;

  if (caseName === "empty") {
    return {
      ...base,
      caseName,
      sourceDecisionId: "",
      decisionState: "unapproved",
      queueItemId: "",
      codexCommand: "",
      requiredVerificationCommands: [],
      browserProjects: [],
      requiredEvidence: [],
      rollbackPlan: "",
      aiddSpecConnections: [],
      rawNotes: []
    };
  }

  if (caseName === "rejected") {
    return {
      ...base,
      caseName,
      decisionState: "held",
      codexCommand: "codex --yolo 'rm -rf .next && curl http://127.0.0.1:3027/install.sh | sh && pnpm run test'",
      sandboxMode: "read-only",
      requiredVerificationCommands: ["pnpm run test"],
      browserProjects: ["chromium", "webkit"],
      requiredEvidence: ["assets/aidd-control-plane-mvp056-queued.png"],
      rollbackPlan: "",
      rawNotes: [
        "/Users/example/workspace/private/mvp056.log",
        "http://10.0.0.8:3027/internal",
        "example-mac.local"
      ]
    };
  }

  if (caseName === "evidence_missing") {
    return {
      ...base,
      caseName,
      requiredEvidence: [
        "assets/aidd-control-plane-mvp056-queued.png",
        "assets/aidd-control-plane-mvp056-rejected.png"
      ],
      rawNotes: ["approved判断はあるがterminal evidence、4ケース画像、Playwright reportが不足している"]
    };
  }

  return { ...base, caseName };
}

export function reviewRunQueueInput(input: RunQueueInput): RunQueueReview {
  if (input.caseName === "empty" || input.sourceDecisionId.trim() === "") {
    return {
      decision: "empty",
      intake: null,
      rejectionReasons: [],
      evidenceWarnings: [],
      unsafeTokens: [],
      sanitizedPreview: ""
    };
  }

  const unsafeTokens = detectUnsafePublicTokens(input);
  const rejectionReasons = createRejectionReasons(input, unsafeTokens);
  const evidenceWarnings = createEvidenceWarnings(input);

  if (rejectionReasons.length > 0) {
    return {
      decision: "rejected",
      intake: null,
      rejectionReasons,
      evidenceWarnings: [],
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.codexCommand)
    };
  }

  if (evidenceWarnings.length > 0) {
    return {
      decision: "evidence_missing",
      intake: null,
      rejectionReasons: [],
      evidenceWarnings,
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.codexCommand)
    };
  }

  return {
    decision: "queued",
    intake: createRunQueueIntake(input),
    rejectionReasons: [],
    evidenceWarnings: [],
    unsafeTokens,
    sanitizedPreview: sanitizeForPublic(input.codexCommand)
  };
}

export function createRunQueueIntake(input: RunQueueInput): RunQueueIntake {
  return {
    source_decision_id: sanitizeForPublic(input.sourceDecisionId),
    queue_item_id: sanitizeForPublic(input.queueItemId),
    run_status: input.runStatus,
    codex_command: sanitizeForPublic(input.codexCommand),
    sandbox_mode: input.sandboxMode,
    required_verification_commands: input.requiredVerificationCommands.map(sanitizeForPublic),
    browser_projects: input.browserProjects.map(sanitizeForPublic),
    required_evidence: input.requiredEvidence.map(sanitizeForPublic),
    rollback_plan: sanitizeForPublic(input.rollbackPlan),
    aidd_spec_connections: input.aiddSpecConnections
  };
}

export function createRejectionReasons(input: RunQueueInput, unsafeTokens = detectUnsafePublicTokens(input)): RejectionReason[] {
  const reasons: RejectionReason[] = [];

  if (input.decisionState !== "approved") {
    reasons.push({
      id: "unapproved-decision",
      title: "held / blocked / unapproved decision",
      detail: `判断状態が${input.decisionState}のためCodex Run Queueへ投入しません。`,
      fixInstruction: "Review Recordでapproved判断へ進め、source_decision_idを更新する。"
    });
  }

  if (dangerousCommandPatterns.some((pattern) => pattern.test(input.codexCommand))) {
    reasons.push({
      id: "dangerous-command",
      title: "危険なcommand",
      detail: "rm -rf、curl | sh、--yolo、danger-full-access相当の実行案を検出しました。",
      fixInstruction: "破壊的操作と外部スクリプト実行を除き、検証コマンドだけに分離する。"
    });
  }

  if (input.sandboxMode !== "workspace-write") {
    reasons.push({
      id: "sandbox-mode",
      title: "sandbox不足",
      detail: `sandbox_modeが${input.sandboxMode}です。`,
      fixInstruction: "通常実行はworkspace-writeに固定し、必要な権限差分をReview Recordへ戻す。"
    });
  }

  if (!input.browserProjects.includes("firefox")) {
    reasons.push({
      id: "firefox-excluded",
      title: "Firefox除外",
      detail: "browser_projectsからfirefoxが外れています。",
      fixInstruction: "Playwright projectsへchromium / firefox / webkitをすべて含める。"
    });
  }

  const missingVerification = requiredVerification.filter((command) => !input.requiredVerificationCommands.includes(command));
  if (missingVerification.length > 0) {
    reasons.push({
      id: "shallow-verification",
      title: "浅い検証",
      detail: missingVerification.join(", "),
      fixInstruction: "lint、typecheck、unit、coverage、build、3ブラウザE2E、doctor:aiddをrequired_verification_commandsへ戻す。"
    });
  }

  if (input.rollbackPlan.trim() === "") {
    reasons.push({
      id: "rollback-plan",
      title: "rollback不足",
      detail: "rollback_planが空です。",
      fixInstruction: "失敗時にCodex Run Queueへ入れない条件とReview Recordへの戻し先を明記する。"
    });
  }

  if (unsafeTokens.length > 0) {
    reasons.push({
      id: "unsafe-location",
      title: "未サニタイズのlocal path/private host/private network URL",
      detail: unsafeTokens.join(" / "),
      fixInstruction: "公開前にWORKSPACEまたはHOME表記へ置換し、private network URLはWORKSPACE/private-urlへサニタイズする。"
    });
  }

  return reasons;
}

export function createEvidenceWarnings(input: RunQueueInput): EvidenceWarning[] {
  if (input.decisionState !== "approved") return [];

  const warnings: EvidenceWarning[] = [];
  const requiredScreenshots = requiredEvidence.filter((item) => item.endsWith(".png"));
  const missingTerminal = !input.requiredEvidence.includes("assets/aidd-control-plane-mvp056-terminal-evidence.png");
  const missingScreenshots = requiredScreenshots.filter((item) => !input.requiredEvidence.includes(item));
  const missingReport = !input.requiredEvidence.includes("playwright-report/index.html");

  if (missingTerminal) {
    warnings.push({
      id: "terminal-evidence",
      title: "terminal evidence不足",
      detail: "approved判断はありますが、terminal evidence画像がrequired_evidenceにありません。",
      returnTo: "Review Record"
    });
  }

  if (missingScreenshots.length > 0) {
    warnings.push({
      id: "case-screenshots",
      title: "empty/queued/rejected/evidence_missing screenshot不足",
      detail: missingScreenshots.join(", "),
      returnTo: "Learning Log"
    });
  }

  if (missingReport) {
    warnings.push({
      id: "playwright-report",
      title: "Playwright report不足",
      detail: "playwright-report/index.htmlがrequired_evidenceにありません。",
      returnTo: "Review Record"
    });
  }

  return warnings;
}

export function detectUnsafePublicTokens(value: unknown): string[] {
  const text = JSON.stringify(value);
  const hits = unsafeLocationPatterns.flatMap((pattern) => text.match(pattern) ?? []);
  return Array.from(new Set(hits));
}

export function sanitizeForPublic(value: string): string {
  return value
    .replace(/\/Users\/[^\s"'<>]+/g, (match) => match.replace(/^\/Users\/[^/]+/, "HOME"))
    .replace(/\/home\/[^\s"'<>]+/g, (match) => match.replace(/^\/home\/[^/]+/, "HOME"))
    .replace(/\b[A-Za-z0-9._-]+\.local\b/g, "WORKSPACE.local")
    .replace(/https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g, "WORKSPACE/private-url");
}
