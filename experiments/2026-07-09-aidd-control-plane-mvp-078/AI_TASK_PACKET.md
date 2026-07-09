# AI Task Packet: AIDD Control Plane MVP 078 Smoke Receipt Repair Action Planner

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- Verification Evidence
- Review Record
- Learning Log
- AI Task Packet Delta
- Codex prompt delta

## Product Brief

MVP077のPreview Smoke Receipt Binderで見つかった404、0 byte、content type mismatch、latency超過、private URL、Firefox未確認などの失敗を、次の1回のCodex実行へ渡せるRepair Action Planへ変換する画面を作る。

## ユーザー

- 公開previewのリンク切れや画像破損を見つけたあと、何を1回で直すか迷う開発者。
- Review Findingを次回AI Task Packet / Codex prompt / Verification Evidenceへ戻したいレビュー担当者。

## 非ゴール

- 実GitHub APIや外部previewへのHTTPアクセスはしない。
- 本番SaaS認証、DB保存、実Codex実行はしない。
- 実サービスの商標、ロゴ、実データは使わない。

## 主要状態

- empty: repair対象のsmoke receipt findingが未選択。
- planned: 1件のexecute_now action、next_increment、learning_logが分離され、修正計画を確認できる。
- failure: 修正対象はあるが検証コマンド、証跡、rollback、AIDD-Spec接続の一部が不足。
- blocked: private URL、local path、Firefox除外、terminal evidence不足、execute_now以外のprompt混入で実行前停止。

## 受け入れ条件

1. 画面タイトルは `Smoke Receipt Repair Action Planner`。
2. 日本語UIで、source receipt、broken URL、finding category、severity、execute_now action、next_increment、learning_log、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connectionを表示する。
3. plannedでは「次の1回で実行する修正Actionが準備できました」と表示する。
4. failureではReview Finding YAML風カードと不足項目を表示する。
5. blockedでは「実行前停止」と理由を表示する。
6. Codex prompt previewにはexecute_nowだけを入れ、next_increment / learning_logの内容が混入しない。
7. `pnpm run doctor:aidd` が状態名、AIDD-Spec接続、3ブラウザ、terminal/failure screenshot、local path禁止、execute_now限定promptを検査する。
8. Playwright E2EはChromium / Firefox / WebKitで通す。
9. UI copy、テスト名、docsは日本語を基本にする。

## 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```
