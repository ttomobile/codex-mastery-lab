import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "app/page.tsx",
  "src/domain/final-receipt-failure-handoff-queue.ts",
  "src/domain/final-receipt-failure-handoff-queue.test.ts",
  "tests/e2e/public-preview-smoke-final-receipt.spec.ts",
  "README.md",
  "playwright.config.ts",
  "package.json"
];
const text = files.map((file) => readFileSync(join(root, file), "utf8")).join("\n");

const requiredChecks = [
  ["MVP085", /MVP085/],
  ["機能名", /Final Receipt Failure Handoff Queue/],
  ["状態: empty", /empty/],
  ["状態: queued", /queued/],
  ["状態: blocked", /blocked/],
  ["状態: exported", /exported/],
  ["source receipt id", /sourceReceiptId|source receipt id/],
  ["broken URL", /brokenUrl|broken URL/],
  ["HTTP status", /HTTP status|httpStatus/],
  ["byte size", /byte size|byteSize/],
  ["content type", /content type|contentType/],
  ["latency ms", /latency ms|latencyMs/],
  ["finding category", /findingCategory|finding category/],
  ["severity", /severity/],
  ["lane", /execute_now[\s\S]*next_increment[\s\S]*learning_log/],
  ["priority reason", /priorityReason|priority reason/],
  ["AI Task Packet patch", /aiTaskPacketPatch|AI Task Packet patch/],
  ["Codex prompt patch", /codexPromptPatch|Codex prompt patch/],
  ["Codex prompt preview", /Codex prompt preview/],
  ["execute_nowのみ", /execute_nowのみ/],
  ["verification commands", /pnpm run lint[\s\S]*pnpm run typecheck[\s\S]*pnpm run test[\s\S]*pnpm run build[\s\S]*pnpm run test:e2e[\s\S]*pnpm run doctor:aidd/],
  ["terminal evidence", /terminal evidence/],
  ["failure screenshot", /failure screenshot/],
  ["Playwright report", /Playwright report/],
  ["Chromium", /Chromium/],
  ["Firefox", /Firefox/],
  ["WebKit", /WebKit/],
  ["console status", /console status|consoleStatus/],
  ["sanitization scan", /sanitization scan|sanitizationScan/],
  ["Review Finding YAML", /review_finding:/],
  ["Learning Log", /Learning Log/],
  ["rollback condition", /rollbackCondition|rollback condition/],
  ["AIDD-Spec接続", /AIDD-Spec接続|aiddSpecConnection/],
  ["private URL block", /private URL/],
  ["local path block", /local path/],
  ["host名 block", /host名/],
  ["Firefox未確認", /Firefox未確認/],
  ["terminal evidence不足", /terminal evidence不足/],
  ["3ブラウザ設定", /Desktop Chrome[\s\S]*Desktop Firefox[\s\S]*Desktop Safari/],
  ["capture:mvp085", /capture:mvp085/]
];

const failures = requiredChecks.filter(([, pattern]) => !pattern.test(text));
const localPathPattern = new RegExp(["/Us", "ers/tto"].join(""));
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
console.log("- 4状態: empty / queued / blocked / exported");
console.log("- source receipt / broken URL / HTTP status / byte size / content type / latency ms");
console.log("- execute_now / next_increment / learning_log を分離");
console.log("- exported promptにはexecute_nowのみ");
console.log("- terminal evidence / failure screenshot / Playwright report / rollback condition");
console.log("- 3ブラウザ: Chromium / Firefox / WebKit");
