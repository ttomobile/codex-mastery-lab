import { describe, expect, test } from "vitest";
import {
  blockedAction,
  buildCodexPromptPreview,
  buildLeakyPromptPreview,
  detectBlockedFindings,
  exportedAction,
  getQueueViewModel,
  queuedAction
} from "../src/ledger";

describe("Smoke Finding Action Queueの判定", () => {
  test("queuedではURL障害と実行patchを保持する", () => {
    const viewModel = getQueueViewModel("queued");

    expect(viewModel.action?.brokenUrl).toContain("preview.example.invalid");
    expect(viewModel.action?.httpStatus).toBe(404);
    expect(viewModel.action?.contentType).toContain("text/html");
    expect(viewModel.action?.findingCategory).toBe("smoke-link-regression");
    expect(viewModel.action?.severity).toBe("high");
    expect(viewModel.action?.lane).toBe("publish-readiness");
    expect(viewModel.action?.aiTaskPacketPatch).toContain(
      "Smoke Finding Action Queueでbroken URLを1件の実行単位に束ねる"
    );
    expect(viewModel.action?.verificationCommands).toContain("pnpm run capture:mvp072");
  });

  test("exportedではexecute_nowだけがCodex prompt previewへ入る", () => {
    const preview = buildCodexPromptPreview(exportedAction);

    expect(preview).toContain("execute_now 1: broken URLの参照元と生成元を特定する");
    expect(preview).toContain("execute_now 3: terminal evidenceとスクリーンショットをartifactsへ保存する");
    expect(preview).not.toContain("context:");
    expect(preview).not.toContain("defer:");
    expect(preview).not.toContain("外部監視SaaS連携");
  });

  test("blockedでは5種類の停止条件を検出する", () => {
    const findings = detectBlockedFindings(blockedAction, buildLeakyPromptPreview(blockedAction));
    const labels = findings.map((finding) => finding.label);

    expect(labels).toEqual(
      expect.arrayContaining([
        "private URL混入",
        "Firefox未確認",
        "terminal evidence不足",
        "AIDD-Spec接続不足",
        "execute_now以外のprompt混入"
      ])
    );
  });

  test("正常なqueued actionではblocked検出を出さない", () => {
    expect(detectBlockedFindings(queuedAction)).toEqual([]);
  });

  test("emptyではactionを持たない", () => {
    const viewModel = getQueueViewModel("empty");

    expect(viewModel.action).toBeNull();
    expect(viewModel.mode).toBe("empty");
  });
});
