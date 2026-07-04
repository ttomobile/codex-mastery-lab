import { expect, test } from "@playwright/test";

const mockCiServiceUrl = process.env.NEXT_PUBLIC_MOCK_CI_SERVICE_URL ?? "http://127.0.0.1:4314";

test.beforeEach(async ({ request }) => {
  await request.post(`${mockCiServiceUrl}/__control/state`, { data: { scenario: "empty" } });
});

test("MVP 031の初期empty stateとworkflow artifact監査と標準更新候補Queueが表示される", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "MVP 040: Codex Run Start Receipt Auditor", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Run Authorization Gate: empty" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Diff Bundle & Rollback Evidence Workspace: empty" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Diff Bundle Decision Ledger: empty" })).toBeVisible();
  await expect(page.getByText("まだDiff Bundle判断はありません。bundle validの後にdiff decision valid")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Adopted Bundle Exporter: empty" })).toBeVisible();
  await expect(page.getByText("まだ採用済みbundle exportはありません。diff decision validの後にexporter valid")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Exported Packet Preflight Reviewer: empty" })).toBeVisible();
  await expect(page.getByText("まだpreflight対象のexported packetはありません。exporter validの後にpreflight valid")).toBeVisible();
  await expect(page.getByRole("heading", { name: "CI Workflow Artifact Auditor: empty" })).toBeVisible();
  await expect(page.getByText("不足項目: 20件")).toBeVisible();
  await expect(page.getByText("gate未設定")).toBeVisible();
  await expect(page.getByText("artifact path未設定")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Review Finding", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AI Task Packet Delta", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AIDD-Spec更新候補", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Spec Update Proposal Queue: empty" })).toBeVisible();
  await expect(page.getByText("標準更新候補の不足: 0件")).toBeVisible();
  await expect(page.getByText("標準更新候補はまだありません。proposal validでReview FindingとLearning Logから生成します。")).toBeVisible();
  await expect(page.getByRole("heading", { name: "AI Task Packet Delta Apply Preview: empty" })).toBeVisible();
  await expect(page.getByText("採用プレビューはまだありません。delta validでsource proposalから次回AI Task Packetへの差分を生成します。")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Packet File Apply Planner: empty" })).toBeVisible();
  await expect(page.getByText("まだ適用計画はありません。export validの後にplanner valid")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Packet Apply Command Composer: empty" })).toBeVisible();
  await expect(page.getByText("まだapply command planはありません。composer validで承認済みMarkdownからdry-run付きの適用計画を生成します。")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Run Authorization Gate: empty" })).toBeVisible();
  await expect(page.getByText("まだ実行承認はありません。preflight validの後にvalidでRun Authorization Gateを確認します。")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Codex Run Queue: empty" })).toBeVisible();
  await expect(page.getByText("まだCodex Run Queueはありません。Run Authorization Gate validの後にqueue validで実行待ち・実行中・成功を確認します。")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Run Result Review Synthesizer: empty" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Repair Delta Generator: empty" })).toBeVisible();
  await expect(page.getByText("まだrepair deltaはありません。detail failure/validの後にrepair validで次回AI Task Packetへ戻します。")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Repair Delta Priority Decision Workspace: empty" })).toBeVisible();
  await expect(page.getByText("まだrepair delta decisionはありません。repair validの後にdecision validで採用・保留・却下を分けます。")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Execution Priority Set Builder: empty" })).toBeVisible();
  await expect(page.getByText("まだExecution Priority Setはありません。priority validの後にexecution validでexecute_nowだけをCodex prompt previewへ入れます。")).toBeVisible();
  await expect(page.getByRole("heading", { name: "One-Run Handoff Pack Reviewer: empty" })).toBeVisible();
  await expect(page.getByText("まだOne-Run Handoff Packはありません。execution validの後にhandoff validでexecute_nowだけを次の1回のCodex実行へ渡す形にします。")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Codex Run Start Receipt Auditor: empty" })).toBeVisible();
  await expect(page.getByText("まだCodex実行開始レシートはありません。handoff validの後にreceipt validで実行開始直後の監査情報を確認します。")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Next Increment Planner: empty" })).toBeVisible();
  await expect(page.getByText("まだNext Increment Planはありません。Run Result Reviewの後にincrement validで次の1インクリメント計画を生成します。")).toBeVisible();
  await expect(page.getByText("Docker Compose経路").first()).toBeVisible();
  await expect(page.getByText("Node fallback経路").first()).toBeVisible();
  await expect(page.getByText("同一contract").first()).toBeVisible();
  await expect(page.getByText("mock service接続中")).toBeVisible();
  await expect(page.getByRole("heading", { name: "empty: 入力待ち" })).toBeVisible();
  await expect(page.getByText("readiness score: 0").first()).toBeVisible();
  await expect(page.getByText("テンプレート未選択").first()).toBeVisible();
  await expect(page.getByText("アプリ名")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Verification Run Tracker" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Review & Learning Log" })).toBeVisible();
  await expect(page.getByText("review fail: 次回依頼へ戻す項目があります")).toBeVisible();
  await expect(page.getByText("Next AI Task Packet Delta")).toBeVisible();
  await expect(page.getByText("not ready: failure stateがあります")).toBeVisible();
  await expect(page.getByLabel("lint 未実行")).toBeVisible();
  await expect(page.getByLabel("terminal evidence", { exact: true }).getByText("terminal evidence不足", { exact: true })).toBeVisible();
  await expect(page.getByLabel("screenshot evidence", { exact: true }).getByText("screenshot evidence不足", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Artifact Evidence Binder: empty" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CI Artifact Importer: empty" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Gap Repair Planner: empty" })).toBeVisible();
  await expect(page.getByText("不足証跡: 7件")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("Artifact Evidence Binder: CI run URLが壊れています")).toBeVisible();
  await expect(page.getByRole("button", { name: "emptyサンプルを適用" })).toBeVisible();
});

test("Packet Apply Command Composerでempty valid failureを切り替え、反映直前コマンドを確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Packet Apply Command Composer: empty" })).toBeVisible();
  await page.getByRole("button", { name: "composer valid" }).click();
  await expect(page.getByRole("heading", { name: "Packet Apply Command Composer: valid" })).toBeVisible();
  await expect(page.getByText("packet apply command composerはvalidです")).toBeVisible();
  await expect(page.getByLabel("Packet Apply Command Composer command plans").getByRole("heading", { name: "AI_TASK_PACKET.md" })).toBeVisible();
  await expect(page.getByLabel("Packet Apply Command Composer command plans").getByText("dry-run command").first()).toBeVisible();
  await expect(page.getByLabel("Packet Apply Command Composer command plans").getByText("rollback command").first()).toBeVisible();
  await expect(page.getByLabel("Packet Apply Command Composer command plans").getByText("evidence path").first()).toBeVisible();
  await expect(page.getByLabel("Packet Apply Command Composer copy Codex prompt")).toContainText("承認済みのMarkdownだけ");

  await page.getByRole("button", { name: "composer failure" }).click();
  await expect(page.getByRole("heading", { name: "Packet Apply Command Composer: failure" })).toBeVisible();
  await expect(page.getByLabel("Packet Apply Command Composer issues").getByText("危険なtarget path")).toBeVisible();
  await expect(page.getByLabel("Packet Apply Command Composer issues").getByText("rollback command不足")).toBeVisible();
  await expect(page.getByLabel("Packet Apply Command Composer issues").getByText("verification command不足")).toBeVisible();
  await expect(page.getByLabel("Packet Apply Command Composer issues").getByText("未レビューMarkdown混入")).toBeVisible();
});

test("Run Authorization Gateでempty valid failureを切り替え、実行前承認を確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Run Authorization Gate: empty" })).toBeVisible();
  await page.getByRole("button", { name: "valid", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Run Authorization Gate: valid" })).toBeVisible();
  await expect(page.getByText("run authorization gateはvalidです")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("approver", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("AIDD reviewer")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("authorization reason", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("Codex command", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("sandbox mode", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("検証コマンド", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("pnpm run test:e2e")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("3ブラウザ", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("chromium / firefox / webkit")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("証跡保存先", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("experiments/aidd-control-plane-mvp-031/artifacts/terminal/run-authorization-gate.txt")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("rollback", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("AIDD-Spec接続", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate details").getByText("AI Task Packet / Verification Evidence / Review Record / Learning Log / Rollback Plan")).toBeVisible();

  await page.getByRole("button", { name: "failure", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Run Authorization Gate: failure" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "実行前に止めるべきReview Finding" })).toBeVisible();
  await expect(page.getByText("preflight failureを解消せず実行しようとしている")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("preflight statusがvalidでない")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("approver不足")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("authorization reason不足")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("Codex command: 危険なtarget path")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("sandbox mode不足")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("Firefox除外")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("shallow verification")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("local path / host / private network / private network URL混入")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("evidence path不足")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("rollback plan不足")).toBeVisible();
  await expect(page.getByLabel("Run Authorization Gate Review Finding").getByText("AIDD-Spec接続不足")).toBeVisible();
});

test("Codex Run Queueでempty valid failureを切り替え、実行queueとReview Findingを確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Codex Run Queue: empty" })).toBeVisible();
  await page.getByRole("button", { name: "queue valid" }).click();
  await expect(page.getByRole("heading", { name: "Codex Run Queue: valid" })).toBeVisible();
  await expect(page.getByText("codex run queueはvalidです")).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue item cards").getByText("queue-mvp032-waiting: waiting")).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue item cards").getByText("queue-mvp032-running: running")).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue item cards").getByText("queue-mvp032-succeeded: succeeded")).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue item cards").getByText("pnpm run mock:doctor").first()).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue item cards").getByText("chromium / firefox / webkit").first()).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue item cards").getByText("playwright-report/index.html").first()).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue item cards").getByText("retry policy").first()).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue item cards").getByText("rollback").first()).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue item cards").getByText("AI Task Packet / Verification Evidence / Review Record / Learning Log / Rollback Plan").first()).toBeVisible();

  await page.getByRole("button", { name: "queue failure" }).click();
  await expect(page.getByRole("heading", { name: "Codex Run Queue: failure" })).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue Review Finding").getByText("Run Authorization Gate valid由来でない")).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue Review Finding").getByText("危険なcommand")).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue Review Finding").getByText("Firefox除外")).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue Review Finding").getByText("浅い検証")).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue Review Finding").getByText("screenshot evidence不足").first()).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue Review Finding").getByText("playwright evidence不足").first()).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue Review Finding").getByText("rollback不足")).toBeVisible();
  await expect(page.getByLabel("Codex Run Queue Review Finding").getByText("AIDD-Spec接続不足").first()).toBeVisible();
});

