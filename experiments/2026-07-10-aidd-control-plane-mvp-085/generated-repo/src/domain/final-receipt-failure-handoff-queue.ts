export const handoffStates = ["empty", "queued", "blocked", "exported"] as const;

export type HandoffState = (typeof handoffStates)[number];
export type HandoffTone = "neutral" | "success" | "danger" | "warning";
export type BrowserName = "Chromium" | "Firefox" | "WebKit";
export type Lane = "execute_now" | "next_increment" | "learning_log";

export type BrokenReceipt = {
  sourceReceiptId: string;
  brokenUrl: string;
  httpStatus: number | "未確認";
  byteSize: number;
  contentType: string;
  latencyMs: number | "未確認";
};

export type ActionItem = {
  id: string;
  findingCategory: string;
  severity: "high" | "medium" | "low";
  lane: Lane;
  priorityReason: string;
  aiTaskPacketPatch: string;
  codexPromptPatch: string;
  verificationCommands: string[];
  requiredEvidence: string[];
  rollbackCondition: string;
  reviewFindingYaml: string;
  learningLog: string;
};

export type StatusItem = {
  label: string;
  status: "pass" | "fail" | "blocked" | "pending";
  detail: string;
};

export type BrowserCoverage = {
  browser: BrowserName;
  status: "pass" | "blocked";
  evidence: string;
};

export type HandoffView = {
  state: HandoffState;
  title: string;
  decision: string;
  tone: HandoffTone;
  message: string;
  sourceReceipt: BrokenReceipt;
  executeNow: ActionItem[];
  nextIncrement: ActionItem[];
  learningLog: ActionItem[];
  codexPromptPreview: string;
  browserCoverage: BrowserCoverage[];
  terminalEvidenceStatus: StatusItem[];
  failureScreenshotStatus: StatusItem[];
  consoleStatus: StatusItem[];
  sanitizationScan: StatusItem[];
  blockedReasons: string[];
  aiddSpecConnection: string;
};

export const verificationCommands = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
];

export const requiredEvidence = [
  "terminal evidence",
  "empty screenshot",
  "queued screenshot",
  "blocked screenshot",
  "exported screenshot",
  "failure screenshot",
  "Playwright report"
];

const sourceReceipt: BrokenReceipt = {
  sourceReceiptId: "final-receipt-mvp084-failure-001",
  brokenUrl: "https://public-preview.example/mvp084/assets/mvp084-terminal-evidence.png",
  httpStatus: 200,
  byteSize: 0,
  contentType: "application/octet-stream",
  latencyMs: 1810
};

const executeAction: ActionItem = makeAction({
  id: "action-mvp085-execute-now",
  category: "terminal evidence image failure",
  severity: "high",
  lane: "execute_now",
  reason: "terminal evidence画像が0 byteかつcontent type mismatchのため、公開前に1件だけ最優先で直す",
  packet: "Public Preview Smoke Final Receiptのterminal evidence image responseをimage/pngかつ非0 byteで確認し、captureとpreview asset copyを再検証する。",
  prompt: "execute_now: terminal evidence画像の0 byteとcontent type mismatchを修正し、pnpm run capture:mvp085 / test:e2e / doctor:aiddで証跡を保存してください。"
});

const nextAction: ActionItem = makeAction({
  id: "action-mvp085-next-increment",
  category: "latency over budget",
  severity: "medium",
  lane: "next_increment",
  reason: "latency超過は重要だが、まず0 byteとcontent type mismatchを直した後に計測し直す",
  packet: "次回、HTTP receiptにlatency予算と再試行回数を追加する。",
  prompt: "next_increment: latency超過をPublic Preview Smoke Verifierへ戻す。"
});

const learningAction: ActionItem = makeAction({
  id: "action-mvp085-learning-log",
  category: "preview evidence governance",
  severity: "low",
  lane: "learning_log",
  reason: "公開前QAの学びとして残すが、今回のCodex promptには入れない",
  packet: "Learning Logへ、terminal evidence画像はHTMLリンクだけでなくHTTP responseも確認するルールを追記する。",
  prompt: "learning_log: terminal evidence画像のHTTP response確認を標準化する。"
});

const passBrowsers: BrowserCoverage[] = [
  { browser: "Chromium", status: "pass", evidence: "Desktop Chrome projectで4状態を確認" },
  { browser: "Firefox", status: "pass", evidence: "Desktop Firefox projectで4状態を確認" },
  { browser: "WebKit", status: "pass", evidence: "Desktop Safari projectで4状態を確認" }
];

const blockedBrowsers: BrowserCoverage[] = [
  { browser: "Chromium", status: "pass", evidence: "Chromiumのみ確認済み" },
  { browser: "Firefox", status: "blocked", evidence: "Firefox未確認" },
  { browser: "WebKit", status: "blocked", evidence: "WebKit未確認" }
];

export function normalizeHandoffState(input: unknown): HandoffState {
  const value = Array.isArray(input) ? input[0] : input;
  return handoffStates.includes(value as HandoffState) ? (value as HandoffState) : "empty";
}

