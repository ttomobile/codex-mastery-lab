import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "README.md",
  "app/page.tsx",
  "app/layout.tsx",
  "src/domain/run-result-digest.ts",
  "tests/run-result-digest.test.ts",
  "e2e/run-result-digest.spec.ts",
  "scripts/capture-mvp075.mjs",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];

const missing = checks.filter((file) => !existsSync(path.join(root, file)));
const contents = await Promise.all(checks.filter((file) => existsSync(path.join(root, file))).map((file) => readFile(path.join(root, file), "utf8")));
const allText = contents.join("\n");
const requiredText = [
  "AIDD Control Plane MVP075",
  "Run Result Digest Publisher",
  "?state=empty|valid|failure|blocked",
  "source run未選択",
  "run outcome",
  "score",
  "terminal evidence",
  "initial",
  "filled",
  "failure",
  "terminal",
  "Chromium / Firefox / WebKit",
  "console status",
  "Review Record excerpt",
  "Learning Log excerpt",
  "AI Task Packet delta",
  "Codex prompt delta",
  "note article angle",
  "publish readiness",
  "score根拠不足",
  "Firefox未実行",
  "console warn",
  "terminal evidence不足",
  "local path / private host / private network URL混入",
  "detectUnsafePublicTokens",
  "sanitizeForPublic",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1",
  "capture:mvp075",
  "assets/aidd-control-plane-mvp075-empty.png",
  "assets/aidd-control-plane-mvp075-valid.png",
  "assets/aidd-control-plane-mvp075-failure.png",
  "assets/aidd-control-plane-mvp075-blocked.png"
];

const missingText = requiredText.filter((text) => !allText.includes(text));
const detectorPresent = allText.includes("/Users/") && allText.includes("10.0.0.75") && allText.includes("mvp075-workstation.local") && allText.includes("detectUnsafePublicTokens");

if (missing.length > 0 || missingText.length > 0 || !detectorPresent) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  if (!detectorPresent) console.error("missing local path / private host / private network URL detection fixture");
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP075、Run Result Digest Publisher、4状態、必須表示、3ブラウザ文言、公開前ブロック文言、capture:mvp075を確認しました。");
