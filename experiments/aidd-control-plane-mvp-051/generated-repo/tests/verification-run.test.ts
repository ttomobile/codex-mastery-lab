import { describe, expect, it } from "vitest";
import {
  createEmptyDecisionPacket,
  createFailureDecisionPacket,
  createReadyDecisionPacket,
  evaluatePriorityDecisionWorkspace
} from "../src/lib/verification-run";

describe("Repair Delta Priority Decision Workspaceの判定", () => {
  it("empty状態では次回packetへ進める判断材料がないことを示す", () => {
    const review = evaluatePriorityDecisionWorkspace(createEmptyDecisionPacket());

    expect(review.status).toBe("empty");
    expect(review.issues).toContain("repair delta未選択: 次回AI Task Packetへ進める判断材料がありません");
    expect(review.acceptedDeltas).toHaveLength(0);
  });

  it("ready状態では採用済みdeltaだけを次回packetへ進める", () => {
    const review = evaluatePriorityDecisionWorkspace(createReadyDecisionPacket());

    expect(review.status).toBe("ready");
    expect(review.acceptedDeltas).toHaveLength(1);
    expect(review.acceptedDeltas[0].decision).toBe("採用");
    expect(review.heldOrRejectedDeltas.map((delta) => delta.decision)).toEqual(["保留", "却下"]);
    expect(review.nextPacketPreview).toHaveLength(1);
    expect(review.codexPromptPreview[0]).toContain("execute_now");
    expect(review.codexPromptPreview.join("\n")).not.toContain("next_increment:");
    expect(review.acceptedDeltas[0].browserProjects).toEqual(["chromium", "firefox", "webkit"]);
  });

  it("failure状態では未判断と未採用delta混入を日本語で列挙できる", () => {
    const review = evaluatePriorityDecisionWorkspace(createFailureDecisionPacket());

    expect(review.status).toBe("failure");
    expect(review.acceptedDeltas).toHaveLength(0);
    expect(review.issues).toEqual(expect.arrayContaining([
      "未判断",
      "理由不足",
      "証跡不足",
      "rollback不足",
      "Firefox除外",
      "未採用delta混入",
      "Verification Evidence接続不足",
      "Review Record接続不足",
      "Learning Log接続不足",
      "AIDD-Spec接続不足",
      "local path / host / private network URL混入"
    ]));
    expect(review.publishBlockReasons).toEqual([
      "公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています"
    ]);
  });
});
