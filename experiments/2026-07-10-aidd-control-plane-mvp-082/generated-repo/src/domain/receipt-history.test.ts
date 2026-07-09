import { describe, expect, it } from "vitest";
import { getSmokeRepairView } from "./smoke-repair-planner";

describe("旧Receipt履歴比較テスト名の互換入口", () => {
  it("MVP082のRepair Action Plannerへ置き換わっている", () => {
    expect(getSmokeRepairView("blocked").decision).toBe("blocked");
  });
});
