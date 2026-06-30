次の実装を行ってください。

対象: experiments/aidd-control-plane-mvp-010/generated-repo

AIDD Control Plane MVP 010として、既存MVP 009のNext.js + TypeScriptアプリを拡張してください。MVP 009のCI Artifact Importerは残しつつ、主役を「GitHub Actions Artifact Fetch Plan」に変更します。

要件:

1. UI文言を日本語でMVP 010へ更新する。
2. GitHub Actions run URLを解析する機能を追加する。
   - 例: https://github.com/aidd-lab/studyflow/actions/runs/1234567890
   - owner: aidd-lab
   - repo: studyflow
   - runId: 1234567890
3. 解析結果から次の取得計画を表示する。
   - run summary URL
   - jobs API endpoint
   - artifacts API endpoint
   - logs URL
   - 必要token scopes: actions:read, contents:read
4. 必須artifactを coverage / playwright-report / test-results / terminal-evidence とする。
5. empty / valid / failure stateをボタンで切り替えられるようにする。
   - empty: URL未入力、取得計画未作成
   - valid: 正しいrun URL、必要artifactあり、token scopesあり
   - failure: 壊れたURL、run id不足、actions:read不足、playwright-reportとterminal-evidence不足
6. failure stateをReview Finding / Learning Log / Next AI Task Packet Deltaへ反映する。
7. src/lib以下に純粋関数とVitestを追加・更新する。
8. Playwright e2eでempty/valid/failureを3ブラウザ確認する。
9. scripts/doctor-aidd.mjsをMVP 010要件へ更新する。
10. package名をaidd-control-plane-mvp-010へ更新する。

必ず以下が通る状態にしてください。

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd

制約:

- 実GitHub API接続はしない。今回は取得計画と検証だけ。
- UI、テスト名、エラーメッセージは日本語中心。
- AIDD-Spec v0.1とstandards/aidd-control-plane-mvp-v0.1.mdの流れ（Product Brief -> AI Task Packet -> Verification Evidence -> Review Record -> Learning Log）に接続する。
- runtime生成物を意図的にコミット対象にしない。
