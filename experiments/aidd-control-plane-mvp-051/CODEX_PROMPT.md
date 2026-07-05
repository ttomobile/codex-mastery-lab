# Codex Prompt: AIDD Control Plane MVP 051

あなたはAIDD Control PlaneのMVPを実装するエージェントです。`experiments/aidd-control-plane-mvp-051/generated-repo` を作業ディレクトリとして、既存のMVP050実装をMVP051へ更新してください。

## 実装するもの

`Repair Delta Priority Decision Workspace` を作る。MVP050で作ったEvidence Repair Deltaを、採用 / 保留 / 却下として判断し、採用済みdeltaだけを次回AI Task Packet / Codex promptへ進める日本語UIにする。

## 必須要件

- Next.js + TypeScript + pnpm を維持する
- UI、テスト名、サンプルデータ、doctorメッセージは日本語
- `MVP051` と `Repair Delta Priority Decision Workspace` を画面とdoctorで確認できる
- empty / ready / failure の3状態を切り替えられる
- readyには以下を含める
  - source repair delta id
  - decision（採用 / 保留 / 却下）
  - priority reason
  - decision owner
  - review evidence
  - rollback condition
  - next packet section
  - Codex prompt patch
  - Verification Evidence / Review Record / Learning Log / AIDD-Spec connection
  - 採用済みdeltaだけを次回packetへ進めるpreview
- failureには以下の検出を含める
  - 未判断
  - 理由不足
  - 証跡不足
  - rollback不足
  - Firefox除外
  - 未採用delta混入
  - local path / host / private network URL混入
- 3ブラウザPlaywright E2Eを維持する
- `pnpm run capture:mvp051` で次を生成する
  - `artifacts/screenshots/aidd-control-plane-mvp051-empty.png`
  - `artifacts/screenshots/aidd-control-plane-mvp051-ready.png`
  - `artifacts/screenshots/aidd-control-plane-mvp051-failure.png`
  - `artifacts/screenshots/aidd-control-plane-mvp051-terminal-evidence.png`
- `pnpm run doctor:aidd` はMVP051 token、AIDD-Spec接続、3ブラウザE2E、local pathブロック、未採用delta混入検出を確認する

## 実行してよい検証

実装後に可能なら以下を実行し、失敗があれば修正してください。

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

ただし、あなたの自己申告は最終判断ではありません。別プロセスで独立検証します。
