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
  "scripts/capture-mvp024.mjs",
  "scripts/capture-mvp025.mjs",
  "scripts/capture-mvp026.mjs",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];
const requiredScripts = ["lint", "typecheck", "test", "test:coverage", "build", "test:e2e", "doctor:aidd", "mock:start", "mock:stop", "mock:doctor", "capture:mvp024", "capture:mvp025", "capture:mvp026"];
const requiredCopy = [
  "Dogfood Packet Markdown Review",
  "Markdown反映前プレビュー",
  "Packet Apply Command Composer",
  "apply command",
  "dry-run",
  "verification command",
  "rollback command",
  "evidence path",
  "未レビューMarkdown混入",
  "危険なtarget path",
  "AI_TASK_PACKET.md",
  "CODEX_PROMPT.md",
  "VERIFICATION_PLAN.md",
  "AIDD-Spec v0.1",
  "standards/aidd-control-plane-mvp-v0.1.md",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "Rollback Plan",
  "capture:mvp026",
  "aidd-control-plane-mvp026-empty.png",
  "aidd-control-plane-mvp026-valid.png",
  "aidd-control-plane-mvp026-failure.png",
  "aidd-control-plane-mvp026-terminal-evidence.png"
];

function fail(message) { failures.push(message); }
function read(rel) { return readFileSync(path.join(root, rel), "utf8"); }

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) fail(`missing file: ${file}`);
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.name !== "aidd-control-plane-mvp-026") fail(`unexpected package name: ${packageJson.name}`);
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
}

const combined = requiredFiles.filter((file) => existsSync(path.join(root, file))).map(read).join("\n");
for (const token of requiredCopy) {
  if (!combined.includes(token)) fail(`missing required copy/token: ${token}`);
}

const appSource = read("app/page.tsx");
for (const token of ["createValidPacketApplyCommandComposer", "evaluatePacketApplyCommandComposer", "Packet Apply Command Composer", "composer valid", "composer failure"]) {
  if (!appSource.includes(token)) fail(`missing MVP026 UI token: ${token}`);
}

const testSource = read("tests/intake.test.ts");
for (const token of ["Packet Apply Command Composerはempty valid failureを判定できる", "createValidPacketApplyCommandComposer", "危険なtarget path", "未レビューMarkdown混入"]) {
  if (!testSource.includes(token)) fail(`missing MVP026 unit test token: ${token}`);
}

const e2eSource = read("e2e/intake-wizard.spec.ts");
for (const token of ["Packet Apply Command Composerでempty valid failure", "composer valid", "composer failure", "evidence path", "未レビューMarkdown混入"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP026 E2E token: ${token}`);
}

const captureMvp026Source = read("scripts/capture-mvp026.mjs");
for (const token of ["composer valid", "composer failure", "aidd-control-plane-mvp026", "AIDD_MVP026_APP_URL"]) {
  if (!captureMvp026Source.includes(token)) fail(`missing MVP026 capture token: ${token}`);
}

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("doctor:aidd passed");
console.log(`checked files: ${requiredFiles.length}`);
console.log(`checked scripts: ${requiredScripts.join(", ")}`);
console.log("checked MVP: AIDD Control Plane MVP 026 Packet Apply Command Composer");
