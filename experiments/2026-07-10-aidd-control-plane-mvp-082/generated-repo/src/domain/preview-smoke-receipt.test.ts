import { describe, expect, it } from "vitest";
import { getSmokeRepairView } from "./smoke-repair-planner";

describe("旧テスト名の互換入口", () => {
  it("MVP082ではSmoke Receipt Repair Action Plannerを確認する", () => {
    expect(getSmokeRepairView("planned").title).toContain("壊れたterminal evidence");
  });
});
