# AI Task Packet: AIDD Control Plane MVP 064 Run Result Digest Publisher

## 1. 背景

MVP063ではRun Queueの状態を追跡した。しかし実務では、Runの詳細を見た人がそのまま次の判断や記事化に進めるとは限らない。証跡・失敗分類・次回deltaを短く束ねた「共有ダイジェスト」が必要である。

## 2. 作るもの

`experiments/2026-07-08-aidd-control-plane-mvp-064/generated-repo/` に、Next.js + TypeScript + pnpmの小さな日本語UIを作る。

題材は **Run Result Digest Publisher**。

## 3. 必須UI状態

- `empty`: ダイジェスト対象のRunがない
- `valid`: 成功Runを共有できる
- `failure`: 失敗Runを共有するが、原因・修正指示・次回deltaも出す
- `blocked`: 共有前に必要証跡が不足している

## 4. 表示必須項目

- source run id
- run outcome / score
- terminal evidence summary
- screenshots summary: initial / filled / failure / terminal
- browser coverage: Chromium / Firefox / WebKit
- console status
- Review Record excerpt
- Learning Log excerpt
- AI Task Packet delta
- note article angle
- publish readiness result

## 5. 検出ルール

次を検出して日本語のReview Findingとして表示する。

- source run id不足
- terminal evidence不足
- failure screenshot不足
- Firefox除外
- console error/warn未確認
- local path / host / private network URL混入
- Learning Log接続不足
- note記事観点不足

## 6. 出力

- 共有用Markdownダイジェスト
- 次回AI Task Packet delta
- Codex prompt delta
- Verification Evidence checklist

## 7. 品質ゲート

次のscriptを用意し、すべて通ること。

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp064`

## 8. E2E

PlaywrightはChromium / Firefox / WebKitを設定する。E2Eでは最低限、empty / valid / failure / blockedの状態切替と、validでは共有Markdownが表示され、blockedでは不足証跡が表示されることを確認する。

## 9. UI/テスト言語

画面文言、テスト名、サンプルデータ、エラーメッセージは日本語にする。

## 10. 非ゴール

- 実GitHub API連携はしない
- 実Codex実行はしない
- 外部SaaS認証はしない
