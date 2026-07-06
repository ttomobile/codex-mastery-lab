export type GateCase = "ready" | "brake" | "stop";
export type GateDecision = "ready" | "brake" | "stop";

export type TaskPacketInput = {
  caseName: GateCase;
  sourcePacketId: string;
  runBudgetGate: string;
  primaryUsagePercent: number;
  secondaryUsagePercent: number;
  activeGoal: string;
  requestedScope: string[];
  verificationCommands: string[];
  evidencePaths: string[];
  promptDraft: string;
  resumeSignal: string;
};

export type ReducedTaskPacketProposal = {
  keep_now: string[];
  defer_next_increment: string[];
  minimum_verification: string[];
  fallback_action: string;
  resume_condition: string;
  evidence_paths: string[];
  prompt_preview: string;
};

export type PacketReview = {
  decision: GateDecision;
  usageBand: "go" | "brake" | "stop";
  publishBlockReasons: string[];
  unsafeTokens: string[];
  sanitizedEvidencePaths: string[];
  proposal: ReducedTaskPacketProposal | null;
};

export const requiredProposalFields = [
  "keep_now",
  "defer_next_increment",
  "minimum_verification",
  "fallback_action",
  "resume_condition",
  "evidence_paths",
  "prompt_preview"
] as const;

const privateLocationPatterns = [
  { label: "local path", pattern: /\/Users\/[^\s"'<>]+/g },
  { label: "home path", pattern: /\/home\/[^\s"'<>]+/g },
  { label: "private host", pattern: /\b[A-Za-z0-9._-]+\.local\b/g },
  { label: "private URL", pattern: /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g }
];

export function createTaskPacket(caseName: GateCase): TaskPacketInput {
  const base = {
    sourcePacketId: "ATP-MVP053-AUTO-SHRINK",
    runBudgetGate: "MVP052 Run Budget Gate通過後の次段",
    activeGoal: "STOP/BRAKE時にAI Task Packetを自動縮小する提案を出す",
    requestedScope: [
      "ready/brake/stopの3ケースをUIに表示する",
      "公開前ブロックを検出して縮小提案ではサニタイズ表示にする",
      "3ブラウザE2Eとdoctor:aiddで証跡を固定する"
    ],
    verificationCommands: [
      "pnpm run lint",
      "pnpm run typecheck",
      "pnpm run test",
      "pnpm run build",
      "pnpm run test:e2e",
      "pnpm run doctor:aidd"
    ],
    evidencePaths: [
      "experiments/aidd-control-plane-mvp-053/generated-repo/artifacts/terminal/capture-mvp053.txt",
      "assets/aidd-control-plane-mvp053-ready.png",
      "assets/aidd-control-plane-mvp053-brake.png",
      "assets/aidd-control-plane-mvp053-stop.png",
      "assets/aidd-control-plane-mvp053-terminal-evidence.png"
    ],
    promptDraft: "MVP053: STOP/BRAKE時はkeep_nowを最小化し、minimum_verificationとresume_conditionだけを残して再開可能にする。",
    resumeSignal: "lint/typecheck/unit/build/doctor:aiddが通り、3ブラウザE2Eの再実行枠が確保できたら再開"
  } satisfies Omit<TaskPacketInput, "caseName" | "primaryUsagePercent" | "secondaryUsagePercent">;

  if (caseName === "ready") {
    return {
      ...base,
      caseName,
      primaryUsagePercent: 62,
      secondaryUsagePercent: 68
    };
  }

  if (caseName === "brake") {
    return {
      ...base,
      caseName,
      primaryUsagePercent: 91,
      secondaryUsagePercent: 89,
      requestedScope: [
        ...base.requestedScope,
        "記事化とCI接続は次インクリメントへ延期する",
        "ローカル証跡 /Users/tto/codex-mastery-lab と tto-mac.local を公開前に除去する"
      ],
      evidencePaths: [
        ...base.evidencePaths,
        "/Users/tto/codex-mastery-lab/experiments/aidd-control-plane-mvp-053/generated-repo/artifacts/terminal/raw.log",
        "http://tto-mac.local:3021/internal"
      ],
      promptDraft: `${base.promptDraft} raw=/Users/tto/codex-mastery-lab/private-report host=tto-mac.local`
    };
  }

  return {
    ...base,
    caseName,
    primaryUsagePercent: 97,
    secondaryUsagePercent: 96,
    requestedScope: [
      ...base.requestedScope,
      "CI workflow、記事、preview再生成は停止して次回に回す",
      "private network URL http://127.0.0.1:3021 と /home/runner/work/raw.log を公開前に除去する"
    ],
    evidencePaths: [
      ...base.evidencePaths,
      "/home/runner/work/codex-mastery-lab/raw-stop.log",
      "http://127.0.0.1:3021/debug"
    ],
    promptDraft: `${base.promptDraft} stop-source=/home/runner/work/codex-mastery-lab/raw-stop.log url=http://127.0.0.1:3021/debug`
  };
}

export function reviewTaskPacket(packet: TaskPacketInput): PacketReview {
  const usageBand = calculateUsageBand(packet.primaryUsagePercent, packet.secondaryUsagePercent);
  const unsafeTokens = detectPrivateLocations(packet);
  const publishBlockReasons = unsafeTokens.length > 0
    ? ["公開前ブロック: local path / private host / private URLをWORKSPACEまたはHOMEへサニタイズしてください"]
    : [];
  const decision = usageBand === "go" ? "ready" : usageBand;

  return {
    decision,
    usageBand,
    publishBlockReasons,
    unsafeTokens,
    sanitizedEvidencePaths: packet.evidencePaths.map(sanitizeForPublic),
    proposal: decision === "ready" ? null : createReducedProposal(packet, decision)
  };
}

export function createReducedProposal(packet: TaskPacketInput, decision: Exclude<GateDecision, "ready">): ReducedTaskPacketProposal {
  const sanitizedScope = packet.requestedScope.map(sanitizeForPublic);
  const sanitizedPrompt = sanitizeForPublic(packet.promptDraft);
  const sanitizedEvidencePaths = packet.evidencePaths.map(sanitizeForPublic);

  return {
    keep_now: [
      "src/libの純粋関数とunit testを先に固定する",
      "ready/brake/stopのUI表示と公開前ブロック表示だけを残す",
      "doctor:aiddが確認するMVP053固有tokenを維持する"
    ],
    defer_next_increment: decision === "brake"
      ? ["CI接続、記事化、追加のビジュアル調整", ...sanitizedScope.filter((item) => item.includes("延期"))]
      : ["CI接続、記事化、preview再生成、追加仕様の拡張", ...sanitizedScope.filter((item) => item.includes("停止"))],
    minimum_verification: [
      "pnpm run lint",
      "pnpm run typecheck",
      "pnpm run test",
      "pnpm run build",
      "pnpm run doctor:aidd"
    ],
    fallback_action: decision === "brake"
      ? "現在のインクリメントを縮小し、E2Eは3ブラウザの代表確認までに抑えて次回へ残件を送る"
      : "実装を停止し、縮小後AI Task Packetだけを証跡へ残して再開条件が満たされるまで進めない",
    resume_condition: sanitizeForPublic(packet.resumeSignal),
    evidence_paths: sanitizedEvidencePaths,
    prompt_preview: [
      `packet=${packet.sourcePacketId}`,
      `decision=${decision}`,
      "keep_now: UI判定、縮小提案、sanitize、doctor:aidd",
      "minimum_verification: lint/typecheck/test/build/doctor:aidd",
      `resume_condition: ${sanitizeForPublic(packet.resumeSignal)}`,
      `note: ${sanitizedPrompt}`
    ].join("\n")
  };
}

export function detectPrivateLocations(value: unknown): string[] {
  const text = JSON.stringify(value);
  const hits: string[] = [];
  for (const { pattern } of privateLocationPatterns) {
    const matches = text.match(pattern) ?? [];
    hits.push(...matches);
  }
  return Array.from(new Set(hits));
}

export function sanitizeForPublic(value: string): string {
  return value
    .replace(/\/Users\/[^\s"'<>]+/g, (match) => match.replace(/^\/Users\/[^/]+/, "HOME"))
    .replace(/\/home\/[^\s"'<>]+/g, (match) => match.replace(/^\/home\/[^/]+/, "HOME"))
    .replace(/\b[A-Za-z0-9._-]+\.local\b/g, "WORKSPACE.local")
    .replace(/https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g, "WORKSPACE/private-url");
}

function calculateUsageBand(primary: number, secondary: number): PacketReview["usageBand"] {
  if (primary >= 96 || secondary >= 96) return "stop";
  if (primary >= 90 || secondary >= 92) return "brake";
  return "go";
}
