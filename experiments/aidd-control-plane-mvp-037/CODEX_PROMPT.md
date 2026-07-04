あなたはAIDD Control Plane MVP 037を実装するCodexです。

`experiments/aidd-control-plane-mvp-037/generated-repo`で、MVP 036のEvidence Repair Delta Generatorの続きとして「Repair Delta Priority Decision Workspace」を追加してください。

重要:
- UI、テスト名、サンプルデータは日本語中心。
- AIDD-Spec v0.1、Review Record、Learning Log、Verification Evidenceとの接続をUIに明記。
- empty / valid / failure状態を切り替えられること。
- validでは採用・保留・却下の判断を分け、採用済みrepair deltaだけが次回AI Task Packet / Codex promptへ進むことを示すこと。
- failureでは未判断、理由不足、証跡不足、rollback不足、Firefox除外、local path/host/tailnet混入を検出すること。
- `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が通ること。

完了後、変更点と実行した検証を簡潔に報告してください。
