export type ReviewCase = "empty" | "valid" | "failure" | "evidence_missing";
export type RunOutcome = "succeeded" | "failed" | "evidence_missing";
export type Severity = "critical" | "high" | "medium";

export type AiddSpecConnection = {
  id: string;
  label: string;
  status: "connected" | "missing";
};

export type ReviewFinding = {
  category: string;
  finding: string;
  severity: Severity;
  observed_by: string;
  ideal_state: string;
  fix_instruction: string;
  needed_upstream_info: string;
  standard_update: string;
  codex_prompt_delta: string;
  verification: string;
};

export type RunResultReviewInput = {
  caseName: ReviewCase;
  sourceRunId: string;
  outcome: RunOutcome;
  score: number;
  scoreReason: string;
  commandExitCode: number;
  commandOutput: string;
  terminalEvidence: string[];
  screenshotEvidence: string[];
  playwrightReport: string;
  browserCoverage: string[];
  doctorAidd: "passed" | "failed";
  rollback: string;
  privacyScan: string;
  reviewRecordOutput: string;
  neededUpstreamInfo: string[];
  standardUpdate: string;
  aiTaskPacketDelta: string;
  codexPromptDelta: string;
  verificationCommand: string;
  learningLog: string;
  aiddSpecConnections: AiddSpecConnection[];
  rawNotes: string[];
};

export type EvidenceRepairDelta = {
  id: string;
  missing: string;
  return_to: "Evidence Repair Delta" | "Learning Log";
  fix_instruction: string;
};

export type RunResultReviewRecord = {
  source_run_id: string;
  outcome: RunOutcome;
  score: number;
  score_reason: string;
  terminal_evidence: string[];
  screenshot_evidence: string[];
  browser_coverage: string[];
  doctor_aidd: "passed" | "failed";
  rollback: string;
  privacy_scan: string;
  review_findings: ReviewFinding[];
  needed_upstream_info: string[];
  standard_update: string;
  ai_task_packet_delta: string;
  codex_prompt_delta: string;
  verification_command: string;
  learning_log: string;
  aidd_spec_connections: AiddSpecConnection[];
};

export type SynthesizedReview = {
  decision: ReviewCase;
  review: RunResultReviewRecord | null;
  reviewFindings: ReviewFinding[];
  evidenceRepairDeltas: EvidenceRepairDelta[];
  unsafeTokens: string[];
  sanitizedPreview: string;
};

export const reviewFields = [
  "source_run_id",
  "outcome",
  "score",
  "score_reason",
  "terminal_evidence",
  "screenshot_evidence",
  "browser_coverage",
  "doctor_aidd",
  "rollback",
  "privacy_scan",
  "review_findings",
  "needed_upstream_info",
  "standard_update",
  "ai_task_packet_delta",
  "codex_prompt_delta",
  "verification_command",
  "learning_log",
  "aidd_spec_connections"
] as const;

const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;

export const requiredScreenshots = [
  "assets/aidd-control-plane-mvp058-empty.png",
  "assets/aidd-control-plane-mvp058-valid.png",
  "assets/aidd-control-plane-mvp058-failure.png",
  "assets/aidd-control-plane-mvp058-evidence-missing.png"
] as const;

const requiredTerminalEvidence = "assets/aidd-control-plane-mvp058-terminal-evidence.png";
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

