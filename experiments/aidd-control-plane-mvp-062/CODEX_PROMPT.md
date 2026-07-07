AIDD Control Plane MVP 062を実装してください。

対象: experiments/aidd-control-plane-mvp-062/generated-repo/

目的:
MVP061の Evidence Repair Delta Generator を土台に、Repair Delta Priority Decision Workspaceへ発展させる。生成されたrepair deltaを、次回AI実行へそのまま渡さず、採用 / 保留 / 却下として判断し、採用済みdeltaだけが次回AI Task Packet patch / Codex prompt patchへ進むことを画面とテストで示す。

必須UI状態:
1. empty / initial: repair deltaがない。判断する修理deltaを選ぶ案内を表示。
2. valid: adopt / hold / reject判断、priority reason、decision owner、review evidence、rollback condition、next packet section、Codex prompt patch、Verification Evidence / Review Record / Learning Log / AIDD-Spec接続を表示。採用済みdeltaだけがprompt previewに入る。
3. failure: 未判断、理由不足、証跡不足、rollback不足、Firefox除外、未採用delta混入、local path / host / private network URL混入をReview Finding形式へ変換。
4. decision_needed: adopt_now / hold_next_increment / reject_to_learning_log laneを表示し、次の1回に入れるdeltaを最大1〜2件に絞る。

必須コマンド:
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd

追加要件:
- 日本語UI、日本語テスト名。
- PlaywrightはChromium / Firefox / WebKit。
- capture scriptで aidd-control-plane-mvp062-empty.png / valid.png / failure.png / decision-needed.png / terminal-evidence.png を保存できるようにする。
- local path、host名、private network URLを公開物へ混ぜない。
- AIDD-Spec v0.1と standards/aidd-control-plane-mvp-v0.1.md への接続を表示する。
