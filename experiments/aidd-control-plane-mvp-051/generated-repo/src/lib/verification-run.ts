export type DecisionMode = "empty" | "ready" | "failure";
export type DecisionStatus = DecisionMode;
export type DeltaDecision = "採用" | "保留" | "却下" | "";
export type ExecutionLane = "execute_now" | "next_increment" | "learning_log" | "";

export type RepairDeltaDecision = {
  sourceRepairDeltaId: string;
  decision: DeltaDecision;
  lane: ExecutionLane;
  priorityReason: string;
  decisionOwner: string;
  reviewEvidence: string;
  rollbackCondition: string;
  nextPacketSection: string;
  codexPromptPatch: string;
  verificationCommands: string[];
  browserProjects: string[];
  verificationEvidenceConnection: string;
  reviewRecordConnection: string;
  learningLogConnection: string;
  aiddSpecConnection: string;
};

export type DecisionInput = Partial<RepairDeltaDecision> & {
  unsafeSample?: string;
  includeInNextPacketPreview?: boolean;
};

export type DecisionPacket = {
  mode: DecisionMode;
  sourceWorkspace: string;
  decisions: DecisionInput[];
  aiddSpecConnected: boolean;
  notes: string[];
};

export type DecisionReview = {
  status: DecisionStatus;
  issues: string[];
  acceptedDeltas: RepairDeltaDecision[];
  heldOrRejectedDeltas: DecisionInput[];
  nextPacketPreview: string[];
  codexPromptPreview: string[];
  publishBlockReasons: string[];
};

export const requiredDecisionFields = [
  "source repair delta id",
  "decision",
  "priority reason",
  "decision owner",
  "review evidence",
  "rollback condition",
  "next packet section",
  "Codex prompt patch",
  "Verification Evidence接続",
  "Review Record接続",
  "Learning Log接続",
  "AIDD-Spec接続",
  "Chromium / Firefox / WebKit"
];

const privateLocationPatterns = [
  /\/Users\//,
  /\/home\//,
  /<home>/,
  /<host>/,
  /\b[A-Za-z0-9._-]+\.local\b/,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)/
];

export function createEmptyDecisionPacket(): DecisionPacket {
  return {
    mode: "empty",
    sourceWorkspace: "Evidence Repair Delta未選択",
    decisions: [],
    aiddSpecConnected: false,
    notes: ["判断対象のrepair deltaがないため、次回AI Task Packetへ進めません"]
  };
}

export function createReadyDecisionPacket(): DecisionPacket {
  const decisions: RepairDeltaDecision[] = [
    {
      sourceRepairDeltaId: "RD-050-FX-TIMEOUT",
      decision: "採用",
      lane: "execute_now",
      priorityReason: "3ブラウザE2EのFirefox timeoutは次回実行の完了条件を直接壊すため、最初の1インクリメントで扱う",
      decisionOwner: "AIDD Control Plane cron reviewer",
      reviewEvidence: "artifacts/terminal/test-e2e.txt と failure screenshotを確認済み",
      rollbackCondition: "Firefox待機条件の変更でChromiumまたはWebKitが失敗した場合は待機条件変更だけを戻す",
      nextPacketSection: "Acceptance Criteria / Verification Commands",
      codexPromptPatch: "execute_now: Firefox timeoutを可視テキスト待機へ変更し、pnpm run test:e2eをChromium / Firefox / WebKitで再実行する。",
      verificationCommands: ["pnpm run test:e2e", "pnpm run doctor:aidd"],
      browserProjects: ["chromium", "firefox", "webkit"],
      verificationEvidenceConnection: "Verification Evidence: command別exit codeと3ブラウザ結果を保存する",
      reviewRecordConnection: "Review Record: timeout findingを解消済みか再判定する",
      learningLogConnection: "Learning Log: Firefox timeoutは次回packetの待機条件に戻す",
      aiddSpecConnection: "AIDD-Spec v0.1: Verification Evidence / Review Record / Learning Log"
    },
    {
      sourceRepairDeltaId: "RD-050-SHOT-MISSING",
      decision: "保留",
      lane: "next_increment",
      priorityReason: "failure screenshot不足は重要だが、今回のexecute_nowはFirefox timeout修正に絞る",
      decisionOwner: "AIDD Control Plane cron reviewer",
      reviewEvidence: "artifacts/screenshotsの不足一覧を確認済み",
      rollbackCondition: "画像生成でlocal pathが写る場合は公開せずsanitize文言を修正する",
      nextPacketSection: "Evidence Requirements",
      codexPromptPatch: "next_increment: failure screenshot不足をcapture scriptで補う。",
      verificationCommands: ["pnpm run capture:mvp051"],
      browserProjects: ["chromium", "firefox", "webkit"],
      verificationEvidenceConnection: "Verification Evidence: empty / ready / failure / terminal evidence PNGを保存する",
      reviewRecordConnection: "Review Record: evidence_missing findingとして残す",
      learningLogConnection: "Learning Log: 証跡不足は次回改善候補へ戻す",
      aiddSpecConnection: "AIDD-Spec v0.1: Verification Evidence"
    },
    {
      sourceRepairDeltaId: "RD-050-MOCK-HEALTH",
      decision: "却下",
      lane: "learning_log",
      priorityReason: "今回の実験ではmock backendを直接変更しないため、標準更新候補としてLearning Logへ戻す",
      decisionOwner: "AIDD Control Plane cron reviewer",
      reviewEvidence: "doctor:aiddのmock health候補メモを確認済み",
      rollbackCondition: "mock healthの文言だけをUIへ混ぜた場合は変更を戻す",
      nextPacketSection: "Learning Log",
      codexPromptPatch: "learning_log: mock health timeoutは次回以降のmock contract強化へ回す。",
      verificationCommands: ["pnpm run doctor:aidd"],
      browserProjects: ["chromium", "firefox", "webkit"],
      verificationEvidenceConnection: "Verification Evidence: timeout分類を保存する",
      reviewRecordConnection: "Review Record: 今回は却下理由を残す",
      learningLogConnection: "Learning Log: mock contract改善候補へ戻す",
      aiddSpecConnection: "AIDD-Spec v0.1: Mock Contract / Learning Log"
    }
  ];

  return {
    mode: "ready",
    sourceWorkspace: "repair-delta-priority-decision-mvp051-ready",
    decisions,
    aiddSpecConnected: true,
    notes: ["採用済みdeltaだけを次回AI Task Packet / Codex promptへ進めます"]
  };
}

