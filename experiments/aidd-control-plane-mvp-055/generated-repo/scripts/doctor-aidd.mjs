import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "README.md",
  "app/page.tsx",
  "src/lib/handoff-decision-ledger.ts",
  "tests/handoff-decision-ledger.test.ts",
  "e2e/handoff-decision-ledger.spec.ts",
  "scripts/capture-mvp055.mjs",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md"
];

const missing = checks.filter((file) => !existsSync(path.join(root, file)));
const contents = await Promise.all(checks.filter((file) => existsSync(path.join(root, file))).map((file) => readFile(path.join(root, file), "utf8")));
const allText = contents.join("\n");

const requiredText = [
  "AIDD Control Plane MVP055",
  "MVP055",
  "MVP054",
  "Handoff Decision Ledger",
  "empty",
  "approved",
  "held",
  "blocked",
  "source_handoff_receipt_id",
  "decision",
  "decision_owner",
  "decision_reason",
  "approved_execute_now",
  "codex_command_draft",
  "verification_commands",
  "required_evidence",
  "rollback_condition",
  "aidd_spec_connections",
  "hold_reason",
  "additional_evidence_needed",
  "next_review_condition",
  "learning_log_return",
  "AIDD-Spec接続",
  "未承認",
  "理由不足",
  "rollback不足",
  "Chromium/Firefox/WebKit不足",
  "evidence不足",
  "未サニタイズのlocal path/private host/private network URL",
  "sanitizeForPublic",
  "detectUnsafePublicTokens",
  "chromium",
  "firefox",
  "webkit",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1",
  "aidd-control-plane-mvp055-empty.png",
  "aidd-control-plane-mvp055-approved.png",
  "aidd-control-plane-mvp055-held.png",
  "aidd-control-plane-mvp055-blocked.png",
  "aidd-control-plane-mvp055-terminal-evidence.png"
];

const missingText = requiredText.filter((text) => !allText.includes(text));

if (missing.length > 0 || missingText.length > 0) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP055固有token、Handoff Decision Ledger、AIDD-Spec接続、3ブラウザ設定、画像名、local path検出を確認しました。");
