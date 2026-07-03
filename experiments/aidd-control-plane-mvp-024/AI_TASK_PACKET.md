# AI Task Packet: AIDD Control Plane MVP 024

## 目的

AIDD Control Planeを「誰でもベストに近いAI駆動開発フローと設計ドキュメントを作れるSaaS」に近づけるため、Safe Patch Reviewで承認したpatch候補を即適用せず、適用前後の証跡を保存するDiff Bundle & Rollback Evidence Workspaceを作る。

## 背景

MVP 023では、Packet Draft Workspaceのドラフトを安全なpatch候補としてレビューできた。しかし、patchを当てる直前に「どのdiff bundleを保存したか」「dry-runは成功したか」「失敗時に戻せる証跡があるか」がまだ見えない。

## 機能要件

1. 日本語UIで `Diff Bundle & Rollback Evidence Workspace` を表示する。
2. empty / valid / failure stateを切り替えられる。
3. valid stateでは4ファイル分を表示する。
   - AI_TASK_PACKET.md
   - CODEX_PROMPT.md
   - VERIFICATION_PLAN.md
   - LEARNING_LOG.md
4. 各bundleには以下を含める。
   - bundle id
   - source patch id
   - target file
   - before hash
   - after hash
   - diff bundle path
   - dry-run command
   - dry-run status
   - rollback evidence path
   - rollback verified command
   - verification command
   - reviewer checklist
   - AIDD-Spec接続
5. failure stateでは次をReview Findingへ変換する。
   - source patch id不足
   - before/after hash不足
   - dry-run未成功
   - rollback evidence不足
   - rollback verified command不足
   - 危険なtarget path
   - ローカルパス混入
   - AIDD-Spec接続不足

## 非ゴール

- 実ファイルへの自動patch適用はしない。
- 外部GitHub APIや本物のCI artifact取得はしない。
- 英語UIへ戻さない。

## 品質ゲート

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd

## 証跡要件

- artifacts/terminal/*.txt に個別コマンドログ
- assets/ と experiments/aidd-control-plane-mvp-024/artifacts/screenshots/ にempty / valid / failure / terminal evidence画像
- articles/2026-07-03-aidd-control-plane-mvp-024.md にnote向け記事
- previewで画像が表示されること
