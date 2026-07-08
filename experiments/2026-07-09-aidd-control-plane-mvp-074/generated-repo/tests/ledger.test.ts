import { describe, expect, test } from "vitest";
import {
  baseRunQueueItem,
  detectEvidenceMissingFindings,
  detectFailedReviewFindings,
  getQueueViewModel,
  normalizeState,
  requiredVerificationCommands
} from "../src/ledger";

describe("Codex Run Queue Status Trackerの判定", () => {
  test("waitingでは投入元、command、sandbox、検証command、3ブラウザ、rollback、AIDD-Spec接続を保持する", () => {
    const viewModel = getQueueViewModel("waiting");

    expect(viewModel.item?.sourceIntakeId).toBe("intake-mvp074-codex-run-status-001");
    expect(viewModel.item?.queueItemId).toBe("run-queue-mvp074-0001");
    expect(viewModel.item?.codexCommand).toContain("codex run");
    expect(viewModel.item?.sandbox).toBe("danger-full-access");
    expect(viewModel.item?.requiredVerificationCommands).toEqual(requiredVerificationCommands);
    expect(viewModel.item?.requiredBrowsers).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(viewModel.item?.rollbackPlan).toContain("差し戻す");
    expect(viewModel.item?.aiddSpecConnections).toContain("AIDD-Spec v0.1");
  });

  test("runningでは開始時刻、operator、現在step、duration、evidence root、console収集状態を保持する", () => {
    const viewModel = getQueueViewModel("running");

    expect(viewModel.item?.startedAt).toContain("2026-07-09");
    expect(viewModel.item?.operator).toContain("Codex Run Queue");
    expect(viewModel.item?.currentStep).toContain("doctor:aidd");
    expect(viewModel.item?.duration).toBe("18分42秒");
    expect(viewModel.item?.evidenceRoot).toBe("artifacts/");
    expect(viewModel.item?.browserConsoleCollectionStatus).toContain("Firefox");
  });

  test("succeededでは結果、exit code、3ブラウザcoverage、証跡、Review Record、Learning Logを保持する", () => {
    const viewModel = getQueueViewModel("succeeded");

    expect(viewModel.item?.actualResults).toContain(
      "waiting / running / succeeded / failed / evidence_missingをquery paramで表示"
    );
    expect(viewModel.item?.commandResults.every((result) => result.exitCode === 0)).toBe(true);
    expect(viewModel.item?.browserCoverage.Firefox).toContain("完了");
    expect(viewModel.item?.terminalEvidence).toContain("artifacts/terminal/test-e2e.txt");
    expect(viewModel.item?.screenshotEvidence).toContain(
      "artifacts/screenshots/aidd-control-plane-mvp074-succeeded.png"
    );
    expect(viewModel.item?.playwrightReport).toBe("playwright-report/index.html");
    expect(viewModel.item?.reviewRecordOutput.join(" ")).toContain("Review Findingなし");
    expect(viewModel.item?.learningLogOutput.join(" ")).toContain("次回AI Task Packet");
  });

  test("failedではReview Findingとして7種類の失敗を検出する", () => {
    const labels = detectFailedReviewFindings(baseRunQueueItem).map((finding) => finding.label);

    expect(labels).toEqual(
      expect.arrayContaining([
        "command失敗",
        "Firefox未実行",
        "doctor:aidd失敗",
        "危険command",
        "rollback不足",
        "console error/warn",
        "local path/private network URL混入"
      ])
    );
  });

  test("evidence_missingでは5種類の証跡不足を検出する", () => {
    const labels = detectEvidenceMissingFindings(baseRunQueueItem).map((finding) => finding.label);

    expect(labels).toEqual(
      expect.arrayContaining([
        "terminal evidence不足",
        "failure screenshot不足",
        "browser console log不足",
        "Playwright report不足",
        "掲載用GIF不足"
      ])
    );
  });

  test("query paramの未知状態はemptyへ正規化する", () => {
    expect(normalizeState("waiting")).toBe("waiting");
    expect(normalizeState("unknown")).toBe("empty");
    expect(getQueueViewModel("empty").item).toBeNull();
  });
});
