import { describe, expect, it } from "vitest";
import {
  createShrinkPlanViewModel,
  hasPromptLeakage,
  minimumVerificationCommands,
  plannerStates
} from "../src/domain/budget-shrink-planner";

describe("Codex Run Budget Shrink Planner", () => {
  it("4つの日本語UI状態を持つ", () => {
    expect(plannerStates).toEqual(["ready", "brake", "stop", "sanitized"]);
  });

  it("readyでは予算内の縮小packetを実行可能にする", () => {
    const view = createShrinkPlanViewModel("ready");
    expect(view.runState).toBe("ready");
    expect(view.canRunShrunkPacket).toBe(true);
    expect(view.input.keepNow).toHaveLength(1);
    expect(view.input.minimumVerification).toEqual(minimumVerificationCommands);
    expect(view.input.browserProjects.Firefox).toBe("必須");
  });

  it("brakeではkeep_nowを1件に絞りdefer_next_incrementを次回送りにする", () => {
    const view = createShrinkPlanViewModel("brake");
    expect(view.runState).toBe("brake");
    expect(view.input.keepNow).toEqual(["壊れたpreview asset URLを1件だけ修正する"]);
    expect(view.input.deferNextIncrement).toContain("CI artifact API連携");
    expect(view.input.blockedReasons).toContain("実行予算超過のためkeep_nowへ縮小");
  });

  it("stopでは最低検証と3ブラウザと証跡不足を止める", () => {
    const view = createShrinkPlanViewModel("stop");
    expect(view.runState).toBe("stop");
    expect(view.hardBlockers).toContain("最低検証不足");
    expect(view.hardBlockers).toContain("3ブラウザ不足");
    expect(view.missingBrowser).toContain("Firefox");
    expect(view.missingEvidence).toContain("artifacts/terminal");
  });

  it("sanitizedでは公開用promptにkeep_nowだけを残す", () => {
    const view = createShrinkPlanViewModel("sanitized");
    expect(view.input.promptPreview).toContain("MVP069 keep_now");
    expect(view.input.promptPreview).not.toContain("defer_next_increment");
    expect(view.input.sanitizationScan).toContain("local path / private host / private network URLなし");
    expect(view.promptLeakage).toBe(false);
  });

  it("defer_next_incrementやlocal pathがpromptに混ざると検出する", () => {
    expect(hasPromptLeakage("defer_next_incrementもまとめて実行する")).toBe(true);
    const localPath = "/" + "Users" + "/example/project を直す";
    expect(hasPromptLeakage(localPath)).toBe(true);
  });
});