export function createFailureDecisionPacket(): DecisionPacket {
  return {
    mode: "failure",
    sourceWorkspace: "repair-delta-priority-decision-mvp051-draft",
    decisions: [
      {
        sourceRepairDeltaId: "RD-050-DRAFT",
        decision: "",
        priorityReason: "",
        decisionOwner: "AIDD Control Plane cron reviewer",
        reviewEvidence: "",
        rollbackCondition: "",
        nextPacketSection: "Acceptance Criteria",
        codexPromptPatch: "保留deltaも含めて全部Codexへ渡す危険なpatch",
        verificationCommands: ["pnpm run test:e2e"],
        browserProjects: ["chromium", "webkit"],
        verificationEvidenceConnection: "",
        reviewRecordConnection: "",
        learningLogConnection: "",
        aiddSpecConnection: "",
        includeInNextPacketPreview: true,
        unsafeSample: "/Users/example/project と http://127.0.0.1:3020/report を含む危険サンプル"
      }
    ],
    aiddSpecConnected: false,
    notes: ["未判断・Firefox除外・未採用delta混入・local path混入のため公開前ブロック"]
  };
}

export function createDecisionPacket(mode: DecisionMode): DecisionPacket {
  if (mode === "ready") return createReadyDecisionPacket();
  if (mode === "failure") return createFailureDecisionPacket();
  return createEmptyDecisionPacket();
}

export function evaluatePriorityDecisionWorkspace(packet: DecisionPacket): DecisionReview {
  if (packet.mode === "empty" && packet.decisions.length === 0) {
    return {
      status: "empty",
      issues: ["repair delta未選択: 次回AI Task Packetへ進める判断材料がありません"],
      acceptedDeltas: [],
      heldOrRejectedDeltas: [],
      nextPacketPreview: [],
      codexPromptPreview: [],
      publishBlockReasons: []
    };
  }

  const issues: string[] = [];
  for (const decision of packet.decisions) {
    if (!decision.sourceRepairDeltaId) issues.push("source repair delta不足");
    if (!decision.decision) issues.push("未判断");
    if (!decision.priorityReason) issues.push("理由不足");
    if (!decision.reviewEvidence) issues.push("証跡不足");
    if (!decision.rollbackCondition) issues.push("rollback不足");
    if (!decision.verificationEvidenceConnection) issues.push("Verification Evidence接続不足");
    if (!decision.reviewRecordConnection) issues.push("Review Record接続不足");
    if (!decision.learningLogConnection) issues.push("Learning Log接続不足");
    if (!decision.aiddSpecConnection) issues.push("AIDD-Spec接続不足");
    if (!decision.browserProjects?.includes("firefox")) issues.push("Firefox除外");
    if (decision.decision !== "採用" && decision.includeInNextPacketPreview) issues.push("未採用delta混入");
  }
  if (!packet.aiddSpecConnected) issues.push("AIDD-Spec接続不足");
  if (containsPrivateLocation(packet)) issues.push("local path / host / private network URL混入");

  const uniqueIssues = Array.from(new Set(issues));
  const typed = packet.decisions as RepairDeltaDecision[];
  const acceptedDeltas = uniqueIssues.length === 0 ? typed.filter((d) => d.decision === "採用") : [];
  const heldOrRejectedDeltas = packet.decisions.filter((d) => d.decision === "保留" || d.decision === "却下");

  return {
    status: uniqueIssues.length === 0 ? "ready" : "failure",
    issues: uniqueIssues,
    acceptedDeltas,
    heldOrRejectedDeltas,
    nextPacketPreview: acceptedDeltas.map((d) => `${d.nextPacketSection}: ${d.priorityReason}`),
    codexPromptPreview: acceptedDeltas.map((d) => d.codexPromptPatch),
    publishBlockReasons: uniqueIssues.includes("local path / host / private network URL混入")
      ? ["公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています"]
      : []
  };
}

function containsPrivateLocation(packet: DecisionPacket): boolean {
  const text = [
    packet.sourceWorkspace,
    ...packet.notes,
    ...packet.decisions.flatMap((decision) => [
      decision.sourceRepairDeltaId ?? "",
      decision.decision ?? "",
      decision.lane ?? "",
      decision.priorityReason ?? "",
      decision.decisionOwner ?? "",
      decision.reviewEvidence ?? "",
      decision.rollbackCondition ?? "",
      decision.nextPacketSection ?? "",
      decision.codexPromptPatch ?? "",
      ...(decision.verificationCommands ?? []),
      ...(decision.browserProjects ?? []),
      decision.verificationEvidenceConnection ?? "",
      decision.reviewRecordConnection ?? "",
      decision.learningLogConnection ?? "",
      decision.aiddSpecConnection ?? "",
      decision.unsafeSample ?? ""
    ])
  ].join("\n");

  return privateLocationPatterns.some((pattern) => pattern.test(text));
}
