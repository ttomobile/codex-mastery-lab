export type PlannerCase = "empty" | "valid" | "failure" | "evidence_missing";
export type PlannerDecision = "empty" | "ready" | "blocked" | "evidence_missing";
export type Severity = "critical" | "high" | "medium";

export type AiddSpecConnection = {
  id: string;
  label: string;
  status: "connected" | "missing";
};

export type CodexPromptDraft = {
  mode: "execute_now" | "plan_only" | "research_only";
  prompt: string;
};

export type NextIncrementPlan = {
  source_review_id: string;
  source_run_id: string;
  recommended_increment: string;
  priority_reason: string;
  target_artifacts: string[];
  acceptance_criteria: string[];
  verification_commands: string[];
  required_evidence: string[];
  codex_prompt_draft: CodexPromptDraft[];
  rollback_condition: string;
  note_article_angle: string;
  learning_log_connection: string;
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

export type NextIncrementPlannerInput = {
  caseName: PlannerCase;
  sourceReviewId: string;
  sourceRunId: string;
  sourceReviewSummary: string;
  prioritySignals: string[];
  browserCoverage: string[];
  terminalEvidence: string[];
  screenshotEvidence: string[];
  rollbackCondition: string;
  publicNotes: string[];
  candidatePlan: NextIncrementPlan | null;
};

export type EvidenceRepairIncrement = {
  recommended_increment: string;
  priority_reason: string;
  target_artifacts: string[];
  acceptance_criteria: string[];
  verification_commands: string[];
  required_evidence: string[];
  codex_prompt_draft: CodexPromptDraft[];
  rollback_condition: string;
};

export type PlannerResult = {
  decision: PlannerDecision;
  plan: NextIncrementPlan | null;
  findings: ReviewFinding[];
  evidenceRepairIncrement: EvidenceRepairIncrement | null;
  unsafeTokens: string[];
  sanitizedPreview: string;
};

export const planFields = [
  "source_review_id",
  "source_run_id",
  "recommended_increment",
  "priority_reason",
  "target_artifacts",
  "acceptance_criteria",
  "verification_commands",
  "required_evidence",
  "codex_prompt_draft",
  "rollback_condition",
  "note_article_angle",
  "learning_log_connection",
  "aidd_spec_connections"
] as const;

export const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;
export const requiredScreenshots = [
  "artifacts/screenshots/aidd-control-plane-mvp059-empty.png",
  "artifacts/screenshots/aidd-control-plane-mvp059-valid.png",
  "artifacts/screenshots/aidd-control-plane-mvp059-failure.png",
  "artifacts/screenshots/aidd-control-plane-mvp059-evidence-missing.png"
] as const;
export const requiredTerminalEvidence = "artifacts/screenshots/aidd-control-plane-mvp059-terminal-evidence.png";
export const requiredFailureScreenshot = "artifacts/screenshots/aidd-control-plane-mvp059-failure.png";

const unsafeLocationPatterns = [
  /\/Users\/[^\s"'<>]+/g,
  /\/home\/[^\s"'<>]+/g,
  /\b[A-Za-z0-9._-]+\.local\b/g,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g
];

const readyPlan: NextIncrementPlan = {
  source_review_id: "MVP058-REVIEW-READY-001",
  source_run_id: "MVP058-CODEX-RUN-REVIEW-001",
  recommended_increment: "証跡をそろえた次の1インクリメントを実行し、計画から実装確認までを1往復で閉じる。",
  priority_reason: "source reviewが十分で、優先度、3ブラウザE2E、terminal evidence、screenshot evidence、rollback条件、公開前sanitizeがそろっているため、次の実装へ進める。",
  target_artifacts: [
    "docs/product-brief.md",
    "src/domain/next-increment-planner.ts",
    "app/page.tsx",
    "tests/next-increment-planner.test.ts",
    "e2e/next-increment-planner.spec.ts",
    "artifacts/screenshots/"
  ],
  acceptance_criteria: [
    "UIは日本語でempty / valid / failure / evidence_missingを切り替えられる。",
    "validではsource_review_idからaidd_spec_connectionsまでの必須項目をすべて表示する。",
    "Chromium / Firefox / WebKitの3ブラウザE2Eをrequired_evidenceと照合できる。",
    "codex_prompt_draftはmode=execute_nowの1件だけを保持する。",
    "local path/private host/private network URLを公開用表記へ置換できる。"
  ],
  verification_commands: [
    "pnpm run lint",
    "pnpm run typecheck",
    "pnpm run test",
    "pnpm run build",
    "pnpm run test:e2e",
    "pnpm run doctor:aidd"
  ],
  required_evidence: [
    requiredTerminalEvidence,
    ...requiredScreenshots,
    "playwright-report/index.html",
    "test-results/"
  ],
  codex_prompt_draft: [
    {
      mode: "execute_now",
      prompt: "AIDD Control Plane MVP059のNext Increment Plannerをfixture駆動で実装し、ready判定では次の1インクリメントだけを提示してください。実装後はlint/typecheck/test/build/e2e/doctor:aiddを実行し、terminal evidenceと4状態screenshotを保存してください。"
    }
  ],
  rollback_condition: "source review不足、優先度不足、3ブラウザE2E不足、terminal/failure screenshot不足、rollback不足、公開不可token混入のいずれかを検出したらblockedへ戻す。",
  note_article_angle: "MVP058のReview Recordから、MVP059では次に実行する1インクリメントへ絞り込む流れを書く。",
  learning_log_connection: "Learning Logには、証跡不足を最優先で直すと次のAI Task Packetが小さく安定する、という学びを接続する。",
  aidd_spec_connections: [
    { id: "aidd-spec-v0.1", label: "AIDD-Spec v0.1", status: "connected" },
    { id: "control-plane-next-increment", label: "Next Increment Planner", status: "connected" },
    { id: "mvp058-review-record", label: "MVP058 Review Record", status: "connected" },
    { id: "learning-log", label: "Learning Log", status: "connected" }
  ]
};

export function createNextIncrementPlannerInput(caseName: PlannerCase): NextIncrementPlannerInput {
  const base = {
    caseName,
    sourceReviewId: readyPlan.source_review_id,
    sourceRunId: readyPlan.source_run_id,
    sourceReviewSummary: "MVP058のsource reviewは次の1インクリメントを選べる粒度で完了している。",
    prioritySignals: ["証跡修復より実装前進が優先", "公開前sanitize確認済み"],
    browserCoverage: [...requiredBrowsers],
    terminalEvidence: [requiredTerminalEvidence],
    screenshotEvidence: [...requiredScreenshots],
    rollbackCondition: readyPlan.rollback_condition,
    publicNotes: ["WORKSPACE表記へsanitize済み"],
    candidatePlan: readyPlan
  } satisfies NextIncrementPlannerInput;

  if (caseName === "empty") {
    return {
      ...base,
      sourceReviewId: "",
      sourceRunId: "",
      sourceReviewSummary: "",
      prioritySignals: [],
      browserCoverage: [],
      terminalEvidence: [],
      screenshotEvidence: [],
      rollbackCondition: "",
      publicNotes: [],
      candidatePlan: null
    };
  }

  if (caseName === "failure") {
    return {
      ...base,
      sourceReviewSummary: "",
      prioritySignals: [],
      browserCoverage: ["Chromium"],
      terminalEvidence: [],
      screenshotEvidence: [
        "artifacts/screenshots/aidd-control-plane-mvp059-valid.png",
        "artifacts/screenshots/aidd-control-plane-mvp059-evidence-missing.png"
      ],
      rollbackCondition: "",
      publicNotes: [
        "/Users/example/private/mvp059-review.md",
        "http://10.0.0.59:3059/internal",
        "mvp059-workstation.local"
      ],
      candidatePlan: {
        ...readyPlan,
        priority_reason: "",
        rollback_condition: "",
        required_evidence: ["artifacts/screenshots/aidd-control-plane-mvp059-valid.png"]
      }
    };
  }

  if (caseName === "evidence_missing") {
    return {
      ...base,
      terminalEvidence: [],
      screenshotEvidence: ["artifacts/screenshots/aidd-control-plane-mvp059-valid.png"],
      candidatePlan: {
        ...readyPlan,
        priority_reason: "実装へ進む前に証跡不足を直す必要がある。",
        recommended_increment: "不足証跡の回収を最優先インクリメントとして実行する。"
      }
    };
  }

  return base;
}

export function planNextIncrement(input: NextIncrementPlannerInput): PlannerResult {
  if (input.sourceReviewId.trim() === "" || input.candidatePlan === null) {
    return {
      decision: "empty",
      plan: null,
      findings: [],
      evidenceRepairIncrement: null,
      unsafeTokens: [],
      sanitizedPreview: ""
    };
  }

  const unsafeTokens = detectUnsafePublicTokens(input);
  const findings = createReviewFindings(input, unsafeTokens);
  if (findings.length > 0) {
    return {
      decision: "blocked",
      plan: null,
      findings,
      evidenceRepairIncrement: null,
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.publicNotes.join("\n"))
    };
  }

  const missingEvidence = findMissingEvidence(input);
  if (missingEvidence.length > 0) {
    return {
      decision: "evidence_missing",
      plan: null,
      findings: [],
      evidenceRepairIncrement: createEvidenceRepairIncrement(missingEvidence),
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.publicNotes.join("\n"))
    };
  }

  return {
    decision: "ready",
    plan: sanitizePlan(input.candidatePlan),
    findings: [],
    evidenceRepairIncrement: null,
    unsafeTokens,
    sanitizedPreview: sanitizeForPublic(input.publicNotes.join("\n"))
  };
}

export function createReviewFindings(input: NextIncrementPlannerInput, unsafeTokens = detectUnsafePublicTokens(input)): ReviewFinding[] {
  const findings: ReviewFinding[] = [];

  if (input.sourceReviewSummary.trim() === "") {
    findings.push(makeFinding("source review不足", "source reviewの要約が空で、次の1インクリメントを選べません。", "critical", "source_review_id", "source reviewが次の作業単位と根拠を説明している。", "source review要約を追加し、AI Task Packet deltaへ戻す。"));
  }

  if (input.prioritySignals.length === 0 || input.candidatePlan?.priority_reason.trim() === "") {
    findings.push(makeFinding("priority不足", "priority_reasonまたは優先度シグナルが不足しています。", "high", "priority_reason", "なぜ今この1インクリメントを選ぶかが説明されている。", "priority_reasonを補い、Codex prompt deltaへ反映する。"));
  }

  const missingBrowsers = requiredBrowsers.filter((browser) => !input.browserCoverage.includes(browser));
  if (missingBrowsers.length > 0) {
    findings.push(makeFinding("3ブラウザE2E不足", `${missingBrowsers.join(" / ")}のE2E結果がありません。`, "high", "browserCoverage", "Chromium / Firefox / WebKitの3ブラウザE2Eがそろっている。", "Playwrightの3ブラウザ設定で再実行し、verification commandへ戻す。"));
  }

  if (input.caseName === "failure" && (!input.terminalEvidence.includes(requiredTerminalEvidence) || !input.screenshotEvidence.includes(requiredFailureScreenshot))) {
    findings.push(makeFinding("terminal/failure screenshot不足", "terminal evidenceまたはfailure screenshotが不足しています。", "high", "required_evidence", "terminal evidenceとfailure screenshotがrequired_evidenceに残っている。", "capture:mvp059を実行し、AI Task Packet deltaへ不足証跡を戻す。"));
  }

  if (input.rollbackCondition.trim() === "" || input.candidatePlan?.rollback_condition.trim() === "") {
    findings.push(makeFinding("rollback不足", "rollback_conditionが空で、停止条件がありません。", "high", "rollback_condition", "blockedへ戻す条件と戻し先が明記されている。", "rollback_conditionを補い、Codex prompt deltaへ反映する。"));
  }

  if (unsafeTokens.length > 0) {
    findings.push(makeFinding("local path/private host/private network URL混入", sanitizeForPublic(unsafeTokens.join(" / ")), "critical", "publicNotes", "公開物にlocal path/private host/private network URLが残らない。", "WORKSPACEまたはHOME表記へ置換し、verification commandで再検査する。"));
  }

  return findings;
}

export function findMissingEvidence(input: NextIncrementPlannerInput): string[] {
  const required = [requiredTerminalEvidence, ...requiredScreenshots];
  return required.filter((item) => !input.terminalEvidence.includes(item) && !input.screenshotEvidence.includes(item));
}

export function createEvidenceRepairIncrement(missingEvidence: string[]): EvidenceRepairIncrement {
  return {
    recommended_increment: "証跡不足の修復インクリメントを最優先で実行する。",
    priority_reason: "terminal evidenceと4状態screenshotが欠けると、次の実装判断と記事化に進めないため。",
    target_artifacts: missingEvidence,
    acceptance_criteria: [
      "不足しているterminal evidenceとscreenshotをartifacts/screenshots/へ保存する。",
      "AI Task Packet delta、Codex prompt delta、verification commandへ不足証跡の回収手順を戻す。"
    ],
    verification_commands: ["pnpm run capture:mvp059", "pnpm run doctor:aidd"],
    required_evidence: missingEvidence,
    codex_prompt_draft: [
      {
        mode: "execute_now",
        prompt: "不足しているMVP059のterminal evidenceと4状態screenshotを生成し、doctor:aiddで証跡名、3ブラウザ、rollback、AIDD-Spec接続、公開不可token検出を確認してください。"
      }
    ],
    rollback_condition: "証跡が1つでも不足する場合は実装インクリメントへ進めず、evidence_missingへ戻す。"
  };
}

function sanitizePlan(plan: NextIncrementPlan): NextIncrementPlan {
  return {
    ...plan,
    source_review_id: sanitizeForPublic(plan.source_review_id),
    source_run_id: sanitizeForPublic(plan.source_run_id),
    recommended_increment: sanitizeForPublic(plan.recommended_increment),
    priority_reason: sanitizeForPublic(plan.priority_reason),
    target_artifacts: plan.target_artifacts.map(sanitizeForPublic),
    acceptance_criteria: plan.acceptance_criteria.map(sanitizeForPublic),
    verification_commands: plan.verification_commands.map(sanitizeForPublic),
    required_evidence: plan.required_evidence.map(sanitizeForPublic),
    codex_prompt_draft: plan.codex_prompt_draft.filter((draft) => draft.mode === "execute_now").map((draft) => ({
      mode: draft.mode,
      prompt: sanitizeForPublic(draft.prompt)
    })),
    rollback_condition: sanitizeForPublic(plan.rollback_condition),
    note_article_angle: sanitizeForPublic(plan.note_article_angle),
    learning_log_connection: sanitizeForPublic(plan.learning_log_connection),
    aidd_spec_connections: plan.aidd_spec_connections
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
    ai_task_packet_delta: `${category}をAI Task Packet deltaへ戻し、次の作業単位に必要な入力を明記する。`,
    codex_prompt_delta: `${category}を解消するまでexecute_nowのpromptを1件に絞り、修復後にready判定へ戻す。`,
    verification_command: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run test:e2e && pnpm run doctor:aidd"
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
