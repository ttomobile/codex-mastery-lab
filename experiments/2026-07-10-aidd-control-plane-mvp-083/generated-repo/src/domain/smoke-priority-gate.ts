export const smokePriorityStates = ["empty", "prioritized", "conflict", "blocked"] as const;

export type SmokePriorityState = (typeof smokePriorityStates)[number];
export type Severity = "info" | "medium" | "high" | "critical";
export type Lane = "execute_now" | "defer_next_increment" | "return_to_learning_log";

export type RepairCandidate = {
  id: string;
  sourceReceipt: string;
  title: string;
  severity: Severity;
  lane: Lane;
  priorityScore: number;
  effort: "small" | "medium" | "large";
  risk: "low" | "medium" | "high";
  priorityReason: string;
};

export type SmokePriorityView = {
  state: SmokePriorityState;
  title: string;
  decision: string;
  decisionTone: "success" | "warning" | "danger";
  message: string;
  selectedCandidate: RepairCandidate;
  candidates: RepairCandidate[];
  executeNow: string;
  deferNextIncrement: string[];
  returnToLearningLog: string[];
  aiTaskPacketPatch: string;
  codexPromptPatch: string;
  verificationCommands: string[];
  requiredEvidence: string[];
  rollbackCondition: string;
  aiddSpecConnection: string;
  codexPromptPreview: string;
  reviewFindingYaml: string;
  conflictReasons: string[];
  stopReasons: string[];
};

const baseCommands = [
  "pnpm install --frozen-lockfile",
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
];

const baseEvidence = [
  "terminal evidence: install / lint / typecheck / test / build / test:e2e / doctor:aidd",
  "screenshots: empty / prioritized / conflict / blocked / terminal evidence",
  "Chromium / Firefox / WebKit coverage",
  "failure screenshotとrollback確認"
];

const candidates: RepairCandidate[] = [
  {
    id: "repair-smoke-terminal-evidence-083",
    sourceReceipt: "smoke-receipt-082-failure",
    title: "terminal evidence画像のHTTP 404を修正する",
    severity: "critical",
    lane: "execute_now",
    priorityScore: 92,
    effort: "small",
    risk: "low",
    priorityReason: "記事の検証根拠が読者に見えないため、最小工数で公開品質を大きく戻せる"
  },
  {
    id: "repair-smoke-playwright-report-083",
    sourceReceipt: "smoke-receipt-082-warning",
    title: "Playwright report URLのHTTP smokeを追加する",
    severity: "high",
    lane: "defer_next_increment",
    priorityScore: 71,
    effort: "medium",
    risk: "medium",
    priorityReason: "重要だが、今回の1回ではterminal evidence修正より範囲が広い"
  },
  {
    id: "repair-smoke-copy-rule-083",
    sourceReceipt: "learning-log-082",
    title: "asset copy patternの命名規則をLearning Logへ戻す",
    severity: "medium",
    lane: "return_to_learning_log",
    priorityScore: 48,
    effort: "small",
    risk: "low",
    priorityReason: "再発防止には必要だが、すぐの公開ブロック解除ではない"
  }
];

const emptyCandidate: RepairCandidate = {
  id: "未選択",
  sourceReceipt: "未選択",
  title: "Repair Action候補を選択してください",
  severity: "info",
  lane: "return_to_learning_log",
  priorityScore: 0,
  effort: "small",
  risk: "low",
  priorityReason: "候補、実行予算、必要証跡が揃うまでCodexへ渡さない"
};

export function normalizeSmokePriorityState(input: unknown): SmokePriorityState {
  const value = Array.isArray(input) ? input[0] : input;
  return smokePriorityStates.includes(value as SmokePriorityState) ? (value as SmokePriorityState) : "empty";
}

function prompt(action: string): string {
  return `execute_now:\n  - ${action}\n  - Chromium / Firefox / WebKitでE2Eを実行する\n  - terminal evidence、failure screenshot、rollback確認を保存する`;
}

export function promptContainsExecuteNowOnly(view: SmokePriorityView): boolean {
  return view.codexPromptPreview.includes("execute_now:") && !view.codexPromptPreview.includes("defer_next_increment:") && !view.codexPromptPreview.includes("return_to_learning_log:");
}

