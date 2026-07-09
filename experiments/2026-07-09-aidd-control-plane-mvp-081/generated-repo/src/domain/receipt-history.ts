export const historyStates = ["empty", "valid", "improved", "regression", "blocked"] as const;
export type HistoryState = (typeof historyStates)[number];

export type ReceiptRun = {
  id: string;
  title: string;
  outcome: "成功" | "失敗" | "証跡不足" | "停止";
  score: number;
  findingCount: number;
  terminalEvidence: string;
  screenshotEvidence: string;
  browserCoverage: string[];
  consoleStatus: string;
  repairAction: string;
};

export type HistoryView = {
  state: HistoryState;
  title: string;
  decision: string;
  message: string;
  receipts: ReceiptRun[];
  scoreDelta: string;
  recurringFindings: string[];
  reducedFindings: string[];
  effectiveRepairActions: string[];
  nextPacketDelta: string;
  executeNowPrompt: string;
  nextIncrement: string;
  learningLog: string;
  stopReasons: string[];
  reviewFindingYaml: string;
  aiddSpecConnection: string;
};

const baseReceipts: ReceiptRun[] = [
  {
    id: "receipt-080-a",
    title: "terminal evidence不足を検出",
    outcome: "失敗",
    score: 72,
    findingCount: 5,
    terminalEvidence: "artifacts/terminal/test-e2e.txt",
    screenshotEvidence: "artifacts/screenshots/mvp080-failure.png",
    browserCoverage: ["Chromium", "Firefox", "WebKit"],
    consoleStatus: "warnなし",
    repairAction: "証跡チェックリストをRun Queueに追加"
  },
  {
    id: "receipt-080-b",
    title: "failure screenshot不足を修正",
    outcome: "証跡不足",
    score: 81,
    findingCount: 3,
    terminalEvidence: "artifacts/terminal/doctor-aidd.txt",
    screenshotEvidence: "artifacts/screenshots/mvp080-blocked.png",
    browserCoverage: ["Chromium", "Firefox", "WebKit"],
    consoleStatus: "errorなし",
    repairAction: "failure state captureを必須証跡へ昇格"
  },
  {
    id: "receipt-080-c",
    title: "dispatch receiptを公開QAへ接続",
    outcome: "成功",
    score: 90,
    findingCount: 1,
    terminalEvidence: "artifacts/terminal/preview-smoke.txt",
    screenshotEvidence: "artifacts/screenshots/mvp080-ready.png",
    browserCoverage: ["Chromium", "Firefox", "WebKit"],
    consoleStatus: "error/warnなし",
    repairAction: "execute_nowだけをprompt previewへ反映"
  }
];

export function normalizeHistoryState(value: string | string[] | undefined): HistoryState {
  const first = Array.isArray(value) ? value[0] : value;
  return historyStates.includes(first as HistoryState) ? (first as HistoryState) : "empty";
}

export function promptContainsExecuteNowOnly(view: HistoryView): boolean {
  return /execute_now:/.test(view.executeNowPrompt) && !/next_increment:|learning_log:/.test(view.executeNowPrompt);
}

