export type DetailMode = "empty" | "ready" | "failure";
export type ReviewStatus = DetailMode;

export type CommandName = "lint" | "typecheck" | "test" | "build" | "test:e2e" | "doctor:aidd";

export type CommandDetail = {
  commandName: CommandName;
  command: string;
  exitCode?: number;
  duration: string;
  terminalLogPath: string;
  artifactPath?: string;
  failureCategory?: string;
  repairInstruction?: string;
};

export type EvidenceFlags = {
  terminal: boolean;
  emptyScreenshot: boolean;
  readyScreenshot: boolean;
  failureScreenshot: boolean;
};

export type Connections = {
  aiddSpec: boolean;
  verificationEvidence: boolean;
  reviewRecord: boolean;
  learningLog: boolean;
};

export type VerificationRunPacket = {
  mode: DetailMode;
  sourceQueueItem?: string;
  sourceRunStatus?: string;
  commitSha?: string;
  commandDetails: CommandDetail[];
  browserCoverage: string[];
  evidence: EvidenceFlags;
  connections: Connections;
  reviewFindingDraft: {
    failureCategory?: string;
    idealState: string;
    repairInstruction?: string;
    upstreamInformation: string[];
    verificationCommands: string[];
  };
  notes: string[];
  unsafeLocationDetected: boolean;
};

export type VerificationRunReview = {
  status: ReviewStatus;
  issues: string[];
  readyDetails: CommandDetail[];
  connectedTo: string[];
  reviewFindingDraft: {
    failureCategory: string;
    idealState: string;
    repairInstruction: string;
    upstreamInformation: string[];
    verificationCommands: string[];
  };
};

export const requiredCommands: CommandName[] = ["lint", "typecheck", "test", "build", "test:e2e", "doctor:aidd"];

const requiredVerificationCommands = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
];

const privateLocationPatterns = [
  /\/Users\//,
  /\/home\//,
  /<local-path>/,
  /<host>/,
  /\b[A-Za-z0-9._-]+\.local\b/,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)/
];

export function createEmptyVerificationRunPacket(): VerificationRunPacket {
  return {
    mode: "empty",
    commandDetails: [],
    browserCoverage: [],
    evidence: {
      terminal: false,
      emptyScreenshot: false,
      readyScreenshot: false,
      failureScreenshot: false
    },
    connections: {
      aiddSpec: false,
      verificationEvidence: false,
      reviewRecord: false,
      learningLog: false
    },
    reviewFindingDraft: {
      idealState: "Codex Run Queueの1件からcommand別Verification Run Detailを作成する",
      upstreamInformation: ["source queue item", "source run status", "commit SHA", "command別証跡"],
      verificationCommands: requiredVerificationCommands
    },
    notes: [],
    unsafeLocationDetected: false
  };
}

export function createReadyVerificationRunPacket(): VerificationRunPacket {
  return {
    mode: "ready",
    sourceQueueItem: "codex-run-queue-mvp049-001",
    sourceRunStatus: "success",
    commitSha: "8f4c2a9d31b6",
    commandDetails: requiredCommands.map((commandName, index) => ({
      commandName,
      command: `pnpm run ${commandName}`,
      exitCode: 0,
      duration: ["4.2s", "5.8s", "7.1s", "18.4s", "41.6s", "2.0s"][index],
      terminalLogPath: `artifacts/terminal/mvp049-${commandName.replace(":", "-")}.txt`,
      artifactPath: `artifacts/verification/mvp049-${commandName.replace(":", "-")}.json`,
      failureCategory: "なし",
      repairInstruction: "追加修正なし"
    })),
    browserCoverage: ["Chromium", "Firefox", "WebKit"],
    evidence: {
      terminal: true,
      emptyScreenshot: true,
      readyScreenshot: true,
      failureScreenshot: true
    },
    connections: {
      aiddSpec: true,
      verificationEvidence: true,
      reviewRecord: true,
      learningLog: true
    },
    reviewFindingDraft: {
      failureCategory: "修正不要",
      idealState: "6つのcommand detail、3ブラウザ、terminalと3状態スクリーンショットが揃っている",
      repairInstruction: "追加修正なし",
      upstreamInformation: ["Codex Run Queue item", "commit SHA", "Verification Evidence", "Review Record"],
      verificationCommands: requiredVerificationCommands
    },
    notes: ["terminal / empty / ready / failure screenshot evidenceを保持"],
    unsafeLocationDetected: false
  };
}

