import { describe, expect, it } from "vitest";
import { createHandoffDecisionInput, reviewHandoffDecision, sanitizeForPublic } from "../src/lib/handoff-decision-ledger";

describe("MVP055 Handoff Decision Ledger", () => {
  it("emptyではDecision Ledgerを生成しない", () => {
    const review = reviewHandoffDecision(createHandoffDecisionInput("empty"));

    expect(review.decision).toBe("empty");
    expect(review.ledger).toBeNull();
    expect(review.held).toBeNull();
    expect(review.publishBlocks).toHaveLength(0);
  });

  it("approvedでは必須項目を持つHandoff Decision Ledgerを生成する", () => {
    const review = reviewHandoffDecision(createHandoffDecisionInput("approved"));

    expect(review.decision).toBe("approved");
    expect(review.publishBlocks).toHaveLength(0);
    expect(review.ledger).toMatchObject({
      source_handoff_receipt_id: "MVP054-HANDOFF-RECEIPT-READY-2026-07-07",
      decision: "approved",
      decision_owner: "AIDD Control Plane Reviewer",
      required_evidence: [
        "assets/aidd-control-plane-mvp055-empty.png",
        "assets/aidd-control-plane-mvp055-approved.png",
        "assets/aidd-control-plane-mvp055-held.png",
        "assets/aidd-control-plane-mvp055-blocked.png",
        "assets/aidd-control-plane-mvp055-terminal-evidence.png"
      ]
    });
    expect(review.ledger?.decision_reason).toContain("AIDD-Spec接続");
    expect(review.ledger?.approved_execute_now).toContain("Handoff Decision Ledgerを生成する");
    expect(review.ledger?.codex_command_draft).toContain("pnpm run doctor:aidd");
    expect(review.ledger?.verification_commands).toContain("pnpm run test:coverage");
    expect(review.ledger?.rollback_condition).toContain("approvedを取り消す");
    expect(review.ledger?.aidd_spec_connections.map((item) => item.id)).toEqual(["mvp054", "mvp055", "spec-gate"]);
  });

  it("heldでは保留理由、追加証跡、次回レビュー条件、learning log返却を生成する", () => {
    const review = reviewHandoffDecision(createHandoffDecisionInput("held"));

    expect(review.decision).toBe("held");
    expect(review.ledger).toBeNull();
    expect(review.publishBlocks).toHaveLength(0);
    expect(review.held).toMatchObject({
      hold_reason: "WebKit証跡とterminal-evidence画像が未到着のため、承認判断を保留する。",
      additional_evidence_needed: ["WebKitのE2E成功ログ", "assets/aidd-control-plane-mvp055-terminal-evidence.png"],
      next_review_condition: "WebKitログとterminal-evidenceが追加され、local path検出が0件になったら再レビューする。",
      learning_log_return: "不足証跡をlearning logへ戻し、次回は証跡名を先に固定してからcaptureを実行する。"
    });
  });

  it("blockedでは公開前ブロック6種類と修正指示を返す", () => {
    const review = reviewHandoffDecision(createHandoffDecisionInput("blocked"));
    const titles = review.publishBlocks.map((block) => block.title);

    expect(review.decision).toBe("blocked");
    expect(review.ledger).toBeNull();
    expect(titles).toEqual([
      "未承認",
      "理由不足",
      "rollback不足",
      "Chromium/Firefox/WebKit不足",
      "evidence不足",
      "未サニタイズのlocal path/private host/private network URL"
    ]);
    expect(review.publishBlocks.every((block) => block.fixInstruction.length > 0)).toBe(true);
    expect(review.unsafeTokens).toContain("/Users/example/workspace/private/mvp055.log");
    expect(review.unsafeTokens).toContain("http://127.0.0.1:3028/internal");
    expect(review.unsafeTokens).toContain("example-mac.local");
    expect(review.sanitizedPreview).toContain("HOME/workspace");
    expect(review.sanitizedPreview).toContain("WORKSPACE/private-url");
    expect(review.sanitizedPreview).not.toContain("/Users/");
    expect(review.sanitizedPreview).not.toContain("127.0.0.1");
  });

  it("sanitizeForPublicはlocal path/private host/private network URLを公開用表記へ変換する", () => {
    const input = "/Users/example/workspace/raw.log /home/runner/work/raw.log http://10.0.0.4:3028/debug example-mac.local";

    expect(sanitizeForPublic(input)).toBe("HOME/workspace/raw.log HOME/work/raw.log WORKSPACE/private-url WORKSPACE.local");
  });
});
