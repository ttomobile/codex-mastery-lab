export const queueStates = ["empty", "queued", "blocked", "exported"] as const;
export type QueueState = (typeof queueStates)[number];
export const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;
export type Lane = "execute_now" | "next_increment" | "learning_log";

export type SmokeFindingAction = {
  id: string;
  sourceSmokeRunId: string;
  brokenUrl: string;
  httpStatus: number | "未確認";
  byteSize: number | "未確認";
  contentType: string;
  findingCategory: string;
  severity: "high" | "medium" | "low";
  lane: Lane;
  priorityReason: string;
  aiTaskPacketPatch: string;
  codexPromptPatch: string;
  verificationCommands: string[];
  requiredEvidence: string[];
  rollbackCondition: string;
  aiddSpecConnection: string;
  sanitizationStatus: string;
};

export type QueueInput = {
  state: QueueState;
  sourceSmokeRunId: string;
  articlePath: string;
  summary: string;
  browserCoverage: Record<(typeof requiredBrowsers)[number], "通過" | "未確認" | "失敗">;
  terminalEvidenceImageResponse: string;
  aiddSpecConnection: string;
  blockedReasons: string[];
  actions: SmokeFindingAction[];
};

const verificationCommands = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
];

const baseActions: SmokeFindingAction[] = [
  {
    id: "RFQ-067-001",
    sourceSmokeRunId: "SMOKE-066-public-preview",
    brokenUrl: "https://preview.example.test/assets/aidd-control-plane-mvp066-failure.png",
    httpStatus: 404,
    byteSize: 0,
    contentType: "text/html",
    findingCategory: "公開asset欠落",
    severity: "high",
    lane: "execute_now",
    priorityReason: "記事内の主要スクリーンショットが読者に表示されないため、次の1回で修正する。",
    aiTaskPacketPatch: "preview/assetsへ参照PNGをコピーし、HTTP status 200・非ゼロbyteを検証条件に追加する。",
    codexPromptPatch: "壊れたasset URLを修正し、capture後にpublic preview smokeを再実行してください。",
    verificationCommands,
    requiredEvidence: ["failure screenshot", "terminal evidence PNG", "HTTP smoke log", "Chromium / Firefox / WebKit E2E"],
    rollbackCondition: "asset修正で別記事の画像参照が壊れた場合は差分を戻す。",
    aiddSpecConnection: "Verification Evidence / Review Record / Learning Log",
    sanitizationStatus: "local pathなし・private URLなし"
  },
  {
    id: "RFQ-067-002",
    sourceSmokeRunId: "SMOKE-066-public-preview",
    brokenUrl: "https://preview.example.test/assets/aidd-control-plane-mvp066-terminal-evidence.png",
    httpStatus: 200,
    byteSize: 0,
    contentType: "image/png",
    findingCategory: "terminal evidence 0 byte",
    severity: "high",
    lane: "execute_now",
    priorityReason: "terminal evidence画像が空だと、検証した一次情報として読めない。",
    aiTaskPacketPatch: "terminal evidence画像はHTTP 200だけでなくbyte size > 0を必須にする。",
    codexPromptPatch: "terminal evidence画像を再生成し、0 byteでないことをdoctor:aiddで確認してください。",
    verificationCommands,
    requiredEvidence: ["terminal evidence PNG", "doctor:aidd log"],
    rollbackCondition: "再生成画像にローカルパスが入った場合は公開しない。",
    aiddSpecConnection: "Verification Evidence",
    sanitizationStatus: "local pathなし・host名なし"
  },
  {
    id: "RFQ-067-003",
    sourceSmokeRunId: "SMOKE-066-public-preview",
    brokenUrl: "https://preview.example.test/articles/next.html",
    httpStatus: "未確認",
    byteSize: "未確認",
    contentType: "未確認",
    findingCategory: "次回改善候補",
    severity: "medium",
    lane: "next_increment",
    priorityReason: "次回はAction QueueからRun Queue Intakeへつなぐ。",
    aiTaskPacketPatch: "Action Queueのexecute_nowだけをRun Queue Intakeへ送る。",
    codexPromptPatch: "次回incrementでRun Queue Intakeとの連携を実装する。",
    verificationCommands: ["pnpm run test", "pnpm run doctor:aidd"],
    requiredEvidence: ["Learning Log"],
    rollbackCondition: "今回のexecute_nowに混ぜない。",
    aiddSpecConnection: "Review Finding Action Queue",
    sanitizationStatus: "公開前に再検査"
  },
  {
    id: "RFQ-067-004",
    sourceSmokeRunId: "SMOKE-066-public-preview",
    brokenUrl: "learning-log://smoke-verifier-lessons",
    httpStatus: "未確認",
    byteSize: "未確認",
    contentType: "internal-note",
    findingCategory: "学習ログ",
    severity: "low",
    lane: "learning_log",
    priorityReason: "smoke失敗を今後の標準更新候補として残す。",
    aiTaskPacketPatch: "公開preview smokeの失敗分類をテンプレート候補へ追加する。",
    codexPromptPatch: "学習ログへ戻すだけで、今回のCodex promptには混ぜない。",
    verificationCommands: ["pnpm run doctor:aidd"],
    requiredEvidence: ["Learning Log"],
    rollbackCondition: "なし。実行対象ではない。",
    aiddSpecConnection: "Learning Log / Spec Improvement",
    sanitizationStatus: "内部メモ"
  }
];

