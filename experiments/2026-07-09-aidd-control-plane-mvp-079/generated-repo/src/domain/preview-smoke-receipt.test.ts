import { describe, expect, test } from "vitest";
import {
  getQueuePlanner,
  hasExecutionBlocker,
  normalizeQueueState,
  queuePayloadContainsExecuteNowOnly
} from "./preview-smoke-receipt";

describe("Repair Action Run Queue Intake のドメイン判定", () => {
  test("query stateを4状態へ正規化する", () => {
    expect(normalizeQueueState(undefined)).toBe("empty");
    expect(normalizeQueueState("unknown")).toBe("empty");
    expect(normalizeQueueState(["ready"])).toBe("ready");
    expect(normalizeQueueState("failure")).toBe("failure");
    expect(normalizeQueueState("blocked")).toBe("blocked");
  });

  test("readyはキュー投入前チェックを通過したpayloadを保持する", () => {
    const planner = getQueuePlanner("ready");
    expect(planner.message).toBe("実行キュー投入前チェックを通過しました");
    expect(planner.action.sourceRepairAction).toContain("mvp078");
    expect(planner.action.queuePayload.verificationCommands).toContain("pnpm run doctor:aidd");
    expect(planner.action.queuePayload.requiredEvidence).toContain("artifacts/screenshots/mvp079-terminal-evidence.png");
    expect(planner.action.queuePayload.rollbackCondition).toContain("キュー投入を取り消す");
    expect(planner.browsers.map((item) => item.browser)).toEqual(["Chromium", "Firefox", "WebKit"]);
  });

  test("queue payloadにはexecute_nowだけを入れる", () => {
    const planner = getQueuePlanner("ready");
    expect(queuePayloadContainsExecuteNowOnly(planner.action)).toBe(true);
    expect(planner.action.queuePayload.codexPromptPreview).toBe(planner.action.queuePayload.executeNowSummary);
    expect(JSON.stringify(planner.action.queuePayload)).not.toContain(planner.action.excludedNextIncrement);
    expect(JSON.stringify(planner.action.queuePayload)).not.toContain(planner.action.excludedLearningLog);
  });

  test("failureは4種類のReview Finding YAMLカードを保持する", () => {
    const planner = getQueuePlanner("failure");
    expect(planner.decision).toBe("Review Findingあり");
    expect(planner.reviewFindings.map((finding) => finding.category)).toEqual([
      "検証ゲート不足",
      "証跡ゲート不足",
      "rollbackゲート不足",
      "AIDD-Spec接続不足"
    ]);
    expect(planner.reviewFindings.every((finding) => finding.yaml.startsWith("review_finding:"))).toBe(true);
  });

  test("blockedは実行前停止理由をすべて保持する", () => {
    const planner = getQueuePlanner("blocked");
    expect(planner.decision).toBe("実行前停止");
    expect(planner.stopReasons.map((reason) => reason.category)).toEqual([
      "private URL",
      "local path",
      "Firefox除外",
      "terminal evidence不足",
      "failure screenshot不足",
      "next_increment混入",
      "learning_log混入",
      "破壊的cleanup要求"
    ]);
    expect(queuePayloadContainsExecuteNowOnly(planner.action)).toBe(false);
    expect(hasExecutionBlocker({ stopReasons: planner.stopReasons, browsers: planner.browsers, action: planner.action })).toBe(true);
  });
});
