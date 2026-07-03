import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const requiredFiles = [
  "package.json",
  "app/page.tsx",
  "src/lib/intake.ts",
  "tests/intake.test.ts",
  "e2e/intake-wizard.spec.ts",
  "playwright.config.ts",
  "scripts/capture-mvp023.mjs",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];
const requiredScripts = ["lint", "typecheck", "test", "test:coverage", "build", "test:e2e", "doctor:aidd", "mock:start", "mock:stop", "mock:doctor", "capture:mvp023"];
const requiredCopy = [
  "AIDD Control Plane MVP 023",
  "Safe Patch Review Workspace",
  "patch empty",
  "patch valid",
  "patch failure",
  "AI_TASK_PACKET.md",
  "CODEX_PROMPT.md",
  "VERIFICATION_PLAN.md",
  "LEARNING_LOG.md",
  "target file不足",
  "source draft id不足",
  "diff summary不足",
  "verification command不足",
  "rollback command不足",
  "危険なtarget path",
  "diff size過大",
  "未採用delta",
  "ローカルパス混入",
  "AIDD-Spec接続不足",
  "コピー用Codex prompt",
  "AIDD-Spec v0.1",
  "standards/aidd-control-plane-mvp-v0.1.md",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "capture:mvp023",
  "aidd-control-plane-mvp023-empty.png",
  "aidd-control-plane-mvp023-valid.png",
  "aidd-control-plane-mvp023-failure.png",
  "aidd-control-plane-mvp023-terminal-evidence.png"
];

function fail(message) { failures.push(message); }
function read(rel) { return readFileSync(path.join(root, rel), "utf8"); }

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) fail(`missing file: ${file}`);
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.name !== "aidd-control-plane-mvp-023") fail(`unexpected package name: ${packageJson.name}`);
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
}

const combined = requiredFiles.filter((file) => existsSync(path.join(root, file))).map(read).join("\n");
for (const token of requiredCopy) {
  if (!combined.includes(token)) fail(`missing required copy/token: ${token}`);
}

const appSource = read("app/page.tsx");
for (const token of ["createValidSafePatchReviewWorkspace", "evaluateSafePatchReviewWorkspace", "Safe Patch Review Workspace Review Finding", "rollback command"]) {
  if (!appSource.includes(token)) fail(`missing UI token: ${token}`);
}

const testSource = read("tests/intake.test.ts");
for (const token of ["Safe Patch Review Workspaceのvalidサンプル", "Safe Patch Review Workspaceのfailureサンプル", "危険なtarget path", "ローカルパス混入"]) {
  if (!testSource.includes(token)) fail(`missing unit test token: ${token}`);
}

const e2eSource = read("e2e/intake-wizard.spec.ts");
for (const token of ["Safe Patch Review Workspaceでempty valid failure", "patch valid", "patch failure", "git apply --check", "ローカルパス混入"]) {
  if (!e2eSource.includes(token)) fail(`missing E2E token: ${token}`);
}

const captureSource = read("scripts/capture-mvp023.mjs");
for (const token of ["patch empty", "patch valid", "patch failure", "aidd-control-plane-mvp023", "AIDD_MVP023_APP_URL"]) {
  if (!captureSource.includes(token)) fail(`missing capture token: ${token}`);
}

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("doctor:aidd passed");
console.log(`checked files: ${requiredFiles.length}`);
console.log(`checked scripts: ${requiredScripts.join(", ")}`);
console.log("checked MVP: AIDD Control Plane MVP 023 Safe Patch Review Workspace");
