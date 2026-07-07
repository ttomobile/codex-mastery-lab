import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "README.md",
  "app/page.tsx",
  "app/layout.tsx",
  "src/domain/verification-run-detail.ts",
  "tests/verification-run-detail.test.ts",
  "e2e/verification-run-detail.spec.ts",
  "scripts/capture-mvp061.mjs",
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
  "AIDD Control Plane MVP061",
  "MVP061",
  "Evidence Repair Delta Generator",
  "Verification Run Detail",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "AI Task Packet",
  "AIDD-Spec v0.1",
  "AIDD Control Plane MVP v0.1",
  "empty",
  "valid",
  "failure",
  "repair_needed",
  "delta_ready",
  "blocked",
  "source_queue_item_id",
  "source_run_status",
  "commit_sha",
  "command_details",
  "command",
  "exit_code",
  "duration",
  "status",
  "artifact_path",
  "failure_category",
  "repair_instruction",
  "browser_coverage",
  "terminal_evidence",
  "screenshot_evidence",
  "playwright_report",
  "review_finding_draft",
  "aidd_spec_connections",
  "Review Finding",
  "category",
  "finding",
  "severity",
  "observed_by",
  "ideal_state",
  "fix_instruction",
  "ai_task_packet_delta",
  "codex_prompt_delta",
  "verification_command",
  "rollback_condition",
  "learning_log",
  "execute_now",
  "next_increment",
  "source detail不足",
  "失敗分類不足",
  "修正指示不足",
  "Firefox除外",
  "terminal/failure screenshot不足",
  "local path / host / private network URL混入",
  "Chromium",
  "Firefox",
  "WebKit",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1",
  "detectUnsafePublicTokens",
  "unsafeLocationPatterns",
  "sanitizeForPublic",
  "aidd-control-plane-mvp061-empty.png",
  "aidd-control-plane-mvp061-valid.png",
  "aidd-control-plane-mvp061-failure.png",
  "aidd-control-plane-mvp061-repair-needed.png",
  "aidd-control-plane-mvp061-terminal-evidence.png",
  "capture:mvp061"
];

const missingText = requiredText.filter((text) => !allText.includes(text));
const localPathPattern = /\/Users\/|\/home\/|localhost|127\.0\.0\.1|10\.0\.0\.61|mvp061-workstation\.local/;
const localPathDetectorPresent = allText.includes("detectUnsafePublicTokens") && allText.includes("unsafeLocationPatterns");
const localPathDetectionFailed = !localPathDetectorPresent || !localPathPattern.test(allText);

if (missing.length > 0 || missingText.length > 0 || localPathDetectionFailed) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  if (localPathDetectionFailed) console.error("missing local path / host / private network URL detection fixture");
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP061、Evidence Repair Delta Generator、AIDD-Spec接続、3ブラウザ、Review Finding、修理delta、絞り込み、証跡名、local path / host / private network URL検出を確認しました。");
