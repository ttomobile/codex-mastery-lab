AIDD Control Plane MVP 036を実装してください。

対象: experiments/aidd-control-plane-mvp-036/generated-repo

要件:
- 日本語UIで `Evidence Repair Delta Generator` を追加する。
- MVP035のVerification Run Detailの次段として、失敗分類を次回AI Task Packet / Codex promptへ戻す画面にする。
- empty / valid / failureを切り替えるボタン `repair empty` / `repair valid` / `repair failure` を追加する。
- validでは failed / evidence_missing / timeout のrepair deltaを表示し、AI Task Packet delta、Codex prompt delta、verification command、rollback condition、Learning Log noteを含める。
- failureでは source detail不足、failure category不足、repair instruction不足、Firefox除外、terminal evidence不足、failure screenshot不足、AIDD-Spec接続不足、local path / host / tailnet混入を検出する。
- src/lib/intake.ts に型、生成関数、評価関数を追加する。
- tests/intake.test.ts と e2e/intake-wizard.spec.ts に日本語テストを追加する。
- scripts/doctor-aidd.mjs と capture scriptもMVP036に更新する。

実行して確認:
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd

注意:
- local path、host名、tailnet/private URLを出力しない。
- runtime生成物はコミット対象にしない。
