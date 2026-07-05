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
  "scripts/capture-mvp028.mjs",
  "scripts/capture-mvp029.mjs",
  "scripts/capture-mvp030.mjs",
  "scripts/capture-mvp031.mjs",
  "scripts/capture-mvp032.mjs",
  "scripts/capture-mvp033.mjs",
  "scripts/capture-mvp035.mjs",
  "scripts/capture-mvp036.mjs",
  "scripts/capture-mvp037.mjs",
  "scripts/capture-mvp038.mjs",
  "scripts/capture-mvp040.mjs",
  "scripts/capture-mvp041.mjs",
  "scripts/capture-mvp042.mjs",
  "scripts/capture-mvp043.mjs",
  "docs/product-brief.md",
  "docs/verification-plan.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];
const requiredScripts = ["lint", "typecheck", "test", "test:coverage", "build", "test:e2e", "doctor:aidd", "mock:start", "mock:stop", "mock:doctor", "capture:mvp024", "capture:mvp025", "capture:mvp026", "capture:mvp027", "capture:mvp028", "capture:mvp029", "capture:mvp030", "capture:mvp031", "capture:mvp032", "capture:mvp033", "capture:mvp035", "capture:mvp036", "capture:mvp037", "capture:mvp038", "capture:mvp040", "capture:mvp041", "capture:mvp042", "capture:mvp043"];
const requiredCopy = [
  "Diff Bundle Decision Ledger",
  "diff decision valid",
  "diff decision failure",
  "未判断",
  "理由不足",
  "証跡不足",
  "rollback未確認",
  "採用済みverification不足",
  "standards/aidd-control-plane-mvp-v0.1.md",
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
  "capture:mvp028",
  "aidd-control-plane-mvp028-empty.png",
  "aidd-control-plane-mvp028-valid.png",
  "aidd-control-plane-mvp028-failure.png",
  "aidd-control-plane-mvp028-terminal-evidence.png",
  "Adopted Bundle Exporter",
  "exporter valid",
  "exporter failure",
  "却下bundle混入",
  "保留bundle混入",
  "未判断bundle混入",
  "review evidence不足",
  "rollback condition不足",
  "verification command不足",
  "AI Task Packet",
  "capture:mvp029",
  "aidd-control-plane-mvp029-empty.png",
  "aidd-control-plane-mvp029-valid.png",
  "aidd-control-plane-mvp029-failure.png",
  "aidd-control-plane-mvp029-terminal-evidence.png",
  "Exported Packet Preflight Reviewer",
  "preflight valid",
  "preflight failure",
  "未採用bundle混入",
  "Firefox除外",
  "浅い検証",
  "local path/host/private network混入",
  "rollback不足",
  "evidence不足",
  "capture:mvp030",
  "aidd-control-plane-mvp030-empty.png",
  "aidd-control-plane-mvp030-valid.png",
  "aidd-control-plane-mvp030-failure.png",
  "aidd-control-plane-mvp030-terminal-evidence.png",
  "Run Authorization Gate",
  "approver",
  "authorization reason",
  "Codex command",
  "sandbox mode",
  "検証コマンド",
  "3ブラウザ",
  "証跡保存先",
  "rollback",
  "preflight statusがvalidでない",
  "approver不足",
  "authorization reason不足",
  "Codex command不足",
  "sandbox mode不足",
  "local path / host / private network / private network URL混入",
  "evidence path不足",
  "rollback plan不足",
  "capture:mvp031",
  "aidd-control-plane-mvp031-empty.png",
  "aidd-control-plane-mvp031-valid.png",
  "aidd-control-plane-mvp031-failure.png",
  "aidd-control-plane-mvp031-terminal-evidence.png",
  "Codex Run Queue",
  "MVP 032: Codex Run Queue",
  "queue valid",
  "queue failure",
  "waiting",
  "running",
  "succeeded",
  "failed",
  "evidence_missing",
  "Run Authorization Gate valid由来でない",
  "危険なcommand",
  "terminal evidence不足",
  "screenshot evidence不足",
  "playwright evidence不足",
  "retry policy不足",
  "rollback不足",
  "aidd-control-plane-mvp032-empty.png",
  "aidd-control-plane-mvp032-valid.png",
  "aidd-control-plane-mvp032-failure.png",
  "aidd-control-plane-mvp032-terminal-evidence.png",
  "Run Result Review Synthesizer",
  "MVP 033: Run Result Review Synthesizer",
  "review valid",
  "review failure",
  "sourceRunId",
  "outcome",
  "score",
  "terminal_evidence",
  "screenshot_evidence",
  "browser_coverage",
  "doctor_gate",
  "privacy",
  "prompt_delta",
  "neededUpstreamInfo",
  "standardUpdate",
  "codexPromptDelta",
  "doctor:aidd未実行",
  "rollback未確認",
  "prompt delta不足",
  "aidd-control-plane-mvp033-empty.png",
  "aidd-control-plane-mvp033-valid.png",
  "aidd-control-plane-mvp033-failure.png",
  "aidd-control-plane-mvp033-terminal-evidence.png",
  "Verification Run Detail",
  "detail valid",
  "detail failure",
  "sourceQueueItemId",
  "command別exit code",
  "artifact path",
  "failureCategory",
  "Review Finding draft",
  "commit SHA不足",
  "command別detail不足",
  "Next Increment Planner",
  "increment valid",
  "increment failure",
  "recommendedIncrement",
  "priorityReason",
  "targetArtifacts",
  "acceptanceCriteria",
  "requiredEvidence",
  "codexPromptDraft",
  "noteArticleAngle",
  "aidd-control-plane-mvp035-empty.png",
  "aidd-control-plane-mvp035-valid.png",
  "aidd-control-plane-mvp035-failure.png",
  "aidd-control-plane-mvp035-terminal-evidence.png",
  "Evidence Repair Delta Generator",
  "repair valid",
  "repair failure",
  "failed repair delta",
  "evidence_missing repair delta",
  "timeout repair delta",
  "AI Task Packet delta",
  "Codex prompt delta",
  "rollback condition",
  "Learning Log note",
  "repair instruction",
  "failure screenshot不足",
  "aidd-control-plane-mvp036-empty.png",
  "aidd-control-plane-mvp036-valid.png",
  "aidd-control-plane-mvp036-failure.png",
  "aidd-control-plane-mvp036-terminal-evidence.png",
  "Repair Delta Priority Decision Workspace",
  "MVP 037: Repair Delta Priority Decision Workspace",
  "decision valid",
  "decision failure",
  "adopted",
  "deferred",
  "rejected",
  "採用",
  "保留",
  "却下",
  "採用済みrepair deltaだけ",
  "未採用repair deltaがAI Task Packetへ混入",
  "未採用repair deltaがCodex promptへ混入",
  "source generator不足",
  "採用判断不足",
  "保留判断不足",
  "却下判断不足",
  "aidd-control-plane-mvp037-empty.png",
  "aidd-control-plane-mvp037-valid.png",
  "aidd-control-plane-mvp037-failure.png",
  "aidd-control-plane-mvp037-terminal-evidence.png",
  "Execution Priority Set Builder",
  "execution valid",
  "execution failure",
  "execute_now",
  "next_increment",
  "learning_log",
  "Codex prompt preview",
  "優先順位重複",
  "実行予算不足",
  "検証コマンド不足",
  "未採用delta混入",
  "execute_now以外がCodex prompt previewへ混入",
  "aidd-control-plane-mvp038-empty.png",
  "aidd-control-plane-mvp038-valid.png",
  "aidd-control-plane-mvp038-failure.png",
  "aidd-control-plane-mvp038-terminal-evidence.png",
  "One-Run Handoff Pack Reviewer",
  "MVP 040: Codex Run Start Receipt Auditor",
  "handoff valid",
  "handoff failure",
  "Codex Run Start Receipt Auditor",
  "receipt valid",
  "receipt failure",
  "source handoff pack id",
  "started at",
  "operator",
  "evidence root",
  "required screenshots",
  "rollback stop condition",
  "危険command",
  "sandbox不足",
  "evidence root不足",
  "terminal screenshot不足",
  "failure screenshot不足",
  "standards/aidd-control-plane-mvp-v0.1.md",
  "private URL混入",
  "source execution set",
  "execute_now delta id",
  "AI Task Packet patch",
  "Codex prompt",
  "verification commands",
  "browser projects",
  "Chromium / Firefox / WebKit",
  "required evidence",
  "terminal evidence不足",
  "empty screenshot evidence不足",
  "valid screenshot evidence不足",
  "failure screenshot evidence不足",
  "Playwright report",
  "rollback condition",
  "note article angle",
  "AIDD Control Plane MVP v0.1",
  "source execution set / execute_now delta id不足",
  "AI Task Packet patch不足",
  "Codex prompt不足",
  "Firefox除外または1ブラウザだけの浅い検証",
  "local path / host / private network / private network URL混入",
  "aidd-control-plane-mvp040-empty.png",
  "aidd-control-plane-mvp040-valid.png",
  "aidd-control-plane-mvp040-failure.png",
  "aidd-control-plane-mvp040-terminal-evidence.png",
  "Verification Evidence Receipt Binder",
  "binder empty",
  "binder valid",
  "binder failure",
  "source run start receipt",
  "command別exit code",
  "duration",
  "terminal log",
  "artifact path",
  "failure category",
  "repair instruction",
  "source不足",
  "command別detail不足",
  "exit code不足",
  "artifact不足",
  "失敗分類不足",
  "修正指示不足",
  "doctor:aidd不足",
  "local path/host/private network URL混入",
  "aidd-control-plane-mvp041-empty.png",
  "aidd-control-plane-mvp041-valid.png",
  "aidd-control-plane-mvp041-failure.png",
  "aidd-control-plane-mvp041-terminal-evidence.png",
  "Review Record Receipt Synthesizer",
  "MVP042",
  "review empty",
  "Review Record receipt",
  "score根拠",
  "review findings",
  "finding分類不足",
  "needed upstream info不足",
  "standard update不足",
  "AI Task Packet delta不足",
  "Codex prompt delta不足",
  "verification command不足",
  "Learning Log接続不足",
  "terminal evidence不足",
  "failure screenshot不足",
  "aidd-control-plane-mvp042-empty.png",
  "aidd-control-plane-mvp042-valid.png",
  "aidd-control-plane-mvp042-failure.png",
  "aidd-control-plane-mvp042-terminal-evidence.png",
  "Review Finding Action Queue",
  "MVP043",
  "action empty",
  "action valid",
  "action failure",
  "source review id",
  "queue id",
  "execute_now",
  "next_increment",
  "learning_log",
  "priority reason不足",
  "lane不足",
  "required evidence不足",
  "execute_now以外のprompt混入",
  "aidd-control-plane-mvp043-empty.png",
  "aidd-control-plane-mvp043-valid.png",
  "aidd-control-plane-mvp043-failure.png",
  "aidd-control-plane-mvp043-terminal-evidence.png",
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
if (packageJson.name !== "aidd-control-plane-mvp-043") fail(`unexpected package name: ${packageJson.name}`);
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) fail(`missing script: ${script}`);
}

