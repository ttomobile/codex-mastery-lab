import { describe, expect, it } from "vitest";
import { getReceiptView, normalizeReceiptState } from "./public-preview-smoke-final-receipt";

describe("Public Preview Smoke Final Receipt", () => {
  it("不明な状態はemptyへ正規化する", () => {
    expect(normalizeReceiptState("unknown")).toBe("empty");
  });

  it("verifiedではHTTP receiptと3ブラウザcoverageが揃う", () => {
    const view = getReceiptView("verified");
    expect(view.receipts.every((receipt) => receipt.httpStatus === 200)).toBe(true);
    expect(view.receipts.every((receipt) => receipt.byteSize > 0)).toBe(true);
    expect(view.browserCoverage.map((item) => item.browser)).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(view.browserCoverage.every((item) => item.status === "pass")).toBe(true);
  });

  it("failureでは4種類の失敗をReview Findingへ変換する", () => {
    const view = getReceiptView("failure");
    expect(view.failureTransforms.map((item) => item.source)).toEqual(["HTTP 404", "0 byte", "content type mismatch", "latency超過"]);
    expect(view.failureTransforms[0].reviewFindingYaml).toContain("review_finding:");
    expect(view.failureTransforms[0].aiTaskPacketDelta).toContain("AI Task Packet delta");
    expect(view.failureTransforms[0].codexPromptDelta).toContain("Codex prompt delta");
  });

  it("blockedでは公開前ブロック条件を保持する", () => {
    const view = getReceiptView("blocked");
    expect(view.blockedReasons).toEqual(expect.arrayContaining(["private URL", "local path", "host名", "Firefox未確認", "terminal evidence不足", "AIDD-Spec接続不足", "rollback不足"]));
  });
});
