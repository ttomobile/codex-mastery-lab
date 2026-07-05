import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "app/page.tsx",
  "src/lib/verification-run.ts",
  "tests/verification-run.test.ts",
  "e2e/verification-run-detail.spec.ts",
  "scripts/capture-mvp050.mjs",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];

const missing = checks.filter((file) => !existsSync(path.join(root, file)));
const contents = await Promise.all(
  checks.filter((file) => existsSync(path.join(root, file))).map((file) => readFile(path.join(root, file), "utf8"))
);
const allText = contents.join("\n");

const requiredText = [
  "AIDD Control Plane MVP050",
  "Evidence Repair Delta Generator",
  "failed",
  "evidence_missing",
  "timeout",
  "AI Task Packet delta",
  "Codex prompt delta",
  "verification command",
  "rollback condition",
  "Learning Log",
  "AIDD-Spec",
  "finding ID不足",
  "失敗分類不足",
  "優先度不足",
  "AI Task Packet delta不足",
  "Codex prompt delta不足",
  "検証command不足",
  "rollback条件不足",
  "Learning Log不足",
  "local path / host / private network URL混入",
  "公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています",
  "aidd-control-plane-mvp050-empty.png",
  "aidd-control-plane-mvp050-ready.png",
  "aidd-control-plane-mvp050-failure.png",
  "aidd-control-plane-mvp050-terminal-evidence.png",
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
console.log("MVP050 Evidence Repair Delta Generator, AIDD-Spec接続, capture script, 3ブラウザE2E設定, local pathブロック文言を確認しました。");
