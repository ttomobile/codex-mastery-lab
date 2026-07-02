# AI Task Packet: AIDD Control Plane MVP 021

## 1. Product Brief

- 名前: AIDD Control Plane MVP 021 - Packet File Apply Planner
- ユーザー課題: MVP 020で採用済みdeltaをMarkdownとして書き出せたが、次回の `AI_TASK_PACKET.md` / `CODEX_PROMPT.md` / Learning Logファイルへ安全に反映する手順と差分がまだ見えない。
- ゴール: 採用済みdeltaを実ファイルへ反映する前の計画として、対象ファイル、追記位置、before/after差分、未採用deltaの戻し先、検証コマンド、rollback手順を日本語UIで確認できる。
- 非ゴール: 実ファイルの自動書き換え、GitHub PR作成、外部LLM/API実行、複数ユーザー権限管理は行わない。

## 2. AI-Ready Requirements

1. 日本語UIで `Packet File Apply Planner` セクションを追加する。
2. `empty` / `valid` / `failure` の状態切替を持つ。
3. `valid` では採用済みdeltaのみを、次のファイル反映計画へ含める。
   - `AI_TASK_PACKET.md`
   - `CODEX_PROMPT.md`
   - `LEARNING_LOG.md`
   - `VERIFICATION_PLAN.md`
4. `valid` では各対象ファイルごとに以下を表示する。
   - 追記するMarkdown見出し
   - before summary
   - after summary
   - insert position
   - verification command
   - rollback step
   - review evidence
5. `valid` では却下 / 保留deltaをLearning Log戻し対象として表示し、AI依頼本体へ混ぜない。
6. `failure` ではReview Findingとして次を検出する。
   - target file不足
   - insert position不足
   - before/after差分不足
   - verification command不足
   - rollback step不足
   - review evidence不足
   - 未採用delta混入
7. Unit test / E2E / doctor / capture scriptをMVP 021向けに更新する。
8. `pnpm run capture:mvp021` で empty / valid / failure / terminal evidence画像を保存する。

## 3. Acceptance Criteria

- `pnpm run test` が日本語テスト名を含んで成功する。
- `pnpm run test:e2e` がChromium / Firefox / WebKitで成功する。
- `pnpm run doctor:aidd` がMVP 021のUI文言、テスト、capture script、AIDD接続を確認する。
- `pnpm run capture:mvp021` が empty / valid / failure / terminal evidence画像を保存する。
- `failure` 状態で未採用delta混入とファイル反映計画の不足を検出できる。

## 4. Verification Plan

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run mock:doctor
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp021
```

## 5. AIDD-Spec接続

- AIDD-Spec v0.1: AI Task Packet、Verification Evidence、Review Record、Learning Log、Spec Improvement。
- AIDD Control Plane MVP v0.1: Adopted Delta Markdown Exporterの後続機能。
- SaaS価値: 画面上のMarkdown exportを、次回AI依頼ファイルへ反映する直前の安全な適用計画に変換する。
