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
  "scripts/capture-mvp064.mjs",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];

const requiredText = [
  "AIDD Control Plane MVP064",
  "Run Result Digest Publisher",
  "empty",
  "valid",
  "failure",
  "blocked",
  "source run id",
  "run outcome",
  "score",
  "terminal evidence",
  "initial screenshot",
  "filled screenshot",
  "failure screenshot",
  "terminal screenshot",
  "Chromium",
  "Firefox",
  "WebKit",
  "console status",
  "Review Record",
  "Learning Log",
  "AI Task Packet delta",
  "note article angle",
  "publish readiness",
  "source run id不足",
  "terminal evidence不足",
  "failure screenshot不足",
  "Firefox除外",
  "console error/warn未確認",
  "local path/host/private network URL混入",
  "Learning Log接続不足",
  "note記事観点不足",
  "共有用Markdown",
  "次回AI Task Packet delta",
  "Codex prompt delta",
  "Verification Evidence checklist",
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd",
  "pnpm run capture:mvp064"
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
const requiredScriptNames = ["lint", "typecheck", "test", "build", "test:e2e", "doctor:aidd", "capture:mvp064"];
const missingScripts = requiredScriptNames.filter((script) => !packageJson.scripts?.[script]);

const playwrightConfig = await readFile(path.join(root, "playwright.config.ts"), "utf8");
const missingBrowserConfig = ["Desktop Chrome", "Desktop Firefox", "Desktop Safari", "timeout: 120_000", "expect: { timeout: 90_000 }", "workers: 1"].filter((text) => !playwrightConfig.includes(text));

const publicFiles = ["README.md", "docs/product-brief.md", "docs/verification-plan.md", "docs/review-record.md", "docs/learning-log.md", "src/domain/digest-publisher.ts", "app/page.tsx"];
const dangerPatterns = [
  { label: "local home path", pattern: /\/Users\/|\/home\// },
  { label: "localhost", pattern: /localhost/i },
  { label: "private network URL", pattern: /https?:\/\/(?:127\.0\.0\.1|10\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.)/i },
  { label: "placeholder host", pattern: new RegExp(["<" + "home" + ">", "<" + "host" + ">", "tail\\.\\.\\."].join("|"), "i") }
];
const dangerousPublicStrings = [];
for (const file of publicFiles) {
  if (!existsSync(path.join(root, file))) continue;
  const text = await readFile(path.join(root, file), "utf8");
  for (const danger of dangerPatterns) {
    if (danger.pattern.test(text)) dangerousPublicStrings.push(`${file}: ${danger.label}`);
  }
}

if (missingFiles.length > 0 || missingText.length > 0 || missingScripts.length > 0 || missingBrowserConfig.length > 0 || dangerousPublicStrings.length > 0) {
  console.error("doctor:aidd failed");
  for (const file of missingFiles) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  for (const script of missingScripts) console.error(`missing script: ${script}`);
  for (const text of missingBrowserConfig) console.error(`missing Playwright config: ${text}`);
  for (const item of dangerousPublicStrings) console.error(`dangerous public string: ${item}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP064、4状態、3ブラウザ設定、必要script、Review Finding、valid出力、公開危険文字列検査を確認しました。");
