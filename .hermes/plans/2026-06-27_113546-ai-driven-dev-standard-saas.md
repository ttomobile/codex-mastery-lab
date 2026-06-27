# AI駆動開発時代の標準プロセス仕様とSaaS化 検証計画

> **For Hermes:** Use this as the strategic operating plan for Codex Mastery Lab. Daily experiments should validate one assumption in this plan and produce a note-grade article draft.

**Goal:** Web/スマホアプリ開発におけるAI駆動開発時代の「標準プロセス」「標準成果物」「標準評価基準」を体系化し、その標準に沿って開発を支援するSaaSの仕様へ落とし込む。

**Architecture:** まず標準仕様を作る。次にCodex/Hermesを使って標準プロセスを小さな実験で検証する。最後に、その標準を強制・可視化・自動化するSaaSプロダクトへ展開する。

**Tech Stack:** Codex CLI, Hermes Agent, Git, Markdown specs, pytest/Playwright, lightweight web app prototypes, future SaaS stack TBD（Next.js/FastAPI/Postgres候補）

---

## 1. 現時点の仮説

AI駆動開発時代の本質は「AIがコードを書くこと」ではない。

本質は、**人間・AI・テスト・レビュー・仕様・運用ログの責務分担を標準化し、AIが参加しても破綻しない開発プロセスを作ること**である。

従来の開発標準は、主に人間チームを前提としていた。

- 要件定義書
- 基本設計書
- 詳細設計書
- テスト仕様書
- チケット
- PR
- レビュー
- リリースノート

しかしAI駆動開発では、これだけでは足りない。

AIが実装主体になると、次の成果物が必要になる。

- AIに渡せる粒度の仕様
- AIが迷わない制約条件
- AIが変更してよい境界
- AI実行ログ
- AIが立てた仮説とその検証結果
- 人間レビューのチェックポイント
- 失敗時に再利用できるプロンプト改善ログ
- 「実装できた」ではなく「運用可能」と言える証拠

したがって作るべき標準は、単なるドキュメント雛形ではなく、**AIが参加する開発システムのプロトコル**である。

---

## 2. 作るべき業界標準仕様の仮称

仮称：**AIDD-Spec: AI-Driven Development Standard Specification**

目的：Web/スマホアプリ開発において、AIエージェントを安全に使い、再現可能な成果物を出すための標準プロセスと標準成果物を定義する。

### 2.1 AIDD-Spec が扱う範囲

1. 企画
2. 要件定義
3. 仕様分解
4. UX/UI設計
5. データ設計
6. API設計
7. 実装計画
8. AI実装指示
9. テスト設計
10. AI生成コードレビュー
11. セキュリティレビュー
12. リリース判定
13. 運用・改善
14. 失敗ログからの標準改善

### 2.2 AIDD-Spec が扱わない範囲

- 特定LLMベンダーの使い方だけ
- プロンプト集だけ
- コード生成Tipsだけ
- 人間レビューなしの完全自動本番リリース
- 規約違反や法務リスクを無視した自動化

---

## 3. 標準成果物の候補

AI駆動開発では、以下を標準成果物にするべきか検証する。

### 3.1 Product Brief

**目的:** 何を、誰のために、なぜ作るか。

必須項目:

- Target user
- Pain
- Job to be done
- Business objective
- Non-goals
- Success metric
- Risk

検証観点:

- Codexがこの情報だけで実装に進むと破綻するか
- どの項目が欠けると手戻りが増えるか

### 3.2 AI-Ready Requirement Spec

**目的:** AIに渡せる粒度まで要件を分解する。

必須項目:

- User story
- Acceptance criteria
- Edge cases
- Out of scope
- Data constraints
- Error states
- Accessibility requirement
- Security requirement

検証観点:

- 通常の要件とAI-ready要件でCodex出力品質がどれだけ変わるか
- Acceptance criteriaの粒度とテスト生成品質の関係

### 3.3 Design Contract

**目的:** UI/UXの曖昧さをAIが勝手に埋めすぎないようにする。

必須項目:

- Screen list
- User flow
- Component responsibility
- Empty/loading/error states
- Copy tone
- Responsive behavior
- Accessibility notes

検証観点:

- スクリーン定義なしで実装させた場合との比較
- 画像/ワイヤー/文章仕様のどれがAI実装に強いか

### 3.4 System Boundary Map

**目的:** AIが触ってよい境界と触ってはいけない境界を定義する。

必須項目:

- Editable files
- Forbidden files
- External services
- Secrets handling
- Database migration policy
- Test command
- Rollback policy

検証観点:

