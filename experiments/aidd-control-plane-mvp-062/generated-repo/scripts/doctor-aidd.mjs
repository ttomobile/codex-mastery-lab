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
  "scripts/capture-mvp062.mjs",
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
  "AIDD Control Plane MVP062",
  "Repair Delta Priority Decision Workspace",
  "Evidence Repair Delta",
  "AIDD-Spec v0.1",
  "AIDD Control Plane MVP v0.1",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "AI Task Packet",
  "empty",
  "valid",
  "failure",
  "decision_needed",
  "adopt",
  "hold",
  "reject",
  "adopt_now",
  "hold_next_increment",
  "reject_to_learning_log",
  "source_repair_delta_id",
  "priority_reason",
  "decision_owner",
  "review_evidence",
  "rollback_condition",
  "next_packet_section",
  "Codex prompt preview",
  "未判断",
  "理由不足",
  "証跡不足",
  "rollback不足",
  "Firefox除外",
  "未採用delta混入",
  "local path / host / private network URL混入",
  "Chromium",
  "Firefox",
  "WebKit",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1",
  "detectUnsafePublicTokens",
  "sanitizeForPublic",
  "aidd-control-plane-mvp062-empty.png",
  "aidd-control-plane-mvp062-valid.png",
  "aidd-control-plane-mvp062-failure.png",
  "aidd-control-plane-mvp062-decision-needed.png",
  "aidd-control-plane-mvp062-terminal-evidence.png",
  "capture:mvp062"
];
const missingText = requiredText.filter((text) => !allText.includes(text));
const detectorPresent = allText.includes("/Users/") && allText.includes("10.0.0.62") && allText.includes("mvp062-workstation.local") && allText.includes("detectUnsafePublicTokens");
if (missing.length > 0 || missingText.length > 0 || !detectorPresent) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  if (!detectorPresent) console.error("missing local path / host / private network URL detection fixture");
  process.exit(1);
}
console.log("doctor:aidd passed");
console.log("MVP062、Repair Delta Priority Decision Workspace、採用/保留/却下、AIDD-Spec接続、3ブラウザ、Review Finding、証跡名、local path / host / private network URL検出を確認しました。");
