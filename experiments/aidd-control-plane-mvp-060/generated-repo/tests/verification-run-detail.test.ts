import { describe, expect, it } from "vitest";
import {
  createVerificationRunInput,
  evaluateVerificationRun,
  sanitizeForPublic
} from "../src/domain/verification-run-detail";

describe("MVP060 検証実行詳細", () => {
  it("emptyではsource queue itemがないため詳細を生成しない", () => {
    const result = evaluateVerificationRun(createVerificationRunInput("empty"));

    expect(result.decision).toBe("empty");
    expect(result.detail).toBeNull();
    expect(result.findings).toHaveLength(0);
    expect(result.repairDeltas).toHaveLength(0);
  });

  it("readyではVerification Run Detailの必須項目を表示できる", () => {
    const result = evaluateVerificationRun(createVerificationRunInput("valid"));

    expect(result.decision).toBe("ready");
    expect(result.findings).toHaveLength(0);
    expect(result.repairDeltas).toHaveLength(0);
    expect(result.detail).toMatchObject({
      source_queue_item_id: "MVP060-QUEUE-VERIFICATION-001",
      source_run_status: "succeeded",
      commit_sha: "8f4c2a1b9d0e7f6a5c3b2a190fedcba987654321",
      browser_coverage: { Chromium: true, Firefox: true, WebKit: true },
      terminal_evidence: expect.arrayContaining(["artifacts/screenshots/aidd-control-plane-mvp060-terminal-evidence.png"]),
      screenshot_evidence: expect.arrayContaining(["artifacts/screenshots/aidd-control-plane-mvp060-repair-needed.png"]),
      playwright_report: "playwright-report/index.html"
    });
    expect(result.detail?.command_details[0]).toMatchObject({
      command: "pnpm run lint",
      exit_code: 0,
      duration: "12秒",
      status: "passed",
      artifact_path: "artifacts/terminal/mvp060-lint.txt",
      failure_category: "なし",
      repair_instruction: "不要"
    });
    expect(result.detail?.review_finding_draft[0]?.title).toContain("ready");
    expect(result.detail?.aidd_spec_connections.map((item) => item.id)).toEqual([
      "aidd-spec-v0.1",
      "verification-run-detail",
      "command-detail-contract"
    ]);
  });

  it("blockedでは不足を標準Review Finding形式で返す", () => {
    const result = evaluateVerificationRun(createVerificationRunInput("failure"));
    const categories = result.findings.map((finding) => finding.category);

    expect(result.decision).toBe("blocked");
    expect(result.detail).toBeNull();
    expect(categories).toEqual([
      "commit SHA不足",
      "artifact path不足",
      "失敗分類不足",
      "修正指示不足",
      "Firefox除外",
      "証跡不足",
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
    expect(result.unsafeTokens).toContain("/Users/example/private/mvp060-run.txt");
    expect(result.unsafeTokens).toContain("http://10.0.0.60:3060/internal");
    expect(result.unsafeTokens).toContain("mvp060-workstation.local");
    expect(result.sanitizedPreview).toContain("WORKSPACE/private-url");
    expect(result.sanitizedPreview).not.toContain("/Users/");
  });

  it("repair_neededではfailedとtimeoutとevidence_missingを次回修復delta候補へ変換する", () => {
    const result = evaluateVerificationRun(createVerificationRunInput("repair_needed"));

    expect(result.decision).toBe("repair_needed");
    expect(result.detail).toBeNull();
    expect(result.repairDeltas.map((delta) => delta.source_status)).toEqual(["failed", "timeout", "evidence_missing"]);
    expect(result.repairDeltas.map((delta) => delta.verification_command)).toEqual([
      "pnpm run lint",
      "pnpm run test:e2e",
      "pnpm run doctor:aidd"
    ]);
    expect(result.findings).toHaveLength(3);
    expect(result.findings[0]?.ai_task_packet_delta).toContain("次回修復delta候補");
  });

  it("Firefox除外を検出する", () => {
    const result = evaluateVerificationRun(createVerificationRunInput("failure"));

    expect(result.findings.map((finding) => finding.category)).toContain("Firefox除外");
  });

  it("artifact path不足を検出する", () => {
    const result = evaluateVerificationRun(createVerificationRunInput("failure"));

    expect(result.findings.map((finding) => finding.category)).toContain("artifact path不足");
  });

  it("修正指示不足を検出する", () => {
    const result = evaluateVerificationRun(createVerificationRunInput("failure"));

    expect(result.findings.map((finding) => finding.category)).toContain("修正指示不足");
  });

  it("sanitizeForPublicは公開不可tokenを置換する", () => {
    const value = "/Users/example/work/raw.md /home/runner/work/raw.md http://10.0.0.60:3060/debug mvp060-workstation.local";

    expect(sanitizeForPublic(value)).toBe("HOME/work/raw.md HOME/work/raw.md WORKSPACE/private-url WORKSPACE.local");
  });
});
