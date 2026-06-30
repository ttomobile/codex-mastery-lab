# Product Brief: AIDD Control Plane MVP 010

## 目的

AIDD Control PlaneのVerification Evidenceを、単独のログ一覧ではなくGitHub Actions Artifact Fetch Planまで含む証跡取得経路として束ねる。ユーザーがrun URLを貼ったときに、owner / repo / run id、jobs API、artifacts API、logs URL、必要token scope、必要artifactを確認できるようにし、AIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdのVerification Evidence / Review Record / Learning Logへ接続する。

## 対象ユーザー

- Codexに実装依頼を渡す前にCI証跡条件を明確にしたい開発者
- CI成功、artifact、Playwright reportをレビュー材料として揃えたいリードエンジニア
- failureを次回AI依頼へ戻す運用を試したいAI駆動開発チーム

## 主要フロー

1. ユーザーがApp Type Templatesを選び、テンプレートを適用する。
2. Project Intake Wizardでアプリ名、対象ユーザー、解決したい問題を入力する。
3. Verification Run Trackerでlint、typecheck、test、build、e2e、doctor:aiddと3ブラウザE2Eを確認する。
4. Artifact Evidence Binderでterminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを同じ実行単位に束ねる。
5. CI Artifact Importerでcommit SHA、workflow、job、artifact、Playwright report URLを確認する。
6. GitHub Actions Artifact Fetch Planでrun URLからowner / repo / run id / API endpoint / token scope / required artifactsを確認する。
7. empty / valid / failureサンプルを切り替える。
8. failureでは壊れたURL、run id不足、token scope不足、artifact取得計画不足をReview Findingに戻す。
9. Learning LogがNext AI Task Packet DeltaとCodex Prompt Deltaを生成する。

## 非ゴール

- GitHub APIの実通信
- GitHub token保存
- artifact zipの実ダウンロード
- ブラウザ保存領域への永続化

## 成功条件

- 初期状態でGitHub Actions Artifact Fetch Plan: emptyが見える。
- validサンプルでowner、repo、run id、jobs API、artifacts API、logs URL、actions:read、contents:readが揃う。
- failureサンプルでrun id不足、actions:read不足、playwright-report取得計画不足がReview Findingsに入る。
- Product Brief、AI Task Packet、Verification Plan、Codex PromptにCI Artifact ImporterとGitHub Actions Artifact Fetch Planが含まれる。
- Verification Run Tracker、Verification Evidence、Review Record、Learning LogがAIDD-Spec v0.1接続として説明される。
