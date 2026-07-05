export type DetailMode = "empty" | "ready" | "failure";
export type RepairStatus = DetailMode;
export type FailureCategory = "failed" | "evidence_missing" | "timeout" | "";
export type Priority = "P0" | "P1" | "P2" | "";

export type FindingInput = {
  findingId?: string;
  failureCategory?: FailureCategory;
  priority?: Priority;
  idealState?: string;
  repairInstruction?: string;
  sourceSummary: string;
  unsafeSample?: string;
};

export type RepairDelta = {
  findingId: string;
  failureCategory: Exclude<FailureCategory, "">;
  priority: Exclude<Priority, "">;
  idealState: string;
  repairInstruction: string;
  aiTaskPacketDelta: string;
  codexPromptDelta: string;
  verificationCommand: string;
  rollbackCondition: string;
  learningLogProposal: string;
  aiddSpecConnection: string;
};

export type RepairPacket = {
  mode: DetailMode;
  sourceRun: string;
  findings: FindingInput[];
  deltas: Partial<RepairDelta>[];
  aiddSpecConnected: boolean;
  notes: string[];
};

export type RepairReview = {
  status: RepairStatus;
  issues: string[];
  deltas: RepairDelta[];
  reviewFindingDraft: {
    title: string;
    missingItems: string[];
    publishBlockReasons: string[];
  };
};

