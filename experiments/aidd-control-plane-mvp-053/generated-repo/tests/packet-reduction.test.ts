import { describe, expect, it } from "vitest";
import { createTaskPacket, reviewTaskPacket, sanitizeForPublic } from "../src/lib/packet-reduction";

describe("MVP053 AI Task Packet自動縮小", () => {
  it("readyでは縮小提案を出さず通常実行を維持する", () => {
    const review = reviewTaskPacket(createTaskPacket("ready"));

    expect(review.decision).toBe("ready");
    expect(review.usageBand).toBe("go");
    expect(review.proposal).toBeNull();
    expect(review.publishBlockReasons).toHaveLength(0);
  });

  it("brakeでは縮小後AI Task Packet提案を生成する", () => {
    const review = reviewTaskPacket(createTaskPacket("brake"));

    expect(review.decision).toBe("brake");
    expect(review.usageBand).toBe("brake");
    expect(review.publishBlockReasons[0]).toContain("公開前ブロック");
    expect(review.proposal?.keep_now).toContain("src/libの純粋関数とunit testを先に固定する");
    expect(review.proposal?.minimum_verification).toEqual([
      "pnpm run lint",
      "pnpm run typecheck",
      "pnpm run test",
      "pnpm run build",
      "pnpm run doctor:aidd"
    ]);
    expect(review.proposal?.resume_condition).toContain("3ブラウザE2E");
    expect(review.proposal?.prompt_preview).toContain("decision=brake");
    expect(review.proposal?.prompt_preview).toContain("HOME/codex-mastery-lab");
    expect(review.proposal?.prompt_preview).not.toContain("/Users/");
    expect(review.proposal?.prompt_preview).not.toContain("tto-mac.local");
  });

  it("stopではfallback_actionで停止と再開条件を明示する", () => {
    const review = reviewTaskPacket(createTaskPacket("stop"));

    expect(review.decision).toBe("stop");
    expect(review.usageBand).toBe("stop");
    expect(review.proposal?.fallback_action).toContain("実装を停止");
    expect(review.proposal?.resume_condition).toContain("再開");
    expect(review.proposal?.evidence_paths.join("\n")).toContain("WORKSPACE/private-url");
    expect(review.proposal?.evidence_paths.join("\n")).not.toContain("127.0.0.1");
    expect(review.proposal?.evidence_paths.join("\n")).not.toContain("/home/");
  });

  it("sanitizeForPublicはlocal pathとprivate hostをWORKSPACE/HOME表示へ変換する", () => {
    const input = "/Users/tto/codex-mastery-lab/raw.log /home/runner/work/raw.log http://127.0.0.1:3021/debug tto-mac.local";

    expect(sanitizeForPublic(input)).toBe("HOME/codex-mastery-lab/raw.log HOME/work/raw.log WORKSPACE/private-url WORKSPACE.local");
  });
});
