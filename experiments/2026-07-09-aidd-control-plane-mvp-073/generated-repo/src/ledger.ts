export type QueueMode = "empty" | "queued" | "rejected" | "evidence_missing";

export type BrowserName = "Chromium" | "Firefox" | "WebKit";

export type SmokeActionRunQueuePayload = {
  execute_now: string[];
};

export type SmokeActionRunQueueItem = {
  sourceSmokeActionId: string;
  queueItemId: string;
  exported: boolean;
  codexCommand: string;
  sandboxMode: "danger-full-access" | "workspace-write" | "read-only";
  requiredVerificationCommands: string[];
  requiredBrowsers: BrowserName[];
  requiredEvidence: string[];
  rollbackPlan: string;
  aiddSpecConnections: string[];
  payload: SmokeActionRunQueuePayload;
  commandPreview: SmokeActionRunQueuePayload;
  submittedEvidence: {
    terminalFiles: string[];
    screenshots: string[];
    reports: string[];
  };
  intakeUrls: string[];
};

export type IntakeFinding = {
  key: string;
  label: string;
  detail: string;
};

export type QueueViewModel = {
  mode: QueueMode;
  item: SmokeActionRunQueueItem | null;
  rejectedFindings: IntakeFinding[];
  evidenceMissingFindings: IntakeFinding[];
  codexCommandPreview: string;
  runQueuePayloadPreview: string;
};

const requiredVerificationCommands = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd",
  "pnpm run capture:mvp073"
];

const requiredEvidence = [
  "artifacts/terminal/lint.txt",
  "artifacts/terminal/typecheck.txt",
  "artifacts/terminal/test.txt",
  "artifacts/terminal/build.txt",
  "artifacts/terminal/test-e2e.txt",
  "artifacts/terminal/doctor-aidd.txt",
  "artifacts/terminal/capture-mvp073.txt",
  "artifacts/screenshots/aidd-control-plane-mvp073-queued.png",
  "artifacts/screenshots/aidd-control-plane-mvp073-failure.png",
  "playwright-report/index.html",
  "assets/aidd-control-plane-mvp073-queued.png"
];

export const queuedRunQueueItem: SmokeActionRunQueueItem = {
  sourceSmokeActionId: "smoke-action-mvp073-link-regression-001",
  queueItemId: "run-queue-mvp073-0001",
  exported: true,
  codexCommand:
    "codex run --sandbox danger-full-access -- smoke-action-mvp073-link-regression-001",
  sandboxMode: "danger-full-access",
  requiredVerificationCommands,
  requiredBrowsers: ["Chromium", "Firefox", "WebKit"],
  requiredEvidence,
  rollbackPlan:
    "検証command、3ブラウザE2E、terminal evidence、failure screenshot、Playwright reportのいずれかが欠けた場合はRun Queue投入を取り消す。",
  aiddSpecConnections: [
    "Smoke Action",
    "Run Queue",
    "Codex Prompt",
    "Verification Evidence",
    "Review Record"
  ],
  payload: {
    execute_now: [
      "source smoke action idをRun Queue itemへ変換する",
      "Codex commandとsandbox modeを検証可能な形で固定する",
      "Chromium / Firefox / WebKitとrequired evidenceを揃えて実行前確認する"
    ]
  },
  commandPreview: {
    execute_now: [
      "source smoke action idをRun Queue itemへ変換する",
      "Codex commandとsandbox modeを検証可能な形で固定する",
      "Chromium / Firefox / WebKitとrequired evidenceを揃えて実行前確認する"
    ]
  },
  submittedEvidence: {
    terminalFiles: [
      "lint.txt",
      "typecheck.txt",
      "test.txt",
      "build.txt",
      "test-e2e.txt",
      "doctor-aidd.txt",
      "capture-mvp073.txt"
    ],
    screenshots: ["aidd-control-plane-mvp073-queued.png", "aidd-control-plane-mvp073-failure.png"],
    reports: ["playwright-report/index.html"]
  },
  intakeUrls: ["https://preview.example.invalid/articles/mvp073/smoke-action-run-queue-intake"]
};

const localPathSample = ["/", "Users", "/", "sample-user", "/private/run-queue.json"].join("");
const privateNetworkUrlSample = ["http://", "192", ".168", ".10", ".24:4173/internal"].join("");

export const rejectedRunQueueItem: SmokeActionRunQueueItem = {
  ...queuedRunQueueItem,
  sourceSmokeActionId: "smoke-action-mvp073-draft-unsafe-002",
  queueItemId: "run-queue-mvp073-rejected-0002",
  exported: false,
  codexCommand: "rm -rf .next && codex run --sandbox workspace-write --internal-network",
  sandboxMode: "workspace-write",
  requiredBrowsers: ["Chromium", "WebKit"],
  payload: {
    execute_now: ["未export actionを無理にRun Queueへ投入する"],
    next_increment: ["恒久DBへ投入する"],
    learning_log: ["失敗理由をあとで追記する"]
  } as SmokeActionRunQueuePayload,
  commandPreview: {
    execute_now: ["未export actionを無理にRun Queueへ投入する"],
    next_increment: ["恒久DBへ投入する"],
    learning_log: ["失敗理由をあとで追記する"]
  } as SmokeActionRunQueuePayload,
  intakeUrls: [
    localPathSample,
    privateNetworkUrlSample,
    "https://preview.example.invalid/articles/mvp073/smoke-action-run-queue-intake"
  ]
};

