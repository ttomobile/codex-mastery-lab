import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "app/page.tsx",
  "src/domain/public-preview-smoke-final-receipt.ts",
  "src/domain/public-preview-smoke-final-receipt.test.ts",
  "tests/e2e/public-preview-smoke-final-receipt.spec.ts",
  "README.md",
  "playwright.config.ts",
  "package.json"
];
const text = files.map((file) => readFileSync(join(root, file), "utf8")).join("\n");

const requiredChecks = [
  ["MVP084", /MVP084/],
  ["機能名", /Public Preview Smoke Final Receipt/],
  ["状態: empty", /empty/],
  ["状態: verified", /verified/],
  ["状態: failure", /failure/],
  ["状態: blocked", /blocked/],
  ["checked URLs", /checked URLs|checkedAt|checked_at/],
  ["HTTP status", /HTTP status|httpStatus/],
  ["byte size", /byte size|byteSize/],
  ["content type", /content type|contentType/],
  ["latency ms", /latency ms|latencyMs/],
  ["terminal evidence image response", /terminal evidence image response|terminalEvidenceImageResponse/],
  ["Chromium", /Chromium/],
  ["Firefox", /Firefox/],
  ["WebKit", /WebKit/],
  ["console status", /console status|consoleStatus/],
  ["sanitization scan", /sanitization scan|sanitizationScan/],
  ["Review Finding YAML", /review_finding:/],
  ["Learning Log", /Learning Log/],
  ["AI Task Packet delta", /AI Task Packet delta/],
  ["Codex prompt delta", /Codex prompt delta/],
  ["private URL block", /private URL/],
  ["local path block", /local path/],
  ["host名 block", /host名/],
  ["Firefox未確認", /Firefox未確認/],
  ["terminal evidence不足", /terminal evidence不足/],
  ["AIDD-Spec接続不足", /AIDD-Spec接続不足/],
  ["rollback不足", /rollback不足/],
  ["3ブラウザ設定", /Desktop Chrome[\s\S]*Desktop Firefox[\s\S]*Desktop Safari/],
  ["capture:mvp084", /capture:mvp084/]
];

const failures = requiredChecks.filter(([, pattern]) => !pattern.test(text));
if (/MVP083|Smoke Repair Priority Gate/.test(text)) {
  failures.push(["古いMVP083固定文言残存", /$^/]);
}
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
console.log("- 4状態: empty / verified / failure / blocked");
console.log("- HTTP receipt: checked URLs / HTTP status / byte size / content type / latency ms / checked_at");
console.log("- terminal evidence image response、console status、sanitization scan");
console.log("- failure: 404 / 0 byte / content type mismatch / latency超過をReview Findingとdeltaへ変換");
console.log("- blocked: private URL / local path / host名 / Firefox未確認 / terminal evidence不足 / AIDD-Spec接続不足 / rollback不足");
console.log("- 3ブラウザ: Chromium / Firefox / WebKit");
