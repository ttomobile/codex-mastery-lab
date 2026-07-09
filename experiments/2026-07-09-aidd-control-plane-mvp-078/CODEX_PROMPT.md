# Codex Prompt: MVP078 Smoke Receipt Repair Action Planner

`experiments/2026-07-09-aidd-control-plane-mvp-078/generated-repo/` を編集してください。MVP077の実装を土台に、機能名を `Smoke Receipt Repair Action Planner` へ変更し、Preview Smoke Receiptの失敗を次の1回の修正Actionへ畳み込むUI・domain・test・E2E・doctor・captureを実装してください。

必須要件:
- 状態は `?state=empty|planned|failure|blocked`。
- 日本語UIで、source receipt、broken URL、finding category、severity、lane、priority reason、execute_now action、next_increment、learning_log、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connectionを表示。
- plannedでは `次の1回で実行する修正Actionが準備できました` を表示。
- Codex prompt previewにはexecute_nowだけを入れ、next_increment / learning_logを混ぜない。
- failureでは検証コマンド不足、証跡不足、rollback不足、AIDD-Spec接続不足をReview Finding YAML風カードにする。
- blockedではprivate URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、execute_now以外のprompt混入を実行前停止にする。
- `pnpm run doctor:aidd` と3ブラウザPlaywrightで上記を検査。
- `capture:mvp078` で empty/planned/failure/blocked/terminal evidence PNGを `artifacts/screenshots` と `assets` へ保存。
- lint/typecheck/test/build/e2e/doctorが通る状態にする。
