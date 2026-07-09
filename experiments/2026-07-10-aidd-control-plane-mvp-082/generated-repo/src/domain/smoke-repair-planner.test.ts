import { describe, expect, it } from "vitest";
import { getSmokeRepairView, normalizeSmokeRepairState, promptContainsExecuteNowOnly } from "./smoke-repair-planner";

describe("Smoke Receipt Repair Action Planner", () => {
  it("不明な状態はemptyに戻す", () => {
    expect(normalizeSmokeRepairState("unknown")).toBe("empty");
  });

  it("plannedではbroken URLとexecute_now actionを持つ", () => {
    const view = getSmokeRepairView("planned");
    expect(view.finding.brokenUrl).toContain("preview/assets");
    expect(view.executeNowAction).toContain("terminal-evidence");
    expect(view.aiddSpecConnection).toContain("AIDD-Spec v0.1");
  });

  it("failureではHTTP失敗をReview Findingに変換する", () => {
    const view = getSmokeRepairView("failure");
    expect(view.finding.category).toContain("HTTP 404");
    expect(view.reviewFindingYaml).toContain("review_finding:");
    expect(view.stopReasons).toContain("failure screenshot不足");
  });

  it("blockedでは公開前ブロック理由を持つ", () => {
    const view = getSmokeRepairView("blocked");
    expect(view.stopReasons).toContain("private URL混入");
    expect(view.stopReasons).toContain("local path混入");
    expect(view.stopReasons).toContain("Firefox除外");
    expect(view.stopReasons).toContain("AIDD-Spec接続不足");
  });

  it("prompt previewはexecute_nowだけを含む", () => {
    expect(promptContainsExecuteNowOnly(getSmokeRepairView("planned"))).toBe(true);
    expect(promptContainsExecuteNowOnly(getSmokeRepairView("blocked"))).toBe(true);
  });
});
