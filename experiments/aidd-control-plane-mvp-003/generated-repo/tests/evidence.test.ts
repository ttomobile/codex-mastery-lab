import { describe, expect, it } from "vitest";
import {
  createMissingLogsEvidenceForm,
  createMissingScreenshotsEvidenceForm,
  emptyEvidenceForm,
  evaluateEvidence,
  sampleEvidenceForm
} from "../src/lib/evidence";

describe("Verification Evidence準備度判定", () => {
  it("サンプル証跡はreadiness score 100でreadyになる", () => {
    const result = evaluateEvidence(sampleEvidenceForm);

    expect(result.overall_status).toBe("ready");
    expect(result.readiness_score).toBe(100);
    expect(result.missing_evidence).toEqual([]);
    expect(result.command_logs).toHaveLength(6);
  });

  it("必須ログが欠けるとmissing_logsになる", () => {
    const result = evaluateEvidence(createMissingLogsEvidenceForm());

    expect(result.overall_status).toBe("missing_logs");
    expect(result.readiness_score).toBeLessThan(100);
    expect(result.missing_evidence).toContain("pnpm run lint のCommand Log Collector入力");
  });

  it("スクリーンショットが欠けるとmissing_screenshotsになる", () => {
    const result = evaluateEvidence(createMissingScreenshotsEvidenceForm());

    expect(result.overall_status).toBe("missing_screenshots");
    expect(result.missing_evidence[0]).toContain("Screenshot Evidence Collector");
  });

  it("空の証跡はログ不足を優先して表示しCI URL未入力をwarningにする", () => {
    const result = evaluateEvidence(emptyEvidenceForm);

    expect(result.overall_status).toBe("missing_logs");
    expect(result.warnings).toContain("CI run URL はwarningです。CI and Report Linksに入力してください。");
  });
});
