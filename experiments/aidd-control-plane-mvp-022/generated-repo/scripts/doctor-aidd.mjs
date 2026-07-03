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
  "scripts/capture-mvp022.mjs",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];
const requiredScripts = ["lint", "typecheck", "test", "test:coverage", "build", "test:e2e", "doctor:aidd", "mock:start", "mock:stop", "mock:doctor", "capture:mvp022"];
const requiredCopy = [
  "AIDD Control Plane MVP 022",
  "Packet Draft Workspace",
  "draft empty",
  "draft valid",
  "draft failure",
  "AI_TASK_PACKET.md",
  "CODEX_PROMPT.md",
  "VERIFICATION_PLAN.md",
  "LEARNING_LOG.md",
  "draft body不足",
  "source delta id不足",
  "verification command不足",
  "rollback condition不足",
  "file target重複または衝突",
  "未採用delta",
  "AIDD-Spec接続不足",
  "コピー用Codex prompt",
  "AIDD-Spec v0.1",
  "standards/aidd-control-plane-mvp-v0.1.md",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "capture:mvp022",
  "aidd-control-plane-mvp022-empty.png",
  "aidd-control-plane-mvp022-valid.png",
  "aidd-control-plane-mvp022-failure.png",
  "aidd-control-plane-mvp022-terminal-evidence.png"
];

function fail(message) { failures.push(message); }
function read(rel) { return readFileSync(path.join(root, rel), "utf8"); }

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) fail(`missing file: ${file}`);
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.name !== "aidd-control-plane-mvp-022") fail(`unexpected package name: ${packageJson.name}`);
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
}

const combined = requiredFiles.filter((file) => existsSync(path.join(root, file))).map(read).join("\n");
for (const token of requiredCopy) {
  if (!combined.includes(token)) fail(`missing required copy/token: ${token}`);
}

const appSource = read("app/page.tsx");
for (const token of ["createValidPacketDraftWorkspace", "evaluatePacketDraftWorkspace", "Packet Draft Workspace Review Finding", "コピー用本文プレビュー"]) {
  if (!appSource.includes(token)) fail(`missing UI token: ${token}`);
}

const testSource = read("tests/intake.test.ts");
for (const token of ["Packet Draft Workspaceのvalidサンプル", "Packet Draft Workspaceのfailureサンプル", "file target重複または衝突"]) {
  if (!testSource.includes(token)) fail(`missing unit test token: ${token}`);
}

const e2eSource = read("e2e/intake-wizard.spec.ts");
for (const token of ["Packet Draft Workspaceでempty valid failure", "draft valid", "draft failure", "コピー用Codex prompt", "AIDD-Spec接続不足"]) {
  if (!e2eSource.includes(token)) fail(`missing E2E token: ${token}`);
}

const captureSource = read("scripts/capture-mvp022.mjs");
for (const token of ["draft empty", "draft valid", "draft failure", "aidd-control-plane-mvp022", "AIDD_MVP022_APP_URL"]) {
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
console.log("checked MVP: AIDD Control Plane MVP 022 Packet Draft Workspace");
