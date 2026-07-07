export type TrackerCase = "empty" | "waiting" | "running" | "succeeded" | "failed" | "evidence_missing";
export type RunStatus = Exclude<TrackerCase, "empty">;

export type AiddSpecConnection = {
  id: string;
  label: string;
  status: "connected" | "missing";
};

export type RunQueueResultInput = {
  caseName: TrackerCase;
  sourceIntakeId: string;
  queueItemId: string;
  runStatus: RunStatus;
  commandExitCode: number | null;
  commandOutput: string;
  actualResults: string[];
  verificationSummary: string;
  browserProjects: string[];
  terminalEvidence: string[];
  screenshotEvidence: string[];
  playwrightReport: string;
  rollbackPlan: string;
  reviewRecordOutput: string;
  learningLogOutput: string;
  aiddSpecConnections: AiddSpecConnection[];
  rawNotes: string[];
};

export type CodexRunQueueStatusTracker = {
  source_intake_id: string;
  queue_item_id: string;
  run_status: RunStatus;
  actual_results: string[];
  verification_summary: string;
  browser_projects: string[];
  terminal_evidence: string[];
  screenshot_evidence: string[];
  playwright_report: string;
  rollback_plan: string;
  review_record_output: string;
  learning_log_output: string;
  aidd_spec_connections: AiddSpecConnection[];
};

export type FailureReason = {
  id: string;
  title: string;
  detail: string;
  fixInstruction: string;
};

export type EvidenceWarning = {
  id: string;
  title: string;
  detail: string;
  returnTo: "Evidence Repair Delta" | "Learning Log";
};

export type StatusReview = {
  decision: TrackerCase;
  tracker: CodexRunQueueStatusTracker | null;
  failureReasons: FailureReason[];
  evidenceWarnings: EvidenceWarning[];
  unsafeTokens: string[];
  sanitizedPreview: string;
};

export const statusTrackerFields = [
  "source_intake_id",
  "queue_item_id",
  "run_status",
  "actual_results",
  "verification_summary",
  "browser_projects",
  "terminal_evidence",
  "screenshot_evidence",
  "playwright_report",
  "rollback_plan",
  "review_record_output",
  "learning_log_output",
  "aidd_spec_connections"
] as const;

const requiredBrowsers = ["chromium", "firefox", "webkit"] as const;

export const requiredScreenshots = [
  "assets/aidd-control-plane-mvp057-empty.png",
  "assets/aidd-control-plane-mvp057-succeeded.png",
  "assets/aidd-control-plane-mvp057-failed.png",
  "assets/aidd-control-plane-mvp057-evidence-missing.png"
] as const;

const requiredTerminalEvidence = "assets/aidd-control-plane-mvp057-terminal-evidence.png";
const requiredPlaywrightReport = "playwright-report/index.html";

const dangerousCommandPatterns = [
  /\brm\s+-rf\b/i,
  /\b(?:curl|wget)\b[^|]*\|\s*(?:sh|bash|zsh)\b/i,
  /--no-sandbox\b/i,
  /\bno-sandbox\b/i,
  /\bdanger-full-access\b/i
];

