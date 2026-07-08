export const receiptStates = ["empty", "valid", "blocked"] as const;
export type ReceiptState = (typeof receiptStates)[number];

export const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;
export const requiredEvidence = ["terminal evidence", "initial screenshot", "filled screenshot", "failure screenshot", "Playwright report"] as const;
export const minimumVerificationCommands = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
] as const;

export type HandoffReceiptInput = {
  state: ReceiptState;
  sourceShrinkPlan: string;
  executeNow: string[];
  deferNextIncrement: string[];
  minimumVerification: string[];
  browserProjects: Record<(typeof requiredBrowsers)[number], "必須" | "除外" | "未確認">;
  requiredEvidence: string[];
  rollbackCondition: string;
  aiddSpecConnection: string;
  codexPromptPreview: string;
  decisionNote: string;
};

const validExecuteNow = ["MVP070の記事previewで参照するterminal evidence画像のHTTP smoke確認を1件だけ実行する"];
const validDefer = ["CI artifact API自動取得", "複数記事の横断QA", "GIF再生成ジョブ"];
const safePrompt = [
  "execute_now: MVP070の記事previewで参照するterminal evidence画像のHTTP smoke確認を1件だけ実行してください。",
  "verification: pnpm run lint / pnpm run typecheck / pnpm run test / pnpm run build / pnpm run test:e2e / pnpm run doctor:aidd。",
  "browser_projects: Chromium / Firefox / WebKit。",
  "required_evidence: terminal evidence / initial screenshot / filled screenshot / failure screenshot / Playwright report。",
  "rollback: 証跡不足、3ブラウザ不足、公開危険文字列を検出したら実行せずReview Recordへ戻してください。"
].join("\n");

export function getHandoffReceiptInput(state: ReceiptState): HandoffReceiptInput {
  if (state === "empty") {
    return {
      state,
      sourceShrinkPlan: "未選択",
      executeNow: [],
      deferNextIncrement: [],
      minimumVerification: [],
      browserProjects: { Chromium: "未確認", Firefox: "未確認", WebKit: "未確認" },
      requiredEvidence: [],
      rollbackCondition: "未設定",
      aiddSpecConnection: "未接続",
      codexPromptPreview: "shrink planを選択してください。",
      decisionNote: "まだCodexへ渡せません。"
    };
  }
  if (state === "blocked") {
    return {
      state,
      sourceShrinkPlan: "SP-069-overflow-private-preview",
      executeNow: ["壊れたpreview asset URLを修正する"],
      deferNextIncrement: ["CI artifact API自動取得", "複数記事の一括QA"],
      minimumVerification: ["pnpm run test", "pnpm run build"],
      browserProjects: { Chromium: "必須", Firefox: "除外", WebKit: "必須" },
      requiredEvidence: ["terminal evidence", "initial screenshot", "filled screenshot"],
      rollbackCondition: "未設定",
      aiddSpecConnection: "不足",
      codexPromptPreview: "execute_nowとdefer_next_incrementをまとめて実行し、private-preview.example.invalid の結果も確認する。",
      decisionNote: "Firefox除外、failure screenshot不足、rollback不足、private URL混入を解消するまで止めます。"
    };
  }
  return {
    state,
    sourceShrinkPlan: "SP-069-budget-shrink-valid",
    executeNow: validExecuteNow,
    deferNextIncrement: validDefer,
    minimumVerification: [...minimumVerificationCommands],
    browserProjects: { Chromium: "必須", Firefox: "必須", WebKit: "必須" },
    requiredEvidence: [...requiredEvidence],
    rollbackCondition: "証跡不足、3ブラウザ不足、公開危険文字列を検出したら実行せずReview Recordへ戻す",
    aiddSpecConnection: "AIDD-Spec v0.1 AI Task Packet / Verification Evidence / Review Record / Learning Log、AIDD Control Plane Shrunk Packet Handoff Receipt",
    codexPromptPreview: safePrompt,
    decisionNote: "execute_nowだけをCodexへ渡せます。defer_next_incrementはLearning Log経由で次回へ送ります。"
  };
}

export function hasUnsafePublicPrompt(prompt: string): boolean {
  return /defer_next_incrementをまとめて|private-preview|\/Users\/|\/home\/|127\.0\.0\.1|localhost|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\./i.test(prompt);
}

export function createHandoffReceiptViewModel(state: ReceiptState) {
  const input = getHandoffReceiptInput(state);
  const missingVerification = minimumVerificationCommands.filter((command) => !input.minimumVerification.includes(command));
  const missingBrowsers = requiredBrowsers.filter((browser) => input.browserProjects[browser] !== "必須");
  const missingEvidence = requiredEvidence.filter((item) => !input.requiredEvidence.includes(item));
  const unsafePrompt = hasUnsafePublicPrompt(input.codexPromptPreview);
  const blockers = [
    ...(input.sourceShrinkPlan === "未選択" ? ["source shrink plan不足"] : []),
    ...missingVerification.map((item) => `${item}不足`),
    ...missingBrowsers.map((item) => `${item}不足`),
    ...missingEvidence.map((item) => `${item}不足`),
    ...(input.rollbackCondition === "未設定" ? ["rollback不足"] : []),
    ...(input.aiddSpecConnection === "不足" || input.aiddSpecConnection === "未接続" ? ["AIDD-Spec接続不足"] : []),
    ...(unsafePrompt ? ["公開用prompt混入"] : [])
  ];
  const receiptStatus: "valid" | "blocked" = blockers.length === 0 ? "valid" : "blocked";
  return { input, missingVerification, missingBrowsers, missingEvidence, unsafePrompt, blockers, receiptStatus, canHandoff: receiptStatus === "valid" };
}
