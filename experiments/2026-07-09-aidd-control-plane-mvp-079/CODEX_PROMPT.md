あなたはCodex Mastery LabのAIDD Control Plane MVPを実装するエージェントです。

作業ディレクトリは `experiments/2026-07-09-aidd-control-plane-mvp-079/generated-repo/` です。既存のMVP078実装を土台に、MVP079 **Repair Action Run Queue Intake** へ作り替えてください。

必ず満たすこと:

1. Next.js + TypeScript + pnpmを維持する。
2. UI、テスト名、README、doctor出力は日本語中心にする。
3. 画面タイトルは `Repair Action Run Queue Intake`。
4. `?state=empty|ready|failure|blocked` で状態切替できる。
5. UIに以下を表示する。
   - source repair action
   - queue payload
   - execute_now summary
   - excluded next_increment
   - excluded learning_log
   - verification gate
   - evidence gate
   - rollback gate
   - sanitize gate
   - AIDD-Spec connection
6. readyでは「実行キュー投入前チェックを通過しました」と表示し、queue payload / Codex prompt previewにexecute_nowだけを入れる。
7. failureでは不足ゲートとReview Finding YAML風カードを表示する。
8. blockedでは「実行前停止」と理由を表示し、private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、next_increment/learning_log混入、破壊的cleanup要求を止める。
9. unit testでpayloadにnext_increment / learning_logが混入しないことを検査する。
10. Playwright E2EはChromium / Firefox / WebKitで empty / ready / failure / blocked を検証する。
11. `scripts/doctor-aidd.mjs` は状態名、AIDD-Spec接続、3ブラウザ設定、terminal/failure screenshot要求、local path禁止、payload限定、破壊的cleanup禁止を検査する。
12. `scripts/capture-mvp079.mjs` と `pnpm run capture:mvp079` を追加し、`assets/` と `artifacts/screenshots/` に `mvp079-empty.png`, `mvp079-ready.png`, `mvp079-failure.png`, `mvp079-blocked.png`, `mvp079-terminal-evidence.png` を保存する。
13. 古いMVP078/MVP077という表示・script名・テスト名が主成果物に残らないようにする。ただし削除が安全でないruntime生成物のcleanupは無理に行わない。
14. 最後に `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通る状態を目指す。

実装後、変更内容と実行した検証を短く報告してください。Codexの自己申告は後で独立検証します。
