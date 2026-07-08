import { describe, expect, it } from "vitest";
import { createQueueRun, evaluateQueueStatus, queueStatuses } from "../src/domain/run-queue-status";

describe("Codex Run Queue Status Tracker", () => {
  it("empty状態ではRunを表示せず古い証跡を使わない", () => {
    const result = evaluateQueueStatus("empty");
    expect(result.decision).toBe("empty");
    expect(result.run).toBeNull();
    expect(result.reviewRecord).toContain("Run Queueは空");
    expect(result.learningLog).toContain("古いRunの証跡を表示しない");
  });

  it("waiting状態では実行待ちとして実行コマンドと3ブラウザ範囲を保持する", () => {
    const result = evaluateQueueStatus("waiting");
    expect(result.decision).toBe("queued");
    expect(result.run?.runCommand).toContain("pnpm run lint");
    expect(result.run?.browserScope).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(result.findings).toHaveLength(0);
  });

  it("running状態では完了判定を出さず検証証跡を待つ", () => {
    const result = evaluateQueueStatus("running");
    expect(result.decision).toBe("active");
    expect(result.learningLog).toContain("running中は完了判定を出さず");
    expect(result.run?.verificationCommand).toContain("pnpm run test:e2e");
  });

  it("succeeded状態ではterminal evidenceとscreenshot evidenceをそろえる", () => {
    const result = evaluateQueueStatus("succeeded");
    expect(result.decision).toBe("passed");
    expect(result.run?.evidence.terminal).toContain("artifacts/terminal/capture-mvp063.txt");
    expect(result.run?.evidence.screenshots).toContain("artifacts/screenshots/aidd-control-plane-mvp063-succeeded.png");
    expect(result.reviewRecord).toContain("succeeded");
  });

  it("failed状態では実行失敗をReview Findingとして出す", () => {
    const result = evaluateQueueStatus("failed");
    expect(result.decision).toBe("blocked");
    expect(result.findings.map((finding) => finding.category)).toContain("実行失敗");
    expect(result.findings[0]?.missing).toContain("成功した検証コマンド");
  });

  it("evidence_missing状態では証跡不足をReview Findingとして出す", () => {
    const result = evaluateQueueStatus("evidence_missing");
    expect(result.decision).toBe("evidence_missing");
    expect(result.findings.map((finding) => finding.category)).toContain("証跡不足");
    expect(result.findings[0]?.missing).toContain("screenshot evidence");
    expect(result.findings[0]?.verificationCommand).toBe("pnpm run capture:mvp063 && pnpm run doctor:aidd");
  });

  it("6状態すべてのfixtureを生成できる", () => {
    expect(queueStatuses).toEqual(["empty", "waiting", "running", "succeeded", "failed", "evidence_missing"]);
    expect(queueStatuses.map((status) => createQueueRun(status)?.status ?? "empty")).toEqual(queueStatuses);
  });
});
