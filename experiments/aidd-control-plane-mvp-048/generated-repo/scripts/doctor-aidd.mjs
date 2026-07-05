import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "app/page.tsx",
  "src/lib/readiness.ts",
  "tests/readiness.test.ts",
  "e2e/readiness-gate.spec.ts",
  "scripts/capture-mvp048.mjs",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];

const missing = checks.filter((file) => !existsSync(path.join(root, file)));
const page = await readFile(path.join(root, "app/page.tsx"), "utf8");
const logic = await readFile(path.join(root, "src/lib/readiness.ts"), "utf8");

const requiredText = [
  "One-Run Execution Readiness Gate",
  "AIDD-Spec v0.1",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "execute_now以外のaction混入",
  "local path / host / private network URL混入"
];

const missingText = requiredText.filter((text) => !page.includes(text) && !logic.includes(text));

if (missing.length > 0 || missingText.length > 0) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP048 readiness gate, AIDD-Spec connections, tests, and capture script are present.");
