export type VerificationCase = "empty" | "valid" | "failure" | "repair_needed";
export type VerificationDecision = "empty" | "ready" | "blocked" | "repair_needed";
export type CommandStatus = "passed" | "failed" | "timeout" | "evidence_missing";
export type Severity = "critical" | "high" | "medium";

export type CommandDetail = {
  command: string;
  exit_code: number | null;
  duration: string;
  status: CommandStatus;
  artifact_path: string;
  failure_category: string;
  repair_instruction: string;
};

export type BrowserCoverage = {
  Chromium: boolean;
  Firefox: boolean;
  WebKit: boolean;
};

export type AiddSpecConnection = {
  id: string;
  label: string;
  status: "connected" | "missing";
};

export type ReviewFindingDraft = {
  title: string;
  body: string;
  severity: Severity;
};

export type VerificationRunDetail = {
  source_queue_item_id: string;
  source_run_status: "succeeded" | "failed" | "timeout" | "waiting";
  commit_sha: string;
  command_details: CommandDetail[];
  browser_coverage: BrowserCoverage;
  terminal_evidence: string[];
  screenshot_evidence: string[];
  playwright_report: string;
  review_finding_draft: ReviewFindingDraft[];
  aidd_spec_connections: AiddSpecConnection[];
};

export type ReviewFinding = {
  category: string;
  finding: string;
  severity: Severity;
  observed_by: string;
  ideal_state: string;
  fix_instruction: string;
  ai_task_packet_delta: string;
  codex_prompt_delta: string;
  verification_command: string;
};

export type RepairDelta = {
  source_command: string;
  source_status: CommandStatus;
  ai_task_packet_delta: string;
  codex_prompt_delta: string;
  verification_command: string;
};

export type VerificationInput = {
  caseName: VerificationCase;
  sourceQueueItem: VerificationRunDetail | null;
  publicNotes: string[];
};

export type VerificationResult = {
  decision: VerificationDecision;
  detail: VerificationRunDetail | null;
  findings: ReviewFinding[];
  repairDeltas: RepairDelta[];
  unsafeTokens: string[];
  sanitizedPreview: string;
};

export const detailFields = [
  "source_queue_item_id",
  "source_run_status",
  "commit_sha",
  "command_details",
  "browser_coverage",
  "terminal_evidence",
  "screenshot_evidence",
  "playwright_report",
  "review_finding_draft",
  "aidd_spec_connections"
] as const;

export const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;
export const requiredTerminalEvidence = "artifacts/screenshots/aidd-control-plane-mvp060-terminal-evidence.png";
export const requiredScreenshots = [
  "artifacts/screenshots/aidd-control-plane-mvp060-empty.png",
  "artifacts/screenshots/aidd-control-plane-mvp060-valid.png",
  "artifacts/screenshots/aidd-control-plane-mvp060-failure.png",
  "artifacts/screenshots/aidd-control-plane-mvp060-repair-needed.png"
] as const;
export const requiredPlaywrightReport = "playwright-report/index.html";

