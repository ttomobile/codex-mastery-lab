export type QaState = "empty" | "valid" | "failure" | "blocked";

export type Severity = "info" | "warning" | "error" | "blocker";

export type EvidenceFile = {
  label: string;
  path: string;
  status: "未選択" | "確認済み" | "不足" | "ブロック";
};

export type BrowserCoverage = {
  browser: "Chromium" | "Firefox" | "WebKit";
  status: "確認済み" | "未確認";
};

export type ReviewFinding = {
  category: string;
  severity: Severity;
  ideal_state: string;
  fix_instruction: string;
  verification_command: string;
  needed_upstream_info: string;
};

export type SanitizationFinding = {
  target: string;
  detected: string;
  reason: string;
  fix_instruction: string;
  verification_command: string;
};

export type PublicationEvidenceQa = {
  state: QaState;
  sourceDigestId: string | null;
  title: string;
  decision: "未選択" | "公開可能" | "公開QA不足" | "公開前停止";
  decisionTone: "neutral" | "success" | "warning" | "danger";
  articlePath: EvidenceFile;
  previewPath: EvidenceFile;
  assetCopy: EvidenceFile;
  terminalEvidence: EvidenceFile;
  screenshots: EvidenceFile[];
  browserCoverage: BrowserCoverage[];
  consoleStatus: string;
  sanitizationScan: {
    status: "未実行" | "通過" | "要修正" | "ブロック";
    checkedTerms: string[];
    findings: SanitizationFinding[];
  };
  reviewRecordExcerpt: string;
  learningLogExcerpt: string;
  aiTaskPacketDelta: string;
  codexPromptDelta: string;
  publishChecklist: string[];
  reviewFindings: ReviewFinding[];
  requiredInputs: string[];
  aiddSpecConnection: {
    specVersion: "AIDD-Spec v0.1";
    standardPath: "standards/aidd-control-plane-mvp-v0.1.md";
    featureName: "Publication Evidence QA Gate";
    conformanceTarget: "L2";
    summary: string;
  };
};

const requiredInputs = [
  "article path",
  "preview path",
  "asset copy",
  "terminal evidence",
  "initial screenshot",
  "filled screenshot",
  "failure screenshot",
  "terminal evidence screenshot",
  "Chromium coverage",
  "Firefox coverage",
  "WebKit coverage",
  "console status",
  "sanitization scan",
  "AIDD-Spec connection"
];

const screenshotLabels = [
  "initial evidence PNG",
  "filled evidence PNG",
  "failure evidence PNG",
  "terminal evidence PNG"
];

const aiddSpecConnection = {
  specVersion: "AIDD-Spec v0.1" as const,
  standardPath: "standards/aidd-control-plane-mvp-v0.1.md" as const,
  featureName: "Publication Evidence QA Gate" as const,
  conformanceTarget: "L2" as const,
  summary:
    "Run Result Digest を note/preview 公開へ進める直前に、記事、画像、terminal evidence、3ブラウザ、console、サニタイズ、AIDD-Spec接続を公開前QAとして確認する。"
};

const baseBrowsers: BrowserCoverage[] = [
  { browser: "Chromium", status: "確認済み" },
  { browser: "Firefox", status: "確認済み" },
  { browser: "WebKit", status: "確認済み" }
];

const checkedTerms = [
  "local path",
  "private host",
  "private network URL",
  "Chromium / Firefox / WebKit",
  "AIDD-Spec v0.1"
];

export function normalizeQaState(value: string | string[] | undefined): QaState {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === "valid" || candidate === "failure" || candidate === "blocked") {
    return candidate;
  }
  return "empty";
}

export function getPublicationEvidenceQa(state: QaState): PublicationEvidenceQa {
  if (state === "valid") return validQa;
  if (state === "failure") return failureQa;
  if (state === "blocked") return blockedQa;
  return emptyQa;
}

export function hasPrivatePublicationLeak(text: string): boolean {
  return [
    /\/Users\/[^\s)]+/i,
    /file:\/\//i,
    /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|[^/\s.]+\.local)(?::\d+)?/i,
    /https?:\/\/(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(?::\d+)?/i
  ].some((pattern) => pattern.test(text));
}

export function toPublishDecision(input: {
  hasBlockingLeak: boolean;
  reviewFindings: ReviewFinding[];
}): PublicationEvidenceQa["decision"] {
  if (input.hasBlockingLeak) return "公開前停止";
  if (input.reviewFindings.length > 0) return "公開QA不足";
  return "公開可能";
}

