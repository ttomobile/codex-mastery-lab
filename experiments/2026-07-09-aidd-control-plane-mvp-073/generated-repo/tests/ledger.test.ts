import { describe, expect, test } from "vitest";
import {
  buildCodexCommandPreview,
  buildRunQueuePayloadPreview,
  detectEvidenceMissingFindings,
  detectRejectedFindings,
  evidenceMissingRunQueueItem,
  getQueueViewModel,
  queuedRunQueueItem,
  rejectedRunQueueItem
} from "../src/ledger";

describe("Smoke Action Run Queue Intakeの判定", () => {
  test("queuedではRun Queue投入に必要な項目を保持する", () => {
    const viewModel = getQueueViewModel("queued");

    expect(viewModel.item?.sourceSmokeActionId).toBe("smoke-action-mvp073-link-regression-001");
    expect(viewModel.item?.queueItemId).toBe("run-queue-mvp073-0001");
    expect(viewModel.item?.codexCommand).toContain("codex run");
    expect(viewModel.item?.sandboxMode).toBe("danger-full-access");
    expect(viewModel.item?.requiredVerificationCommands).toContain("pnpm run capture:mvp073");
    expect(viewModel.item?.requiredBrowsers).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(viewModel.item?.requiredEvidence).toContain("playwright-report/index.html");
    expect(viewModel.item?.rollbackPlan).toContain("Run Queue投入を取り消す");
    expect(viewModel.item?.aiddSpecConnections).toContain("Run Queue");
  });

  test("queued payloadとCodex command previewはexecute_nowだけを表示する", () => {
    const payload = buildRunQueuePayloadPreview(queuedRunQueueItem);
    const commandPreview = buildCodexCommandPreview(queuedRunQueueItem);

    expect(payload).toContain('"execute_now"');
    expect(commandPreview).toContain('"execute_now"');
    expect(payload).not.toContain("next_increment");
    expect(payload).not.toContain("learning_log");
    expect(commandPreview).not.toContain("next_increment");
    expect(commandPreview).not.toContain("learning_log");
  });

  test("rejectedでは6種類の投入拒否理由を検出する", () => {
    const findings = detectRejectedFindings(rejectedRunQueueItem);
    const labels = findings.map((finding) => finding.label);

    expect(labels).toEqual(
      expect.arrayContaining([
        "未export action",
        "execute_now以外混入",
        "危険command",
        "sandbox不足",
        "Firefox除外",
        "local path/private network URL混入"
      ])
    );
  });

  test("evidence_missingでは3種類の証跡不足を検出する", () => {
    const findings = detectEvidenceMissingFindings(evidenceMissingRunQueueItem);
    const labels = findings.map((finding) => finding.label);

    expect(labels).toEqual(
      expect.arrayContaining([
        "terminal evidence不足",
        "failure screenshot不足",
        "Playwright report不足"
      ])
    );
  });

  test("正常なqueued itemでは拒否理由と証跡不足を出さない", () => {
    expect(detectRejectedFindings(queuedRunQueueItem)).toEqual([]);
    expect(detectEvidenceMissingFindings(queuedRunQueueItem)).toEqual([]);
  });

  test("emptyではitemを持たない", () => {
    const viewModel = getQueueViewModel("empty");

    expect(viewModel.item).toBeNull();
    expect(viewModel.mode).toBe("empty");
  });
});
