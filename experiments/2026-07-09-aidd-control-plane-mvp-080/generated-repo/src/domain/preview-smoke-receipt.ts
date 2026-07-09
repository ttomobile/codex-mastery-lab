export type DispatchState = "empty" | "ready" | "running" | "failure" | "blocked";

export type Severity = "info" | "warning" | "error" | "blocker";
export type BrowserName = "Chromium" | "Firefox" | "WebKit";

export type BrowserReceipt = {
  browser: BrowserName;
  status: "未確認" | "確認済み" | "実行中" | "失敗" | "停止";
  evidencePath: string;
};

export type DispatchPayload = {
  queueItem: string;
  executeNowSummary: string;
  payloadPreview: string;
  dispatchCommand: string;
  verificationCommands: string[];
  requiredEvidence: string[];
  rollbackCondition: string;
  timeoutBudget: string;
  destructiveCleanupRequest: string;
};

export type DispatchAction = {
  queueItem: string;
  payload: DispatchPayload;
  excludedNextIncrement: string;
  excludedLearningLog: string;
  verificationGate: string;
  evidenceGate: string;
  rollbackGate: string;
  sanitizeGate: string;
  progress: string;
  pendingEvidence: string[];
  nextRepairAction: string;
  aiddSpecConnection: {
    specVersion: "AIDD-Spec v0.1";
    standardPath: "standards/aidd-control-plane-mvp-v0.1.md";
    upstreamGate: "MVP079 Repair Action Run Queue Intake";
    featureName: "Run Queue Dispatch Receipt";
    summary: string;
  };
};

export type ReviewFinding = {
  id: string;
  category: string;
  severity: Severity;
  yaml: string;
};

export type StopReason = {
  category: string;
  severity: "blocker";
  reason: string;
};

export type DispatchReceipt = {
  state: DispatchState;
  title: "Run Queue Dispatch Receipt";
  receiptId: string;
  decision: "未選択" | "Dispatch可能" | "実行中" | "Review Findingあり" | "Dispatch停止";
  decisionTone: "neutral" | "success" | "info" | "warning" | "danger";
  message: string;
  action: DispatchAction;
  browsers: BrowserReceipt[];
  reviewFindings: ReviewFinding[];
  stopReasons: StopReason[];
};

export const browserNames: BrowserName[] = ["Chromium", "Firefox", "WebKit"];

const executeNowSummary =
  "MVP079でreadyになったRepair Action 1件だけをCodex実行へ渡し、検証ログ、画面証跡、sanitize結果、rollback条件をDispatch Receiptとして保存する。";

const aiddSpecConnection: DispatchAction["aiddSpecConnection"] = {
  specVersion: "AIDD-Spec v0.1",
  standardPath: "standards/aidd-control-plane-mvp-v0.1.md",
  upstreamGate: "MVP079 Repair Action Run Queue Intake",
  featureName: "Run Queue Dispatch Receipt",
  summary:
    "queue投入済みのexecute_now payloadを、実行コマンド、検証ゲート、証跡ゲート、rollback、sanitize、次のRepair Action候補へ接続する。"
};

const readyPayload: DispatchPayload = {
  queueItem: "run-queue-mvp079-ready-001",
  executeNowSummary,
  payloadPreview: executeNowSummary,
  dispatchCommand: "codex exec --sandbox danger-full-access <execute_nowのみ>",
  verificationCommands: [
    "pnpm run lint",
    "pnpm run typecheck",
    "pnpm run test",
    "pnpm run build",
    "pnpm run test:e2e",
    "pnpm run doctor:aidd"
  ],
  requiredEvidence: [
    "artifacts/screenshots/mvp080-ready.png",
    "artifacts/screenshots/mvp080-running.png",
    "artifacts/screenshots/mvp080-failure.png",
    "artifacts/screenshots/mvp080-terminal-evidence.png",
    "assets/mvp080-ready.png",
    "assets/mvp080-terminal-evidence.png"
  ],
  rollbackCondition:
    "Codex実行が起動できない、payloadにexecute_now以外が混入した、3ブラウザのいずれかが未確認、またはterminal evidence PNGが保存できない場合はDispatch Receiptをfailureへ戻す。",
  timeoutBudget: "Codex実行 10分、E2E 120秒、expect 90秒、workers 1",
  destructiveCleanupRequest: "なし"
};

const readyAction: DispatchAction = {
  queueItem: readyPayload.queueItem,
  payload: readyPayload,
  excludedNextIncrement: "次回: Dispatch Receiptを複数プロジェクトの履歴比較へ拡張する。",
  excludedLearningLog:
    "学び: 実行結果の反省はLearning Logへ保存し、payload previewには混ぜない。",
  verificationGate: "lint / typecheck / unit / build / 3ブラウザE2E / doctor:aidd を個別ログとして保存する。",
  evidenceGate: "empty / ready / running / failure / blocked / terminal evidence画像をassetsとartifacts/screenshotsの両方に保存する。",
  rollbackGate: readyPayload.rollbackCondition,
  sanitizeGate: "private URL、local path、private host、ホスト名、ローカル絶対パスをReceiptから除外する。",
  progress: "dispatch前チェック完了。実行コマンドと証跡要求を確認済み。",
  pendingEvidence: [],
  nextRepairAction: "なし。成功Receiptとして保存できる。",
  aiddSpecConnection
};

