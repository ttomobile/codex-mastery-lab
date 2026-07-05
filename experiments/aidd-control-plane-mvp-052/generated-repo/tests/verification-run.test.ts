import { describe, expect, it } from "vitest";
import { createEmptyBudget, createFailureBudget, createReadyBudget, evaluateBudgetGate } from "../src/lib/verification-run";

describe("Codex Run Budget Gateの判定", () => {
  it("empty状態では実行候補packetがないことを示す", () => {
    const review = evaluateBudgetGate(createEmptyBudget());

    expect(review.status).toBe("empty");
    expect(review.issues).toContain("実行候補packet未選択: Codexを開始できません");
    expect(review.promptPreview).toHaveLength(0);
  });

  it("ready状態ではgoになりCodex prompt previewを生成する", () => {
    const review = evaluateBudgetGate(createReadyBudget());

    expect(review.status).toBe("go");
    expect(review.usageBand).toBe("go");
    expect(review.issues).toHaveLength(0);
    expect(review.promptPreview[0]).toContain("採用済みdeltaだけをCodexへ渡す");
    expect(createReadyBudget().browserProjects).toEqual(["chromium", "firefox", "webkit"]);
  });

  it("failure状態では利用枠過多と停止条件不足を日本語で列挙できる", () => {
    const review = evaluateBudgetGate(createFailureBudget());

    expect(review.status).toBe("stop");
    expect(review.usageBand).toBe("stop");
    expect(review.promptPreview).toHaveLength(0);
    expect(review.issues).toEqual(expect.arrayContaining([
      "primary usage過多",
      "secondary usage過多",
      "max runtime不足",
      "停止条件不足",
      "fallback action不足",
      "検証コマンド不足: pnpm run lint",
      "検証コマンド不足: pnpm run typecheck",
      "検証コマンド不足: pnpm run test",
      "検証コマンド不足: pnpm run build",
      "検証コマンド不足: pnpm run doctor:aidd",
      "Firefox除外",
      "Verification Evidence接続不足",
      "Review Record接続不足",
      "Learning Log接続不足",
      "Maintenance Runbook接続不足",
      "AIDD-Spec接続不足",
      "local path / host / private network URL混入"
    ]));
    expect(review.publishBlockReasons).toEqual([
      "公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています"
    ]);
  });
});