test("Run Result Review Synthesizerでempty valid failureを切り替え、Review RecordとLearning Logへのdeltaを確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Run Result Review Synthesizer: empty" })).toBeVisible();
  await page.getByRole("button", { name: "queue valid" }).click();
  await page.getByRole("button", { name: "review valid" }).click();
  await expect(page.getByRole("heading", { name: "Run Result Review Synthesizer: valid" })).toBeVisible();
  await expect(page.getByText("run result review synthesizerはvalidです")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Synthesizer details").getByText("sourceRunId", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Result Review Synthesizer details").getByText("queue-mvp032-succeeded")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Synthesizer details").getByText("outcome", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Result Review Synthesizer details").getByText("passed", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Result Review Synthesizer details").getByText("score", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Result Review Synthesizer details").getByText("docs/review-record.md#run-result-review-synthesizer")).toBeVisible();
  await expect(page.getByLabel("AI Task Packet delta").getByText("Run Result Review SynthesizerをMVP033の次段として追加する。")).toBeVisible();
  await expect(page.getByLabel("Codex prompt delta").getByText("sourceRunId")).toBeVisible();
  await expect(page.getByLabel("Verification command").getByText("pnpm run doctor:aidd")).toBeVisible();
  await expect(page.getByLabel("Learning Log").getByText("成功runはscoreとoutcomeだけで終わらせず")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("prompt_delta: info")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("observedBy")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("idealState")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("fixInstruction")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("neededUpstreamInfo")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("standardUpdate")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("codexPromptDelta")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("verification")).toBeVisible();

  await page.getByRole("button", { name: "review failure" }).click();
  await expect(page.getByRole("heading", { name: "Run Result Review Synthesizer: failure" })).toBeVisible();
  await expect(page.getByText("Run Result Review Finding:")).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("terminal_evidence: critical").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("screenshot_evidence: warning").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("browser_coverage: critical").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("doctor_gate: critical").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("rollback: warning").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("privacy: critical").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("prompt_delta: warning").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("terminal evidence不足").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("capture:mvp033").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("Firefox").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("doctor:aidd").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("rollback未確認").first()).toBeVisible();
  await expect(page.getByLabel("Run Result Review Finding").getByText("local path / host / private network").first()).toBeVisible();
});

test("Next Increment Plannerでempty valid failureを切り替え、次の1インクリメント計画を確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Next Increment Planner: empty" })).toBeVisible();
  await page.getByRole("button", { name: "queue valid" }).click();
  await page.getByRole("button", { name: "review valid" }).click();
  await page.getByRole("button", { name: "increment valid" }).click();
  await expect(page.getByRole("heading", { name: "Next Increment Planner: valid" })).toBeVisible();
  await expect(page.getByText("next increment plannerはvalidです")).toBeVisible();
  await expect(page.getByLabel("Next Increment Planner details").getByText("recommendedIncrement", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Next Increment Planner details").getByText("MVP035 Next Increment Planner")).toBeVisible();
  await expect(page.getByLabel("Next Increment Planner details").getByText("priorityReason", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Target artifacts").getByText("AI_TASK_PACKET.md")).toBeVisible();
  await expect(page.getByLabel("Acceptance criteria").getByText("empty/valid/failure")).toBeVisible();
  await expect(page.getByLabel("Verification commands").getByText("pnpm run test:e2e")).toBeVisible();
  await expect(page.getByLabel("Required evidence").getByText("failure screenshot")).toBeVisible();
  await expect(page.getByLabel("Codex prompt draft").getByText("1インクリメント")).toBeVisible();
  await expect(page.getByLabel("Learning Log links").getByText("Learning Log: 成功/失敗を次回1インクリメントへ戻す")).toBeVisible();
  await expect(page.getByLabel("Next Increment Finding").getByText("priority: info")).toBeVisible();

  await page.getByRole("button", { name: "increment failure" }).click();
  await expect(page.getByRole("heading", { name: "Next Increment Planner: failure" })).toBeVisible();
  await expect(page.getByText("Next Increment Finding:")).toBeVisible();
  await expect(page.getByLabel("Next Increment Finding").getByText("source_review: critical")).toBeVisible();
  await expect(page.getByLabel("Next Increment Finding").getByText("acceptance_criteria: critical")).toBeVisible();
  await expect(page.getByLabel("Next Increment Finding").getByText("browser_coverage: critical")).toBeVisible();
  await expect(page.getByLabel("Next Increment Finding").getByText("terminal_evidence: critical")).toBeVisible();
  await expect(page.getByLabel("Next Increment Finding").getByText("rollback: warning")).toBeVisible();
  await expect(page.getByLabel("Next Increment Finding").getByText("privacy: critical")).toBeVisible();
  await expect(page.getByLabel("Next Increment Finding").getByText("Firefox").first()).toBeVisible();
});

test("CI Workflow Artifact Auditorでvalidとfailureを切り替え、不足artifactを次回依頼へ変換できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "auditor valid" }).click();
  await expect(page.getByRole("heading", { name: "CI Workflow Artifact Auditor: valid" })).toBeVisible();
  await expect(page.getByText("workflow artifact監査はvalidです")).toBeVisible();
  await expect(page.getByText("pnpm install --frozen-lockfile", { exact: true })).toBeVisible();
  await expect(page.getByLabel("CI Workflow Artifact Auditor: valid").getByText("pnpm run mock:doctor", { exact: true })).toBeVisible();
  await expect(page.getByText("experiments/aidd-control-plane-mvp-019/artifacts/terminal", { exact: true })).toBeVisible();
  await expect(page.getByText("coverage / playwright-report / test-results / experiments terminal evidence相当")).toBeVisible();

  await page.getByRole("button", { name: "auditor failure" }).click();
  await expect(page.getByRole("heading", { name: "CI Workflow Artifact Auditor: failure" })).toBeVisible();
  await expect(page.getByText("pnpm run doctor:aidd gateがworkflowから不足").first()).toBeVisible();
  await expect(page.getByText("playwright-report artifact保存が不足").first()).toBeVisible();
  await expect(page.getByText("test-results artifact保存が不足").first()).toBeVisible();
  await expect(page.getByText("actions/upload-artifact", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "AIDD-Spec更新候補", exact: true })).toBeVisible();
  await expect(page.getByText("Screen Inventory").first()).toBeVisible();
});

