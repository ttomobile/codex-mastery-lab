export const receiptStates = ["empty", "verified", "failure", "blocked"] as const;

export type ReceiptState = (typeof receiptStates)[number];
export type ReceiptTone = "neutral" | "success" | "danger" | "warning";
export type BrowserName = "Chromium" | "Firefox" | "WebKit";

export type HttpReceipt = {
  label: string;
  url: string;
  httpStatus: number | "未確認";
  byteSize: number;
  contentType: string;
  latencyMs: number | "未確認";
  checkedAt: string;
};

export type BrowserCoverage = {
  browser: BrowserName;
  status: "pass" | "fail" | "blocked";
  evidence: string;
};

export type ScanItem = {
  label: string;
  status: "pass" | "fail" | "blocked";
  detail: string;
};

export type FailureTransform = {
  source: string;
  reviewFindingYaml: string;
  learningLog: string;
  aiTaskPacketDelta: string;
  codexPromptDelta: string;
};

export type ReceiptView = {
  state: ReceiptState;
  title: string;
  decision: string;
  tone: ReceiptTone;
  message: string;
  receipts: HttpReceipt[];
  terminalEvidenceImageResponse: HttpReceipt;
  browserCoverage: BrowserCoverage[];
  consoleStatus: ScanItem[];
  sanitizationScan: ScanItem[];
  failureTransforms: FailureTransform[];
  blockedReasons: string[];
  verificationCommands: string[];
  requiredScreenshots: string[];
  aiddSpecConnection: string;
};

const checkedAt = "2026-07-10T09:00:00+09:00";

const verificationCommands = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run test:coverage",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
];

const requiredScreenshots = [
  "assets/mvp084-empty.png",
  "assets/mvp084-verified.png",
  "assets/mvp084-failure.png",
  "assets/mvp084-blocked.png",
  "assets/mvp084-terminal-evidence.png"
];

const verifiedReceipts: HttpReceipt[] = [
  {
    label: "preview HTML",
    url: "https://public-preview.example/mvp084/index.html",
    httpStatus: 200,
    byteSize: 48216,
    contentType: "text/html; charset=utf-8",
    latencyMs: 184,
    checkedAt
  },
  {
    label: "assets",
    url: "https://public-preview.example/mvp084/assets/mvp084-verified.png",
    httpStatus: 200,
    byteSize: 238944,
    contentType: "image/png",
    latencyMs: 221,
    checkedAt
  },
  {
    label: "terminal evidence image",
    url: "https://public-preview.example/mvp084/assets/mvp084-terminal-evidence.png",
    httpStatus: 200,
    byteSize: 165902,
    contentType: "image/png",
    latencyMs: 196,
    checkedAt
  }
];

const emptyReceipts: HttpReceipt[] = [
  { label: "preview HTML", url: "未入力", httpStatus: "未確認", byteSize: 0, contentType: "未確認", latencyMs: "未確認", checkedAt: "未確認" },
  { label: "assets", url: "未入力", httpStatus: "未確認", byteSize: 0, contentType: "未確認", latencyMs: "未確認", checkedAt: "未確認" },
  { label: "terminal evidence image", url: "未入力", httpStatus: "未確認", byteSize: 0, contentType: "未確認", latencyMs: "未確認", checkedAt: "未確認" }
];

const failureReceipts: HttpReceipt[] = [
  {
    label: "preview HTML",
    url: "https://public-preview.example/mvp084/index.html",
    httpStatus: 404,
    byteSize: 0,
    contentType: "text/plain",
    latencyMs: 318,
    checkedAt
  },
  {
    label: "assets",
    url: "https://public-preview.example/mvp084/assets/mvp084-verified.png",
    httpStatus: 200,
    byteSize: 0,
    contentType: "image/png",
    latencyMs: 241,
    checkedAt
  },
  {
    label: "terminal evidence image",
    url: "https://public-preview.example/mvp084/assets/mvp084-terminal-evidence.png",
    httpStatus: 200,
    byteSize: 165902,
    contentType: "application/octet-stream",
    latencyMs: 1810,
    checkedAt
  }
];

