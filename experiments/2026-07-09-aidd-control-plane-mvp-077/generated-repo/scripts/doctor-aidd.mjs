import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const files = [
  "app/page.tsx",
  "src/domain/preview-smoke-receipt.ts",
  "tests/e2e/preview-smoke-receipt.spec.ts",
  "README.md",
  "playwright.config.ts"
];

const text = files.map((file) => readFileSync(join(root, file), "utf8")).join("\n");

const requiredChecks = [
  ["タイトル", /Preview Smoke Receipt Binder/],
  ["状態: empty", /empty/],
  ["状態: valid", /valid/],
  ["状態: failure", /failure/],
  ["状態: blocked", /blocked/],
  ["receipt id", /receipt id/],
  ["source QA gate id", /source QA gate id/],
  ["checked URLs", /Checked URLs|checkedUrls/],
  ["HTTP status", /HTTP status|httpStatus/],
  ["byte size", /byte size|byteSize/],
  ["content type", /content type|contentType/],
  ["latency ms", /latency ms|latencyMs/],
  ["checked_at", /checked_at|checkedAt/],
  ["evidence path", /evidence path|evidencePath/],
  ["Chromium", /Chromium/],
  ["Firefox", /Firefox/],
  ["WebKit", /WebKit/],
  ["console status", /console status|consoleStatus/],
  ["sanitization scan", /sanitization scan|sanitizationScan/],
  ["AIDD-Spec接続", /AIDD-Spec接続|AIDD-Spec v0\.1/],
  ["MVP076接続", /MVP076 Publication Evidence QA Gate/],
  ["valid文言", /公開previewのHTTP証跡を保存できます/],
  ["Review Finding: 404", /404/],
  ["Review Finding: 0 byte", /0 byte/],
  ["Review Finding: content type mismatch", /content type mismatch/],
  ["Review Finding: latency超過", /latency超過/],
  ["公開前停止: private URL", /private URL/],
  ["公開前停止: local path", /local path/],
  ["公開前停止: Firefox未確認", /Firefox未確認/],
  ["公開前停止: receipt保存先不足", /receipt保存先不足/],
  ["公開前停止: AIDD-Spec接続不足", /AIDD-Spec接続不足/],
  ["3ブラウザ設定", /Desktop Chrome[\s\S]*Desktop Firefox[\s\S]*Desktop Safari/]
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
console.log("- AIDD-Spec接続: MVP076 Publication Evidence QA Gate -> Preview Smoke Receipt Binder");
console.log("- 3ブラウザ: Chromium / Firefox / WebKit");
console.log("- 公開前停止: private URL / local path / Firefox未確認 / receipt保存先不足 / AIDD-Spec接続不足");
