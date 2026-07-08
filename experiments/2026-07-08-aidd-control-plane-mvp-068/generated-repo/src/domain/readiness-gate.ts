export const gateStates = ["empty", "ready", "blocked", "sanitized"] as const;
export type GateState = (typeof gateStates)[number];
export const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;
export type Lane = "execute_now" | "next_increment" | "learning_log";
export type SandboxMode = "danger-full-access" | "workspace-write" | "未指定";

export type ReadinessInput = {
  state: GateState;
  sourceQueueId: string;
  executeNowActionId: string;
  lane: Lane | "未選択";
  codexCommand: string;
  sandboxMode: SandboxMode;
  requiredVerificationCommands: string[];
  browserProjects: Record<(typeof requiredBrowsers)[number], "必須" | "除外" | "未確認">;
  requiredEvidence: string[];
  rollbackStopCondition: string;
  readyReason: string;
  aiddSpecConnection: string;
  sanitizationScan: string;
  blockedReasons: string[];
  codexPromptPreview: string;
};

export const verificationCommands = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
];

const safePrompt = [
  "MVP068 execute_now action RFQ-067-001だけを実行してください。",
  "Codex commandは codex exec --sandbox danger-full-access で、対象はgenerated-repo内に限定します。",
  "検証は pnpm run lint / pnpm run typecheck / pnpm run test / pnpm run build / pnpm run test:e2e / pnpm run doctor:aidd を個別ログに保存します。",
  "Chromium / Firefox / WebKitをすべて実行し、terminal / empty / ready / blocked / sanitized screenshot / Playwright reportを残します。",
  "rollback stop condition: 検証失敗、公開危険文字列、証跡不足が出たらRun Queueへ進めずReview Recordへ戻します。"
].join("\n");

export function getReadinessInput(state: GateState): ReadinessInput {
  if (state === "empty") {
    return {
      state,
      sourceQueueId: "",
      executeNowActionId: "",
      lane: "未選択",
      codexCommand: "未生成",
      sandboxMode: "未指定",
      requiredVerificationCommands: [],
      browserProjects: { Chromium: "未確認", Firefox: "未確認", WebKit: "未確認" },
      requiredEvidence: [],
      rollbackStopCondition: "未設定",
      readyReason: "実行候補が未選択です。古いAction Queueを使い回しません。",
      aiddSpecConnection: "未接続",
      sanitizationScan: "未実行",
      blockedReasons: ["source queue id不足", "execute_now action不足"],
      codexPromptPreview: "未生成"
    };
  }
  if (state === "blocked") {
    return {
      state,
      sourceQueueId: "RFQ-067-public-preview",
      executeNowActionId: "RFQ-067-003",
      lane: "next_increment",
      codexCommand: "codex exec --yolo '次回incrementもまとめて直す'",
      sandboxMode: "未指定",
      requiredVerificationCommands: ["pnpm run test"],
      browserProjects: { Chromium: "必須", Firefox: "除外", WebKit: "必須" },
      requiredEvidence: ["terminal screenshot"],
      rollbackStopCondition: "未設定",
      readyReason: "blocked理由があるためCodex Run Queueへ進めません。",
      aiddSpecConnection: "不足",
      sanitizationScan: "private URL混入を検出",
      blockedReasons: [
        "execute_now以外のaction混入",
        "危険command",
        "sandbox mode不足",
        "Firefox除外",
        "terminal/failure screenshot不足",
        "rollback不足",
        "private URL混入",
        "AIDD-Spec接続不足"
      ],
      codexPromptPreview: "RFQ-067-003 次回incrementもまとめて実行する。private-preview.example.invalid を参照する。"
    };
  }
  return {
    state,
    sourceQueueId: "RFQ-067-public-preview",
    executeNowActionId: "RFQ-067-001",
    lane: "execute_now",
    codexCommand: "codex exec --sandbox danger-full-access 'Run one execute_now repair delta from Smoke Finding Action Queue'",
    sandboxMode: "danger-full-access",
    requiredVerificationCommands: verificationCommands,
    browserProjects: { Chromium: "必須", Firefox: "必須", WebKit: "必須" },
    requiredEvidence: ["terminal evidence", "empty screenshot", "ready screenshot", "blocked screenshot", "failure screenshot", "Playwright report"],
    rollbackStopCondition: "検証失敗、公開危険文字列、証跡不足が出たらRun Queueへ進めずReview Recordへ戻す。",
    readyReason: state === "ready" ? "execute_nowだけが選ばれ、検証・証跡・rollback・AIDD-Spec接続が揃っています。" : "公開用サニタイズ後もexecute_nowだけがCodex prompt previewに残っています。",
    aiddSpecConnection: "AIDD-Spec v0.1 AI Task Packet / Verification Evidence / Review Record / Learning Log、AIDD Control Plane One-Run Execution Readiness Gate",
    sanitizationScan: state === "sanitized" ? "local path / host名 / private network URLなし" : "公開危険文字列なし",
    blockedReasons: [],
    codexPromptPreview: safePrompt
  };
}

export function hasExecutionBlockers(input: ReadinessInput): boolean {
  return input.blockedReasons.length > 0 || input.lane !== "execute_now" || input.sandboxMode === "未指定" || input.browserProjects.Firefox !== "必須" || input.aiddSpecConnection === "不足";
}

export function hasPromptLeakage(prompt: string): boolean {
  return /RFQ-067-003|next_increment|learning_log|次回increment|private-preview|\/Users\/|\/home\/|127\.0\.0\.1|192\.168\.|10\./i.test(prompt);
}

export function createReadinessViewModel(state: GateState) {
  const input = getReadinessInput(state);
  const promptLeakage = hasPromptLeakage(input.codexPromptPreview);
  const readiness = state === "empty" ? "empty" : hasExecutionBlockers(input) || promptLeakage ? "blocked" : "ready";
  const missingEvidence = ["terminal evidence", "failure screenshot", "Playwright report"].filter((evidence) => !input.requiredEvidence.includes(evidence));
  return { input, readiness, promptLeakage, missingEvidence, canQueue: readiness === "ready" && missingEvidence.length === 0 };
}
