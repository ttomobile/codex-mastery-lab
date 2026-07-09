export const smokeRepairStates = ["empty", "planned", "failure", "blocked"] as const;

export type SmokeRepairState = (typeof smokeRepairStates)[number];
export type Severity = "info" | "medium" | "high" | "critical";

export type SmokeFinding = {
  brokenUrl: string;
  category: string;
  severity: Severity;
  lane: "execute_now" | "next_increment" | "learning_log";
  priorityReason: string;
};

export type SmokeRepairView = {
  state: SmokeRepairState;
  title: string;
  decision: string;
  decisionTone: "success" | "warning" | "danger";
  message: string;
  sourceReceipt: string;
  finding: SmokeFinding;
  executeNowAction: string;
  nextIncrement: string;
  learningLog: string;
  aiTaskPacketPatch: string;
  codexPromptPatch: string;
  verificationCommands: string[];
  requiredEvidence: string[];
  rollbackCondition: string;
  aiddSpecConnection: string;
  codexPromptPreview: string;
  reviewFindingYaml: string;
  stopReasons: string[];
};

const safeFinding: SmokeFinding = {
  brokenUrl: "preview/assets/mvp082-terminal-evidence.png",
  category: "preview asset smoke",
  severity: "high",
  lane: "execute_now",
  priorityReason: "note記事にterminal evidence画像が表示されないと、検証済みという主張を読者が確認できないため"
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
  "screenshots: empty / planned / failure / blocked / terminal evidence",
  "preview smoke receipt: HTMLとassetのHTTP status / byte size / content type",
  "Chromium / Firefox / WebKit coverage"
];

export function normalizeSmokeRepairState(input: unknown): SmokeRepairState {
  const value = Array.isArray(input) ? input[0] : input;
  return smokeRepairStates.includes(value as SmokeRepairState) ? (value as SmokeRepairState) : "empty";
}

function prompt(action: string): string {
  return `execute_now:\n  - ${action}\n  - preview/assets と記事内 assets 参照を照合し、HTTP経路で200かつ非0byteを確認する\n  - terminal evidence画像とfailure screenshotを保存する`;
}

export function promptContainsExecuteNowOnly(view: SmokeRepairView): boolean {
  return view.codexPromptPreview.includes("execute_now:") && !view.codexPromptPreview.includes("next_increment:") && !view.codexPromptPreview.includes("learning_log:");
}