export function getSmokePriorityView(state: SmokePriorityState): SmokePriorityView {
  if (state === "empty") {
    return {
      state,
      title: "Smoke Repair Priority Gate",
      decision: "候補待ち",
      decisionTone: "warning",
      message: "Repair Action候補が未選択です。source receipt、severity、priority score、effort、risk、証跡要件が揃ってから今回の1件を選びます。",
      selectedCandidate: emptyCandidate,
      candidates,
      executeNow: "候補選択後に生成",
      deferNextIncrement: ["Playwright report URL smoke", "CI artifact一覧の自動照合"],
      returnToLearningLog: ["asset copy ruleの命名規則を標準へ戻す"],
      aiTaskPacketPatch: "Repair Action候補にsource receipt / priority score / effort / risk / priority reasonを必須化する。",
      codexPromptPatch: "候補未選択ではCodex promptを生成しない。",
      verificationCommands: baseCommands,
      requiredEvidence: baseEvidence,
      rollbackCondition: "候補不足なら実行せずReview Recordへ戻す",
      aiddSpecConnection: "AIDD-Spec v0.1 Verification Evidence / Review Record / Learning Log / AI Task Packet Delta",
      codexPromptPreview: prompt("Repair Action候補を1件だけ選ぶための入力不足をReview Findingにする"),
      reviewFindingYaml: "review_finding:\n  category: Planning\n  finding: Repair Action候補未選択\n  needed_upstream_info:\n    - Review Record\n    - Verification Evidence",
      conflictReasons: [],
      stopReasons: []
    };
  }

  if (state === "prioritized") {
    const selected = candidates[0];
    return {
      state,
      title: "今回実行する1件を選ぶ",
      decision: "ready: 1件に絞り込み済み",
      decisionTone: "success",
      message: "3件のRepair候補を比較し、criticalかつsmall effortのterminal evidence修正だけをexecute_nowへ入れました。",
      selectedCandidate: selected,
      candidates,
      executeNow: "terminal evidence画像のHTTP 404を修正し、preview/assetsで200・非0byte・image/pngを確認する",
      deferNextIncrement: ["Playwright report URLのHTTP smokeを追加する"],
      returnToLearningLog: ["asset copy patternの命名規則を次回標準更新候補へ戻す"],
      aiTaskPacketPatch: "execute_nowはpriority score最大かつ実行予算smallの1件だけに制限する。",
      codexPromptPatch: "Codexにはterminal evidence画像404修正だけを渡し、defer_next_incrementとLearning Logを混ぜない。",
      verificationCommands: baseCommands,
      requiredEvidence: baseEvidence,
      rollbackCondition: "別assetが404化、またはpromptにdefer_next_incrementが混ざったら差分を戻す",
      aiddSpecConnection: "AIDD-Spec v0.1 AI Task Packet / Verification Evidence / Review Record",
      codexPromptPreview: prompt("terminal evidence画像のHTTP 404を修正し、preview smokeを再実行する"),
      reviewFindingYaml: "review_finding:\n  category: Priority Decision\n  finding: execute_now selected from multiple smoke repairs\n  severity: critical\n  standard_update:\n    document: AIDD Control Plane MVP\n    field: smoke_repair_priority_gate.execute_now_limit",
      conflictReasons: [],
      stopReasons: []
    };
  }

  if (state === "conflict") {
    const selected = { ...candidates[1], lane: "defer_next_increment" as const, priorityScore: 88 };
    return {
      state,
      title: "優先順位が衝突している候補",
      decision: "conflict: 判断保留",
      decisionTone: "danger",
      message: "high severity候補が複数あり、証跡不足と実行予算超過が同時に起きています。execute_nowへ進めず、判断理由をReview Findingにします。",
      selectedCandidate: selected,
      candidates: [candidates[0], selected, candidates[2]],
      executeNow: "未確定。priority reasonと実行予算が揃うまでCodexへ渡さない",
      deferNextIncrement: ["terminal evidence修正", "Playwright report URL smoke"],
      returnToLearningLog: ["証跡不足の候補はLearning Logへ戻して入力を補う"],
      aiTaskPacketPatch: "conflictでは高severity複数、証跡不足、実行予算超過、優先理由不足をReview Finding化する。",
      codexPromptPatch: "conflict状態ではexecute_now promptを生成せず、不足情報の補完だけを要求する。",
      verificationCommands: baseCommands,
      requiredEvidence: baseEvidence,
      rollbackCondition: "複数候補がexecute_nowへ入ったら実行を止める",
      aiddSpecConnection: "AIDD-Spec v0.1 Review Record / Learning Log",
      codexPromptPreview: prompt("優先順位衝突の不足情報をReview Findingとして整理する"),
      reviewFindingYaml: "review_finding:\n  category: Priority Conflict\n  finding: multiple high severity repairs compete for one run budget\n  severity: high\n  fix_instruction: choose one execute_now item or defer all",
      conflictReasons: ["高severity候補が複数ある", "terminal evidence不足", "実行予算が1回分を超過", "priority reason不足"],
      stopReasons: ["優先順位衝突"]
    };
  }

  return {
    state,
    title: "危険なRepair候補を実行前に止める",
    decision: "blocked",
    decisionTone: "danger",
    message: "private URL、local path、Firefox除外、証跡不足、rollback不足、AIDD-Spec接続不足、execute_now以外混入を検出したためCodex実行へ進めません。",
    selectedCandidate: { ...candidates[0], title: "[private URL]を含む危険なRepair候補", priorityScore: 99, risk: "high" },
    candidates,
    executeNow: "危険なURLと浅い検証を除去し、公開用にサニタイズされた1件へ縮小するまで実行しない",
    deferNextIncrement: ["private network URLの入力mask", "artifact URLの公開前HTTP smoke"],
    returnToLearningLog: ["Firefox除外とrollback不足は次回AI Task Packetの必須blocked条件へ戻す"],
    aiTaskPacketPatch: "blocking_findingsにprivate URL / local path / Firefox除外 / terminal evidence不足 / failure screenshot不足 / rollback不足 / AIDD-Spec接続不足を追加する。",
    codexPromptPatch: "危険なcommandや未検証のpromptはCodexへ渡さず、blocked Review Findingとして返す。",
    verificationCommands: baseCommands,
    requiredEvidence: baseEvidence,
    rollbackCondition: "blocked条件が残る限りRun Queueへ投入しない",
    aiddSpecConnection: "AIDD-Spec v0.1 Security Baseline / Verification Evidence / Review Record",
    codexPromptPreview: prompt("blocked理由を安全なReview Findingへ変換し、公開用promptから危険情報を除く"),
    reviewFindingYaml: "review_finding:\n  category: Safety and Evidence\n  finding: smoke repair priority gate blocked unsafe or shallow candidate\n  severity: critical\n  needed_upstream_info:\n    - Security Baseline\n    - Verification Evidence\n    - Rollback Plan",
    conflictReasons: [],
    stopReasons: ["private URL混入", "local path混入", "Firefox除外", "terminal evidence不足", "failure screenshot不足", "rollback不足", "AIDD-Spec接続不足", "execute_now以外混入"]
  };
}