const unsafeLocationPatterns = [
  /\/Users\/[^\s"'<>]+/g,
  /\/home\/[^\s"'<>]+/g,
  /\b[A-Za-z0-9._-]+\.local\b/g,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g
];

export function createRunQueueResultInput(caseName: TrackerCase): RunQueueResultInput {
  const base = {
    sourceIntakeId: "MVP056-RUN-QUEUE-INTAKE-001",
    queueItemId: "MVP057-CODEX-RUN-STATUS-001",
    runStatus: "succeeded" as const,
    commandExitCode: 0,
    commandOutput: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run test:coverage && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd",
    actualResults: [
      "MVP057 Status Tracker UIを生成",
      "empty / waiting / running / succeeded / failed / evidence_missingを表示",
      "失敗理由とEvidence Repair Deltaの戻し先を確認"
    ],
    verificationSummary: "Verification Evidence: lint、typecheck、unit、coverage、build、3ブラウザE2E、doctor:aiddが成功。",
    browserProjects: [...requiredBrowsers],
    terminalEvidence: [requiredTerminalEvidence],
    screenshotEvidence: [...requiredScreenshots],
    playwrightReport: requiredPlaywrightReport,
    rollbackPlan: "failedまたはevidence_missingではCodex Run Queueを進めず、Review RecordとLearning Logへ差分を戻す。",
    reviewRecordOutput: "Review Record: command成功、3ブラウザ完了、doctor:aidd成功、rollbackあり、公開情報はサニタイズ済み。",
    learningLogOutput: "Learning Log: MVP056 Intake後に実行状態を追跡し、証跡不足はEvidence Repair Deltaへ戻す。",
    aiddSpecConnections: [
      { id: "mvp056", label: "MVP056 Run Queue Intake", status: "connected" },
      { id: "mvp057", label: "MVP057 Codex Run Queue Status Tracker", status: "connected" },
      { id: "verification-evidence", label: "Verification Evidence", status: "connected" },
      { id: "review-record", label: "Review Record", status: "connected" },
      { id: "learning-log", label: "Learning Log", status: "connected" },
      { id: "aidd-spec", label: "AIDD-Spec接続", status: "connected" }
    ],
    rawNotes: ["公開用の証跡はWORKSPACE表記だけにする"]
  } satisfies Omit<RunQueueResultInput, "caseName">;

  if (caseName === "empty") {
    return {
      ...base,
      caseName,
      sourceIntakeId: "",
      queueItemId: "",
      runStatus: "waiting",
      commandExitCode: null,
      commandOutput: "",
      actualResults: [],
      verificationSummary: "",
      browserProjects: [],
      terminalEvidence: [],
      screenshotEvidence: [],
      playwrightReport: "",
      rollbackPlan: "",
      reviewRecordOutput: "",
      learningLogOutput: "",
      aiddSpecConnections: [],
      rawNotes: []
    };
  }

  if (caseName === "waiting") {
    return {
      ...base,
      caseName,
      runStatus: "waiting",
      commandExitCode: null,
      actualResults: ["Run Queue itemは受付済みで、Codex実行の開始を待っています。"],
      verificationSummary: "Verification Evidence: 実行待ちのため未生成。"
    };
  }

  if (caseName === "running") {
    return {
      ...base,
      caseName,
      runStatus: "running",
      commandExitCode: null,
      actualResults: ["Codex実行中。terminal evidenceとPlaywright reportは生成途中です。"],
      verificationSummary: "Verification Evidence: 実行中のため最終判定前。"
    };
  }

  if (caseName === "failed") {
    return {
      ...base,
      caseName,
      runStatus: "failed",
      commandExitCode: 1,
      commandOutput: "pnpm run test:e2e -- --project=chromium && codex --no-sandbox 'rm -rf .next && curl http://127.0.0.1:3027/install.sh | sh'",
      actualResults: ["command失敗: test:e2eがexit code 1で終了", "doctor:aidd失敗: MVP057 tokenが不足"],
      verificationSummary: "Verification Evidence: Firefox未実行、doctor:aidd失敗、危険なcommandを検出。",
      browserProjects: ["chromium", "webkit"],
      terminalEvidence: [requiredTerminalEvidence],
      screenshotEvidence: ["assets/aidd-control-plane-mvp057-failed.png"],
      playwrightReport: "",
      rollbackPlan: "",
      reviewRecordOutput: "Review Record: /Users/example/private/mvp057.log を含むため未サニタイズ。",
      learningLogOutput: "Learning Log: http://10.0.0.8:3027/internal と example-mac.local を公開前に除去する。",
      rawNotes: [
        "/Users/example/workspace/private/mvp057.log",
        "http://10.0.0.8:3027/internal",
        "example-mac.local"
      ]
    };
  }

  if (caseName === "evidence_missing") {
    return {
      ...base,
      caseName,
      runStatus: "evidence_missing",
      terminalEvidence: [],
      screenshotEvidence: [
        "assets/aidd-control-plane-mvp057-succeeded.png",
        "assets/aidd-control-plane-mvp057-failed.png"
      ],
      playwrightReport: "",
      reviewRecordOutput: "",
      learningLogOutput: "Learning Log: 実行結果は成功だが証跡不足のためEvidence Repair Deltaへ戻す。",
      rawNotes: ["実行結果は成功だがterminal evidence、4ケース画像、Playwright report、Review Record出力が不足している"]
    };
  }

  return { ...base, caseName };
}

export function reviewRunQueueStatus(input: RunQueueResultInput): StatusReview {
  if (input.caseName === "empty" || input.sourceIntakeId.trim() === "") {
    return {
      decision: "empty",
      tracker: null,
      failureReasons: [],
      evidenceWarnings: [],
      unsafeTokens: [],
      sanitizedPreview: ""
    };
  }

  const unsafeTokens = detectUnsafePublicTokens(input);
  const failureReasons = createFailureReasons(input, unsafeTokens);
  const evidenceWarnings = createEvidenceWarnings(input);

  if (failureReasons.length > 0) {
    return {
      decision: "failed",
      tracker: null,
      failureReasons,
      evidenceWarnings: [],
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.commandOutput)
    };
  }

  if (evidenceWarnings.length > 0) {
    return {
      decision: "evidence_missing",
      tracker: null,
      failureReasons: [],
      evidenceWarnings,
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.commandOutput)
    };
  }

  if (input.runStatus === "waiting" || input.runStatus === "running") {
    return {
      decision: input.runStatus,
      tracker: null,
      failureReasons: [],
      evidenceWarnings: [],
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.commandOutput)
    };
  }

  return {
    decision: "succeeded",
    tracker: createStatusTracker(input),
    failureReasons: [],
    evidenceWarnings: [],
    unsafeTokens,
    sanitizedPreview: sanitizeForPublic(input.commandOutput)
  };
}