const emptyPayload: DispatchPayload = {
  ...readyPayload,
  queueItem: "未選択",
  executeNowSummary: "未入力",
  payloadPreview: "未入力",
  dispatchCommand: "未入力",
  verificationCommands: [],
  requiredEvidence: [],
  rollbackCondition: "未入力",
  timeoutBudget: "未入力",
  destructiveCleanupRequest: "未入力"
};

const emptyAction: DispatchAction = {
  ...readyAction,
  queueItem: "未選択",
  payload: emptyPayload,
  excludedNextIncrement: "未入力",
  excludedLearningLog: "未入力",
  verificationGate: "未入力",
  evidenceGate: "未入力",
  rollbackGate: "未入力",
  sanitizeGate: "未入力",
  progress: "未入力",
  pendingEvidence: [],
  nextRepairAction: "未入力"
};

const failureFindings: ReviewFinding[] = [
  {
    id: "dispatch-command-failed",
    category: "dispatch command失敗",
    severity: "error",
    yaml: [
      "review_finding:",
      "  category: dispatch_command_failed",
      "  severity: error",
      "  observed_by: terminal",
      "  fix: Codex実行可否を記録し、起動不能ならHermes実装と独立検証を別Receiptへ分ける"
    ].join("\n")
  },
  {
    id: "evidence-gate-missing",
    category: "証跡ゲート不足",
    severity: "error",
    yaml: [
      "review_finding:",
      "  category: evidence_gate_missing",
      "  severity: error",
      "  required: [running_png, failure_png, terminal_evidence_png]",
      "  fix: required evidenceをassetsとartifacts/screenshotsに保存する"
    ].join("\n")
  },
  {
    id: "rollback-gate-triggered",
    category: "rollbackゲート発火",
    severity: "warning",
    yaml: [
      "review_finding:",
      "  category: rollback_gate_triggered",
      "  severity: warning",
      "  next_repair_action: dispatch環境の起動不能を次のexecute_nowへ戻す"
    ].join("\n")
  }
];

const blockedPayload: DispatchPayload = {
  ...readyPayload,
  payloadPreview: `${executeNowSummary}\n次回: Dispatch履歴をまとめて改善する。\n学び: 実行ログはあとで整理する。`,
  requiredEvidence: ["assets/mvp080-ready.png"],
  destructiveCleanupRequest: "rm -rf .next test-results playwright-report を実行してからDispatchする"
};

const blockedAction: DispatchAction = {
  ...readyAction,
  payload: blockedPayload,
  verificationGate: "Firefoxが除外され、3ブラウザE2Eの証跡が揃っていない。",
  evidenceGate: "terminal evidenceとfailure screenshotが不足している。",
  rollbackGate: "破壊的cleanup要求が含まれているためDispatch不可。",
  sanitizeGate: "private URLまたはlocal pathがReceiptへ混入している。",
  nextRepairAction: "blocked理由を1件ずつRepair Actionへ戻す。"
};

const blockedReasons: StopReason[] = [
  { category: "private URL", severity: "blocker", reason: "private URLがdispatch receiptに混入しているため停止。" },
  { category: "local path", severity: "blocker", reason: "local pathを公開証跡の代替にしているため停止。" },
  { category: "Firefox除外", severity: "blocker", reason: "3ブラウザE2EからFirefoxを除外しているため停止。" },
  { category: "terminal evidence不足", severity: "blocker", reason: "terminal evidence PNGがrequired evidenceにないため停止。" },
  { category: "failure screenshot不足", severity: "blocker", reason: "failure screenshotがrequired evidenceにないため停止。" },
  { category: "next_increment混入", severity: "blocker", reason: "payloadにnext_increment相当の文が混入しているため停止。" },
  { category: "learning_log混入", severity: "blocker", reason: "payloadにlearning_log相当の文が混入しているため停止。" },
  { category: "破壊的cleanup要求", severity: "blocker", reason: "rm -rf .next/test-results/playwright-report要求は安全ゲートで止める。" }
];

export function normalizeDispatchState(value: string | string[] | undefined): DispatchState {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === "ready" || candidate === "running" || candidate === "failure" || candidate === "blocked") return candidate;
  return "empty";
}

export function getDispatchReceipt(state: DispatchState): DispatchReceipt {
  if (state === "ready") return readyReceipt;
  if (state === "running") return runningReceipt;
  if (state === "failure") return failureReceipt;
  if (state === "blocked") return blockedReceipt;
  return emptyReceipt;
}