export function getSmokeRepairView(state: SmokeRepairState): SmokeRepairView {
  if (state === "empty") {
    return {
      state,
      title: "Smoke Receipt Repair Action Planner",
      decision: "receipt待ち",
      decisionTone: "warning",
      message: "Preview Smoke Receiptが未選択です。壊れたURL、HTTP結果、証跡不足を入れると次の1回のRepair Actionへ変換します。",
      sourceReceipt: "未選択",
      finding: { ...safeFinding, brokenUrl: "未選択", severity: "info", lane: "learning_log", priorityReason: "まずreceiptを選び、公開previewで何が壊れたかを確認する" },
      executeNowAction: "receiptを選択してから生成",
      nextIncrement: "CI artifactの自動取得と照合",
      learningLog: "公開preview smokeは記事本文QAの後にHTTP経路で再確認する",
      aiTaskPacketPatch: "Smoke Receiptをsourceとしてbroken URL / category / severity / lane / priority reasonを必須化する。",
      codexPromptPatch: "receipt未選択時はCodex実行へ進めない。",
      verificationCommands: baseCommands,
      requiredEvidence: baseEvidence,
      rollbackCondition: "receipt不足なら実行せずLearning Logへ戻す",
      aiddSpecConnection: "AIDD-Spec v0.1 Verification Evidence / Review Record / Learning Log",
      codexPromptPreview: prompt("receiptを選択し、壊れたassetを1件だけRepair Actionへ変換する"),
      reviewFindingYaml: "review_finding:\n  category: evidence\n  finding: Preview Smoke Receipt未選択\n  needed_upstream_info:\n    - Verification Evidence\n    - Review Record",
      stopReasons: []
    };
  }

  if (state === "planned") {
    return {
      state,
      title: "壊れたterminal evidence画像を1回で直す計画",
      decision: "実行計画OK",
      decisionTone: "success",
      message: "404になったterminal evidence画像を、記事・assets・preview/assetsの3点照合で修正するexecute_nowへ変換しました。",
      sourceReceipt: "smoke-082-valid",
      finding: safeFinding,
      executeNowAction: "mvp082-terminal-evidence.pngをassetsとpreview/assetsへコピーし、記事参照をassets/mvp082-terminal-evidence.pngへ統一する",
      nextIncrement: "複数assetの並列HTTP smokeとPlaywright report URL確認を追加する",
      learningLog: "画像が存在してもpreview/assetsへコピーされなければ読者には見えない",
      aiTaskPacketPatch: "required_evidenceに terminal evidence image response: 200 / image/png / non-zero bytes を追加する。",
      codexPromptPatch: "記事内assets参照、root assets、preview/assetsを照合し、壊れた1件を修正してください。",
      verificationCommands: baseCommands,
      requiredEvidence: baseEvidence,
      rollbackCondition: "画像コピーまたは記事参照変更で別assetが404になったら差分を戻す",
      aiddSpecConnection: "AIDD-Spec v0.1 Verification Evidence / AI Task Packet / Review Record",
      codexPromptPreview: prompt("mvp082-terminal-evidence.pngの404を修正し、HTTP smokeを再実行する"),
      reviewFindingYaml: "review_finding:\n  category: Verification Evidence\n  finding: terminal evidence image was missing from preview assets\n  severity: high\n  fix_instruction: copy asset and verify HTTP 200 non-zero bytes\n  verification:\n    command: pnpm run doctor:aidd",
      stopReasons: []
    };
  }

  if (state === "failure") {
    return {
      state,
      title: "Smoke失敗をReview Findingへ変換",
      decision: "修正必要",
      decisionTone: "danger",
      message: "HTTP 404、0 byte、content type mismatchを、原因・修正指示・検証コマンド付きのRepair Actionへ変換します。",
      sourceReceipt: "smoke-082-failure",
      finding: { ...safeFinding, brokenUrl: "preview/assets/mvp082-failure.png", category: "HTTP 404 / 0 byte", severity: "critical", priorityReason: "failure state画像が見えないと、失敗をどう直したかの記事証跡が欠けるため" },
      executeNowAction: "failure screenshotを再生成し、0 byteでないことを確認してpreview/assetsへ反映する",
      nextIncrement: "content-typeがimage/png以外のassetを自動でblockedへ上げる",
      learningLog: "terminal logだけでは公開ページで読者が確認できる証跡にならない",
      aiTaskPacketPatch: "failure screenshotのHTTP smokeを必須gateに追加する。",
      codexPromptPatch: "failure screenshotを再生成し、byte sizeとcontent typeをterminal evidenceへ保存してください。",
      verificationCommands: baseCommands,
      requiredEvidence: baseEvidence,
      rollbackCondition: "再生成でUI状態が変わった場合は記事本文とスクリーンショットを同時に戻す",
      aiddSpecConnection: "AIDD-Spec v0.1 Verification Evidence / Learning Log",
      codexPromptPreview: prompt("failure screenshotの0 byteを修正し、content typeを確認する"),
      reviewFindingYaml: "review_finding:\n  category: Publish Evidence\n  finding: failure screenshot asset returned 404 or 0 byte\n  severity: critical\n  codex_prompt_delta: regenerate failure screenshot and verify preview asset response",
      stopReasons: ["failure screenshot不足"]
    };
  }

  return {
    state,
    title: "公開前に止めるRepair Action",
    decision: "blocked",
    decisionTone: "danger",
    message: "private URL、local path、Firefox除外、証跡不足、AIDD-Spec接続不足、execute_now以外混入はCodex実行前に止めます。",
    sourceReceipt: "smoke-082-blocked",
    finding: { ...safeFinding, brokenUrl: "[private URL]/preview/assets/mvp082-terminal-evidence.png", category: "公開前ブロック", severity: "critical", priorityReason: "公開記事にprivate URLや浅い検証を混ぜると再現性と安全性を壊すため" },
    executeNowAction: "公開用URLと証跡をサニタイズし、Firefoxを含む3ブラウザ検証とfailure screenshotを揃えるまで実行を止める",
    nextIncrement: "private network URLを入力段階でmaskするフォーム検証を追加する",
    learningLog: "Repair Actionは急いで実行せず、公開事故につながる条件ならblockedとして扱う",
    aiTaskPacketPatch: "blocking_findingsにprivate URL / local path / Firefox除外 / terminal evidence不足 / failure screenshot不足 / AIDD-Spec接続不足を追加する。",
    codexPromptPatch: "危険なURLや未検証のpromptはCodexへ渡さず、blocked Review Findingとして返してください。",
    verificationCommands: baseCommands,
    requiredEvidence: baseEvidence,
    rollbackCondition: "blocked条件が残る限り実ファイルへ反映しない",
    aiddSpecConnection: "AIDD-Spec v0.1 Security Baseline / Verification Evidence / Review Record",
    codexPromptPreview: prompt("blocked理由をReview Findingに変換し、安全な公開用Repair Actionへ縮小する"),
    reviewFindingYaml: "review_finding:\n  category: Safety and Evidence\n  finding: blocked smoke repair contains unsafe or shallow evidence\n  severity: critical\n  needed_upstream_info:\n    - Security Baseline\n    - Verification Evidence\n    - AIDD-Spec connection",
    stopReasons: ["private URL混入", "local path混入", "Firefox除外", "terminal evidence不足", "failure screenshot不足", "AIDD-Spec接続不足", "execute_now以外混入"]
  };
}
