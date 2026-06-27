import { describe, expect, it } from "vitest";
import { formatDuration, formatViews } from "./format";

describe("日本語フォーマット", () => {
  it("動画時間を m:ss 形式に整形する", () => {
    expect(formatDuration(65)).toBe("1:05");
  });

  it("再生回数を日本語ラベル付きで整形する", () => {
    expect(formatViews(123456)).toBe("123,456 回視聴");
  });
});