const combinedFiles = Array.from(new Set([...requiredFiles, "scripts/doctor-aidd.mjs", "scripts/capture-mvp027.mjs", "scripts/capture-mvp028.mjs", "scripts/capture-mvp029.mjs", "scripts/capture-mvp030.mjs", "scripts/capture-mvp031.mjs", "scripts/capture-mvp032.mjs", "scripts/capture-mvp033.mjs", "scripts/capture-mvp035.mjs", "scripts/capture-mvp036.mjs", "scripts/capture-mvp037.mjs", "scripts/capture-mvp038.mjs", "scripts/capture-mvp040.mjs", "scripts/capture-mvp041.mjs", "scripts/capture-mvp042.mjs", "scripts/capture-mvp043.mjs", "package.json"]));
const combined = combinedFiles.filter((file) => existsSync(path.join(root, file))).map(read).join("\n");
for (const token of requiredCopy) {
  if (!combined.includes(token)) fail(`missing required copy/token: ${token}`);
}

const appSource = read("app/page.tsx");
for (const token of ["createValidDiffBundleRollbackEvidenceWorkspace", "evaluateDiffBundleRollbackEvidenceWorkspace", "Diff Bundle & Rollback Evidence Workspace", "bundle valid", "bundle failure", "reviewer approval"]) {
  if (!appSource.includes(token)) fail(`missing MVP027 UI token: ${token}`);
}
for (const token of ["createValidDiffBundleDecisionLedger", "evaluateDiffBundleDecisionLedger", "Diff Bundle Decision Ledger", "diff decision valid", "diff decision failure", "Review Record", "Verification Evidence", "Learning Log", "Rollback Plan"]) {
  if (!appSource.includes(token)) fail(`missing MVP028 UI token: ${token}`);
}
for (const token of ["createValidAdoptedBundleExporter", "evaluateAdoptedBundleExporter", "Adopted Bundle Exporter", "exporter valid", "exporter failure", "AI Task Packet", "Verification Evidence", "Review Record", "Learning Log", "Rollback Plan"]) {
  if (!appSource.includes(token)) fail(`missing MVP029 UI token: ${token}`);
}
for (const token of ["createValidExportedPacketPreflightReviewer", "evaluateExportedPacketPreflightReviewer", "Exported Packet Preflight Reviewer", "preflight valid", "preflight failure", "Firefox除外", "浅い検証", "local path", "rollback不足", "evidence不足"]) {
  if (!appSource.includes(token)) fail(`missing MVP030 UI token: ${token}`);
}
for (const token of ["createValidRunAuthorizationGate", "evaluateRunAuthorizationGate", "Run Authorization Gate", "approver", "authorization reason", "Codex command", "sandbox mode", "検証コマンド", "3ブラウザ", "証跡保存先", "rollback", "AIDD-Spec接続", "実行前に止めるべきReview Finding"]) {
  if (!appSource.includes(token)) fail(`missing MVP031 UI token: ${token}`);
}
for (const token of ["createValidCodexRunQueue", "evaluateCodexRunQueue", "Codex Run Queue", "MVP 032: Codex Run Queue", "queue valid", "queue failure", "waiting", "running", "succeeded", "evidence_missing", "検証コマンド", "3ブラウザ", "証跡", "retry policy", "rollback", "AIDD-Spec接続"]) {
  if (!appSource.includes(token)) fail(`missing MVP032 UI token: ${token}`);
}
for (const token of ["createValidRunResultReview", "evaluateRunResultReview", "Run Result Review Synthesizer", "review valid", "review failure", "sourceRunId", "outcome", "score", "Review Finding", "AI Task Packet delta", "Codex prompt delta", "Verification command", "Learning Log", "neededUpstreamInfo", "standardUpdate", "codexPromptDelta"]) {
  if (!appSource.includes(token)) fail(`missing MVP033 UI token: ${token}`);
}
for (const token of ["createValidVerificationRunDetail", "evaluateVerificationRunDetail", "Verification Run Detail", "detail valid", "detail failure", "sourceQueueItemId", "command別exit code", "artifact path", "failureCategory", "Review Finding drafts", "commit SHA不足", "command別detail不足"]) {
  if (!appSource.includes(token)) fail(`missing MVP035 UI token: ${token}`);
}
for (const token of ["createValidEvidenceRepairDeltaGenerator", "evaluateEvidenceRepairDeltaGenerator", "Evidence Repair Delta Generator", "repair valid", "repair failure", "failed", "evidence_missing", "timeout", "AI Task Packet delta", "Codex prompt delta", "rollback condition", "Learning Log note", "repair instruction", "failure screenshot不足"]) {
  if (!appSource.includes(token)) fail(`missing MVP036 UI token: ${token}`);
}
for (const token of ["createValidRepairDeltaPriorityDecisionWorkspace", "evaluateRepairDeltaPriorityDecisionWorkspace", "Repair Delta Priority Decision Workspace", "MVP 037: Repair Delta Priority Decision Workspace", "priority valid", "priority failure", "adopted", "deferred", "rejected", "採用済みrepair deltaだけ", "AIDD-Spec v0.1", "Review Record", "Learning Log", "Verification Evidence", "未判断", "理由不足", "証跡不足", "rollback不足", "Firefox除外", "local path/host/private network混入"]) {
  if (!appSource.includes(token)) fail(`missing MVP037 UI token: ${token}`);
}
for (const token of ["createValidExecutionPrioritySetBuilder", "evaluateExecutionPrioritySetBuilder", "Execution Priority Set Builder", "execution valid", "execution failure", "execute_now", "next_increment", "learning_log", "Codex prompt preview", "優先順位重複", "実行予算不足", "検証コマンド不足", "未採用delta混入", "Firefox除外", "local path/host/private network混入"]) {
  if (!appSource.includes(token)) fail(`missing MVP038 UI token: ${token}`);
}
for (const token of ["createValidCodexRunStartReceiptAuditor", "evaluateCodexRunStartReceiptAuditor", "Codex Run Start Receipt Auditor", "receipt valid", "receipt failure", "source handoff pack id", "Codex command", "sandbox mode", "started at", "operator", "evidence root", "検証継承", "Chromium / Firefox / WebKit", "required screenshots", "rollback stop condition", "AIDD-Spec v0.1", "standards/aidd-control-plane-mvp-v0.1.md"]) {
  if (!appSource.includes(token)) fail(`missing MVP040 UI token: ${token}`);
}
for (const token of ["createValidVerificationEvidenceReceiptBinder", "evaluateVerificationEvidenceReceiptBinder", "Verification Evidence Receipt Binder", "binder empty", "binder valid", "binder failure", "source run start receipt", "command details", "terminal log", "artifact path", "failure category", "repair instruction", "Chromium / Firefox / WebKit", "AIDD-Spec接続"]) {
  if (!appSource.includes(token)) fail(`missing MVP041 UI token: ${token}`);
}
for (const token of ["createValidReviewRecordReceiptSynthesizer", "evaluateReviewRecordReceiptSynthesizer", "Review Record Receipt Synthesizer", "review empty", "review valid", "review failure", "score根拠", "finding", "needed upstream info", "standard update", "AI Task Packet delta", "Codex prompt delta", "Verification command", "Learning Log", "evidence references", "Chromium / Firefox / WebKit", "AIDD-Spec接続"]) {
  if (!appSource.includes(token)) fail(`missing MVP042 UI token: ${token}`);
}
for (const token of ["createValidReviewFindingActionQueue", "evaluateReviewFindingActionQueue", "Review Finding Action Queue", "MVP043", "action empty", "action valid", "action failure", "source review id", "queue id", "finding category", "severity", "execute_now", "next_increment", "learning_log", "priority reason", "AI Task Packet patch", "Codex prompt patch", "verification commands", "required evidence", "rollback condition", "Codex prompt preview", "next_increment と learning_log はCodex prompt previewに混ぜません", "AIDD-Spec connection"]) {
  if (!appSource.includes(token)) fail(`missing MVP043 UI token: ${token}`);
}

