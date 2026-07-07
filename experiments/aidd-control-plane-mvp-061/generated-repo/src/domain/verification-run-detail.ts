export type VerificationCase = "empty" | "valid" | "failure" | "repair_needed";
export type VerificationDecision = "empty" | "delta_ready" | "blocked" | "repair_needed";
export type CommandStatus = "passed" | "failed" | "timeout" | "evidence_missing";
export type Severity = "critical" | "high" | "medium";
export type RepairLane = "execute_now" | "next_increment" | "learning_log";

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
  lane: RepairLane;
  ai_task_packet_delta: string;
  codex_prompt_delta: string;
  verification_command: string;
  rollback_condition: string;
  learning_log_note: string;
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
export const requiredTerminalEvidence = "artifacts/screenshots/aidd-control-plane-mvp061-terminal-evidence.png";
export const requiredScreenshots = [
  "artifacts/screenshots/aidd-control-plane-mvp061-empty.png",
  "artifacts/screenshots/aidd-control-plane-mvp061-valid.png",
  "artifacts/screenshots/aidd-control-plane-mvp061-failure.png",
  "artifacts/screenshots/aidd-control-plane-mvp061-repair-needed.png"
] as const;
export const requiredPlaywrightReport = "playwright-report/index.html";

const unsafeLocationPatterns = [
  /\/Users\/[^\s"'<>]+/g,
  /\/home\/[^\s"'<>]+/g,
  /\b[A-Za-z0-9._-]+\.local\b/g,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g
];

const readyDetail: VerificationRunDetail = {
  source_queue_item_id: "MVP061-QUEUE-EVIDENCE-REPAIR-001",
  source_run_status: "failed",
  commit_sha: "91f4c2a1b9d0e7f6a5c3b2a190fedcba9876543",
  command_details: [
    {
      command: "pnpm run lint",
      exit_code: 0,
      duration: "11秒",
      status: "passed",
      artifact_path: "artifacts/terminal/mvp061-lint.txt",
      failure_category: "なし",
      repair_instruction: "不要"
    },
    {
      command: "pnpm run test:e2e",
      exit_code: 1,
      duration: "89秒",
      status: "failed",
      artifact_path: "artifacts/terminal/mvp061-e2e-failed.txt",
      failure_category: "画面状態切替の期待値不一致",
      repair_instruction: "ケース切替後にRepair Delta一覧が更新されることをテストとUIの両方でそろえる。"
    },
    {
      command: "pnpm run test:e2e --project=firefox",
      exit_code: null,
      duration: "120秒",
      status: "timeout",
      artifact_path: "test-results/mvp061-firefox-timeout",
      failure_category: "Firefoxの待機条件timeout",
      repair_instruction: "Firefoxを除外せず、表示完了の待機条件とexpect timeout内の安定化だけを修正する。"
    },
    {
      command: "pnpm run doctor:aidd",
      exit_code: 1,
      duration: "3秒",
      status: "evidence_missing",
      artifact_path: "artifacts/terminal/mvp061-doctor.txt",
      failure_category: "証跡不足",
      repair_instruction: "MVP061のterminal evidence screenshotとcapture script出力を保存してdoctor:aiddを再実行する。"
    }
  ],
  browser_coverage: { Chromium: true, Firefox: true, WebKit: true },
  terminal_evidence: [requiredTerminalEvidence, "artifacts/terminal/mvp061-verification.txt"],
  screenshot_evidence: [...requiredScreenshots],
  playwright_report: requiredPlaywrightReport,
  review_finding_draft: [
    {
      title: "Evidence Repair Delta Generator入力は十分",
      body: "Verification Run Detail、Review Record、Learning Log、AI Task Packetへ接続済みで、失敗したcommandから修理deltaを生成できます。",
      severity: "medium"
    }
  ],
  aidd_spec_connections: [
    { id: "aidd-spec-v0.1", label: "AIDD-Spec v0.1", status: "connected" },
    { id: "aidd-control-plane-mvp-v0.1", label: "AIDD Control Plane MVP v0.1", status: "connected" },
    { id: "verification-evidence", label: "Verification Evidence", status: "connected" },
    { id: "review-record", label: "Review Record", status: "connected" },
    { id: "learning-log", label: "Learning Log", status: "connected" },
    { id: "ai-task-packet", label: "AI Task Packet", status: "connected" }
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
            command: "pnpm run test:e2e",
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
        screenshot_evidence: ["artifacts/screenshots/aidd-control-plane-mvp061-valid.png"],
        playwright_report: "",
        review_finding_draft: [],
        aidd_spec_connections: [
          { id: "aidd-spec-v0.1", label: "AIDD-Spec v0.1", status: "connected" },
          { id: "verification-evidence", label: "Verification Evidence", status: "missing" }
        ]
      },
      publicNotes: [
        "/Users/example/private/mvp061-run.txt",
        "http://10.0.0.61:3061/internal",
        "mvp061-workstation.local"
      ]
    };
  }

  if (caseName === "repair_needed") {
    return {
      caseName,
      sourceQueueItem: readyDetail,
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

  const allDeltas = createRepairDeltas(input.sourceQueueItem.command_details);
  const repairDeltas = input.caseName === "repair_needed" ? narrowNextRepairDeltas(allDeltas) : allDeltas;
  return {
    decision: input.caseName === "repair_needed" ? "repair_needed" : "delta_ready",
    detail: sanitizeDetail(input.sourceQueueItem),
    findings: input.caseName === "repair_needed" ? repairDeltas.map((delta) => makeFinding(
      "次の1回へ絞り込み",
      `${delta.source_command} を ${delta.lane} に入れ、今回の修復単位を小さくします。`,
      "medium",
      "repair_delta.lane",
      "execute_now / next_increment / learning_logに分け、次の1回のdeltaだけを実行対象にしている。",
      delta.codex_prompt_delta
    )) : [],
    repairDeltas,
    unsafeTokens,
    sanitizedPreview: sanitizeForPublic(input.publicNotes.join("\n"))
  };
}

export function createReviewFindings(detail: VerificationRunDetail, unsafeTokens = detectUnsafePublicTokens(detail)): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  if (detail.commit_sha.trim() === "") {
    findings.push(makeFinding("source detail不足", "commit_shaが空で、Verification Run Detailのsourceを固定できません。", "critical", "commit_sha", "検証runが40文字のcommit SHAへ接続している。", "commit_shaをsource queue itemへ戻す。"));
  }

  if (detail.command_details.length === 0) {
    findings.push(makeFinding("source detail不足", "command_detailsが空で、失敗元のcommandを確認できません。", "critical", "command_details", "各commandにexit_code / duration / status / artifact_path / failure_category / repair_instructionがある。", "command別detailをAI Task Packet deltaへ追加する。"));
  }

  for (const command of detail.command_details) {
    if (command.artifact_path.trim() === "") {
      findings.push(makeFinding("source detail不足", `${command.command} のartifact_pathが空です。`, "high", "command_details.artifact_path", "各commandがterminal logまたはreport artifactへ接続している。", "artifact_pathをverification commandの保存先として追加する。"));
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
    findings.push(makeFinding("terminal/failure screenshot不足", `不足証跡: ${missingEvidence.join(" / ") || "playwright_report"}`, "high", "terminal_evidence / screenshot_evidence / playwright_report", "terminal evidence、failure screenshot、playwright_reportがそろっている。", "不足証跡を保存してverification commandへ戻す。"));
  }

  if (unsafeTokens.length > 0) {
    findings.push(makeFinding("local path / host / private network URL混入", sanitizeForPublic(unsafeTokens.join(" / ")), "critical", "publicNotes", "公開物にlocal path / host / private network URLが残らない。", "WORKSPACEまたはHOME表記へ置換し、doctor:aiddで再検査する。"));
  }

  return dedupeFindings(findings);
}

export function createRepairDeltas(commands: CommandDetail[]): RepairDelta[] {
  return commands
    .filter((command) => ["failed", "timeout", "evidence_missing"].includes(command.status))
    .map((command) => {
      const lane = command.status === "failed" ? "execute_now" : command.status === "timeout" ? "next_increment" : "learning_log";
      return {
        source_command: command.command,
        source_status: command.status,
        lane,
        ai_task_packet_delta: `${command.command}の${command.status}をAI Task Packet deltaへ追加し、artifact_path=${command.artifact_path}を参照する。`,
        codex_prompt_delta: `Codex prompt delta: ${command.repair_instruction} 修復後は${command.command}を再実行する。`,
        verification_command: command.command,
        rollback_condition: `${command.command}が同じ${command.status}で再発した場合は変更を小さく戻し、Review Recordへ差分理由を残す。`,
        learning_log_note: `${command.failure_category}をLearning Logへ記録し、次回のAI Task Packetで再発条件を先に確認する。`
      };
    });
}

export function narrowNextRepairDeltas(deltas: RepairDelta[]): RepairDelta[] {
  const executeNow = deltas.find((delta) => delta.lane === "execute_now");
  return executeNow ? [executeNow] : deltas.slice(0, 1);
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
