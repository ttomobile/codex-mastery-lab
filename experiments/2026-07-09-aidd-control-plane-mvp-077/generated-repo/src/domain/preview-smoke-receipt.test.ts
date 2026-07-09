import { describe, expect, test } from "vitest";
import {
  evaluateUrl,
  getReceiptBinder,
  hasPublicationBlocker,
  normalizeReceiptState
} from "./preview-smoke-receipt";

describe("Preview Smoke Receipt Binder のドメイン判定", () => {
  test("query stateを4状態へ正規化する", () => {
    expect(normalizeReceiptState(undefined)).toBe("empty");
    expect(normalizeReceiptState("unknown")).toBe("empty");
    expect(normalizeReceiptState(["valid"])).toBe("valid");
    expect(normalizeReceiptState("failure")).toBe("failure");
    expect(normalizeReceiptState("blocked")).toBe("blocked");
  });

  test("validはReceipt保存可能で3ブラウザ確認済みになる", () => {
    const binder = getReceiptBinder("valid");
    expect(binder.message).toBe("公開previewのHTTP証跡を保存できます");
    expect(binder.checkedUrls.every((item) => item.httpStatus === 200)).toBe(true);
    expect(binder.browsers.map((item) => item.browser)).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(binder.browsers.every((item) => item.status === "確認済み")).toBe(true);
  });

  test("failureは404、0 byte、content type mismatch、latency超過をReview Findingにする", () => {
    const binder = getReceiptBinder("failure");
    expect(binder.decision).toBe("Review Findingあり");
    expect(binder.reviewFindings.map((finding) => finding.category)).toEqual([
      "404",
      "0 byte",
      "content type mismatch",
      "latency超過"
    ]);
  });

  test("blockedは公開前停止理由をすべて保持する", () => {
    const binder = getReceiptBinder("blocked");
    expect(binder.decision).toBe("公開前停止");
    expect(binder.stopReasons.map((reason) => reason.category)).toEqual([
      "private URL",
      "local path",
      "Firefox未確認",
      "receipt保存先不足",
      "AIDD-Spec接続不足"
    ]);
    expect(hasPublicationBlocker({ stopReasons: binder.stopReasons, browsers: binder.browsers })).toBe(true);
  });

  test("URL評価は正常なpreviewとPNGをfindingなしにする", () => {
    const findings = evaluateUrl({
      label: "公開asset PNG",
      url: "https://publish.example.test/assets/ok.png",
      httpStatus: 200,
      byteSize: 100,
      contentType: "image/png",
      latencyMs: 120,
      checkedAt: "2026-07-09T09:00:00+09:00",
      evidencePath: "artifacts/receipts/mvp077/ok.png"
    });
    expect(findings).toEqual([]);
  });
});
