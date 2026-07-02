import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const scenarios = ["empty", "valid", "failure", "timeout", "rate_limit"];
const requiredFiles = [
  "package.json",
  "app/page.tsx",
  "app/globals.css",
  "src/lib/intake.ts",
  "tests/intake.test.ts",
  "e2e/intake-wizard.spec.ts",
  "playwright.config.ts",
  "docker-compose.yml",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md",
  "mocks/ci-service/server.mjs",
  ...scenarios.map((scenario) => `mocks/ci-service/fixtures/${scenario}.json`),
  "scripts/mock-start.mjs",
  "scripts/mock-stop.mjs",
  "scripts/mock-doctor.mjs",
  "scripts/capture-mvp015.mjs",
  "scripts/capture-mvp016.mjs",
  "scripts/capture-mvp020.mjs",
  "scripts/capture-mvp021.mjs"
];
const workflowPath = path.resolve(root, "..", "..", "..", ".github", "workflows", "aidd-control-plane.yml");
const requiredScripts = ["lint", "typecheck", "test", "test:coverage", "build", "test:e2e", "doctor:aidd", "mock:start", "mock:stop", "mock:doctor", "capture:mvp015", "capture:mvp016", "capture:mvp020", "capture:mvp021"];
const requiredWorkflowGates = [
  "pnpm install --frozen-lockfile",
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run test:coverage",
  "pnpm run build",
  "pnpm run doctor:aidd",
  "pnpm run mock:doctor",
  "pnpm run test:e2e"
];
const requiredWorkflowArtifactPaths = [
  "coverage",
  "playwright-report",
  "test-results",
  "experiments/aidd-control-plane-mvp-021/artifacts/terminal"
];
const requiredCopy = [
  "AIDD Control Plane MVP 021",
  "Packet File Apply Planner",
  "planner empty",
  "planner valid",
  "planner failure",
  "AI_TASK_PACKET.md",
  "CODEX_PROMPT.md",
  "VERIFICATION_PLAN.md",
  "LEARNING_LOG.md",
  "Markdown見出し",
  "insert position",
  "rollback step",
  "target file不足",
  "insert position不足",
  "before/after差分不足",
  "rollback step不足",
  "review evidence不足",
  "Packet File Apply Planner Review Finding",
  "capture:mvp021",
  "aidd-control-plane-mvp021-empty.png",
  "aidd-control-plane-mvp021-valid.png",
  "aidd-control-plane-mvp021-failure.png",
  "aidd-control-plane-mvp021-terminal-evidence.png",
  "AIDD Control Plane MVP 020",
  "Spec Update Proposal Queue",
  "proposal empty",
  "proposal valid",
  "proposal failure",
  "target standard document",
  "target field",
  "acceptance criteria",
  "Codex prompt delta",
  "verification command",
  "対象文書が不足しています",
  "acceptance criteriaが不足しています",
  "verification commandが不足しています",
  "AI Task Packet Delta Apply Preview",
  "delta empty",
  "delta valid",
  "delta failure",
  "source proposal",
  "target packet section",
  "before summary",
  "after summary",
  "added acceptance criteria",
  "added verification commands",
  "Codex prompt patch",
  "rollback condition",
  "review checklist",
  "根拠finding不足",
  "target packet section不足",
  "verification command不足",
  "rollback condition不足",
  "standards/aidd-control-plane-mvp-v0.1.md",
  "AIDD-Spec v0.1",
  "Codex prompt deltaが不足しています",
  "capture:mvp020",
  "aidd-control-plane-mvp020-empty.png",
  "aidd-control-plane-mvp020-valid.png",
  "aidd-control-plane-mvp020-failure.png",
  "aidd-control-plane-mvp020-terminal-evidence.png",
  "AIDD Control Plane MVP 016",
  "CI Workflow Artifact Auditor",
  "Review Finding",
  "AI Task Packet Delta",
  "AIDD-Spec更新候補",
  "capture:mvp016",
  "AIDD Control Plane MVP 015",
  "fixture駆動",
  "Docker Compose経路",
  "Node fallback経路",
  "同一contract",
  "Mock CI Service",
  "NEXT_PUBLIC_MOCK_CI_SERVICE_URL",
  "http://127.0.0.1:4314",
  "手動Artifact Evidence Binder",
  "empty",
  "valid",
  "failure",
  "timeout",
  "rate_limit",
  "待機時間",
  "token scope見直し",
  "手動証跡添付",
  "次回AI Task Packet Delta",
  "Verification Run Tracker",
  "Artifact Evidence Binder",
  "CI Artifact Importer",
  "GitHub Actions Artifact Fetch Plan",
  "Evidence Gap Repair Planner",
  "Review Record",
  "Learning Log",
  "Delta Decision Review",
  "decision empty",
  "decision valid",
  "decision failure",
  "decision owner",
  "decision reason",
  "decided at",
  "next action",
  "review evidence",
  "rollback confirmed",
  "included in next packet",
  "判断者不足",
  "判断理由不足",
  "rollback確認不足",
  "採用なのにverification command不足",
  "却下なのに再発防止メモ不足",
  "Adopted Delta Markdown Exporter",
  "export empty",
  "export valid",
  "export failure",
  "Markdown section不足",
  "未採用delta",
  "採用済みdeltaだけ",
  "採用済みdeltaのMarkdown export",
  "Learning Logへ戻す未採用delta",
];
const requiredMockTokens = [
  "/health",
  "/state",
  "/__control/state",
  "readFileSync",
  "fixtures",
  "fixture-driven-mock-ci-service",
  "access-control-allow-origin",
  "mvp015"
];
const requiredDocsTokens = [
  "MVP 015",
  "fixture駆動",
  "Docker Compose経路",
  "Node fallback経路",
  "同一contract",
  "/health",
  "/state",
  "/__control/state",
  "mock:doctor",
  "rate_limit",
  "AIDD-Spec v0.1",
  "standards/aidd-control-plane-mvp-v0.1.md",
  "Verification Evidence",
  "Review Record",
  "Learning Log"
];
const ignoredDirs = new Set(["node_modules", ".next", "coverage", "playwright-report", "test-results"]);
const scannedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md", ".json", ".css", ".yml"]);
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
  if (packageJson.name !== "aidd-control-plane-mvp-021") fail(`unexpected package name: ${packageJson.name}`);
  for (const script of requiredScripts) {
    if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
  }
  if (Object.keys(packageJson.scripts ?? {}).some((script) => script.includes(`mvp${"014"}`))) fail("old capture script remains");
}

