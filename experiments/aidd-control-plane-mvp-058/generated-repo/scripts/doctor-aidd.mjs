import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "README.md",
  "app/page.tsx",
  "app/layout.tsx",
  "src/lib/run-result-review-synthesizer.ts",
  "tests/run-result-review-synthesizer.test.ts",
  "e2e/run-result-review-synthesizer.spec.ts",
  "scripts/capture-mvp058.mjs",
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
  "AIDD Control Plane MVP058",
  "MVP058",
  "MVP057",
  "Run Result Review Synthesizer",
  "AIDD-Spec v0.1",
  "standards/aidd-control-plane-mvp-v0.1.md",
  "empty",
  "valid",
  "failure",
  "evidence_missing",
  "source_run_id",
  "outcome",
  "score",
  "score_reason",
  "terminal_evidence",
  "screenshot_evidence",
  "browser_coverage",
  "doctor_aidd",
  "rollback",
  "privacy_scan",
  "review_findings",
  "needed_upstream_info",
  "standard_update",
  "ai_task_packet_delta",
  "codex_prompt_delta",
  "verification_command",
  "learning_log",
  "aidd_spec_connections",
  "Review Finding",
  "category",
  "finding",
  "severity",
  "observed_by",
  "ideal_state",
  "fix_instruction",
  "verification",
  "command失敗",
  "Firefox未実行",
  "doctor:aidd失敗",
  "危険command",
  "rm -rf",
  "curl | sh",
  "no-sandbox",
  "rollback不足",
  "local path/private host/private network URL混入",
  "Evidence Repair Delta",
  "terminal evidence",
  "empty-valid-failure screenshot",
  "Playwright report",
  "Review Record出力",
  "sanitizeForPublic",
  "detectUnsafePublicTokens",
  "Chromium",
  "Firefox",
  "WebKit",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1",
  "aidd-control-plane-mvp058-empty.png",
  "aidd-control-plane-mvp058-valid.png",
  "aidd-control-plane-mvp058-failure.png",
  "aidd-control-plane-mvp058-evidence-missing.png",
  "aidd-control-plane-mvp058-terminal-evidence.png",
  "capture:mvp058"
];

const missingText = requiredText.filter((text) => !allText.includes(text));
const localPathPattern = /\/Users\/|\/home\/|localhost|127\.0\.0\.1|10\.0\.0\.58|example-mac\.local/;
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
console.log("MVP058固有token、Run Result Review Synthesizer、Review Finding、Evidence Repair Delta、Learning Log、AIDD-Spec接続、3ブラウザ設定、画像名、local path検出を確認しました。");
