import { describe, expect, it } from "vitest";
import {
  buildIntakeDraft,
  evaluateReadiness,
  generateCodexPrompt,
  generateProductBrief,
  type IntakeInput
} from "../src/lib/intake";

const baseInput: IntakeInput = {
  appName: "",
  appType: "",
  targetUser: "",
  userProblem: "",
  keyFeaturesText: "",
  nonGoalsText: "",
  externalIntegrationsText: "",
  stateContract: [],
  qualityGates: []
};

describe("Project Intake Wizardのドメインロジック", () => {
  it("empty stateを判定できる", () => {
    const review = evaluateReadiness(buildIntakeDraft(baseInput));

    expect(review.status).toBe("empty");
    expect(review.score).toBe(0);
    expect(review.missingFields).toContain("アプリ名");
  });

  it("必須項目が不足しているinsufficient stateを判定できる", () => {
    const draft = buildIntakeDraft({
      ...baseInput,
      appName: "StudyFlow",
      appType: "Webアプリ",
      targetUser: "学習を継続したい社会人",
      userProblem: "今日やる教材を決められない",
      keyFeaturesText: "今日の学習キュー",
      stateContract: ["empty"],
      qualityGates: ["lint", "typecheck", "test"]
    });

    const review = evaluateReadiness(draft);

    expect(review.status).toBe("insufficient");
    expect(review.missingFields).toEqual(expect.arrayContaining(["主要機能を2件以上", "状態契約を2件以上", "品質ゲート: build"]));
  });

  it("ready stateを判定できる", () => {
    const review = evaluateReadiness(readyDraft());

    expect(review.status).toBe("ready");
    expect(review.score).toBe(100);
    expect(review.missingFields).toHaveLength(0);
  });

  it("Generated Product Briefにアプリ名、対象ユーザー、非ゴールが含まれる", () => {
    const brief = generateProductBrief(readyDraft());

    expect(brief).toContain("StudyFlow");
    expect(brief).toContain("学習を継続したい社会人");
    expect(brief).toContain("課金機能");
  });

  it("Generated Codex Promptに品質ゲートと状態契約が含まれる", () => {
    const prompt = generateCodexPrompt(readyDraft());

    expect(prompt).toContain("lint");
    expect(prompt).toContain("typecheck");
    expect(prompt).toContain("empty");
    expect(prompt).toContain("offline");
  });
});

function readyDraft() {
  return buildIntakeDraft({
    ...baseInput,
    appName: "StudyFlow",
    appType: "Webアプリ",
    targetUser: "学習を継続したい社会人",
    userProblem: "教材が散らばり、今日やることを決められない",
    keyFeaturesText: "今日の学習キュー\n進捗チェック",
    nonGoalsText: "課金機能\n外部AI API呼び出し",
    externalIntegrationsText: "なし",
    stateContract: ["empty", "success", "error", "offline"],
    qualityGates: ["lint", "typecheck", "test", "build", "e2e", "doctor:aidd"]
  });
}
