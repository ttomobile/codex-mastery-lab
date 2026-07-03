実装対象: AIDD Control Plane MVP 022 - Packet Draft Workspace

作業ディレクトリ: experiments/aidd-control-plane-mvp-022/generated-repo

背景:
- MVP 021では採用済みdeltaのMarkdown exportを、実ファイルへ反映する前の適用計画に変換した。
- MVP 022では、適用計画から次回AIへ渡す4種類のドラフト本文を画面上で生成・確認する。
- AIDD-Spec v0.1と standards/aidd-control-plane-mvp-v0.1.md に接続する。

要件:
1. 日本語UIで `Packet Draft Workspace` を追加する。
2. 状態切替は `empty` / `valid` / `failure`。
3. valid状態では以下4つのファイルドラフトを表示する。
   - AI_TASK_PACKET.md
   - CODEX_PROMPT.md
   - VERIFICATION_PLAN.md
   - LEARNING_LOG.md
4. 各ドラフトに draft status、source delta id、反映されたMarkdown見出し、差分サマリ、コピー用本文プレビュー、実行前チェックを表示する。
5. コピー用Codex promptには、AIDD-Spec接続、対象ファイル、検証コマンド、rollback条件を含める。
6. 却下/保留deltaはLearning Log戻し対象として表示し、AI依頼本体へ混ぜない。
7. failure状態では draft body不足、source delta id不足、verification command不足、rollback condition不足、file target重複または衝突、未採用delta混入、AIDD-Spec接続不足をReview Findingとして表示する。
8. Unit test、Playwright E2E、doctor:aidd、capture scriptをMVP 022へ更新する。
9. `pnpm run capture:mvp022` で以下を保存する。
   - ../../artifacts/screenshots/aidd-control-plane-mvp022-empty.png
   - ../../artifacts/screenshots/aidd-control-plane-mvp022-valid.png
   - ../../artifacts/screenshots/aidd-control-plane-mvp022-failure.png
   - ../../artifacts/screenshots/aidd-control-plane-mvp022-terminal-evidence.png

検証コマンド:
```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp022
```

制約:
- UI、テスト名、サンプルデータは日本語を優先する。
- 実ファイルの自動書き換えはしない。今回はドラフトの表示と検査まで。
- runtime生成物はコミットしない。