const unsafeLocationPatterns = [
  /\/Users\/[^\s"'<>]+/g,
  /\/home\/[^\s"'<>]+/g,
  /\b[A-Za-z0-9._-]+\.local\b/g,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g
];

const readyDetail: VerificationRunDetail = {
  source_queue_item_id: "MVP060-QUEUE-VERIFICATION-001",
  source_run_status: "succeeded",
  commit_sha: "8f4c2a1b9d0e7f6a5c3b2a190fedcba987654321",
  command_details: [
    {
      command: "pnpm run lint",
      exit_code: 0,
      duration: "12秒",
      status: "passed",
      artifact_path: "artifacts/terminal/mvp060-lint.txt",
      failure_category: "なし",
      repair_instruction: "不要"
    },
    {
      command: "pnpm run typecheck",
      exit_code: 0,
      duration: "9秒",
      status: "passed",
      artifact_path: "artifacts/terminal/mvp060-typecheck.txt",
      failure_category: "なし",
      repair_instruction: "不要"
    },
    {
      command: "pnpm run test:e2e",
      exit_code: 0,
      duration: "74秒",
      status: "passed",
      artifact_path: "playwright-report/index.html",
      failure_category: "なし",
      repair_instruction: "不要"
    }
  ],
  browser_coverage: { Chromium: true, Firefox: true, WebKit: true },
  terminal_evidence: [requiredTerminalEvidence, "artifacts/terminal/mvp060-verification.txt"],
  screenshot_evidence: [...requiredScreenshots],
  playwright_report: requiredPlaywrightReport,
  review_finding_draft: [
    {
      title: "Verification Run Detailはready",
      body: "commit SHA、command別detail、3ブラウザ、terminal evidence、screenshot evidence、AIDD-Spec接続がそろっています。",
      severity: "medium"
    }
  ],
  aidd_spec_connections: [
    { id: "aidd-spec-v0.1", label: "AIDD-Spec v0.1", status: "connected" },
    { id: "verification-run-detail", label: "Verification Run Detail", status: "connected" },
    { id: "command-detail-contract", label: "command別detail契約", status: "connected" }
  ]
};

export function createVerificationRunInput(caseName: VerificationCase): VerificationInput {
  if (caseName === "empty") {
    return { caseName, sourceQueueItem: null, publicNotes: [] };
  }

  if (caseName === "failure") {
    return {
      caseName,
      sourceQueueItem: {
        ...readyDetail,
        source_run_status: "failed",
        commit_sha: "",
        command_details: [
          {
            command: "pnpm run lint",
            exit_code: 1,
            duration: "7秒",
            status: "failed",
            artifact_path: "",
            failure_category: "",
            repair_instruction: ""
          }
        ],
        browser_coverage: { Chromium: true, Firefox: false, WebKit: true },
        terminal_evidence: [],
        screenshot_evidence: ["artifacts/screenshots/aidd-control-plane-mvp060-valid.png"],
        playwright_report: "",
        review_finding_draft: [],
        aidd_spec_connections: [
          { id: "aidd-spec-v0.1", label: "AIDD-Spec v0.1", status: "connected" },
          { id: "verification-run-detail", label: "Verification Run Detail", status: "missing" }
        ]
      },
      publicNotes: [
        "/Users/example/private/mvp060-run.txt",
        "http://10.0.0.60:3060/internal",
        "mvp060-workstation.local"
      ]
    };
  }

  if (caseName === "repair_needed") {
    return {
      caseName,
      sourceQueueItem: {
        ...readyDetail,
        source_run_status: "failed",
        command_details: [
          {
            command: "pnpm run lint",
            exit_code: 1,
            duration: "6秒",
            status: "failed",
            artifact_path: "artifacts/terminal/mvp060-lint-failed.txt",
            failure_category: "静的検査失敗",
            repair_instruction: "未使用変数を削除し、lintを再実行する。"
          },
          {
            command: "pnpm run test:e2e",
            exit_code: null,
            duration: "120秒",
            status: "timeout",
            artifact_path: "test-results/mvp060-e2e-timeout",
            failure_category: "E2E timeout",
            repair_instruction: "Playwrightの3ブラウザ設定を維持したまま待機条件を見直す。"
          },
          {
            command: "pnpm run doctor:aidd",
            exit_code: 1,
            duration: "3秒",
            status: "evidence_missing",
            artifact_path: "artifacts/terminal/mvp060-doctor.txt",
            failure_category: "証跡不足",
            repair_instruction: "terminal evidenceとscreenshot evidenceを再生成する。"
          }
        ]
      },
      publicNotes: ["WORKSPACE表記へsanitize済み"]
    };
  }

  return {
    caseName,
    sourceQueueItem: readyDetail,
    publicNotes: ["WORKSPACE表記へsanitize済み"]
  };
}

export function evaluateVerificationRun(input: VerificationInput): VerificationResult {
  if (input.sourceQueueItem === null) {
    return {
      decision: "empty",
      detail: null,
      findings: [],
      repairDeltas: [],
      unsafeTokens: [],
      sanitizedPreview: ""
    };
  }

  const unsafeTokens = detectUnsafePublicTokens(input);
  const findings = createReviewFindings(input.sourceQueueItem, unsafeTokens);
  if (findings.length > 0) {
    return {
      decision: "blocked",
      detail: null,
      findings,
      repairDeltas: [],
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.publicNotes.join("\n"))
    };
  }

  const repairDeltas = createRepairDeltas(input.sourceQueueItem.command_details);
  if (repairDeltas.length > 0) {
    return {
      decision: "repair_needed",
      detail: null,
      findings: repairDeltas.map((delta) => makeFinding(
        "次回修復delta候補",
        `${delta.source_command} が ${delta.source_status} のため、修復deltaへ戻します。`,
        delta.source_status === "timeout" ? "high" : "medium",
        "command_details.status",
        "failed / timeout / evidence_missingのコマンドが次回修復delta候補へ変換されている。",
        delta.codex_prompt_delta
      )),
      repairDeltas,
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.publicNotes.join("\n"))
    };
  }

  return {
    decision: "ready",
    detail: sanitizeDetail(input.sourceQueueItem),
    findings: [],
    repairDeltas: [],
    unsafeTokens,
    sanitizedPreview: sanitizeForPublic(input.publicNotes.join("\n"))
  };
}