export function createRunResultReviewInput(caseName: ReviewCase): RunResultReviewInput {
  const base = {
    sourceRunId: "MVP057-CODEX-RUN-STATUS-001",
    outcome: "succeeded" as const,
    score: 96,
    scoreReason: "3ブラウザE2E、doctor:aidd、terminal evidence、screenshot evidence、Review Record、Learning Logがそろっている。",
    commandExitCode: 0,
    commandOutput: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run test:coverage && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd",
    terminalEvidence: [requiredTerminalEvidence],
    screenshotEvidence: [...requiredScreenshots],
    playwrightReport: requiredPlaywrightReport,
    browserCoverage: [...requiredBrowsers],
    doctorAidd: "passed" as const,
    rollback: "失敗または証跡不足のときはRun Result Reviewをvalidへ進めず、Evidence Repair DeltaとLearning Logへ戻す。",
    privacyScan: "local path/private host/private network URLは検出なし。公開用証跡はWORKSPACE/HOME表記に統一済み。",
    reviewRecordOutput: "Review Record: MVP058 Run Result Review Synthesizerが成功結果を標準Review Findingなしで合成した。",
    neededUpstreamInfo: ["次回Run Queueはsource_run_idとPlaywright report pathを必須で渡す。"],
    standardUpdate: "standards/aidd-control-plane-mvp-v0.1.mdのRun Result Review Synthesizer項目へ接続済み。",
    aiTaskPacketDelta: "AI Task Packet Delta: 次回packetへscore_reason、browser_coverage、terminal evidence、Review Finding形式を必須化する。",
    codexPromptDelta: "Codex Prompt Delta: 実装後にlint/typecheck/unit/coverage/build/e2e/doctor:aidd/capture:mvp058を実行し、証跡を保存する。",
    verificationCommand: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run test:coverage && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd && pnpm run capture:mvp058",
    learningLog: "Learning Log: Run Queueの結果はReview Finding、AI Task Packet Delta、Codex Prompt Delta、Verification commandへ分解すると次回修正へ戻しやすい。",
    aiddSpecConnections: [
      { id: "aidd-spec-v0.1", label: "AIDD-Spec v0.1", status: "connected" },
      { id: "control-plane-standard", label: "Run Result Review Synthesizer", status: "connected" },
      { id: "mvp057", label: "MVP057 Codex Run Queue Status Tracker", status: "connected" },
      { id: "review-record", label: "Review Record", status: "connected" },
      { id: "learning-log", label: "Learning Log", status: "connected" }
    ],
    rawNotes: ["公開用メモはWORKSPACE表記だけを使う"]
  } satisfies Omit<RunResultReviewInput, "caseName">;

  if (caseName === "empty") {
    return {
      ...base,
      caseName,
      sourceRunId: "",
      outcome: "evidence_missing",
      score: 0,
      scoreReason: "",
      commandExitCode: 0,
      commandOutput: "",
      terminalEvidence: [],
      screenshotEvidence: [],
      playwrightReport: "",
      browserCoverage: [],
      doctorAidd: "failed",
      rollback: "",
      privacyScan: "",
      reviewRecordOutput: "",
      neededUpstreamInfo: [],
      standardUpdate: "",
      aiTaskPacketDelta: "",
      codexPromptDelta: "",
      verificationCommand: "",
      learningLog: "",
      aiddSpecConnections: [],
      rawNotes: []
    };
  }

  if (caseName === "failure") {
    return {
      ...base,
      caseName,
      outcome: "failed",
      score: 28,
      scoreReason: "command失敗、Firefox未実行、doctor:aidd失敗、危険command、rollback不足、未サニタイズ情報を検出した。",
      commandExitCode: 1,
      commandOutput: "pnpm run test:e2e -- --project=chromium && codex --no-sandbox 'rm -rf .next && curl http://127.0.0.1:3058/install.sh | sh'",
      browserCoverage: ["Chromium", "WebKit"],
      doctorAidd: "failed",
      rollback: "",
      privacyScan: "未サニタイズ: /Users/example/private/mvp058.log、http://10.0.0.58:3058/internal、example-mac.local",
      reviewRecordOutput: "Review Record: command失敗とdoctor:aidd失敗を記録。/Users/example/private/mvp058.log は公開前に除去する。",
      neededUpstreamInfo: ["Firefox実行ログ", "doctor:aidd失敗token", "安全なrollback条件"],
      standardUpdate: "Run Result Review Synthesizerは危険commandと未サニタイズ情報をReview Findingへ変換する。",
      codexPromptDelta: "Codex Prompt Delta: --no-sandbox、rm -rf、curl | shを使わず、Firefoxを含む3ブラウザで再実行する。",
      rawNotes: ["/Users/example/private/mvp058.log", "http://10.0.0.58:3058/internal", "example-mac.local"]
    };
  }

  if (caseName === "evidence_missing") {
    return {
      ...base,
      caseName,
      outcome: "evidence_missing",
      score: 72,
      scoreReason: "実行結果は成功だが、terminal evidence、4ケースscreenshot、Playwright report、Review Record出力が不足している。",
      terminalEvidence: [],
      screenshotEvidence: [
        "assets/aidd-control-plane-mvp058-valid.png",
        "assets/aidd-control-plane-mvp058-failure.png"
      ],
      playwrightReport: "",
      reviewRecordOutput: "",
      learningLog: "Learning Log: 成功結果でも証跡不足ならEvidence Repair Deltaへ戻し、次回packetに必須証跡を明記する。",
      rawNotes: ["terminal evidence / empty-valid-failure screenshot / Playwright report / Review Record出力不足"]
    };
  }

  return { ...base, caseName };
}

