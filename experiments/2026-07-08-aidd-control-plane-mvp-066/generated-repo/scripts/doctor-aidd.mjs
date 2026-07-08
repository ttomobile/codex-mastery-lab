import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "README.md",
  "app/page.tsx",
  "app/layout.tsx",
  "app/globals.css",
  "src/domain/digest-publisher.ts",
  "tests/digest-publisher.test.ts",
  "e2e/digest-publisher.spec.ts",
  "scripts/doctor-aidd.mjs",
  "scripts/capture-mvp066.mjs",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];

const requiredText = [
  "AIDD Control Plane MVP066",
  "Public Preview Smoke Verifier",
  "MVP065 Publication Evidence QA Gate",
  "empty",
  "valid",
  "failure",
  "blocked",
  "evaluatePublicPreviewSmoke",
  "smoke run id",
  "article path",
  "preview URL/path",
  "checked URLs",
  "HTTP status",
  "byte size",
  "content type",
  "latency ms",
  "terminal evidence image response",
  "Chromium",
  "Firefox",
  "WebKit",
  "console status",
  "sanitization scan",
  "Review Finding",
  "Learning Log",
  "AI Task Packet delta",
  "Codex prompt delta",
  "rerun command",
  "AIDD-Spec v0.1",
  "AIDD Control Plane MVP v0.1",
  "Verification Evidence",
  "Release Checklist",
  "HTTP経路未確認",
  "private URL混入",
  "Firefox未確認",
  "terminal evidence image response不足",
  "AIDD-Spec接続不足",
  "失敗asset",
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd",
  "pnpm run capture:mvp066"
];

const missingFiles = requiredFiles.filter((file) => !existsSync(path.join(root, file)));
const existingContents = await Promise.all(
  requiredFiles
    .filter((file) => existsSync(path.join(root, file)))
    .map(async (file) => [file, await readFile(path.join(root, file), "utf8")])
);
const allText = existingContents.map(([, text]) => text).join("\n");
const missingText = requiredText.filter((text) => !allText.includes(text));

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const requiredScriptNames = ["lint", "typecheck", "test", "build", "test:e2e", "doctor:aidd", "capture:mvp066"];
const missingScripts = requiredScriptNames.filter((script) => !packageJson.scripts?.[script]);

const domainText = await readFile(path.join(root, "src/domain/digest-publisher.ts"), "utf8");
const missingFixtures = ["emptyInput", "validInput", "failureInput", "blockedInput"].filter((text) => !domainText.includes(text));
const missingFixtureStates = ['"empty"', '"valid"', '"failure"', '"blocked"'].filter((text) => !domainText.includes(text));

const e2eText = await readFile(path.join(root, "e2e/digest-publisher.spec.ts"), "utf8");
const missingE2eText = [
  "4状態",
  "失敗asset",
  "再実行コマンド",
  "3ブラウザ表示",
  "Public Preview Smoke Verifier"
].filter((text) => !e2eText.includes(text));

const playwrightConfig = await readFile(path.join(root, "playwright.config.ts"), "utf8");
const missingBrowserConfig = ["Desktop Chrome", "Desktop Firefox", "Desktop Safari", "timeout: 120_000", "expect: { timeout: 90_000 }", "workers: 1"].filter((text) => !playwrightConfig.includes(text));

const captureScript = await readFile(path.join(root, "scripts/capture-mvp066.mjs"), "utf8");
const missingCaptureText = [
  "aidd-control-plane-mvp066-empty.png",
  "aidd-control-plane-mvp066-valid.png",
  "aidd-control-plane-mvp066-failure.png",
  "aidd-control-plane-mvp066-blocked.png",
  "aidd-control-plane-mvp066-terminal-evidence.png",
  "capture:mvp066 completed"
].filter((text) => !captureScript.includes(text));

const scanFiles = [
  "README.md",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md",
  "src/domain/digest-publisher.ts",
  "tests/digest-publisher.test.ts",
  "e2e/digest-publisher.spec.ts",
  "app/page.tsx"
];
const dangerPatterns = [
  { label: "local home path", pattern: /\/Users\/|\/home\// },
  { label: "localhost", pattern: /localhost/i },
  { label: "private network URL", pattern: /https?:\/\/(?:127\.0\.0\.1|10\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.)/i },
  { label: "placeholder host", pattern: new RegExp(["<" + "home" + ">", "<" + "host" + ">", "tail\\.\\.\\."].join("|"), "i") }
];
const dangerousFixtureStrings = [];
for (const file of scanFiles) {
  if (!existsSync(path.join(root, file))) continue;
  const text = await readFile(path.join(root, file), "utf8");
  for (const danger of dangerPatterns) {
    if (danger.pattern.test(text)) dangerousFixtureStrings.push(`${file}: ${danger.label}`);
  }
}

if (
  missingFiles.length > 0 ||
  missingText.length > 0 ||
  missingScripts.length > 0 ||
  missingFixtures.length > 0 ||
  missingFixtureStates.length > 0 ||
  missingE2eText.length > 0 ||
  missingBrowserConfig.length > 0 ||
  missingCaptureText.length > 0 ||
  dangerousFixtureStrings.length > 0
) {
  console.error("doctor:aidd failed");
  for (const file of missingFiles) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  for (const script of missingScripts) console.error(`missing script: ${script}`);
  for (const text of missingFixtures) console.error(`missing fixture: ${text}`);
  for (const text of missingFixtureStates) console.error(`missing fixture state: ${text}`);
  for (const text of missingE2eText) console.error(`missing E2E text: ${text}`);
  for (const text of missingBrowserConfig) console.error(`missing Playwright config: ${text}`);
  for (const text of missingCaptureText) console.error(`missing capture text: ${text}`);
  for (const item of dangerousFixtureStrings) console.error(`dangerous fixture string: ${item}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP066、必要script、4状態fixture、E2E、capture:mvp066、AIDD-Spec接続文言、公開危険文字列のfixture混入検査を確認しました。");
