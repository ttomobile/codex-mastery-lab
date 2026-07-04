# AI Task Packet: AIDD Control Plane MVP 036

## 1. Product Brief

AIDD Control Planeに、Verification Run Detailの失敗分類から次回AI依頼へ戻すEvidence Repair Delta Generatorを追加する。

## 2. 非ゴール

- 実際のGitHub Actions API連携は行わない
- 実ファイルへの自動patch適用は行わない
- local path、host名、tailnet/private URLをUI・記事へ出さない

## 3. 主要フロー

1. empty: まだrepair deltaがない状態を表示する
2. valid: Verification Run Detail validからrepair deltaを生成し、failed / evidence_missing / timeoutごとのAI Task Packet deltaとCodex prompt deltaを表示する
3. failure: detail不足・証跡不足・浅い検証・Firefox除外・AIDD-Spec接続不足をReview Findingとして表示する

## 4. 受け入れ条件

- UIに `Evidence Repair Delta Generator` セクションを追加する
- 操作用ボタン `repair empty` / `repair valid` / `repair failure` を追加する
- valid表示に次を含める
  - source detail id
  - repair delta id
  - failure category
  - AI Task Packet delta
  - Codex prompt delta
  - verification command
  - rollback condition
  - Learning Log note
- failure表示に次を含める
  - source detail不足
  - failure category不足
  - repair instruction不足
  - Firefox除外
  - terminal evidence不足
  - failure screenshot不足
  - AIDD-Spec接続不足
  - local path / host / tailnet混入

## 5. 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

## 6. 証跡

- terminal logs: `experiments/aidd-control-plane-mvp-036/artifacts/aidd-control-plane-mvp-036/terminal/`
- screenshots: `experiments/aidd-control-plane-mvp-036/artifacts/screenshots/`
- article assets: `assets/aidd-control-plane-mvp036-*.png`
