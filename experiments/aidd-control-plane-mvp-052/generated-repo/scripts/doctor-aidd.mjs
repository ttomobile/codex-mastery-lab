import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "app/page.tsx",
  "src/lib/verification-run.ts",
  "tests/verification-run.test.ts",
  "e2e/verification-run-detail.spec.ts",
  "scripts/capture-mvp052.mjs",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];

const missing = checks.filter((file) => !existsSync(path.join(root, file)));
const contents = await Promise.all(checks.filter((file) => existsSync(path.join(root, file))).map((file) => readFile(path.join(root, file), "utf8")));
const allText = contents.join("\n");

const requiredText = [
  "AIDD Control Plane MVP052",
  "Codex Run Budget Gate",
  "go / brake / stop",
  "実行候補packet未選択",
  "primary usage過多",
  "secondary usage過多",
  "max runtime不足",
  "停止条件不足",
  "fallback action不足",
  "Firefox除外",
  "Verification Evidence接続不足",
  "Review Record接続不足",
  "Learning Log接続不足",
  "Maintenance Runbook接続不足",
  "AIDD-Spec接続不足",
  "local path / host / private network URL混入",
  "公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています",
  "aidd-control-plane-mvp052-empty.png",
  "aidd-control-plane-mvp052-ready.png",
  "aidd-control-plane-mvp052-failure.png",
  "aidd-control-plane-mvp052-terminal-evidence.png",
  "chromium",
  "firefox",
  "webkit",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1"
];

const missingText = requiredText.filter((text) => !allText.includes(text));

if (missing.length > 0 || missingText.length > 0) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP052 Codex Run Budget Gate、AIDD-Spec接続、3ブラウザE2E設定、停止条件、fallback action、local pathブロックを確認しました。");