const blockedReceipts: HttpReceipt[] = [
  {
    label: "preview HTML",
    url: "[private URL redacted]",
    httpStatus: "未確認",
    byteSize: 0,
    contentType: "未確認",
    latencyMs: "未確認",
    checkedAt: "未確認"
  },
  {
    label: "assets",
    url: "[local path redacted]",
    httpStatus: "未確認",
    byteSize: 0,
    contentType: "未確認",
    latencyMs: "未確認",
    checkedAt: "未確認"
  },
  {
    label: "terminal evidence image",
    url: "未入力",
    httpStatus: "未確認",
    byteSize: 0,
    contentType: "未確認",
    latencyMs: "未確認",
    checkedAt: "未確認"
  }
];

const passBrowsers: BrowserCoverage[] = [
  { browser: "Chromium", status: "pass", evidence: "test:e2e Chromium project passed" },
  { browser: "Firefox", status: "pass", evidence: "test:e2e Firefox project passed" },
  { browser: "WebKit", status: "pass", evidence: "test:e2e WebKit project passed" }
];

const emptyBrowsers: BrowserCoverage[] = [
  { browser: "Chromium", status: "blocked", evidence: "public preview URL未入力" },
  { browser: "Firefox", status: "blocked", evidence: "public preview URL未入力" },
  { browser: "WebKit", status: "blocked", evidence: "public preview URL未入力" }
];

const failureTransforms: FailureTransform[] = [
  transformFailure("HTTP 404", "preview_html_404", "preview HTMLが404を返したため公開URLを再発行する"),
  transformFailure("0 byte", "asset_zero_byte", "assetが0 byteのためcapture出力とcopy経路を再実行する"),
  transformFailure("content type mismatch", "terminal_evidence_content_type_mismatch", "terminal evidence imageがimage/png以外で返るため配信設定を修正する"),
  transformFailure("latency超過", "terminal_evidence_latency_over_budget", "terminal evidence imageのlatencyが予算を超えたため公開前smokeに性能しきい値を追加する")
];

export function normalizeReceiptState(input: unknown): ReceiptState {
  const value = Array.isArray(input) ? input[0] : input;
  return receiptStates.includes(value as ReceiptState) ? (value as ReceiptState) : "empty";
}

