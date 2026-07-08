export type DigestState = "empty" | "valid" | "failure" | "blocked";
export type BrowserName = "Chromium" | "Firefox" | "WebKit";
export type PublishReadiness = "未入力" | "共有準備OK" | "失敗調査中" | "公開不可";

export type BrowserCoverage = Record<BrowserName, "通過" | "失敗" | "除外">;

export type DigestInput = {
  sourceRunId: string;
  runOutcome: string;
  score: number | null;
  terminalEvidence: string;
  screenshots: {
    initial: string;
    filled: string;
    failure: string;
    terminal: string;
  };
  browserCoverage: BrowserCoverage;
  consoleStatus: string;
  reviewRecord: string;
  learningLog: string;
  aiTaskPacketDelta: string;
  noteArticleAngle: string;
  publishReadiness: PublishReadiness;
};

export type ReviewFinding = {
  id: string;
  title: string;
  severity: "high" | "medium";
  detail: string;
  fixInstruction: string;
};

export type DigestViewModel = {
  state: DigestState;
  input: DigestInput;
  findings: ReviewFinding[];
  sharedMarkdown: string;
  codexPromptDelta: string;
  verificationChecklist: string[];
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
  "pnpm run capture:mvp064"
] as const;

export const blockedFindingTitles = [
  "source run id不足",
  "terminal evidence不足",
  "failure screenshot不足",
  "Firefox除外",
  "console error/warn未確認",
  "local path/host/private network URL混入",
  "Learning Log接続不足",
  "note記事観点不足"
] as const;

const emptyInput: DigestInput = {
  sourceRunId: "",
  runOutcome: "未入力",
  score: null,
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
  reviewRecord: "Review Record未接続",
  learningLog: "Learning Log未接続",
  aiTaskPacketDelta: "未入力",
  noteArticleAngle: "未入力",
  publishReadiness: "未入力"
};

const validInput: DigestInput = {
  sourceRunId: "MVP063-RUN-SUCCEEDED-20260708",
  runOutcome: "Codex Run Queue Status Trackerの後段として、実行結果を短い共有ダイジェストへ変換できた。",
  score: 92,
  terminalEvidence: "artifacts/terminal/mvp064-verification.log",
  screenshots: {
    initial: "artifacts/screenshots/aidd-control-plane-mvp064-empty.png",
    filled: "artifacts/screenshots/aidd-control-plane-mvp064-valid.png",
    failure: "artifacts/screenshots/aidd-control-plane-mvp064-failure.png",
    terminal: "artifacts/screenshots/aidd-control-plane-mvp064-terminal-evidence.png"
  },
  browserCoverage: {
    Chromium: "通過",
    Firefox: "通過",
    WebKit: "通過"
  },
  consoleStatus: "error/warnなしを確認",
  reviewRecord: "Review Record: 結果、証跡、3ブラウザ、console、公開前検査を同じ短文ダイジェストへ集約した。",
  learningLog: "Learning Log: 後段の共有物は、成功理由だけでなく次回AI Task Packet deltaへ戻す改善点も含める。",
  aiTaskPacketDelta: "次回はReview Findingを先頭に置き、Firefox除外と公開危険文字列をdoctor:aiddの必須検査に残す。",
  noteArticleAngle: "AI駆動開発の実行結果を、レビュー担当者とnote読者が同じ粒度で読める短い証跡記事にする。",
  publishReadiness: "共有準備OK"
};

const failureInput: DigestInput = {
  ...validInput,
  sourceRunId: "MVP063-RUN-FAILED-20260708",
  runOutcome: "test:e2eでfailureになり、failure screenshotとconsole statusを確認している途中。",
  score: 54,
  terminalEvidence: "artifacts/terminal/mvp064-failure.log",
  screenshots: {
    ...validInput.screenshots,
    failure: "artifacts/screenshots/aidd-control-plane-mvp064-failure.png"
  },
  browserCoverage: {
    Chromium: "通過",
    Firefox: "失敗",
    WebKit: "通過"
  },
  consoleStatus: "Firefox実行時のwarnをReview Recordへ転記中",
  reviewRecord: "Review Record: failureを完了扱いにせず、失敗画面、terminal evidence、再実行条件を残した。",
  learningLog: "Learning Log: 失敗時の共有ダイジェストは原因推測より先に再現証跡を固定する。",
  publishReadiness: "失敗調査中"
};

const blockedInput: DigestInput = {
  ...emptyInput,
  runOutcome: "公開前検査で不足があり、共有用Markdownを確定できない。",
  score: 31,
  terminalEvidence: "不足",
  screenshots: {
    initial: "artifacts/screenshots/aidd-control-plane-mvp064-empty.png",
    filled: "artifacts/screenshots/aidd-control-plane-mvp064-blocked.png",
    failure: "不足",
    terminal: "不足"
  },
  browserCoverage: {
    Chromium: "通過",
    Firefox: "除外",
    WebKit: "通過"
  },
  consoleStatus: "error/warn未確認",
  reviewRecord: "Review Record: source run id、terminal evidence、failure screenshot、Firefox、console、公開文字列、Learning Log、note観点に不足あり。",
  learningLog: "Learning Log接続不足",
  aiTaskPacketDelta: "不足項目を次回AI Task Packetへ戻す前にReview Findingを確定する。",
  noteArticleAngle: "不足",
  publishReadiness: "公開不可"
};

