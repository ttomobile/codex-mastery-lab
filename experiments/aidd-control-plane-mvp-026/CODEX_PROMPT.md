# Codex Prompt: MVP 026

`experiments/aidd-control-plane-mvp-026/generated-repo` で作業してください。

AIDD Control Plane MVP 026として `Packet Apply Command Composer` を実装してください。MVP 025のDogfood Packet Markdown Reviewを前提に、AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.mdへ反映する直前の安全なコマンド計画を表示します。

要件:

- Next.js + TypeScript + pnpmを維持
- 日本語UI
- empty / valid / failure state切替
- validでは target file / apply command / dry-run command / verification command / rollback command / evidence path / preflight checks を表示
- failureでは危険なtarget path、rollback不足、verification不足、未レビューMarkdown混入を止める
- Unit testとPlaywright E2Eを追加
- capture scriptで4画像を保存
- 実行ログはartifacts/terminalへ保存

完了後も自己申告で終えず、lint/typecheck/test/build/e2e/doctor:aiddを通してください。