export function createReviewFindings(detail: VerificationRunDetail, unsafeTokens = detectUnsafePublicTokens(detail)): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  if (detail.commit_sha.trim() === "") {
    findings.push(makeFinding("commit SHA不足", "commit_shaが空で、検証対象を固定できません。", "critical", "commit_sha", "検証runが40文字のcommit SHAへ接続している。", "commit_shaをsource queue itemへ戻す。"));
  }

  if (detail.command_details.length === 0) {
    findings.push(makeFinding("command別detail不足", "command_detailsが空で、コマンド別の結果を確認できません。", "critical", "command_details", "各commandにexit_code / duration / status / artifact_path / failure_category / repair_instructionがある。", "command別detailをAI Task Packet deltaへ追加する。"));
  }

  for (const command of detail.command_details) {
    if (command.artifact_path.trim() === "") {
      findings.push(makeFinding("artifact path不足", `${command.command} のartifact_pathが空です。`, "high", "command_details.artifact_path", "各commandがterminal logまたはreport artifactへ接続している。", "artifact_pathをverification commandの保存先として追加する。"));
    }
    if (command.status !== "passed" && command.failure_category.trim() === "") {
      findings.push(makeFinding("失敗分類不足", `${command.command} のfailure_categoryが空です。`, "high", "command_details.failure_category", "失敗したcommandには分類がある。", "failure_categoryをReview Finding draftへ戻す。"));
    }
    if (command.status !== "passed" && command.repair_instruction.trim() === "") {
      findings.push(makeFinding("修正指示不足", `${command.command} のrepair_instructionが空です。`, "high", "command_details.repair_instruction", "失敗したcommandには次回の修正指示がある。", "repair_instructionをCodex prompt deltaへ戻す。"));
    }
  }

  if (!detail.browser_coverage.Firefox) {
    findings.push(makeFinding("Firefox除外", "browser_coverageからFirefoxが外れています。", "high", "browser_coverage.Firefox", "Chromium / Firefox / WebKitの3ブラウザがすべてtrueである。", "Firefoxを除外せず、Playwright 3ブラウザで再実行する。"));
  }

  const missingEvidence = findMissingEvidence(detail);
  if (missingEvidence.length > 0 || detail.playwright_report.trim() === "") {
    findings.push(makeFinding("証跡不足", `不足証跡: ${missingEvidence.join(" / ") || "playwright_report"}`, "high", "terminal_evidence / screenshot_evidence / playwright_report", "terminal evidence、screenshot evidence、playwright_reportがそろっている。", "不足証跡を保存してverification commandへ戻す。"));
  }

  if (unsafeTokens.length > 0) {
    findings.push(makeFinding("local path/private host/private network URL混入", sanitizeForPublic(unsafeTokens.join(" / ")), "critical", "publicNotes", "公開物にlocal path/private host/private network URLが残らない。", "WORKSPACEまたはHOME表記へ置換し、doctor:aiddで再検査する。"));
  }

  return dedupeFindings(findings);
}

export function createRepairDeltas(commands: CommandDetail[]): RepairDelta[] {
  return commands
    .filter((command) => ["failed", "timeout", "evidence_missing"].includes(command.status))
    .map((command) => ({
      source_command: command.command,
      source_status: command.status,
      ai_task_packet_delta: `${command.command}の${command.status}を次回修復scopeへ追加し、artifact_path=${command.artifact_path}を参照する。`,
      codex_prompt_delta: `${command.repair_instruction} 修復後は${command.command}を再実行する。`,
      verification_command: command.command
    }));
}

export function findMissingEvidence(detail: VerificationRunDetail): string[] {
  const required = [requiredTerminalEvidence, ...requiredScreenshots, requiredPlaywrightReport];
  return required.filter((item) => (
    !detail.terminal_evidence.includes(item) &&
    !detail.screenshot_evidence.includes(item) &&
    detail.playwright_report !== item
  ));
}

function sanitizeDetail(detail: VerificationRunDetail): VerificationRunDetail {
  return {
    ...detail,
    source_queue_item_id: sanitizeForPublic(detail.source_queue_item_id),
    commit_sha: sanitizeForPublic(detail.commit_sha),
    command_details: detail.command_details.map((command) => ({
      ...command,
      command: sanitizeForPublic(command.command),
      artifact_path: sanitizeForPublic(command.artifact_path),
      failure_category: sanitizeForPublic(command.failure_category),
      repair_instruction: sanitizeForPublic(command.repair_instruction)
    })),
    terminal_evidence: detail.terminal_evidence.map(sanitizeForPublic),
    screenshot_evidence: detail.screenshot_evidence.map(sanitizeForPublic),
    playwright_report: sanitizeForPublic(detail.playwright_report),
    review_finding_draft: detail.review_finding_draft.map((draft) => ({
      ...draft,
      title: sanitizeForPublic(draft.title),
      body: sanitizeForPublic(draft.body)
    }))
  };
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
    ai_task_packet_delta: `${category}をAI Task Packet deltaへ戻し、source queue itemへ必要な入力を明記する。`,
    codex_prompt_delta: `${category}を解消する修正指示をCodex prompt deltaへ追加する。`,
    verification_command: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run test:e2e && pnpm run doctor:aidd"
  };
}

function dedupeFindings(findings: ReviewFinding[]): ReviewFinding[] {
  const seen = new Set<string>();
  return findings.filter((finding) => {
    const key = finding.category;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