export function getHandoffView(state: HandoffState): HandoffView {
  if (state === "empty") {
    return baseView({
      state,
      title: "Final Receipt Failure Handoff Queue",
      decision: "action未生成",
      tone: "neutral",
      message: "最終レシートはあるが、Review Finding action queueへまだ変換していません。",
      executeNow: [],
      nextIncrement: [],
      learningLog: [],
      prompt: "execute_now itemが未生成のためCodex prompt previewは空です。",
      browserCoverage: blockedBrowsers,
      blockedReasons: ["action item不足", "terminal evidence未確認", "failure screenshot不足"]
    });
  }

  if (state === "blocked") {
    return baseView({
      state,
      title: "公開前に止めるHandoff Queue",
      decision: "blocked",
      tone: "danger",
      message: "private URL、local path、host名、Firefox未確認、証跡不足、rollback不足を検出したためCodex実行へ渡しません。",
      executeNow: [executeAction],
      nextIncrement: [nextAction],
      learningLog: [learningAction],
      prompt: "blocked: 公開用Codex promptは生成しません。",
      browserCoverage: blockedBrowsers,
      blockedReasons: ["private URL混入", "local path混入", "host名混入", "Firefox未確認", "terminal evidence不足", "failure screenshot不足", "rollback不足", "AIDD-Spec接続不足"]
    });
  }

  if (state === "exported") {
    return baseView({
      state,
      title: "execute_nowだけをCodexへ渡す",
      decision: "exported",
      tone: "success",
      message: "execute_nowだけをAI Task Packet patchとCodex prompt previewへ出力し、next_incrementとlearning_logは混ぜません。",
      executeNow: [executeAction],
      nextIncrement: [nextAction],
      learningLog: [learningAction],
      prompt: buildCodexPromptPreview([executeAction]),
      browserCoverage: passBrowsers,
      blockedReasons: []
    });
  }

  return baseView({
    state,
    title: "Final Receipt Failure Handoff Queue",
    decision: "queued",
    tone: "warning",
    message: "最終レシートの失敗をlane付きaction itemへ変換しました。まだCodexへ渡す前にexecute_nowのみに絞ります。",
    executeNow: [executeAction],
    nextIncrement: [nextAction],
    learningLog: [learningAction],
    prompt: "queued: execute_now候補をレビュー中。exportedになるまでCodex promptには渡しません。",
    browserCoverage: passBrowsers,
    blockedReasons: []
  });
}

function baseView(input: {
  state: HandoffState;
  title: string;
  decision: string;
  tone: HandoffTone;
  message: string;
  executeNow: ActionItem[];
  nextIncrement: ActionItem[];
  learningLog: ActionItem[];
  prompt: string;
  browserCoverage: BrowserCoverage[];
  blockedReasons: string[];
}): HandoffView {
  const blocked = input.state === "blocked";
  return {
    state: input.state,
    title: input.title,
    decision: input.decision,
    tone: input.tone,
    message: input.message,
    sourceReceipt,
    executeNow: input.executeNow,
    nextIncrement: input.nextIncrement,
    learningLog: input.learningLog,
    codexPromptPreview: input.prompt,
    browserCoverage: input.browserCoverage,
    terminalEvidenceStatus: [
      { label: "terminal evidence", status: blocked ? "blocked" : input.state === "empty" ? "pending" : "pass", detail: blocked ? "terminal evidence不足" : "artifacts/terminal/*.txtを保存" }
    ],
    failureScreenshotStatus: [
      { label: "failure screenshot", status: blocked ? "blocked" : input.state === "empty" ? "pending" : "pass", detail: blocked ? "failure screenshot不足" : "assets/mvp085-blocked.pngを含む必須PNGを保存" }
    ],
    consoleStatus: [
      { label: "browser console", status: blocked ? "blocked" : "pass", detail: blocked ? "console status未確認" : "error/warnなし" }
    ],
    sanitizationScan: [
      { label: "private URL", status: blocked ? "blocked" : "pass", detail: blocked ? "private URL混入を検出" : "公開用fixture URLのみ" },
      { label: "local path", status: blocked ? "blocked" : "pass", detail: blocked ? "local path混入を検出" : "ローカル絶対パスなし" },
      { label: "host名", status: blocked ? "blocked" : "pass", detail: blocked ? "host名混入を検出" : "ホスト名なし" }
    ],
    blockedReasons: input.blockedReasons,
    aiddSpecConnection: "AIDD-Spec v0.1 Verification Evidence / Review Record / Learning Log と AIDD Control Plane MVP v0.1 Public Preview Smoke Final Receipt後段"
  };
}

function makeAction(input: { id: string; category: string; severity: ActionItem["severity"]; lane: Lane; reason: string; packet: string; prompt: string }): ActionItem {
  return {
    id: input.id,
    findingCategory: input.category,
    severity: input.severity,
    lane: input.lane,
    priorityReason: input.reason,
    aiTaskPacketPatch: input.packet,
    codexPromptPatch: input.prompt,
    verificationCommands,
    requiredEvidence,
    rollbackCondition: "証跡が欠ける、Firefoxを除外する、またはlocal path/private URLが混じったらCodex投入を止める",
    reviewFindingYaml: `review_finding:\n  category: ${input.category}\n  severity: ${input.severity}\n  lane: ${input.lane}\n  needed_upstream_info:\n    - Verification Evidence\n    - Review Record\n    - Learning Log\n  standard_update: AIDD Control Plane Final Receipt Failure Handoff Queue`,
    learningLog: `Learning Log: ${input.reason}`
  };
}

function buildCodexPromptPreview(actions: ActionItem[]): string {
  return actions.map((action) => [
    "# Codex prompt preview",
    "execute_nowのみ:",
    `- ${action.codexPromptPatch}`,
    "禁止: next_increment / learning_logの混入",
    "検証: pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd"
  ].join("\n")).join("\n\n");
}