const testSource = read("tests/intake.test.ts");
for (const token of ["Diff Bundle Rollback Evidence Workspaceのvalidサンプル", "createValidDiffBundleRollbackEvidenceWorkspace", "危険なtarget path（../）", "危険なtarget path（絶対パス）", "reviewer未承認"]) {
  if (!testSource.includes(token)) fail(`missing MVP027 unit test token: ${token}`);
}
for (const token of ["Diff Bundle Decision Ledgerのvalidサンプル", "createValidDiffBundleDecisionLedger", "未判断", "理由不足", "証跡不足", "rollback未確認", "採用済みverification不足"]) {
  if (!testSource.includes(token)) fail(`missing MVP028 unit test token: ${token}`);
}
for (const token of ["Adopted Bundle Exporterのvalidサンプル", "createValidAdoptedBundleExporter", "却下bundle混入", "保留bundle混入", "未判断bundle混入", "review evidence不足", "rollback condition不足", "verification command不足", "ローカルパスやhost名の混入", "AIDD-Spec接続不足"]) {
  if (!testSource.includes(token)) fail(`missing MVP029 unit test token: ${token}`);
}
for (const token of ["Exported Packet Preflight Reviewerのvalidサンプル", "createValidExportedPacketPreflightReviewer", "未採用bundle混入", "Firefox除外", "浅い検証", "local path/host/private network混入", "rollback不足", "evidence不足", "AIDD-Spec接続不足"]) {
  if (!testSource.includes(token)) fail(`missing MVP030 unit test token: ${token}`);
}
for (const token of ["Run Authorization Gateはempty valid failure", "createValidRunAuthorizationGate", "preflight statusがvalidでない", "approver不足", "authorization reason不足", "Codex command: 危険なtarget path", "sandbox mode不足", "Firefox除外", "shallow verification", "local path / host / private network / private network URL混入", "evidence path不足", "rollback plan不足", "AIDD-Spec接続不足"]) {
  if (!testSource.includes(token)) fail(`missing MVP031 unit test token: ${token}`);
}
for (const token of ["Codex Run Queueはempty valid failure", "createValidCodexRunQueue", "Run Authorization Gate valid由来でない", "危険なcommand", "Firefox除外", "浅い検証", "screenshot evidence不足", "playwright evidence不足", "retry policy不足", "rollback不足", "AIDD-Spec接続不足"]) {
  if (!testSource.includes(token)) fail(`missing MVP032 unit test token: ${token}`);
}
for (const token of ["Run Result Review Synthesizerはempty valid failure", "createValidRunResultReview", "terminal_evidence", "screenshot_evidence", "browser_coverage", "doctor_gate", "rollback", "privacy", "prompt_delta", "neededUpstreamInfo", "standardUpdate", "codexPromptDelta"]) {
  if (!testSource.includes(token)) fail(`missing MVP033 unit test token: ${token}`);
}
for (const token of ["Verification Run Detailはempty valid failure", "createValidVerificationRunDetail", "createFailureVerificationRunDetail", "command別exit code", "artifact path", "failureCategory", "commit SHA不足", "Firefox除外", "command別detail不足", "Review Finding draft不足", "Rollback Plan接続不足"]) {
  if (!testSource.includes(token)) fail(`missing MVP035 unit test token: ${token}`);
}
for (const token of ["Evidence Repair Delta Generatorはfailed evidence_missing timeout", "createValidEvidenceRepairDeltaGenerator", "createFailureEvidenceRepairDeltaGenerator", "failed", "evidence_missing", "timeout", "AI Task Packet delta", "Codex prompt delta", "rollback condition", "Learning Log note", "repair instruction不足", "failure screenshot不足", "local path / host / private network混入"]) {
  if (!testSource.includes(token)) fail(`missing MVP036 unit test token: ${token}`);
}
for (const token of ["Repair Delta Priority Decision Workspaceは採用済みrepair deltaだけ", "createValidRepairDeltaPriorityDecisionWorkspace", "createFailureRepairDeltaPriorityDecisionWorkspace", "adopted", "deferred", "rejected", "未判断", "理由不足", "証跡不足", "rollback不足", "Firefox除外", "未採用repair deltaがAI Task Packetへ混入", "未採用repair deltaがCodex promptへ混入", "local path/host/private network混入"]) {
  if (!testSource.includes(token)) fail(`missing MVP037 unit test token: ${token}`);
}
for (const token of ["Execution Priority Set Builderはexecute_nowだけ", "createValidExecutionPrioritySetBuilder", "createFailureExecutionPrioritySetBuilder", "execute_now", "next_increment", "learning_log", "Codex prompt preview", "優先順位重複", "実行予算不足", "検証コマンド不足", "rollback不足", "未採用delta混入", "Firefox除外", "local path/host/private network混入"]) {
  if (!testSource.includes(token)) fail(`missing MVP038 unit test token: ${token}`);
}
for (const token of ["Codex Run Start Receipt Auditorは実行開始レシート", "createValidCodexRunStartReceiptAuditor", "createFailureCodexRunStartReceiptAuditor", "codex exec --sandbox danger-full-access", "sandbox不足", "evidence root不足", "Firefox除外", "aidd-control-plane-mvp040-failure.png不足", "aidd-control-plane-mvp040-terminal-evidence.png不足", "terminal screenshot不足", "failure screenshot不足", "rollback不足", "standards/aidd-control-plane-mvp-v0.1.md接続不足", "local path / host / private network URL混入"]) {
  if (!testSource.includes(token)) fail(`missing MVP040 unit test token: ${token}`);
}
for (const token of ["Verification Evidence Receipt Binderは検証証跡レシート", "createValidVerificationEvidenceReceiptBinder", "createFailureVerificationEvidenceReceiptBinder", "source不足", "command別detail不足", "exit code不足", "artifact不足", "失敗分類不足", "修正指示不足", "doctor:aidd不足", "aidd-control-plane-mvp041-terminal-evidence.png", "local path/host/private network URL混入"]) {
  if (!testSource.includes(token)) fail(`missing MVP041 unit test token: ${token}`);
}
for (const token of ["Review Record Receipt SynthesizerはReview Record receipt", "createValidReviewRecordReceiptSynthesizer", "createFailureReviewRecordReceiptSynthesizer", "source不足", "score根拠不足", "finding分類不足", "needed upstream info不足", "standard update不足", "AI Task Packet delta不足", "Codex prompt delta不足", "verification command不足", "Learning Log接続不足", "aidd-control-plane-mvp042-failure.png", "local path/host/private network URL混入"]) {
  if (!testSource.includes(token)) fail(`missing MVP042 unit test token: ${token}`);
}
for (const token of ["Review Finding Action QueueはReview Findingを次の行動キュー", "createValidReviewFindingActionQueue", "createFailureReviewFindingActionQueue", "source review receipt", "finding list", "priority rule", "verification command", "evidence requirement", "execute_now", "next_increment", "learning_log", "priority reason不足", "lane不足", "required evidence不足", "terminal evidence不足", "failure screenshot不足", "execute_now以外のprompt混入", "AIDD-Spec接続不足", "local path / host / private network URL混入"]) {
  if (!testSource.includes(token)) fail(`missing MVP043 unit test token: ${token}`);
}