test("Spec Update Proposal Queueでempty valid failureを切り替え、Codex prompt deltaを確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Spec Update Proposal Queue: empty" })).toBeVisible();
  await page.getByRole("button", { name: "proposal valid" }).click();
  await expect(page.getByRole("heading", { name: "Spec Update Proposal Queue: valid" })).toBeVisible();
  await expect(page.getByText("標準更新候補はvalidです")).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue candidates").getByText("finding", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue candidates").getByText("ideal state", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue candidates").getByText("needed upstream info", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue candidates").getByText("target standard document", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue candidates").getByText("standards/aidd-control-plane-mvp-v0.1.md")).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue candidates").getByText("target field", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue candidates").getByText("priority", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue candidates").getByText("acceptance criteria", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Codex prompt delta").getByText("次回のCodex Prompt Delta")).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue candidates").getByText("verification command", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "proposal failure" }).click();
  await expect(page.getByRole("heading", { name: "Spec Update Proposal Queue: failure" })).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue issues").getByText("対象文書が不足しています")).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue issues").getByText("acceptance criteriaが不足しています")).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue issues").getByText("verification commandが不足しています")).toBeVisible();
  await expect(page.getByLabel("Spec Update Proposal Queue issues").getByText("Codex prompt deltaが不足しています")).toBeVisible();
});

test("AI Task Packet Delta Apply Previewでempty valid failureを切り替え、Codex prompt patchを確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "AI Task Packet Delta Apply Preview: empty" })).toBeVisible();
  await expect(page.getByText("delta apply preview不足: 4件")).toBeVisible();

  await page.getByRole("button", { name: "delta valid" }).click();
  await expect(page.getByRole("heading", { name: "AI Task Packet Delta Apply Preview: valid" })).toBeVisible();
  await expect(page.getByText("delta apply previewはvalidです")).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview details").getByText("source proposal", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview details").getByText("target packet section", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview details").getByText("before summary", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview details").getByText("after summary", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview details").getByText("added acceptance criteria", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview details").getByText("added verification commands", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview Codex prompt patch").getByText("Codex prompt patch")).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview details").getByText("rollback condition", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview details").getByText("review checklist", { exact: true })).toBeVisible();
  await expect(page.getByText("不足した確認項目はReview RecordとLearning Logへ戻し")).toBeVisible();

  await page.getByRole("button", { name: "delta failure" }).click();
  await expect(page.getByRole("heading", { name: "AI Task Packet Delta Apply Preview: failure" })).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview issues").getByText("根拠finding不足")).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview issues").getByText("target packet section不足")).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview issues").getByText("verification command不足")).toBeVisible();
  await expect(page.getByLabel("AI Task Packet Delta Apply Preview issues").getByText("rollback condition不足")).toBeVisible();
});

test("Delta Decision Reviewでempty valid failureを切り替え、採用済みdeltaだけを次回packet対象にできる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Delta Decision Review: empty" })).toBeVisible();
  await expect(page.getByText("まだ判断待ちの差分がありません")).toBeVisible();

  await page.getByRole("button", { name: "delta valid" }).click();
  await page.getByRole("button", { name: "decision valid", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Delta Decision Review: valid" })).toBeVisible();
  await expect(page.getByText("delta decision reviewはvalidです")).toBeVisible();
  await expect(page.getByText("採用: 1件 / 却下: 1件 / 保留: 1件")).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review details").getByText("decision owner", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review details").getByText("decision reason", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review details").getByText("rollback confirmed", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("次回AI Task Packetに入る採用済みdelta")).toContainText("delta-mvp019-001");

  await page.getByRole("button", { name: "decision failure", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Delta Decision Review: failure" })).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review issues").getByText("delta-mvp019-bad-001: 判断者不足")).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review issues").getByText("delta-mvp019-bad-001: 判断理由不足")).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review issues").getByText("delta-mvp019-bad-001: rollback確認不足")).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review issues").getByText("delta-mvp019-bad-001: 採用なのにverification command不足")).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review issues").getByText("delta-mvp019-bad-002: 却下なのに再発防止メモ不足")).toBeVisible();
});

test("Packet File Apply Plannerでempty valid failureを切り替え、実ファイル適用前の計画を確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Packet File Apply Planner: empty" })).toBeVisible();
  await expect(page.getByText("Packet File Apply Planner Review Finding: 0件")).toBeVisible();

  await page.getByRole("button", { name: "delta valid" }).click();
  await page.getByRole("button", { name: "decision valid", exact: true }).click();
  await page.getByRole("button", { name: "export valid" }).click();
  await page.getByRole("button", { name: "planner valid" }).click();
  await expect(page.getByRole("heading", { name: "Packet File Apply Planner: valid" })).toBeVisible();
  await expect(page.getByText("packet file apply plannerはvalidです")).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByRole("heading", { name: "AI_TASK_PACKET.md" })).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByRole("heading", { name: "CODEX_PROMPT.md" })).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByRole("heading", { name: "VERIFICATION_PLAN.md" })).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByRole("heading", { name: "LEARNING_LOG.md" })).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByText("Markdown見出し").first()).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByText("before summary").first()).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByText("after summary").first()).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByText("insert position").first()).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByText("verification command").first()).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByText("rollback step").first()).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByText("review evidence").first()).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner file plans").getByText("delta-mvp019-001").first()).toBeVisible();
  await expect(page.getByLabel("Learning Log戻し対象").getByText("delta-mvp019-002: deferred")).toBeVisible();
  await expect(page.getByLabel("Learning Log戻し対象").getByText("delta-mvp019-003: rejected")).toBeVisible();

  await page.getByRole("button", { name: "planner failure" }).click();
  await expect(page.getByRole("heading", { name: "Packet File Apply Planner: failure" })).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner Review Findings").getByText("target file不足")).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner Review Findings").getByText("insert position不足")).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner Review Findings").getByText("before/after差分不足")).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner Review Findings").getByText("verification command不足")).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner Review Findings").getByText("rollback step不足")).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner Review Findings").getByText("review evidence不足")).toBeVisible();
  await expect(page.getByLabel("Packet File Apply Planner Review Findings").getByText("未採用delta delta-mvp019-bad-002 が混入しています")).toBeVisible();
});


test("Safe Patch Review Workspaceでempty valid failureを切り替え、危険なpatchを止められる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Safe Patch Review Workspace: empty" })).toBeVisible();
  await expect(page.getByText("まだpatch候補はありません。draft validの後にpatch valid")).toBeVisible();

  await page.getByRole("button", { name: "patch valid" }).click();
  await expect(page.getByRole("heading", { name: "Safe Patch Review Workspace: valid" })).toBeVisible();
  await expect(page.getByText("safe patch review workspaceはvalidです")).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace patch candidates").getByRole("heading", { name: "safe-patch-mvp023-001" })).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace patch candidates").getByText("target file").first()).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace patch candidates").getByText("source draft id").first()).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace patch candidates").getByText("diff summary").first()).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace patch candidates").getByText("git apply --check").first()).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace patch candidates").getByText("git checkout -- AI_TASK_PACKET.md").first()).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace コピー用Codex prompt")).toContainText("AIDD-Spec v0.1");

  await page.getByRole("button", { name: "patch failure" }).click();
  await expect(page.getByRole("heading", { name: "Safe Patch Review Workspace: failure" })).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace Review Findings").getByText("target file不足")).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace Review Findings").getByText("diff size過大")).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace Review Findings").getByText("危険なtarget path")).toBeVisible();
  await expect(page.getByLabel("Safe Patch Review Workspace Review Findings").getByText("ローカルパス混入")).toBeVisible();
});


test("Diff Bundle Rollback Evidence Workspaceでempty valid failureを切り替え、戻せる証跡なしのpatch適用を止められる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Diff Bundle & Rollback Evidence Workspace: empty" })).toBeVisible();
  await expect(page.getByText("まだdiff bundleはありません。patch validの後にbundle valid")).toBeVisible();

  await page.getByRole("button", { name: "bundle valid" }).click();
  await expect(page.getByRole("heading", { name: "Diff Bundle & Rollback Evidence Workspace: valid" })).toBeVisible();
  await expect(page.getByText("diff bundle rollback evidence workspaceはvalidです")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByRole("heading", { name: "diff-bundle-mvp027-001" })).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("source apply plan / patch id").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("apply-plan-mvp027-001").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("before hash").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("after hash").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("dry-run command").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("dry-run status").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("rollback evidence path").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("rollback verified command").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("verification command").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("reviewer checklist").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace bundles").getByText("AIDD-Spec接続").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace コピー用Codex prompt")).toContainText("rollback evidence");

  await page.getByRole("button", { name: "bundle failure" }).click();
  await expect(page.getByRole("heading", { name: "Diff Bundle & Rollback Evidence Workspace: failure" })).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("source apply plan不足")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("source patch id不足")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("dry-run未実行")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("bundle 1: dry-run未成功")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("bundle 1: rollback evidence不足")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("bundle 1: verification command不足")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("bundle 1: reviewer未承認")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("bundle 1: ローカルパスやhost名の混入")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("危険なtarget path（../）")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("危険なtarget path（絶対パス）")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Rollback Evidence Workspace Review Findings").getByText("bundle 1: AIDD-Spec接続不足")).toBeVisible();
});


