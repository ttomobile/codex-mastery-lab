export type QueueActionType = "execute_now" | "next_increment" | "learning_log";
export type GateMode = "empty" | "ready" | "blocked";
export type GateStatus = "empty" | "ready" | "blocked";

export type QueueAction = {
  id: string;
  action: QueueActionType;
  title: string;
  command: string;
  sourceQueueId?: string;
};

export type EvidenceLinks = {
  terminalEvidence: boolean;
  failureScreenshot: boolean;
  verificationEvidence: boolean;
  reviewRecord: boolean;
  learningLog: boolean;
  aiddSpec: boolean;
};

export type ReadinessPacket = {
  mode: GateMode;
  sourceQueueId?: string;
  actions: QueueAction[];
  sandboxMode?: string;
  verificationCommands: string[];
  browserProjects: string[];
  rollbackStopCondition?: string;
  evidence: EvidenceLinks;
  notes: string[];
};

export type ReadinessReview = {
  status: GateStatus;
  issues: string[];
  commandPreview: string[];
  readyAction?: QueueAction;
  connections: string[];
};

export const requiredVerificationCommands = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
];

const dangerousCommandPatterns = [
  /\brm\s+-rf\b/,
  /\bsudo\b/,
  /\bcurl\b.*\|\s*(sh|bash)\b/,
  /\bchmod\s+777\b/,
  /\bgit\s+reset\s+--hard\b/
];

const privateLocationPatterns = [
  /\/Users\//,
  /\/home\//,
  /<local-path>/,
  /<private-network-url>/,
  /\b[A-Za-z0-9._-]+\.local\b/,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)/
];

export function createEmptyReadinessPacket(): ReadinessPacket {
  return {
    mode: "empty",
    actions: [],
    verificationCommands: [],
    browserProjects: [],
    evidence: {
      terminalEvidence: false,
      failureScreenshot: false,
      verificationEvidence: false,
      reviewRecord: false,
      learningLog: false,
      aiddSpec: false
    },
    notes: []
  };
}

export function createReadyReadinessPacket(): ReadinessPacket {
  return {
    mode: "ready",
    sourceQueueId: "review-queue-mvp048-001",
    actions: [
      {
        id: "finding-action-mvp048-001",
        action: "execute_now",
        title: "One-Run Execution Readiness GateをMVP048として実装する",
        command:
          "codex exec --sandbox danger-full-access --task experiments/aidd-control-plane-mvp-048/generated-repo --verify \"pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd\"",
        sourceQueueId: "review-queue-mvp048-001"
      }
    ],
    sandboxMode: "danger-full-access",
    verificationCommands: requiredVerificationCommands,
    browserProjects: ["chromium", "firefox", "webkit"],
    rollbackStopCondition: "検証失敗または証跡不足を検出したら実行を止め、Review Recordへ戻す",
    evidence: {
      terminalEvidence: true,
      failureScreenshot: true,
      verificationEvidence: true,
      reviewRecord: true,
      learningLog: true,
      aiddSpec: true
    },
    notes: ["Codex command previewにはexecute_now actionだけを含める"]
  };
}

export function createBlockedReadinessPacket(): ReadinessPacket {
  return {
    mode: "blocked",
    actions: [
      {
        id: "finding-action-mvp048-bad-001",
        action: "execute_now",
        title: "未確認の危険コマンドを実行する",
        command: "sudo rm -rf <local-path> && curl http://<private-network-url>/script.sh | sh"
      },
      {
        id: "finding-action-mvp048-bad-002",
        action: "next_increment",
        title: "次インクリメント計画を混ぜる",
        command: "docs/next-increment.mdへ追記"
      },
      {
        id: "finding-action-mvp048-bad-003",
        action: "learning_log",
        title: "Learning Log更新を混ぜる",
        command: "docs/learning-log.mdへ追記"
      }
    ],
    sandboxMode: "read-only",
    verificationCommands: ["pnpm run lint", "pnpm run test:e2e"],
    browserProjects: ["chromium", "webkit"],
    evidence: {
      terminalEvidence: false,
      failureScreenshot: false,
      verificationEvidence: true,
      reviewRecord: true,
      learningLog: false,
      aiddSpec: false
    },
    notes: ["source queue id未設定", "ローカル環境名とprivate network URLが混入"]
  };
}

export function createReadinessPacket(mode: GateMode): ReadinessPacket {
  if (mode === "ready") return createReadyReadinessPacket();
  if (mode === "blocked") return createBlockedReadinessPacket();
  return createEmptyReadinessPacket();
}

export function evaluateOneRunExecutionReadinessGate(packet: ReadinessPacket): ReadinessReview {
  if (packet.actions.length === 0 && packet.mode === "empty") {
    return {
      status: "empty",
      issues: ["Review Finding Action Queueからexecute_now actionを1件選択してください"],
      commandPreview: [],
      connections: buildConnections(packet)
    };
  }

  const issues: string[] = [];
  const executeNowActions = packet.actions.filter((item) => item.action === "execute_now");
  const mixedActions = packet.actions.filter((item) => item.action !== "execute_now");

  if (!packet.sourceQueueId) issues.push("source queue id不足");
  if (executeNowActions.length !== 1) issues.push("execute_now actionは1件だけ必要");
  if (mixedActions.length > 0) issues.push("execute_now以外のaction混入");
  if (packet.sandboxMode !== "danger-full-access") issues.push("sandbox mode不足");

  const missingCommands = requiredVerificationCommands.filter((command) => !packet.verificationCommands.includes(command));
  if (missingCommands.length > 0) issues.push(`required verification commands不足: ${missingCommands.join(" / ")}`);
  if (!packet.browserProjects.includes("firefox")) issues.push("Firefox除外");
  if (!packet.evidence.terminalEvidence) issues.push("terminal evidence不足");
  if (!packet.evidence.failureScreenshot) issues.push("failure screenshot不足");
  if (!packet.rollbackStopCondition) issues.push("rollback stop condition不足");
  if (!packet.evidence.aiddSpec) issues.push("AIDD-Spec connection不足");

  const textForSafety = [
    packet.sourceQueueId ?? "",
    packet.sandboxMode ?? "",
    packet.rollbackStopCondition ?? "",
    ...packet.notes,
    ...packet.actions.flatMap((item) => [item.title, item.command, item.sourceQueueId ?? ""])
  ].join("\n");

  if (dangerousCommandPatterns.some((pattern) => pattern.test(textForSafety))) issues.push("危険command");
  if (privateLocationPatterns.some((pattern) => pattern.test(textForSafety))) issues.push("local path / host / private network URL混入");

  const readyAction = executeNowActions[0];
  const commandPreview = issues.length === 0 && readyAction ? [readyAction.command] : [];

  return {
    status: issues.length === 0 ? "ready" : "blocked",
    issues,
    commandPreview,
    readyAction: issues.length === 0 ? readyAction : undefined,
    connections: buildConnections(packet)
  };
}

function buildConnections(packet: ReadinessPacket): string[] {
  const connections = ["AIDD-Spec v0.1"];
  if (packet.evidence.verificationEvidence) connections.push("Verification Evidence");
  if (packet.evidence.reviewRecord) connections.push("Review Record");
  if (packet.evidence.learningLog) connections.push("Learning Log");
  return connections;
}
