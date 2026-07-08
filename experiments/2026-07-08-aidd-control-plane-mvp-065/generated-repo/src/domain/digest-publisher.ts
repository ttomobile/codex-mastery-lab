export type DigestState = "empty" | "valid" | "failure" | "blocked";
export type BrowserName = "Chromium" | "Firefox" | "WebKit";
export type EvidenceStatus = "確認済み" | "不足" | "失敗" | "未確認";
export type PublishReadiness = "未入力" | "公開候補OK" | "失敗調査中" | "公開不可";

export type BrowserCoverage = Record<BrowserName, "通過" | "失敗" | "除外">;

export type PublicationDigestInput = {
  sourceDigestId: string;
  articlePath: string;
  preview: EvidenceStatus;
  assetCopy: EvidenceStatus;
  terminalEvidence: string;
  screenshots: {
    initial: string;
    filled: string;
    failure: string;
    terminal: string;
  };
  browserCoverage: BrowserCoverage;
  consoleStatus: string;
  sanitizationScan: string;
  reviewRecord: string;
  learningLog: string;
  aiTaskPacketDelta: string;
  codexPromptDelta: string;
  publishChecklist: string[];
  articlePerspective: string;
  aiddSpecConnection: string;
  publishReadiness: PublishReadiness;
};

export type ReviewFinding = {
  id: string;
  title: string;
  severity: "high" | "medium";
  detail: string;
  fixInstruction: string;
};

export type PublicationDigestViewModel = {
  state: DigestState;
  input: PublicationDigestInput;
  findings: ReviewFinding[];
  candidateMarkdown: string;
  qaSummary: string;
};

export const digestStates: DigestState[] = ["empty", "valid", "failure", "blocked"];
export const requiredBrowsers: BrowserName[] = ["Chromium", "Firefox", "WebKit"];
export const requiredScripts = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd",
  "pnpm run capture:mvp065"
] as const;

export const blockedFindingTitles = [
  "local path / host / private network URL混入",
  "Firefox除外",
  "terminal evidence不足",
  "記事観点不足",
  "AIDD-Spec接続不足"
] as const;

const emptyInput: PublicationDigestInput = {
  sourceDigestId: "",
  articlePath: "",
  preview: "未確認",
  assetCopy: "未確認",
  terminalEvidence: "未入力",
  screenshots: {
    initial: "未入力",
    filled: "未入力",
    failure: "未入力",
    terminal: "未入力"
  },
  browserCoverage: {
    Chromium: "除外",
    Firefox: "除外",
    WebKit: "除外"
  },
  consoleStatus: "未確認",
  sanitizationScan: "未確認",
  reviewRecord: "Review Record未入力",
  learningLog: "Learning Log未入力",
  aiTaskPacketDelta: "未入力",
  codexPromptDelta: "未入力",
  publishChecklist: [],
  articlePerspective: "未入力",
  aiddSpecConnection: "未入力",
  publishReadiness: "未入力"
};

const validInput: PublicationDigestInput = {
  sourceDigestId: "MVP065-PUBLICATION-EVIDENCE-QA-20260708",
  articlePath: "articles/mvp065-publication-evidence-qa-gate.md",
  preview: "確認済み",
  assetCopy: "確認済み",
  terminalEvidence: "artifacts/terminal/mvp065-verification.log",
  screenshots: {
    initial: "artifacts/screenshots/aidd-control-plane-mvp065-empty.png",
    filled: "artifacts/screenshots/aidd-control-plane-mvp065-valid.png",
    failure: "artifacts/screenshots/aidd-control-plane-mvp065-failure.png",
    terminal: "artifacts/screenshots/aidd-control-plane-mvp065-terminal-evidence.png"
  },
  browserCoverage: {
    Chromium: "通過",
    Firefox: "通過",
    WebKit: "通過"
  },
  consoleStatus: "console error/warnなし",
  sanitizationScan: "local path / host / private network URLなし",
  reviewRecord: "Review Record: 公開候補の証跡、記事、preview、asset copy、3ブラウザ、console、sanitization scanを同じQA Gateで確認した。",
  learningLog: "Learning Log: 公開前の判定は成功ログだけでなく、記事観点とAIDD-Spec接続を必須入力として扱う。",
  aiTaskPacketDelta: "次回AI Task Packet delta: 公開候補にはsource digest id、記事path、preview、asset copy、terminal evidence、3ブラウザ、sanitization scanを必ず含める。",
  codexPromptDelta: "Codex prompt delta: 公開前にdoctor:aiddを実行し、Firefox除外と公開危険文字列をReview Findingへ戻す。",
  publishChecklist: [
    "source digest idを確認",
    "article pathを確認",
    "previewを再生成",
    "asset copyを確認",
    "terminal evidenceを保存",
    "initial / filled / failure screenshotsを保存",
    "Chromium / Firefox / WebKitを通過",
    "console statusを確認",
    "sanitization scanを通過",
    "Review Record / Learning Log / AI Task Packet delta / Codex prompt deltaを接続"
  ],
  articlePerspective: "背景、手順、証跡、失敗と修正、AIDD-Specとの接続を1本の日本語記事として読める。",
  aiddSpecConnection: "AIDD-Specの公開前QAとして、検査対象、証跡、差分、公開判断を同じ候補ダイジェストに束ねる。",
  publishReadiness: "公開候補OK"
};

