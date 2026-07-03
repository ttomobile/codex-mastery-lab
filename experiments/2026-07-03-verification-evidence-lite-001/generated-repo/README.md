# 日次チェックリスト Lite

見た目と基本操作を優先した、雑なバイブコーディング版の小さな Next.js + TypeScript アプリです。

## できること

- タスク追加
- 完了切替
- 未完了のみ表示

## 実行コマンド

```bash
pnpm install
pnpm run dev
```

別ターミナルで確認します。

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm exec playwright install
pnpm run test:e2e
```

## Verification Evidence Lite の検証手順

受け入れ条件は `docs/ACCEPTANCE_CRITERIA.md`、今回の証跡方針は `docs/VERIFICATION_EVIDENCE.md` にまとめています。

```bash
pnpm run doctor:evidence
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run test:e2e
```

受け入れ条件IDごとの確認もできます。

```bash
pnpm run test:e2e -- --grep AC-001
pnpm run test:e2e -- --grep AC-002
pnpm run test:e2e -- --grep AC-003
```

ログは `../artifacts/verification-evidence-lite/terminal/`、スクリーンショットやGIFは `../artifacts/verification-evidence-lite/assets/` に保存する想定です。

## メモ

- UI文言とE2Eテスト名は日本語です。
- データはブラウザ内の状態だけで保持します。リロードすると初期状態に戻ります。
- mock backend やCIはこの軽量版では未実装です。
