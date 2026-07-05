export type BudgetMode = "empty" | "ready" | "failure";
export type GateStatus = "empty" | "go" | "stop";

export type CodexRunBudget = {
  mode: BudgetMode;
  sourcePacketId: string;
  acceptedRepairDelta: string;
  primaryUsagePercent: number | null;
  secondaryUsagePercent: number | null;
  maxRuntimeMinutes: number | null;
  stopCondition: string;
  fallbackAction: string;
  verificationCommands: string[];
  browserProjects: string[];
  codexPromptPatch: string;
  verificationEvidenceConnection: string;
  reviewRecordConnection: string;
  learningLogConnection: string;
  maintenanceRunbookConnection: string;
  aiddSpecConnection: string;
  unsafeSample?: string;
};

export type BudgetReview = {
  status: GateStatus;
  issues: string[];
  promptPreview: string[];
  publishBlockReasons: string[];
  usageBand: "none" | "go" | "brake" | "stop";
};

export const requiredBudgetFields = [
  "source packet id",
  "accepted repair delta",
  "primary usage",
  "secondary usage",
  "max runtime minutes",
  "stop condition",
  "fallback action",
  "verification commands",
  "Chromium / Firefox / WebKit",
  "Verification Evidence接続",
  "Review Record接続",
  "Learning Log接続",
  "Maintenance Runbook接続",
  "AIDD-Spec接続"
];

const privateLocationPatterns = [
  /\/Users\//,
  /\/home\//,
  /<home>/,
  /<host>/,
  /\b[A-Za-z0-9._-]+\.local\b/,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)/
];

export function createEmptyBudget(): CodexRunBudget {
  return {
    mode: "empty",
    sourcePacketId: "未選択",
    acceptedRepairDelta: "",
    primaryUsagePercent: null,
    secondaryUsagePercent: null,
    maxRuntimeMinutes: null,
    stopCondition: "",
    fallbackAction: "",
    verificationCommands: [],
    browserProjects: [],
    codexPromptPatch: "",
    verificationEvidenceConnection: "",
    reviewRecordConnection: "",
    learningLogConnection: "",
    maintenanceRunbookConnection: "",
    aiddSpecConnection: ""
  };
}

export function createReadyBudget(): CodexRunBudget {
  return {
    mode: "ready",
    sourcePacketId: "ATP-MVP052-RUN-BUDGET-GATE",
    acceptedRepairDelta: "RD-051-FX-TIMEOUTを小さな1インクリメントとして実行する",
    primaryUsagePercent: 64,
    secondaryUsagePercent: 71,
    maxRuntimeMinutes: 35,
    stopCondition: "lint/typecheck/test/build/e2e/doctor:aiddのいずれかが2回連続で同じ原因に失敗したら停止し、Repair Deltaへ戻す",
    fallbackAction: "Codexを開始せず、AI Task Packetを縮小して次回cronへ回す。必要なら手動でdoctor:aiddだけ実行する",
    verificationCommands: [
      "pnpm run lint",
      "pnpm run typecheck",
      "pnpm run test",
      "pnpm run build",
      "pnpm run test:e2e",
      "pnpm run doctor:aidd"
    ],
    browserProjects: ["chromium", "firefox", "webkit"],
    codexPromptPatch: "go: 採用済みdeltaだけをCodexへ渡す。max_runtime=35分、停止条件を満たしたら実装を止めてVerification Evidenceへ記録する。",
    verificationEvidenceConnection: "Verification Evidence: usage band、実行可否、コマンド別exit code、3ブラウザ結果を保存する",
    reviewRecordConnection: "Review Record: go判断、利用枠、停止条件、fallback actionを残す",
    learningLogConnection: "Learning Log: 利用枠が高い時にpacketを縮小したかを記録する",
    maintenanceRunbookConnection: "Maintenance Runbook: 長時間ループと利用枠過多の停止手順へ接続する",
    aiddSpecConnection: "AIDD-Spec v0.1: AI Task Packet / Verification Evidence / Review Record / Learning Log / Maintenance Runbook"
  };
}