const emptyQa: PublicationEvidenceQa = {
  state: "empty",
  sourceDigestId: null,
  title: "Publication Evidence QA Gate MVP076",
  decision: "未選択",
  decisionTone: "neutral",
  articlePath: { label: "article path", path: "未選択", status: "未選択" },
  previewPath: { label: "preview path", path: "未選択", status: "未選択" },
  assetCopy: { label: "asset copy", path: "未選択", status: "未選択" },
  terminalEvidence: { label: "terminal evidence", path: "未選択", status: "未選択" },
  screenshots: screenshotLabels.map((label) => ({ label, path: "未選択", status: "未選択" })),
  browserCoverage: baseBrowsers.map((item) => ({ ...item, status: "未確認" })),
  consoleStatus: "未確認",
  sanitizationScan: { status: "未実行", checkedTerms, findings: [] },
  reviewRecordExcerpt: "source digest 未選択のため未生成",
  learningLogExcerpt: "source digest 未選択のため未生成",
  aiTaskPacketDelta: "未生成",
  codexPromptDelta: "未生成",
  publishChecklist: requiredInputs,
  reviewFindings: [],
  requiredInputs,
  aiddSpecConnection
};

const validQa: PublicationEvidenceQa = {
  state: "valid",
  sourceDigestId: "digest-mvp076-valid",
  title: "Publication Evidence QA Gate MVP076",
  decision: "公開可能",
  decisionTone: "success",
  articlePath: { label: "article path", path: "articles/mvp076-publication-evidence-qa.md", status: "確認済み" },
  previewPath: { label: "preview path", path: "preview/mvp076-publication-evidence-qa.html", status: "確認済み" },
  assetCopy: { label: "asset copy status", path: "assets/mvp076-publication-evidence-qa-valid.png", status: "確認済み" },
  terminalEvidence: { label: "terminal evidence status", path: "artifacts/terminal/mvp076-valid.txt", status: "確認済み" },
  screenshots: screenshotLabels.map((label) => ({
    label,
    path: `artifacts/screenshots/mvp076-${label.split(" ")[0]}.png`,
    status: "確認済み"
  })),
  browserCoverage: baseBrowsers,
  consoleStatus: "console error / warn なし",
  sanitizationScan: { status: "通過", checkedTerms, findings: [] },
  reviewRecordExcerpt:
    "Review Record: 3ブラウザ、terminal evidence、必須スクリーンショット、console、sanitize、公開チェックリストが通過。",
  learningLogExcerpt:
    "Learning Log: 公開前QAは digest の内容だけでなく、記事とpreviewに出る証跡名まで確認する。",
  aiTaskPacketDelta:
    "AI Task Packet delta: 公開前に article path、preview path、画像コピー、terminal evidence、3ブラウザ、sanitize を確認する条件を追加。",
  codexPromptDelta:
    "Codex prompt delta: local path / private host / private network URL が混入した場合は公開前停止として扱う。",
  publishChecklist: [
    "記事観点がある",
    "preview が再生成済み",
    "assets と artifacts に同じ証跡が保存済み",
    "Chromium / Firefox / WebKit coverage が揃っている",
    "sanitization scan が通過",
    "AIDD-Spec v0.1 接続が明記済み"
  ],
  reviewFindings: [],
  requiredInputs,
  aiddSpecConnection
};

