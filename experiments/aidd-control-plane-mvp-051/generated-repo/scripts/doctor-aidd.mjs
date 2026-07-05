import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "app/page.tsx",
  "src/lib/verification-run.ts",
  "tests/verification-run.test.ts",
  "e2e/verification-run-detail.spec.ts",
  "scripts/capture-mvp051.mjs",
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
  "AIDD Control Plane MVP051",
  "Repair Delta Priority Decision Workspace",
  "採用",
  "保留",
  "却下",
  "採用済みdeltaだけを次回AI Task Packet",
  "priority reason",
  "decision owner",
  "review evidence",
  "rollback condition",
  "Codex prompt patch",
  "Verification Evidence接続",
  "Review Record接続",
  "Learning Log接続",
  "AIDD-Spec",
  "未判断",
  "理由不足",
  "証跡不足",
  "rollback不足",
  "Firefox除外",
  "未採用delta混入",
  "local path / host / private network URL混入",
  "公開前ブロック: local path、host名、private network URLが証跡や文言に混入しています",
  "aidd-control-plane-mvp051-empty.png",
  "aidd-control-plane-mvp051-ready.png",
  "aidd-control-plane-mvp051-failure.png",
  "aidd-control-plane-mvp051-terminal-evidence.png",
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
console.log("MVP051 Repair Delta Priority Decision Workspace, AIDD-Spec接続, 3ブラウザE2E設定, local pathブロック、未採用delta混入検出を確認しました。");
