実装対象: AIDD Control Plane MVP 021 - Packet File Apply Planner

作業ディレクトリ: experiments/aidd-control-plane-mvp-021/generated-repo

背景:
- MVP 020では採用済みdeltaだけをAI Task Packet Markdown / Verification Plan / Codex promptへ書き出した。
- MVP 021では、書き出したMarkdownを実ファイルへ反映する前の安全な適用計画をUI化する。
- AIDD-Spec v0.1と standards/aidd-control-plane-mvp-v0.1.md に接続する。

要件:
1. 日本語UIで `Packet File Apply Planner` を追加する。
2. 状態切替は `empty` / `valid` / `failure`。
3. valid状態では採用済みdeltaだけを以下の対象ファイル計画へ含める。
   - AI_TASK_PACKET.md
   - CODEX_PROMPT.md
   - VERIFICATION_PLAN.md
   - LEARNING_LOG.md
4. 各ファイル計画に、Markdown見出し、before summary、after summary、insert position、verification command、rollback step、review evidenceを表示する。
5. 却下/保留deltaはLearning Log戻し対象として表示し、AI依頼本体へ混ぜない。
6. failure状態では target file不足、insert position不足、before/after差分不足、verification command不足、rollback step不足、review evidence不足、未採用delta混入をReview Findingとして表示する。
7. Unit test、Playwright E2E、doctor:aidd、capture scriptをMVP 021へ更新する。
8. `pnpm run capture:mvp021` で以下を保存する。
   - ../../artifacts/screenshots/aidd-control-plane-mvp021-empty.png
   - ../../artifacts/screenshots/aidd-control-plane-mvp021-valid.png
   - ../../artifacts/screenshots/aidd-control-plane-mvp021-failure.png
   - ../../artifacts/screenshots/aidd-control-plane-mvp021-terminal-evidence.png

検証コマンド:
```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run mock:doctor
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp021
```

制約:
- UI、テスト名、サンプルデータは日本語を優先する。
- 実ファイルの自動書き換えはしない。今回は適用前計画の表示まで。
- runtime生成物はコミットしない。
