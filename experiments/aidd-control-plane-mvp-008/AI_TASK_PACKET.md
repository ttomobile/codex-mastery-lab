# AI Task Packet: AIDD Control Plane MVP 008

spec_version: AIDD-Spec v0.1
mvp_standard: standards/aidd-control-plane-mvp-v0.1.md
conformance_target: L2 Lite
language: Japanese UI / Japanese tests / Japanese docs

## Product Brief

AIDD Control Plane の Evidence Collector を、terminal evidence / screenshot evidence / CI artifact URL / Playwright report URL を束ねる Artifact Evidence Binder に拡張する。ユーザーが「テストは通ったらしいが証拠がない」状態を避けられるように、証跡の不足・壊れたURL・古い実行ログを画面で確認できるようにする。

## Scope

- Next.js + TypeScript + pnpm の既存MVPを更新する。
- 画面に Artifact Evidence Binder を追加する。
- サンプル状態: empty / valid / failure を用意する。
- Verification Evidence, Review Record, Learning Log の出力に Binder 結果を反映する。
- doctor:aidd で docs とUI文言と証跡要件を静的確認する。

## Non-goals

- 実GitHub API連携はしない。URL形式と必須項目の検証に留める。
- ファイルアップロード実装はしない。ローカルパス/公開URLの登録と状態表示に限定する。
- 本番DB永続化はしない。

## Acceptance Criteria

1. 初期状態では必須証跡が足りず、Binder status が「証跡不足」になる。
2. 成功サンプルでは terminal log、screenshot、CI run、CI artifact、Playwright report が揃い「証跡確認済み」になる。
3. 失敗サンプルでは壊れたURL、不足スクリーンショット、古いterminal logを検出し、修正指示とAI Task Packet Deltaを表示する。
4. 画面上の主要コピー、テスト名、docsは日本語である。
5. `pnpm run lint`, `typecheck`, `test`, `build`, `test:e2e`, `doctor:aidd` が成功する。

## Verification Evidence Requirements

- artifacts/terminal/01-install.txt
- artifacts/terminal/02-lint.txt
- artifacts/terminal/03-typecheck.txt
- artifacts/terminal/04-test.txt
- artifacts/terminal/05-build.txt
- artifacts/terminal/06-e2e.txt
- artifacts/terminal/07-doctor-aidd.txt
- artifacts/screenshots/aidd-control-plane-mvp008-empty.png
- artifacts/screenshots/aidd-control-plane-mvp008-valid.png
- artifacts/screenshots/aidd-control-plane-mvp008-failure.png
- artifacts/screenshots/aidd-control-plane-mvp008-terminal-evidence.png