- 境界指定がないとCodexがどこまで広げるか
- Forbidden filesを明記すると逸脱が減るか

### 3.5 AI Task Packet

**目的:** 1回のAI実装単位を標準化する。

必須項目:

- Task ID
- Objective
- Context
- Files allowed
- Files forbidden
- Test first or not
- Required commands
- Completion criteria
- Expected diff size
- Review checklist

検証観点:

- 1プロンプトに複数目的を入れた場合との比較
- diff size指定が変更範囲を狭めるか

### 3.6 Verification Evidence

**目的:** 「できました」ではなく、できた証拠を残す。

必須項目:

- Commands run
- Test output
- Diff summary
- Screenshots
- Known failures
- Human review notes
- Release readiness

検証観点:

- Codexの自己申告と実際の検証結果の乖離
- 証拠テンプレがレビュー時間を減らすか

### 3.7 Learning Log

**目的:** 失敗を次回プロンプトや標準に反映する。

必須項目:

- What failed
- Why it failed
- Prompt weakness
- Spec weakness
- Guardrail to add
- Reusable pattern

検証観点:

- 失敗ログを明示的に次回プロンプトへ反映すると成功率が上がるか
- Hermes skill化できる失敗パターンは何か

---

## 4. 検証すべき根本問い

### Q1. AI駆動開発では、仕様の粒度はどこまで細かくすべきか？

仮説:

- 人間向け仕様よりも、AI向け仕様は「禁止事項」「境界」「検証コマンド」が重要。
- 仕様を細かくしすぎると、AIの探索能力を殺す。
- 仕様が粗すぎると、AIは勝手な前提で進む。

検証:

- 同じ小機能を3種類の仕様粒度でCodexに実装させる。
  1. 雑な自然文
  2. 通常のチケット
  3. AIDD AI Task Packet
- 比較指標:
  - diffの大きさ
  - テスト成功率
  - 仕様逸脱数
  - レビュー指摘数
  - 実装時間

### Q2. AIにテストを先に書かせるべきか、人間がテストを書くべきか？

仮説:

- 完全にAI任せのテストは、実装に都合のよいテストになりやすい。
- しかし人間がAcceptance criteriaを明確に書けば、AI生成テストでも実用レベルになる。

検証:

- 同じ仕様で以下を比較する。
  1. Codexが実装とテストを同時生成
  2. Codexがテストを先に生成し、別プロンプトで実装
  3. Hermesがテスト観点を作り、Codexがテスト→実装

### Q3. AI実装のレビューは何段階に分けるべきか？

仮説:

- 1回のレビューで品質・仕様・セキュリティを全部見ると漏れる。
- レビューは最低3層に分けるべき。

提案レビュー層:

1. Spec Compliance Review: 仕様を満たしたか
2. Code Quality Review: 保守性・単純性・設計
3. Risk Review: セキュリティ・データ・運用リスク

検証:

- Codex実装をHermesが3層レビューする。
- 1層レビューとの差分を見る。

### Q4. Web/スマホ開発でAIが壊しやすい領域はどこか？

仮説:

壊れやすい順:

1. 認証/認可
2. DB migration
3. 状態管理
4. 非同期処理
5. エラーハンドリング
6. UI edge states
7. アクセシビリティ
8. 課金/決済
9. プッシュ通知
10. モバイル権限

検証:

- 各領域で小さな機能を作らせ、失敗パターンを分類する。
- 失敗をAIDD-Specのチェックリストへ還元する。

### Q5. AI駆動開発SaaSに必要な最小機能は何か？

仮説:

最初に作るべきSaaSは「AIコーディングエージェントそのもの」ではない。

最初に作るべきは、**AIに安全に仕事を渡し、結果を検証し、証拠を残す開発プロセス管理SaaS**である。

---

## 5. SaaSプロダクト仮説

仮称：**AIDD Control Plane**

### 5.1 誰のためのSaaSか

Primary persona:

- 小規模開発会社のCTO
- AI駆動開発を導入したいスタートアップ創業者
- 受託開発チームのテックリード
- 1人〜少人数でWeb/スマホアプリを量産したい開発者

### 5.2 解く課題

現在のAI開発は、成果物が散らばる。

- 要件はSlack
- プロンプトはチャット履歴
- 実装はGitHub
- テスト結果はターミナルログ
- スクショはローカル
- レビューはPRコメント
- 失敗知見は人間の記憶

これでは、チームで再現可能な開発プロセスにならない。

AIDD Control Planeは、これらを1つのプロセスとして束ねる。

### 5.3 最小機能

