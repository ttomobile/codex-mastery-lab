# AI Task Packet: AIDD Control Plane MVP 010

## AIDD-Spec接続

- spec_version: AIDD-Spec v0.1
- control_plane_standard: standards/aidd-control-plane-mvp-v0.1.md
- conformance_target: L2 Lite
- primary_artifacts:
  - Product Brief
  - AI Task Packet
  - Verification Evidence
  - Review Record
  - Learning Log

## Product Brief

AIDD Control Planeに、GitHub Actionsのrun URLを貼るとCI証跡の取得計画を生成する「GitHub Actions Artifact Fetch Plan」を追加する。目的は、AIの「CI通りました」報告を、どのAPIから何を取得して、どのartifact不足をレビューすべきかまで具体化すること。

## ユーザー

- AI駆動開発でCodexや別エージェントを使う開発者
- CIの成功/失敗とartifactを後からレビューしたい個人開発者、チームリード
- AIDD-SpecのVerification Evidenceを揃えたい人

## 機能要件

1. GitHub Actions run URLを解析し、owner / repo / run idを表示する。
2. jobs API、artifacts API、logs URL、run summary URLの取得計画を表示する。
3. 必須artifactとして coverage / playwright-report / test-results / terminal-evidence を確認する。
4. GitHub token権限として `actions:read` と `contents:read` の必要性を表示する。
5. empty / valid / failure stateをUIで切り替えられる。
6. failure stateでは壊れたURL、run id不足、token権限不足、artifact不足をReview Findingへ変換する。
7. Next AI Task Packet Deltaとして、次回AIに渡す修正指示を生成する。
8. 日本語UI、日本語テスト名、日本語ドキュメントにする。

## 非ゴール

- 実GitHub API呼び出し
- token保存
- artifact zip展開
- 認証つきSaaS化

## 品質ゲート

個別に実行し、`experiments/aidd-control-plane-mvp-010/artifacts/terminal/*.txt` に保存する。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 画像証跡

次を `assets/` と `experiments/aidd-control-plane-mvp-010/artifacts/screenshots/` に保存する。

- `aidd-control-plane-mvp010-empty.png`
- `aidd-control-plane-mvp010-valid.png`
- `aidd-control-plane-mvp010-failure.png`
- `aidd-control-plane-mvp010-terminal-evidence.png`

## 受け入れ条件

- 画面タイトルがMVP 010として表示される。
- GitHub Actions Artifact Fetch Planが初期画面で見える。
- valid stateでowner/repo/run id/API endpoint/required artifacts/token scopesが見える。
- failure stateでReview FindingとNext AI Task Packet Deltaが見える。
- e2eで3ブラウザのempty/valid/failure確認が通る。
- doctor:aiddがMVP 010の必須ラベル、スクリーンショット、AIDD-Spec接続を確認する。
