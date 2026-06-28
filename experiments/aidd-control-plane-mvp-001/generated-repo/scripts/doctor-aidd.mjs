import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "package.json",
  "app/page.tsx",
  "src/lib/aidd.ts",
  "tests/aidd.test.ts",
  "e2e/aidd-workflow.spec.ts",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/review-record.md",
  "docs/learning-log.md",
  "docs/verification-evidence.md"
];

const requiredScripts = ["lint", "typecheck", "test", "build", "test:e2e", "doctor:aidd"];
const requiredCopy = [
  "Dashboard",
  "Project Brief Builder",
  "AI Task Packet Builder",
  "Packet Preview",
  "Agent Runbook",
  "Review Dashboard",
  "Learning Log",
  "L3準備OK",
  "外部API未接続",
  "ログイン不要",
  "課金機能は非ゴール"
];
const requiredStates = ["empty", "loading", "success", "error", "offline", "timeout"];
const forbiddenPatterns = [
  { label: "localStorage", pattern: /\blocalStorage\b/ },
  { label: "sessionStorage", pattern: /\bsessionStorage\b/ },
  { label: "fetch", pattern: /\bfetch\s*\(/ },
  { label: "XMLHttpRequest", pattern: /\bXMLHttpRequest\b/ },
  { label: "external URL", pattern: /https?:\/\/(?!(127\.0\.0\.1|localhost|\[::1\]))/ }
];
const ignoredDirs = new Set(["node_modules", ".next", "coverage", "playwright-report", "test-results"]);
const scannedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md", ".json"]);
const failures = [];

function fail(message) {
  failures.push(message);
}

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) fail(`missing file: ${file}`);
}

const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
}

function walk(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    if (ignoredDirs.has(entry)) return [];
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) return walk(fullPath);
    if (!scannedExtensions.has(path.extname(entry))) return [];
    return [fullPath];
  });
}

const files = walk(root);
const combined = files.map((file) => readFileSync(file, "utf8")).join("\n");
const implementationFiles = files.filter((file) => {
  const rel = path.relative(root, file);
  return rel.startsWith("app/") || rel.startsWith("src/") || rel.startsWith("tests/") || rel.startsWith("e2e/");
});

for (const copy of requiredCopy) {
  if (!combined.includes(copy)) fail(`missing AIDD copy: ${copy}`);
}

for (const state of requiredStates) {
  if (!combined.includes(state)) fail(`missing state token: ${state}`);
}

for (const file of implementationFiles) {
  const rel = path.relative(root, file);
  const text = readFileSync(file, "utf8");
  for (const item of forbiddenPatterns) {
    if (item.pattern.test(text)) fail(`forbidden ${item.label}: ${rel}`);
  }
}

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log(`checked files: ${requiredFiles.length}`);
console.log(`checked scripts: ${requiredScripts.join(", ")}`);
console.log(`checked states: ${requiredStates.join(", ")}`);
