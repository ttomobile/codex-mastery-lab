export type RuntimeMode = "empty" | "loading" | "success" | "error" | "offline" | "timeout";

export type PacketDraft = {
  projectName: string;
  userProblem: string;
  nonGoals: string[];
  successCriteria: string[];
  stateContract: string[];
  failureContract: string[];
  qualityGates: string[];
  reviewFindings: string[];
  remainingRisks: string[];
  whatWorked: string[];
  whatFailed: string[];
  specUpdatesNeeded: string[];
};

export type ValidationResult = {
  ready: boolean;
  missing: string[];
  warnings: string[];
};

export const requiredUiTokens = [
  "Dashboard",
  "Project Brief Builder",
  "AI Task Packet Builder",
  "Packet Preview",
  "Agent Runbook",
  "Review Dashboard",
  "Learning Log",
  "L3準備OK",
  "offline",
  "timeout",
  "外部API未接続",
  "ログイン不要",
  "課金機能は非ゴール"
] as const;

export const defaultQualityGates = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
] as const;

export const defaultDraft: PacketDraft = {
  projectName: "",
  userProblem: "",
  nonGoals: [],
  successCriteria: [],
  stateContract: ["empty", "loading", "success", "error", "offline", "timeout"],
  failureContract: ["api_failure", "auth_failure", "billing_failure"],
  qualityGates: [...defaultQualityGates],
  reviewFindings: [],
  remainingRisks: [],
  whatWorked: [],
  whatFailed: [],
  specUpdatesNeeded: []
};

const requiredStateContract = ["empty", "loading", "success", "error", "offline", "timeout"];

export function parseList(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function validatePacketCompleteness(draft: PacketDraft): ValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  if (!draft.projectName.trim()) missing.push("プロジェクト名");
  if (!draft.userProblem.trim()) missing.push("解く課題");
  if (draft.nonGoals.length === 0) missing.push("非ゴール");
  if (draft.successCriteria.length === 0) missing.push("成功条件");
  if (draft.qualityGates.length === 0) missing.push("quality gate");

  for (const state of requiredStateContract) {
    if (!draft.stateContract.includes(state)) {
      missing.push(`状態契約:${state}`);
    }
  }

  if (!draft.failureContract.includes("api_failure")) warnings.push("外部API未接続の明示が必要");
  if (!draft.failureContract.includes("auth_failure")) warnings.push("ログイン不要の明示が必要");
  if (!draft.failureContract.includes("billing_failure")) warnings.push("課金機能は非ゴールの明示が必要");

  return {
    ready: missing.length === 0 && warnings.length === 0,
    missing,
    warnings
  };
}

export function createPacketMarkdown(draft: PacketDraft): string {
  const list = (items: string[]) => (items.length > 0 ? items.map((item) => `    - "${item}"`).join("\n") : "    []");

  return [
    'spec_version: "AIDD-Spec v0.1"',
    'task_id: "aidd-control-plane-mvp-001"',
    'conformance_target: "L3"',
    "product_brief:",
    `  name: "${draft.projectName || "未入力"}"`,
    `  user_problem: "${draft.userProblem || "未入力"}"`,
    '  target_pattern: "AI駆動開発ワークフロー管理SaaSのローカルMVP"',
    "  non_goals:",
    list(draft.nonGoals),
    "experience_contract:",
    "  state_contract:",
    list(draft.stateContract),
    "  failure_contract:",
    list(draft.failureContract),
    "quality_gates:",
    "  required_commands:",
    list(draft.qualityGates),
    "review:",
    "  findings:",
    list(draft.reviewFindings),
    "learning_log:",
    "  what_worked:",
    list(draft.whatWorked),
    "  what_failed:",
    list(draft.whatFailed),
    "  spec_updates_needed:",
    list(draft.specUpdatesNeeded)
  ].join("\n");
}

export function generateRunbook(draft: PacketDraft): string {
  const project = draft.projectName.trim() || "AIDD Control Plane MVP";
  const gates = draft.qualityGates.length > 0 ? draft.qualityGates : [...defaultQualityGates];

  return [
    `# Agent Runbook: ${project}`,
    "",
    "1. AI Task Packetを読み、scopeと非ゴールを確認する。",
    "2. generated-repo/ の範囲だけを編集する。",
    "3. 実装後に次のquality gateを順番に実行する。",
    ...gates.map((gate, index) => `   ${index + 1}. ${gate}`),
    "4. Review Dashboardへfindingsとremaining risksを残す。",
    "5. Learning Logへ次回Spec改善点を戻す。",
    "",
    "codex exec --approval-policy never --sandbox danger-full-access \"AI_TASK_PACKET.mdを読み、AIDD-Spec L3として実装と検証を完了してください\""
  ].join("\n");
}

export function createEvidenceSummary(draft: PacketDraft, mode: RuntimeMode): string[] {
  return [
    `現在状態: ${mode}`,
    `Review findings: ${draft.reviewFindings.length}件`,
    `Remaining risks: ${draft.remainingRisks.length}件`,
    `Learning updates: ${draft.specUpdatesNeeded.length}件`
  ];
}