test("Bundle Decision Ledgerでapplied rejected deferredの判断と証跡保存先を確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Bundle Decision Ledger: empty", exact: true })).toBeVisible();
  await expect(page.getByText("まだbundle判断はありません。bundle validの後にledger valid")).toBeVisible();

  await page.getByRole("button", { name: "bundle valid" }).click();
  await page.getByRole("button", { name: "ledger valid" }).click();
  await expect(page.getByRole("heading", { name: "Bundle Decision Ledger: valid", exact: true })).toBeVisible();
  await expect(page.getByText("bundle decision ledgerはvalidです")).toBeVisible();
  await expect(page.getByText("applied: 1件 / rejected: 1件 / deferred: 1件")).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger decisions").getByRole("heading", { name: "bundle-decision-trial014-001" })).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger decisions").getByText("decision status").first()).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger decisions").getByText("applied", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger decisions").getByText("deferred", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger decisions").getByText("rejected", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger decisions").getByText("verification evidence").first()).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger decisions").getByText("rollback evidence").first()).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger decisions").getByText("Learning Log").first()).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger decisions").getByText("Next Task Packet Delta").first()).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger コピー用Codex prompt", { exact: true })).toContainText("AIDD-Spec v0.1");

  await page.getByRole("button", { name: "ledger failure" }).click();
  await expect(page.getByRole("heading", { name: "Bundle Decision Ledger: failure", exact: true })).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger issues").getByText("decision id不足")).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger issues").getByText("rollback evidence不足").first()).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger issues").getByText("reviewer未承認").first()).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger issues").getByText("ローカルパスやhost名の混入").first()).toBeVisible();
  await expect(page.getByLabel("Bundle Decision Ledger issues").getByText("危険なtarget path")).toBeVisible();
});

test("Diff Bundle Decision Ledgerでempty valid failureを切り替え、標準接続と失敗検出を確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Diff Bundle Decision Ledger: empty" })).toBeVisible();
  await expect(page.getByText("まだDiff Bundle判断はありません。bundle validの後にdiff decision valid")).toBeVisible();

  await page.getByRole("button", { name: "bundle valid" }).click();
  await page.getByRole("button", { name: "diff decision valid" }).click();
  await expect(page.getByRole("heading", { name: "Diff Bundle Decision Ledger: valid" })).toBeVisible();
  await expect(page.getByText("diff bundle decision ledgerはvalidです")).toBeVisible();
  await expect(page.getByText("adopted: 1件 / rejected: 1件 / deferred: 1件 / undecided: 0件")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger decisions").getByRole("heading", { name: "diff-bundle-decision-mvp028-001" })).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger decisions").getByText("Review Record").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger decisions").getByText("Verification Evidence").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger decisions").getByText("Learning Log").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger decisions").getByText("Rollback Plan").first()).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger decisions").getByText("pnpm run doctor:aidd")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger standard connection")).toContainText("standards/aidd-control-plane-mvp-v0.1.md");
  await expect(page.getByLabel("Diff Bundle Decision Ledger コピー用Codex prompt")).toContainText("AIDD-Spec v0.1");

  await page.getByRole("button", { name: "diff decision failure" }).click();
  await expect(page.getByRole("heading", { name: "Diff Bundle Decision Ledger: failure" })).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger issues").getByText("diff-decision-bad-001: 未判断")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger issues").getByText("diff-decision-bad-001: 理由不足")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger issues").getByText("diff-decision-bad-001: 証跡不足")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger issues").getByText("diff-decision-bad-001: rollback未確認")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger issues").getByText("diff-decision-bad-001: ローカルパスやhost名の混入")).toBeVisible();
  await expect(page.getByLabel("Diff Bundle Decision Ledger issues").getByText("diff-decision-bad-002: 採用済みverification不足")).toBeVisible();
});

test("Adopted Bundle Exporterでempty valid failureを切り替え、採用済みbundleだけのexportと失敗検出を確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Adopted Bundle Exporter: empty" })).toBeVisible();
  await expect(page.getByText("まだ採用済みbundle exportはありません。diff decision validの後にexporter valid")).toBeVisible();

  await page.getByRole("button", { name: "bundle valid" }).click();
  await page.getByRole("button", { name: "diff decision valid" }).click();
  await page.getByRole("button", { name: "exporter valid" }).click();
  await expect(page.getByRole("heading", { name: "Adopted Bundle Exporter: valid" })).toBeVisible();
  await expect(page.getByText("adopted bundle exporterはvalidです")).toBeVisible();
  await expect(page.getByText("adopted export: 1件 / blocked bundle: 0件")).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter exports").getByRole("heading", { name: "adopted-bundle-export-mvp029-001" })).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter exports").getByText("source status")).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter exports").getByText("adopted").first()).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter exports").getByText("AI Task Packet").first()).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter exports").getByText("Verification Evidence").first()).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter exports").getByText("Review Record").first()).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter exports").getByText("Learning Log").first()).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter exports").getByText("Rollback Plan").first()).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter standard connection")).toContainText("standards/aidd-control-plane-mvp-v0.1.md");
  await expect(page.getByLabel("Adopted Bundle Exporter コピー用Codex prompt")).toContainText("AI Task Packet");

  await page.getByRole("button", { name: "exporter failure" }).click();
  await expect(page.getByRole("heading", { name: "Adopted Bundle Exporter: failure" })).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter issues").getByText("adopted-export-bad-001: 却下bundle混入")).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter issues").getByText("adopted-export-bad-002: 保留bundle混入")).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter issues").getByText("adopted-export-bad-003: 未判断bundle混入")).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter issues").getByText("adopted-export-bad-001: review evidence不足")).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter issues").getByText("adopted-export-bad-002: rollback condition不足")).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter issues").getByText("adopted-export-bad-002: verification command不足")).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter issues").getByText("ローカルパスやhost名の混入").first()).toBeVisible();
  await expect(page.getByLabel("Adopted Bundle Exporter issues").getByText("adopted-export-bad-001: AIDD-Spec接続不足")).toBeVisible();
});

test("Exported Packet Preflight Reviewerでempty valid failureを切り替え、次工程前のpacket検査を確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Exported Packet Preflight Reviewer: empty" })).toBeVisible();
  await expect(page.getByText("まだpreflight対象のexported packetはありません。exporter validの後にpreflight valid")).toBeVisible();

  await page.getByRole("button", { name: "bundle valid" }).click();
  await page.getByRole("button", { name: "diff decision valid" }).click();
  await page.getByRole("button", { name: "exporter valid" }).click();
  await page.getByRole("button", { name: "preflight valid" }).click();
  await expect(page.getByRole("heading", { name: "Exported Packet Preflight Reviewer: valid" })).toBeVisible();
  await expect(page.getByText("exported packet preflight reviewerはvalidです")).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer packets").getByRole("heading", { name: "exported-packet-preflight-mvp030-001" })).toBeVisible();
  await expect(page.getByText("chromium / firefox / webkit", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer packets").getByText("standard", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer checklist").getByText("未採用bundle混入がない")).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer コピー用Codex prompt")).toContainText("AIDD-Spec v0.1");

  await page.getByRole("button", { name: "preflight failure" }).click();
  await expect(page.getByRole("heading", { name: "Exported Packet Preflight Reviewer: failure" })).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer issues").getByText("exported-packet-bad-001: 未採用bundle混入")).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer issues").getByText("exported-packet-bad-001: Firefox除外")).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer issues").getByText("exported-packet-bad-001: 浅い検証")).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer issues").getByText("exported-packet-bad-001: local path/host/private network混入")).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer issues").getByText("exported-packet-bad-001: rollback不足")).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer issues").getByText("exported-packet-bad-001: evidence不足")).toBeVisible();
  await expect(page.getByLabel("Exported Packet Preflight Reviewer issues").getByText("exported-packet-bad-001: AIDD-Spec接続不足")).toBeVisible();
});


