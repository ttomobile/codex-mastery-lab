import { describe, expect, it } from "vitest";
import {
  defaultDraft,
  defaultQualityGates,
  generateRunbook,
  validatePacketCompleteness
} from "../src/lib/aidd";

describe("AI Task Packet completeness", () => {
  it("必須項目が空なら不足項目を返す", () => {
    const result = validatePacketCompleteness({ ...defaultDraft, qualityGates: [] });

    expect(result.ready).toBe(false);
    expect(result.missing).toContain("プロジェクト名");
    expect(result.missing).toContain("解く課題");
    expect(result.missing).toContain("非ゴール");
    expect(result.missing).toContain("quality gate");
  });

  it("初期状態でも標準quality gateは表示できる", () => {
    expect(defaultDraft.qualityGates).toEqual([...defaultQualityGates]);
  });

  it("L3に必要な状態と失敗契約が揃うと準備OKになる", () => {
    const result = validatePacketCompleteness({
      ...defaultDraft,
      projectName: "AIDD Control Plane MVP",
      userProblem: "AI実装前の入力と検証証跡を一つの流れで作りたい",
      nonGoals: ["ログインは作らない"],
      successCriteria: ["Packet Previewが更新される"],
      qualityGates: [...defaultQualityGates]
    });

    expect(result.ready).toBe(true);
    expect(result.missing).toEqual([]);
    expect(result.warnings).toEqual([]);
  });
});

describe("Agent Runbook generation", () => {
  it("codex execコマンドとquality gateを含む", () => {
    const runbook = generateRunbook({
      ...defaultDraft,
      projectName: "AIDD Control Plane MVP",
      qualityGates: ["pnpm run lint", "pnpm run doctor:aidd"]
    });

    expect(runbook).toContain("codex exec");
    expect(runbook).toContain("pnpm run lint");
    expect(runbook).toContain("pnpm run doctor:aidd");
    expect(runbook).toContain("generated-repo/ の範囲だけを編集する");
  });
});
