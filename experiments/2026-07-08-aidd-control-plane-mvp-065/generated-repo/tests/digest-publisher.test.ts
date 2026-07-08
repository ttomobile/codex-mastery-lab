import { describe, expect, test } from "vitest";
import {
  blockedFindingTitles,
  buildCandidateMarkdown,
  createPublicationDigestViewModel,
  digestStates,
  evaluatePublicationDigest,
  getInputForState,
  requiredBrowsers,
  requiredScripts
} from "../src/domain/digest-publisher";

describe("Publication Evidence QA Gate", () => {
  test("empty / valid / failure / blockedをすべて判定できる", () => {
    expect(digestStates).toEqual(["empty", "valid", "failure", "blocked"]);
    for (const state of digestStates) {
      expect(createPublicationDigestViewModel(state).state).toBe(state);
      expect(evaluatePublicationDigest(getInputForState(state))).toBe(state);
    }
  });

  test("validでは公開候補ダイジェストとQA判定サマリーを表示する", () => {
    const view = createPublicationDigestViewModel("valid");
    expect(view.candidateMarkdown).toContain("## Publication Evidence QA Digest");
    expect(view.candidateMarkdown).toContain("source digest id: MVP065-PUBLICATION-EVIDENCE-QA-20260708");
    expect(view.candidateMarkdown).toContain("article path: articles/mvp065-publication-evidence-qa-gate.md");
    expect(view.candidateMarkdown).toContain("Chromium: 通過 / Firefox: 通過 / WebKit: 通過");
    expect(view.qaSummary).toContain("判定: valid");
  });

  test("blockedでは要件のReview Findingをすべて出す", () => {
    const view = createPublicationDigestViewModel("blocked");
    expect(view.findings.map((finding) => finding.title)).toEqual([...blockedFindingTitles]);
    expect(view.input.publishReadiness).toBe("公開不可");
  });

  test("failureは失敗調査中として扱う", () => {
    const view = createPublicationDigestViewModel("failure");
    expect(view.input.browserCoverage.Firefox).toBe("失敗");
    expect(view.findings[0]?.title).toBe("failureは公開候補OKではない");
  });

  test("公開候補Markdownは必要な入力項目を含む", () => {
    const markdown = buildCandidateMarkdown(getInputForState("valid"));
    for (const text of [
      "source digest id",
      "article path",
      "preview",
      "asset copy",
      "terminal evidence",
      "initial=",
      "filled=",
      "failure=",
      "terminal=",
      "console status",
      "sanitization scan",
      "Review Record",
      "Learning Log",
      "AI Task Packet delta",
      "Codex prompt delta",
      "publish checklist"
    ]) {
      expect(markdown).toContain(text);
    }
  });

  test("3ブラウザと必要scriptを固定する", () => {
    expect(requiredBrowsers).toEqual(["Chromium", "Firefox", "WebKit"]);
    expect(requiredScripts).toEqual([
      "pnpm run lint",
      "pnpm run typecheck",
      "pnpm run test",
      "pnpm run build",
      "pnpm run test:e2e",
      "pnpm run doctor:aidd",
      "pnpm run capture:mvp065"
    ]);
  });
});