const e2eSource = read("e2e/intake-wizard.spec.ts");
for (const token of ["Diff Bundle Rollback Evidence Workspaceでempty valid failure", "bundle valid", "bundle failure", "source apply plan / patch id", "ローカルパスやhost名の混入"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP027 E2E token: ${token}`);
}
for (const token of ["Diff Bundle Decision Ledgerでempty valid failure", "diff decision valid", "diff decision failure", "standards/aidd-control-plane-mvp-v0.1.md", "採用済みverification不足"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP028 E2E token: ${token}`);
}
for (const token of ["Adopted Bundle Exporterでempty valid failure", "exporter valid", "exporter failure", "却下bundle混入", "保留bundle混入", "未判断bundle混入", "AIDD-Spec接続不足"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP029 E2E token: ${token}`);
}
for (const token of ["Exported Packet Preflight Reviewerでempty valid failure", "preflight valid", "preflight failure", "Firefox除外", "浅い検証", "local path/host/private network混入", "rollback不足", "evidence不足"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP030 E2E token: ${token}`);
}
for (const token of ["Run Authorization Gateでempty valid failure", "valid", "failure", "approver", "authorization reason", "Codex command", "sandbox mode", "検証コマンド", "3ブラウザ", "証跡保存先", "実行前に止めるべきReview Finding", "preflight statusがvalidでない"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP031 E2E token: ${token}`);
}
for (const token of ["Codex Run Queueでempty valid failure", "queue valid", "queue failure", "queue-mvp032-waiting", "queue-mvp032-running", "queue-mvp032-succeeded", "Run Authorization Gate valid由来でない", "危険なcommand", "Firefox除外", "浅い検証", "screenshot evidence不足", "playwright evidence不足", "rollback不足"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP032 E2E token: ${token}`);
}
for (const token of ["Run Result Review Synthesizerでempty valid failure", "review valid", "review failure", "queue-mvp032-succeeded", "AI Task Packet delta", "Codex prompt delta", "Verification command", "Learning Log", "terminal_evidence", "screenshot_evidence", "browser_coverage", "doctor_gate", "privacy", "prompt_delta"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP033 E2E token: ${token}`);
}
for (const token of ["Verification Run Detailでempty valid failure", "detail valid", "detail failure", "command別証跡", "terminalEvidencePath", "Command details", "exit code 0", "artifact path", "commit SHA不足", "Firefox除外", "command別detail不足"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP035 E2E token: ${token}`);
}
for (const token of ["Evidence Repair Delta Generatorでfailed evidence_missing timeout", "repair valid", "repair failure", "repair-delta-failed-command", "repair-delta-evidence-missing", "repair-delta-timeout", "AI Task Packet delta", "Codex prompt delta", "rollback condition", "Learning Log note", "terminal evidence不足", "failure screenshot不足", "AIDD-Spec接続不足"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP036 E2E token: ${token}`);
}
for (const token of ["Repair Delta Priority Decision Workspaceで採用・保留・却下", "priority valid", "priority failure", "repair-delta-failed-command: adopted", "repair-delta-evidence-missing: deferred", "repair-delta-timeout: rejected", "採用済みrepair deltaだけを次回へ進める", "AIDD-Spec v0.1", "Review Record", "Learning Log", "Verification Evidence", "未判断", "理由不足", "証跡不足", "rollback不足", "Firefox除外", "local path/host/private network混入"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP037 E2E token: ${token}`);
}
for (const token of ["Execution Priority Set Builderでexecute_nowだけ", "execution valid", "execution failure", "repair-delta-failed-command: execute_now", "repair-delta-evidence-missing: next_increment", "repair-delta-timeout: learning_log", "Codex prompt preview", "優先順位重複", "実行予算不足", "検証コマンド不足", "rollback不足", "未採用delta混入", "Firefox除外", "local path/host/private network混入"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP038 E2E token: ${token}`);
}
for (const token of ["Codex Run Start Receipt Auditorで実行開始レシート", "receipt valid", "receipt failure", "source handoff pack id", "Codex command", "sandbox mode", "started at", "operator", "検証継承", "証跡保存先", "rollback停止条件", "Receipt AIDD-Spec接続", "Chromium / Firefox / WebKit", "aidd-control-plane-mvp040-terminal-evidence.png", "危険command", "sandbox不足", "evidence root不足", "Firefox除外", "terminal screenshot不足", "failure screenshot不足", "standards/aidd-control-plane-mvp-v0.1.md接続不足", "local path / host / private network URL混入"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP040 E2E token: ${token}`);
}
for (const token of ["Verification Evidence Receipt Binderで検証証跡レシート", "binder valid", "binder failure", "source run start receipt", "terminal log", "artifact path", "Chromium / Firefox / WebKit", "aidd-control-plane-mvp041-empty.png", "aidd-control-plane-mvp041-valid.png", "aidd-control-plane-mvp041-failure.png", "aidd-control-plane-mvp041-terminal-evidence.png", "source不足", "command別detail不足", "exit code不足", "artifact不足", "失敗分類不足", "修正指示不足", "doctor:aidd不足", "local path/host/private network URL混入"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP041 E2E token: ${token}`);
}
for (const token of ["Review Record Receipt SynthesizerでReview Record receipt", "review valid", "review failure", "score根拠", "needed upstream info", "standard update", "AI Task Packet delta", "Codex prompt delta", "Verification command", "Learning Log", "evidence references", "aidd-control-plane-mvp042-terminal-evidence.png", "source不足", "score根拠不足", "finding分類不足", "Firefox除外", "terminal evidence不足", "failure screenshot不足", "local path/host/private network URL混入"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP042 E2E token: ${token}`);
}
for (const token of ["Review Finding Action QueueでReview Findingを行動キュー", "action valid", "action failure", "action-mvp043-execute-now-001", "action-mvp043-next-increment-001", "action-mvp043-learning-log-001", "source review receipt / finding list / priority rule / verification command / evidence requirement", "Codex prompt preview", "priority reason不足", "lane不足", "required evidence不足", "Firefox除外", "terminal evidence不足", "failure screenshot不足", "execute_now以外のprompt混入", "local path / host / private network URL混入"]) {
  if (!e2eSource.includes(token)) fail(`missing MVP043 E2E token: ${token}`);
}

