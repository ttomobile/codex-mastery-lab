export type PlannerState = "empty" | "planned" | "failure" | "blocked";

export type Severity = "info" | "warning" | "error" | "blocker";

export type BrowserName = "Chromium" | "Firefox" | "WebKit";

export type BrowserReceipt = {
  browser: BrowserName;
  status: "未確認" | "確認済み" | "失敗" | "停止";
  evidencePath: string;
};

export type RepairAction = {
  sourceReceipt: string;
  brokenUrl: string;
  findingCategory: string;
  severity: Severity;
  lane: "preview" | "asset" | "terminal" | "spec";
  priorityReason: string;
  executeNowAction: string;
  nextIncrement: string;
  learningLog: string;
  aiTaskPacketPatch: string;
  codexPromptPatch: string;
  verificationCommands: string[];
  requiredEvidence: string[];
  rollbackCondition: string;
  aiddSpecConnection: {
    specVersion: "AIDD-Spec v0.1";
    standardPath: "standards/aidd-control-plane-mvp-v0.1.md";
    upstreamGate: "MVP077 Preview Smoke Receipt Binder";
    featureName: "Smoke Receipt Repair Action Planner";
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

export type RepairPlanner = {
  state: PlannerState;
  title: "Smoke Receipt Repair Action Planner";
  receiptId: string;
  decision: "未入力" | "修正Action準備済み" | "Review Findingあり" | "実行前停止";
  decisionTone: "neutral" | "success" | "warning" | "danger";
  message: string;
  action: RepairAction;
  browsers: BrowserReceipt[];
  reviewFindings: ReviewFinding[];
  stopReasons: StopReason[];
};

export const browserNames: BrowserName[] = ["Chromium", "Firefox", "WebKit"];

const aiddSpecConnection: RepairAction["aiddSpecConnection"] = {
  specVersion: "AIDD-Spec v0.1",
  standardPath: "standards/aidd-control-plane-mvp-v0.1.md",
  upstreamGate: "MVP077 Preview Smoke Receipt Binder",
  featureName: "Smoke Receipt Repair Action Planner",
  summary:
    "Preview Smoke Receiptの失敗を、次の1回で実行する修正Action、検証コマンド、証跡、rollback条件へ畳み込む。"
};

const executeNowAction =
  "preview smoke receiptの404を直すため、scripts/build_preview.pyにmvp077 preview HTMLの出力登録を追加し、pnpm run build後にHTTP smokeを再実行してmvp078 planned receiptを保存する。";

const plannedAction: RepairAction = {
  sourceReceipt: "artifacts/receipts/mvp077/failure-404.yaml",
  brokenUrl: "https://publish.example.test/preview/mvp077-preview-smoke-receipt.html",
  findingCategory: "preview_html_404",
  severity: "error",
  lane: "preview",
  priorityReason:
    "公開preview HTMLが404のため、assetやterminal evidenceが存在しても記事読者が主画面を検証できない。",
  executeNowAction,
  nextIncrement:
    "修正後、receipt一覧にHTTP status、byte size、content type、latency msを追加し、記事側から参照できる索引を作る。",
  learningLog:
    "Preview生成登録漏れはcapture前にdoctorで検出する。URL到達性だけでなく、failure screenshotとterminal evidence PNGを同時に確認する。",
  aiTaskPacketPatch:
    "AI_TASK_PACKET.mdへ `repair_action: preview_html_404`、`required_evidence: planned/failure screenshot + terminal evidence`、`rollback_condition: preview 404再発` を追加する。",
  codexPromptPatch: executeNowAction,
  verificationCommands: [
    "pnpm run lint",
    "pnpm run typecheck",
    "pnpm run test",
    "pnpm run build",
    "pnpm run doctor:aidd",
    "pnpm run test:e2e"
  ],
  requiredEvidence: [
    "artifacts/screenshots/mvp078-planned.png",
    "artifacts/screenshots/mvp078-failure.png",
    "artifacts/screenshots/mvp078-terminal-evidence.png",
    "assets/mvp078-planned.png",
    "assets/mvp078-terminal-evidence.png"
  ],
  rollbackCondition:
    "preview HTMLがHTTP 200で取得できない、またはCodex prompt previewにexecute_now以外が混入した場合は公開登録を戻す。",
  aiddSpecConnection
};

const emptyAction: RepairAction = {
  ...plannedAction,
  sourceReceipt: "未選択",
  brokenUrl: "未入力",
  findingCategory: "未分類",
  severity: "info",
  lane: "preview",
  priorityReason: "Preview Smoke Receiptの失敗Receiptを選択してください。",
  executeNowAction: "未入力",
  nextIncrement: "未入力",
  learningLog: "未入力",
  aiTaskPacketPatch: "未入力",
  codexPromptPatch: "未入力",
  verificationCommands: [],
  requiredEvidence: [],
  rollbackCondition: "未入力"
};

const failureFindings: ReviewFinding[] = [
  {
    id: "missing-verification-commands",
    category: "検証コマンド不足",
    severity: "error",
    yaml: [
      "review_finding:",
      "  category: verification_commands_missing",
      "  severity: error",
      "  required: [lint, typecheck, test, build, doctor:aidd, test:e2e]",
      "  fix: verification commandsに実行すべきコマンドを列挙する"
    ].join("\n")
  },
  {
    id: "missing-required-evidence",
    category: "証跡不足",
    severity: "error",
    yaml: [
      "review_finding:",
      "  category: required_evidence_missing",
      "  severity: error",
      "  required: [planned_png, failure_png, terminal_evidence_png]",
      "  fix: artifacts/screenshots と assets の両方に保存する"
    ].join("\n")
  },
  {
    id: "missing-rollback",
    category: "rollback不足",
    severity: "error",
    yaml: [
      "review_finding:",
      "  category: rollback_condition_missing",
      "  severity: error",
      "  required: preview 404再発時の戻し条件",
      "  fix: rollback conditionをActionに含める"
    ].join("\n")
  },
  {
    id: "missing-aidd-spec",
    category: "AIDD-Spec接続不足",
    severity: "error",
    yaml: [
      "review_finding:",
      "  category: aidd_spec_connection_missing",
      "  severity: error",
      "  required: AIDD-Spec v0.1 と MVP077 upstream gate",
      "  fix: AIDD-Spec connectionをActionへ明記する"
    ].join("\n")
  }
];

const blockedReasons: StopReason[] = [
  { category: "private URL", severity: "blocker", reason: "private URLがbroken URLに混入しているため実行前停止。" },
  { category: "local path", severity: "blocker", reason: "local pathを公開preview証跡の代替にしているため実行前停止。" },
  { category: "Firefox除外", severity: "blocker", reason: "3ブラウザPlaywrightからFirefoxを除外しているため実行前停止。" },
  { category: "terminal evidence不足", severity: "blocker", reason: "terminal evidence PNGがrequired evidenceにないため実行前停止。" },
  { category: "failure screenshot不足", severity: "blocker", reason: "failure screenshotがrequired evidenceにないため実行前停止。" },
  {
    category: "execute_now以外のprompt混入",
    severity: "blocker",
    reason: "Codex prompt previewにnext_incrementまたはlearning_logが混入しているため実行前停止。"
  }
];

export function normalizeReceiptState(value: string | string[] | undefined): PlannerState {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === "planned" || candidate === "failure" || candidate === "blocked") return candidate;
  return "empty";
}

export function getRepairPlanner(state: PlannerState): RepairPlanner {
  if (state === "planned") return plannedPlanner;
  if (state === "failure") return failurePlanner;
  if (state === "blocked") return blockedPlanner;
  return emptyPlanner;
}

export function codexPromptContainsExecuteNowOnly(action: RepairAction): boolean {
  return (
    action.codexPromptPatch === action.executeNowAction &&
    !action.codexPromptPatch.includes(action.nextIncrement) &&
    !action.codexPromptPatch.includes(action.learningLog)
  );
}

export function hasExecutionBlocker(input: { stopReasons: StopReason[]; browsers: BrowserReceipt[] }): boolean {
  return input.stopReasons.length > 0 || input.browsers.some((browser) => browser.status === "未確認" || browser.status === "停止");
}

function makeBrowsers(status: BrowserReceipt["status"], evidencePrefix: string): BrowserReceipt[] {
  return browserNames.map((browser) => ({
    browser,
    status,
    evidencePath: status === "確認済み" ? `artifacts/screenshots/mvp078-${evidencePrefix}-${browser.toLowerCase()}.png` : "未保存"
  }));
}

const emptyPlanner: RepairPlanner = {
  state: "empty",
  title: "Smoke Receipt Repair Action Planner",
  receiptId: "未採番",
  decision: "未入力",
  decisionTone: "neutral",
  message: "Preview Smoke Receiptの失敗Receiptを選び、次の1回で実行する修正Actionへ畳み込んでください。",
  action: emptyAction,
  browsers: makeBrowsers("未確認", "empty"),
  reviewFindings: [],
  stopReasons: []
};

const plannedPlanner: RepairPlanner = {
  state: "planned",
  title: "Smoke Receipt Repair Action Planner",
  receiptId: "repair-action-mvp078-planned-001",
  decision: "修正Action準備済み",
  decisionTone: "success",
  message: "次の1回で実行する修正Actionが準備できました",
  action: plannedAction,
  browsers: makeBrowsers("確認済み", "planned"),
  reviewFindings: [],
  stopReasons: []
};

const failurePlanner: RepairPlanner = {
  state: "failure",
  title: "Smoke Receipt Repair Action Planner",
  receiptId: "repair-action-mvp078-failure-001",
  decision: "Review Findingあり",
  decisionTone: "warning",
  message: "修正Actionに必要な検証、証跡、rollback、AIDD-Spec接続が不足しています。",
  action: {
    ...plannedAction,
    verificationCommands: ["pnpm run test"],
    requiredEvidence: ["artifacts/screenshots/mvp078-planned.png"],
    rollbackCondition: "未入力",
    aiddSpecConnection: {
      ...aiddSpecConnection,
      summary: "未接続"
    }
  },
  browsers: makeBrowsers("失敗", "failure"),
  reviewFindings: failureFindings,
  stopReasons: []
};

const blockedPlanner: RepairPlanner = {
  state: "blocked",
  title: "Smoke Receipt Repair Action Planner",
  receiptId: "repair-action-mvp078-blocked-001",
  decision: "実行前停止",
  decisionTone: "danger",
  message: "実行前停止条件が残っているため、Codexへ修正Actionを渡せません。",
  action: {
    ...plannedAction,
    brokenUrl: "https://private.example.invalid/preview/mvp077.html",
    aiTaskPacketPatch: "local path: /Users/sample/codex-mastery-lab/preview/mvp077.html",
    codexPromptPatch: `${plannedAction.executeNowAction}\n${plannedAction.nextIncrement}\n${plannedAction.learningLog}`,
    requiredEvidence: ["artifacts/screenshots/mvp078-planned.png"]
  },
  browsers: [
    { browser: "Chromium", status: "確認済み", evidencePath: "artifacts/screenshots/mvp078-blocked-chromium.png" },
    { browser: "Firefox", status: "停止", evidencePath: "未保存" },
    { browser: "WebKit", status: "確認済み", evidencePath: "artifacts/screenshots/mvp078-blocked-webkit.png" }
  ],
  reviewFindings: [],
  stopReasons: blockedReasons
};
