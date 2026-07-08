import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "README.md",
  "app/page.tsx",
  "app/layout.tsx",
  "app/globals.css",
  "src/domain/readiness-gate.ts",
  "tests/readiness-gate.test.ts",
  "e2e/readiness-gate.spec.ts",
  "scripts/doctor-aidd.mjs",
  "scripts/capture-mvp068.mjs",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];
const requiredText = [
  "AIDD Control Plane MVP068",
  "One-Run Execution Readiness Gate",
  "Smoke Finding Action Queue",
  "Codex Run Queue",
  "empty",
  "ready",
  "blocked",
  "sanitized",
  "source queue id",
  "execute_now action id",
  "codex command",
  "sandbox mode",
  "required verification commands",
  "rollback stop condition",
  "Codex prompt preview",
  "Chromium",
  "Firefox",
  "WebKit",
  "危険command",
  "Firefox除外",
  "terminal/failure screenshot不足",
  "AIDD-Spec v0.1",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd",
  "pnpm run capture:mvp068"
];
const missingFiles = requiredFiles.filter((file) => !existsSync(path.join(root, file)));
const existing = await Promise.all(requiredFiles.filter((file) => existsSync(path.join(root, file))).map(async (file) => [file, await readFile(path.join(root, file), "utf8")]));
const allText = existing.map(([, text]) => text).join("\n");
const missingText = requiredText.filter((text) => !allText.includes(text));
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const requiredScripts = ["lint", "typecheck", "test", "build", "test:e2e", "doctor:aidd", "capture:mvp068"];
const missingScripts = requiredScripts.filter((script) => !packageJson.scripts?.[script]);
const playwrightConfig = await readFile(path.join(root, "playwright.config.ts"), "utf8");
const missingBrowserConfig = ["Desktop Chrome", "Desktop Firefox", "Desktop Safari", "timeout: 120_000", "expect: { timeout: 90_000 }", "workers: 1"].filter((text) => !playwrightConfig.includes(text));
const testText = await readFile(path.join(root, "tests/readiness-gate.test.ts"), "utf8");
const missingTestText = ["execute_nowだけ", "RFQ-067-003", "promptに混ざると検出"].filter((text) => !testText.includes(text));
const captureScript = await readFile(path.join(root, "scripts/capture-mvp068.mjs"), "utf8");
const missingCaptureText = ["aidd-control-plane-mvp068-empty.png", "aidd-control-plane-mvp068-ready.png", "aidd-control-plane-mvp068-blocked.png", "aidd-control-plane-mvp068-sanitized.png", "aidd-control-plane-mvp068-terminal-evidence.png", "capture:mvp068 completed"].filter((text) => !captureScript.includes(text));
const scanFiles = ["README.md", "docs/product-brief.md", "docs/verification-plan.md", "docs/review-record.md", "docs/learning-log.md", "src/domain/readiness-gate.ts", "tests/readiness-gate.test.ts", "e2e/readiness-gate.spec.ts", "app/page.tsx"];
const dangerPatterns = [
  { label: "local home path", pattern: /\/Users\/|\/home\// },
  { label: "private network URL", pattern: /https?:\/\/(?:127\.0\.0\.1|10\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.)/i },
  { label: "placeholder host", pattern: new RegExp(["<" + "home" + ">", "<" + "host" + ">", "tail\\.\\.\\."].join("|"), "i") }
];
const dangerous = [];
for (const file of scanFiles) {
  if (!existsSync(path.join(root, file))) continue;
  const text = await readFile(path.join(root, file), "utf8");
  for (const danger of dangerPatterns) if (danger.pattern.test(text)) dangerous.push(`${file}: ${danger.label}`);
}
if (missingFiles.length || missingText.length || missingScripts.length || missingBrowserConfig.length || missingTestText.length || missingCaptureText.length || dangerous.length) {
  console.error("doctor:aidd failed");
  for (const item of missingFiles) console.error(`missing file: ${item}`);
  for (const item of missingText) console.error(`missing text: ${item}`);
  for (const item of missingScripts) console.error(`missing script: ${item}`);
  for (const item of missingBrowserConfig) console.error(`missing Playwright config: ${item}`);
  for (const item of missingTestText) console.error(`missing test text: ${item}`);
  for (const item of missingCaptureText) console.error(`missing capture text: ${item}`);
  for (const item of dangerous) console.error(`dangerous string: ${item}`);
  process.exit(1);
}
console.log("doctor:aidd passed");
console.log("MVP068、4状態、execute_now限定readiness、3ブラウザE2E、capture:mvp068、AIDD-Spec接続、公開危険文字列検査を確認しました。");
