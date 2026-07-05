import { describe, expect, it } from "vitest";
import {
  createEmptyRepairPacket,
  createFailureRepairPacket,
  createReadyRepairPacket,
  evaluateRepairDeltaGenerator
} from "../src/lib/verification-run";

describe("Evidence Repair Delta Generatorの判定", () => {
  it("empty状態では次回packetへ戻す材料がないことを示す", () => {
    const review = evaluateRepairDeltaGenerator(createEmptyRepairPacket());

    expect(review.status).toBe("empty");
    expect(review.issues).toContain("finding未読込: 次回AI Task Packetへ戻す材料がありません");
    expect(review.deltas).toHaveLength(0);
  });

  it("ready状態では3つ以上のdelta候補を生成できる", () => {
    const review = evaluateRepairDeltaGenerator(createReadyRepairPacket());

    expect(review.status).toBe("ready");
    expect(review.deltas).toHaveLength(3);
    expect(review.deltas.map((delta) => delta.failureCategory)).toEqual(["failed", "evidence_missing", "timeout"]);
    expect(review.deltas.map((delta) => delta.verificationCommand)).toEqual([
      "pnpm run test:e2e",
      "pnpm run capture:mvp050",
      "pnpm run doctor:aidd"
    ]);
    expect(review.deltas.every((delta) => delta.aiTaskPacketDelta.length > 0)).toBe(true);
    expect(review.deltas.every((delta) => delta.codexPromptDelta.length > 0)).toBe(true);
    expect(review.deltas.every((delta) => delta.rollbackCondition.length > 0)).toBe(true);
    expect(review.deltas.every((delta) => delta.learningLogProposal.length > 0)).toBe(true);
    expect(review.deltas.every((delta) => delta.aiddSpecConnection.includes("AIDD-Spec"))).toBe(true);
  });

  it("failure状態では不足と危険情報混入を日本語で列挙できる", () => {
    const review = evaluateRepairDeltaGenerator(createFailureRepairPacket());

    expect(review.status).toBe("failure");
    expect(review.deltas).toHaveLength(0);
    expect(review.issues).toEqual(expect.arrayContaining([
      "finding ID不足",
      "失敗分類不足",
      "優先度不足",
      "AI Task Packet delta不足",
      "Codex prompt delta不足",
      "検証command不足",
      "rollback条件不足",
      "Learning Log不足",
      "AIDD-Spec connection不足",
      "local path / host / private network URL混入"
    ]));
    expect(review.reviewFindingDraft.publishBlockReasons).toEqual([
      "公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています"
    ]);
  });
});
