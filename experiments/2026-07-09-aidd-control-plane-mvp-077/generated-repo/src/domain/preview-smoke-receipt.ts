export type ReceiptState = "empty" | "valid" | "failure" | "blocked";

export type Severity = "info" | "warning" | "error" | "blocker";

export type BrowserName = "Chromium" | "Firefox" | "WebKit";

export type BrowserReceipt = {
  browser: BrowserName;
  status: "未確認" | "確認済み" | "失敗" | "停止";
  consoleStatus: string;
  evidencePath: string;
};

export type CheckedUrl = {
  label: string;
  url: string;
  httpStatus: number | "未確認";
  byteSize: number | "未確認";
  contentType: string;
  latencyMs: number | "未確認";
  checkedAt: string;
  evidencePath: string;
};

export type ReviewFinding = {
  category: string;
  severity: Severity;
  observed: string;
  expected: string;
  fixInstruction: string;
};

export type StopReason = {
  category: string;
  severity: "blocker";
  reason: string;
  publishImpact: string;
};

export type ReceiptBinder = {
  state: ReceiptState;
  title: "Preview Smoke Receipt Binder";
  receiptId: string;
  sourceQaGateId: string;
  decision: "未入力" | "Receipt保存可能" | "Review Findingあり" | "公開前停止";
  decisionTone: "neutral" | "success" | "warning" | "danger";
  message: string;
  checkedUrls: CheckedUrl[];
  browsers: BrowserReceipt[];
  consoleStatus: string;
  sanitizationScan: {
    status: "未実行" | "通過" | "要修正" | "ブロック";
    summary: string;
  };
  aiddSpecConnection: {
    specVersion: "AIDD-Spec v0.1";
    standardPath: "standards/aidd-control-plane-mvp-v0.1.md";
    upstreamGate: "MVP076 Publication Evidence QA Gate";
    featureName: "Preview Smoke Receipt Binder";
    summary: string;
  };
  reviewFindings: ReviewFinding[];
  stopReasons: StopReason[];
};

export const browserNames: BrowserName[] = ["Chromium", "Firefox", "WebKit"];

const aiddSpecConnection: ReceiptBinder["aiddSpecConnection"] = {
  specVersion: "AIDD-Spec v0.1",
  standardPath: "standards/aidd-control-plane-mvp-v0.1.md",
  upstreamGate: "MVP076 Publication Evidence QA Gate",
  featureName: "Preview Smoke Receipt Binder",
  summary:
    "MVP076で公開前QAを通過したpreview HTML / asset / terminal evidence imageをHTTP経路で再読込し、公開可能なReceiptとして束ねる。"
};

const emptyUrl: CheckedUrl = {
  label: "未入力",
  url: "未入力",
  httpStatus: "未確認",
  byteSize: "未確認",
  contentType: "未確認",
  latencyMs: "未確認",
  checkedAt: "未確認",
  evidencePath: "未入力"
};

const validUrls: CheckedUrl[] = [
  {
    label: "公開preview HTML",
    url: "https://publish.example.test/preview/mvp076-publication-evidence-qa.html",
    httpStatus: 200,
    byteSize: 18422,
    contentType: "text/html; charset=utf-8",
    latencyMs: 118,
    checkedAt: "2026-07-09T09:10:11+09:00",
    evidencePath: "artifacts/receipts/mvp077/preview-html.chromium.png"
  },
  {
    label: "公開asset PNG",
    url: "https://publish.example.test/assets/mvp076-valid.png",
    httpStatus: 200,
    byteSize: 94418,
    contentType: "image/png",
    latencyMs: 142,
    checkedAt: "2026-07-09T09:10:14+09:00",
    evidencePath: "artifacts/receipts/mvp077/asset-png.firefox.png"
  },
  {
    label: "terminal evidence image",
    url: "https://publish.example.test/assets/mvp076-terminal-evidence.png",
    httpStatus: 200,
    byteSize: 76540,
    contentType: "image/png",
    latencyMs: 156,
    checkedAt: "2026-07-09T09:10:17+09:00",
    evidencePath: "artifacts/receipts/mvp077/terminal-evidence.webkit.png"
  }
];

