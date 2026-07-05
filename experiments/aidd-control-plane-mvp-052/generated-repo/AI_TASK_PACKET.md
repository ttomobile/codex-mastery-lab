# AI Task Packet: AIDD Control Plane MVP 052

## 背景

MVP051では、Evidence Repair Deltaを採用 / 保留 / 却下に分け、採用済みdeltaだけを次回AI Task Packetへ進めた。次の不足は、採用済みdeltaをCodexへ投げる前に、Codex実行予算と停止条件を確認する入口である。

## 作るもの

Next.js + TypeScript + pnpmで、`generated-repo/` に **Codex Run Budget Gate** を実装する。UI、テスト名、docs、記事は日本語を基本にする。

## 受け入れ条件

1. `empty` は実行候補packetがないため、Codexを開始できないことを表示する。
2. `ready` は次を表示する。
   - source packet id
   - accepted repair delta
   - primary usage / secondary usage
   - usage band: go
   - max runtime minutes
   - stop condition
   - verification commands: lint / typecheck / test / build / test:e2e / doctor:aidd
   - browser projects: Chromium / Firefox / WebKit
   - fallback action
   - Verification Evidence / Review Record / Learning Log / AIDD-Spec接続
3. `failure` は次を検出する。
   - primary usage過多
   - secondary usage過多
   - max runtime不足
   - stop condition不足
   - fallback action不足
   - Firefox除外
   - Verification Evidence接続不足
   - Review Record接続不足
   - Learning Log接続不足
   - AIDD-Spec接続不足
   - local path / host / private network URL混入
4. `ready` だけがCodex prompt previewを表示する。
5. `failure` は公開前ブロック理由を日本語で表示する。
6. PlaywrightはChromium / Firefox / WebKitを対象にし、`timeout: 120_000`, `expect: { timeout: 90_000 }`, `workers: 1` を設定する。

## 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

## AIDD-Spec接続

- AI Task Packet: 実行候補packetと採用済みdeltaを明示する
- Verification Evidence: コマンド別ログ、3ブラウザ結果、terminal evidence画像を保存する
- Review Record: go/brake/stop判断と理由を残す
- Learning Log: 利用枠が高い場合の代替行動を記録する
- Maintenance Runbook: 長時間ループを止める条件を明文化する
