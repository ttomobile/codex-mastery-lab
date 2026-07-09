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
  ["タイトル", /Smoke Receipt Repair Action Planner/],
  ["状態: empty", /empty/],
  ["状態: planned", /planned/],
  ["状態: failure", /failure/],
  ["状態: blocked", /blocked/],
  ["source receipt", /source receipt|sourceReceipt/],
  ["broken URL", /broken URL|brokenUrl/],
  ["finding category", /finding category|findingCategory/],
  ["severity", /severity/],
  ["lane", /lane/],
  ["priority reason", /priority reason|priorityReason/],
  ["execute_now action", /execute_now action|executeNowAction/],
  ["next_increment", /next_increment|nextIncrement/],
  ["learning_log", /learning_log|learningLog/],
  ["AI Task Packet patch", /AI Task Packet patch|aiTaskPacketPatch/],
  ["Codex prompt patch", /Codex prompt patch|codexPromptPatch/],
  ["Codex prompt execute_nowのみ", /execute_nowのみ/],
  ["verification commands", /Verification Commands|verificationCommands/],
  ["required evidence", /Required Evidence|requiredEvidence/],
  ["rollback condition", /Rollback Condition|rollbackCondition/],
  ["AIDD-Spec connection", /AIDD-Spec Connection|aiddSpecConnection/],
  ["planned文言", /次の1回で実行する修正Actionが準備できました/],
  ["Review Finding: 検証コマンド不足", /検証コマンド不足/],
  ["Review Finding: 証跡不足", /証跡不足/],
  ["Review Finding: rollback不足", /rollback不足/],
  ["Review Finding: AIDD-Spec接続不足", /AIDD-Spec接続不足/],
  ["Review Finding YAML", /review_finding:/],
  ["停止: private URL", /private URL/],
  ["停止: local path", /local path/],
  ["停止: Firefox除外", /Firefox除外/],
  ["停止: terminal evidence不足", /terminal evidence不足/],
  ["停止: failure screenshot不足", /failure screenshot不足/],
  ["停止: prompt混入", /execute_now以外のprompt混入/],
  ["3ブラウザ設定", /Desktop Chrome[\s\S]*Desktop Firefox[\s\S]*Desktop Safari/],
  ["capture:mvp078", /capture:mvp078/]
];

const failures = requiredChecks.filter(([, pattern]) => !pattern.test(text));

if (/state: valid|validは|mvp077-valid/.test(text)) {
  failures.push(["MVP077 valid残存", /$^/]);
}

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const [label] of failures) {
    console.error(`- ${label}`);
  }
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("- 4状態: empty / planned / failure / blocked");
console.log("- planned: 次の1回で実行する修正Actionが準備済み");
console.log("- failure: 検証コマンド不足 / 証跡不足 / rollback不足 / AIDD-Spec接続不足");
console.log("- blocked: private URL / local path / Firefox除外 / terminal evidence不足 / failure screenshot不足 / prompt混入");
console.log("- 3ブラウザ: Chromium / Firefox / WebKit");
