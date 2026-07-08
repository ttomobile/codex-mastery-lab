export type SmokeState = "empty" | "valid" | "failure" | "blocked";
export type BrowserName = "Chromium" | "Firefox" | "WebKit";
export type BrowserStatus = "通過" | "失敗" | "未確認";
export type SmokeReadiness = "未入力" | "公開preview確認OK" | "asset失敗調査中" | "公開preview確認不可";
export type HttpStatus = "ok" | "failure" | "blocked" | "unchecked";

export type CheckedUrl = {
  label: string;
  url: string;
  httpStatus: number | "未確認";
  byteSize: number | "未確認";
  contentType: string;
  latencyMs: number | "未確認";
  response: HttpStatus;
};

export type PublicPreviewSmokeInput = {
  smokeRunId: string;
  articlePath: string;
  previewPath: string;
  checkedUrls: CheckedUrl[];
  terminalEvidenceImageResponse: string;
  browserCoverage: Record<BrowserName, BrowserStatus>;
  consoleStatus: string;
  sanitizationScan: string;
  reviewRecord: string;
  learningLog: string;
  aiTaskPacketDelta: string;
  codexPromptDelta: string;
  rerunCommand: string;
  aiddSpecConnection: string;
  controlPlaneConnection: string;
  verificationEvidenceConnection: string;
  releaseChecklistConnection: string;
  smokeReadiness: SmokeReadiness;
};

export type ReviewFinding = {
  id: string;
  title: string;
  severity: "high" | "medium";
  detail: string;
  fixInstruction: string;
};

export type PublicPreviewSmokeViewModel = {
  state: SmokeState;
  input: PublicPreviewSmokeInput;
  findings: ReviewFinding[];
  candidateMarkdown: string;
  qaSummary: string;
};

export const digestStates: SmokeState[] = ["empty", "valid", "failure", "blocked"];
export const smokeStates = digestStates;
export const requiredBrowsers: BrowserName[] = ["Chromium", "Firefox", "WebKit"];
export const requiredScripts = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd",
  "pnpm run capture:mvp066"
] as const;

export const blockedFindingTitles = [
  "HTTP経路未確認",
  "private URL混入",
  "Firefox未確認",
  "terminal evidence image response不足",
  "AIDD-Spec接続不足"
] as const;

const publicPreviewPath = "preview/mvp066-public-preview-smoke-verifier.html";
const publicAssetPath = "assets/aidd-control-plane-mvp066-valid.png";

const emptyInput: PublicPreviewSmokeInput = {
  smokeRunId: "",
  articlePath: "",
  previewPath: "",
  checkedUrls: [],
  terminalEvidenceImageResponse: "未入力",
  browserCoverage: {
    Chromium: "未確認",
    Firefox: "未確認",
    WebKit: "未確認"
  },
  consoleStatus: "未確認",
  sanitizationScan: "未確認",
  reviewRecord: "Review Finding未入力",
  learningLog: "Learning Log未入力",
  aiTaskPacketDelta: "未入力",
  codexPromptDelta: "未入力",
  rerunCommand: "未入力",
  aiddSpecConnection: "未入力",
  controlPlaneConnection: "未入力",
  verificationEvidenceConnection: "未入力",
  releaseChecklistConnection: "未入力",
  smokeReadiness: "未入力"
};

