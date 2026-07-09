import { describe, expect, it } from "vitest";
import { createDigest, sanitizeForPublic } from "../src/domain/run-result-digest";

describe("Run Result Digest Publisher", () => {
  it("emptyではsource run未選択と次に必要な入力を返す", () => {
    const digest = createDigest("empty");
    expect(digest.publishReadiness).toBe("未選択");
    expect(digest.nextInputs).toContain("source run id");
    expect(digest.terminalEvidence).toHaveLength(0);
  });

  it("validでは共有に必要な全項目を返す", () => {
    const digest = createDigest("valid");
    expect(digest.runOutcome).toContain("品質ゲートは通過");
    expect(digest.score).toBe(92);
    expect(digest.browserCoverage.map((item) => item.name)).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(digest.reviewRecordExcerpt).toContain("Review Record");
    expect(digest.learningLogExcerpt).toContain("Learning Log");
    expect(digest.aiTaskPacketDelta).toContain("AI Task Packet");
    expect(digest.codexPromptDelta).toContain("Codex prompt");
    expect(digest.noteArticleAngle).toContain("AIDD");
  });

  it("failureではReview Findingとして不足を返す", () => {
    const digest = createDigest("failure");
    expect(digest.publishReadiness).toBe("レビュー差し戻し");
    const categories = digest.findings.map((finding) => finding.category);
    expect(categories).toContain("score根拠不足");
    expect(categories).toContain("Firefox未実行");
    expect(categories).toContain("console warn");
    expect(categories).toContain("terminal evidence不足");
  });

  it("blockedではlocal pathとprivate URL混入を公開停止にする", () => {
    const digest = createDigest("blocked");
    expect(digest.publishReadiness).toBe("公開停止");
    expect(digest.findings[0]?.category).toBe("local path / private host / private network URL混入");
    expect(digest.blockedTokens.length).toBeGreaterThan(0);
    expect(digest.sanitizedPreview).toContain("WORKSPACE/private-url");
    expect(digest.sanitizedPreview).not.toContain("/Users/");
  });

  it("公開前sanitizeでlocal path、private host、private network URLを隠す", () => {
    const sanitized = sanitizeForPublic("/Users/example/a.txt http://10.0.0.75/internal mvp075-workstation.local");
    expect(sanitized).toBe("WORKSPACE/private-url WORKSPACE/private-url WORKSPACE/private-url");
  });
});
