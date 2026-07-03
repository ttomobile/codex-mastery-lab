import { expect, test } from "@playwright/test";

const mockCiServiceUrl = process.env.NEXT_PUBLIC_MOCK_CI_SERVICE_URL ?? "http://127.0.0.1:4314";

test.beforeEach(async ({ request }) => {
  await request.post(`${mockCiServiceUrl}/__control/state`, { data: { scenario: "empty" } });
});

test("MVP 027の初期empty stateとworkflow artifact監査と標準更新候補Queueが表示される", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Project Intake WizardからDiff Bundle & Rollback Evidence Workspaceまで", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Diff Bundle & Rollback Evidence Workspace: empty" })).toBeVisible();
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
  await page.getByRole("button", { name: "decision valid" }).click();
  await expect(page.getByRole("heading", { name: "Delta Decision Review: valid" })).toBeVisible();
  await expect(page.getByText("delta decision reviewはvalidです")).toBeVisible();
  await expect(page.getByText("採用: 1件 / 却下: 1件 / 保留: 1件")).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review details").getByText("decision owner", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review details").getByText("decision reason", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("Delta Decision Review details").getByText("rollback confirmed", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("次回AI Task Packetに入る採用済みdelta")).toContainText("delta-mvp019-001");

  await page.getByRole("button", { name: "decision failure" }).click();
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
  await page.getByRole("button", { name: "decision valid" }).click();
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
  await page.getByRole("button", { name: "decision valid" }).click();
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
