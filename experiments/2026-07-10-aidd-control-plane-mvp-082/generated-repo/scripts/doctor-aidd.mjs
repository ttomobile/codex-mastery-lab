import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "app/page.tsx",
  "src/domain/smoke-repair-planner.ts",
  "src/domain/smoke-repair-planner.test.ts",
  "tests/e2e/smoke-repair-planner.spec.ts",
  "README.md",
  "playwright.config.ts",
  "package.json"
];
const text = files.map((file) => readFileSync(join(root, file), "utf8")).join("\n");

const requiredChecks = [
  ["MVP082", /MVP082/],
  ["機能名", /Smoke Receipt Repair Action Planner/],
  ["状態: empty", /empty/],
  ["状態: planned", /planned/],
  ["状態: failure", /failure/],
  ["状態: blocked", /blocked/],
  ["broken URL", /broken URL/],
  ["finding category", /category/],
  ["severity", /severity/],
  ["lane", /lane/],
  ["priority reason", /priority reason/],
  ["execute_now action", /execute_now action|executeNowAction/],
  ["next_increment分離", /next_increment/],
  ["learning_log分離", /learning_log/],
  ["AI Task Packet patch", /AI Task Packet patch|aiTaskPacketPatch/],
  ["Codex prompt patch", /Codex prompt patch|codexPromptPatch/],
  ["verification commands", /Verification commands|verificationCommands/],
  ["required evidence", /Required evidence|requiredEvidence/],
  ["rollback condition", /rollbackCondition|rollback/],
  ["AIDD-Spec接続", /AIDD-Spec/],
  ["execute_nowのみ", /execute_nowのみ/],
  ["Review Finding YAML", /review_finding:/],
  ["private URL block", /private URL/],
  ["local path block", /local path/],
  ["Firefox除外 block", /Firefox除外/],
  ["terminal evidence不足", /terminal evidence不足/],
  ["failure screenshot不足", /failure screenshot不足/],
  ["3ブラウザ設定", /Desktop Chrome[\s\S]*Desktop Firefox[\s\S]*Desktop Safari/],
  ["capture:mvp082", /capture:mvp082/]
];

const failures = requiredChecks.filter(([, pattern]) => !pattern.test(text));
if (/MVP081|Dispatch Receipt履歴|receipt-080/.test(text)) {
  failures.push(["古いMVP081固定文言残存", /$^/]);
}
const localPathPattern = new RegExp(["/Users", "tto"].join("/"));
const privateNetworkPattern = new RegExp(["tail", "net"].join(""));
if (localPathPattern.test(text) || privateNetworkPattern.test(text) || /\.ts\.net/.test(text)) {
  failures.push(["local pathまたはprivate host混入", /$^/]);
}

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const [label] of failures) console.error(`- ${label}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("- 4状態: empty / planned / failure / blocked");
console.log("- Smoke Receipt: broken URL / category / severity / lane / priority reason");
console.log("- prompt preview: execute_nowのみ、next_increment / learning_log分離");
console.log("- Repair Action: AI Task Packet patch / Codex prompt patch / verification commands / required evidence / rollback");
console.log("- blocked: private URL / local path / Firefox除外 / terminal evidence不足 / failure screenshot不足 / AIDD-Spec接続不足 / execute_now以外混入");
console.log("- 3ブラウザ: Chromium / Firefox / WebKit");
