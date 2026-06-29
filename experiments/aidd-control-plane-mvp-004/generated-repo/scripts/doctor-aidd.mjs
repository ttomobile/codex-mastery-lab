import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "package.json",
  "app/page.tsx",
  "app/globals.css",
  "src/lib/intake.ts",
  "tests/intake.test.ts",
  "e2e/intake-wizard.spec.ts",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];
const requiredScripts = ["lint", "typecheck", "test", "build", "test:e2e", "doctor:aidd"];
const requiredCopy = [
  "何を作りたいですか？",
  "誰のどんな問題を解決しますか？",
  "作らないものを決める",
  "必要な検証を選ぶ",
  "AIに渡す依頼書を生成",
  "Generated Product Brief",
  "Generated AI Task Packet",
  "Verification Plan",
  "Codex Prompt",
  "Readiness Review"
];
const requiredStates = ["empty", "loading", "success", "error", "offline", "timeout", "auth", "billing", "media_error"];
const forbiddenPatterns = [
  { label: "browser storage local", pattern: /\blocalStorage\b/ },
  { label: "browser storage session", pattern: /\bsessionStorage\b/ },
  { label: "network primitive one", pattern: /\bfetch\s*\(/ },
  { label: "network primitive two", pattern: /\bXMLHttpRequest\b/ },
  { label: "network primitive three", pattern: /\bWebSocket\b/ },
  { label: "external URL", pattern: /https?:\/\// }
];
const ignoredDirs = new Set(["node_modules", ".next", "coverage", "playwright-report", "test-results"]);
const scannedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md", ".json", ".css"]);
const failures = [];

function fail(message) {
  failures.push(message);
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    if (ignoredDirs.has(entry)) return [];
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) return walk(fullPath);
    if (!scannedExtensions.has(path.extname(entry))) return [];
    return [fullPath];
  });
}

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) fail(`missing file: ${file}`);
}

const packagePath = path.join(root, "package.json");
if (existsSync(packagePath)) {
  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
  for (const script of requiredScripts) {
    if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
  }
}

const files = walk(root);
const combined = files.map((file) => readFileSync(file, "utf8")).join("\n");
const appSourceFiles = files.filter((file) => {
  const relativePath = path.relative(root, file);
  return relativePath.startsWith("app/") || relativePath.startsWith("src/");
});

for (const copy of requiredCopy) {
  if (!combined.includes(copy)) fail(`missing UI copy token: ${copy}`);
}

for (const state of requiredStates) {
  if (!combined.includes(state)) fail(`missing state contract token: ${state}`);
}

for (const file of appSourceFiles) {
  const relativePath = path.relative(root, file);
  const text = readFileSync(file, "utf8");
  for (const item of forbiddenPatterns) {
    if (item.pattern.test(text)) fail(`forbidden ${item.label}: ${relativePath}`);
  }
}

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log(`checked files: ${requiredFiles.length}`);
console.log(`checked scripts: ${requiredScripts.join(", ")}`);
console.log(`checked states: ${requiredStates.join(", ")}`);
