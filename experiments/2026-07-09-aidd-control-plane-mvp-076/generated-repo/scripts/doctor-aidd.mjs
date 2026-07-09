import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "app/page.tsx",
  "src/domain/publication-evidence-qa.ts",
  "tests/e2e/publication-evidence-qa.spec.ts",
  "README.md",
  "playwright.config.ts"
];

const text = files.map((file) => readFileSync(join(root, file), "utf8")).join("\n");

const requiredChecks = [
  ["必須表示: article path", /article path/],
  ["必須表示: preview path", /preview path/],
  ["必須表示: asset copy", /asset copy/],
  ["必須表示: terminal evidence", /terminal evidence/],
  ["必須表示: initial screenshot", /initial evidence PNG|initial screenshot/],
  ["必須表示: filled screenshot", /filled evidence PNG|filled screenshot/],
  ["必須表示: failure screenshot", /failure evidence PNG|failure screenshot/],
  ["必須表示: terminal screenshot", /terminal evidence PNG/],
  ["3ブラウザ文言: Chromium", /Chromium/],
  ["3ブラウザ文言: Firefox", /Firefox/],
  ["3ブラウザ文言: WebKit", /WebKit/],
  ["サニタイズブロック文言: local path", /local path/],
  ["サニタイズブロック文言: private host", /private host/],
  ["サニタイズブロック文言: private network URL", /private network URL/],
  ["AIDD-Spec接続", /AIDD-Spec v0\.1/],
  ["標準文書接続", /standards\/aidd-control-plane-mvp-v0\.1\.md/],
  ["対象機能接続", /Publication Evidence QA Gate/],
  ["公開可能判定", /公開可能/],
  ["公開QA不足判定", /公開QA不足/],
  ["公開前停止判定", /公開前停止/],
  ["Review Finding category", /category/],
  ["Review Finding severity", /severity/],
  ["Review Finding ideal_state", /ideal_state/],
  ["Review Finding fix_instruction", /fix_instruction/],
  ["Review Finding verification command", /verification_command|verification command/],
  ["Review Finding needed_upstream_info", /needed_upstream_info/]
];

const failures = requiredChecks.filter(([, pattern]) => !pattern.test(text));

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const [label] of failures) {
    console.error(`- ${label}`);
  }
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("- 4状態: empty / valid / failure / blocked");
console.log("- 3ブラウザ: Chromium / Firefox / WebKit");
console.log("- blocked: local path / private host / private network URL");
console.log("- AIDD-Spec v0.1: standards/aidd-control-plane-mvp-v0.1.md");