const failureUrls: CheckedUrl[] = [
  {
    label: "公開preview HTML",
    url: "https://publish.example.test/preview/mvp076-publication-evidence-qa.html",
    httpStatus: 404,
    byteSize: 1320,
    contentType: "text/html; charset=utf-8",
    latencyMs: 91,
    checkedAt: "2026-07-09T09:24:01+09:00",
    evidencePath: "artifacts/receipts/mvp077/failure-404.png"
  },
  {
    label: "公開asset PNG",
    url: "https://publish.example.test/assets/mvp076-valid.png",
    httpStatus: 200,
    byteSize: 0,
    contentType: "image/png",
    latencyMs: 88,
    checkedAt: "2026-07-09T09:24:03+09:00",
    evidencePath: "artifacts/receipts/mvp077/failure-zero-byte.png"
  },
  {
    label: "terminal evidence image",
    url: "https://publish.example.test/assets/mvp076-terminal-evidence.png",
    httpStatus: 200,
    byteSize: 3920,
    contentType: "text/plain",
    latencyMs: 5200,
    checkedAt: "2026-07-09T09:24:08+09:00",
    evidencePath: "artifacts/receipts/mvp077/failure-content-type-latency.png"
  }
];

const blockedUrls: CheckedUrl[] = [
  {
    label: "private URL",
    url: "https://private.example.invalid/preview/mvp076.html",
    httpStatus: "未確認",
    byteSize: "未確認",
    contentType: "未確認",
    latencyMs: "未確認",
    checkedAt: "未確認",
    evidencePath: "未保存"
  },
  {
    label: "local path",
    url: "/Users/sample/codex-mastery-lab/preview/mvp076.html",
    httpStatus: "未確認",
    byteSize: "未確認",
    contentType: "未確認",
    latencyMs: "未確認",
    checkedAt: "未確認",
    evidencePath: "未保存"
  }
];

export function normalizeReceiptState(value: string | string[] | undefined): ReceiptState {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === "valid" || candidate === "failure" || candidate === "blocked") return candidate;
  return "empty";
}

export function getReceiptBinder(state: ReceiptState): ReceiptBinder {
  if (state === "valid") return validBinder;
  if (state === "failure") return failureBinder;
  if (state === "blocked") return blockedBinder;
  return emptyBinder;
}

export function evaluateUrl(url: CheckedUrl): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  if (url.httpStatus !== 200) {
    findings.push({
      category: "404",
      severity: "error",
      observed: `HTTP status: ${url.httpStatus}`,
      expected: "HTTP status は 200",
      fixInstruction: "公開previewとassetの配信先を再生成し、HTTP経路で再確認する"
    });
  }
  if (url.byteSize === 0) {
    findings.push({
      category: "0 byte",
      severity: "error",
      observed: "byte size: 0",
      expected: "byte size は 1 byte 以上",
      fixInstruction: "空ファイルを公開対象から外し、生成元のPNG/HTMLを再保存する"
    });
  }
  const expectsImage = url.label.includes("PNG") || url.label.includes("image") || url.url.endsWith(".png");
  if (expectsImage && !url.contentType.includes("image/png")) {
    findings.push({
      category: "content type mismatch",
      severity: "error",
      observed: `content type: ${url.contentType}`,
      expected: "PNG証跡は image/png で返す",
      fixInstruction: "公開ホストのMIME設定とasset copy先を修正する"
    });
  }
  if (typeof url.latencyMs === "number" && url.latencyMs > 3000) {
    findings.push({
      category: "latency超過",
      severity: "warning",
      observed: `latency ms: ${url.latencyMs}`,
      expected: "latency ms は 3000ms 以下",
      fixInstruction: "公開previewの配信経路を確認し、遅延が再現する場合はReceiptに理由を残す"
    });
  }
  return findings;
}

export function hasPublicationBlocker(input: { stopReasons: StopReason[]; browsers: BrowserReceipt[] }): boolean {
  return input.stopReasons.length > 0 || input.browsers.some((browser) => browser.status === "未確認" || browser.status === "停止");
}

function makeBrowsers(status: BrowserReceipt["status"], evidencePrefix: string): BrowserReceipt[] {
  return browserNames.map((browser) => ({
    browser,
    status,
    consoleStatus: status === "確認済み" ? "console error / warn なし" : "未確認",
    evidencePath: status === "確認済み" ? `artifacts/receipts/mvp077/${evidencePrefix}-${browser.toLowerCase()}.png` : "未保存"
  }));
}

