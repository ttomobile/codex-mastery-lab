# AI Task Packet: AIDD Control Plane MVP 023 Safe Patch Review Workspace

## 1. 背景

MVP 022では、Packet File Apply Plannerから4種類の次回AI依頼ファイルのドラフト本文を生成した。しかし、ドラフトを実ファイルへ反映する直前には、まだ次の不安が残る。

- 対象ファイルが安全な範囲か
- diffが大きすぎないか
- rollback conditionがあるか
- 未採用deltaやローカルパスが混ざっていないか
- patch適用後に実行する検証コマンドがあるか

## 2. ゴール

`generated-repo/` に Safe Patch Review Workspaceを追加し、実ファイル適用前のpatch候補をレビューできるようにする。

## 3. 非ゴール

- 実ファイルを自動で書き換えない
- GitHub APIや外部SaaSに接続しない
- 本番認証・課金・DBを作らない

## 4. 機能要件

### empty

- `Safe Patch Review Workspace: empty` を表示する
- patch候補がまだないことを説明する

### valid

- `Safe Patch Review Workspace: valid` を表示する
- 4ファイル分のpatch候補を表示する
  - `AI_TASK_PACKET.md`
  - `CODEX_PROMPT.md`
  - `VERIFICATION_PLAN.md`
  - `LEARNING_LOG.md`
- 各patch候補に次を表示する
  - patch id
  - target file
  - source draft id
  - diff summary
  - added lines / removed lines
  - risk level
  - apply command
  - verification command
  - rollback command
  - reviewer checklist
  - AIDD-Spec接続
- 全体のcopy用Codex promptを表示する

### failure

次をReview Findingとして表示する。

- target file不足
- source draft id不足
- diff summary不足
- verification command不足
- rollback command不足
- 危険なtarget path
- diff size過大
- 未採用delta混入
- ローカルパス混入
- AIDD-Spec接続不足

## 5. 品質ゲート

個別に実行し、`artifacts/terminal/*.txt` に保存する。

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

## 6. 画像証跡

- `assets/aidd-control-plane-mvp023-empty.png`
- `assets/aidd-control-plane-mvp023-valid.png`
- `assets/aidd-control-plane-mvp023-failure.png`
- `assets/aidd-control-plane-mvp023-terminal-evidence.png`
- 同じ画像を `experiments/aidd-control-plane-mvp-023/artifacts/screenshots/` に保存する