export function getReceiptView(state: ReceiptState): ReceiptView {
  if (state === "empty") {
    return {
      state,
      title: "Public Preview Smoke Final Receipt",
      decision: "receipt待ち",
      tone: "neutral",
      message: "公開previewのURL、asset、terminal evidence imageのHTTP receiptが未入力です。計測値が揃うまで公開完了にしません。",
      receipts: emptyReceipts,
      terminalEvidenceImageResponse: emptyReceipts[2],
      browserCoverage: emptyBrowsers,
      consoleStatus: [{ label: "console", status: "blocked", detail: "Chromium / Firefox / WebKitのconsole未確認" }],
      sanitizationScan: [{ label: "sanitization scan", status: "blocked", detail: "private URL、local path、host名のscan未実行" }],
      failureTransforms: [],
      blockedReasons: [],
      verificationCommands,
      requiredScreenshots,
      aiddSpecConnection: "AIDD-Spec v0.1 Verification Evidence / Review Finding / Learning Log / AI Task Packet Delta / Codex Prompt Delta"
    };
  }

  if (state === "verified") {
    return {
      state,
      title: "Public Preview Smoke Final Receipt",
      decision: "verified",
      tone: "success",
      message: "preview HTML、assets、terminal evidence imageが200、非0 byte、期待content type、latency予算内で確認済みです。",
      receipts: verifiedReceipts,
      terminalEvidenceImageResponse: verifiedReceipts[2],
      browserCoverage: passBrowsers,
      consoleStatus: [
        { label: "Chromium console", status: "pass", detail: "error / failed requestなし" },
        { label: "Firefox console", status: "pass", detail: "error / failed requestなし" },
        { label: "WebKit console", status: "pass", detail: "error / failed requestなし" }
      ],
      sanitizationScan: [
        { label: "private URL", status: "pass", detail: "検出なし" },
        { label: "local path", status: "pass", detail: "検出なし" },
        { label: "host名", status: "pass", detail: "検出なし" }
      ],
      failureTransforms: [],
      blockedReasons: [],
      verificationCommands,
      requiredScreenshots,
      aiddSpecConnection: "AIDD-Spec v0.1 Verification Evidence is complete"
    };
  }

  if (state === "failure") {
    return {
      state,
      title: "Public Preview Smoke Final Receipt",
      decision: "failure: Review Findingへ変換",
      tone: "danger",
      message: "404、0 byte、content type mismatch、latency超過を検出しました。各失敗をReview Finding YAML、Learning Log、AI Task Packet delta、Codex prompt deltaへ変換します。",
      receipts: failureReceipts,
      terminalEvidenceImageResponse: failureReceipts[2],
      browserCoverage: [
        { browser: "Chromium", status: "fail", evidence: "preview HTML 404を検出" },
        { browser: "Firefox", status: "fail", evidence: "asset 0 byteを検出" },
        { browser: "WebKit", status: "fail", evidence: "terminal evidence content type mismatchを検出" }
      ],
      consoleStatus: [
        { label: "network", status: "fail", detail: "404 responseあり" },
        { label: "asset", status: "fail", detail: "0 byte responseあり" }
      ],
      sanitizationScan: [
        { label: "public text", status: "pass", detail: "private URL / local pathは未検出" },
        { label: "receipt metadata", status: "pass", detail: "公開可能な抽象URLのみ" }
      ],
      failureTransforms,
      blockedReasons: [],
      verificationCommands,
      requiredScreenshots,
      aiddSpecConnection: "AIDD-Spec v0.1 Review Finding / Learning Log / AI Task Packet Delta / Codex Prompt Delta"
    };
  }

  return {
    state,
    title: "Public Preview Smoke Final Receipt",
    decision: "blocked",
    tone: "warning",
    message: "公開前の安全性と証跡条件に不足があります。private URL、local path、host名、Firefox未確認、terminal evidence不足、AIDD-Spec接続不足、rollback不足を止めます。",
    receipts: blockedReceipts,
    terminalEvidenceImageResponse: blockedReceipts[2],
    browserCoverage: [
      { browser: "Chromium", status: "blocked", evidence: "公開可能URL未確定" },
      { browser: "Firefox", status: "blocked", evidence: "Firefox未確認" },
      { browser: "WebKit", status: "blocked", evidence: "公開可能URL未確定" }
    ],
    consoleStatus: [{ label: "console", status: "blocked", detail: "Firefox未確認のため3ブラウザconsole status未成立" }],
    sanitizationScan: [
      { label: "private URL", status: "blocked", detail: "private URLを含む入力を公開前に停止" },
      { label: "local path", status: "blocked", detail: "local pathを含む入力を公開前に停止" },
      { label: "host名", status: "blocked", detail: "host名を含む入力を公開前に停止" }
    ],
    failureTransforms: [],
    blockedReasons: ["private URL", "local path", "host名", "Firefox未確認", "terminal evidence不足", "AIDD-Spec接続不足", "rollback不足"],
    verificationCommands,
    requiredScreenshots,
    aiddSpecConnection: "AIDD-Spec接続不足"
  };
}

function transformFailure(source: string, id: string, instruction: string): FailureTransform {
  return {
    source,
    reviewFindingYaml: `review_finding:\n  id: ${id}\n  category: Public Preview Smoke\n  finding: ${source}\n  severity: high\n  fix_instruction: ${instruction}`,
    learningLog: `Learning Log: ${source}を公開前smokeの再発条件として記録し、次回receiptで同じ計測項目を必須にする。`,
    aiTaskPacketDelta: `AI Task Packet delta: verification.evidence.public_preview.${id} を必須項目へ追加する。`,
    codexPromptDelta: `Codex prompt delta: ${instruction}。修正後にlint/typecheck/test/test:coverage/build/test:e2e/doctor:aiddを再実行する。`
  };
}