export function createFailureVerificationRunPacket(): VerificationRunPacket {
  return {
    mode: "failure",
    sourceQueueItem: "codex-run-queue-mvp049-bad-001",
    sourceRunStatus: "failed",
    commandDetails: [
      {
        commandName: "lint",
        command: "pnpm run lint",
        duration: "3.4s",
        terminalLogPath: "artifacts/terminal/mvp049-lint.txt"
      },
      {
        commandName: "test:e2e",
        command: "pnpm run test:e2e",
        duration: "timeout",
        terminalLogPath: "公開不可情報を含むため非表示"
      }
    ],
    browserCoverage: ["Chromium", "WebKit"],
    evidence: {
      terminal: false,
      emptyScreenshot: true,
      readyScreenshot: true,
      failureScreenshot: false
    },
    connections: {
      aiddSpec: false,
      verificationEvidence: true,
      reviewRecord: true,
      learningLog: false
    },
    reviewFindingDraft: {
      idealState: "不足のないVerification Run DetailとしてReview Recordへ渡せる",
      upstreamInformation: ["commit SHA", "各commandのexit code", "artifact path", "Firefox証跡"],
      verificationCommands: ["pnpm run test:e2e"]
    },
    notes: ["公開不可のlocal path / host / private network URLを検出済み"],
    unsafeLocationDetected: true
  };
}

export function createVerificationRunPacket(mode: DetailMode): VerificationRunPacket {
  if (mode === "ready") return createReadyVerificationRunPacket();
  if (mode === "failure") return createFailureVerificationRunPacket();
  return createEmptyVerificationRunPacket();
}

export function evaluateVerificationRunDetail(packet: VerificationRunPacket): VerificationRunReview {
  if (packet.mode === "empty" && packet.commandDetails.length === 0) {
    return {
      status: "empty",
      issues: ["Codex Run Queueから1件を選び、command別Verification Run Detailを作成してください"],
      readyDetails: [],
      connectedTo: buildConnections(packet),
      reviewFindingDraft: normalizeDraft(packet)
    };
  }

  const issues: string[] = [];
  if (!packet.commitSha) issues.push("commit SHA不足");

  const commandNames = new Set(packet.commandDetails.map((detail) => detail.commandName));
  const missingCommands = requiredCommands.filter((commandName) => !commandNames.has(commandName));
  if (missingCommands.length > 0) issues.push(`command別detail不足: ${missingCommands.join(" / ")}`);

  if (packet.commandDetails.some((detail) => detail.exitCode === undefined)) issues.push("exit code不足");
  if (packet.commandDetails.some((detail) => !detail.artifactPath)) issues.push("artifact path不足");
  if (packet.commandDetails.some((detail) => !detail.failureCategory)) issues.push("失敗分類不足");
  if (packet.commandDetails.some((detail) => !detail.repairInstruction)) issues.push("修正指示不足");
  if (!packet.browserCoverage.includes("Firefox")) issues.push("Firefox除外");
  if (!packet.evidence.terminal) issues.push("terminal evidence不足");
  if (!packet.evidence.failureScreenshot) issues.push("failure screenshot不足");
  if (!packet.connections.aiddSpec) issues.push("AIDD-Spec connection不足");

  const textForSafety = [
    packet.sourceQueueItem ?? "",
    packet.sourceRunStatus ?? "",
    packet.commitSha ?? "",
    ...packet.notes,
    ...packet.commandDetails.flatMap((detail) => [
      detail.command,
      detail.terminalLogPath,
      detail.artifactPath ?? "",
      detail.failureCategory ?? "",
      detail.repairInstruction ?? ""
    ])
  ].join("\n");
  if (packet.unsafeLocationDetected || privateLocationPatterns.some((pattern) => pattern.test(textForSafety))) {
    issues.push("local path / host / private network URL混入");
  }

  return {
    status: issues.length === 0 ? "ready" : "failure",
    issues,
    readyDetails: issues.length === 0 ? packet.commandDetails : [],
    connectedTo: buildConnections(packet),
    reviewFindingDraft: normalizeDraft(packet, issues)
  };
}

function buildConnections(packet: VerificationRunPacket): string[] {
  const connections: string[] = [];
  if (packet.connections.aiddSpec) connections.push("AIDD-Spec v0.1");
  if (packet.connections.verificationEvidence) connections.push("Verification Evidence");
  if (packet.connections.reviewRecord) connections.push("Review Record");
  if (packet.connections.learningLog) connections.push("Learning Log");
  return connections;
}

function normalizeDraft(packet: VerificationRunPacket, issues: string[] = []): VerificationRunReview["reviewFindingDraft"] {
  return {
    failureCategory: packet.reviewFindingDraft.failureCategory ?? (issues[0] ?? "未分類"),
    idealState: packet.reviewFindingDraft.idealState,
    repairInstruction:
      packet.reviewFindingDraft.repairInstruction ??
      "不足しているcommit SHA、command別detail、exit code、artifact path、失敗分類、修正指示、Firefox証跡、terminal/failure screenshot、AIDD-Spec接続を補う",
    upstreamInformation: packet.reviewFindingDraft.upstreamInformation,
    verificationCommands: packet.reviewFindingDraft.verificationCommands
  };
}