export const evidenceMissingRunQueueItem: SmokeActionRunQueueItem = {
  ...queuedRunQueueItem,
  queueItemId: "run-queue-mvp073-evidence-missing-0003",
  submittedEvidence: {
    terminalFiles: ["lint.txt", "typecheck.txt", "test.txt"],
    screenshots: ["aidd-control-plane-mvp073-queued.png"],
    reports: []
  }
};

const privateLocationPattern =
  /(?:\/Users\/|\/home\/|[A-Z]:\\|https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|private\.internal|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}))/i;

const dangerousCommandPattern = /\b(?:rm\s+-rf|sudo|curl\s+[^|]*\|\s*(?:sh|bash)|chmod\s+777)\b/i;

const requiredTerminalFiles = [
  "lint.txt",
  "typecheck.txt",
  "test.txt",
  "build.txt",
  "test-e2e.txt",
  "doctor-aidd.txt",
  "capture-mvp073.txt"
];

export function buildCodexCommandPreview(item: SmokeActionRunQueueItem): string {
  return JSON.stringify({ execute_now: item.commandPreview.execute_now }, null, 2);
}

export function buildRunQueuePayloadPreview(item: SmokeActionRunQueueItem): string {
  return JSON.stringify({ execute_now: item.payload.execute_now }, null, 2);
}

export function detectRejectedFindings(item: SmokeActionRunQueueItem): IntakeFinding[] {
  const findings: IntakeFinding[] = [];
  const payloadKeys = Object.keys(item.payload);
  const commandPreviewKeys = Object.keys(item.commandPreview);

  if (!item.exported) {
    findings.push({
      key: "unexported-action",
      label: "未export action",
      detail: "source smoke actionがexport済みではないためRun Queueへ投入できない。"
    });
  }

  if (
    payloadKeys.some((key) => key !== "execute_now") ||
    commandPreviewKeys.some((key) => key !== "execute_now")
  ) {
    findings.push({
      key: "execute-now-contamination",
      label: "execute_now以外混入",
      detail: "queued payloadとCodex command previewにはexecute_nowだけを入れる。"
    });
  }

  if (dangerousCommandPattern.test(item.codexCommand)) {
    findings.push({
      key: "dangerous-command",
      label: "危険command",
      detail: "破壊的commandまたはshell pipe実行がCodex commandに含まれている。"
    });
  }

  if (item.sandboxMode !== "danger-full-access") {
    findings.push({
      key: "insufficient-sandbox",
      label: "sandbox不足",
      detail: "指定commandは検証artifact作成を伴うためdanger-full-accessを要求する。"
    });
  }

  if (!item.requiredBrowsers.includes("Firefox")) {
    findings.push({
      key: "firefox-excluded",
      label: "Firefox除外",
      detail: "3ブラウザE2E要件からFirefoxが外れている。"
    });
  }

  if (item.intakeUrls.some((url) => privateLocationPattern.test(url))) {
    findings.push({
      key: "private-location",
      label: "local path/private network URL混入",
      detail: "公開前のRun Queue payloadにローカルpathまたはprivate network URLが含まれている。"
    });
  }

  return findings;
}

export function detectEvidenceMissingFindings(item: SmokeActionRunQueueItem): IntakeFinding[] {
  const findings: IntakeFinding[] = [];
  const missingTerminal = requiredTerminalFiles.filter(
    (file) => !item.submittedEvidence.terminalFiles.includes(file)
  );

  if (missingTerminal.length > 0) {
    findings.push({
      key: "terminal-evidence-missing",
      label: "terminal evidence不足",
      detail: `不足: ${missingTerminal.join(", ")}`
    });
  }

  if (!item.submittedEvidence.screenshots.includes("aidd-control-plane-mvp073-failure.png")) {
    findings.push({
      key: "failure-screenshot-missing",
      label: "failure screenshot不足",
      detail: "失敗時UIを確認できるスクリーンショットが提出されていない。"
    });
  }

  if (!item.submittedEvidence.reports.includes("playwright-report/index.html")) {
    findings.push({
      key: "playwright-report-missing",
      label: "Playwright report不足",
      detail: "3ブラウザE2EのHTML reportが提出されていない。"
    });
  }

  return findings;
}

export function getQueueViewModel(mode: QueueMode): QueueViewModel {
  if (mode === "empty") {
    return {
      mode,
      item: null,
      rejectedFindings: [],
      evidenceMissingFindings: [],
      codexCommandPreview: "",
      runQueuePayloadPreview: ""
    };
  }

  const item =
    mode === "rejected"
      ? rejectedRunQueueItem
      : mode === "evidence_missing"
        ? evidenceMissingRunQueueItem
        : queuedRunQueueItem;

  return {
    mode,
    item,
    rejectedFindings: mode === "rejected" ? detectRejectedFindings(item) : [],
    evidenceMissingFindings:
      mode === "evidence_missing" ? detectEvidenceMissingFindings(item) : [],
    codexCommandPreview: buildCodexCommandPreview(item),
    runQueuePayloadPreview: buildRunQueuePayloadPreview(item)
  };
}
