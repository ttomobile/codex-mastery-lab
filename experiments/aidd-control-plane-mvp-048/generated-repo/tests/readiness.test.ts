import { describe, expect, it } from "vitest";
import {
  createBlockedReadinessPacket,
  createEmptyReadinessPacket,
  createReadyReadinessPacket,
  evaluateOneRunExecutionReadinessGate
} from "../src/lib/readiness";

describe("One-Run Execution Readiness Gateの判定", () => {
  it("empty状態ではexecute_now入力待ちを表示できる", () => {
    const review = evaluateOneRunExecutionReadinessGate(createEmptyReadinessPacket());

    expect(review.status).toBe("empty");
    expect(review.issues).toContain("Review Finding Action Queueからexecute_now actionを1件選択してください");
    expect(review.commandPreview).toHaveLength(0);
  });

  it("ready状態ではexecute_now 1件だけをCodex command previewへ渡す", () => {
    const review = evaluateOneRunExecutionReadinessGate(createReadyReadinessPacket());

    expect(review.status).toBe("ready");
    expect(review.readyAction?.action).toBe("execute_now");
    expect(review.commandPreview).toHaveLength(1);
    expect(review.commandPreview[0]).toContain("codex exec");
    expect(review.commandPreview[0]).not.toContain("next_increment");
    expect(review.commandPreview[0]).not.toContain("learning_log");
    expect(review.connections).toEqual([
      "AIDD-Spec v0.1",
      "Verification Evidence",
      "Review Record",
      "Learning Log"
    ]);
  });

  it("blocked状態では実行前に止めるべき不足と混入を日本語で列挙できる", () => {
    const review = evaluateOneRunExecutionReadinessGate(createBlockedReadinessPacket());

    expect(review.status).toBe("blocked");
    expect(review.commandPreview).toHaveLength(0);
    expect(review.issues).toEqual(expect.arrayContaining([
      "source queue id不足",
      "execute_now以外のaction混入",
      "危険command",
      "sandbox mode不足",
      "required verification commands不足: pnpm run typecheck / pnpm run test / pnpm run build / pnpm run doctor:aidd",
      "Firefox除外",
      "terminal evidence不足",
      "failure screenshot不足",
      "rollback stop condition不足",
      "local path / host / private network URL混入",
      "AIDD-Spec connection不足"
    ]));
  });
});