MVPで必要な機能:

1. Project Brief作成
2. AI-Ready Requirement Spec作成
3. AI Task Packet生成
4. Codex/Hermes実行ログ取り込み
5. Git diff取り込み
6. Test output取り込み
7. Review checklist
8. Verification Evidence生成
9. Learning Log生成
10. 次回プロンプト改善提案

### 5.4 やらないこと

MVPではやらない:

- 独自IDE
- 独自LLM
- 本番デプロイ自動化
- 決済/課金管理
- すべてのPM機能
- Jira/GitHub完全代替

最初は「AI駆動開発の標準成果物を生成・検証・蓄積する薄いControl Plane」でよい。

---

## 6. 検証ロードマップ

## Phase 1: 標準仕様の骨格を作る

期間目安: 1週間

目的:

- AIDD-Spec v0.1をMarkdownで定義する。
- 標準成果物テンプレートを作る。
- Codex Mastery Labの日次記事をこの標準仕様に沿わせる。

成果物:

- `standards/AIDD-Spec-v0.1.md`
- `standards/templates/product-brief.md`
- `standards/templates/ai-ready-requirement.md`
- `standards/templates/ai-task-packet.md`
- `standards/templates/verification-evidence.md`
- `standards/templates/learning-log.md`

日次記事テーマ:

1. AI駆動開発に標準仕様が必要な理由
2. AIに渡せる要件定義とは何か
3. AI Task Packetの最小構成
4. AI実装ログは何を残すべきか
5. AI時代のレビューは3層に分けるべきか

## Phase 2: 小さなWebアプリで標準を検証する

期間目安: 2週間

目的:

- 小さなWebアプリを題材に、AIDD-Specに沿った開発が有効か検証する。

題材候補:

- Issue tracker mini
- Personal CRM mini
- Habit tracker mini
- Tiny SaaS billing mock
- Mobile-first memo app

検証方法:

- 同じ機能を「雑なプロンプト」と「AIDD Task Packet」で実装させる。
- diff、テスト、レビュー指摘、修正回数を比較する。

成果物:

- 実験repo
- 比較表
- 失敗パターン集
- AIDD-Spec改善版

## Phase 3: スマホアプリ/モバイルWeb固有の検証

期間目安: 2週間

目的:

- Webだけでなくスマホアプリ/モバイルUXに必要な成果物を洗い出す。

検証領域:

- レスポンシブUI
- タッチ操作
- オフライン/通信失敗
- 権限
- Push通知設計
- App Store/Google Play制約
- React Native / Expo / PWA の差分

成果物:

- Mobile AI Task Packet
- Mobile UX State Checklist
- Permission/Risk Checklist

## Phase 4: AIDD Control PlaneのMVP設計

期間目安: 1週間

目的:

- SaaSとして最小限何を作るべきかを定義する。

成果物:

- Product Brief
- User stories
- Screen list
- Data model
- API sketch
- Pricing hypothesis
- MVP scope
- Non-goals

## Phase 5: MVPプロトタイプ構築

期間目安: 2〜4週間

目的:

- 実際にAIDD-Specに沿って、AIDD Control Plane自体を作る。

候補スタック:

- Frontend: Next.js
- Backend: FastAPI or Next.js route handlers
- DB: SQLite initially, Postgres later
- Auth: local/mock first, Clerk/Auth.js later
- Integrations: GitHub, Codex logs, Hermes cron output

MVP機能:

- Project作成
- Requirement Spec作成
- AI Task Packet生成
- 実験ログ貼り付け/取り込み
- Verification Evidence表示
- Learning Log蓄積
- Article export

---

## 7. 日次検証テーマへの落とし込み

今後のCodex Mastery Labは、単なるCodex Tipsではなく、以下の連載軸に変更する。

### Series A: AIDD-Specを作る

- AI駆動開発時代の標準プロセスとは何か
- AI-ready requirementsの条件
- AI Task Packetという単位
- Verification Evidenceの標準化
- Learning LogでAI開発を自己改善する

### Series B: Codexで標準を検証する

- 雑プロンプト vs AIDD Task Packet
- テスト先行 vs 実装先行
- sandboxごとの安全境界
- diff size制限は有効か
- forbidden files指定は守られるか

### Series C: Web/スマホアプリで壊れる場所を調べる

- 認証実装でAIは何を間違えるか
- DB migrationをAIに任せる条件
- UI empty/loading/error stateの抜け漏れ
- モバイル権限とAI実装
- 課金/決済周りはどこまで任せられるか

### Series D: SaaS化する

