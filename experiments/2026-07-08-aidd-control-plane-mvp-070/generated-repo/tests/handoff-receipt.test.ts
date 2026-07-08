import { describe, expect, it } from "vitest";
import { createHandoffReceiptViewModel, hasUnsafePublicPrompt } from "../src/domain/handoff-receipt";

describe("Shrunk Packet Handoff Receipt", () => {
  it("emptyではsource shrink plan不足としてblockedになる", () => {
    const view = createHandoffReceiptViewModel("empty");
    expect(view.receiptStatus).toBe("blocked");
    expect(view.blockers).toContain("source shrink plan不足");
  });

  it("validではexecute_nowだけをCodex promptへ渡しdefer_next_incrementを混ぜない", () => {
    const view = createHandoffReceiptViewModel("valid");
    expect(view.receiptStatus).toBe("valid");
    expect(view.canHandoff).toBe(true);
    expect(view.input.executeNow).toHaveLength(1);
    expect(view.input.deferNextIncrement.length).toBeGreaterThan(0);
    expect(view.input.codexPromptPreview).toContain("execute_now");
    expect(view.input.codexPromptPreview).not.toContain("defer_next_incrementをまとめて");
  });

  it("blockedではFirefox除外とfailure screenshot不足とrollback不足を検出する", () => {
    const view = createHandoffReceiptViewModel("blocked");
    expect(view.receiptStatus).toBe("blocked");
    expect(view.blockers).toContain("Firefox不足");
    expect(view.blockers).toContain("failure screenshot不足");
    expect(view.blockers).toContain("rollback不足");
    expect(view.blockers).toContain("公開用prompt混入");
  });

  it("private URLやlocal pathがpromptに混ざると検出する", () => {
    expect(hasUnsafePublicPrompt("private-preview.example.invalid を見る")).toBe(true);
    const localHomePath = ["", "Users", "example", "project"].join("/");
    expect(hasUnsafePublicPrompt(localHomePath)).toBe(true);
    expect(hasUnsafePublicPrompt("execute_nowだけを実行する")).toBe(false);
  });
});
