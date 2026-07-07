import { describe, expect, it } from "vitest";
import { createRunQueueResultInput, reviewRunQueueStatus, sanitizeForPublic } from "../src/lib/run-queue-status-tracker";

describe("MVP057 Codex Run Queue Status Tracker", () => {
  it("emptyではStatus Trackerを生成しない", () => {
    const review = reviewRunQueueStatus(createRunQueueResultInput("empty"));

    expect(review.decision).toBe("empty");
    expect(review.tracker).toBeNull();
    expect(review.failureReasons).toHaveLength(0);
    expect(review.evidenceWarnings).toHaveLength(0);
  });

  it("waitingでは実行待ちとしてStatus Trackerを生成しない", () => {
    const review = reviewRunQueueStatus(createRunQueueResultInput("waiting"));

    expect(review.decision).toBe("waiting");
    expect(review.tracker).toBeNull();
    expect(review.failureReasons).toHaveLength(0);
  });

  it("runningでは実行中としてStatus Trackerを生成しない", () => {
    const review = reviewRunQueueStatus(createRunQueueResultInput("running"));

    expect(review.decision).toBe("running");
    expect(review.tracker).toBeNull();
    expect(review.evidenceWarnings).toHaveLength(0);
  });

  it("succeededでは指定項目を持つCodex Run Queue Status Trackerを生成する", () => {
    const review = reviewRunQueueStatus(createRunQueueResultInput("succeeded"));

    expect(review.decision).toBe("succeeded");
    expect(review.failureReasons).toHaveLength(0);
    expect(review.evidenceWarnings).toHaveLength(0);
    expect(review.tracker).toMatchObject({
      source_intake_id: "MVP056-RUN-QUEUE-INTAKE-001",
      queue_item_id: "MVP057-CODEX-RUN-STATUS-001",
      run_status: "succeeded",
      browser_projects: ["chromium", "firefox", "webkit"],
      terminal_evidence: ["assets/aidd-control-plane-mvp057-terminal-evidence.png"],
      screenshot_evidence: [
        "assets/aidd-control-plane-mvp057-empty.png",
        "assets/aidd-control-plane-mvp057-succeeded.png",
        "assets/aidd-control-plane-mvp057-failed.png",
        "assets/aidd-control-plane-mvp057-evidence-missing.png"
      ],
      playwright_report: "playwright-report/index.html"
    });
    expect(review.tracker?.actual_results).toContain("MVP057 Status Tracker UIを生成");
    expect(review.tracker?.verification_summary).toContain("Verification Evidence");
    expect(review.tracker?.rollback_plan).toContain("Codex Run Queue");
    expect(review.tracker?.review_record_output).toContain("Review Record");
    expect(review.tracker?.learning_log_output).toContain("Learning Log");
    expect(review.tracker?.aidd_spec_connections.map((item) => item.id)).toEqual([
      "mvp056",
      "mvp057",
      "verification-evidence",
      "review-record",
      "learning-log",
      "aidd-spec"
    ]);
  });

  it("failedでは失敗理由6種類と修正指示を返す", () => {
    const review = reviewRunQueueStatus(createRunQueueResultInput("failed"));
    const titles = review.failureReasons.map((reason) => reason.title);

    expect(review.decision).toBe("failed");
    expect(review.tracker).toBeNull();
    expect(titles).toEqual([
      "command失敗",
      "Firefox未実行",
      "doctor:aidd失敗",
      "危険なcommand",
      "rollback不足",
      "未サニタイズのlocal path/private host/private network URL"
    ]);
    expect(review.failureReasons.every((reason) => reason.fixInstruction.length > 0)).toBe(true);
    expect(review.unsafeTokens).toContain("/Users/example/private/mvp057.log");
    expect(review.unsafeTokens).toContain("http://127.0.0.1:3027/install.sh");
    expect(review.unsafeTokens).toContain("http://10.0.0.8:3027/internal");
    expect(review.unsafeTokens).toContain("example-mac.local");
    expect(review.sanitizedPreview).toContain("WORKSPACE/private-url");
    expect(review.sanitizedPreview).not.toContain("/Users/");
    expect(review.sanitizedPreview).not.toContain("127.0.0.1");
  });

  it("evidence_missingでは成功後の不足証跡と戻し先を返す", () => {
    const review = reviewRunQueueStatus(createRunQueueResultInput("evidence_missing"));
    const titles = review.evidenceWarnings.map((warning) => warning.title);

    expect(review.decision).toBe("evidence_missing");
    expect(review.tracker).toBeNull();
    expect(review.failureReasons).toHaveLength(0);
    expect(titles).toEqual([
      "terminal evidence不足",
      "empty/succeeded/failed/evidence_missing screenshot不足",
      "Playwright report不足",
      "Review Record出力不足"
    ]);
    expect(review.evidenceWarnings.map((warning) => warning.returnTo)).toEqual([
      "Evidence Repair Delta",
      "Learning Log",
      "Evidence Repair Delta",
      "Learning Log"
    ]);
  });

  it("sanitizeForPublicはlocal path/private host/private network URLを公開用表記へ変換する", () => {
    const input = "/Users/example/workspace/raw.log /home/runner/work/raw.log http://10.0.0.4:3028/debug example-mac.local";

    expect(sanitizeForPublic(input)).toBe("HOME/workspace/raw.log HOME/work/raw.log WORKSPACE/private-url WORKSPACE.local");
  });
});
