# AI Task Packet: AIDD Control Plane MVP 009

spec_version: AIDD-Spec v0.1
mvp_standard: standards/aidd-control-plane-mvp-v0.1.md
conformance_target: L2 Lite
language: Japanese UI / Japanese tests / Japanese docs

## Product Brief

AIDD Control PlaneにCI Artifact Importerを追加する。ユーザーがGitHub ActionsなどのCI結果を貼り付けると、run URL、commit SHA、workflow名、job結果、artifact URL、Playwright report URLをVerification Evidence Binderへ取り込み、不足・壊れたURL・失敗ジョブをReview FindingとNext AI Task Packet Deltaへ戻せるようにする。

## Scope

- Next.js + TypeScript + pnpm の既存MVPをMVP 009として更新する。
- 画面にCI Artifact Importerセクションを追加する。
- サンプル状態: empty / valid / failure を用意する。
- validではCI run URL、commit SHA、workflow、lint/typecheck/test/build/e2e/doctor:aidd job、coverage artifact、playwright report artifactが揃う。
- failureでは壊れたURL、短すぎるcommit SHA、失敗job、不足artifactを検出する。
- Verification Evidence、Review Record、Learning Log、AI Task Packet DeltaにCI取り込み結果を反映する。
- doctor:aiddでdocs、UI文言、証跡要件を静的確認する。

## Non-goals

- GitHub API認証や実API取得はしない。貼り付け/サンプル入力の検証に限定する。
- artifact実体のダウンロードや解凍はしない。
- 本番DB永続化はしない。

## Acceptance Criteria

1. 初期状態ではCI run summaryが未登録で、Importer statusが「CI証跡未登録」になる。
2. 成功サンプルではcommit SHA、workflow、全job、artifact、Playwright reportが揃い「CI証跡確認済み」になる。
3. 失敗サンプルでは壊れたURL、短いcommit SHA、失敗job、不足artifactを検出し、修正指示とAI Task Packet Deltaを表示する。
4. 画面上の主要コピー、テスト名、docsは日本語である。
5. `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が成功する。

## Verification Evidence Requirements

- artifacts/terminal/01-install.txt
- artifacts/terminal/02-lint.txt
- artifacts/terminal/03-typecheck.txt
- artifacts/terminal/04-test.txt
- artifacts/terminal/05-build.txt
- artifacts/terminal/06-e2e.txt
- artifacts/terminal/07-doctor-aidd.txt
- artifacts/screenshots/aidd-control-plane-mvp009-empty.png
- artifacts/screenshots/aidd-control-plane-mvp009-valid.png
- artifacts/screenshots/aidd-control-plane-mvp009-failure.png
- artifacts/screenshots/aidd-control-plane-mvp009-terminal-evidence.png