export function getHistoryView(state: HistoryState): HistoryView {
  const common = {
    receipts: baseReceipts,
    aiddSpecConnection: "AIDD-Spec v0.1 / Verification Evidence / Review Record / Learning Log / standards/aidd-control-plane-mvp-v0.1.md",
    nextIncrement: "複数receiptをチームレビューに割り当てるDecision Ledgerへ進める",
    learningLog: "単発のpass/failでは、同じ失敗が減ったかを説明できない。履歴比較で効果を見る。"
  };

  if (state === "empty") {
    return {
      ...common,
      state,
      title: "Dispatch Receipt履歴が未選択です",
      decision: "入力待ち",
      message: "比較するReceiptを選ぶと、score推移、再発finding、効いたRepair Actionを確認できます。",
      receipts: [],
      scoreDelta: "未計算",
      recurringFindings: ["source run id", "terminal evidence", "failure screenshot"],
      reducedFindings: [],
      effectiveRepairActions: [],
      nextPacketDelta: "比較対象Receiptを3件以上選択する",
      executeNowPrompt: "execute_now: Receipt履歴を3件選び、score推移と再発findingを比較してください。",
      stopReasons: [],
      reviewFindingYaml: "review_finding: 未選択\nseverity: medium\nfix_instruction: 比較対象Receiptを選択する"
    };
  }

  if (state === "blocked") {
    return {
      ...common,
      state,
      title: "公開前ブロック: 履歴比較に危険な証跡が混入しています",
      decision: "blocked",
      message: "private URL、local path、host名、Firefox除外、証跡不足、AIDD-Spec接続不足、execute_now以外混入を止めました。",
      scoreDelta: "+0 / ブロック中",
      recurringFindings: ["local path混入", "Firefox除外", "terminal evidence不足", "failure screenshot不足"],
      reducedFindings: [],
      effectiveRepairActions: [],
      nextPacketDelta: "公開前sanitize scanと3ブラウザ証跡を必須化する",
      executeNowPrompt: "execute_now: blocked理由を1件ずつReview Findingへ変換し、公開前sanitize scanを通してください。",
      stopReasons: ["private URL混入", "local path混入", "host名混入", "Firefox除外", "terminal evidence不足", "failure screenshot不足", "AIDD-Spec接続不足", "execute_now以外混入"],
      reviewFindingYaml: "review_finding:\n  category: Publication Safety\n  severity: blocker\n  finding: local path / private URL / Firefox除外を検出\n  needed_upstream_info:\n    - Verification Evidence\n    - Security Baseline\n  verification:\n    command: pnpm run doctor:aidd"
    };
  }

  if (state === "regression") {
    return {
      ...common,
      state,
      title: "再発findingが見つかりました",
      decision: "要修正",
      message: "前回消えたはずのterminal evidence不足とfailure screenshot不足が再発しています。",
      scoreDelta: "90 → 76 (-14)",
      recurringFindings: ["terminal evidence不足", "failure screenshot不足", "AIDD-Spec接続不足"],
      reducedFindings: ["execute_now以外混入は解消"],
      effectiveRepairActions: ["prompt preview分離は有効"],
      nextPacketDelta: "証跡保存先をReceipt単位で固定し、doctor:aiddで再発を止める",
      executeNowPrompt: "execute_now: terminal evidenceとfailure screenshotの保存先をReceipt単位で固定し、doctor:aiddへ再発検査を追加してください。",
      stopReasons: [],
      reviewFindingYaml: "review_finding:\n  category: Evidence Regression\n  severity: high\n  finding: terminal evidence不足が再発\n  ideal_state: 各Receiptがcommand別exit codeと画像証跡を持つ\n  fix_instruction: Receipt history doctorへ再発検査を追加\n  verification:\n    command: pnpm run doctor:aidd"
    };
  }

  if (state === "improved") {
    return {
      ...common,
      state,
      title: "同じ失敗が減っています",
      decision: "改善確認",
      message: "5件あったfindingが1件まで減り、failure screenshot必須化とexecute_now分離が効いたと判断できます。",
      scoreDelta: "72 → 90 (+18)",
      recurringFindings: ["古いterminal logの残存"],
      reducedFindings: ["terminal evidence不足", "failure screenshot不足", "execute_now以外混入", "Firefox除外"],
      effectiveRepairActions: ["failure state captureを必須証跡へ昇格", "execute_nowだけをprompt previewへ反映", "3ブラウザE2Eをdoctor:aiddで確認"],
      nextPacketDelta: "改善効果を次回AI Task Packetの受け入れ条件へ固定する",
      executeNowPrompt: "execute_now: 改善済みRepair Actionを次回AI Task Packetの受け入れ条件へ反映し、同じfindingの再発検査をdoctor:aiddへ追加してください。",
      stopReasons: [],
      reviewFindingYaml: "review_finding:\n  category: Improvement Confirmed\n  severity: low\n  finding: evidence findings reduced from 5 to 1\n  standard_update:\n    document: Verification Evidence\n    field: receipt_history.comparison_required"
    };
  }

  return {
    ...common,
    state,
    title: "Dispatch Receipt履歴を比較できます",
    decision: "valid",
    message: "3件のReceiptを横並びにし、score推移、finding数、証跡、ブラウザcoverage、Repair Actionを比較します。",
    scoreDelta: "72 → 81 → 90",
    recurringFindings: ["古いterminal logの残存"],
    reducedFindings: ["terminal evidence不足", "failure screenshot不足", "Firefox除外"],
    effectiveRepairActions: ["証跡チェックリストをRun Queueに追加", "failure state captureを必須証跡へ昇格"],
    nextPacketDelta: "Receipt履歴比較をReview Recordに保存する",
    executeNowPrompt: "execute_now: 3件のDispatch Receiptを比較し、再発findingと効いたRepair ActionをReview Recordへ保存してください。",
    stopReasons: [],
    reviewFindingYaml: "review_finding:\n  category: Receipt History\n  severity: medium\n  finding: 履歴比較をReview Recordへ保存する必要がある\n  verification:\n    command: pnpm run test:e2e"
  };
}
