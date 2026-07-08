import { describe, expect, it } from "vitest";
import { createReadinessViewModel, gateStates, hasPromptLeakage, verificationCommands } from "../src/domain/readiness-gate";

describe("One-Run Execution Readiness Gate", () => {
  it("4つの日本語UI状態を持つ", () => {
    expect(gateStates).toEqual(["empty", "ready", "blocked", "sanitized"]);
  });

  it("readyではexecute_nowだけをRun Queue直前で許可する", () => {
    const view = createReadinessViewModel("ready");
    expect(view.readiness).toBe("ready");
    expect(view.canQueue).toBe(true);
    expect(view.input.lane).toBe("execute_now");
    expect(view.input.browserProjects.Firefox).toBe("必須");
    expect(view.input.requiredVerificationCommands).toEqual(verificationCommands);
  });

  it("blockedはnext_increment混入とFirefox除外を止める", () => {
    const view = createReadinessViewModel("blocked");
    expect(view.readiness).toBe("blocked");
    expect(view.input.blockedReasons).toContain("execute_now以外のaction混入");
    expect(view.input.blockedReasons).toContain("Firefox除外");
    expect(view.input.blockedReasons).toContain("terminal/failure screenshot不足");
  });

  it("sanitizedでは公開危険文字列なしでexecute_nowだけをpromptに残す", () => {
    const view = createReadinessViewModel("sanitized");
    expect(view.input.codexPromptPreview).toContain("execute_now action RFQ-067-001だけ");
    expect(view.input.codexPromptPreview).not.toContain("RFQ-067-003");
    expect(view.input.codexPromptPreview).not.toContain("next_increment");
    expect(view.input.sanitizationScan).toContain("local path");
    expect(view.promptLeakage).toBe(false);
  });

  it("execute_now以外やlocal pathがpromptに混ざると検出する", () => {
    expect(hasPromptLeakage("RFQ-067-003 次回incrementを実行する")).toBe(true);
    const localPath = "/" + "Users" + "/example/project を直す";
    expect(hasPromptLeakage(localPath)).toBe(true);
  });
});