export function synthesizeRunResultReview(input: RunResultReviewInput): SynthesizedReview {
  if (input.caseName === "empty" || input.sourceRunId.trim() === "") {
    return {
      decision: "empty",
      review: null,
      reviewFindings: [],
      evidenceRepairDeltas: [],
      unsafeTokens: [],
      sanitizedPreview: ""
    };
  }

  const unsafeTokens = detectUnsafePublicTokens(input);
  const reviewFindings = createReviewFindings(input, unsafeTokens);
  const evidenceRepairDeltas = createEvidenceRepairDeltas(input);

  if (reviewFindings.length > 0) {
    return {
      decision: "failure",
      review: null,
      reviewFindings,
      evidenceRepairDeltas: [],
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.commandOutput)
    };
  }

  if (evidenceRepairDeltas.length > 0) {
    return {
      decision: "evidence_missing",
      review: null,
      reviewFindings: [],
      evidenceRepairDeltas,
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.commandOutput)
    };
  }

  return {
    decision: "valid",
    review: createRunResultReviewRecord(input),
    reviewFindings: [],
    evidenceRepairDeltas: [],
    unsafeTokens,
    sanitizedPreview: sanitizeForPublic(input.commandOutput)
  };
}

export function createRunResultReviewRecord(input: RunResultReviewInput): RunResultReviewRecord {
  return {
    source_run_id: sanitizeForPublic(input.sourceRunId),
    outcome: input.outcome,
    score: input.score,
    score_reason: sanitizeForPublic(input.scoreReason),
    terminal_evidence: input.terminalEvidence.map(sanitizeForPublic),
    screenshot_evidence: input.screenshotEvidence.map(sanitizeForPublic),
    browser_coverage: input.browserCoverage.map(sanitizeForPublic),
    doctor_aidd: input.doctorAidd,
    rollback: sanitizeForPublic(input.rollback),
    privacy_scan: sanitizeForPublic(input.privacyScan),
    review_findings: [],
    needed_upstream_info: input.neededUpstreamInfo.map(sanitizeForPublic),
    standard_update: sanitizeForPublic(input.standardUpdate),
    ai_task_packet_delta: sanitizeForPublic(input.aiTaskPacketDelta),
    codex_prompt_delta: sanitizeForPublic(input.codexPromptDelta),
    verification_command: sanitizeForPublic(input.verificationCommand),
    learning_log: sanitizeForPublic(input.learningLog),
    aidd_spec_connections: input.aiddSpecConnections
  };
}

