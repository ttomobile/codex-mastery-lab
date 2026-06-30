# Product Brief: AIDD Control Plane MVP 008

## 目的

AIDD Control PlaneのVerification Evidenceを、単独のログ一覧ではなくArtifact Evidence Binderとして束ねる。terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを同じ実行単位で判定し、AIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdのVerification Evidence / Review Record / Learning Logへ接続する。

## 対象ユーザー

- Codexに実装依頼を渡す前に証跡条件を明確にしたい開発者
- CI成功、artifact、Playwright reportをレビュー材料として揃えたいリードエンジニア
- failureを次回AI依頼へ戻す運用を試したいAI駆動開発チーム

## 主要フロー

1. ユーザーがApp Type Templatesを選び、テンプレートを適用する。
2. Project Intake Wizardでアプリ名、対象ユーザー、解決したい問題を入力する。
3. Verification Run Trackerでlint、typecheck、test、build、e2e、doctor:aiddと3ブラウザE2Eを確認する。
4. Artifact Evidence Binderでterminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを確認する。
5. empty / valid / failureサンプルを切り替える。
6. failureでは壊れたURL、不足証跡、古いログをReview Findingに戻す。
7. Learning LogがNext AI Task Packet DeltaとCodex Prompt Deltaを生成する。

## 非ゴール

- 外部CI APIの実通信
- ブラウザ保存領域への永続化
- 実サービスの商標・ロゴ・コピー利用
- artifactファイルのアップロード処理

## 成功条件

- 初期状態でArtifact Evidence Binder: emptyが見える。
- validサンプルで全ゲート、Chromium / Firefox / WebKit、CI URL、Playwright report URLが揃う。
- failureサンプルで壊れたURL、不足証跡、古いログがReview Findingsに入る。
- Next AI Task Packet DeltaにBinder修正指示が入る。
- Product Brief、AI Task Packet、Verification Plan、Codex PromptにArtifact Evidence Binderが含まれる。
- Verification Run Tracker、Verification Evidence、Review Record、Learning LogがAIDD-Spec v0.1接続として説明される。
