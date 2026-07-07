あなたはCodex Mastery Lab内のAIDD Control Plane MVPを実装するエージェントです。

作業ディレクトリは `experiments/aidd-control-plane-mvp-061/generated-repo/` です。既存のMVP060実装を土台に、MVP061「Evidence Repair Delta Generator」を実装してください。

必ず守ること:

1. UI、テスト名、サンプルデータ、説明文は日本語にする。
2. Next.js + TypeScript + pnpmの既存構成を維持する。
3. 既存の品質ゲートを弱めない。PlaywrightはChromium / Firefox / WebKitを維持する。
4. 建築・建物メタファーは使わない。
5. AIDD-Spec v0.1、AIDD Control Plane MVP v0.1、Verification Evidence、Review Record、Learning Log、AI Task Packetへ画面上で接続する。
6. doctor:aiddをMVP061用に更新する。
7. capture scriptをMVP061用に更新し、以下を保存する。
   - artifacts/screenshots/aidd-control-plane-mvp061-empty.png
   - artifacts/screenshots/aidd-control-plane-mvp061-valid.png
   - artifacts/screenshots/aidd-control-plane-mvp061-failure.png
   - artifacts/screenshots/aidd-control-plane-mvp061-repair-needed.png
   - artifacts/screenshots/aidd-control-plane-mvp061-terminal-evidence.png
8. 実装後に少なくとも以下を実行して、自己検証結果を要約してください。
   - pnpm install --frozen-lockfile
   - pnpm run lint
   - pnpm run typecheck
   - pnpm run test
   - pnpm run build
   - pnpm run test:e2e
   - pnpm run doctor:aidd

実装内容:

- Evidence Repair Delta Generatorをメイン画面として表示する。
- empty / valid / failure / repair_needed の状態を切り替えられるようにする。
- valid状態では、Verification Run Detailの failed / timeout / evidence_missing から修理deltaを生成し、AI Task Packet delta / Codex prompt delta / verification command / rollback condition / Learning Log noteを表示する。
- failure状態では、source detail不足、失敗分類不足、修正指示不足、Firefox除外、terminal/failure screenshot不足、local path / host / private network URL混入をReview Finding形式で表示する。
- repair_needed状態では、execute_now / next_increment / learning_log に分け、次の1回に入れるdeltaを絞る。
- E2Eでは画面状態の切替、3ブラウザcoverage、AIDD-Spec接続、ローカルパス混入ブロックを確認する。

完了条件:

- すべての品質ゲートが通る。
- スクリーンショット生成コマンドが通る。
- READMEやパッケージスクリプトがMVP061と矛盾しない。
