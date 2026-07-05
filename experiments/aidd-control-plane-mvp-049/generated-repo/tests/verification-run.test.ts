import { describe, expect, it } from "vitest";
import {
  createEmptyVerificationRunPacket,
  createFailureVerificationRunPacket,
  createReadyVerificationRunPacket,
  evaluateVerificationRunDetail
} from "../src/lib/verification-run";

describe("Verification Run Detail Drilldownの判定", () => {
  it("empty状態ではcommand別detail作成待ちを表示できる", () => {
    const review = evaluateVerificationRunDetail(createEmptyVerificationRunPacket());

    expect(review.status).toBe("empty");
    expect(review.issues).toContain("Codex Run Queueから1件を選び、command別Verification Run Detailを作成してください");
    expect(review.readyDetails).toHaveLength(0);
  });

  it("ready状態では6つのcommand明細とAIDD接続を確認できる", () => {
    const review = evaluateVerificationRunDetail(createReadyVerificationRunPacket());

    expect(review.status).toBe("ready");
    expect(review.readyDetails.map((detail) => detail.commandName)).toEqual([
      "lint",
      "typecheck",
      "test",
      "build",
      "test:e2e",
      "doctor:aidd"
    ]);
    expect(review.readyDetails.every((detail) => detail.exitCode === 0)).toBe(true);
    expect(review.readyDetails.every((detail) => detail.failureCategory === "なし")).toBe(true);
    expect(review.readyDetails.every((detail) => detail.repairInstruction === "追加修正なし")).toBe(true);
    expect(review.connectedTo).toEqual([
      "AIDD-Spec v0.1",
      "Verification Evidence",
      "Review Record",
      "Learning Log"
    ]);
    expect(review.reviewFindingDraft.failureCategory).toBe("修正不要");
  });

  it("failure状態では不足と混入を日本語で列挙できる", () => {
    const review = evaluateVerificationRunDetail(createFailureVerificationRunPacket());

    expect(review.status).toBe("failure");
    expect(review.readyDetails).toHaveLength(0);
    expect(review.issues).toEqual(expect.arrayContaining([
      "commit SHA不足",
      "command別detail不足: typecheck / test / build / doctor:aidd",
      "exit code不足",
      "artifact path不足",
      "失敗分類不足",
      "修正指示不足",
      "Firefox除外",
      "terminal evidence不足",
      "failure screenshot不足",
      "AIDD-Spec connection不足",
      "local path / host / private network URL混入"
    ]));
    expect(review.reviewFindingDraft.repairInstruction).toContain("不足しているcommit SHA");
    expect(review.reviewFindingDraft.verificationCommands).toEqual(["pnpm run test:e2e"]);
  });
});
