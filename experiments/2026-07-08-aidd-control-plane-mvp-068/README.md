# AIDD Control Plane MVP 068: One-Run Execution Readiness Gate

MVP067のSmoke Finding Action Queueで `execute_now` に絞った行動を、実際のCodex実行へ渡す直前に ready / blocked として判定する。

## 接続する標準

- `standards/aidd-spec-v0.1.md`: AI Task Packet / Verification Evidence / Review Record / Learning Log
- `standards/aidd-control-plane-mvp-v0.1.md`: Smoke Finding Action Queue、One-Run Execution Readiness Gate、Codex Run Queue

## 完了条件

- Next.js + TypeScript + pnpmで日本語UIを実装する
- empty / ready / blocked / sanitized の状態を表示する
- `execute_now` actionだけを受け取り、Codex command、sandbox mode、検証コマンド、3ブラウザ、必要証跡、rollback stop condition、AIDD-Spec接続を確認する
- `next_increment` / `learning_log` 混入、危険command、sandbox不足、Firefox除外、terminal/failure screenshot不足、rollback不足、local path/private URL/AIDD-Spec接続不足をblockedにする
- lint / typecheck / test / build / 3ブラウザE2E / doctor:aidd を通す
- 画像証跡を empty / ready / blocked / sanitized / terminal evidence で保存する