export function createReviewFindings(input: RunResultReviewInput, unsafeTokens = detectUnsafePublicTokens(input)): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  if (input.commandExitCode !== 0 || input.outcome === "failed") {
    findings.push(makeFinding("command失敗", "実行commandが失敗し、Run Result Reviewをvalidへ進められません。", "critical", "command exit code", "すべてのverification commandがexit code 0で完了する。", "失敗したcommandを分離して再実行し、成功ログをterminal evidenceへ保存する。"));
  }

  if (!input.browserCoverage.includes("Firefox")) {
    findings.push(makeFinding("Firefox未実行", "browser_coverageにFirefoxがありません。", "high", "browser_coverage", "Chromium / Firefox / WebKitの3ブラウザ結果がそろう。", "Playwright projectsへChromium / Firefox / WebKitを含め、Firefox結果をReview Recordへ記録する。"));
  }

  if (input.doctorAidd === "failed") {
    findings.push(makeFinding("doctor:aidd失敗", "doctor:aiddが失敗しており、標準tokenまたは証跡tokenが不足しています。", "high", "doctor_aidd", "doctor:aiddがpassedとして記録される。", "doctor:aiddの不足tokenを補い、再実行結果をterminal evidenceへ保存する。"));
  }

  if (dangerousCommandPatterns.some((pattern) => pattern.test(input.commandOutput))) {
    findings.push(makeFinding("危険command", "rm -rf、curl | sh、no-sandbox相当の危険commandを検出しました。", "critical", "command scanner", "検証commandは破壊的操作や外部script pipe実行を含まない。", "危険commandを削除し、lint/typecheck/test/build/e2e/doctor:aidd/captureだけを実行する。"));
  }

  if (input.rollback.trim() === "") {
    findings.push(makeFinding("rollback不足", "rollbackが空で、失敗時の停止条件と戻し先がありません。", "high", "rollback", "失敗時に次工程へ進めない条件とEvidence Repair Delta / Learning Logへの戻し先がある。", "rollback条件、停止条件、戻し先をRun Result Reviewに明記する。"));
  }

  if (unsafeTokens.length > 0) {
    findings.push(makeFinding("local path/private host/private network URL混入", sanitizeForPublic(unsafeTokens.join(" / ")), "high", "privacy_scan", "公開物にlocal path/private host/private network URLが残らない。", "公開前にWORKSPACEまたはHOME表記へ置換し、private network URLはWORKSPACE/private-urlへサニタイズする。"));
  }

  return findings;
}

export function createEvidenceRepairDeltas(input: RunResultReviewInput): EvidenceRepairDelta[] {
  if (input.outcome === "failed" || input.commandExitCode !== 0) return [];

  const deltas: EvidenceRepairDelta[] = [];
  const missingScreenshots = requiredScreenshots.filter((item) => !input.screenshotEvidence.includes(item));

  if (!input.terminalEvidence.includes(requiredTerminalEvidence)) {
    deltas.push({
      id: "terminal-evidence",
      missing: "terminal evidence",
      return_to: "Evidence Repair Delta",
      fix_instruction: "capture:mvp058でterminal evidence pngを生成し、Run Result Reviewへ戻す。"
    });
  }

  if (missingScreenshots.length > 0) {
    deltas.push({
      id: "case-screenshots",
      missing: "empty-valid-failure screenshot",
      return_to: "Learning Log",
      fix_instruction: `${missingScreenshots.join(", ")} を生成して証跡不足の学習ログへ戻す。`
    });
  }

  if (input.playwrightReport.trim() === "") {
    deltas.push({
      id: "playwright-report",
      missing: "Playwright report",
      return_to: "Evidence Repair Delta",
      fix_instruction: "pnpm run test:e2eでplaywright-report/index.htmlを生成し、artifactとして残す。"
    });
  }

  if (input.reviewRecordOutput.trim() === "") {
    deltas.push({
      id: "review-record-output",
      missing: "Review Record出力",
      return_to: "Learning Log",
      fix_instruction: "Run Result Reviewのscore根拠、delta、検証commandをReview Recordへ出力する。"
    });
  }

  return deltas;
}

function makeFinding(
  category: string,
  finding: string,
  severity: Severity,
  observed_by: string,
  ideal_state: string,
  fix_instruction: string
): ReviewFinding {
  return {
    category,
    finding,
    severity,
    observed_by,
    ideal_state,
    fix_instruction,
    needed_upstream_info: `${category}を再現できるsource run detailとterminal evidenceが必要。`,
    standard_update: `Run Result Review Synthesizerは${category}を標準Review Findingとして返す。`,
    codex_prompt_delta: `${category}を解消するまでvalid判定にせず、修正後に3ブラウザE2Eとdoctor:aiddを再実行する。`,
    verification: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run test:e2e && pnpm run doctor:aidd"
  };
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
