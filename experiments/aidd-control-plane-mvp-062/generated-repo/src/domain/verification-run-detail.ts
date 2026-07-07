export type DecisionCase = "empty" | "valid" | "failure" | "decision_needed";
export type WorkspaceDecision = "empty" | "ready" | "blocked" | "decision_needed";
export type Severity = "critical" | "high" | "medium";
export type RepairDeltaDecision = "adopt" | "hold" | "reject" | "undecided";
export type DecisionLane = "adopt_now" | "hold_next_increment" | "reject_to_learning_log";

export type RepairDelta = {
  source_repair_delta_id: string;
  failure_category: string;
  ai_task_packet_delta: string;
  codex_prompt_delta: string;
  verification_command: string;
  rollback_condition: string;
  learning_log_note: string;
  browser_projects: string[];
};

export type RepairDeltaDecisionRecord = RepairDelta & {
  decision: RepairDeltaDecision;
  lane: DecisionLane;
  priority_reason: string;
  decision_owner: string;
  review_evidence: string;
  next_packet_section: string;
};

export type ReviewFinding = {
  category: string;
  finding: string;
  severity: Severity;
  observed_by: string;
  ideal_state: string;
  fix_instruction: string;
  needed_upstream_info: string[];
  standard_update: string;
  ai_task_packet_delta: string;
  codex_prompt_delta: string;
  verification_command: string;
};

export type DecisionInput = {
  caseName: DecisionCase;
  deltas: RepairDeltaDecisionRecord[];
  publicNotes: string[];
};

export type DecisionResult = {
  decision: WorkspaceDecision;
  decisions: RepairDeltaDecisionRecord[];
  findings: ReviewFinding[];
  adoptedPacketPatch: string;
  codexPromptPreview: string;
  learningLogReturn: string[];
  sanitizedPreview: string;
};

export const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;
export const requiredScreenshots = [
  "artifacts/screenshots/aidd-control-plane-mvp062-empty.png",
  "artifacts/screenshots/aidd-control-plane-mvp062-valid.png",
  "artifacts/screenshots/aidd-control-plane-mvp062-failure.png",
  "artifacts/screenshots/aidd-control-plane-mvp062-decision-needed.png",
  "artifacts/screenshots/aidd-control-plane-mvp062-terminal-evidence.png"
] as const;

