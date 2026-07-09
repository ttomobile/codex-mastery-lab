export type QueueState = "empty" | "ready" | "failure" | "blocked";

export type Severity = "info" | "warning" | "error" | "blocker";

export type BrowserName = "Chromium" | "Firefox" | "WebKit";

export type BrowserReceipt = {
  browser: BrowserName;
  status: "未確認" | "確認済み" | "失敗" | "停止";
  evidencePath: string;
};

export type RunQueuePayload = {
  sourceRepairAction: string;
  executeNowSummary: string;
  codexPromptPreview: string;
  verificationCommands: string[];
  requiredEvidence: string[];
  rollbackCondition: string;
  destructiveCleanupRequest: string;
};

export type QueueAction = {
  sourceRepairAction: string;
  queuePayload: RunQueuePayload;
  executeNowSummary: string;
  excludedNextIncrement: string;
  excludedLearningLog: string;
  verificationGate: string;
  evidenceGate: string;
  rollbackGate: string;
  sanitizeGate: string;
  aiddSpecConnection: {
    specVersion: "AIDD-Spec v0.1";
    standardPath: "standards/aidd-control-plane-mvp-v0.1.md";
    upstreamGate: "MVP078 Smoke Receipt Repair Action Planner";
    featureName: "Repair Action Run Queue Intake";
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

export type QueuePlanner = {
  state: QueueState;
  title: "Repair Action Run Queue Intake";
  queueId: string;
  decision: "未選択" | "キュー投入可能" | "Review Findingあり" | "実行前停止";
  decisionTone: "neutral" | "success" | "warning" | "danger";
  message: string;
  action: QueueAction;
  browsers: BrowserReceipt[];
  reviewFindings: ReviewFinding[];
  stopReasons: StopReason[];
};

export const browserNames: BrowserName[] = ["Chromium", "Firefox", "WebKit"];

const executeNowSummary =
  "MVP078でreadyになったpreview asset修正Actionだけを実行キューへ入れ、build_preview登録、HTTP smoke再実行、terminal evidence画像保存を1回の作業範囲に固定する。";

const aiddSpecConnection: QueueAction["aiddSpecConnection"] = {
  specVersion: "AIDD-Spec v0.1",
  standardPath: "standards/aidd-control-plane-mvp-v0.1.md",
  upstreamGate: "MVP078 Smoke Receipt Repair Action Planner",
  featureName: "Repair Action Run Queue Intake",
  summary:
    "Repair Actionを実Codex実行キューへ入れる前に、payload、検証、証跡、rollback、sanitize、破壊的cleanup禁止を確認する。"
};

const readyPayload: RunQueuePayload = {
  sourceRepairAction: "repair-action-mvp078-ready-001",
  executeNowSummary,
  codexPromptPreview: executeNowSummary,
  verificationCommands: [
    "pnpm run lint",
    "pnpm run typecheck",
    "pnpm run test",
    "pnpm run build",
    "pnpm run test:e2e",
    "pnpm run doctor:aidd"
  ],
  requiredEvidence: [
    "artifacts/screenshots/mvp079-ready.png",
    "artifacts/screenshots/mvp079-failure.png",
    "artifacts/screenshots/mvp079-terminal-evidence.png",
    "assets/mvp079-ready.png",
    "assets/mvp079-terminal-evidence.png"
  ],
  rollbackCondition:
    "queue payloadにexecute_now以外が混入した、3ブラウザのいずれかが未確認、またはterminal evidence PNGが保存できない場合はキュー投入を取り消す。",
  destructiveCleanupRequest: "なし"
};

const readyAction: QueueAction = {
  sourceRepairAction: readyPayload.sourceRepairAction,
  queuePayload: readyPayload,
  executeNowSummary,
  excludedNextIncrement:
    "次回: 複数Repair Actionの優先順位付けと、queue履歴の比較ビューを追加する。",
  excludedLearningLog:
    "学び: promptに学習メモを混ぜると作業範囲が膨らむため、Learning Logは別欄に隔離する。",
  verificationGate: "lint / typecheck / unit / build / 3ブラウザE2E / doctor:aidd が揃っている。",
  evidenceGate: "empty / ready / failure / blocked / terminal evidence画像をassetsとartifacts/screenshotsの両方に保存する。",
  rollbackGate: readyPayload.rollbackCondition,
  sanitizeGate: "private URL、local path、private host、ホスト名、ローカル絶対パスをqueue payloadへ入れない。",
  aiddSpecConnection
};

const emptyPayload: RunQueuePayload = {
  ...readyPayload,
  sourceRepairAction: "未選択",
  executeNowSummary: "未入力",
  codexPromptPreview: "未入力",
  verificationCommands: [],
  requiredEvidence: [],
  rollbackCondition: "未入力",
  destructiveCleanupRequest: "未入力"
};

const emptyAction: QueueAction = {
  ...readyAction,
  sourceRepairAction: "未選択",
  queuePayload: emptyPayload,
  executeNowSummary: "未入力",
  excludedNextIncrement: "未入力",
  excludedLearningLog: "未入力",
  verificationGate: "未入力",
  evidenceGate: "未入力",
  rollbackGate: "未入力",
  sanitizeGate: "未入力"
};

const failureFindings: ReviewFinding[] = [
  {
    id: "verification-gate-missing",
    category: "検証ゲート不足",
    severity: "error",
    yaml: [
      "review_finding:",
      "  category: verification_gate_missing",
      "  severity: error",
      "  required: [lint, typecheck, test, build, test:e2e, doctor:aidd]",
      "  fix: queue payloadへ検証コマンドを明記する"
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
      "  required: [ready_png, failure_png, terminal_evidence_png]",
      "  fix: required evidenceをassetsとartifacts/screenshotsに保存する"
    ].join("\n")
  },
  {
    id: "rollback-gate-missing",
    category: "rollbackゲート不足",
    severity: "error",
    yaml: [
      "review_finding:",
      "  category: rollback_gate_missing",
      "  severity: error",
      "  required: queue投入を取り消す条件",
      "  fix: rollback conditionをpayloadに含める"
    ].join("\n")
  },
  {
    id: "aidd-spec-gate-missing",
    category: "AIDD-Spec接続不足",
    severity: "error",
    yaml: [
      "review_finding:",
      "  category: aidd_spec_connection_missing",
      "  severity: error",
      "  required: AIDD-Spec v0.1 と MVP078 upstream gate",
      "  fix: AIDD-Spec connectionをqueue intakeに明記する"
    ].join("\n")
  }
];

const blockedPayload: RunQueuePayload = {
  ...readyPayload,
  codexPromptPreview: `${executeNowSummary}\n次回: 複数Repair Actionをまとめて処理する。\n学び: prompt混入は危険。`,
  requiredEvidence: ["assets/mvp079-ready.png"],
  destructiveCleanupRequest: "rm -rf .next test-results playwright-report を実行してから検証する"
};

const blockedAction: QueueAction = {
  ...readyAction,
  queuePayload: blockedPayload,
  verificationGate: "Firefoxが除外され、3ブラウザE2Eの証跡が揃っていない。",
  evidenceGate: "terminal evidenceとfailure screenshotが不足している。",
  rollbackGate: "破壊的cleanup要求が含まれているためキュー投入不可。",
  sanitizeGate: "private URLまたはlocal pathがpayloadへ混入している。"
};

const blockedReasons: StopReason[] = [
  { category: "private URL", severity: "blocker", reason: "private URLがqueue payloadに混入しているため実行前停止。" },
  { category: "local path", severity: "blocker", reason: "local pathを公開証跡の代替にしているため実行前停止。" },
  { category: "Firefox除外", severity: "blocker", reason: "3ブラウザE2EからFirefoxを除外しているため実行前停止。" },
  { category: "terminal evidence不足", severity: "blocker", reason: "terminal evidence PNGがrequired evidenceにないため実行前停止。" },
  { category: "failure screenshot不足", severity: "blocker", reason: "failure screenshotがrequired evidenceにないため実行前停止。" },
  { category: "next_increment混入", severity: "blocker", reason: "queue payloadにnext_increment相当の文が混入しているため実行前停止。" },
  { category: "learning_log混入", severity: "blocker", reason: "queue payloadにlearning_log相当の文が混入しているため実行前停止。" },
  { category: "破壊的cleanup要求", severity: "blocker", reason: "rm -rf .next/test-results/playwright-report要求は安全ゲートで止める。" }
];

export function normalizeQueueState(value: string | string[] | undefined): QueueState {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === "ready" || candidate === "failure" || candidate === "blocked") return candidate;
  return "empty";
}

export function getQueuePlanner(state: QueueState): QueuePlanner {
  if (state === "ready") return readyPlanner;
  if (state === "failure") return failurePlanner;
  if (state === "blocked") return blockedPlanner;
  return emptyPlanner;
}

export function queuePayloadContainsExecuteNowOnly(action: QueueAction): boolean {
  const payloadText = JSON.stringify(action.queuePayload);
  return (
    action.queuePayload.codexPromptPreview === action.queuePayload.executeNowSummary &&
    !payloadText.includes(action.excludedNextIncrement) &&
    !payloadText.includes(action.excludedLearningLog) &&
    !/次回|学び|learning_log|next_increment/.test(action.queuePayload.codexPromptPreview)
  );
}

export function hasExecutionBlocker(input: { stopReasons: StopReason[]; browsers: BrowserReceipt[]; action: QueueAction }): boolean {
  return (
    input.stopReasons.length > 0 ||
    input.browsers.some((browser) => browser.status === "未確認" || browser.status === "停止") ||
    !queuePayloadContainsExecuteNowOnly(input.action) ||
    input.action.queuePayload.destructiveCleanupRequest !== "なし"
  );
}

function makeBrowsers(status: BrowserReceipt["status"], evidencePrefix: string): BrowserReceipt[] {
  return browserNames.map((browser) => ({
    browser,
    status,
    evidencePath: status === "確認済み" ? `artifacts/screenshots/mvp079-${evidencePrefix}-${browser.toLowerCase()}.png` : "未保存"
  }));
}

const emptyPlanner: QueuePlanner = {
  state: "empty",
  title: "Repair Action Run Queue Intake",
  queueId: "未採番",
  decision: "未選択",
  decisionTone: "neutral",
  message: "実行キューへ入れるRepair Actionを選択してください。",
  action: emptyAction,
  browsers: makeBrowsers("未確認", "empty"),
  reviewFindings: [],
  stopReasons: []
};

const readyPlanner: QueuePlanner = {
  state: "ready",
  title: "Repair Action Run Queue Intake",
  queueId: "run-queue-mvp079-ready-001",
  decision: "キュー投入可能",
  decisionTone: "success",
  message: "実行キュー投入前チェックを通過しました",
  action: readyAction,
  browsers: makeBrowsers("確認済み", "ready"),
  reviewFindings: [],
  stopReasons: []
};

const failurePlanner: QueuePlanner = {
  state: "failure",
  title: "Repair Action Run Queue Intake",
  queueId: "run-queue-mvp079-failure-001",
  decision: "Review Findingあり",
  decisionTone: "warning",
  message: "キュー投入前に検証、証跡、rollback、AIDD-Spec接続の不足を直してください。",
  action: {
    ...readyAction,
    queuePayload: { ...readyPayload, verificationCommands: [], requiredEvidence: [], rollbackCondition: "未入力" },
    verificationGate: "不足: 検証コマンドが未入力です。",
    evidenceGate: "不足: required evidenceが未入力です。",
    rollbackGate: "不足: rollback conditionが未入力です。"
  },
  browsers: makeBrowsers("失敗", "failure"),
  reviewFindings: failureFindings,
  stopReasons: []
};

const blockedPlanner: QueuePlanner = {
  state: "blocked",
  title: "Repair Action Run Queue Intake",
  queueId: "run-queue-mvp079-blocked-001",
  decision: "実行前停止",
  decisionTone: "danger",
  message: "危険なpayload混入または必須証跡不足があるため、Codex実行キューへ投入できません。",
  action: blockedAction,
  browsers: [
    { browser: "Chromium", status: "確認済み", evidencePath: "artifacts/screenshots/mvp079-blocked-chromium.png" },
    { browser: "Firefox", status: "停止", evidencePath: "未保存" },
    { browser: "WebKit", status: "確認済み", evidencePath: "artifacts/screenshots/mvp079-blocked-webkit.png" }
  ],
  reviewFindings: [],
  stopReasons: blockedReasons
};
