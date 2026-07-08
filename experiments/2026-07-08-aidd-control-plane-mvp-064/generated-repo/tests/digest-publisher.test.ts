import { describe, expect, test } from "vitest";
import {
  blockedFindingTitles,
  buildSharedMarkdown,
  createDigestViewModel,
  digestStates,
  getInputForState,
  requiredBrowsers,
  requiredScripts
} from "../src/domain/digest-publisher";

describe("Run Result Digest Publisher", () => {
  test("4状態をすべて生成できる", () => {
    expect(digestStates).toEqual(["empty", "valid", "failure", "blocked"]);
    for (const state of digestStates) {
      expect(createDigestViewModel(state).state).toBe(state);
    }
  });

  test("validでは共有用Markdownと次回差分を表示する", () => {
    const view = createDigestViewModel("valid");
    expect(view.sharedMarkdown).toContain("## Run Result Digest");
    expect(view.sharedMarkdown).toContain("source run id: MVP063-RUN-SUCCEEDED-20260708");
    expect(view.sharedMarkdown).toContain("Chromium: 通過 / Firefox: 通過 / WebKit: 通過");
    expect(view.codexPromptDelta).toContain("次回Codex prompt delta");
    expect(view.verificationChecklist).toContain("Chromium / Firefox / WebKit coverageを確認");
  });

  test("blockedでは必須Review Findingをすべて出す", () => {
    const view = createDigestViewModel("blocked");
    expect(view.findings.map((finding) => finding.title)).toEqual([...blockedFindingTitles]);
    expect(view.input.publishReadiness).toBe("公開不可");
  });

  test("failureは失敗調査中として扱う", () => {
    const view = createDigestViewModel("failure");
    expect(view.input.browserCoverage.Firefox).toBe("失敗");
    expect(view.findings[0]?.title).toBe("failureは共有準備OKではない");
  });

  test("共有Markdownは必要な入力項目を含む", () => {
    const markdown = buildSharedMarkdown(getInputForState("valid"));
    for (const text of ["terminal evidence", "initial=", "filled=", "failure=", "terminal=", "Review Record", "Learning Log", "AI Task Packet delta", "note article angle", "publish readiness"]) {
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
      "pnpm run capture:mvp064"
    ]);
  });
});
