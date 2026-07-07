import { describe, expect, it } from "vitest";
import { createDecisionInput, evaluateDecisionWorkspace, sanitizeForPublic } from "../src/domain/verification-run-detail";

describe("Repair Delta Priority Decision Workspace", () => {
  it("未選択ケースでは修理deltaを次へ進めない", () => {
    const result = evaluateDecisionWorkspace(createDecisionInput("empty"));
    expect(result.decision).toBe("empty");
    expect(result.codexPromptPreview).toBe("");
  });

  it("採用判断済みケースでは採用済みdeltaだけをpromptへ入れる", () => {
    const result = evaluateDecisionWorkspace(createDecisionInput("valid"));
    expect(result.decision).toBe("ready");
    expect(result.codexPromptPreview).toContain("Firefoxを除外せず");
    expect(result.codexPromptPreview).not.toContain("capture scriptでMVP062");
    expect(result.learningLogReturn.join("\n")).toContain("MVP062-REPAIR-DELTA-002");
  });

  it("差し戻しケースでは未判断・証跡不足・Firefox除外・未採用delta混入を検出する", () => {
    const result = evaluateDecisionWorkspace(createDecisionInput("failure"));
    expect(result.decision).toBe("blocked");
    const categories = result.findings.map((finding) => finding.category);
    expect(categories).toContain("未判断");
    expect(categories).toContain("理由不足");
    expect(categories).toContain("証跡不足");
    expect(categories).toContain("rollback不足");
    expect(categories).toContain("Firefox除外");
    expect(categories).toContain("未採用delta混入");
    expect(categories).toContain("local path / host / private network URL混入");
    expect(result.sanitizedPreview).toContain("WORKSPACE/private-url");
    expect(result.sanitizedPreview).not.toContain("/Users/");
  });

  it("判断待ちケースではadopt_nowだけを次の1回に入れる", () => {
    const result = evaluateDecisionWorkspace(createDecisionInput("decision_needed"));
    expect(result.decision).toBe("decision_needed");
    expect(result.adoptedPacketPatch).toContain("MVP062");
    expect(result.codexPromptPreview).toContain("pnpm run test:e2e");
    expect(result.codexPromptPreview).not.toContain("capture scriptでMVP062");
  });

  it("公開前sanitizeでlocal pathとprivate network URLを隠す", () => {
    const sanitized = sanitizeForPublic("/Users/example/a.txt http://10.0.0.62:3062 x.local");
    expect(sanitized).toBe("WORKSPACE/private-url WORKSPACE/private-url WORKSPACE/private-url");
  });
});
