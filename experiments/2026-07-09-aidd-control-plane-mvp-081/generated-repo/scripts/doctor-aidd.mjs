import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "app/page.tsx",
  "src/domain/receipt-history.ts",
  "src/domain/receipt-history.test.ts",
  "tests/e2e/receipt-history.spec.ts",
  "README.md",
  "playwright.config.ts",
  "package.json"
];
const text = files.map((file) => readFileSync(join(root, file), "utf8")).join("\n");

const requiredChecks = [
  ["MVP081", /MVP081/],
  ["タイトル", /Dispatch Receipt履歴|Receipt履歴/],
  ["状態: empty", /empty/],
  ["状態: valid", /valid/],
  ["状態: improved", /improved/],
  ["状態: regression", /regression/],
  ["状態: blocked", /blocked/],
  ["3件以上Receipt", /receipt-080-a[\s\S]*receipt-080-b[\s\S]*receipt-080-c/],
  ["score推移", /scoreDelta|score delta|72 → 81 → 90/],
  ["再発finding", /recurringFindings|再発finding/],
  ["減ったfinding", /reducedFindings|減ったfinding/],
  ["効いたRepair Action", /effectiveRepairActions|効いたRepair Action/],
  ["AI Task Packet delta", /nextPacketDelta|AI Task Packet delta/],
  ["execute_nowのみ", /execute_nowのみ/],
  ["next_increment分離", /next_increment/],
  ["learning_log分離", /learning_log/],
  ["Review Finding YAML", /review_finding:/],
  ["private URL block", /private URL/],
  ["local path block", /local path/],
  ["host名 block", /host名/],
  ["Firefox除外 block", /Firefox除外/],
  ["terminal evidence不足", /terminal evidence不足/],
  ["failure screenshot不足", /failure screenshot不足/],
  ["AIDD-Spec接続", /AIDD-Spec/],
  ["3ブラウザ設定", /Desktop Chrome[\s\S]*Desktop Firefox[\s\S]*Desktop Safari/],
  ["capture:mvp081", /capture:mvp081/]
];

const failures = requiredChecks.filter(([, pattern]) => !pattern.test(text));
if (/mvp080-terminal-evidence|Run Queue Dispatch Receipt\n/.test(text)) {
  failures.push(["古いMVP080固定文言残存", /$^/]);
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
console.log("- 5状態: empty / valid / improved / regression / blocked");
console.log("- 履歴比較: 3件のReceipt、score推移、再発finding、減ったfinding、効いたRepair Action");
console.log("- prompt preview: execute_nowのみ、next_increment / learning_log分離");
console.log("- blocked: private URL / local path / host名 / Firefox除外 / terminal evidence不足 / failure screenshot不足 / AIDD-Spec接続不足 / execute_now以外混入");
console.log("- 3ブラウザ: Chromium / Firefox / WebKit");