export const requiredDeltaFields = [
  "finding ID",
  "失敗分類",
  "優先度",
  "理想状態",
  "修正指示",
  "AI Task Packet delta",
  "Codex prompt delta",
  "verification command",
  "rollback condition",
  "Learning Log",
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

export function createEmptyRepairPacket(): RepairPacket {
  return {
    mode: "empty",
    sourceRun: "Verification Run Detail未選択",
    findings: [],
    deltas: [],
    aiddSpecConnected: false,
    notes: ["finding未読込のため、次回AI Task Packetへ戻す材料はまだありません"]
  };
}

export function createReadyRepairPacket(): RepairPacket {
  const deltas: RepairDelta[] = [
    {
      findingId: "VRD-050-FX-TIMEOUT",
      failureCategory: "failed",
      priority: "P0",
      idealState: "pnpm run test:e2eがChromium / Firefox / WebKitで完走し、Firefoxのtimeoutが再現しない",
      repairInstruction: "Firefoxの待機条件をnetwork idle依存から画面上の完了表示へ変更し、mock応答待ちを明示する",
      aiTaskPacketDelta:
        "次回Packetに「Firefox timeout再現」「対象spec」「期待する完了表示」「3ブラウザ再実行」を追記する",
      codexPromptDelta:
        "Firefoxでpnpm run test:e2eがtimeoutしたfindingを最優先で修正し、Playwrightの待機条件とmock状態初期化を見直す",
      verificationCommand: "pnpm run test:e2e",
      rollbackCondition: "Firefoxで同じspecが90秒を超えて安定しない場合は待機条件変更を戻し、mock初期化の修正だけを残す",
      learningLogProposal:
        "Firefox timeoutはUI完了シグナル不足として記録し、次回からE2Eには可視テキストの完了条件を先に置く",
      aiddSpecConnection: "AIDD-Spec: Verification Evidence -> Review Finding -> Repair Delta"
    },
    {
      findingId: "VRD-050-SHOT-MISSING",
      failureCategory: "evidence_missing",
      priority: "P1",
      idealState: "failure screenshotがartifacts/screenshotsに保存され、記事化前の証跡として参照できる",
      repairInstruction: "capture scriptにfailure状態の明示クリックとPNG保存を追加し、assetsにも同名で同期する",
      aiTaskPacketDelta:
        "次回Packetに「failure screenshot不足」「保存先PNG名」「assets同期」「公開前チェック」を追加する",
      codexPromptDelta:
        "failure screenshot不足を補うため、capture:mvp050でfailure状態PNGとterminal evidence PNGを必ず生成する",
      verificationCommand: "pnpm run capture:mvp050",
      rollbackCondition: "PNG生成後にlocal pathやprivate URLが写り込む場合は画像を破棄し、sanitize文言を修正する",
      learningLogProposal:
        "証跡不足は修正完了扱いを遅らせる要因として記録し、capture scriptをacceptance gateに含める",
      aiddSpecConnection: "AIDD-Spec: Evidence Artifact -> Publish Gate -> Learning Log"
    },
    {
      findingId: "VRD-050-MOCK-HEALTH",
      failureCategory: "timeout",
      priority: "P1",
      idealState: "mock backend health checkが規定時間内に応答し、UIが遅延状態と回復状態を区別して表示する",
      repairInstruction: "mock health checkのtimeout分類をdeltaへ変換し、再検証commandとrollback条件を明示する",
      aiTaskPacketDelta:
        "次回Packetに「mock backend health check遅延」「timeout分類」「回復確認」「doctor:aidd再実行」を追加する",
      codexPromptDelta:
        "mock backend health check遅延findingをtimeoutとして扱い、UIとdoctorでAIDD-Spec接続まで検証する",
      verificationCommand: "pnpm run doctor:aidd",
      rollbackCondition: "health check遅延の原因がUI外の環境要因だけならUI文言変更を戻し、doctor検査だけ維持する",
      learningLogProposal:
        "mock health遅延はfailureではなくtimeoutとして分け、次回から分類不足をReview Finding draftで止める",
      aiddSpecConnection: "AIDD-Spec: Mock Contract -> Verification Command -> Repair Decision"
    }
  ];

  return {
    mode: "ready",
    sourceRun: "verification-run-detail-mvp050-ready",
    findings: deltas.map((delta) => ({
      findingId: delta.findingId,
      failureCategory: delta.failureCategory,
      priority: delta.priority,
      idealState: delta.idealState,
      repairInstruction: delta.repairInstruction,
      sourceSummary: delta.codexPromptDelta
    })),
    deltas,
    aiddSpecConnected: true,
    notes: ["failed / evidence_missing / timeoutのfindingを次回修正入力へ変換済み"]
  };
}

export function createFailureRepairPacket(): RepairPacket {
  return {
    mode: "failure",
    sourceRun: "verification-run-detail-mvp050-draft",
    findings: [
      {
        sourceSummary: "Review Finding draftにID、分類、優先度がない",
        unsafeSample: "/Users/example/project と http://127.0.0.1:3020/report を含む危険サンプル"
      }
    ],
    deltas: [
      {
        idealState: "Review Finding draftから公開可能なRepair Deltaへ変換できる",
        repairInstruction: "不足項目を補ってから次回Packetへ戻す"
      }
    ],
    aiddSpecConnected: false,
    notes: ["local path / host / private network URLを含むため公開前ブロック"]
  };
}

export function createRepairPacket(mode: DetailMode): RepairPacket {
  if (mode === "ready") return createReadyRepairPacket();
  if (mode === "failure") return createFailureRepairPacket();
  return createEmptyRepairPacket();
}

export function evaluateRepairDeltaGenerator(packet: RepairPacket): RepairReview {
  if (packet.mode === "empty" && packet.findings.length === 0) {
    return {
      status: "empty",
      issues: ["finding未読込: 次回AI Task Packetへ戻す材料がありません"],
      deltas: [],
      reviewFindingDraft: {
        title: "Review Finding draft",
        missingItems: requiredDeltaFields,
        publishBlockReasons: []
      }
    };
  }

  const issues: string[] = [];
  for (const finding of packet.findings) {
    if (!finding.findingId) issues.push("finding ID不足");
    if (!finding.failureCategory) issues.push("失敗分類不足");
    if (!finding.priority) issues.push("優先度不足");
  }

  for (const delta of packet.deltas) {
    if (!delta.aiTaskPacketDelta) issues.push("AI Task Packet delta不足");
    if (!delta.codexPromptDelta) issues.push("Codex prompt delta不足");
    if (!delta.verificationCommand) issues.push("検証command不足");
    if (!delta.rollbackCondition) issues.push("rollback条件不足");
    if (!delta.learningLogProposal) issues.push("Learning Log不足");
    if (!delta.aiddSpecConnection) issues.push("AIDD-Spec connection不足");
  }

  if (!packet.aiddSpecConnected) issues.push("AIDD-Spec connection不足");
  if (containsPrivateLocation(packet)) issues.push("local path / host / private network URL混入");

  const uniqueIssues = Array.from(new Set(issues));
  const readyDeltas = uniqueIssues.length === 0 ? (packet.deltas as RepairDelta[]) : [];

  return {
    status: uniqueIssues.length === 0 ? "ready" : "failure",
    issues: uniqueIssues,
    deltas: readyDeltas,
    reviewFindingDraft: {
      title: "Review Finding draft",
      missingItems: uniqueIssues,
      publishBlockReasons: uniqueIssues.includes("local path / host / private network URL混入")
        ? ["公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています"]
        : []
    }
  };
}

function containsPrivateLocation(packet: RepairPacket): boolean {
  const text = [
    packet.sourceRun,
    ...packet.notes,
    ...packet.findings.flatMap((finding) => [
      finding.findingId ?? "",
      finding.failureCategory ?? "",
      finding.priority ?? "",
      finding.idealState ?? "",
      finding.repairInstruction ?? "",
      finding.sourceSummary,
      finding.unsafeSample ?? ""
    ]),
    ...packet.deltas.flatMap((delta) => [
      delta.findingId ?? "",
      delta.failureCategory ?? "",
      delta.priority ?? "",
      delta.idealState ?? "",
      delta.repairInstruction ?? "",
      delta.aiTaskPacketDelta ?? "",
      delta.codexPromptDelta ?? "",
      delta.verificationCommand ?? "",
      delta.rollbackCondition ?? "",
      delta.learningLogProposal ?? "",
      delta.aiddSpecConnection ?? ""
    ])
  ].join("\n");

  return privateLocationPatterns.some((pattern) => pattern.test(text));
}
