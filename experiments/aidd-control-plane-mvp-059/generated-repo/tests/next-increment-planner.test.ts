import { describe, expect, it } from "vitest";
import {
  createNextIncrementPlannerInput,
  planNextIncrement,
  sanitizeForPublic
} from "../src/domain/next-increment-planner";

describe("MVP059 次インクリメントプランナー", () => {
  it("emptyではsource reviewがないため計画を生成しない", () => {
    const result = planNextIncrement(createNextIncrementPlannerInput("empty"));

    expect(result.decision).toBe("empty");
    expect(result.plan).toBeNull();
    expect(result.findings).toHaveLength(0);
    expect(result.evidenceRepairIncrement).toBeNull();
  });

  it("readyでは次の1インクリメントと必須項目を生成する", () => {
    const result = planNextIncrement(createNextIncrementPlannerInput("valid"));

    expect(result.decision).toBe("ready");
    expect(result.findings).toHaveLength(0);
    expect(result.evidenceRepairIncrement).toBeNull();
    expect(result.plan).toMatchObject({
      source_review_id: "MVP058-REVIEW-READY-001",
      source_run_id: "MVP058-CODEX-RUN-REVIEW-001",
      recommended_increment: expect.stringContaining("次の1インクリメント"),
      priority_reason: expect.stringContaining("source review"),
      target_artifacts: expect.arrayContaining(["src/domain/next-increment-planner.ts"]),
      acceptance_criteria: expect.arrayContaining([expect.stringContaining("UIは日本語")]),
      verification_commands: expect.arrayContaining(["pnpm run test:e2e", "pnpm run doctor:aidd"]),
      required_evidence: expect.arrayContaining([
        "artifacts/screenshots/aidd-control-plane-mvp059-terminal-evidence.png",
        "artifacts/screenshots/aidd-control-plane-mvp059-failure.png"
      ]),
      rollback_condition: expect.stringContaining("blockedへ戻す"),
      note_article_angle: expect.stringContaining("MVP059"),
      learning_log_connection: expect.stringContaining("Learning Log")
    });
    expect(result.plan?.aidd_spec_connections.map((item) => item.id)).toEqual([
      "aidd-spec-v0.1",
      "control-plane-next-increment",
      "mvp058-review-record",
      "learning-log"
    ]);
  });

  it("blockedでは不足をReview Finding形式で返す", () => {
    const result = planNextIncrement(createNextIncrementPlannerInput("failure"));
    const categories = result.findings.map((finding) => finding.category);

    expect(result.decision).toBe("blocked");
    expect(result.plan).toBeNull();
    expect(categories).toEqual([
      "source review不足",
      "priority不足",
      "3ブラウザE2E不足",
      "terminal/failure screenshot不足",
      "rollback不足",
      "local path/private host/private network URL混入"
    ]);
    expect(result.findings.every((finding) => (
      finding.category &&
      finding.finding &&
      finding.severity &&
      finding.observed_by &&
      finding.ideal_state &&
      finding.fix_instruction &&
      finding.ai_task_packet_delta &&
      finding.codex_prompt_delta &&
      finding.verification_command
    ))).toBe(true);
    expect(result.unsafeTokens).toContain("/Users/example/private/mvp059-review.md");
    expect(result.unsafeTokens).toContain("http://10.0.0.59:3059/internal");
    expect(result.unsafeTokens).toContain("mvp059-workstation.local");
    expect(result.sanitizedPreview).toContain("WORKSPACE/private-url");
    expect(result.sanitizedPreview).not.toContain("/Users/");
  });

  it("evidence_missingでは証跡不足を最優先インクリメントにする", () => {
    const result = planNextIncrement(createNextIncrementPlannerInput("evidence_missing"));

    expect(result.decision).toBe("evidence_missing");
    expect(result.plan).toBeNull();
    expect(result.findings).toHaveLength(0);
    expect(result.evidenceRepairIncrement).toMatchObject({
      recommended_increment: expect.stringContaining("証跡不足"),
      priority_reason: expect.stringContaining("terminal evidence"),
      verification_commands: ["pnpm run capture:mvp059", "pnpm run doctor:aidd"],
      rollback_condition: expect.stringContaining("evidence_missingへ戻す")
    });
    expect(result.evidenceRepairIncrement?.required_evidence).toEqual([
      "artifacts/screenshots/aidd-control-plane-mvp059-terminal-evidence.png",
      "artifacts/screenshots/aidd-control-plane-mvp059-empty.png",
      "artifacts/screenshots/aidd-control-plane-mvp059-failure.png",
      "artifacts/screenshots/aidd-control-plane-mvp059-evidence-missing.png"
    ]);
  });

  it("Codex prompt draftはexecute_now以外を混入させない", () => {
    const input = createNextIncrementPlannerInput("valid");
    input.candidatePlan?.codex_prompt_draft.push(
      { mode: "plan_only", prompt: "計画だけを作る" },
      { mode: "research_only", prompt: "調査だけを行う" }
    );

    const result = planNextIncrement(input);

    expect(result.decision).toBe("ready");
    expect(result.plan?.codex_prompt_draft).toHaveLength(1);
    expect(result.plan?.codex_prompt_draft[0]?.mode).toBe("execute_now");
  });

  it("sanitizeForPublicは公開不可tokenを置換する", () => {
    const value = "/Users/example/work/raw.md /home/runner/work/raw.md http://10.0.0.59:3059/debug mvp059-workstation.local";

    expect(sanitizeForPublic(value)).toBe("HOME/work/raw.md HOME/work/raw.md WORKSPACE/private-url WORKSPACE.local");
  });
});