const captureMvp027Source = read("scripts/capture-mvp027.mjs");
for (const token of ["bundle valid", "bundle failure", "aidd-control-plane-mvp027", "AIDD_MVP027_APP_URL"]) {
  if (!captureMvp027Source.includes(token)) fail(`missing MVP027 capture token: ${token}`);
}

const captureMvp028Source = read("scripts/capture-mvp028.mjs");
for (const token of ["diff decision valid", "diff decision failure", "aidd-control-plane-mvp028", "AIDD_MVP028_APP_URL"]) {
  if (!captureMvp028Source.includes(token)) fail(`missing MVP028 capture token: ${token}`);
}

const captureMvp029Source = read("scripts/capture-mvp029.mjs");
for (const token of ["exporter valid", "exporter failure", "aidd-control-plane-mvp029", "AIDD_MVP029_APP_URL"]) {
  if (!captureMvp029Source.includes(token)) fail(`missing MVP029 capture token: ${token}`);
}

const captureMvp030Source = read("scripts/capture-mvp030.mjs");
for (const token of ["preflight valid", "preflight failure", "aidd-control-plane-mvp030", "AIDD_MVP030_APP_URL"]) {
  if (!captureMvp030Source.includes(token)) fail(`missing MVP030 capture token: ${token}`);
}