export function getQueueInput(state: QueueState): QueueInput {
  if (state === "empty") {
    return {
      state,
      sourceSmokeRunId: "",
      articlePath: "",
      summary: "Smoke結果が未選択です。古い検査結果を次回指示に流用しません。",
      browserCoverage: { Chromium: "未確認", Firefox: "未確認", WebKit: "未確認" },
      terminalEvidenceImageResponse: "未確認",
      aiddSpecConnection: "未接続",
      blockedReasons: ["source smoke run id不足", "Review Finding不足"],
      actions: []
    };
  }
  if (state === "blocked") {
    return {
      state,
      sourceSmokeRunId: "SMOKE-066-private-preview",
      articlePath: "articles/2026-07-08-aidd-control-plane-mvp-066.md",
      summary: "private URL、Firefox未確認、terminal evidence不足、AIDD-Spec接続不足があるため実行キューへ進めません。",
      browserCoverage: { Chromium: "通過", Firefox: "未確認", WebKit: "通過" },
      terminalEvidenceImageResponse: "不足",
      aiddSpecConnection: "不足",
      blockedReasons: ["private URL混入", "Firefox未確認", "terminal evidence image response不足", "AIDD-Spec接続不足"],
      actions: baseActions.slice(0, 2).map((action) => ({ ...action, sanitizationStatus: "blocked: private URLまたは証跡不足" }))
    };
  }
  return {
    state,
    sourceSmokeRunId: "SMOKE-066-public-preview",
    articlePath: "articles/2026-07-08-aidd-control-plane-mvp-066.md",
    summary: state === "queued" ? "壊れたassetをReview Finding Action Queueへ分類しました。" : "execute_nowだけをAI Task PacketとCodex promptへ書き出します。",
    browserCoverage: { Chromium: "通過", Firefox: "通過", WebKit: "通過" },
    terminalEvidenceImageResponse: "200 image/png 84231 bytes",
    aiddSpecConnection: "AIDD-Spec v0.1 Verification Evidence / Review Record / Learning Log",
    blockedReasons: [],
    actions: baseActions
  };
}

export function buildCodexPromptPreview(actions: SmokeFindingAction[]): string {
  const executeNow = actions.filter((action) => action.lane === "execute_now");
  return executeNow.map((action) => `- ${action.id}: ${action.codexPromptPatch}\n  検証: ${action.verificationCommands.join(" / ")}\n  rollback: ${action.rollbackCondition}`).join("\n");
}

export function buildPacketPatchPreview(actions: SmokeFindingAction[]): string {
  return actions.filter((action) => action.lane === "execute_now").map((action) => `### ${action.id}\n${action.aiTaskPacketPatch}\n必要証跡: ${action.requiredEvidence.join("、")}`).join("\n\n");
}

export function hasPromptLeakage(prompt: string): boolean {
  return prompt.includes("RFQ-067-003") || prompt.includes("RFQ-067-004") || prompt.includes("次回increment") || prompt.includes("学習ログへ戻すだけ");
}

export function createActionQueueViewModel(state: QueueState) {
  const input = getQueueInput(state);
  const executeNow = input.actions.filter((action) => action.lane === "execute_now");
  const nextIncrement = input.actions.filter((action) => action.lane === "next_increment");
  const learningLog = input.actions.filter((action) => action.lane === "learning_log");
  const codexPromptPreview = buildCodexPromptPreview(input.actions);
  const packetPatchPreview = buildPacketPatchPreview(input.actions);
  const promptLeakage = hasPromptLeakage(codexPromptPreview);
  const readiness = state === "blocked" || input.blockedReasons.length > 0 || promptLeakage ? "blocked" : state === "empty" ? "empty" : "ready";
  return { input, executeNow, nextIncrement, learningLog, codexPromptPreview, packetPatchPreview, promptLeakage, readiness };
}
