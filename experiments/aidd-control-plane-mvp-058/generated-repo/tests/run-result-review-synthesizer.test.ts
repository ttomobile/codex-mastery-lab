import { describe, expect, it } from "vitest";
import { createRunResultReviewInput, sanitizeForPublic, synthesizeRunResultReview } from "../src/lib/run-result-review-synthesizer";

describe("MVP058 Run Result Review Synthesizer", () => {
  it("emptyではRun Result Review Recordを生成しない", () => {
    const review = synthesizeRunResultReview(createRunResultReviewInput("empty"));

    expect(review.decision).toBe("empty");
    expect(review.review).toBeNull();
    expect(review.reviewFindings).toHaveLength(0);
    expect(review.evidenceRepairDeltas).toHaveLength(0);
  });

  it("validでは要求フィールドを持つRun Result Review Recordを生成する", () => {
    const review = synthesizeRunResultReview(createRunResultReviewInput("valid"));

    expect(review.decision).toBe("valid");
    expect(review.reviewFindings).toHaveLength(0);
    expect(review.evidenceRepairDeltas).toHaveLength(0);
    expect(review.review).toMatchObject({
      source_run_id: "MVP057-CODEX-RUN-STATUS-001",
      outcome: "succeeded",
      score: 96,
      terminal_evidence: ["assets/aidd-control-plane-mvp058-terminal-evidence.png"],
      screenshot_evidence: [
        "assets/aidd-control-plane-mvp058-empty.png",
        "assets/aidd-control-plane-mvp058-valid.png",
        "assets/aidd-control-plane-mvp058-failure.png",
        "assets/aidd-control-plane-mvp058-evidence-missing.png"
      ],
      browser_coverage: ["Chromium", "Firefox", "WebKit"],
      doctor_aidd: "passed",
      privacy_scan: "local path/private host/private network URLは検出なし。公開用証跡はWORKSPACE/HOME表記に統一済み。"
    });
    expect(review.review?.score_reason).toContain("3ブラウザE2E");
    expect(review.review?.rollback).toContain("Evidence Repair Delta");
    expect(review.review?.needed_upstream_info).toContain("次回Run Queueはsource_run_idとPlaywright report pathを必須で渡す。");
    expect(review.review?.standard_update).toContain("Run Result Review Synthesizer");
    expect(review.review?.ai_task_packet_delta).toContain("AI Task Packet Delta");
    expect(review.review?.codex_prompt_delta).toContain("Codex Prompt Delta");
    expect(review.review?.verification_command).toContain("capture:mvp058");
    expect(review.review?.learning_log).toContain("Learning Log");
    expect(review.review?.aidd_spec_connections.map((item) => item.id)).toEqual([
      "aidd-spec-v0.1",
      "control-plane-standard",
      "mvp057",
      "review-record",
      "learning-log"
    ]);
  });

  it("failureでは失敗6種類をReview Finding形式で返す", () => {
    const review = synthesizeRunResultReview(createRunResultReviewInput("failure"));
    const categories = review.reviewFindings.map((finding) => finding.category);

    expect(review.decision).toBe("failure");
    expect(review.review).toBeNull();
    expect(categories).toEqual([
      "command失敗",
      "Firefox未実行",
      "doctor:aidd失敗",
      "危険command",
      "rollback不足",
      "local path/private host/private network URL混入"
    ]);
    expect(review.reviewFindings.every((finding) => (
      finding.finding &&
      finding.severity &&
      finding.observed_by &&
      finding.ideal_state &&
      finding.fix_instruction &&
      finding.needed_upstream_info &&
      finding.standard_update &&
      finding.codex_prompt_delta &&
      finding.verification
    ))).toBe(true);
    expect(review.unsafeTokens).toContain("/Users/example/private/mvp058.log");
    expect(review.unsafeTokens).toContain("http://127.0.0.1:3058/install.sh");
    expect(review.unsafeTokens).toContain("http://10.0.0.58:3058/internal");
    expect(review.unsafeTokens).toContain("example-mac.local");
    expect(review.sanitizedPreview).toContain("WORKSPACE/private-url");
    expect(review.sanitizedPreview).not.toContain("/Users/");
    expect(review.sanitizedPreview).not.toContain("127.0.0.1");
  });

  it("evidence_missingでは成功結果でも不足証跡をRepair DeltaとLearning Logへ戻す", () => {
    const review = synthesizeRunResultReview(createRunResultReviewInput("evidence_missing"));

    expect(review.decision).toBe("evidence_missing");
    expect(review.review).toBeNull();
    expect(review.reviewFindings).toHaveLength(0);
    expect(review.evidenceRepairDeltas.map((delta) => delta.missing)).toEqual([
      "terminal evidence",
      "empty-valid-failure screenshot",
      "Playwright report",
      "Review Record出力"
    ]);
    expect(review.evidenceRepairDeltas.map((delta) => delta.return_to)).toEqual([
      "Evidence Repair Delta",
      "Learning Log",
      "Evidence Repair Delta",
      "Learning Log"
    ]);
  });

  it("sanitizeForPublicはlocal path/private host/private network URLを公開用表記へ変換する", () => {
    const input = "/Users/example/workspace/raw.log /home/runner/work/raw.log http://10.0.0.4:3058/debug example-mac.local";

    expect(sanitizeForPublic(input)).toBe("HOME/workspace/raw.log HOME/work/raw.log WORKSPACE/private-url WORKSPACE.local");
  });
});
