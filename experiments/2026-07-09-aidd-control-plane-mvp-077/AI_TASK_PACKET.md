# AI Task Packet: AIDD Control Plane MVP 077 Preview Smoke Receipt Binder

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- Verification Evidence
- Review Record
- Learning Log
- AI Task Packet Delta

## Product Brief

AIDD Control PlaneでPublication Evidence QA Gateが「画像・記事・ログが揃った」と判定した後、公開preview HTMLとassetsがHTTP経路で本当に読めるかをReceiptとして保存する画面を作る。

## ユーザー

- AIで作ったアプリと記事をnote/previewへ出す前に、画像404や0 byte画像を防ぎたい開発者。
- Codex実行の証跡を記事化し、次回AI Task Packetへ戻したいレビュー担当者。

## 非ゴール

- 実GitHub APIや外部ネットワークへの接続はしない。
- 本番SaaS認証やDB保存は作らない。
- YouTubeや実サービスの商標・素材は使わない。

## 主要状態

- empty: smoke対象run未選択。
- valid: HTML、asset、terminal evidence imageが200、byte sizeあり、content type妥当、3ブラウザ確認済み。
- failure: 404、0 byte、content type mismatch、latency超過をReview Findingへ変換。
- blocked: private URL、local path、Firefox未確認、receipt保存先不足、AIDD-Spec接続不足で公開前停止。

## 受け入れ条件

1. 画面タイトルは `Preview Smoke Receipt Binder`。
2. 日本語UIで、receipt id、source QA gate id、checked URLs、HTTP status、byte size、content type、latency、checked_at、evidence pathを表示する。
3. validでは「公開previewのHTTP証跡を保存できます」と表示する。
4. failureではReview Finding YAML風カードを表示する。
5. blockedでは「公開前停止」と理由を表示する。
6. `pnpm run doctor:aidd` が、状態名、AIDD-Spec接続、3ブラウザ、terminal evidence、local path禁止文言を検査する。
7. Playwright E2EはChromium / Firefox / WebKitで通す。
8. UI copy、テスト名、docsは日本語を基本にする。

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
