# 受け入れ条件

| ID | 操作 | 期待結果 | 証拠コマンド |
| --- | --- | --- | --- |
| AC-001 | タスク名を入力して「追加」を押す。 | 入力したタスクが一覧の先頭に表示され、一覧の件数ラベルが更新される。 | `pnpm run test:e2e -- --grep AC-001` |
| AC-002 | 既存タスクのチェックを切り替える。 | 完了数が日本語のアクセシブル名で更新され、完了タスクは取り消し線表示になる。 | `pnpm run test:e2e -- --grep AC-002` |
| AC-003 | 空入力で追加し、その後すべてのタスクを完了して「未完了のみ表示」を有効にする。 | 空入力エラーが `aria-live` で表示され、空状態メッセージがスクリーンリーダーにも意味のある文で伝わる。 | `pnpm run test:e2e -- --grep AC-003` |

## 共通ゲート

```bash
pnpm run doctor:evidence
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run test:e2e
```
