import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "README.md",
  "app/page.tsx",
  "src/lib/run-queue-intake.ts",
  "tests/run-queue-intake.test.ts",
  "e2e/run-queue-intake.spec.ts",
  "scripts/capture-mvp056.mjs",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md"
];

const missing = checks.filter((file) => !existsSync(path.join(root, file)));
const contents = await Promise.all(checks.filter((file) => existsSync(path.join(root, file))).map((file) => readFile(path.join(root, file), "utf8")));
const allText = contents.join("\n");

const requiredText = [
  "AIDD Control Plane MVP056",
  "MVP056",
  "MVP055",
  "Run Queue Intake",
  "Codex Run Queue",
  "empty",
  "queued",
  "rejected",
  "evidence_missing",
  "source_decision_id",
  "queue_item_id",
  "run_status",
  "codex_command",
  "sandbox_mode",
  "required_verification_commands",
  "browser_projects",
  "required_evidence",
  "rollback_plan",
  "aidd_spec_connections",
  "AIDD-Spec接続",
  "held / blocked / unapproved decision",
  "危険なcommand",
  "rm -rf",
  "curl | sh",
  "--yolo",
  "sandbox不足",
  "Firefox除外",
  "浅い検証",
  "rollback不足",
  "未サニタイズのlocal path/private host/private network URL",
  "terminal evidence",
  "Playwright report",
  "Review Record",
  "Learning Log",
  "sanitizeForPublic",
  "detectUnsafePublicTokens",
  "chromium",
  "firefox",
  "webkit",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1",
  "aidd-control-plane-mvp056-empty.png",
  "aidd-control-plane-mvp056-queued.png",
  "aidd-control-plane-mvp056-rejected.png",
  "aidd-control-plane-mvp056-evidence-missing.png",
  "aidd-control-plane-mvp056-terminal-evidence.png"
];

const missingText = requiredText.filter((text) => !allText.includes(text));

if (missing.length > 0 || missingText.length > 0) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP056固有token、Run Queue Intake、Codex Run Queue、AIDD-Spec接続、3ブラウザ設定、画像名、local path検出を確認しました。");