const failureFindings: ReviewFinding[] = [
  {
    category: "ブラウザ証跡不足",
    severity: "error",
    ideal_state: "Chromium / Firefox / WebKit coverage がすべて確認済みである",
    fix_instruction: "Firefox を含む3ブラウザE2Eを再実行し、Playwright report とスクリーンショットを保存する",
    verification_command: "pnpm run test:e2e",
    needed_upstream_info: "Firefox未確認の原因と対象run id"
  },
  {
    category: "terminal evidence不足",
    severity: "error",
    ideal_state: "lint / typecheck / test / build / test:e2e / doctor:aidd のログが保存済みである",
    fix_instruction: "不足しているterminal evidenceを artifacts/terminal に保存する",
    verification_command: "pnpm run capture:mvp076",
    needed_upstream_info: "不足ログのコマンド名"
  },
  {
    category: "failure screenshot不足",
    severity: "warning",
    ideal_state: "failure evidence PNG が記事とpreviewで参照できる",
    fix_instruction: "failure状態をcaptureし、assets と artifacts/screenshots の両方に保存する",
    verification_command: "pnpm run capture:mvp076",
    needed_upstream_info: "failure状態の再現条件"
  },
  {
    category: "console warn",
    severity: "warning",
    ideal_state: "browser console に error / warn がない",
    fix_instruction: "console warn の発生箇所を修正し、3ブラウザで再確認する",
    verification_command: "pnpm run test:e2e",
    needed_upstream_info: "warn本文と発生ブラウザ"
  },
  {
    category: "記事観点不足",
    severity: "warning",
    ideal_state: "背景、手順、証跡、失敗と修正が記事に含まれる",
    fix_instruction: "Review Record と Learning Log の抜粋を記事観点へ反映する",
    verification_command: "pnpm run doctor:aidd",
    needed_upstream_info: "記事で不足している見出し"
  },
  {
    category: "AIDD-Spec接続不足",
    severity: "error",
    ideal_state: "AIDD-Spec v0.1 と standards/aidd-control-plane-mvp-v0.1.md の Publication Evidence QA Gate に接続している",
    fix_instruction: "READMEと画面にAIDD-Spec接続を明記する",
    verification_command: "pnpm run doctor:aidd",
    needed_upstream_info: "対象標準文書の版"
  }
];

const failureQa: PublicationEvidenceQa = {
  ...validQa,
  state: "failure",
  sourceDigestId: "digest-mvp076-failure",
  decision: "公開QA不足",
  decisionTone: "warning",
  terminalEvidence: { label: "terminal evidence status", path: "artifacts/terminal/mvp076-partial.txt", status: "不足" },
  screenshots: [
    { label: "initial evidence PNG", path: "artifacts/screenshots/mvp076-initial.png", status: "確認済み" },
    { label: "filled evidence PNG", path: "artifacts/screenshots/mvp076-filled.png", status: "確認済み" },
    { label: "failure evidence PNG", path: "未保存", status: "不足" },
    { label: "terminal evidence PNG", path: "artifacts/screenshots/mvp076-terminal.png", status: "確認済み" }
  ],
  browserCoverage: [
    { browser: "Chromium", status: "確認済み" },
    { browser: "Firefox", status: "未確認" },
    { browser: "WebKit", status: "確認済み" }
  ],
  consoleStatus: "console warn 1件: 記事観点不足の警告",
  sanitizationScan: { status: "要修正", checkedTerms, findings: [] },
  reviewFindings: failureFindings
};

const blockedFindings: SanitizationFinding[] = [
  {
    target: "article path",
    detected: "/Users/sample/private-work/articles/draft.md",
    reason: "local path が公開物に混入",
    fix_instruction: "公開用の相対パスへ置換し、個人環境名を削除する",
    verification_command: "pnpm run doctor:aidd"
  },
  {
    target: "preview URL",
    detected: "http://internal-host.local:3000/preview/mvp076.html",
    reason: "private host が公開物に混入",
    fix_instruction: "公開previewの相対パスまたは公開URLへ置換する",
    verification_command: "pnpm run doctor:aidd"
  },
  {
    target: "terminal evidence",
    detected: "http://192.168.1.23:9323/report",
    reason: "private network URL が公開物に混入",
    fix_instruction: "private network URLを削除し、公開可能なartifact pathへ置換する",
    verification_command: "pnpm run doctor:aidd"
  }
];

const blockedQa: PublicationEvidenceQa = {
  ...validQa,
  state: "blocked",
  sourceDigestId: "digest-mvp076-blocked",
  decision: "公開前停止",
  decisionTone: "danger",
  articlePath: { label: "article path", path: "/Users/sample/private-work/articles/draft.md", status: "ブロック" },
  previewPath: { label: "preview path", path: "http://internal-host.local:3000/preview/mvp076.html", status: "ブロック" },
  terminalEvidence: { label: "terminal evidence status", path: "http://192.168.1.23:9323/report", status: "ブロック" },
  sanitizationScan: { status: "ブロック", checkedTerms, findings: blockedFindings },
  reviewFindings: [
    {
      category: "公開前サニタイズブロック",
      severity: "blocker",
      ideal_state: "local path / private host / private network URL が公開物に混入していない",
      fix_instruction: "検出された値を公開可能な相対パスへ置換し、再検証する",
      verification_command: "pnpm run doctor:aidd",
      needed_upstream_info: "公開用artifact pathとpreview path"
    }
  ]
};
