import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "README.md",
  "app/page.tsx",
  "app/layout.tsx",
  "src/domain/next-increment-planner.ts",
  "tests/next-increment-planner.test.ts",
  "e2e/next-increment-planner.spec.ts",
  "scripts/capture-mvp059.mjs",
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
  "AIDD Control Plane MVP059",
  "MVP059",
  "MVP058",
  "Next Increment Planner",
  "次インクリメントプランナー",
  "AIDD-Spec v0.1",
  "empty",
  "valid",
  "failure",
  "evidence_missing",
  "ready",
  "blocked",
  "source_review_id",
  "source_run_id",
  "recommended_increment",
  "priority_reason",
  "target_artifacts",
  "acceptance_criteria",
  "verification_commands",
  "required_evidence",
  "codex_prompt_draft",
  "execute_now",
  "rollback_condition",
  "note_article_angle",
  "learning_log_connection",
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
  "source review不足",
  "priority不足",
  "3ブラウザE2E不足",
  "terminal/failure screenshot不足",
  "rollback不足",
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
  "rollback",
  "detectUnsafePublicTokens",
  "unsafeLocationPatterns",
  "sanitizeForPublic",
  "aidd-control-plane-mvp059-empty.png",
  "aidd-control-plane-mvp059-valid.png",
  "aidd-control-plane-mvp059-failure.png",
  "aidd-control-plane-mvp059-evidence-missing.png",
  "aidd-control-plane-mvp059-terminal-evidence.png",
  "capture:mvp059"
];

const missingText = requiredText.filter((text) => !allText.includes(text));
const localPathPattern = /\/Users\/|\/home\/|localhost|127\.0\.0\.1|10\.0\.0\.59|mvp059-workstation\.local/;
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
console.log("MVP059固有語、Next Increment Planner、3ブラウザ、terminal evidence、screenshot evidence、rollback、AIDD-Spec接続、local path/private host/private network URL検出を確認しました。");