const failureInput: PublicationDigestInput = {
  ...validInput,
  sourceDigestId: "MVP065-PUBLICATION-EVIDENCE-QA-FAILED-20260708",
  preview: "失敗",
  assetCopy: "確認済み",
  terminalEvidence: "artifacts/terminal/mvp065-failure.log",
  browserCoverage: {
    Chromium: "通過",
    Firefox: "失敗",
    WebKit: "通過"
  },
  consoleStatus: "Firefoxでconsole warnを確認中",
  sanitizationScan: "公開危険文字列なし、preview生成失敗を調査中",
  reviewRecord: "Review Record: failureでは公開候補OKにせず、failure screenshotとterminal evidenceを残して再実行条件を固定する。",
  learningLog: "Learning Log: 失敗時は原因推測より先に、見えている画面とterminal evidenceを固定する。",
  publishReadiness: "失敗調査中"
};

const blockedInput: PublicationDigestInput = {
  ...emptyInput,
  sourceDigestId: "MVP065-BLOCKED-CANDIDATE",
  articlePath: "articles/mvp065-draft.md",
  preview: "確認済み",
  assetCopy: "不足",
  terminalEvidence: "不足",
  screenshots: {
    initial: "artifacts/screenshots/aidd-control-plane-mvp065-empty.png",
    filled: "artifacts/screenshots/aidd-control-plane-mvp065-blocked.png",
    failure: "不足",
    terminal: "不足"
  },
  browserCoverage: {
    Chromium: "通過",
    Firefox: "除外",
    WebKit: "通過"
  },
  consoleStatus: "未確認",
  sanitizationScan: "local path / host / private network URL混入の疑い",
  reviewRecord: "Review Record: Firefox除外、terminal evidence不足、公開危険文字列、記事観点不足、AIDD-Spec接続不足を公開前に止めた。",
  learningLog: "Learning Log: 不足を公開後の補足に回さず、Review Findingとして先に確定する。",
  aiTaskPacketDelta: "不足項目を次回AI Task Packet deltaへ戻す。",
  codexPromptDelta: "公開前QAで危険文字列とFirefox除外を検査する。",
  publishChecklist: ["blockedのReview Findingを解消する", "doctor:aiddを再実行する"],
  articlePerspective: "不足",
  aiddSpecConnection: "不足",
  publishReadiness: "公開不可"
};

export function evaluatePublicationDigest(input: PublicationDigestInput): DigestState {
  if (!input.sourceDigestId.trim() && !input.articlePath.trim()) return "empty";
  if (hasBlockedPublicationRisk(input)) return "blocked";
  if (input.preview === "失敗" || Object.values(input.browserCoverage).includes("失敗")) return "failure";
  return "valid";
}

export function createPublicationDigestViewModel(state: DigestState): PublicationDigestViewModel {
  const input = getInputForState(state);
  const evaluatedState = evaluatePublicationDigest(input);
  const findings = evaluatedState === "blocked" ? createBlockedFindings(input) : evaluatedState === "failure" ? createFailureFindings() : [];
  return {
    state: evaluatedState,
    input,
    findings,
    candidateMarkdown: evaluatedState === "valid" ? buildCandidateMarkdown(input) : "",
    qaSummary: buildQaSummary(input, evaluatedState)
  };
}

export function getInputForState(state: DigestState): PublicationDigestInput {
  if (state === "valid") return validInput;
  if (state === "failure") return failureInput;
  if (state === "blocked") return blockedInput;
  return emptyInput;
}