const captureMvp031Source = read("scripts/capture-mvp031.mjs");
for (const token of ["valid", "failure", "aidd-control-plane-mvp031", "AIDD_MVP031_APP_URL"]) {
  if (!captureMvp031Source.includes(token)) fail(`missing MVP031 capture token: ${token}`);
}

const captureMvp032Source = read("scripts/capture-mvp032.mjs");
for (const token of ["queue valid", "queue failure", "aidd-control-plane-mvp032", "AIDD_MVP032_APP_URL"]) {
  if (!captureMvp032Source.includes(token)) fail(`missing MVP032 capture token: ${token}`);
}

const captureMvp033Source = read("scripts/capture-mvp033.mjs");
for (const token of ["review valid", "review failure", "aidd-control-plane-mvp033", "AIDD_MVP033_APP_URL"]) {
  if (!captureMvp033Source.includes(token)) fail(`missing MVP033 capture token: ${token}`);
}

const captureMvp034Source = read("scripts/capture-mvp035.mjs");
for (const token of ["detail valid", "detail failure", "aidd-control-plane-mvp035", "AIDD_MVP035_APP_URL", "Verification Run Detail"]) {
  if (!captureMvp034Source.includes(token)) fail(`missing MVP035 capture token: ${token}`);
}

const captureMvp036Source = read("scripts/capture-mvp036.mjs");
for (const token of ["repair valid", "repair failure", "aidd-control-plane-mvp036", "AIDD_MVP036_APP_URL", "Evidence Repair Delta Generator"]) {
  if (!captureMvp036Source.includes(token)) fail(`missing MVP036 capture token: ${token}`);
}

