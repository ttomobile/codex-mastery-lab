# AIDD Control Plane MVP 054

テーマ: Shrink Plannerで小さく畳んだAI Task Packetを、次回実行へ渡す前に「縮小版ハンドオフレシート」として確認する。

## 背景

MVP053では、Codex Run Budget Gateがbrake/stopになった時に keep_now / defer_next_increment / minimum_verification / resume_condition を生成した。次の不足は、その縮小提案が本当に次回のCodex promptへ安全に渡せる形かを、実行前に確認する画面である。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md`
- AI Task Packet
- Verification Evidence
- Review Record
- Learning Log

## 受け入れ条件

- 日本語UIで empty / valid / blocked の3状態を表示する。
- validでは縮小版ハンドオフレシートとして、source shrink plan、execute_now、defer_next_increment、minimum_verification、Codex prompt preview、required evidence、rollback conditionを表示する。
- blockedでは未サニタイズのlocal path/private host、minimum_verification不足、rollback不足、3ブラウザ不足を公開前ブロックとして表示する。
- 純粋関数とunit testで判定ロジックを検証する。
- Playwright E2Eで Chromium / Firefox / WebKit の3状態を検証する。
- `doctor:aidd` でMVP054固有token、AIDD-Spec接続、3ブラウザ、画像証跡名を確認する。