- AIDD Control Planeの価値仮説
- 競合カテゴリ: Jira, Linear, GitHub, Cursor, Devin, Vercel, Replit, Postman, TestRail
- 最小MVP
- 開発会社/CTO向け導入シナリオ
- Pricing仮説

---

## 8. 評価指標

各実験で共通して測る。

### 8.1 実装品質

- テスト成功率
- lint/typecheck成功率
- 仕様逸脱数
- レビュー指摘数
- 修正回数

### 8.2 プロセス品質

- AIに渡す前の仕様作成時間
- Codex実行時間
- 人間レビュー時間
- 再実行回数
- 証拠の完全性

### 8.3 成果物品質

- 第三者が再現できるか
- 記事化できる学びがあるか
- 標準仕様に反映できるか
- SaaS機能仮説に変換できるか

---

## 9. リスクと対策

### Risk 1: 「標準仕様」が重すぎて誰も使わない

対策:

- まずLite版を作る。
- 1タスク1ページ以内を目指す。
- SaaSでは入力補助と自動生成を前提にする。

### Risk 2: Codex固有ノウハウになりすぎる

対策:

- AIDD-SpecはCodex非依存にする。
- Codexは検証用実装エージェントの1つとして扱う。
- 将来的にClaude Code/OpenCode/Cursor/Devinでも検証可能にする。

### Risk 3: 記事が抽象論になる

対策:

- 毎回必ず小さな実験ログを入れる。
- git diff、テスト結果、スクリーンショット、図解を残す。
- 「明日から使えるテンプレート」を添える。

### Risk 4: SaaS化が早すぎる

対策:

- まずMarkdown/CLI/手動運用で標準を検証する。
- 実際に繰り返し使う成果物だけをSaaS化する。

---

## 10. 次にやるべき具体タスク

### Task 1: AIDD-Spec v0.1を作る

**Objective:** 標準仕様の初版をMarkdownで定義する。

**Files:**

- Create: `/Users/tto/codex-mastery-lab/standards/AIDD-Spec-v0.1.md`
- Create: `/Users/tto/codex-mastery-lab/standards/templates/ai-task-packet.md`
- Create: `/Users/tto/codex-mastery-lab/standards/templates/verification-evidence.md`
- Create: `/Users/tto/codex-mastery-lab/standards/templates/learning-log.md`

**Verification:**

- 1つの小機能をAI Task Packetに落とし込めること。
- そのTask PacketをCodexに渡せること。

### Task 2: 明日の実験テーマを変更する

**Objective:** 日次cronのテーマを、AIDD-Spec検証に寄せる。

**Change:**

- 毎日のジョブで、Codex Tips単体ではなく「AIDD-Specの仮説を1つ検証する」ようにする。

**Verification:**

- 次回記事がAIDD-Specの一部として蓄積されること。

### Task 3: 初回記事を書く

**Objective:** 「AI駆動開発に標準仕様が必要な理由」をnoteドラフト化する。

**Article file:**

- `/Users/tto/codex-mastery-lab/articles/2026-06-28-why-ai-driven-development-needs-standard-spec.md`

**Required sections:**

- なぜAI開発は属人化しやすいか
- 従来開発成果物では何が足りないか
- AIDD-Specの7成果物
- Codex検証で何を測るか
- SaaS化したときの価値

### Task 4: 比較実験を設計する

**Objective:** 雑プロンプト vs AIDD Task Packetの比較実験を作る。

**Experiment:**

- 小さなTodo APIまたはフォームUIを対象にする。
- 同じ機能を2条件でCodexに実装させる。
- diff、テスト、逸脱、レビュー時間を比較する。

**Files:**

- Create: `experiments/YYYY-MM-DD-aidd-task-packet-vs-raw-prompt/PLAN.md`
- Create: `experiments/YYYY-MM-DD-aidd-task-packet-vs-raw-prompt/raw-prompt.txt`
- Create: `experiments/YYYY-MM-DD-aidd-task-packet-vs-raw-prompt/task-packet.md`
- Create: `experiments/YYYY-MM-DD-aidd-task-packet-vs-raw-prompt/RESULT.md`

---

## 11. 結論

取り組むべき中心テーマは、単に「Codexをうまく使う」ではない。

本命テーマはこれである。

> AIエージェントがWeb/スマホアプリ開発に参加する時代に、どのようなプロセス・成果物・証拠・レビューを標準化すれば、安定したシステム開発が可能になるのか。

この標準を検証しながら作り、その標準を実行するSaaSを作る。

Codex Mastery Labは、そのための研究開発ログ兼コンテンツエンジンとして運用する。
