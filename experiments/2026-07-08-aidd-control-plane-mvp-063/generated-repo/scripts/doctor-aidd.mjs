import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "README.md",
  "app/page.tsx",
  "app/layout.tsx",
  "src/domain/run-queue-status.ts",
  "tests/run-queue-status.test.ts",
  "e2e/run-queue-status.spec.ts",
  "scripts/capture-mvp063.mjs",
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
  "AIDD Control Plane MVP063",
  "Codex Run Queue Status Tracker",
  "Run Queue",
  "waiting",
  "running",
  "succeeded",
  "failed",
  "evidence_missing",
  "empty",
  "実行コマンド",
  "検証コマンド",
  "ブラウザ範囲",
  "terminal evidence",
  "screenshot evidence",
  "rollback plan",
  "Review Record出力",
  "Learning Log出力",
  "Review Finding",
  "実行失敗",
  "証跡不足",
  "足りないもの",
  "Chromium",
  "Firefox",
  "WebKit",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1",
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd",
  "pnpm run capture:mvp063",
  "aidd-control-plane-mvp063-empty.png",
  "aidd-control-plane-mvp063-waiting.png",
  "aidd-control-plane-mvp063-running.png",
  "aidd-control-plane-mvp063-succeeded.png",
  "aidd-control-plane-mvp063-failed.png",
  "aidd-control-plane-mvp063-evidence-missing.png"
];

const missingText = requiredText.filter((text) => !allText.includes(text));

if (missing.length > 0 || missingText.length > 0) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP063、Codex Run Queue Status Tracker、6状態、3ブラウザ、証跡、rollback、Review Record、Learning Log、Review Finding、必要コマンドを確認しました。");
