# AI Task Packet: AIDD Control Plane MVP 020

## 1. Product Brief

- 名前: AIDD Control Plane MVP 020 - Adopted Delta Markdown Exporter
- ユーザー課題: 採用済み改善deltaを次回AI Task Packetへ入れる時、どのMarkdownが追加されるのか見えず、却下・保留deltaまで混ざる危険がある。
- ゴール: 採用済みdeltaだけを次回AI Task Packet Markdown / Verification Plan / Codex prompt追記へ変換し、未採用deltaはLearning Logへ戻せる。
- 非ゴール: 実GitHub Issue作成、外部LLM API実行、複数ユーザー権限管理は行わない。

## 2. AI-Ready Requirements

1. 日本語UIで `Adopted Delta Markdown Exporter` を追加する。
2. `empty` / `valid` / `failure` の状態切替を持つ。
3. `valid` では採用済みdeltaのみMarkdown exportへ含める。
4. `valid` では却下 / 保留deltaをLearning Log戻し対象として別表示する。
5. Markdown exportには次を含める。
   - AI Task Packet差分
   - 追加acceptance criteria
   - Verification Plan追記
   - Codex prompt追記
   - rollback condition
   - review evidence
6. `failure` では次をReview Findingとして検出する。
   - 採用deltaのMarkdown section不足
   - verification command不足
   - rollback condition不足
   - review evidence不足
   - 未採用delta混入
7. Unit test / E2E / doctor / capture scriptを更新する。

## 3. Acceptance Criteria

- `pnpm run test` が日本語テスト名を含んで成功する。
- `pnpm run test:e2e` がChromium / Firefox / WebKitで成功する。
- `pnpm run doctor:aidd` がMVP 020のUI文言、テスト、capture script、AIDD接続を確認する。
- `pnpm run capture:mvp020` が empty / valid / failure / terminal evidence画像を保存する。

## 4. Verification Plan

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp020
```

## 5. AIDD-Spec接続

- AIDD-Spec v0.1: AI Task Packet、Verification Evidence、Review Record、Learning Log、Spec Improvement。
- AIDD Control Plane MVP v0.1: Delta Decision Reviewの後続機能。
- SaaS価値: 採用判断を、次回AI依頼へ入る具体的なMarkdown差分に変換する。
