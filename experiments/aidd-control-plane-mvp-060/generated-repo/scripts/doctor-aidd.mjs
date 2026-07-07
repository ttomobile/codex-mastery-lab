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
  "scripts/capture-mvp060.mjs",
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
  "AIDD Control Plane MVP060",
  "MVP060",
  "Verification Run Detail",
  "検証実行詳細",
  "empty",
  "valid",
  "failure",
  "repair_needed",
  "ready",
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
  "commit SHA不足",
  "command別detail不足",
  "artifact path不足",
  "失敗分類不足",
  "修正指示不足",
  "Firefox除外",
  "証跡不足",
  "local path/private host/private network URL混入",
  "AI Task Packet delta",
  "Codex prompt delta",
  "Chromium",
  "Firefox",
  "WebKit",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1",
  "terminal evidence",
  "screenshot evidence",
  "AIDD-Spec",
  "detectUnsafePublicTokens",
  "unsafeLocationPatterns",
  "sanitizeForPublic",
  "aidd-control-plane-mvp060-empty.png",
  "aidd-control-plane-mvp060-valid.png",
  "aidd-control-plane-mvp060-failure.png",
  "aidd-control-plane-mvp060-repair-needed.png",
  "aidd-control-plane-mvp060-terminal-evidence.png",
  "capture:mvp060"
];

const missingText = requiredText.filter((text) => !allText.includes(text));
const localPathPattern = /\/Users\/|\/home\/|localhost|127\.0\.0\.1|10\.0\.0\.60|mvp060-workstation\.local/;
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
console.log("MVP060固有語、3ブラウザ、command別detail、artifact path、failure category、repair instruction、terminal evidence、screenshot evidence、AIDD-Spec接続、local path/private host/private network URL検出を確認しました。");