const unsafeLocationPatterns = [
  /\/Users\/[^\s"'<>]+/g,
  /\/home\/[^\s"'<>]+/g,
  /\b[A-Za-z0-9._-]+\.local\b/g,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g
];

const baseDelta: RepairDelta = {
  source_repair_delta_id: "MVP062-REPAIR-DELTA-001",
  failure_category: "3ブラウザE2E失敗",
  ai_task_packet_delta: "PlaywrightのChromium / Firefox / WebKitを維持したまま、失敗したE2E待機条件だけを修正する。",
  codex_prompt_delta: "Firefoxを除外せず、表示完了の待機条件とexpect timeoutを安定化してください。修正後はpnpm run test:e2eを3ブラウザで再実行してください。",
  verification_command: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd",
  rollback_condition: "Firefox除外、未採用delta混入、またはterminal/failure screenshot不足が出たら停止して前回差分へ戻す。",
  learning_log_note: "timeoutは失敗ログの赤字だけでなく、次回AI Task Packetの待機条件として戻す。",
  browser_projects: ["Chromium", "Firefox", "WebKit"]
};

const evidenceDelta: RepairDelta = {
  source_repair_delta_id: "MVP062-REPAIR-DELTA-002",
  failure_category: "terminal/failure screenshot不足",
  ai_task_packet_delta: "empty / valid / failure / terminal evidence画像を必須証跡として保存する。",
  codex_prompt_delta: "capture scriptでMVP062の4状態とterminal evidenceを保存し、doctor:aiddで証跡名を確認してください。",
  verification_command: "pnpm run capture:mvp062 && pnpm run doctor:aidd",
  rollback_condition: "公開記事にlocal path、host、private network URLが混ざったら公開前に停止する。",
  learning_log_note: "証跡不足は後処理ではなくAI Task Packetの受け入れ条件へ戻す。",
  browser_projects: ["Chromium", "Firefox", "WebKit"]
};

export function createDecisionInput(caseName: DecisionCase): DecisionInput {
  if (caseName === "empty") return { caseName, deltas: [], publicNotes: [] };

  if (caseName === "failure") {
    return {
      caseName,
      deltas: [
        {
          ...baseDelta,
          decision: "undecided",
          lane: "adopt_now",
          priority_reason: "",
          decision_owner: "",
          review_evidence: "",
          rollback_condition: "",
          browser_projects: ["Chromium", "WebKit"],
          next_packet_section: "AI_TASK_PACKET.md#未判断"
        },
        {
          ...evidenceDelta,
          decision: "hold",
          lane: "adopt_now",
          priority_reason: "証跡不足だが未採用deltaがpromptへ混入している",
          decision_owner: "AIDD Control Plane",
          review_evidence: "",
          next_packet_section: "CODEX_PROMPT.md#混入"
        }
      ],
      publicNotes: ["/Users/example/private/mvp062.txt", "http://10.0.0.62:3062/internal", "mvp062-workstation.local"]
    };
  }

  if (caseName === "decision_needed") {
    return {
      caseName,
      deltas: [
        {
          ...baseDelta,
          decision: "adopt",
          lane: "adopt_now",
          priority_reason: "3ブラウザE2E失敗は次の1回で直す価値が高い",
          decision_owner: "AIDD Control Plane cron",
          review_evidence: "artifacts/screenshots/aidd-control-plane-mvp062-failure.png",
          next_packet_section: "AI_TASK_PACKET.md#今回の修正delta"
        },
        {
          ...evidenceDelta,
          decision: "hold",
          lane: "hold_next_increment",
          priority_reason: "画像証跡は今回の実装後に再確認する",
          decision_owner: "AIDD Control Plane cron",
          review_evidence: "artifacts/screenshots/aidd-control-plane-mvp062-valid.png",
          next_packet_section: "LEARNING_LOG.md#次回送り"
        }
      ],
      publicNotes: ["WORKSPACE表記へsanitize済み"]
    };
  }

  return {
    caseName,
    deltas: [
      {
        ...baseDelta,
        decision: "adopt",
        lane: "adopt_now",
        priority_reason: "失敗したE2Eを次回Codex実行で最優先にする",
        decision_owner: "AIDD Control Plane cron",
        review_evidence: "artifacts/terminal/test-e2e.txt",
        next_packet_section: "AI_TASK_PACKET.md#採用済みrepair-delta"
      },
      {
        ...evidenceDelta,
        decision: "reject",
        lane: "reject_to_learning_log",
        priority_reason: "今回はE2E修正に絞るためLearning Logへ戻す",
        decision_owner: "AIDD Control Plane cron",
        review_evidence: "artifacts/screenshots/aidd-control-plane-mvp062-valid.png",
        next_packet_section: "LEARNING_LOG.md#再発防止"
      }
    ],
    publicNotes: ["WORKSPACE表記へsanitize済み"]
  };
}

export function evaluateDecisionWorkspace(input: DecisionInput): DecisionResult {
  if (input.deltas.length === 0) {
    return { decision: "empty", decisions: [], findings: [], adoptedPacketPatch: "", codexPromptPreview: "", learningLogReturn: [], sanitizedPreview: "" };
  }
  const unsafeTokens = detectUnsafePublicTokens(input.publicNotes.join("\n"));
  const findings = createReviewFindings(input.deltas, unsafeTokens);
  if (findings.length > 0) {
    return {
      decision: "blocked",
      decisions: input.deltas,
      findings,
      adoptedPacketPatch: "",
      codexPromptPreview: "",
      learningLogReturn: [],
      sanitizedPreview: sanitizeForPublic(input.publicNotes.join("\n"))
    };
  }
  const adopted = input.deltas.filter((delta) => delta.decision === "adopt" && delta.lane === "adopt_now").slice(0, 2);
  const returned = input.deltas.filter((delta) => delta.decision !== "adopt" || delta.lane !== "adopt_now").map((delta) => `${delta.source_repair_delta_id}: ${delta.learning_log_note}`);
  return {
    decision: input.caseName === "decision_needed" ? "decision_needed" : "ready",
    decisions: input.deltas,
    findings: [],
    adoptedPacketPatch: adopted.map((delta) => `- ${delta.source_repair_delta_id} / ${delta.next_packet_section}: ${delta.ai_task_packet_delta}`).join("\n"),
    codexPromptPreview: adopted.map((delta) => delta.codex_prompt_delta).join("\n\n"),
    learningLogReturn: returned,
    sanitizedPreview: sanitizeForPublic(input.publicNotes.join("\n"))
  };
}

function createReviewFindings(deltas: RepairDeltaDecisionRecord[], unsafeTokens: string[]): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  const add = (category: string, finding: string, severity: Severity = "high") => findings.push({
    category,
    finding,
    severity,
    observed_by: "decision workspace / doctor:aidd / UI test",
    ideal_state: "採用 / 保留 / 却下の判断理由、証跡、rollback、3ブラウザ条件がそろい、採用済みdeltaだけが次回promptへ進む。",
    fix_instruction: `${category}を解消してから次回AI Task Packetへ進める。`,
    needed_upstream_info: ["Review Record", "Verification Evidence", "Learning Log", "AI Task Packet"],
    standard_update: "standards/aidd-control-plane-mvp-v0.1.md#Repair Delta Priority Decision Workspace",
    ai_task_packet_delta: `${category}をAI Task Packetの受け入れ条件へ追加する。`,
    codex_prompt_delta: `${category}を解消し、Chromium / Firefox / WebKitを維持して再検証する。`,
    verification_command: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd"
  });

  if (deltas.some((delta) => delta.decision === "undecided")) add("未判断", "repair deltaに採用 / 保留 / 却下の判断がない。");
  if (deltas.some((delta) => delta.priority_reason.length === 0)) add("理由不足", "priority_reasonが空のdeltaがある。");
  if (deltas.some((delta) => delta.review_evidence.length === 0)) add("証跡不足", "review_evidenceが空のdeltaがある。");
  if (deltas.some((delta) => delta.rollback_condition.length === 0)) add("rollback不足", "rollback_conditionが空のdeltaがある。");
  if (deltas.some((delta) => !requiredBrowsers.every((browser) => delta.browser_projects.includes(browser)))) add("Firefox除外", "Chromium / Firefox / WebKitのいずれかが欠けている。", "critical");
  if (deltas.some((delta) => delta.decision !== "adopt" && delta.lane === "adopt_now")) add("未採用delta混入", "保留または却下deltaがadopt_now laneへ混入している。", "critical");
  if (unsafeTokens.length > 0) add("local path / host / private network URL混入", "公開前メモにlocal path、host、private network URLが含まれる。", "critical");
  return findings;
}

export function detectUnsafePublicTokens(text: string): string[] {
  return unsafeLocationPatterns.flatMap((pattern) => text.match(pattern) ?? []);
}

export function sanitizeForPublic(text: string): string {
  return unsafeLocationPatterns.reduce((current, pattern) => current.replace(pattern, "WORKSPACE/private-url"), text);
}