test("Packet Draft Workspaceでempty valid failureを切り替え、次回ファイルドラフトを確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Packet Draft Workspace: empty" })).toBeVisible();
  await expect(page.getByText("Packet Draft Workspace Review Finding: 0件")).toBeVisible();
  await expect(page.getByText("まだドラフト本文はありません。planner validの後にdraft valid")).toBeVisible();

  await page.getByRole("button", { name: "draft valid" }).click();
  await expect(page.getByRole("heading", { name: "Packet Draft Workspace: valid" })).toBeVisible();
  await expect(page.getByText("packet draft workspaceはvalidです")).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace draft files").getByRole("heading", { name: "AI_TASK_PACKET.md" })).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace draft files").getByRole("heading", { name: "CODEX_PROMPT.md" })).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace draft files").getByRole("heading", { name: "VERIFICATION_PLAN.md" })).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace draft files").getByRole("heading", { name: "LEARNING_LOG.md" })).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace draft files").getByText("draft status").first()).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace draft files").getByText("source delta id").first()).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace draft files").getByText("差分サマリ").first()).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace draft files").getByText("実行前チェック").first()).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace draft files").getByText("rollback condition").first()).toBeVisible();
  await expect(page.getByLabel("AI_TASK_PACKET.md コピー用本文プレビュー")).toContainText("AIDD-Spec接続");
  await expect(page.getByRole("article", { name: "コピー用Codex prompt", exact: true })).toContainText("AIDD-Spec v0.1");
  await expect(page.getByRole("article", { name: "コピー用Codex prompt", exact: true })).toContainText("rollback condition");

  await page.getByRole("button", { name: "draft failure" }).click();
  await expect(page.getByRole("heading", { name: "Packet Draft Workspace: failure" })).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace Review Findings").getByText("draft body不足")).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace Review Findings").getByText("file target重複または衝突")).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace Review Findings").getByText("source delta id不足")).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace Review Findings").getByText("未採用delta delta-mvp019-bad-002 が混入しています")).toBeVisible();
  await expect(page.getByLabel("Packet Draft Workspace Review Findings").getByText("AI_TASK_PACKET.md: AIDD-Spec接続不足").first()).toBeVisible();
});

test("Adopted Delta Markdown Exporterで採用済みdeltaだけをMarkdownへ書き出せる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Adopted Delta Markdown Exporter: empty" })).toBeVisible();
  await expect(page.getByText("まだ書き出す採用済みdeltaがありません")).toBeVisible();

  await page.getByRole("button", { name: "delta valid" }).click();
  await page.getByRole("button", { name: "decision valid", exact: true }).click();
  await page.getByRole("button", { name: "export valid" }).click();
  await expect(page.getByRole("heading", { name: "Adopted Delta Markdown Exporter: valid" })).toBeVisible();
  await expect(page.getByText("adopted delta markdown exportはvalidです")).toBeVisible();
  await expect(page.getByLabel("採用済みdeltaのMarkdown export")).toContainText("delta-mvp019-001");
  await expect(page.getByLabel("採用済みdeltaのMarkdown export")).not.toContainText("delta-mvp019-002");
  await expect(page.getByRole("heading", { name: "Learning Logへ戻す未採用delta" })).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "delta-mvp019-002: deferred" })).toBeVisible();
  await expect(page.getByLabel("採用済みdeltaのCodex prompt追記")).toContainText("採用済みdeltaだけを次回AI Task Packetへ反映");

  await page.getByRole("button", { name: "export failure" }).click();
  await expect(page.getByRole("heading", { name: "Adopted Delta Markdown Exporter: failure" })).toBeVisible();
  await expect(page.getByLabel("Adopted Delta Markdown Exporter issues").getByText("Adopted Delta Markdown Exporter: verification command不足")).toBeVisible();
  await expect(page.getByLabel("Adopted Delta Markdown Exporter issues").getByText("Adopted Delta Markdown Exporter: rollback condition不足")).toBeVisible();
  await expect(page.getByLabel("Adopted Delta Markdown Exporter issues").getByText("Adopted Delta Markdown Exporter: 未採用delta delta-mvp019-bad-002 が混入しています")).toBeVisible();
});

test("fixture駆動Mock CI Serviceでvalid failure timeoutを切り替えられる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Mock CI Service: empty/ })).toBeVisible();
  await page.getByRole("button", { name: "証跡が揃った状態" }).click();
  await expect(page.getByRole("heading", { name: /valid: 必須CI証跡が揃っています/ })).toBeVisible();
  await expect(page.getByText("15015").first()).toBeVisible();
  await page.getByRole("button", { name: "証跡不足", exact: true }).click();
  await expect(page.getByRole("heading", { name: /failure: CI証跡不足/ })).toBeVisible();
  await expect(page.getByText("commit SHAも短すぎます")).toBeVisible();
  await page.getByRole("button", { name: "取得タイムアウト" }).click();
  await expect(page.getByRole("heading", { name: /timeout: CI取得タイムアウト/ })).toBeVisible();
  await expect(page.getByText("手動Artifact Evidence Binderへterminal evidence")).toBeVisible();
});

test("E2Eからmock CI serviceのcontrol endpointを叩いてUI反映を確認する", async ({ page, request }) => {
  await request.post(`${mockCiServiceUrl}/__control/state`, { data: { scenario: "rate_limit" } });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Mock CI Service: rate_limit: CI API制限中/ })).toBeVisible();
  await expect(page.getByLabel("rate_limit対応").getByText("60秒待機してからCI APIを再取得します。")).toBeVisible();
  await expect(page.getByLabel("rate_limit対応").getByText("actions:read", { exact: true })).toBeVisible();
  await expect(page.getByLabel("rate_limit対応").getByText("contents:read", { exact: true })).toBeVisible();
  await expect(page.getByLabel("rate_limit対応").getByText("terminal-evidence", { exact: true })).toBeVisible();
  await expect(page.getByLabel("rate_limit対応").getByText("次回AI Task Packet Delta")).toBeVisible();

  await request.post(`${mockCiServiceUrl}/__control/state`, { data: { scenario: "valid" } });
  await page.reload();
  await expect(page.getByRole("heading", { name: /Mock CI Service: valid: 必須CI証跡が揃っています/ })).toBeVisible();
  await expect(page.getByText("mock:doctor: 成功")).toBeVisible();
});

test("テンプレートを選択して未適用failure stateを表示できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("radio", { name: /学習支援/ }).check({ force: true });

  await expect(page.getByText("テンプレート未適用").first()).toBeVisible();
  await expect(page.getByText("選択したテンプレートを適用して初期値を反映しますか？")).toBeVisible();
});

test("テンプレートを適用すると初期値と生成結果にリスクと証跡要件が入る", async ({ page }) => {
  await page.goto("/");

  await applyLearningTemplate(page);

  await expect(page.getByRole("combobox", { name: "アプリ種別" })).toHaveValue("Webアプリ");
  await expect(page.getByLabel("必要な機能は何ですか？ 1行に1つ")).toHaveValue(/今日の学習キュー/);
  await expect(page.getByLabel("作らないものを決める 1行に1つ")).toHaveValue(/外部AI API呼び出し/);
  await expect(page.getByLabel("外部連携はありますか？ 1行に1つ")).toHaveValue(/mock auth service/);
  await expect(page.getByText("テンプレート適用済み").first()).toBeVisible();

  await expect(page.getByRole("heading", { name: "Generated Product Brief" })).toBeVisible();
  await expect(page.getByText("学習支援").first()).toBeVisible();
  await expect(page.getByText("offline時の進捗保存方針").first()).toBeVisible();
  await expect(page.getByText("offline / timeout状態の画面証跡").first()).toBeVisible();
});

test("サンプルアプリを入力するとready stateになり生成結果が表示される", async ({ page }) => {
  await page.goto("/");
  await fillSampleApp(page);

  await expect(page.getByRole("heading", { name: "ready: AIへ渡せます" })).toBeVisible();
  await expect(page.getByText("readiness score: 100").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Generated Product Brief" })).toBeVisible();
  await expect(page.getByText("StudyFlow").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Generated AI Task Packet" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Verification Plan" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "コピーできるCodex Prompt" })).toContainText("品質ゲート");
  await expect(page.getByRole("textbox", { name: "コピーできるCodex Prompt" })).toContainText("Verification Run");
});

test("主要機能を削除するとinsufficient stateとmissing fieldsが表示される", async ({ page }) => {
  await page.goto("/");
  await fillSampleApp(page);

  await page.getByLabel("必要な機能は何ですか？ 1行に1つ").fill("");

  await expect(page.getByRole("heading", { name: "insufficient: 必須項目が不足" })).toBeVisible();
  await expect(page.getByText("主要機能を2件以上")).toBeVisible();
});