if (!existsSync(workflowPath)) {
  fail("missing workflow: .github/workflows/aidd-control-plane.yml");
} else {
  const workflowSource = readFileSync(workflowPath, "utf8");
  for (const token of [
    "AIDD Control Plane MVP 021",
    "experiments/aidd-control-plane-mvp-021/generated-repo",
    "pnpm exec playwright install --with-deps",
    "actions/upload-artifact@v4",
    "experiments-terminal-evidence"
  ]) {
    if (!workflowSource.includes(token)) fail(`missing workflow token: ${token}`);
  }
  for (const gate of requiredWorkflowGates) {
    if (!workflowSource.includes(gate)) fail(`missing workflow gate: ${gate}`);
  }
  for (const artifactPath of requiredWorkflowArtifactPaths) {
    if (!workflowSource.includes(artifactPath)) fail(`missing workflow artifact path: ${artifactPath}`);
  }
}

const files = walk(root);
const combined = files.map((file) => readFileSync(file, "utf8")).join("\n");

for (const copy of requiredCopy) {
  if (!combined.includes(copy)) fail(`missing required copy/token: ${copy}`);
}
for (const stale of [`MVP ${"014"}`, `mvp${"014"}`, `capture:mvp${"014"}`, `capture-mvp${"014"}`]) {
  if (combined.includes(stale)) fail(`stale previous MVP token remains: ${stale}`);
}

const mockServerPath = path.join(root, "mocks/ci-service/server.mjs");
if (existsSync(mockServerPath)) {
  const mockSource = readFileSync(mockServerPath, "utf8");
  for (const token of requiredMockTokens) {
    if (!mockSource.includes(token)) fail(`missing mock service contract token: ${token}`);
  }
}