export function payloadContainsExecuteNowOnly(action: DispatchAction): boolean {
  const payloadText = JSON.stringify(action.payload);
  return (
    action.payload.payloadPreview === action.payload.executeNowSummary &&
    !payloadText.includes(action.excludedNextIncrement) &&
    !payloadText.includes(action.excludedLearningLog) &&
    !/次回|学び|learning_log|next_increment/.test(action.payload.payloadPreview)
  );
}

export function hasDispatchBlocker(input: { stopReasons: StopReason[]; browsers: BrowserReceipt[]; action: DispatchAction }): boolean {
  return (
    input.stopReasons.length > 0 ||
    input.browsers.some((browser) => browser.status === "未確認" || browser.status === "停止") ||
    !payloadContainsExecuteNowOnly(input.action) ||
    input.action.payload.destructiveCleanupRequest !== "なし"
  );
}

function makeBrowsers(status: BrowserReceipt["status"], evidencePrefix: string): BrowserReceipt[] {
  return browserNames.map((browser) => ({
    browser,
    status,
    evidencePath: status === "確認済み" || status === "実行中" ? `artifacts/screenshots/mvp080-${evidencePrefix}-${browser.toLowerCase()}.png` : "未保存"
  }));
}

const emptyReceipt: DispatchReceipt = {
  state: "empty",
  title: "Run Queue Dispatch Receipt",
  receiptId: "未採番",
  decision: "未選択",
  decisionTone: "neutral",
  message: "Dispatch対象のqueue itemを選択してください。",
  action: emptyAction,
  browsers: makeBrowsers("未確認", "empty"),
  reviewFindings: [],
  stopReasons: []
};

const readyReceipt: DispatchReceipt = {
  state: "ready",
  title: "Run Queue Dispatch Receipt",
  receiptId: "dispatch-mvp080-ready-001",
  decision: "Dispatch可能",
  decisionTone: "success",
  message: "Dispatch Receiptを発行できます",
  action: readyAction,
  browsers: makeBrowsers("確認済み", "ready"),
  reviewFindings: [],
  stopReasons: []
};

const runningReceipt: DispatchReceipt = {
  state: "running",
  title: "Run Queue Dispatch Receipt",
  receiptId: "dispatch-mvp080-running-001",
  decision: "実行中",
  decisionTone: "info",
  message: "実行中の証跡を収集中",
  action: {
    ...readyAction,
    progress: "dispatch commandを起動し、terminal log、browser screenshot、doctor結果を順に収集中。",
    pendingEvidence: ["failure screenshot未確定", "terminal evidence PNG生成待ち", "sanitize scan最終確認待ち"],
    nextRepairAction: "実行完了後、失敗があればReview Findingへ変換する。"
  },
  browsers: makeBrowsers("実行中", "running"),
  reviewFindings: [],
  stopReasons: []
};

const failureReceipt: DispatchReceipt = {
  state: "failure",
  title: "Run Queue Dispatch Receipt",
  receiptId: "dispatch-mvp080-failure-001",
  decision: "Review Findingあり",
  decisionTone: "warning",
  message: "実行後の失敗をReview Findingと次のRepair Action候補へ戻してください。",
  action: {
    ...readyAction,
    payload: { ...readyPayload, requiredEvidence: [], rollbackCondition: "Codex起動不能または証跡不足でrollback" },
    evidenceGate: "不足: required evidenceが未入力です。",
    rollbackGate: "発火: dispatch command失敗をRepair Actionへ戻す。",
    progress: "dispatch command失敗。検証ログは保存済みだがfailure screenshotを補う必要がある。",
    pendingEvidence: ["failure screenshot", "Codex起動不能ログのterminal evidence"],
    nextRepairAction: "Codex CLIが利用できない環境ではHermes実装に切り替え、起動不能ログを証跡化する。"
  },
  browsers: makeBrowsers("失敗", "failure"),
  reviewFindings: failureFindings,
  stopReasons: []
};

const blockedReceipt: DispatchReceipt = {
  state: "blocked",
  title: "Run Queue Dispatch Receipt",
  receiptId: "dispatch-mvp080-blocked-001",
  decision: "Dispatch停止",
  decisionTone: "danger",
  message: "危険なpayload混入または必須証跡不足があるため、Dispatchを停止しました。",
  action: blockedAction,
  browsers: [
    { browser: "Chromium", status: "確認済み", evidencePath: "artifacts/screenshots/mvp080-blocked-chromium.png" },
    { browser: "Firefox", status: "停止", evidencePath: "未保存" },
    { browser: "WebKit", status: "確認済み", evidencePath: "artifacts/screenshots/mvp080-blocked-webkit.png" }
  ],
  reviewFindings: [],
  stopReasons: blockedReasons
};