export function createFailureBudget(): CodexRunBudget {
  return {
    mode: "failure",
    sourcePacketId: "ATP-MVP052-DRAFT",
    acceptedRepairDelta: "RD-051-DRAFT",
    primaryUsagePercent: 97,
    secondaryUsagePercent: 94,
    maxRuntimeMinutes: 0,
    stopCondition: "",
    fallbackAction: "",
    verificationCommands: ["pnpm run test:e2e"],
    browserProjects: ["chromium", "webkit"],
    codexPromptPatch: "stop条件なしで全部Codexへ渡す危険なprompt",
    verificationEvidenceConnection: "",
    reviewRecordConnection: "",
    learningLogConnection: "",
    maintenanceRunbookConnection: "",
    aiddSpecConnection: "",
    unsafeSample: "/Users/example/project と http://127.0.0.1:3020/report を含む危険サンプル"
  };
}

export function createBudget(mode: BudgetMode): CodexRunBudget {
  if (mode === "ready") return createReadyBudget();
  if (mode === "failure") return createFailureBudget();
  return createEmptyBudget();
}

export function evaluateBudgetGate(budget: CodexRunBudget): BudgetReview {
  if (budget.mode === "empty") {
    return {
      status: "empty",
      issues: ["実行候補packet未選択: Codexを開始できません"],
      promptPreview: [],
      publishBlockReasons: [],
      usageBand: "none"
    };
  }

  const issues: string[] = [];
  if (!budget.sourcePacketId || budget.sourcePacketId === "未選択") issues.push("source packet id不足");
  if (!budget.acceptedRepairDelta) issues.push("採用済みrepair delta不足");
  if (budget.primaryUsagePercent === null || budget.primaryUsagePercent >= 90) issues.push("primary usage過多");
  if (budget.secondaryUsagePercent === null || budget.secondaryUsagePercent >= 92) issues.push("secondary usage過多");
  if (!budget.maxRuntimeMinutes || budget.maxRuntimeMinutes < 10) issues.push("max runtime不足");
  if (!budget.stopCondition) issues.push("停止条件不足");
  if (!budget.fallbackAction) issues.push("fallback action不足");
  for (const command of ["pnpm run lint", "pnpm run typecheck", "pnpm run test", "pnpm run build", "pnpm run test:e2e", "pnpm run doctor:aidd"]) {
    if (!budget.verificationCommands.includes(command)) issues.push(`検証コマンド不足: ${command}`);
  }
  if (!budget.browserProjects.includes("firefox")) issues.push("Firefox除外");
  if (!budget.verificationEvidenceConnection) issues.push("Verification Evidence接続不足");
  if (!budget.reviewRecordConnection) issues.push("Review Record接続不足");
  if (!budget.learningLogConnection) issues.push("Learning Log接続不足");
  if (!budget.maintenanceRunbookConnection) issues.push("Maintenance Runbook接続不足");
  if (!budget.aiddSpecConnection) issues.push("AIDD-Spec接続不足");
  if (containsPrivateLocation(budget)) issues.push("local path / host / private network URL混入");

  const uniqueIssues = Array.from(new Set(issues));
  const usageBand = calculateUsageBand(budget.primaryUsagePercent, budget.secondaryUsagePercent);
  return {
    status: uniqueIssues.length === 0 && usageBand === "go" ? "go" : "stop",
    issues: uniqueIssues,
    promptPreview: uniqueIssues.length === 0 ? [budget.codexPromptPatch] : [],
    publishBlockReasons: containsPrivateLocation(budget)
      ? ["公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています"]
      : [],
    usageBand
  };
}

function calculateUsageBand(primary: number | null, secondary: number | null): BudgetReview["usageBand"] {
  if (primary === null || secondary === null) return "none";
  if (primary >= 96 || secondary >= 97) return "stop";
  if (primary >= 90 || secondary >= 92) return "brake";
  return "go";
}

function containsPrivateLocation(value: unknown): boolean {
  return privateLocationPatterns.some((pattern) => pattern.test(JSON.stringify(value)));
}