const emptyBinder: ReceiptBinder = {
  state: "empty",
  title: "Preview Smoke Receipt Binder",
  receiptId: "未採番",
  sourceQaGateId: "未選択",
  decision: "未入力",
  decisionTone: "neutral",
  message: "公開preview HTML / asset / terminal evidence image のHTTP証跡を入力してください。",
  checkedUrls: [emptyUrl],
  browsers: makeBrowsers("未確認", "empty"),
  consoleStatus: "未確認",
  sanitizationScan: { status: "未実行", summary: "private URL / local path / local host 混入は未検査です。" },
  aiddSpecConnection,
  reviewFindings: [],
  stopReasons: []
};

const validBinder: ReceiptBinder = {
  state: "valid",
  title: "Preview Smoke Receipt Binder",
  receiptId: "receipt-mvp077-valid-001",
  sourceQaGateId: "qa-gate-mvp076-publication-evidence",
  decision: "Receipt保存可能",
  decisionTone: "success",
  message: "公開previewのHTTP証跡を保存できます",
  checkedUrls: validUrls,
  browsers: makeBrowsers("確認済み", "valid"),
  consoleStatus: "Chromium / Firefox / WebKit console error / warn なし",
  sanitizationScan: { status: "通過", summary: "private URL、local path、localhost、内部IPの混入なし。" },
  aiddSpecConnection,
  reviewFindings: [],
  stopReasons: []
};

const failureReviewFindings = failureUrls.flatMap(evaluateUrl);

const failureBinder: ReceiptBinder = {
  state: "failure",
  title: "Preview Smoke Receipt Binder",
  receiptId: "receipt-mvp077-failure-001",
  sourceQaGateId: "qa-gate-mvp076-publication-evidence",
  decision: "Review Findingあり",
  decisionTone: "warning",
  message: "HTTP smokeで修正可能な不一致を検出しました。",
  checkedUrls: failureUrls,
  browsers: makeBrowsers("確認済み", "failure"),
  consoleStatus: "console error なし / HTTP smoke finding あり",
  sanitizationScan: { status: "要修正", summary: "公開URL自体は外部向けだが、HTTP status、byte size、content type、latency ms に不一致があります。" },
  aiddSpecConnection,
  reviewFindings: failureReviewFindings,
  stopReasons: []
};

const blockedStopReasons: StopReason[] = [
  {
    category: "private URL",
    severity: "blocker",
    reason: "private URLがReceipt候補に混入しています。",
    publishImpact: "公開previewの読込事実として第三者検証できないため停止"
  },
  {
    category: "local path",
    severity: "blocker",
    reason: "local pathがHTTP証跡の代替として入力されています。",
    publishImpact: "公開経路のReceiptにならないため停止"
  },
  {
    category: "Firefox未確認",
    severity: "blocker",
    reason: "Firefoxでterminal evidence imageを未確認です。",
    publishImpact: "3ブラウザReceiptの条件を満たさないため停止"
  },
  {
    category: "receipt保存先不足",
    severity: "blocker",
    reason: "artifacts/receipts/mvp077/ の保存先が未確定です。",
    publishImpact: "後続の記事化でReceiptを参照できないため停止"
  },
  {
    category: "AIDD-Spec接続不足",
    severity: "blocker",
    reason: "MVP076 Publication Evidence QA Gateとの接続が未記録です。",
    publishImpact: "後段gateとしての追跡可能性が不足するため停止"
  }
];

const blockedBinder: ReceiptBinder = {
  state: "blocked",
  title: "Preview Smoke Receipt Binder",
  receiptId: "receipt-mvp077-blocked-001",
  sourceQaGateId: "未接続",
  decision: "公開前停止",
  decisionTone: "danger",
  message: "公開前停止の理由が残っています。",
  checkedUrls: blockedUrls,
  browsers: [
    { browser: "Chromium", status: "確認済み", consoleStatus: "console error / warn なし", evidencePath: "artifacts/receipts/mvp077/blocked-chromium.png" },
    { browser: "Firefox", status: "未確認", consoleStatus: "未確認", evidencePath: "未保存" },
    { browser: "WebKit", status: "確認済み", consoleStatus: "console error / warn なし", evidencePath: "artifacts/receipts/mvp077/blocked-webkit.png" }
  ],
  consoleStatus: "Firefox console 未確認",
  sanitizationScan: { status: "ブロック", summary: "private URL と local path を検出。公開前停止として扱います。" },
  aiddSpecConnection,
  reviewFindings: [],
  stopReasons: blockedStopReasons
};
