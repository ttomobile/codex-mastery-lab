import { describe, expect, it } from "vitest";
import { getHandoffView, handoffStates, normalizeHandoffState } from "./final-receipt-failure-handoff-queue";

describe("Final Receipt Failure Handoff Queue", () => {
  it("未知の状態はemptyに正規化する", () => {
    expect(normalizeHandoffState("unknown")).toBe("empty");
  });

  it("4状態を持つ", () => {
    expect(handoffStates).toEqual(["empty", "queued", "blocked", "exported"]);
  });

  it("queuedでは3つのlaneへ分離する", () => {
    const view = getHandoffView("queued");
    expect(view.executeNow).toHaveLength(1);
    expect(view.nextIncrement).toHaveLength(1);
    expect(view.learningLog).toHaveLength(1);
    expect(view.executeNow[0]?.lane).toBe("execute_now");
  });

  it("exportedのCodex prompt previewにはexecute_nowだけを入れる", () => {
    const view = getHandoffView("exported");
    expect(view.codexPromptPreview).toContain("execute_nowのみ");
    expect(view.codexPromptPreview).toContain("terminal evidence画像");
    expect(view.codexPromptPreview).not.toContain("latency超過をPublic Preview Smoke Verifierへ戻す");
    expect(view.codexPromptPreview).not.toContain("Learning Logへ");
  });

  it("blockedでは公開前停止理由を表示する", () => {
    const view = getHandoffView("blocked");
    expect(view.blockedReasons).toContain("Firefox未確認");
    expect(view.blockedReasons).toContain("terminal evidence不足");
    expect(view.blockedReasons).toContain("rollback不足");
  });
});
