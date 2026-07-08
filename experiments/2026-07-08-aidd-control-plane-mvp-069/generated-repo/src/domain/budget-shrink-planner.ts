export const plannerStates = ["ready", "brake", "stop", "sanitized"] as const;
export type PlannerState = (typeof plannerStates)[number];
export const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;
export type UsageBand = "low" | "medium" | "high" | "overflow";

export type ShrinkPlanInput = {
  state: PlannerState;
  sourcePacketId: string;
  usageBand: UsageBand;
  keepNow: string[];
  deferNextIncrement: string[];
  minimumVerification: string[];
  fallbackAction: string;
  resumeCondition: string;
  evidencePaths: string[];
  browserProjects: Record<(typeof requiredBrowsers)[number], "必須" | "除外" | "未確認">;
  promptPreview: string;
  blockedReasons: string[];
  sanitizationScan: string;
  aiddSpecConnection: string;
};

export const minimumVerificationCommands = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
];

const readyPrompt = [
  "MVP069 keep_now: 公開preview smokeで壊れたasset URLを1件だけ修正してください。",
  "minimum_verification: pnpm run lint / pnpm run typecheck / pnpm run test / pnpm run build / pnpm run test:e2e / pnpm run doctor:aidd。",
  "Chromium / Firefox / WebKit、terminal evidence、failure screenshot、Playwright reportを残します。",
  "rollback: 証跡不足または公開危険文字列が出たら実行を止め、Review Recordへ戻します。"
].join("\n");

const sanitizedPrompt = "MVP069 keep_now: 公開preview smokeで壊れたasset URLを1件だけ修正してください。";

export function getShrinkPlanInput(state: PlannerState): ShrinkPlanInput {
  if (state === "ready") {
    return {
      state,
      sourcePacketId: "ATP-069-preview-smoke",
      usageBand: "medium",
      keepNow: ["Public Preview Smoke Verifierのasset copy確認を1件実行する"],
      deferNextIncrement: [],
      minimumVerification: minimumVerificationCommands,
      fallbackAction: "失敗時はReview Finding Action Queueへ戻す",
      resumeCondition: "3ブラウザE2Eとterminal/failure screenshotが揃ったら次へ進む",
      evidencePaths: ["artifacts/terminal", "artifacts/screenshots", "playwright-report"],
      browserProjects: { Chromium: "必須", Firefox: "必須", WebKit: "必須" },
      promptPreview: readyPrompt,
      blockedReasons: [],
      sanitizationScan: "公開危険文字列なし",
      aiddSpecConnection: "AIDD-Spec v0.1 AI Task Packet / Verification Evidence / Review Record / Learning Log、AIDD Control Plane Codex Run Budget Shrink Planner"
    };
  }
  if (state === "brake") {
    return {
      state,
      sourcePacketId: "ATP-069-over-budget",
      usageBand: "high",
      keepNow: ["壊れたpreview asset URLを1件だけ修正する"],
      deferNextIncrement: ["CI artifact API連携", "GIF再生成", "複数記事の一括QA"],
      minimumVerification: minimumVerificationCommands,
      fallbackAction: "縮小後も失敗したらstopへ切り替え、Learning Logへ戻す",
      resumeCondition: "keep_nowの1件が検証済みになったらdefer_next_incrementを次回Packetへ送る",
      evidencePaths: ["artifacts/terminal", "artifacts/screenshots", "playwright-report"],
      browserProjects: { Chromium: "必須", Firefox: "必須", WebKit: "必須" },
      promptPreview: readyPrompt,
      blockedReasons: ["実行予算超過のためkeep_nowへ縮小"],
      sanitizationScan: "local path / private host / private network URLなし",
      aiddSpecConnection: "AIDD-Spec v0.1 AI Task Packet / Verification Evidence / Review Record / Learning Log、AIDD Control Plane Codex Run Budget Shrink Planner"
    };
  }
  if (state === "stop") {
    return {
      state,
      sourcePacketId: "ATP-069-stop",
      usageBand: "overflow",
      keepNow: [],
      deferNextIncrement: ["検証設計を先に補う", "証跡保存先を決める", "rollback条件を定義する"],
      minimumVerification: ["pnpm run test"],
      fallbackAction: "実行せずReview Recordへ戻す",
      resumeCondition: "最低検証、3ブラウザ、terminal/failure screenshot、rollbackが揃ったら再開",
      evidencePaths: ["未設定"],
      browserProjects: { Chromium: "必須", Firefox: "除外", WebKit: "未確認" },
      promptPreview: "defer_next_incrementもまとめて実行する。private-preview.example.invalid を参照する。",
      blockedReasons: ["最低検証不足", "3ブラウザ不足", "terminal/failure screenshot不足", "rollback不足"],
      sanitizationScan: "private host混入を検出",
      aiddSpecConnection: "不足"
    };
  }
  return {
    state,
    sourcePacketId: "ATP-069-sanitized",
    usageBand: "high",
    keepNow: ["公開preview smokeで壊れたasset URLを1件だけ修正する"],
    deferNextIncrement: ["CI artifact API連携", "複数記事の一括QA"],
    minimumVerification: minimumVerificationCommands,
    fallbackAction: "失敗時はReview Finding Action Queueへ戻す",
    resumeCondition: "公開previewと画像URLがHTTP経路で確認できたら次へ進む",
    evidencePaths: ["artifacts/terminal", "artifacts/screenshots", "playwright-report"],
    browserProjects: { Chromium: "必須", Firefox: "必須", WebKit: "必須" },
    promptPreview: sanitizedPrompt,
    blockedReasons: [],
    sanitizationScan: "local path / private host / private network URLなし",
    aiddSpecConnection: "AIDD-Spec v0.1 AI Task Packet / Verification Evidence / Review Record / Learning Log、AIDD Control Plane Codex Run Budget Shrink Planner"
  };
}

export function hasPromptLeakage(prompt: string): boolean {
  return /defer_next_incrementもまとめて|private-preview|\/Users\/|\/home\/|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\./i.test(prompt);
}

export function createShrinkPlanViewModel(state: PlannerState) {
  const input = getShrinkPlanInput(state);
  const promptLeakage = hasPromptLeakage(input.promptPreview);
  const missingMinimumVerification = minimumVerificationCommands.filter((command) => !input.minimumVerification.includes(command));
  const missingEvidence = ["artifacts/terminal", "artifacts/screenshots", "playwright-report"].filter((item) => !input.evidencePaths.includes(item));
  const missingBrowser = requiredBrowsers.filter((browser) => input.browserProjects[browser] !== "必須");
  const blockingReasons = input.blockedReasons.filter((reason) => !reason.includes("実行予算超過"));
  const hardBlockers = [...blockingReasons, ...missingMinimumVerification.map((command) => `${command}不足`), ...missingEvidence.map((item) => `${item}不足`), ...missingBrowser.map((browser) => `${browser}不足`)];
  const runState = hardBlockers.length === 0 && !promptLeakage ? (state === "brake" ? "brake" : "ready") : "stop";
  return { input, promptLeakage, missingMinimumVerification, missingEvidence, missingBrowser, hardBlockers, runState, canRunShrunkPacket: runState === "ready" || runState === "brake" };
}
