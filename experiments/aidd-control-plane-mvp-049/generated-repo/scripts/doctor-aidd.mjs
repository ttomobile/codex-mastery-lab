import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "app/page.tsx",
  "src/lib/verification-run.ts",
  "tests/verification-run.test.ts",
  "e2e/verification-run-detail.spec.ts",
  "scripts/capture-mvp049.mjs",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];

const missing = checks.filter((file) => !existsSync(path.join(root, file)));
const page = await readFile(path.join(root, "app/page.tsx"), "utf8");
const logic = await readFile(path.join(root, "src/lib/verification-run.ts"), "utf8");

const requiredText = [
  "Verification Run Detail Drilldown",
  "command別detail不足",
  "commit SHA不足",
  "exit code不足",
  "artifact path不足",
  "失敗分類不足",
  "修正指示不足",
  "Firefox除外",
  "terminal evidence不足",
  "failure screenshot不足",
  "local path / host / private network URL混入",
  "AIDD-Spec connection不足",
  "Review Finding Draft",
  "AIDD-Spec v0.1",
  "Verification Evidence",
  "Review Record",
  "Learning Log"
];

const missingText = requiredText.filter((text) => !page.includes(text) && !logic.includes(text));

if (missing.length > 0 || missingText.length > 0) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP049 verification run detail, AIDD-Spec connections, tests, and capture script are present.");
