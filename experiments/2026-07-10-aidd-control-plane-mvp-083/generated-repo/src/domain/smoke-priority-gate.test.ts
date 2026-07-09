import { describe, expect, it } from "vitest";
import { getSmokePriorityView, normalizeSmokePriorityState, promptContainsExecuteNowOnly, smokePriorityStates } from "./smoke-priority-gate";

describe("Smoke Repair Priority Gate", () => {
  it("日本語状態を4種類で扱う", () => {
    expect(smokePriorityStates).toEqual(["empty", "prioritized", "conflict", "blocked"]);
    expect(normalizeSmokePriorityState("prioritized")).toBe("prioritized");
    expect(normalizeSmokePriorityState("unknown")).toBe("empty");
  });

  it("prioritizedではexecute_nowだけをCodex prompt previewへ入れる", () => {
    const view = getSmokePriorityView("prioritized");
    expect(view.executeNow).toContain("terminal evidence");
    expect(view.deferNextIncrement.length).toBeGreaterThan(0);
    expect(view.returnToLearningLog.length).toBeGreaterThan(0);
    expect(promptContainsExecuteNowOnly(view)).toBe(true);
    expect(view.codexPromptPreview).not.toContain("defer_next_increment:");
    expect(view.codexPromptPreview).not.toContain("return_to_learning_log:");
  });

  it("conflictでは優先順位衝突をReview Finding化する", () => {
    const view = getSmokePriorityView("conflict");
    expect(view.conflictReasons).toContain("高severity候補が複数ある");
    expect(view.reviewFindingYaml).toContain("Priority Conflict");
    expect(view.stopReasons).toContain("優先順位衝突");
  });

  it("blockedでは危険条件と証跡不足を止める", () => {
    const view = getSmokePriorityView("blocked");
    expect(view.stopReasons).toEqual(expect.arrayContaining(["private URL混入", "local path混入", "Firefox除外", "terminal evidence不足", "failure screenshot不足", "rollback不足", "AIDD-Spec接続不足", "execute_now以外混入"]));
    expect(view.rollbackCondition).toContain("Run Queueへ投入しない");
  });
});
