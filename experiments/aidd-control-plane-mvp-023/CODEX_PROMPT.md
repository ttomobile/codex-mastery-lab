# Codex Prompt: AIDD Control Plane MVP 023

あなたはAIDD Control PlaneのNext.js + TypeScript実装担当です。

`experiments/aidd-control-plane-mvp-023/generated-repo/` を編集し、MVP 022のPacket Draft Workspaceの次段として `Safe Patch Review Workspace` を追加してください。

## 実装内容

- UIは日本語で書く
- Safe Patch Review Workspaceの状態切替ボタンを追加する
  - `patch empty`
  - `patch valid`
  - `patch failure`
- valid状態で4ファイル分のpatch候補を表示する
- failure状態で危険なpatch条件をReview Findingへ変換する
- Unit testとPlaywright E2Eを追加する
- `doctor:aidd` とcapture scriptをMVP 023向けに更新する

## 制約

- 実ファイルの自動書き換えはしない
- runtime生成物をコミット対象にしない
- AIDD-Spec v0.1 / standards/aidd-control-plane-mvp-v0.1.mdへの接続をUIに表示する

## 検証

次を個別に通してください。

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```
