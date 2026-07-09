export type DigestState = "empty" | "valid" | "failure" | "blocked";
export type PublishReadiness = "未選択" | "共有可能" | "レビュー差し戻し" | "公開停止";
export type Severity = "critical" | "high" | "medium";

export type BrowserCoverage = {
  name: "Chromium" | "Firefox" | "WebKit";
  status: "通過" | "未実行";
  evidence: string;
};

export type ScreenshotEvidence = {
  label: "initial" | "filled" | "failure" | "terminal";
  path: string;
  status: "保存済み" | "不足";
};

export type ReviewFinding = {
  category: string;
  severity: Severity;
  finding: string;
  evidenceGap: string;
  fixInstruction: string;
};

export type RunResultDigest = {
  state: DigestState;
  title: string;
  summary: string;
  runOutcome: string;
  score: number | null;
  scoreBasis: string[];
  terminalEvidence: string[];
  screenshots: ScreenshotEvidence[];
  browserCoverage: BrowserCoverage[];
  consoleStatus: string;
  reviewRecordExcerpt: string;
  learningLogExcerpt: string;
  aiTaskPacketDelta: string;
  codexPromptDelta: string;
  noteArticleAngle: string;
  publishReadiness: PublishReadiness;
  nextInputs: string[];
  findings: ReviewFinding[];
  blockedTokens: string[];
  sanitizedPreview: string;
};

export const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;
export const requiredBlockedPhrase = "local path / private host / private network URL混入";

export const requiredScreenshots: ScreenshotEvidence[] = [
  { label: "initial", path: "assets/aidd-control-plane-mvp075-initial.png", status: "保存済み" },
  { label: "filled", path: "assets/aidd-control-plane-mvp075-filled.png", status: "保存済み" },
  { label: "failure", path: "assets/aidd-control-plane-mvp075-failure.png", status: "保存済み" },
  { label: "terminal", path: "assets/aidd-control-plane-mvp075-terminal.png", status: "保存済み" }
];

