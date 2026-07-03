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
  "scripts/capture-mvp027.mjs",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];
const requiredScripts = ["lint", "typecheck", "test", "test:coverage", "build", "test:e2e", "doctor:aidd", "mock:start", "mock:stop", "mock:doctor", "capture:mvp024", "capture:mvp025", "capture:mvp026", "capture:mvp027"];
const requiredCopy = [
  "Diff Bundle & Rollback Evidence Workspace",
  "source apply plan / patch id",
  "bundle id",
  "target file",
  "before hash",
  "after hash",
  "diff bundle path",
  "dry-run",
  "dry-run status",
  "rollback evidence path",
  "rollback verified command",
  "verification command",
  "reviewer checklist",
  "reviewer未承認",
  "危険なtarget path",
  "絶対パス",
  "ローカルパスやhost名の混入",
  "AIDD-Spec接続不足",
  "AI_TASK_PACKET.md",
  "CODEX_PROMPT.md",
  "VERIFICATION_PLAN.md",
  "LEARNING_LOG.md",
  "AIDD-Spec v0.1",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "Rollback Plan",
  "capture:mvp027",
  "aidd-control-plane-mvp027-empty.png",
  "aidd-control-plane-mvp027-valid.png",
  "aidd-control-plane-mvp027-failure.png",
  "aidd-control-plane-mvp027-terminal-evidence.png"
];

function fail(message) { failures.push(message); }
function read(rel) { return readFileSync(path.join(root, rel), "utf8"); }

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) fail(`missing file: ${file}`);
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.name !== "aidd-control-plane-mvp-027") fail(`unexpected package name: ${packageJson.name}`);
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
}

const combinedFiles = Array.from(new Set([...requiredFiles, "scripts/doctor-aidd.mjs", "scripts/capture-mvp027.mjs", "package.json"]));
const combined = combinedFiles.filter((file) => existsSync(path.join(root, file))).map(read).join("\n");
for (const token of requiredCopy) {
  if (!combined.includes(token)) fail(`missing required copy/token: ${token}`);
}

const appSource = read("app/page.tsx");
for (const token of ["createValidDiffBundleRollbackEvidenceWorkspace", "evaluateDiffBundleRollbackEvidenceWorkspace", "Diff Bundle & Rollback Evidence Workspace", "bundle valid", "bundle failure", "reviewer approval"]) {
  if (!appSource.includes(token)) fail(`missing MVP027 UI token: ${token}`);
}

const testSource = read("tests/intake.test.ts");
for (const token of ["Diff Bundle Rollback Evidence Workspaceのvalidサンプル", "createValidDiffBundleRollbackEvidenceWorkspace", "危険なtarget path（../）", "危険なtarget path（絶対パス）", "reviewer未承認"]) {
  if (!testSource.includes(token)) fail(`missing MVP027 unit test token: ${token}`);
}

const e2eSource = read("e2e/intake-wizard.spec.ts");
for (const token of ["Diff Bundle Rollback Evidence Workspaceでempty valid failure", "bundle valid", "bundle failure", "source apply plan / patch id", "ローカルパスやhost名の混入"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP027 E2E token: ${token}`);
}

const captureMvp027Source = read("scripts/capture-mvp027.mjs");
for (const token of ["bundle valid", "bundle failure", "aidd-control-plane-mvp027", "AIDD_MVP027_APP_URL"]) {
  if (!captureMvp027Source.includes(token)) fail(`missing MVP027 capture token: ${token}`);
}

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("doctor:aidd passed");
console.log(`checked files: ${requiredFiles.length}`);
console.log(`checked scripts: ${requiredScripts.join(", ")}`);
console.log("checked MVP: AIDD Control Plane MVP 027 Diff Bundle & Rollback Evidence Workspace");
