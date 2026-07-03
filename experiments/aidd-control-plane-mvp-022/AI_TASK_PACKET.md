# AI Task Packet: AIDD Control Plane MVP 022

## 1. Product Brief

- 名前: AIDD Control Plane MVP 022 - Packet Draft Workspace
- ユーザー課題: MVP 021で採用済みdeltaの適用計画は見えるようになったが、次回AIに渡す `AI_TASK_PACKET.md` / `CODEX_PROMPT.md` / `VERIFICATION_PLAN.md` / `LEARNING_LOG.md` の最終ドラフト本文を、実ファイルへ書く前にまとめて確認できない。
- ゴール: 採用済みdeltaの適用計画から、4種類の次回ファイルドラフト、差分サマリ、コピー用Codex prompt、検証チェックリスト、衝突/不足/未採用delta混入の警告を日本語UIで確認できる。
- 非ゴール: 実ファイル自動書き換え、Git commit作成、GitHub PR作成、外部LLM/API実行、複数ユーザー権限管理は行わない。

## 2. AI-Ready Requirements

1. 日本語UIで `Packet Draft Workspace` セクションを追加する。
2. `empty` / `valid` / `failure` の状態切替を持つ。
3. `valid` ではMVP 021の適用計画を入力として、次の4つのドラフト本文を表示する。
   - `AI_TASK_PACKET.md`
   - `CODEX_PROMPT.md`
   - `VERIFICATION_PLAN.md`
   - `LEARNING_LOG.md`
4. 各ドラフトに以下を表示する。
   - draft status（生成準備完了 / 要修正）
   - source delta id
   - 反映されたMarkdown見出し
   - 差分サマリ
   - コピー用本文プレビュー
   - 実行前チェック
5. `valid` ではコピー用Codex promptに、AIDD-Spec接続、対象ファイル、検証コマンド、rollback条件を含める。
6. `valid` では却下 / 保留deltaをLearning Logへ戻し、AI依頼本体へ混ぜないことを明示する。
7. `failure` ではReview Findingとして次を検出する。
   - draft body不足
   - source delta id不足
   - verification command不足
   - rollback condition不足
   - file target重複または衝突
   - 未採用delta混入
   - AIDD-Spec接続不足
8. Unit test / E2E / doctor / capture scriptをMVP 022向けに更新する。
9. `pnpm run capture:mvp022` で empty / valid / failure / terminal evidence画像を保存する。

## 3. Acceptance Criteria

- `pnpm run test` が日本語テスト名を含んで成功する。
- `pnpm run test:e2e` がChromium / Firefox / WebKitで成功する。
- `pnpm run doctor:aidd` がMVP 022のUI文言、テスト、capture script、AIDD接続を確認する。
- `pnpm run capture:mvp022` が empty / valid / failure / terminal evidence画像を保存する。
- `failure` 状態で未採用delta混入とドラフト生成に必要な情報不足を検出できる。

## 4. Verification Plan

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp022
```

## 5. AIDD-Spec接続

- AIDD-Spec v0.1: AI Task Packet、Verification Evidence、Review Record、Learning Log、Spec Improvement。
- AIDD Control Plane MVP v0.1: Packet File Apply Plannerの後続機能。
- SaaS価値: 画面上の適用計画を、次回AIに渡せるドラフトファイル一式へ変換し、実ファイルへ反映する前に不足と混入を止める。
