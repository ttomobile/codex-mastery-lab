import { describe, expect, test } from "vitest";
import {
  codexPromptContainsExecuteNowOnly,
  getRepairPlanner,
  hasExecutionBlocker,
  normalizeReceiptState
} from "./preview-smoke-receipt";

describe("Smoke Receipt Repair Action Planner のドメイン判定", () => {
  test("query stateを4状態へ正規化する", () => {
    expect(normalizeReceiptState(undefined)).toBe("empty");
    expect(normalizeReceiptState("unknown")).toBe("empty");
    expect(normalizeReceiptState(["planned"])).toBe("planned");
    expect(normalizeReceiptState("failure")).toBe("failure");
    expect(normalizeReceiptState("blocked")).toBe("blocked");
  });

  test("plannedは次の1回で実行する修正Actionを保持する", () => {
    const planner = getRepairPlanner("planned");
    expect(planner.message).toBe("次の1回で実行する修正Actionが準備できました");
    expect(planner.action.sourceReceipt).toContain("mvp077");
    expect(planner.action.brokenUrl).toContain("https://");
    expect(planner.action.findingCategory).toBe("preview_html_404");
    expect(planner.action.verificationCommands).toContain("pnpm run doctor:aidd");
    expect(planner.action.requiredEvidence).toContain("artifacts/screenshots/mvp078-terminal-evidence.png");
    expect(planner.action.rollbackCondition).toContain("Codex prompt preview");
    expect(planner.browsers.map((item) => item.browser)).toEqual(["Chromium", "Firefox", "WebKit"]);
  });

  test("Codex prompt previewにはexecute_nowだけを入れる", () => {
    const planner = getRepairPlanner("planned");
    expect(codexPromptContainsExecuteNowOnly(planner.action)).toBe(true);
    expect(planner.action.codexPromptPatch).toBe(planner.action.executeNowAction);
    expect(planner.action.codexPromptPatch).not.toContain(planner.action.nextIncrement);
    expect(planner.action.codexPromptPatch).not.toContain(planner.action.learningLog);
  });

  test("failureは4種類のReview Finding YAMLカードを保持する", () => {
    const planner = getRepairPlanner("failure");
    expect(planner.decision).toBe("Review Findingあり");
    expect(planner.reviewFindings.map((finding) => finding.category)).toEqual([
      "検証コマンド不足",
      "証跡不足",
      "rollback不足",
      "AIDD-Spec接続不足"
    ]);
    expect(planner.reviewFindings.every((finding) => finding.yaml.startsWith("review_finding:"))).toBe(true);
  });

  test("blockedは実行前停止理由をすべて保持する", () => {
    const planner = getRepairPlanner("blocked");
    expect(planner.decision).toBe("実行前停止");
    expect(planner.stopReasons.map((reason) => reason.category)).toEqual([
      "private URL",
      "local path",
      "Firefox除外",
      "terminal evidence不足",
      "failure screenshot不足",
      "execute_now以外のprompt混入"
    ]);
    expect(codexPromptContainsExecuteNowOnly(planner.action)).toBe(false);
    expect(hasExecutionBlocker({ stopReasons: planner.stopReasons, browsers: planner.browsers })).toBe(true);
  });
});