test("validサンプルを適用すると全ゲート成功と3ブラウザE2E成功と証跡が表示される", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "validサンプルを適用" }).click();

  await expect(page.getByText("ready: 必要証跡が揃っています")).toBeVisible();
  await expect(page.getByText("review pass: 次回改善案を確認できます")).toBeVisible();
  await expect(page.getByText("review score: 100")).toBeVisible();
  await expect(page.getByLabel("lint 成功")).toBeVisible();
  await expect(page.getByLabel("doctor:aidd 成功")).toBeVisible();
  await expect(page.getByText("Chromium: 成功")).toBeVisible();
  await expect(page.getByText("Firefox: 成功")).toBeVisible();
  await expect(page.getByText("WebKit: 成功")).toBeVisible();
  await expect(page.getByLabel("terminal evidence").getByText("experiments/aidd-control-plane-mvp-006/artifacts/terminal/e2e.txt")).toBeVisible();
  await expect(page.getByLabel("screenshot evidence").getByText("assets/aidd-control-plane-mvp011-valid.png")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Gap Repair Planner: valid" })).toBeVisible();
  await expect(page.getByText("不足証跡: 0件")).toBeVisible();
  await expect(page.getByText("Evidence Gap Repair Plannerは不足0件です")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Artifact Evidence Binder: valid" })).toBeVisible();
  await expect(page.getByText("Artifact Evidence Binderはvalidです")).toBeVisible();
  await expect(page.getByLabel("binder ci links").getByText("https://github.example.test/aidd-lab/aidd-control-plane/actions/runs/9010", { exact: true })).toBeVisible();
  await expect(page.getByLabel("binder ci links").getByText("https://reports.example.test/aidd-control-plane-mvp-010/playwright/index.html", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "CI Artifact Importer: valid" })).toBeVisible();
  await expect(page.getByLabel("CI Artifact Importer summary").getByText("9f4c2d1a8b7e6c5d4a3b2c1d0e9f8a7b6c5d4e3f")).toBeVisible();
  await expect(page.getByRole("heading", { name: "GitHub Actions Artifact Fetch Plan: valid" })).toBeVisible();
  await expect(page.getByLabel("GitHub Actions Artifact Fetch Plan summary").getByText("9010", { exact: true })).toBeVisible();
  await expect(page.getByText("actions:read", { exact: true })).toBeVisible();
  await expect(page.getByText("playwright-report", { exact: true }).first()).toBeVisible();
});

test("failureサンプルを適用すると壊れたURLと古いログをReview Findingへ戻す", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "failureサンプルを適用" }).click();

  await expect(page.getByText("not ready: failure stateがあります")).toBeVisible();
  await expect(page.getByText("review fail: 次回依頼へ戻す項目があります")).toBeVisible();
  await expect(page.getByLabel("Next AI Task Packet Delta").getByText("次回のCodex Prompt Delta")).toBeVisible();
  await expect(page.getByLabel("e2e 失敗")).toBeVisible();
  await expect(page.getByLabel("doctor:aidd 失敗")).toBeVisible();
  await expect(page.getByText("WebKit: 失敗")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Artifact Evidence Binder: failure" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Gap Repair Planner: failure" })).toBeVisible();
  await expect(page.getByText(/不足証跡: [4-9]件/)).toBeVisible();
  await expect(page.getByLabel("Evidence Gap Repair Planner repairs").getByText("playwright-report不足", { exact: false })).toBeVisible();
  await expect(page.getByLabel("Evidence Gap Repair Planner repairs").getByText("影響するAIDD-Spec artifact: Verification Evidence / Browser E2E Report")).toBeVisible();
  await expect(page.getByLabel("Evidence Gap Repair Planner repairs").getByText("再実行コマンド: pnpm run test:e2e").first()).toBeVisible();
  await expect(page.getByLabel("Evidence Gap Repair Planner repairs").getByText("Codex prompt delta:", { exact: false }).first()).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("Artifact Evidence Binder: CI run URLが壊れています")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("Artifact Evidence Binder: CI artifact URLが不足または壊れています")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("Artifact Evidence Binder: terminal evidenceが古いログです")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("CI Artifact Importer: commit SHAが短すぎます")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("GitHub Actions Fetch Plan: run idが未抽出です")).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("GitHub Actions Fetch Plan: actions:read token scopeが不足しています")).toBeVisible();
  await expect(page.getByRole("heading", { name: "GitHub Actions Artifact Fetch Plan: failure" })).toBeVisible();
  await expect(page.getByLabel("Artifact Evidence Binder issues").getByText("CI Artifact Importer: test jobが失敗")).toBeVisible();
  await expect(page.getByLabel("Next AI Task Packet Delta").getByText("commit SHA", { exact: false }).first()).toBeVisible();
});

test("証跡不足サンプルを適用するとコマンド成功後もreadyではない", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "証跡不足サンプルを適用" }).click({ force: true });

  await expect(page.getByText("not ready: failure stateがあります")).toBeVisible();
  await expect(page.getByLabel("e2e 証跡不足")).toBeVisible();
  await expect(page.getByText("evidence file").first()).toBeVisible();
  await expect(page.getByText("未登録").first()).toBeVisible();
  await expect(page.getByLabel("terminal evidence", { exact: true }).getByText("terminal evidence不足", { exact: true })).toBeVisible();
});

test("RPG Trial 007のCI証跡をDogfood Evidence Binderとして表示する", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "キャラ収集RPG Trial 007 Evidence Binder: valid" })).toBeVisible();
  await expect(page.getByText("RPG dogfood証跡はvalidです")).toBeVisible();
  await expect(page.getByLabel("RPG Trial 007 evidence binder summary").getByText("Character Collection RPG Trial 006 CI")).toBeVisible();
  await expect(page.getByLabel("RPG Trial 007 evidence binder summary").getByText("28623614814")).toBeVisible();
  await expect(page.getByLabel("RPG Trial 007 evidence binder summary").getByText("character-rpg-trial006-coverage")).toBeVisible();
  await expect(page.getByLabel("RPG Trial 007 evidence binder summary").getByText("Chromium / Firefox / WebKit")).toBeVisible();
  await expect(page.getByLabel("RPG Trial 008 AI Task Packet Delta").getByText("artifact API結果をVerification Evidenceへ転記する")).toBeVisible();
});

test("RPG dogfood証跡から次回AI Task Packet再利用計画を表示する", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "次回アプリ案への再利用計画: valid" })).toBeVisible();
  await expect(page.getByText("再利用計画はvalidです")).toBeVisible();
  await expect(page.getByLabel("Dogfood reuse planner requirements").getByText("Non-infringement Boundary")).toBeVisible();
  await expect(page.getByLabel("Dogfood reuse planner requirements").getByText("Mock Backend Contract: api / media / auth / billingの独立service")).toBeVisible();
  await expect(page.getByLabel("Dogfood reuse planner requirements").getByText("root GitHub Actions run 28623614814: success")).toBeVisible();
  await expect(page.getByLabel("Dogfood reuse AI Task Packet seed")).toContainText("mock-api / mock-media / mock-auth / mock-billing");
  await expect(page.getByLabel("Dogfood reuse AI Task Packet seed")).toContainText("初期生成品質と最終収束品質を分けて報告する");
});

test("新規アプリ案からDogfood証跡入りAI Task Packet seedを生成する", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("radio", { name: /学習支援/ }).check({ force: true });
  await page.getByLabel("何を作りたいですか？").fill("音声つき散歩ログアプリ");

  await expect(page.getByRole("heading", { name: "新規アプリ案AI Task Packet seed: valid" })).toBeVisible();
  await expect(page.getByText("アプリ案seedはvalidです")).toBeVisible();
  await expect(page.getByText("学習支援 / 音声つき散歩ログアプリ")).toBeVisible();
  await expect(page.getByLabel("Dogfood app idea packet seed summary").getByText("Non-infringement Boundary")).toBeVisible();
  await expect(page.getByLabel("Dogfood app idea packet seed summary").getByText("mock-api")).toBeVisible();
  await expect(page.getByLabel("Dogfood app idea packet seed summary").getByText("mock-media")).toBeVisible();
  await expect(page.getByLabel("Dogfood app idea packet seed summary").getByText("pnpm run mock:doctor")).toBeVisible();
  await expect(page.getByLabel("Dogfood app idea generated Codex prompt seed")).toContainText("音声つき散歩ログアプリ");
  await expect(page.getByLabel("Dogfood app idea generated Codex prompt seed")).toContainText("初期生成品質と最終収束品質");
});