export function buildCandidateMarkdown(input: PublicationDigestInput): string {
  const browserLine = requiredBrowsers.map((browser) => `${browser}: ${input.browserCoverage[browser]}`).join(" / ");
  return [
    "## Publication Evidence QA Digest",
    "",
    `- source digest id: ${input.sourceDigestId}`,
    `- article path: ${input.articlePath}`,
    `- preview: ${input.preview}`,
    `- asset copy: ${input.assetCopy}`,
    `- terminal evidence: ${input.terminalEvidence}`,
    `- screenshots: initial=${input.screenshots.initial}, filled=${input.screenshots.filled}, failure=${input.screenshots.failure}, terminal=${input.screenshots.terminal}`,
    `- browser coverage: ${browserLine}`,
    `- console status: ${input.consoleStatus}`,
    `- sanitization scan: ${input.sanitizationScan}`,
    `- Review Record: ${input.reviewRecord}`,
    `- Learning Log: ${input.learningLog}`,
    `- AI Task Packet delta: ${input.aiTaskPacketDelta}`,
    `- Codex prompt delta: ${input.codexPromptDelta}`,
    `- article perspective: ${input.articlePerspective}`,
    `- AIDD-Spec connection: ${input.aiddSpecConnection}`,
    `- publish checklist: ${input.publishChecklist.join(" / ")}`,
    `- publish readiness: ${input.publishReadiness}`
  ].join("\n");
}

export function buildQaSummary(input: PublicationDigestInput, state: DigestState): string {
  return [
    `判定: ${state}`,
    `source digest id: ${input.sourceDigestId || "未入力"}`,
    `article path: ${input.articlePath || "未入力"}`,
    `sanitization scan: ${input.sanitizationScan}`,
    `publish readiness: ${input.publishReadiness}`
  ].join("\n");
}

function hasBlockedPublicationRisk(input: PublicationDigestInput): boolean {
  return (
    input.sanitizationScan.includes("混入") ||
    input.browserCoverage.Firefox === "除外" ||
    input.terminalEvidence === "不足" ||
    input.articlePerspective === "不足" ||
    input.aiddSpecConnection === "不足"
  );
}

function createBlockedFindings(input: PublicationDigestInput): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  if (input.sanitizationScan.includes("混入")) {
    findings.push({
      id: "dangerous-public-string",
      title: "local path / host / private network URL混入",
      severity: "high",
      detail: "公開候補に環境固有の文字列が残る可能性がある。",
      fixInstruction: "記事、preview、artifact、fixtureからlocal path、host、private network URLを取り除く。"
    });
  }
  if (input.browserCoverage.Firefox === "除外") {
    findings.push({
      id: "firefox-excluded",
      title: "Firefox除外",
      severity: "high",
      detail: "公開候補のE2E証跡からFirefoxが抜けている。",
      fixInstruction: "Playwright projectsにFirefoxを残し、timeoutとworkersで安定化する。"
    });
  }
  if (input.terminalEvidence === "不足") {
    findings.push({
      id: "terminal-evidence",
      title: "terminal evidence不足",
      severity: "high",
      detail: "lint/typecheck/test/build/e2e/doctor/captureの実行ログを追跡できない。",
      fixInstruction: "artifacts/terminalへ実行ログを保存し、公開候補ダイジェストへ紐づける。"
    });
  }
  if (input.articlePerspective === "不足") {
    findings.push({
      id: "article-perspective",
      title: "記事観点不足",
      severity: "medium",
      detail: "読者が背景、手順、証跡、失敗と修正を追える観点が足りない。",
      fixInstruction: "article perspectiveに公開記事で読むべき観点を1文で追加する。"
    });
  }
  if (input.aiddSpecConnection === "不足") {
    findings.push({
      id: "aidd-spec-connection",
      title: "AIDD-Spec接続不足",
      severity: "medium",
      detail: "公開候補がAIDD-Specのどの検査・差分・判断に接続するか説明できない。",
      fixInstruction: "AIDD-Spec connectionに検査対象と公開判断への接続を追記する。"
    });
  }
  return findings;
}

function createFailureFindings(): ReviewFinding[] {
  return [
    {
      id: "publication-failure",
      title: "failureは公開候補OKではない",
      severity: "medium",
      detail: "失敗状態は証跡として保存できるが、公開候補としては通さない。",
      fixInstruction: "failure screenshotとterminal evidenceを残し、再実行後にvalidへ切り替える。"
    }
  ];
}
