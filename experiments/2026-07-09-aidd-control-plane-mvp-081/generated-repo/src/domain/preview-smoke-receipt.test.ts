import { describe, expect, it } from "vitest";
import { getHistoryView } from "./receipt-history";

describe("旧テスト名の互換入口", () => {
  it("MVP081ではReceipt履歴比較に置き換わっている", () => {
    expect(getHistoryView("valid").title).toContain("履歴");
  });
});
