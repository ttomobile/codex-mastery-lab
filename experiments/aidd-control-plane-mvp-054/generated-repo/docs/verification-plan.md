# Verification Plan: AIDD Control Plane MVP054

## Unit

- emptyは`decision=empty`で縮小版ハンドオフレシートを生成しない。
- validは`decision=valid`で必須項目を持つ縮小版ハンドオフレシートを生成する。
- blockedは未サニタイズのlocal path/private host/private network URL、minimum_verification不足、rollback不足、Chromium/Firefox/WebKit不足、evidence不足を公開前ブロックとして返す。
- `sanitizeForPublic`がlocal path、private host、private network URLを`WORKSPACE`または`HOME`へ変換する。

## E2E

PlaywrightはChromium / Firefox / WebKitを対象にする。設定は`timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`、ローカル`retries: 1`で安定化する。

- emptyケース: レシートが生成されないこと。
- validケース: `source_shrink_plan_id`、`execute_now`、`defer_next_increment`、`minimum_verification`、`codex_prompt_preview`、`required_evidence`、`rollback_condition`、`aidd_spec_connections`が見えること。
- blockedケース: 公開前ブロック5種類と修正指示、サニタイズ済みプレビューが見えること。

## Doctor

`pnpm run doctor:aidd`で以下を確認する。

- `AIDD Control Plane MVP054`
- `縮小版AI Task Packetを次回実行へ渡す前のハンドオフレシート`
- `縮小版ハンドオフレシート`
- `AIDD-Spec接続`
- `source_shrink_plan_id`
- `minimum_verification`
- `rollback_condition`
- Chromium / Firefox / WebKit設定
- `aidd-control-plane-mvp054-empty.png`
- `aidd-control-plane-mvp054-valid.png`
- `aidd-control-plane-mvp054-blocked.png`
- `aidd-control-plane-mvp054-terminal-evidence.png`