const captureMvp037Source = read("scripts/capture-mvp037.mjs");
for (const token of ["priority valid", "priority failure", "aidd-control-plane-mvp037", "AIDD_MVP037_APP_URL", "Repair Delta Priority Decision Workspace"]) {
  if (!captureMvp037Source.includes(token)) fail(`missing MVP037 capture token: ${token}`);
}

const captureMvp038Source = read("scripts/capture-mvp038.mjs");
for (const token of ["execution valid", "execution failure", "aidd-control-plane-mvp038", "AIDD_MVP038_APP_URL", "Execution Priority Set Builder"]) {
  if (!captureMvp038Source.includes(token)) fail(`missing MVP038 capture token: ${token}`);
}

const captureMvp040Source = read("scripts/capture-mvp040.mjs");
for (const token of ["receipt valid", "receipt failure", "aidd-control-plane-mvp040", "AIDD_MVP040_APP_URL", "Codex Run Start Receipt Auditor"]) {
  if (!captureMvp040Source.includes(token)) fail(`missing MVP040 capture token: ${token}`);
}

const captureMvp041Source = read("scripts/capture-mvp041.mjs");
for (const token of ["binder valid", "binder failure", "aidd-control-plane-mvp041", "AIDD_MVP041_APP_URL", "Verification Evidence Receipt Binder"]) {
  if (!captureMvp041Source.includes(token)) fail(`missing MVP041 capture token: ${token}`);
}

