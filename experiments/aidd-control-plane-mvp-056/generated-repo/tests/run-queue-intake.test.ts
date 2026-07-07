import { describe, expect, it } from "vitest";
import { createRunQueueInput, reviewRunQueueInput, sanitizeForPublic } from "../src/lib/run-queue-intake";

describe("MVP056 Run Queue Intake", () => {
  it("emptyではRun Queue Intakeを生成しない", () => {
    const review = reviewRunQueueInput(createRunQueueInput("empty"));

    expect(review.decision).toBe("empty");
    expect(review.intake).toBeNull();
    expect(review.rejectionReasons).toHaveLength(0);
    expect(review.evidenceWarnings).toHaveLength(0);
  });

  it("queuedでは必須項目を持つRun Queue Intakeを生成する", () => {
    const review = reviewRunQueueInput(createRunQueueInput("queued"));

    expect(review.decision).toBe("queued");
    expect(review.rejectionReasons).toHaveLength(0);
    expect(review.evidenceWarnings).toHaveLength(0);
    expect(review.intake).toMatchObject({
      source_decision_id: "MVP055-HANDOFF-DECISION-APPROVED-2026-07-07",
      queue_item_id: "MVP056-RUN-QUEUE-INTAKE-001",
      run_status: "ready_for_codex_run_queue",
      sandbox_mode: "workspace-write",
      browser_projects: ["chromium", "firefox", "webkit"],
      required_evidence: [
        "assets/aidd-control-plane-mvp056-empty.png",
        "assets/aidd-control-plane-mvp056-queued.png",
        "assets/aidd-control-plane-mvp056-rejected.png",
        "assets/aidd-control-plane-mvp056-evidence-missing.png",
        "assets/aidd-control-plane-mvp056-terminal-evidence.png",
        "playwright-report/index.html"
      ]
    });
    expect(review.intake?.codex_command).toContain("pnpm run doctor:aidd");
    expect(review.intake?.required_verification_commands).toContain("pnpm run test:coverage");
    expect(review.intake?.rollback_plan).toContain("Codex Run Queue");
    expect(review.intake?.aidd_spec_connections.map((item) => item.id)).toEqual(["mvp055", "mvp056", "codex-run-queue", "spec-gate"]);
  });

  it("rejectedでは拒否理由7種類と修正指示を返す", () => {
    const review = reviewRunQueueInput(createRunQueueInput("rejected"));
    const titles = review.rejectionReasons.map((reason) => reason.title);

    expect(review.decision).toBe("rejected");
    expect(review.intake).toBeNull();
    expect(titles).toEqual([
      "held / blocked / unapproved decision",
      "危険なcommand",
      "sandbox不足",
      "Firefox除外",
      "浅い検証",
      "rollback不足",
      "未サニタイズのlocal path/private host/private network URL"
    ]);
    expect(review.rejectionReasons.every((reason) => reason.fixInstruction.length > 0)).toBe(true);
    expect(review.unsafeTokens).toContain("/Users/example/workspace/private/mvp056.log");
    expect(review.unsafeTokens).toContain("http://127.0.0.1:3027/install.sh");
    expect(review.unsafeTokens).toContain("http://10.0.0.8:3027/internal");
    expect(review.unsafeTokens).toContain("example-mac.local");
    expect(review.sanitizedPreview).toContain("WORKSPACE/private-url");
    expect(review.sanitizedPreview).not.toContain("/Users/");
    expect(review.sanitizedPreview).not.toContain("127.0.0.1");
  });

  it("evidence_missingではapproved判断後の不足証跡と戻し先を返す", () => {
    const review = reviewRunQueueInput(createRunQueueInput("evidence_missing"));
    const titles = review.evidenceWarnings.map((warning) => warning.title);

    expect(review.decision).toBe("evidence_missing");
    expect(review.intake).toBeNull();
    expect(review.rejectionReasons).toHaveLength(0);
    expect(titles).toEqual([
      "terminal evidence不足",
      "empty/queued/rejected/evidence_missing screenshot不足",
      "Playwright report不足"
    ]);
    expect(review.evidenceWarnings.map((warning) => warning.returnTo)).toEqual(["Review Record", "Learning Log", "Review Record"]);
  });

  it("sanitizeForPublicはlocal path/private host/private network URLを公開用表記へ変換する", () => {
    const input = "/Users/example/workspace/raw.log /home/runner/work/raw.log http://10.0.0.4:3028/debug example-mac.local";

    expect(sanitizeForPublic(input)).toBe("HOME/workspace/raw.log HOME/work/raw.log WORKSPACE/private-url WORKSPACE.local");
  });
});
