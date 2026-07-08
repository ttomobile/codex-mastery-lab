import { describe, expect, test } from "vitest";
import {
  blockedFindingTitles,
  buildCandidateMarkdown,
  createPublicationDigestViewModel,
  digestStates,
  evaluatePublicPreviewSmoke,
  getInputForState,
  requiredBrowsers,
  requiredScripts
} from "../src/domain/digest-publisher";

describe("Public Preview Smoke Verifier", () => {
  test("empty判定はsmoke run idとchecked URLsが未入力なら入力待ちにする", () => {
    expect(digestStates).toEqual(["empty", "valid", "failure", "blocked"]);
    expect(evaluatePublicPreviewSmoke(getInputForState("empty"))).toBe("empty");
    expect(createPublicationDigestViewModel("empty").state).toBe("empty");
  });

  test("ready判定は公開preview HTMLとassetのHTTP証跡がそろうとvalidにする", () => {
    const view = createPublicationDigestViewModel("valid");
    expect(evaluatePublicPreviewSmoke(getInputForState("valid"))).toBe("valid");
    expect(view.input.smokeRunId).toBe("MVP066-SMOKE-20260708-VALID");
    expect(view.input.checkedUrls).toHaveLength(2);
    expect(view.candidateMarkdown).toContain("## Public Preview Smoke Digest");
    expect(view.candidateMarkdown).toContain("preview URL/path: preview/mvp066-public-preview-smoke-verifier.html");
    expect(view.candidateMarkdown).toContain("Chromium: 通過 / Firefox: 通過 / WebKit: 通過");
  });

  test("failure判定は失敗assetを公開preview確認OKにしない", () => {
    const view = createPublicationDigestViewModel("failure");
    expect(evaluatePublicPreviewSmoke(getInputForState("failure"))).toBe("failure");
    expect(view.input.checkedUrls[1]?.httpStatus).toBe(404);
    expect(view.findings[0]?.title).toBe("失敗asset");
    expect(view.input.smokeReadiness).toBe("asset失敗調査中");
  });

  test("blocked判定は不足したHTTP経路と接続文言をReview Findingに戻す", () => {
    const view = createPublicationDigestViewModel("blocked");
    expect(evaluatePublicPreviewSmoke(getInputForState("blocked"))).toBe("blocked");
    expect(view.findings.map((finding) => finding.title)).toEqual([...blockedFindingTitles]);
    expect(view.input.smokeReadiness).toBe("公開preview確認不可");
  });

  test("公開preview smoke Markdownは必須表示項目を含む", () => {
    const markdown = buildCandidateMarkdown(getInputForState("valid"));
    for (const text of [
      "smoke run id",
      "article path",
      "preview URL/path",
      "checked URLs",
      "HTTP 200",
      "bytes",
      "content type",
      "ms",
      "terminal evidence image response",
      "console status",
      "sanitization scan",
      "Review Finding",
      "Learning Log",
      "AI Task Packet delta",
      "Codex prompt delta",
      "rerun command",
      "AIDD-Spec v0.1",
      "AIDD Control Plane MVP v0.1",
      "Verification Evidence",
      "Release Checklist"
    ]) {
      expect(markdown).toContain(text);
    }
  });

  test("3ブラウザと必要scriptをMVP066で固定する", () => {
    expect(requiredBrowsers).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(requiredScripts).toEqual([
      "pnpm run lint",
      "pnpm run typecheck",
      "pnpm run test",
      "pnpm run build",
      "pnpm run test:e2e",
      "pnpm run doctor:aidd",
      "pnpm run capture:mvp066"
    ]);
  });
});