const validInput: PublicPreviewSmokeInput = {
  smokeRunId: "MVP066-SMOKE-20260708-VALID",
  articlePath: "articles/mvp066-public-preview-smoke-verifier.md",
  previewPath: publicPreviewPath,
  checkedUrls: [
    {
      label: "公開preview HTML",
      url: publicPreviewPath,
      httpStatus: 200,
      byteSize: 48216,
      contentType: "text/html; charset=utf-8",
      latencyMs: 84,
      response: "ok"
    },
    {
      label: "公開asset PNG",
      url: publicAssetPath,
      httpStatus: 200,
      byteSize: 138904,
      contentType: "image/png",
      latencyMs: 42,
      response: "ok"
    }
  ],
  terminalEvidenceImageResponse: "200 image/png 74291 bytes 36ms",
  browserCoverage: {
    Chromium: "通過",
    Firefox: "通過",
    WebKit: "通過"
  },
  consoleStatus: "console error/warnなし",
  sanitizationScan: "local path / host / private network URLなし",
  reviewRecord: "Review Finding: MVP065 Publication Evidence QA Gateの後段で、公開preview HTMLとassetsをHTTP経路で読み、status、byte size、content type、latencyを検査した。",
  learningLog: "Learning Log: 公開前QAはファイル生成だけで終えず、読者が到達するHTTP経路でHTMLとassetを確認する。",
  aiTaskPacketDelta: "AI Task Packet delta: smoke run id、article path、preview URL/path、checked URLs、HTTP status、byte size、content type、latency ms、browser coverage、rerun commandを必須化する。",
  codexPromptDelta: "Codex prompt delta: Publication Evidence QA Gateの後段として、公開previewとassetsのHTTP smokeを4状態fixture、unit、3ブラウザE2E、capture、doctorで固定する。",
  rerunCommand: "pnpm run doctor:aidd && pnpm run test:e2e && pnpm run capture:mvp066",
  aiddSpecConnection: "AIDD-Spec v0.1: 仕様に対する公開確認を、入力、判定、証跡、再実行手順へ分解して追跡する。",
  controlPlaneConnection: "AIDD Control Plane MVP v0.1: 公開候補の状態をempty / valid / failure / blockedで制御し、次の行動をUIに返す。",
  verificationEvidenceConnection: "Verification Evidence: HTTP status、byte size、content type、latency ms、terminal evidence image responseを証跡として残す。",
  releaseChecklistConnection: "Release Checklist: 記事、preview HTML、assets、3ブラウザ、console、sanitization scan、rerun commandを公開前に確認する。",
  smokeReadiness: "公開preview確認OK"
};

const failureInput: PublicPreviewSmokeInput = {
  ...validInput,
  smokeRunId: "MVP066-SMOKE-20260708-ASSET-FAILURE",
  checkedUrls: [
    validInput.checkedUrls[0],
    {
      label: "公開asset PNG",
      url: publicAssetPath,
      httpStatus: 404,
      byteSize: 0,
      contentType: "text/plain; charset=utf-8",
      latencyMs: 57,
      response: "failure"
    }
  ],
  terminalEvidenceImageResponse: "200 image/png 74291 bytes 36ms",
  browserCoverage: {
    Chromium: "通過",
    Firefox: "通過",
    WebKit: "通過"
  },
  consoleStatus: "asset 404をconsoleで確認",
  sanitizationScan: "local path / host / private network URLなし",
  reviewRecord: "Review Finding: 失敗assetを公開候補OKにせず、404、byte size 0、content type、latencyを保持して再実行条件を固定した。",
  learningLog: "Learning Log: HTMLが200でもassetが404なら公開preview smokeはfailureとして扱う。",
  smokeReadiness: "asset失敗調査中"
};