const captureMvp042Source = read("scripts/capture-mvp042.mjs");
for (const token of ["review valid", "review failure", "aidd-control-plane-mvp042", "AIDD_MVP042_APP_URL", "Review Record Receipt Synthesizer", "aidd-control-plane-mvp042-empty.png", "aidd-control-plane-mvp042-valid.png", "aidd-control-plane-mvp042-failure.png", "aidd-control-plane-mvp042-terminal-evidence.png"]) {
  if (!captureMvp042Source.includes(token)) fail(`missing MVP042 capture token: ${token}`);
}

const captureMvp043Source = read("scripts/capture-mvp043.mjs");
for (const token of ["action valid", "action failure", "aidd-control-plane-mvp043", "AIDD_MVP043_APP_URL", "Review Finding Action Queue", "aidd-control-plane-mvp043-empty.png", "aidd-control-plane-mvp043-valid.png", "aidd-control-plane-mvp043-failure.png", "aidd-control-plane-mvp043-terminal-evidence.png"]) {
  if (!captureMvp043Source.includes(token)) fail(`missing MVP043 capture token: ${token}`);
}

if (failures.length > 0) {
  console.error("doctor:aidd failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log("doctor:aidd passed");
console.log(`checked files: ${requiredFiles.length}`);
console.log(`checked scripts: ${requiredScripts.join(", ")}`);
console.log("checked MVP: AIDD Control Plane MVP 043 Review Finding Action Queue");
