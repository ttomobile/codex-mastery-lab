# AIDD Control Plane MVP Design v0.1

> AIDD-Specに沿ったAIエージェント開発ワークフローを、誰でも辿れるSaaSにするためのMVP設計。

## 1. Product Vision

AIDD Control Planeは、AIにコードを書かせるだけのSaaSではない。

主価値は、AI駆動開発で必要な入力・出力・検証証跡・レビュー・学習ログを一つの流れとして扱うことにある。

```text
Product Brief
  -> AI Task Packet
  -> Agent Run
  -> Verification Evidence
  -> Review Record
  -> Learning Log
  -> Spec Improvement
```

## 2. MVPで解く問題

AIエージェント活用時の初期問題は次である。

- 依頼文が曖昧
- 非ゴールがない
- 状態設計がない
- テスト条件がない
- 完了証拠が残らない
- 失敗が次回の指示に戻らない

MVPではこの流れをフォームとチェックリストで標準化する。

## 3. MVP機能

| 機能 | 目的 | v0.1範囲 |
| --- | --- | --- |
| Product Brief Builder | 何を作るかを短く固定する | name/user_problem/non_goals |
| AI Task Packet Builder | AIへ渡す入力を作る | YAML/Markdown出力 |
| Contract Checker | 必須項目の不足を検出する | static validation |
| Agent Runbook Generator | Codex等へ渡すコマンドを生成する | prompt + command |
| Evidence Collector | 実行ログとartifactを紐づける | 手動アップロード/パス入力 |
| Review Record | 結果を採点する | pass/fail/findings |
| Learning Log | 次回改善点を残す | spec_updates_needed |
| App Type Templates | アプリ種別ごとの推奨機能・状態契約・品質ゲート・リスク・証跡要件を補助する | video-service / learning-support / booking-management / internal-request |
| Verification Run Tracker | AI Task Packetと実行ログを結びつけ、品質ゲートの未実行・成功・失敗・証跡不足を見える化する | lint / typecheck / test / build / e2e / doctor:aidd、3ブラウザE2E、terminal evidence、screenshot evidence |
| Review & Learning Log Generator | Verification Runの失敗・証跡不足をReview Findingへ分類し、次回AI Task Packet Deltaへ戻す | review score、findings、needed upstream information、spec updates needed、Codex prompt delta |
| Artifact Evidence Binder | terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを同じ検証単位で束ねる | empty / valid / failure、古いログ、壊れたURL、不足証跡 |
| CI Artifact Importer | CI run summaryをVerification Evidenceへ取り込み、commit SHA、workflow、job、artifact、Playwright report URLを確認する | 手入力/サンプル入力、短いcommit SHA、失敗job、不足artifactの検出 |
| GitHub Actions Artifact Fetch Plan | run URLからCI証跡取得経路を生成し、API endpoint、token scope、必要artifactをレビューする | owner / repo / run id解析、jobs API、artifacts API、logs URL、actions:read、contents:read、不足artifact取得計画の検出 |
| Fixture-driven Mock CI Service | CI証跡の外部境界をfixtureとmock service contractで再現する | empty / valid / failure / timeout / rate_limit fixture、Docker Compose経路、Node fallback経路、`/health` / `/state` / `/__control/state`、同一contract検査 |
| CI Workflow Artifact Auditor | GitHub Actions workflowが品質gateとartifact保存をVerification Evidenceとして残すか静的監査する | lint / typecheck / test / build / doctor:aidd / mock:doctor / 3ブラウザE2E、coverage / playwright-report / test-results / terminal evidence artifact、Review FindingとAI Task Packet Deltaへの変換 |
| Spec Update Proposal Queue | Review FindingとLearning Logを標準更新候補へ変換し、AIDD-Spec / Control Plane標準 / AI Task Packet / Codex prompt deltaへ戻す | empty / valid / failure、対象標準文書、target field、priority、acceptance criteria、verification command、不足候補の検出 |
| AI Task Packet Delta Apply Preview | Spec Update Proposalを採用した場合に、次回AI Task Packet / Codex prompt / Verification Planがどう変わるかを採用前にレビューする | empty / valid / failure、target packet section、before/after summary、added acceptance criteria、verification commands、Codex prompt patch、rollback condition、不足差分の検出 |
| Delta Decision Review | AI Task Packet Deltaを採用 / 却下 / 保留に分け、誰が・いつ・なぜ判断したかをReview Recordとして残す | empty / valid / failure、decision owner、decision reason、decided at、next action、review evidence、rollback confirmed、採用済みdeltaだけを次回packetへ進める |
| Adopted Delta Markdown Exporter | 採用済みdeltaだけを次回AI Task Packet Markdown / Verification Plan / Codex promptへ書き出す | empty / valid / failure、Markdown section、verification plan patch、Codex prompt patch、rollback condition、review evidence、未採用deltaのLearning Log戻し、未採用delta混入検出 |
| Packet File Apply Planner | 採用済みdeltaのMarkdown exportを実ファイルへ反映する前に、対象ファイル・追記位置・before/after差分・検証・rollbackを確認する | empty / valid / failure、AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.md、insert position、verification command、rollback step、review evidence、未採用delta混入検出 |
| Packet Draft Workspace | Packet File Apply Plannerの適用計画から、次回AIへ渡す4種類のドラフト本文とコピー用Codex promptを実ファイル反映前に確認する | empty / valid / failure、AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.md、draft body、source delta id、差分サマリ、実行前チェック、verification command、rollback condition、AIDD-Spec接続、file target衝突、未採用delta混入検出 |
| Safe Patch Review Workspace | Packet Draft Workspaceのドラフト本文を実ファイルへ反映する前に、安全なpatch候補としてレビューする | empty / valid / failure、patch id、target file、source draft id、diff summary、diff size、apply command、verification command、rollback command、reviewer checklist、AIDD-Spec接続、危険なtarget path、diff size過大、未採用delta混入、ローカルパス混入検出 |
| Diff Bundle & Rollback Evidence Workspace | Safe Patch Review Workspaceで承認されたpatch候補を自動適用する前に、diff bundle、dry-run結果、rollback evidenceを保存する | empty / valid / failure、bundle id、source patch id、target file、before hash、after hash、diff bundle path、dry-run command/status、rollback evidence path、rollback verified command、verification command、reviewer checklist、AIDD-Spec接続、危険なtarget path、ローカルパス混入、rollback evidence不足検出 |
| Diff Bundle Decision Ledger | Diff Bundle & Rollback Evidence Workspaceで束ねたbundleを、採用 / 却下 / 保留として判断し、理由・判断者・証跡・次の行動をReview Recordへ保存する | empty / valid / failure、bundle id、decision、decision owner、decision reason、decided at、review evidence path、next action、rollback confirmed、verification command、AIDD-Spec接続、未判断・理由不足・証跡不足・rollback未確認・local path/host混入・採用済みverification不足検出 |
| Adopted Bundle Exporter | Decision Ledgerで採用済みになったbundleだけを次回AI Task Packet / Verification Plan / Codex promptへ書き出す直前にレビューする | empty / valid / failure、source bundle id、target packet section、Markdown section、Verification Plan patch、Codex prompt patch、rollback condition、review evidence、Learning Log戻し、未採用bundle混入・証跡不足・rollback不足・local path/host混入検出 |
| Exported Packet Preflight Reviewer | Adopted Bundle Exporterで書き出した次回AI Task Packet / Verification Plan / Codex promptをCodexへ渡す直前にレビューする | empty / valid / failure、packet id、source export id、source decision status、target file、Markdown body、browser projects、verification depth、evidence paths、rollback plan、AIDD-Spec connections、未採用bundle混入・Firefox除外・浅い検証・local path/host/tailnet混入・rollback不足・evidence不足・AIDD-Spec接続不足検出 |
| Dogfood Packet Markdown Review | 新規アプリ案seedをAI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.mdへ反映する前に、Markdown本文、差分サマリ、実行前チェック、検証コマンド、rollback条件としてレビューする | source app idea、target file、heading、body preview、diff summary、preflight checks、verification command、rollback condition、copy bundle、実在IP/公式素材/ローカルパス/host名/プライベートネットワークURL/浅い検証/Firefox除外の反映前確認 |
| Packet Apply Command Composer | 承認済みMarkdownを実ファイルへ反映する直前に、apply command、dry-run、verification、rollback、evidence pathを確認する | empty / valid / failure、target file、apply command、dry-run command、verification command、rollback command、terminal evidence path、preflight checks、未レビューMarkdown混入・危険なtarget path・rollback不足・検証不足の検出 |
| Run Authorization Gate | preflight validなpacketをCodex run queueへ積む前に、誰が・どの条件で実行許可したかをReview Recordとして残す | empty / valid / failure、preflight status、approver、authorization reason、Codex command、sandbox mode、required verification commands、Chromium / Firefox / WebKit、evidence path、rollback plan、AIDD-Spec connections、preflight failure・未承認・危険なcommand・Firefox除外・浅い検証・local path/host/tailnet/private network URL混入・証跡不足・rollback不足の検出 |
| Codex Run Queue | Run Authorization Gateで承認されたCodex実行を、実行待ち・実行中・成功・失敗・証跡不足として追跡し、Verification Evidence / Review Record / Learning Logへ戻す | empty / valid / failure、source authorization id、waiting/running/succeeded/failed/evidence_missing、Codex command、sandbox mode、required verification commands、actual results、Chromium / Firefox / WebKit、terminal/screenshot/playwright evidence、retry policy、rollback plan、AIDD-Spec connections、危険command・Firefox除外・浅い検証・証跡不足・rollback不足の検出 |
| Run Result Review Synthesizer | Codex Run Queueの実行結果を、標準Review Finding、AI Task Packet delta、Codex prompt delta、Verification command、Learning Logへ合成する | empty / valid / failure、source run id、outcome、score、terminal evidence、screenshot evidence、browser coverage、doctor:aidd、rollback、privacy、prompt delta、needed upstream info、standard update、codex prompt delta、verification command、local path/host/tailnet混入検出 |
| Next Increment Planner | Run Result ReviewとLearning Logを、次に実行する1インクリメント計画へ畳み込む | empty / valid / failure、source review id、source run id、recommended increment、priority reason、target artifacts、acceptance criteria、verification commands、required evidence、Codex prompt draft、rollback condition、note article angle、Learning Log接続、AIDD-Spec接続、source review不足・priority不足・3ブラウザE2E不足・terminal/failure screenshot不足・rollback不足・local path/host/tailnet/private URL混入検出 |
| Verification Run Detail | Codex Run Queueの各itemをcommand別exit code、artifact path、失敗分類、修正指示へ展開する | empty / valid / failure、source queue item、source run status、commit SHA、command status、exit code、duration、artifact path、failure category、repair instruction、terminal/screenshot/playwright evidence、Chromium / Firefox / WebKit、Review Finding draft、AIDD-Spec接続、commit SHA不足・command別detail不足・artifact path不足・失敗分類不足・修正指示不足・Firefox除外・証跡不足検出 |
| Evidence Repair Delta Generator | Verification Run Detailのfailed / evidence_missing / timeoutを次回AI Task Packet delta、Codex prompt delta、検証コマンド、rollback条件、Learning Logへ戻す | empty / valid / failure、source detail id、repair delta id、failure category、AI Task Packet delta、Codex prompt delta、verification command、rollback condition、Learning Log note、terminal evidence、failure screenshot、Chromium / Firefox / WebKit、AIDD-Spec接続、source detail不足・失敗分類不足・修正指示不足・Firefox除外・terminal/failure screenshot不足・local path/host/tailnet混入検出 |
| Repair Delta Priority Decision Workspace | Evidence Repair Deltaを次の1インクリメントへ採用 / 保留 / 却下として判断し、採用済みdeltaだけを次回AI Task Packet / Codex promptへ進める | empty / valid / failure、source repair delta id、decision、priority reason、decision owner、review evidence、rollback condition、next packet section、Codex prompt patch、Verification Evidence接続、Review Record接続、Learning Log接続、未判断・理由不足・証跡不足・rollback不足・Firefox除外・未採用delta混入・local path/host/tailnet混入検出 |
| Execution Priority Set Builder | 採用済みrepair deltaを、次の1回で実行するもの / 次回送り / Learning Log戻しへ分け、Codex prompt previewへexecute_nowだけを入れる | empty / valid / failure、source decision workspace、execute_now / next_increment / learning_log、priority、execution budget、verification commands、rollback condition、Codex prompt preview、Review Record接続、Learning Log接続、Verification Evidence接続、優先順位重複・実行予算不足・検証コマンド不足・rollback不足・Firefox除外・未採用delta混入・execute_now以外のprompt混入・local path/host/tailnet混入検出 |
| One-Run Handoff Pack Reviewer | execute_nowに絞ったrepair deltaを、次の1回のCodex実行へ渡す手渡しパックとして、AI Task Packet patch / Codex prompt / 検証 / 証跡 / rollback / 記事化観点まで確認する | empty / valid / failure、source execution set、execute_now delta id、AI Task Packet patch、Codex prompt、verification commands、Chromium / Firefox / WebKit、terminal / empty / valid / failure screenshot / Playwright report、rollback condition、note article angle、AIDD-Spec接続、source不足・patch不足・prompt不足・検証不足・Firefox除外・証跡不足・rollback不足・local path/host/tailnet/private URL混入検出 |

