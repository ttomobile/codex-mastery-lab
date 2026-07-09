# AIDD Control Plane MVP081: Dispatch Receipt History Comparator

複数のDispatch Receiptを比較し、同じ失敗が減ったか、どのRepair Actionが効いたかを確認するNext.js実験です。

## 状態

- `?state=empty`: 比較対象未選択
- `?state=valid`: 3件以上のReceipt履歴を比較
- `?state=improved`: finding減少と効いたRepair Actionを表示
- `?state=regression`: 再発findingとReview Finding YAMLを表示
- `?state=blocked`: 公開前ブロックを表示

## 検証

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```