test("Dogfood Packet Markdown Reviewで3つの反映前Markdownを確認できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("radio", { name: /学習支援/ }).check({ force: true });
  await page.getByLabel("何を作りたいですか？").fill("音声つき散歩ログアプリ");

  await expect(page.getByRole("heading", { name: "Dogfood Packet Markdown Review: valid" })).toBeVisible();
  await expect(page.getByText("Dogfood packet markdown reviewはvalidです")).toBeVisible();
  await expect(page.getByLabel("Dogfood packet markdown review files").getByText("AI_TASK_PACKET.md")).toBeVisible();
  await expect(page.getByLabel("Dogfood packet markdown review files").getByText("CODEX_PROMPT.md")).toBeVisible();
  await expect(page.getByLabel("Dogfood packet markdown review files").getByText("VERIFICATION_PLAN.md")).toBeVisible();
  await expect(page.getByLabel("AI_TASK_PACKET.md Dogfood markdown body preview")).toContainText("Mock Backend Contract");
  await expect(page.getByLabel("CODEX_PROMPT.md Dogfood markdown body preview")).toContainText("初期生成品質と最終収束品質");
  await expect(page.getByLabel("VERIFICATION_PLAN.md Dogfood markdown body preview")).toContainText("gh api repos/:owner/:repo/actions/runs/<run-id>/artifacts");
  await expect(page.getByLabel("Dogfood packet markdown copy bundle")).toContainText("<!-- AI_TASK_PACKET.md -->");
});

async function fillSampleApp(page: import("@playwright/test").Page) {
  await applyLearningTemplate(page);
  await page.getByRole("button", { name: "validサンプルを適用" }).click();
  await page.getByLabel("何を作りたいですか？").fill("StudyFlow");
  await page.getByLabel("誰のどんな問題を解決しますか？ 対象ユーザー").fill("学習を継続したい社会人");
  await page.getByLabel("解決したい問題").fill("教材が散らばり、今日やることを決められない");
}

async function applyLearningTemplate(page: import("@playwright/test").Page) {
  await page.getByRole("radio", { name: /学習支援/ }).check({ force: true });
  await page.getByRole("button", { name: "テンプレートを適用" }).click();
}


test("Verification Run Detailでempty valid failureを切り替え、command別証跡を確認できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Verification Run Detail: empty" })).toBeVisible();
  await expect(page.getByText("まだVerification Run Detailはありません。queue validの後にdetail validでcommand別証跡を生成します。")).toBeVisible();
  await page.getByRole("button", { name: "queue valid" }).click();
  await page.getByRole("button", { name: "detail valid" }).click();
  await expect(page.getByRole("heading", { name: "Verification Run Detail: valid" })).toBeVisible();
  await expect(page.getByText("verification run detailはvalidです")).toBeVisible();
  await expect(page.getByLabel("Verification Run Detail details").getByText("terminalEvidencePath", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Command details").getByText("pnpm run lint: passed")).toBeVisible();
  await expect(page.getByLabel("Command details").getByText("exit code 0").first()).toBeVisible();
  await expect(page.getByLabel("Command details").getByText("artifact path").first()).toBeVisible();
  await expect(page.getByLabel("Review Finding drafts").getByText("command別exit code")).toBeVisible();
  await expect(page.getByLabel("Verification Run Detail details").getByText("chromium / firefox / webkit", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "detail failure" }).click();
  await expect(page.getByRole("heading", { name: "Verification Run Detail: failure" })).toBeVisible();
  await expect(page.getByText("Verification Run Detail Finding:")).toBeVisible();
  await expect(page.getByLabel("Verification Run Detail Finding").getByText("commit SHA不足")).toBeVisible();
  await expect(page.getByLabel("Verification Run Detail Finding").getByText("Firefox除外")).toBeVisible();
  await expect(page.getByLabel("Verification Run Detail Finding").getByText("command別detail不足")).toBeVisible();
  await expect(page.getByLabel("Verification Run Detail Finding").getByText("artifact path不足").first()).toBeVisible();
});

test("Evidence Repair Delta Generatorでfailed evidence_missing timeoutを次回依頼へ戻せる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Evidence Repair Delta Generator: empty" })).toBeVisible();
  await page.getByRole("button", { name: "detail failure" }).click();
  await page.getByRole("button", { name: "repair valid" }).click();
  await expect(page.getByRole("heading", { name: "Evidence Repair Delta Generator: valid" })).toBeVisible();
  await expect(page.getByText("evidence repair delta generatorはvalidです")).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta details").getByText("repair-delta-failed-command: failed")).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta details").getByText("repair-delta-evidence-missing: evidence_missing")).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta details").getByText("repair-delta-timeout: timeout")).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta details").getByText("AI Task Packet delta").first()).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta details").getByText("Codex prompt delta").first()).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta details").getByText("rollback condition").first()).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta details").getByText("Learning Log note").first()).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta details").getByText("chromium / firefox / webkit").first()).toBeVisible();

  await page.getByRole("button", { name: "repair failure" }).click();
  await expect(page.getByRole("heading", { name: "Evidence Repair Delta Generator: failure" })).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta Finding").getByText("source detail不足", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta Finding").getByText("failure category不足").first()).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta Finding").getByText("repair instruction不足").first()).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta Finding").getByText("Firefox除外").first()).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta Finding").getByText("terminal evidence不足", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta Finding").getByText("failure screenshot不足", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta Finding").getByText("AI Task Packet接続不足")).toBeVisible();
  await expect(page.getByLabel("Evidence Repair Delta Finding").getByText("local path / host / private network混入")).toBeVisible();
});

test("Repair Delta Priority Decision Workspaceで採用・保留・却下を分け採用済みだけを次回へ進める", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Repair Delta Priority Decision Workspace: empty" })).toBeVisible();
  await page.getByRole("button", { name: "detail failure" }).click();
  await page.getByRole("button", { name: "repair valid" }).click();
  await page.getByRole("button", { name: "priority valid" }).click();
  await expect(page.getByRole("heading", { name: "Repair Delta Priority Decision Workspace: valid" })).toBeVisible();
  await expect(page.getByText("repair delta priority decision workspaceはvalidです")).toBeVisible();
  await expect(page.getByText("採用 1件 / 保留 1件 / 却下 1件")).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision details").getByText("repair-delta-failed-command: adopted")).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision details").getByText("repair-delta-evidence-missing: deferred")).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision details").getByText("repair-delta-timeout: rejected")).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision details").getByText("AIDD-Spec v0.1")).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision details").getByText("Review Record", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision details").getByText("Learning Log", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision details").getByText("Verification Evidence", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Adopted repair delta export").getByText("採用済みrepair deltaだけを次回へ進める")).toBeVisible();
  await expect(page.getByLabel("Adopted repair delta export").getByText("failed commandはテスト名")).toBeVisible();
  await expect(page.getByLabel("Adopted repair delta export").getByText("失敗したcommandを再実行")).toBeVisible();
  await expect(page.getByLabel("Adopted repair delta export").getByText("evidence_missingは完了扱いにせず")).toHaveCount(0);

  await page.getByRole("button", { name: "priority failure" }).click();
  await expect(page.getByRole("heading", { name: "Repair Delta Priority Decision Workspace: failure" })).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision Finding").getByText("未判断").first()).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision Finding").getByText("理由不足").first()).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision Finding").getByText("証跡不足").first()).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision Finding").getByText("rollback不足").first()).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision Finding").getByText("Firefox除外").first()).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision Finding").getByText("local path/host/private network混入")).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision Finding").getByText("未採用repair deltaがAI Task Packetへ混入")).toBeVisible();
  await expect(page.getByLabel("Repair Delta Priority Decision Finding").getByText("未採用repair deltaがCodex promptへ混入")).toBeVisible();
});

