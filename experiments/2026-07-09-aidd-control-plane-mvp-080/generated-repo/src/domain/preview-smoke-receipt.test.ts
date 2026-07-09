import { describe, expect, test } from "vitest";
import {
  getDispatchReceipt,
  hasDispatchBlocker,
  normalizeDispatchState,
  payloadContainsExecuteNowOnly
} from "./preview-smoke-receipt";

describe("Run Queue Dispatch Receipt のドメイン判定", () => {
  test("query stateを5状態へ正規化する", () => {
    expect(normalizeDispatchState(undefined)).toBe("empty");
    expect(normalizeDispatchState("unknown")).toBe("empty");
    expect(normalizeDispatchState(["ready"])).toBe("ready");
    expect(normalizeDispatchState("running")).toBe("running");
    expect(normalizeDispatchState("failure")).toBe("failure");
    expect(normalizeDispatchState("blocked")).toBe("blocked");
  });

  test("readyはDispatch Receipt発行に必要なpayloadを保持する", () => {
    const receipt = getDispatchReceipt("ready");
    expect(receipt.message).toBe("Dispatch Receiptを発行できます");
    expect(receipt.action.queueItem).toContain("mvp079");
    expect(receipt.action.payload.dispatchCommand).toContain("codex exec");
    expect(receipt.action.payload.verificationCommands).toContain("pnpm run doctor:aidd");
    expect(receipt.action.payload.requiredEvidence).toContain("artifacts/screenshots/mvp080-terminal-evidence.png");
    expect(receipt.action.payload.rollbackCondition).toContain("Dispatch Receiptをfailureへ戻す");
    expect(receipt.browsers.map((item) => item.browser)).toEqual(["Chromium", "Firefox", "WebKit"]);
  });

  test("dispatch payloadにはexecute_nowだけを入れる", () => {
    const receipt = getDispatchReceipt("ready");
    expect(payloadContainsExecuteNowOnly(receipt.action)).toBe(true);
    expect(receipt.action.payload.payloadPreview).toBe(receipt.action.payload.executeNowSummary);
    expect(JSON.stringify(receipt.action.payload)).not.toContain(receipt.action.excludedNextIncrement);
    expect(JSON.stringify(receipt.action.payload)).not.toContain(receipt.action.excludedLearningLog);
  });

  test("runningは進捗とpending evidenceを保持する", () => {
    const receipt = getDispatchReceipt("running");
    expect(receipt.decision).toBe("実行中");
    expect(receipt.message).toBe("実行中の証跡を収集中");
    expect(receipt.action.pendingEvidence).toContain("terminal evidence PNG生成待ち");
  });

  test("failureはReview Finding YAMLカードと次のRepair Action候補を保持する", () => {
    const receipt = getDispatchReceipt("failure");
    expect(receipt.decision).toBe("Review Findingあり");
    expect(receipt.reviewFindings.map((finding) => finding.category)).toEqual([
      "dispatch command失敗",
      "証跡ゲート不足",
      "rollbackゲート発火"
    ]);
    expect(receipt.reviewFindings.every((finding) => finding.yaml.startsWith("review_finding:"))).toBe(true);
    expect(receipt.action.nextRepairAction).toContain("Codex CLI");
  });

  test("blockedはDispatch停止理由をすべて保持する", () => {
    const receipt = getDispatchReceipt("blocked");
    expect(receipt.decision).toBe("Dispatch停止");
    expect(receipt.stopReasons.map((reason) => reason.category)).toEqual([
      "private URL",
      "local path",
      "Firefox除外",
      "terminal evidence不足",
      "failure screenshot不足",
      "next_increment混入",
      "learning_log混入",
      "破壊的cleanup要求"
    ]);
    expect(payloadContainsExecuteNowOnly(receipt.action)).toBe(false);
    expect(hasDispatchBlocker({ stopReasons: receipt.stopReasons, browsers: receipt.browsers, action: receipt.action })).toBe(true);
  });
});
