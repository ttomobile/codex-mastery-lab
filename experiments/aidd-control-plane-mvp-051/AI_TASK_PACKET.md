# AI Task Packet: AIDD Control Plane MVP 051

## 1. Task name

Repair Delta Priority Decision Workspace

## 2. Product brief

AIDD Control Planeは、AI駆動開発の失敗ログを次回の上流情報へ戻すSaaSである。MVP051では、MVP050で作られたEvidence Repair Deltaを、採用 / 保留 / 却下として判断し、採用済みdeltaだけを次回AI Task PacketとCodex promptへ進める画面を作る。

料理の買い物リストのように、思いついた材料を全部買うのではなく、今日作る一品に必要な材料だけを選ぶ。AI開発でも、全deltaを一度にCodexへ投げず、次の1インクリメントに必要なものだけを選ぶ。

## 3. Scope

### In scope

- Next.js + TypeScript + pnpm の既存generated-repoを更新する
- UI文言、テスト名、サンプルデータは日本語
- empty / ready / failure の3状態
- readyでは次を表示する
  - source repair delta id
  - decision: 採用 / 保留 / 却下
  - priority reason
  - decision owner
  - review evidence
  - rollback condition
  - next packet section
  - Codex prompt patch
  - Verification Evidence / Review Record / Learning Log connection
  - 「採用済みdeltaだけを次回packetへ進める」ことがわかる出力
- failureでは次を検出する
  - 未判断
  - 理由不足
  - 証跡不足
  - rollback不足
  - Firefox除外
  - 未採用delta混入
  - local path / host / private network URL混入
- `doctor:aidd` でMVP051 token、AIDD-Spec接続、3ブラウザE2E、local pathブロック、未採用delta混入検出を確認する
- PlaywrightでChromium / Firefox / WebKit対象のE2Eを用意する
- screenshot capture scriptで empty / ready / failure / terminal evidence を生成する

### Out of scope

- 実DB保存
- GitHub API連携
- 実際のCodex起動キュー実行
- 認証・課金

## 4. Acceptance criteria

1. 初期表示で「Repair Delta Priority Decision Workspace」とMVP051の目的が日本語で読める。
2. empty状態では、判断対象のrepair deltaがないため次回packetへ進めないことを表示する。
3. ready状態では、採用 / 保留 / 却下を含む複数deltaを表示し、採用済みdeltaだけが次回packet / Codex prompt previewへ入る。
4. ready状態では、Verification Evidence / Review Record / Learning Log / AIDD-Spec v0.1 の接続が表示される。
5. failure状態では、未判断、理由不足、証跡不足、rollback不足、Firefox除外、未採用delta混入、local path/host/private network URL混入が日本語で表示される。
6. `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd` が成功する。
7. スクリーンショットが `artifacts/screenshots/` に生成される。

## 5. Verification commands

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp051
```

## 6. Evidence requirements

- terminal logs: `experiments/aidd-control-plane-mvp-051/artifacts/terminal/*.txt`
- screenshots:
  - `aidd-control-plane-mvp051-empty.png`
  - `aidd-control-plane-mvp051-ready.png`
  - `aidd-control-plane-mvp051-failure.png`
  - `aidd-control-plane-mvp051-terminal-evidence.png`

## 7. Rollback condition

MVP050の既存機能を壊す、またはMVP051の検証が3ブラウザで通らない場合は、MVP051 generated-repo内の変更に限定して戻す。repo rootの既存記事や標準ファイルは、明示的な更新箇所以外を変更しない。