const unsafeLocationPatterns = [
  /\/Users\/[^\s"'<>]+/g,
  /\/home\/[^\s"'<>]+/g,
  /\b[A-Za-z0-9._-]+\.local\b/g,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g
];

const validDigest: RunResultDigest = {
  state: "valid",
  title: "Run Result Digest Publisher",
  summary: "Codex Run Queue Status Trackerの実行結果を、レビュー、次回packet、記事化へ渡す短い共有ダイジェストに圧縮します。",
  runOutcome: "MVP075の品質ゲートは通過。実行結果は共有ダイジェストとして採用可能。",
  score: 92,
  scoreBasis: [
    "run outcome、score、terminal evidenceを同じ画面で確認できる",
    "initial / filled / failure / terminal screenshotの証跡名を保持",
    "Chromium / Firefox / WebKit coverageとconsole statusを明示"
  ],
  terminalEvidence: [
    "artifacts/terminal/lint.txt",
    "artifacts/terminal/typecheck.txt",
    "artifacts/terminal/test-e2e.txt",
    "artifacts/terminal/doctor-aidd.txt"
  ],
  screenshots: requiredScreenshots,
  browserCoverage: requiredBrowsers.map((name) => ({ name, status: "通過", evidence: `playwright ${name} project passed` })),
  consoleStatus: "console errorなし、console warnなし",
  reviewRecordExcerpt: "Review Record: score根拠、3ブラウザ、console、terminal evidenceがそろったため共有可能。",
  learningLogExcerpt: "Learning Log: 長いログではなく、次回入力に必要な差分だけを抽出する。",
  aiTaskPacketDelta: "次回AI Task Packetへ、未完了ゲート、証跡不足、記事角度を短い箇条書きで渡す。",
  codexPromptDelta: "Codex promptには不足ゲートと期待する再検証コマンドだけを入れる。",
  noteArticleAngle: "AIDDの実行結果を、レビュー担当者が読む短い共有単位へ変換した話。",
  publishReadiness: "共有可能",
  nextInputs: [],
  findings: [],
  blockedTokens: [],
  sanitizedPreview: "WORKSPACE表記へsanitize済み。private URLは含まない。"
};

export function createDigest(state: DigestState): RunResultDigest {
  if (state === "empty") {
    return {
      ...validDigest,
      state,
      runOutcome: "source run未選択",
      score: null,
      scoreBasis: [],
      terminalEvidence: [],
      screenshots: requiredScreenshots.map((item) => ({ ...item, status: "不足" })),
      browserCoverage: requiredBrowsers.map((name) => ({ name, status: "未実行", evidence: "source run選択後に確認" })),
      consoleStatus: "未確認",
      reviewRecordExcerpt: "Review Record excerptはsource run選択後に表示します。",
      learningLogExcerpt: "Learning Log excerptはsource run選択後に表示します。",
      aiTaskPacketDelta: "source run、score根拠、terminal evidence、3ブラウザ結果を入力してください。",
      codexPromptDelta: "未生成",
      noteArticleAngle: "未生成",
      publishReadiness: "未選択",
      nextInputs: ["source run id", "score根拠", "terminal evidence", "initial / filled / failure / terminal screenshot", "Chromium / Firefox / WebKit coverage"],
      findings: [],
      sanitizedPreview: ""
    };
  }

  if (state === "failure") {
    return {
      ...validDigest,
      state,
      runOutcome: "レビュー差し戻し",
      score: 61,
      scoreBasis: ["score根拠不足", "Firefox未実行", "console warnあり", "terminal evidence不足"],
      terminalEvidence: ["artifacts/terminal/lint.txt"],
      browserCoverage: [
        { name: "Chromium", status: "通過", evidence: "playwright chromium passed" },
        { name: "Firefox", status: "未実行", evidence: "Firefox未実行" },
        { name: "WebKit", status: "通過", evidence: "playwright webkit passed" }
      ],
      consoleStatus: "console warn: score根拠不足の警告あり",
      publishReadiness: "レビュー差し戻し",
      findings: [
        reviewFinding("score根拠不足", "scoreの内訳と証跡リンクが不足している。", "scoreBasisをReview Record excerptへ接続する。"),
        reviewFinding("Firefox未実行", "Chromium / Firefox / WebKit coverageのうちFirefoxが未実行。", "pnpm run test:e2eを3ブラウザで再実行する。"),
        reviewFinding("console warn", "console warnが残っている。", "warnの原因を修正し、console statusをerror/warnなしへ戻す。"),
        reviewFinding("terminal evidence不足", "terminal evidenceがlintだけで、typecheck/test/build/e2e/doctorが不足。", "必須品質ゲートのterminal logを保存する。")
      ]
    };
  }

  if (state === "blocked") {
    const raw = "/Users/example/mvp075/result.txt https://127.0.0.1:3075/private mvp075-workstation.local http://10.0.0.75/internal";
    const blockedTokens = detectUnsafePublicTokens(raw);
    return {
      ...validDigest,
      state,
      runOutcome: "公開停止",
      score: 0,
      scoreBasis: [requiredBlockedPhrase],
      consoleStatus: "公開前検査で停止",
      publishReadiness: "公開停止",
      findings: [
        reviewFinding(requiredBlockedPhrase, "公開用ダイジェストにlocal path / private host / private network URLが含まれる。", "公開前にsanitizeし、再度doctor:aiddを通す。", "critical")
      ],
      blockedTokens,
      sanitizedPreview: sanitizeForPublic(raw)
    };
  }

  return validDigest;
}

function reviewFinding(category: string, finding: string, fixInstruction: string, severity: Severity = "high"): ReviewFinding {
  return {
    category,
    severity,
    finding,
    evidenceGap: "Review Record / Verification Evidence / Learning Log / AI Task Packetの接続を再確認",
    fixInstruction
  };
}

export function parseDigestState(value: string | string[] | undefined): DigestState {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "valid" || raw === "failure" || raw === "blocked" || raw === "empty" ? raw : "empty";
}

export function detectUnsafePublicTokens(text: string): string[] {
  return unsafeLocationPatterns.flatMap((pattern) => text.match(pattern) ?? []);
}

export function sanitizeForPublic(text: string): string {
  return unsafeLocationPatterns.reduce((current, pattern) => current.replace(pattern, "WORKSPACE/private-url"), text);
}