const blockedInput: PublicPreviewSmokeInput = {
  ...emptyInput,
  smokeRunId: "MVP066-SMOKE-20260708-BLOCKED",
  articlePath: "articles/mvp066-public-preview-smoke-verifier-draft.md",
  previewPath: publicPreviewPath,
  checkedUrls: [
    {
      label: "公開preview HTML",
      url: "未公開のprivate preview URL",
      httpStatus: "未確認",
      byteSize: "未確認",
      contentType: "未確認",
      latencyMs: "未確認",
      response: "blocked"
    }
  ],
  terminalEvidenceImageResponse: "不足",
  browserCoverage: {
    Chromium: "通過",
    Firefox: "未確認",
    WebKit: "通過"
  },
  consoleStatus: "未確認",
  sanitizationScan: "private network URL混入の疑い",
  reviewRecord: "Review Finding: HTTP経路未確認、private URL混入、Firefox未確認、terminal evidence image response不足、AIDD-Spec接続不足を止めた。",
  learningLog: "Learning Log: 公開preview smokeのblockedは、失敗ではなく公開判断に必要な証跡が足りない状態として扱う。",
  aiTaskPacketDelta: "不足したHTTP smoke証跡を次回AI Task Packet deltaへ戻す。",
  codexPromptDelta: "公開前にHTTP smoke、3ブラウザ、sanitization scan、AIDD-Spec接続をdoctor:aiddで確認する。",
  rerunCommand: "pnpm run doctor:aidd && pnpm run capture:mvp066",
  aiddSpecConnection: "不足",
  controlPlaneConnection: "AIDD Control Plane MVP v0.1: blockedを公開不可として扱う。",
  verificationEvidenceConnection: "Verification Evidence: 不足",
  releaseChecklistConnection: "Release Checklist: blockedのReview Findingを解消してから再実行する。",
  smokeReadiness: "公開preview確認不可"
};

export function evaluatePublicPreviewSmoke(input: PublicPreviewSmokeInput): SmokeState {
  if (!input.smokeRunId.trim() && !input.articlePath.trim() && input.checkedUrls.length === 0) return "empty";
  if (hasBlockedSmokeRisk(input)) return "blocked";
  if (input.checkedUrls.some((item) => item.response === "failure" || item.httpStatus !== 200)) return "failure";
  return "valid";
}

export const evaluatePublicationDigest = evaluatePublicPreviewSmoke;

export function createPublicationDigestViewModel(state: SmokeState): PublicPreviewSmokeViewModel {
  const input = getInputForState(state);
  const evaluatedState = evaluatePublicPreviewSmoke(input);
  const findings = evaluatedState === "blocked" ? createBlockedFindings(input) : evaluatedState === "failure" ? createFailureFindings(input) : [];
  return {
    state: evaluatedState,
    input,
    findings,
    candidateMarkdown: evaluatedState === "valid" ? buildCandidateMarkdown(input) : "",
    qaSummary: buildQaSummary(input, evaluatedState)
  };
}

export function getInputForState(state: SmokeState): PublicPreviewSmokeInput {
  if (state === "valid") return validInput;
  if (state === "failure") return failureInput;
  if (state === "blocked") return blockedInput;
  return emptyInput;
}

export function buildCandidateMarkdown(input: PublicPreviewSmokeInput): string {
  const browserLine = requiredBrowsers.map((browser) => `${browser}: ${input.browserCoverage[browser]}`).join(" / ");
  const urlLines = input.checkedUrls.map((item) => `  - ${item.label}: ${item.url}, HTTP ${item.httpStatus}, ${item.byteSize} bytes, ${item.contentType}, ${item.latencyMs}ms, response=${item.response}`);
  return [
    "## Public Preview Smoke Digest",
    "",
    `- smoke run id: ${input.smokeRunId}`,
    `- article path: ${input.articlePath}`,
    `- preview URL/path: ${input.previewPath}`,
    "- checked URLs:",
    ...urlLines,
    `- terminal evidence image response: ${input.terminalEvidenceImageResponse}`,
    `- browser coverage: ${browserLine}`,
    `- console status: ${input.consoleStatus}`,
    `- sanitization scan: ${input.sanitizationScan}`,
    `- Review Finding: ${input.reviewRecord}`,
    `- Learning Log: ${input.learningLog}`,
    `- AI Task Packet delta: ${input.aiTaskPacketDelta}`,
    `- Codex prompt delta: ${input.codexPromptDelta}`,
    `- rerun command: ${input.rerunCommand}`,
    `- AIDD-Spec v0.1: ${input.aiddSpecConnection}`,
    `- AIDD Control Plane MVP v0.1: ${input.controlPlaneConnection}`,
    `- Verification Evidence: ${input.verificationEvidenceConnection}`,
    `- Release Checklist: ${input.releaseChecklistConnection}`,
    `- smoke readiness: ${input.smokeReadiness}`
  ].join("\n");
}