test("Execution Priority Set Builderでexecute_nowだけをCodex prompt previewへ入れる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Execution Priority Set Builder: empty" })).toBeVisible();
  await page.getByRole("button", { name: "detail failure" }).click();
  await page.getByRole("button", { name: "repair valid" }).click();
  await page.getByRole("button", { name: "priority valid" }).click();
  await page.getByRole("button", { name: "execution valid" }).click();
  await expect(page.getByRole("heading", { name: "Execution Priority Set Builder: valid" })).toBeVisible();
  await expect(page.getByText("execution priority set builderはvalidです")).toBeVisible();
  await expect(page.getByText("execute_now 1件 / next_increment 1件 / learning_log 1件")).toBeVisible();
  await expect(page.getByLabel("Execution Priority Set Builder details").getByText("repair-delta-failed-command: execute_now")).toBeVisible();
  await expect(page.getByLabel("Execution Priority Set Builder details").getByText("repair-delta-evidence-missing: next_increment")).toBeVisible();
  await expect(page.getByLabel("Execution Priority Set Builder details").getByText("repair-delta-timeout: learning_log")).toBeVisible();
  await expect(page.getByLabel("Execution Codex prompt preview").getByText("execute_nowに選ばれたrepair deltaだけ")).toBeVisible();
  await expect(page.getByLabel("Execution Codex prompt preview").getByText("失敗したcommandを再実行")).toBeVisible();
  await expect(page.getByLabel("Execution Codex prompt preview").getByText("evidence_missingは完了扱いにせず")).toHaveCount(0);
  await expect(page.getByLabel("Execution Codex prompt preview").getByText("Firefox除外のtimeout対策は採用しない")).toHaveCount(0);
  await expect(page.getByLabel("Execution Codex prompt preview").getByText("Next increment queue")).toBeVisible();
  await expect(page.getByLabel("Execution Codex prompt preview").getByText("Learning Log returns")).toBeVisible();
  await expect(page.getByLabel("Execution Codex prompt preview").getByText("AIDD-Spec v0.1")).toBeVisible();

  await page.getByRole("button", { name: "execution failure" }).click();
  await expect(page.getByRole("heading", { name: "Execution Priority Set Builder: failure" })).toBeVisible();
  await expect(page.getByLabel("Execution Priority Set Finding").getByText("優先順位重複")).toBeVisible();
  await expect(page.getByLabel("Execution Priority Set Finding").getByText("実行予算不足").first()).toBeVisible();
  await expect(page.getByLabel("Execution Priority Set Finding").getByText("検証コマンド不足").first()).toBeVisible();
  await expect(page.getByLabel("Execution Priority Set Finding").getByText("rollback不足").first()).toBeVisible();
  await expect(page.getByLabel("Execution Priority Set Finding").getByText("未採用delta混入")).toBeVisible();
  await expect(page.getByLabel("Execution Priority Set Finding").getByText("Firefox除外").first()).toBeVisible();
  await expect(page.getByLabel("Execution Priority Set Finding").getByText("local path/host/private network混入")).toBeVisible();
});

test("One-Run Handoff Pack Reviewerでexecute_nowだけを次の1回の手渡しパックへ変換できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "One-Run Handoff Pack Reviewer: empty" })).toBeVisible();
  await page.getByRole("button", { name: "detail failure" }).click();
  await page.getByRole("button", { name: "repair valid" }).click();
  await page.getByRole("button", { name: "priority valid" }).click();
  await page.getByRole("button", { name: "execution valid" }).click();
  await page.getByRole("button", { name: "handoff valid" }).click();
  await expect(page.getByRole("heading", { name: "One-Run Handoff Pack Reviewer: valid" })).toBeVisible();
  await expect(page.getByText("one-run handoff pack reviewerはvalidです")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff source").getByText("source execution set", { exact: true })).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff source").getByText("execute_now delta id", { exact: true })).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff source").getByText("repair-delta-failed-command")).toBeVisible();
  await expect(page.getByLabel("AI Task Packet patch").getByText("AI Task Packetへ")).toBeVisible();
  await expect(page.getByLabel("Codex prompt").getByText("One-Run Handoff Pack Reviewerでvalid")).toBeVisible();
  await expect(page.getByLabel("Verification commands").getByText("pnpm run lint", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Verification commands").getByText("pnpm run typecheck", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Verification commands").getByText("pnpm run test", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Verification commands").getByText("pnpm run build", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Verification commands").getByText("pnpm run test:e2e", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Verification commands").getByText("pnpm run doctor:aidd", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Browser projects").getByText("Chromium / Firefox / WebKit")).toBeVisible();
  await expect(page.getByLabel("Required evidence").getByText("terminal")).toBeVisible();
  await expect(page.getByLabel("Required evidence").getByText("empty screenshot")).toBeVisible();
  await expect(page.getByLabel("Required evidence").getByText("valid screenshot")).toBeVisible();
  await expect(page.getByLabel("Required evidence").getByText("failure screenshot")).toBeVisible();
  await expect(page.getByLabel("Required evidence").getByText("Playwright report")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff source").getByText("note article angle", { exact: true })).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff source").getByText("AIDD-Spec / Control Plane MVP接続", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "handoff failure" }).click();
  await expect(page.getByRole("heading", { name: "One-Run Handoff Pack Reviewer: failure" })).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff Finding").getByText("source execution set / execute_now delta id不足")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff Finding").getByText("AI Task Packet patch不足")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff Finding").getByText("Codex prompt不足")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff Finding").getByText("pnpm run lint不足")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff Finding").getByText("Firefox除外または1ブラウザだけの浅い検証")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff Finding").getByText("terminal evidence不足")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff Finding").getByText("empty screenshot evidence不足")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff Finding").getByText("rollback不足")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff Finding").getByText("AIDD-Spec v0.1接続不足")).toBeVisible();
  await expect(page.getByLabel("One-Run Handoff Finding").getByText("local path / host / private network / private network URL混入")).toBeVisible();
});

test("Codex Run Start Receipt Auditorで実行開始レシートのempty valid failureを監査できる", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Codex Run Start Receipt Auditor: empty" })).toBeVisible();
  await page.getByRole("button", { name: "detail failure" }).click();
  await page.getByRole("button", { name: "repair valid" }).click();
  await page.getByRole("button", { name: "priority valid" }).click();
  await page.getByRole("button", { name: "execution valid" }).click();
  await page.getByRole("button", { name: "handoff valid" }).click();
  await page.getByRole("button", { name: "receipt valid" }).click();
  await expect(page.getByRole("heading", { name: "Codex Run Start Receipt Auditor: valid" })).toBeVisible();
  await expect(page.getByText("codex run start receipt auditorはvalidです")).toBeVisible();
  await expect(page.getByLabel("実行開始レシート").getByText("source handoff pack id", { exact: true })).toBeVisible();
  await expect(page.getByLabel("実行開始レシート").getByText("Codex command", { exact: true })).toBeVisible();
  await expect(page.getByLabel("実行開始レシート").getByText("codex exec --sandbox danger-full-access")).toBeVisible();
  await expect(page.getByLabel("実行開始レシート").getByText("sandbox mode", { exact: true })).toBeVisible();
  await expect(page.getByLabel("実行開始レシート").getByText("started at", { exact: true })).toBeVisible();
  await expect(page.getByLabel("実行開始レシート").getByText("operator", { exact: true })).toBeVisible();
  await expect(page.getByLabel("検証継承").getByText("pnpm run lint", { exact: true })).toBeVisible();
  await expect(page.getByLabel("検証継承").getByText("pnpm run typecheck", { exact: true })).toBeVisible();
  await expect(page.getByLabel("検証継承").getByText("pnpm run test", { exact: true })).toBeVisible();
  await expect(page.getByLabel("検証継承").getByText("pnpm run build", { exact: true })).toBeVisible();
  await expect(page.getByLabel("検証継承").getByText("pnpm run test:e2e", { exact: true })).toBeVisible();
  await expect(page.getByLabel("検証継承").getByText("pnpm run doctor:aidd", { exact: true })).toBeVisible();
  await expect(page.getByLabel("検証継承").getByText("Chromium / Firefox / WebKit")).toBeVisible();
  await expect(page.getByLabel("証跡保存先").getByText("experiments/aidd-control-plane-mvp-040/artifacts")).toBeVisible();
  await expect(page.getByLabel("証跡保存先").getByText("aidd-control-plane-mvp040-empty.png")).toBeVisible();
  await expect(page.getByLabel("証跡保存先").getByText("aidd-control-plane-mvp040-valid.png")).toBeVisible();
  await expect(page.getByLabel("証跡保存先").getByText("aidd-control-plane-mvp040-failure.png")).toBeVisible();
  await expect(page.getByLabel("証跡保存先").getByText("aidd-control-plane-mvp040-terminal-evidence.png")).toBeVisible();
  await expect(page.getByLabel("rollback停止条件").getByText("実行を止め")).toBeVisible();
  await expect(page.getByLabel("Receipt AIDD-Spec接続").getByText("AIDD-Spec v0.1")).toBeVisible();
  await expect(page.getByLabel("Receipt AIDD-Spec接続").getByText("standards/aidd-control-plane-mvp-v0.1.md")).toBeVisible();

  await page.getByRole("button", { name: "receipt failure" }).click();
  await expect(page.getByRole("heading", { name: "Codex Run Start Receipt Auditor: failure" })).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("危険command")).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("sandbox不足")).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("evidence root不足")).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("Firefox除外")).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("aidd-control-plane-mvp040-failure.png不足")).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("terminal screenshot不足")).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("failure screenshot不足")).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("rollback不足")).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("AIDD-Spec v0.1接続不足")).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("standards/aidd-control-plane-mvp-v0.1.md接続不足")).toBeVisible();
  await expect(page.getByLabel("Codex Run Start Receipt Finding").getByText("local path / host / private network URL混入")).toBeVisible();
});
