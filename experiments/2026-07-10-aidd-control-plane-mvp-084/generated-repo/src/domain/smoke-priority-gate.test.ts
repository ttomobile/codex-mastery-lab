import { describe, expect, it } from "vitest";
import { getReceiptView } from "./public-preview-smoke-final-receipt";

describe("MVP084 旧テスト置き換え", () => {
  it("Public Preview Smoke Final Receiptへ置き換わっている", () => {
    expect(getReceiptView("verified").title).toBe("Public Preview Smoke Final Receipt");
  });
});
