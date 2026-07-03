あなたはAIDD Control Plane MVP 030を実装するCodexです。

作業ディレクトリは `experiments/aidd-control-plane-mvp-030/generated-repo` です。MVP 029をベースに、`Exported Packet Preflight Reviewer` を追加してください。

要件:
1. 日本語UIでMVP 030の画面を実装する。
2. empty / valid / failure状態を切り替え可能にする。
3. `src/lib/intake.ts` に `ExportedPacketPreflightReviewer` 系の型、empty/valid/failure fixture、評価関数を追加する。
4. 未採用bundle混入、Firefox除外、浅い検証、local path/host/tailnet、rollback不足、evidence不足、AIDD-Spec接続不足を検出する。
5. Vitestに日本語テスト名を追加する。
6. Playwrightに日本語E2Eを追加する。
7. `doctor:aidd` をMVP 030向けに更新する。
8. `capture:mvp030` を追加し、empty/valid/failure/terminal evidenceを `../artifacts/screenshots` に保存する。
9. 既存のlint/typecheck/test/build/e2eを壊さない。

実装後、自己申告だけで終わらず、可能なら `pnpm run lint`, `pnpm run typecheck`, `pnpm run test` まで実行してください。