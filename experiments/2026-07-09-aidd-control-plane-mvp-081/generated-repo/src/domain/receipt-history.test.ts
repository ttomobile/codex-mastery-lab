import { describe, expect, it } from "vitest";
import { getHistoryView, normalizeHistoryState, promptContainsExecuteNowOnly } from "./receipt-history";

describe("Dispatch Receipt履歴比較", () => {
  it("不明な状態はemptyに戻す", () => {
    expect(normalizeHistoryState("unknown")).toBe("empty");
  });

  it("validでは3件以上のReceipt履歴を持つ", () => {
    const view = getHistoryView("valid");
    expect(view.receipts.length).toBeGreaterThanOrEqual(3);
    expect(view.scoreDelta).toContain("72");
    expect(view.aiddSpecConnection).toContain("AIDD-Spec v0.1");
  });

  it("improvedでは減ったfindingと効いたRepair Actionを表示する", () => {
    const view = getHistoryView("improved");
    expect(view.reducedFindings).toContain("terminal evidence不足");
    expect(view.effectiveRepairActions.join(" ")).toContain("failure state capture");
  });

  it("blockedでは公開前ブロック理由を持つ", () => {
    const view = getHistoryView("blocked");
    expect(view.stopReasons).toContain("private URL混入");
    expect(view.stopReasons).toContain("Firefox除外");
  });

  it("prompt previewはexecute_nowだけを含む", () => {
    expect(promptContainsExecuteNowOnly(getHistoryView("valid"))).toBe(true);
    expect(promptContainsExecuteNowOnly(getHistoryView("blocked"))).toBe(true);
  });
});