for (const scenario of scenarios) {
  const fixturePath = path.join(root, "mocks/ci-service/fixtures", `${scenario}.json`);
  if (!existsSync(fixturePath)) continue;
  const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));
  for (const key of ["label", "runUrl", "owner", "repo", "runId", "commitSha", "workflow", "jobs", "artifacts", "issue", "repair", "promptDelta"]) {
    if (!(key in fixture)) fail(`fixture ${scenario}.json missing key: ${key}`);
  }
  if (!String(fixture.workflow).includes("mvp-015")) fail(`fixture ${scenario}.json workflow is not MVP 015`);
}

const composePath = path.join(root, "docker-compose.yml");
if (existsSync(composePath)) {
  const composeSource = readFileSync(composePath, "utf8");
  for (const token of ["mock-ci-service", "node mocks/ci-service/server.mjs", "4314:4314", "MOCK_CI_SERVICE_HOST", "0.0.0.0"]) {
    if (!composeSource.includes(token)) fail(`missing Docker Compose token: ${token}`);
  }
}

const appPath = path.join(root, "app/page.tsx");
if (existsSync(appPath)) {
  const appSource = readFileSync(appPath, "utf8");
  for (const token of ["fetch(`${mockCiServiceUrl}/state`", "fetch(`${mockCiServiceUrl}/__control/state`", "fixture駆動", "Docker Compose経路", "Node fallback経路", "同一contract", "rate_limit対応"]) {
    if (!appSource.includes(token)) fail(`missing UI mock integration token: ${token}`);
  }
  for (const token of ["CI Workflow Artifact Auditor", "auditor empty", "auditor valid", "auditor failure", "Review Finding", "AI Task Packet Delta", "AIDD-Spec更新候補"]) {
    if (!appSource.includes(token)) fail(`missing UI workflow auditor token: ${token}`);
  }
  for (const token of ["Spec Update Proposal Queue", "proposal empty", "proposal valid", "proposal failure", "target standard document", "acceptance criteria", "Codex prompt delta", "verification command"]) {
    if (!appSource.includes(token)) fail(`missing UI spec update proposal token: ${token}`);
  }
  for (const token of ["AI Task Packet Delta Apply Preview", "delta empty", "delta valid", "delta failure", "source proposal", "target packet section", "before summary", "after summary", "added acceptance criteria", "added verification commands", "Codex prompt patch", "rollback condition", "review checklist"]) {
    if (!appSource.includes(token)) fail(`missing UI delta apply preview token: ${token}`);
  }
  for (const token of ["Packet File Apply Planner", "planner empty", "planner valid", "planner failure", "AI_TASK_PACKET.md", "CODEX_PROMPT.md", "VERIFICATION_PLAN.md", "LEARNING_LOG.md", "Markdown見出し", "insert position", "rollback step", "review evidence", "Packet File Apply Planner Review Finding"]) {
    if (!appSource.includes(token)) fail(`missing UI packet file apply planner token: ${token}`);
  }
}

const e2ePath = path.join(root, "e2e/intake-wizard.spec.ts");
if (existsSync(e2ePath)) {
  const e2eSource = readFileSync(e2ePath, "utf8");
  for (const token of ["/__control/state", "rate_limit", "Mock CI Service: valid", "60秒待機", "fixture駆動", "Docker Compose経路"]) {
    if (!e2eSource.includes(token)) fail(`missing E2E mock control assertion: ${token}`);
  }
  for (const token of ["CI Workflow Artifact Auditor: empty", "auditor valid", "CI Workflow Artifact Auditor: valid", "auditor failure", "CI Workflow Artifact Auditor: failure", "AIDD-Spec更新候補"]) {
    if (!e2eSource.includes(token)) fail(`missing E2E workflow auditor assertion: ${token}`);
  }
  for (const token of ["Spec Update Proposal Queue: empty", "proposal valid", "Spec Update Proposal Queue: valid", "proposal failure", "Spec Update Proposal Queue: failure", "次回のCodex Prompt Delta"]) {
    if (!e2eSource.includes(token)) fail(`missing E2E spec update proposal assertion: ${token}`);
  }
  for (const token of ["AI Task Packet Delta Apply Preview: empty", "delta valid", "AI Task Packet Delta Apply Preview: valid", "delta failure", "AI Task Packet Delta Apply Preview: failure", "Codex prompt patch", "根拠finding不足"]) {
    if (!e2eSource.includes(token)) fail(`missing E2E delta apply preview assertion: ${token}`);
  }
  for (const token of ["Packet File Apply Planner: empty", "planner valid", "Packet File Apply Planner: valid", "planner failure", "Packet File Apply Planner: failure", "target file不足", "未採用delta delta-mvp019-bad-002 が混入しています"]) {
    if (!e2eSource.includes(token)) fail(`missing E2E packet file apply planner assertion: ${token}`);
  }
}

