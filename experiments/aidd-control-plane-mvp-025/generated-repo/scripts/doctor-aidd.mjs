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
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];
const requiredScripts = ["lint", "typecheck", "test", "test:coverage", "build", "test:e2e", "doctor:aidd", "mock:start", "mock:stop", "mock:doctor", "capture:mvp024", "capture:mvp025"];
const requiredCopy = [
  "AIDD Control Plane MVP 024",
  "Dogfood Packet Markdown Review",
  "Markdown反映前プレビュー",
  "Diff Bundle & Rollback Evidence Workspace",
  "bundle empty",
  "bundle valid",
  "bundle failure",
  "diff bundle",
  "before hash",
  "after hash",
  "dry-run",
  "rollback evidence",
  "rollback verified command",
  "AI_TASK_PACKET.md",
  "CODEX_PROMPT.md",
  "VERIFICATION_PLAN.md",
  "LEARNING_LOG.md",
  "source patch id不足",
  "before hash不足",
  "after hash不足",
  "dry-run未成功",
  "rollback evidence不足",
  "rollback verified command不足",
  "危険なtarget path",
  "ローカルパス混入",
  "AIDD-Spec接続不足",
  "AIDD-Spec v0.1",
  "standards/aidd-control-plane-mvp-v0.1.md",
  "Verification Evidence",
  "Review Record",
  "Learning Log",
  "Rollback Plan",
  "capture:mvp024",
  "aidd-control-plane-mvp024-empty.png",
  "aidd-control-plane-mvp024-valid.png",
  "aidd-control-plane-mvp024-failure.png",
  "aidd-control-plane-mvp024-terminal-evidence.png"
];

function fail(message) { failures.push(message); }
function read(rel) { return readFileSync(path.join(root, rel), "utf8"); }

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) fail(`missing file: ${file}`);
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.name !== "aidd-control-plane-mvp-025") fail(`unexpected package name: ${packageJson.name}`);
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
}

const combined = requiredFiles.filter((file) => existsSync(path.join(root, file))).map(read).join("\n");
for (const token of requiredCopy) {
  if (!combined.includes(token)) fail(`missing required copy/token: ${token}`);
}

const appSource = read("app/page.tsx");
for (const token of ["createValidDiffBundleRollbackEvidenceWorkspace", "evaluateDiffBundleRollbackEvidenceWorkspace", "Diff Bundle Rollback Evidence Workspace Review Finding", "rollback evidence"]) {
  if (!appSource.includes(token)) fail(`missing UI token: ${token}`);
}
for (const token of ["createDogfoodPacketMarkdownReview", "Dogfood Packet Markdown Review", "Dogfood packet markdown copy bundle"]) {
  if (!appSource.includes(token)) fail(`missing MVP025 UI token: ${token}`);
}

const testSource = read("tests/intake.test.ts");
for (const token of ["Diff Bundle Rollback Evidence Workspaceのvalidサンプル", "Diff Bundle Rollback Evidence Workspaceのfailureサンプル", "dry-run失敗", "ローカルパス混入"]) {
  if (!testSource.includes(token)) fail(`missing unit test token: ${token}`);
}
for (const token of ["Dogfood Packet Markdown Reviewはseedを3つのMarkdown反映前プレビューへ分ける", "createDogfoodPacketMarkdownReview", "実ファイルへ反映する"]) {
  if (!testSource.includes(token)) fail(`missing MVP025 unit test token: ${token}`);
}

const e2eSource = read("e2e/intake-wizard.spec.ts");
for (const token of ["Diff Bundle Rollback Evidence Workspaceでempty valid failure", "bundle valid", "bundle failure", "rollback evidence", "dry-run status"]) {
  if (!e2eSource.includes(token)) fail(`missing E2E token: ${token}`);
}

const captureSource = read("scripts/capture-mvp024.mjs");
for (const token of ["bundle empty", "bundle valid", "bundle failure", "aidd-control-plane-mvp024", "AIDD_MVP024_APP_URL"]) {
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
console.log("checked MVP: AIDD Control Plane MVP 025 Dogfood Packet Markdown Review");
