import { describe, expect, it } from "vitest";
import { createHandoffPacket, reviewHandoffPacket, sanitizeForPublic } from "../src/lib/handoff-receipt";

describe("MVP054 縮小版ハンドオフレシート", () => {
  it("emptyではハンドオフレシートを生成しない", () => {
    const review = reviewHandoffPacket(createHandoffPacket("empty"));

    expect(review.decision).toBe("empty");
    expect(review.receipt).toBeNull();
    expect(review.publishBlocks).toHaveLength(0);
  });

  it("validでは必須項目を持つ縮小版ハンドオフレシートを生成する", () => {
    const review = reviewHandoffPacket(createHandoffPacket("valid"));

    expect(review.decision).toBe("valid");
    expect(review.publishBlocks).toHaveLength(0);
    expect(review.receipt).toMatchObject({
      source_shrink_plan_id: "MVP053-SHRINK-PLAN-READY-2026-07-07",
      minimum_verification: [
        "pnpm run lint",
        "pnpm run typecheck",
        "pnpm run test",
        "pnpm run build",
        "pnpm run test:e2e",
        "pnpm run doctor:aidd"
      ],
      required_evidence: [
        "assets/aidd-control-plane-mvp054-empty.png",
        "assets/aidd-control-plane-mvp054-valid.png",
        "assets/aidd-control-plane-mvp054-blocked.png",
        "assets/aidd-control-plane-mvp054-terminal-evidence.png"
      ]
    });
    expect(review.receipt?.codex_prompt_preview).toContain("MVP053のShrink Planner");
    expect(review.receipt?.rollback_condition).toContain("次回実行へ渡さない");
    expect(review.receipt?.aidd_spec_connections.map((item) => item.id)).toEqual(["mvp053", "handoff", "verification"]);
  });

  it("blockedでは公開前ブロック5種類と修正指示を返す", () => {
    const review = reviewHandoffPacket(createHandoffPacket("blocked"));
    const titles = review.publishBlocks.map((block) => block.title);

    expect(review.decision).toBe("blocked");
    expect(review.receipt).toBeNull();
    expect(titles).toEqual([
      "未サニタイズのlocal path/private host/private network URL",
      "minimum_verification不足",
      "rollback不足",
      "Chromium/Firefox/WebKit不足",
      "evidence不足"
    ]);
    expect(review.publishBlocks.every((block) => block.fixInstruction.length > 0)).toBe(true);
    expect(review.unsafeTokens).toContain("/Users/tto/codex-mastery-lab/private/raw.log");
    expect(review.unsafeTokens).toContain("http://127.0.0.1:3024/internal");
    expect(review.unsafeTokens).toContain("tto-mac.local");
    expect(review.sanitizedPreview).toContain("HOME/codex-mastery-lab");
    expect(review.sanitizedPreview).toContain("WORKSPACE/private-url");
    expect(review.sanitizedPreview).not.toContain("/Users/");
    expect(review.sanitizedPreview).not.toContain("127.0.0.1");
  });

  it("sanitizeForPublicはlocal path/private host/private network URLを公開用表記へ変換する", () => {
    const input = "/Users/tto/codex-mastery-lab/raw.log /home/runner/work/raw.log http://10.0.0.4:3024/debug tto-mac.local";

    expect(sanitizeForPublic(input)).toBe("HOME/codex-mastery-lab/raw.log HOME/work/raw.log WORKSPACE/private-url WORKSPACE.local");
  });
});