export function buildQaSummary(input: PublicPreviewSmokeInput, state: SmokeState): string {
  return [
    `判定: ${state}`,
    `smoke run id: ${input.smokeRunId || "未入力"}`,
    `article path: ${input.articlePath || "未入力"}`,
    `preview URL/path: ${input.previewPath || "未入力"}`,
    `checked URLs: ${input.checkedUrls.length}`,
    `sanitization scan: ${input.sanitizationScan}`,
    `smoke readiness: ${input.smokeReadiness}`
  ].join("\n");
}

function hasBlockedSmokeRisk(input: PublicPreviewSmokeInput): boolean {
  return (
    input.checkedUrls.some((item) => item.response === "blocked" || item.httpStatus === "未確認") ||
    input.sanitizationScan.includes("混入") ||
    input.browserCoverage.Firefox === "未確認" ||
    input.terminalEvidenceImageResponse === "不足" ||
    input.aiddSpecConnection === "不足"
  );
}

function createBlockedFindings(input: PublicPreviewSmokeInput): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  if (input.checkedUrls.some((item) => item.response === "blocked" || item.httpStatus === "未確認")) {
    findings.push({
      id: "http-route-unchecked",
      title: "HTTP経路未確認",
      severity: "high",
      detail: "公開preview HTMLまたはassetをHTTP経路で確認できていない。",
      fixInstruction: "公開preview HTMLとassetsをHTTPで取得し、status、byte size、content type、latencyを記録する。"
    });
  }
  if (input.sanitizationScan.includes("混入")) {
    findings.push({
      id: "private-url",
      title: "private URL混入",
      severity: "high",
      detail: "公開候補に環境固有またはprivate network URLが残る可能性がある。",
      fixInstruction: "記事、preview、artifact、fixtureからlocal path、host、private network URLを取り除く。"
    });
  }
  if (input.browserCoverage.Firefox === "未確認") {
    findings.push({
      id: "firefox-unchecked",
      title: "Firefox未確認",
      severity: "high",
      detail: "公開preview smokeの3ブラウザ証跡からFirefoxが抜けている。",
      fixInstruction: "Playwright projectsにFirefoxを残し、timeoutとworkersで安定化する。"
    });
  }
  if (input.terminalEvidenceImageResponse === "不足") {
    findings.push({
      id: "terminal-evidence-image-response",
      title: "terminal evidence image response不足",
      severity: "medium",
      detail: "terminal evidence画像のHTTP responseを確認できていない。",
      fixInstruction: "terminal evidence画像をHTTPで取得し、status、content type、byte size、latencyを保存する。"
    });
  }
  if (input.aiddSpecConnection === "不足") {
    findings.push({
      id: "aidd-spec-connection",
      title: "AIDD-Spec接続不足",
      severity: "medium",
      detail: "公開preview smokeがAIDD-Spec v0.1のどの検査・証跡・判断に接続するか説明できない。",
      fixInstruction: "AIDD-Spec v0.1、AIDD Control Plane MVP v0.1、Verification Evidence、Release Checklistへの接続文言を追記する。"
    });
  }
  return findings;
}

function createFailureFindings(input: PublicPreviewSmokeInput): ReviewFinding[] {
  const failed = input.checkedUrls.find((item) => item.response === "failure" || item.httpStatus !== 200);
  return [
    {
      id: "asset-http-failure",
      title: "失敗asset",
      severity: "high",
      detail: failed ? `${failed.label} がHTTP ${failed.httpStatus}で、公開preview smokeを通過していない。` : "公開preview smokeでHTTP失敗を検出した。",
      fixInstruction: "asset配置とpreview参照を修正し、rerun commandで再実行する。"
    }
  ];
}
