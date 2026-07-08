import { describe, expect, it } from "vitest";
import { buildCodexPromptPreview, createActionQueueViewModel, hasPromptLeakage, queueStates } from "../src/domain/digest-publisher";

describe("Smoke Finding Action Queue", () => {
  it("4つの日本語UI状態を持つ", () => {
    expect(queueStates).toEqual(["empty", "queued", "blocked", "exported"]);
  });

  it("queuedでは失敗assetをexecute_nowへ分類する", () => {
    const view = createActionQueueViewModel("queued");
    expect(view.executeNow).toHaveLength(2);
    expect(view.nextIncrement).toHaveLength(1);
    expect(view.learningLog).toHaveLength(1);
    expect(view.executeNow[0].findingCategory).toContain("公開asset");
  });

  it("Codex prompt previewにはexecute_nowだけを入れる", () => {
    const view = createActionQueueViewModel("exported");
    expect(view.codexPromptPreview).toContain("RFQ-067-001");
    expect(view.codexPromptPreview).toContain("RFQ-067-002");
    expect(view.codexPromptPreview).not.toContain("RFQ-067-003");
    expect(view.codexPromptPreview).not.toContain("RFQ-067-004");
    expect(view.promptLeakage).toBe(false);
  });

  it("next_incrementやlearning_logがpromptに混ざると検出する", () => {
    const leaked = buildCodexPromptPreview(createActionQueueViewModel("queued").input.actions) + "\nRFQ-067-003 次回increment";
    expect(hasPromptLeakage(leaked)).toBe(true);
  });

  it("blockedはFirefox不足と証跡不足を止める", () => {
    const view = createActionQueueViewModel("blocked");
    expect(view.readiness).toBe("blocked");
    expect(view.input.blockedReasons).toContain("Firefox未確認");
    expect(view.input.blockedReasons).toContain("terminal evidence image response不足");
  });
});