export function createDigestViewModel(state: DigestState): DigestViewModel {
  const input = getInputForState(state);
  const findings = state === "blocked" ? createBlockedFindings() : state === "failure" ? createFailureFindings() : [];
  return {
    state,
    input,
    findings,
    sharedMarkdown: state === "valid" ? buildSharedMarkdown(input) : "",
    codexPromptDelta: state === "valid" ? buildCodexPromptDelta(input) : "",
    verificationChecklist: state === "valid" ? buildVerificationChecklist(input) : []
  };
}

export function getInputForState(state: DigestState): DigestInput {
  if (state === "valid") return validInput;
  if (state === "failure") return failureInput;
  if (state === "blocked") return blockedInput;
  return emptyInput;
}

export function buildSharedMarkdown(input: DigestInput): string {
  const browserLine = requiredBrowsers.map((browser) => `${browser}: ${input.browserCoverage[browser]}`).join(" / ");
  return [
    "## Run Result Digest",
    "",
    `- source run id: ${input.sourceRunId}`,
    `- run outcome: ${input.runOutcome}`,
    `- score: ${input.score}`,
    `- terminal evidence: ${input.terminalEvidence}`,
    `- screenshots: initial=${input.screenshots.initial}, filled=${input.screenshots.filled}, failure=${input.screenshots.failure}, terminal=${input.screenshots.terminal}`,
    `- browser coverage: ${browserLine}`,
    `- console status: ${input.consoleStatus}`,
    `- Review Record: ${input.reviewRecord}`,
    `- Learning Log: ${input.learningLog}`,
    `- AI Task Packet delta: ${input.aiTaskPacketDelta}`,
    `- note article angle: ${input.noteArticleAngle}`,
    `- publish readiness: ${input.publishReadiness}`
  ].join("\n");
}

export function buildCodexPromptDelta(input: DigestInput): string {
  return [
    "次回Codex prompt delta:",
    "MVP063のsource run idとterminal evidenceを先に読み、Review RecordとLearning Logから共有用Markdownを生成してください。",
    `3ブラウザ coverageは${requiredBrowsers.join(" / ")}を維持し、console statusは${input.consoleStatus}を基準にしてください。`,
    "公開前にlocal path、host名、private network URLが混入していないことをdoctor:aiddで確認してください。"
  ].join("\n");
}

export function buildVerificationChecklist(input: DigestInput): string[] {
  return [
    `source run idを確認: ${input.sourceRunId}`,
    `terminal evidenceを確認: ${input.terminalEvidence}`,
    `initial screenshotを確認: ${input.screenshots.initial}`,
    `filled screenshotを確認: ${input.screenshots.filled}`,
    `failure screenshotを確認: ${input.screenshots.failure}`,
    `terminal screenshotを確認: ${input.screenshots.terminal}`,
    "Chromium / Firefox / WebKit coverageを確認",
    `console statusを確認: ${input.consoleStatus}`,
    "Review RecordとLearning Logの接続を確認",
    `publish readinessを確認: ${input.publishReadiness}`
  ];
}

function createBlockedFindings(): ReviewFinding[] {
  return [
    {
      id: "source-run-id",
      title: "source run id不足",
      severity: "high",
      detail: "MVP063のどの実行結果から作ったダイジェストか追跡できない。",
      fixInstruction: "source run idを入力し、Review Recordにも同じidを記録する。"
    },
    {
      id: "terminal-evidence",
      title: "terminal evidence不足",
      severity: "high",
      detail: "lint/typecheck/test/build/e2e/doctor/captureの結果が共有Markdownから確認できない。",
      fixInstruction: "terminal evidenceの保存先を追加し、Verification Evidence checklistに反映する。"
    },
    {
      id: "failure-screenshot",
      title: "failure screenshot不足",
      severity: "medium",
      detail: "失敗時に何が見えていたかをレビュー担当者が確認できない。",
      fixInstruction: "failure状態のスクリーンショットを保存し、failure欄へ紐づける。"
    },
    {
      id: "firefox-excluded",
      title: "Firefox除外",
      severity: "high",
      detail: "3ブラウザE2Eの条件からFirefoxが抜けている。",
      fixInstruction: "Playwright projectsにFirefoxを残し、遅い場合はtimeoutとworkersで安定化する。"
    },
    {
      id: "console-status",
      title: "console error/warn未確認",
      severity: "medium",
      detail: "console errorまたはwarnの有無がReview Recordに残っていない。",
      fixInstruction: "console statusを確認し、error/warnなしまたは既知のwarnとして記録する。"
    },
    {
      id: "public-danger",
      title: "local path/host/private network URL混入",
      severity: "high",
      detail: "公開用ダイジェストに環境固有の文字列が混ざる可能性がある。",
      fixInstruction: "公開対象テキストからlocal path、host名、private network URLを取り除く。"
    },
    {
      id: "learning-log",
      title: "Learning Log接続不足",
      severity: "medium",
      detail: "今回の学びが次回AI Task Packet deltaへ接続していない。",
      fixInstruction: "Learning Logから次回AI Task Packet deltaへ戻す具体行を追加する。"
    },
    {
      id: "note-angle",
      title: "note記事観点不足",
      severity: "medium",
      detail: "note読者に何を共有する記事かが短く説明できない。",
      fixInstruction: "note article angleに背景、証跡、失敗と修正の読み筋を1文で入れる。"
    }
  ];
}

function createFailureFindings(): ReviewFinding[] {
  return [
    {
      id: "failure-not-ready",
      title: "failureは共有準備OKではない",
      severity: "medium",
      detail: "失敗結果は共有できるが、成功ダイジェストとしては公開しない。",
      fixInstruction: "failure screenshotとterminal evidenceを残し、再実行後にvalidへ切り替える。"
    }
  ];
}
