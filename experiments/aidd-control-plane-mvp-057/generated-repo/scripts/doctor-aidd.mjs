import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "README.md",
  "app/page.tsx",
  "app/layout.tsx",
  "src/lib/run-queue-status-tracker.ts",
  "tests/run-queue-status-tracker.test.ts",
  "e2e/run-queue-status-tracker.spec.ts",
  "scripts/capture-mvp057.mjs",
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
  "AIDD Control Plane MVP057",
  "MVP057",
  "MVP056",
  "Codex Run Queue Status Tracker",
  "Codex Run Queue",
  "empty",
  "waiting",
  "running",
  "succeeded",
  "failed",
  "evidence_missing",
  "source_intake_id",
  "queue_item_id",
  "run_status",
  "actual_results",
  "verification_summary",
  "browser_projects",
  "terminal_evidence",
  "screenshot_evidence",
  "playwright_report",
  "rollback_plan",
  "review_record_output",
  "learning_log_output",
  "aidd_spec_connections",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "AIDD-Spec接続",
  "command失敗",
  "Firefox未実行",
  "doctor:aidd失敗",
  "危険なcommand",
  "再帰的削除",
  "pipe経由のshell実行",
  "no-sandbox相当",
  "rollback不足",
  "未サニタイズのlocal path/private host/private network URL",
  "Evidence Repair Delta",
  "terminal evidence",
  "Playwright report",
  "Review Record出力不足",
  "sanitizeForPublic",
  "detectUnsafePublicTokens",
  "chromium",
  "firefox",
  "webkit",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1",
  "aidd-control-plane-mvp057-empty.png",
  "aidd-control-plane-mvp057-succeeded.png",
  "aidd-control-plane-mvp057-failed.png",
  "aidd-control-plane-mvp057-evidence-missing.png",
  "aidd-control-plane-mvp057-terminal-evidence.png"
];

const missingText = requiredText.filter((text) => !allText.includes(text));
const localPathPattern = /\/Users\/|\/home\/|localhost|127\.0\.0\.1|10\.0\.0\.8|example-mac\.local/;
const localPathDetectorPresent = allText.includes("detectUnsafePublicTokens") && allText.includes("unsafeLocationPatterns");
const localPathDetectionFailed = !localPathDetectorPresent || !localPathPattern.test(allText);

if (missing.length > 0 || missingText.length > 0 || localPathDetectionFailed) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  if (localPathDetectionFailed) console.error("missing local path/private host/private network URL detection fixture");
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP057固有token、Codex Run Queue Status Tracker、Verification Evidence、Review Record、Learning Log、AIDD-Spec接続、3ブラウザ設定、画像名、local path検出を確認しました。");