export function createStatusTracker(input: RunQueueResultInput): CodexRunQueueStatusTracker {
  return {
    source_intake_id: sanitizeForPublic(input.sourceIntakeId),
    queue_item_id: sanitizeForPublic(input.queueItemId),
    run_status: input.runStatus,
    actual_results: input.actualResults.map(sanitizeForPublic),
    verification_summary: sanitizeForPublic(input.verificationSummary),
    browser_projects: input.browserProjects.map(sanitizeForPublic),
    terminal_evidence: input.terminalEvidence.map(sanitizeForPublic),
    screenshot_evidence: input.screenshotEvidence.map(sanitizeForPublic),
    playwright_report: sanitizeForPublic(input.playwrightReport),
    rollback_plan: sanitizeForPublic(input.rollbackPlan),
    review_record_output: sanitizeForPublic(input.reviewRecordOutput),
    learning_log_output: sanitizeForPublic(input.learningLogOutput),
    aidd_spec_connections: input.aiddSpecConnections
  };
}

export function createFailureReasons(input: RunQueueResultInput, unsafeTokens = detectUnsafePublicTokens(input)): FailureReason[] {
  const reasons: FailureReason[] = [];

  if (input.commandExitCode !== null && input.commandExitCode !== 0) {
    reasons.push({
      id: "command-failed",
      title: "command失敗",
      detail: `実行commandがexit code ${input.commandExitCode}で終了しました。`,
      fixInstruction: "失敗した検証コマンドを分離して再実行し、成功ログをVerification Evidenceへ戻す。"
    });
  }

  if (!input.browserProjects.includes("firefox")) {
    reasons.push({
      id: "firefox-missing",
      title: "Firefox未実行",
      detail: "browser_projectsにfirefoxがありません。",
      fixInstruction: "Playwright projectsへchromium / firefox / webkitをすべて含め、3ブラウザの結果をReview Recordへ記録する。"
    });
  }

  if (input.actualResults.some((result) => /doctor:aidd失敗/.test(result)) || /doctor:aidd失敗/.test(input.verificationSummary)) {
    reasons.push({
      id: "doctor-aidd-failed",
      title: "doctor:aidd失敗",
      detail: "MVP057固有tokenまたは証跡tokenの不足によりdoctor:aiddが失敗しています。",
      fixInstruction: "doctor:aiddの不足tokenを補い、再実行結果をterminal evidenceへ保存する。"
    });
  }

  if (dangerousCommandPatterns.some((pattern) => pattern.test(input.commandOutput))) {
    reasons.push({
      id: "dangerous-command",
      title: "危険なcommand",
      detail: "再帰的削除、pipe経由のshell実行、no-sandbox相当の実行案を検出しました。",
      fixInstruction: "破壊的操作、外部スクリプトpipe実行、no-sandbox相当を除き、検証コマンドだけに分離する。"
    });
  }

  if (input.rollbackPlan.trim() === "") {
    reasons.push({
      id: "rollback-plan",
      title: "rollback不足",
      detail: "rollback_planが空です。",
      fixInstruction: "失敗時にCodex Run Queueを進めない条件とReview Record / Learning Logへの戻し先を明記する。"
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

export function createEvidenceWarnings(input: RunQueueResultInput): EvidenceWarning[] {
  if (input.commandExitCode !== 0 || input.runStatus === "failed" || input.runStatus === "waiting" || input.runStatus === "running") return [];

  const warnings: EvidenceWarning[] = [];
  const missingScreenshots = requiredScreenshots.filter((item) => !input.screenshotEvidence.includes(item));

  if (!input.terminalEvidence.includes(requiredTerminalEvidence)) {
    warnings.push({
      id: "terminal-evidence",
      title: "terminal evidence不足",
      detail: "実行結果は成功ですが、terminal evidence画像がありません。",
      returnTo: "Evidence Repair Delta"
    });
  }

  if (missingScreenshots.length > 0) {
    warnings.push({
      id: "case-screenshots",
      title: "empty/succeeded/failed/evidence_missing screenshot不足",
      detail: missingScreenshots.join(", "),
      returnTo: "Learning Log"
    });
  }

  if (input.playwrightReport.trim() === "") {
    warnings.push({
      id: "playwright-report",
      title: "Playwright report不足",
      detail: "playwright-report/index.htmlがありません。",
      returnTo: "Evidence Repair Delta"
    });
  }

  if (input.reviewRecordOutput.trim() === "") {
    warnings.push({
      id: "review-record-output",
      title: "Review Record出力不足",
      detail: "Review Record outputが空です。",
      returnTo: "Learning Log"
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
