import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "app/page.tsx",
  "src/domain/preview-smoke-receipt.ts",
  "src/domain/preview-smoke-receipt.test.ts",
  "tests/e2e/preview-smoke-receipt.spec.ts",
  "README.md",
  "playwright.config.ts",
  "package.json"
];

const text = files.map((file) => readFileSync(join(root, file), "utf8")).join("\n");

const requiredChecks = [
  ["タイトル", /Repair Action Run Queue Intake/],
  ["状態: empty", /empty/],
  ["状態: ready", /ready/],
  ["状態: failure", /failure/],
  ["状態: blocked", /blocked/],
  ["source repair action", /source repair action|sourceRepairAction/],
  ["queue payload", /Queue Payload|queuePayload/],
  ["execute_now summary", /execute_now summary|executeNowSummary/],
  ["excluded next_increment", /excluded next_increment|excludedNextIncrement/],
  ["excluded learning_log", /excluded learning_log|excludedLearningLog/],
  ["verification gate", /verification gate|verificationGate/],
  ["evidence gate", /evidence gate|evidenceGate/],
  ["rollback gate", /rollback gate|rollbackGate/],
  ["sanitize gate", /sanitize gate|sanitizeGate/],
  ["AIDD-Spec connection", /AIDD-Spec Connection|aiddSpecConnection/],
  ["ready文言", /実行キュー投入前チェックを通過しました/],
  ["payload execute_nowのみ", /execute_nowのみ/],
  ["Review Finding: 検証ゲート不足", /検証ゲート不足/],
  ["Review Finding: 証跡ゲート不足", /証跡ゲート不足/],
  ["Review Finding: rollbackゲート不足", /rollbackゲート不足/],
  ["Review Finding YAML", /review_finding:/],
  ["停止: private URL", /private URL/],
  ["停止: local path", /local path/],
  ["停止: Firefox除外", /Firefox除外/],
  ["停止: terminal evidence不足", /terminal evidence不足/],
  ["停止: failure screenshot不足", /failure screenshot不足/],
  ["停止: next_increment混入", /next_increment混入/],
  ["停止: learning_log混入", /learning_log混入/],
  ["停止: 破壊的cleanup要求", /破壊的cleanup要求|destructiveCleanupRequest/],
  ["3ブラウザ設定", /Desktop Chrome[\s\S]*Desktop Firefox[\s\S]*Desktop Safari/],
  ["capture:mvp079", /capture:mvp079/]
];

const failures = requiredChecks.filter(([, pattern]) => !pattern.test(text));

if (/state: valid|mvp077-valid/.test(text)) {
  failures.push(["古いvalid状態残存", /$^/]);
}

const localPathPattern = new RegExp(["/Users", "tto"].join("/"));
const privateNetworkPattern = new RegExp(["tail", "net"].join(""));
if (localPathPattern.test(text) || privateNetworkPattern.test(text) || /\.ts\.net/.test(text)) {
  failures.push(["local pathまたはprivate host混入", /$^/]);
}

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const [label] of failures) {
    console.error(`- ${label}`);
  }
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("- 4状態: empty / ready / failure / blocked");
console.log("- ready: 実行キュー投入前チェックを通過");
console.log("- failure: 検証ゲート不足 / 証跡ゲート不足 / rollbackゲート不足 / AIDD-Spec接続不足");
console.log("- blocked: private URL / local path / Firefox除外 / terminal evidence不足 / failure screenshot不足 / prompt混入 / 破壊的cleanup要求");
console.log("- 3ブラウザ: Chromium / Firefox / WebKit");
