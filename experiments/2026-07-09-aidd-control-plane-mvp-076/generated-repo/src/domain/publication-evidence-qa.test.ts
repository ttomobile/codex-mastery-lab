import { describe, expect, test } from "vitest";
import {
  getPublicationEvidenceQa,
  hasPrivatePublicationLeak,
  normalizeQaState,
  toPublishDecision
} from "./publication-evidence-qa";

describe("Publication Evidence QA Gate のドメイン判定", () => {
  test("未知のquery stateはemptyへ正規化する", () => {
    expect(normalizeQaState("unknown")).toBe("empty");
    expect(normalizeQaState(undefined)).toBe("empty");
    expect(normalizeQaState(["blocked"])).toBe("blocked");
  });

  test("validは公開可能で3ブラウザが確認済みになる", () => {
    const qa = getPublicationEvidenceQa("valid");
    expect(qa.decision).toBe("公開可能");
    expect(qa.browserCoverage.map((item) => item.browser)).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(qa.browserCoverage.every((item) => item.status === "確認済み")).toBe(true);
  });

  test("failureは公開QA不足としてReview Findingを持つ", () => {
    const qa = getPublicationEvidenceQa("failure");
    expect(qa.decision).toBe("公開QA不足");
    expect(qa.reviewFindings.map((finding) => finding.category)).toContain("AIDD-Spec接続不足");
    expect(qa.reviewFindings.every((finding) => finding.verification_command.length > 0)).toBe(true);
  });

  test("blockedはlocal pathとprivate URLを公開前停止にする", () => {
    const qa = getPublicationEvidenceQa("blocked");
    expect(qa.decision).toBe("公開前停止");
    expect(qa.sanitizationScan.findings).toHaveLength(3);
    expect(hasPrivatePublicationLeak("/Users/sample/private-work/articles/draft.md")).toBe(true);
    expect(hasPrivatePublicationLeak("http://internal-host.local:3000/preview")).toBe(true);
    expect(hasPrivatePublicationLeak("http://192.168.1.23:9323/report")).toBe(true);
    expect(hasPrivatePublicationLeak("preview/mvp076-publication-evidence-qa.html")).toBe(false);
  });

  test("公開判定はblockedをfailureより強く扱う", () => {
    expect(toPublishDecision({ hasBlockingLeak: true, reviewFindings: [] })).toBe("公開前停止");
    expect(toPublishDecision({ hasBlockingLeak: false, reviewFindings: [{ category: "不足", severity: "error", ideal_state: "揃う", fix_instruction: "直す", verification_command: "pnpm run test", needed_upstream_info: "なし" }] })).toBe("公開QA不足");
    expect(toPublishDecision({ hasBlockingLeak: false, reviewFindings: [] })).toBe("公開可能");
  });
});