const playwrightConfigPath = path.join(root, "playwright.config.ts");
if (existsSync(playwrightConfigPath)) {
  const playwrightConfig = readFileSync(playwrightConfigPath, "utf8");
  for (const browser of ["chromium", "firefox", "webkit"]) {
    if (!playwrightConfig.includes(`name: "${browser}"`)) fail(`missing Playwright browser project: ${browser}`);
  }
  for (const token of ["timeout: 120_000", "expect: { timeout: 90_000 }", "workers: 1", "mocks/ci-service/server.mjs"]) {
    if (!playwrightConfig.includes(token)) fail(`missing Playwright stability/mock setting: ${token}`);
  }
}

for (const doc of ["docs/product-brief.md", "docs/verification-plan.md", "docs/review-record.md", "docs/learning-log.md"]) {
  const docPath = path.join(root, doc);
  if (!existsSync(docPath)) continue;
  const text = readFileSync(docPath, "utf8");
  for (const token of requiredDocsTokens) {
    if (!text.includes(token)) fail(`missing docs MVP 015 token in ${doc}: ${token}`);
  }
}

const capturePath = path.join(root, "scripts/capture-mvp015.mjs");
if (existsSync(capturePath)) {
  const captureSource = readFileSync(capturePath, "utf8");
  for (const token of ["artifacts", "screenshots", "empty", "valid", "failure", "timeout", "rate_limit", "terminal-evidence", "aidd-control-plane-mvp015"]) {
    if (!captureSource.includes(token)) fail(`missing capture:mvp015 token: ${token}`);
  }
}

const captureMvp016Path = path.join(root, "scripts/capture-mvp016.mjs");
if (existsSync(captureMvp016Path)) {
  const captureSource = readFileSync(captureMvp016Path, "utf8");
  for (const token of ["artifacts", "screenshots", "auditor empty", "auditor valid", "auditor failure", "terminal-evidence", "aidd-control-plane-mvp016", "AIDD_MVP016_APP_URL"]) {
    if (!captureSource.includes(token)) fail(`missing capture:mvp016 token: ${token}`);
  }
}

const captureMvp019Path = path.join(root, "scripts/capture-mvp020.mjs");
if (existsSync(captureMvp019Path)) {
  const captureSource = readFileSync(captureMvp019Path, "utf8");
  for (const token of ["artifacts", "screenshots", "decision empty", "decision valid", "decision failure", "terminal-evidence", "aidd-control-plane-mvp020", "AIDD_MVP020_APP_URL"]) {
    if (!captureSource.includes(token)) fail(`missing capture:mvp020 token: ${token}`);
  }
}

const captureMvp021Path = path.join(root, "scripts/capture-mvp021.mjs");
if (existsSync(captureMvp021Path)) {
  const captureSource = readFileSync(captureMvp021Path, "utf8");
  for (const token of ["artifacts", "screenshots", "planner empty", "planner valid", "planner failure", "terminal-evidence", "aidd-control-plane-mvp021", "AIDD_MVP021_APP_URL"]) {
    if (!captureSource.includes(token)) fail(`missing capture:mvp021 token: ${token}`);
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
console.log("checked mock scenarios: empty, valid, failure, timeout, rate_limit");
