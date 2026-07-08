import { describe, expect, test } from "vitest";
import {
  approvedReceipt,
  blockedReceipt,
  buildCodexCommandDraft,
  detectBlockedFindings,
  getLedgerViewModel,
  heldReceipt
} from "../src/ledger";

describe("Handoff Decision Ledgerの判定", () => {
  test("approvedではexecute_nowだけがCodex command draftへ入る", () => {
    const draft = buildCodexCommandDraft(approvedReceipt);

    expect(draft).toContain("generated-repo の Handoff Decision Ledger UI を確認する");
    expect(draft).toContain("pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd");
    expect(draft).not.toContain("外部GitHub API連携");
    expect(draft).not.toContain("保留");
    expect(draft).not.toContain("hold reason");
  });

  test("heldではCodex command draftを空にしてLearning Log返却を保持する", () => {
    const viewModel = getLedgerViewModel("held");

    expect(viewModel.codexCommandDraft).toBe("");
    expect(viewModel.receipt?.holdReason).toContain("Learning Log");
    expect(buildCodexCommandDraft(heldReceipt)).toBe("");
  });

  test("blockedでは未承認、理由不足、3ブラウザ不足、evidence不足、公開前漏えいを検出する", () => {
    const findings = detectBlockedFindings(blockedReceipt);
    const labels = findings.map((finding) => finding.label);

    expect(labels).toEqual(
      expect.arrayContaining([
        "未承認",
        "理由不足",
        "3ブラウザ不足",
        "evidence不足",
        "local path混入",
        "private host混入",
        "private network URL混入"
      ])
    );
  });

  test("emptyではreceiptを持たない", () => {
    const viewModel = getLedgerViewModel("empty");

    expect(viewModel.receipt).toBeNull();
    expect(viewModel.mode).toBe("empty");
  });
});