## 4. 初期データモデル

```ts
type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

type AITaskPacket = {
  id: string;
  projectId: string;
  specVersion: "AIDD-Spec v0.1";
  conformanceTarget: "L0" | "L1" | "L2" | "L3" | "L4";
  productBrief: ProductBrief;
  experienceContract: ExperienceContract;
  qualityGates: QualityGate[];
  expectedOutput: ExpectedOutput;
};

type VerificationEvidence = {
  id: string;
  taskPacketId: string;
  commandLogs: CommandLog[];
  reports: EvidenceFile[];
  screenshots: EvidenceFile[];
  ciRuns: CiRun[];
};

type ReviewRecord = {
  id: string;
  taskPacketId: string;
  score: number;
  passed: boolean;
  findings: Finding[];
  remainingRisks: string[];
};

type LearningLog = {
  id: string;
  taskPacketId: string;
  whatWorked: string[];
  whatFailed: string[];
  specUpdatesNeeded: string[];
};
```

## 5. 初期画面

1. Dashboard
2. New Project
3. AI Task Packet Builder
4. Packet Preview
5. Agent Runbook
6. Evidence Upload
7. Review Dashboard
8. Learning Log

## 6. MVP Tech Stack

- Next.js + TypeScript
- pnpm
- Local JSON persistence for first demo
- Later: Postgres/Supabase or SQLite/Turso
- Playwright for workflow E2E
- GitHub Actions for CI

## 7. ライブ配信で実演する順序

1. AIDD-Spec v0.1を見せる
2. AI Task Packetをフォームで作る構想を説明する
3. まず手動YAMLでIssueBrief LiteをCodexへ渡す
4. Codex出力を検証する
5. その流れをSaaSの画面に落とす
6. MVPの最初の画面をAIエージェントに作らせる
7. Verification Evidenceを保存する
8. Review Recordを書く
9. Learning Logから次回タスクを作る

## 8. 受け入れ条件

MVP v0.1は次を満たせば成功とする。

- Product Briefを入力できる
- AI Task Packet Markdown/YAMLを生成できる
- 必須項目不足を表示できる
- Codexへ渡すRunbookを生成できる
- Evidence/Review/Learning Logの雛形を作れる
- 1つのサンプルタスクでEnd-to-Endの流れを説明できる

## 9. 今後のSaaS化

v0.2以降で追加する。

- JSON Schema validation
- GitHub Actions連携
- Artifact upload API
- 複数AIエージェント比較
- Spec diff / improvement proposal
- Team review workflow
- Template marketplace
