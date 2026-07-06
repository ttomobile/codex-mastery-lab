# Verification Plan: AIDD Control Plane MVP053

## Unit

- readyは`decision=ready`で縮小提案を出さない。
- brakeは`decision=brake`で縮小後AI Task Packet提案を出す。
- stopは`fallback_action`と`resume_condition`を含む縮小提案を出す。
- `sanitizeForPublic`がlocal path、private host、private URLを`WORKSPACE`または`HOME`へ変換する。

## E2E

PlaywrightはChromium / Firefox / WebKitを対象にする。設定は`timeout: 120_000`、`expect: { timeout: 90_000 }`、`workers: 1`、ローカル`retries: 1`で安定化する。

- readyケース: 縮小提案が生成されないこと。
- brakeケース: `keep_now`、`minimum_verification`、`resume_condition`、サニタイズ済み証跡pathが見えること。
- stopケース: 停止fallback、resume condition、private URLの公開用表示が見えること。

## Doctor

`pnpm run doctor:aidd`で以下を確認する。

- `AIDD Control Plane MVP053`
- `STOP/BRAKE時にAI Task Packetを自動縮小する提案`
- `縮小後AI Task Packet提案`
- `minimum_verification`
- `resume_condition`
- Chromium / Firefox / WebKit設定
- `aidd-control-plane-mvp053-ready.png`
- `aidd-control-plane-mvp053-brake.png`
- `aidd-control-plane-mvp053-stop.png`
- `aidd-control-plane-mvp053-terminal-evidence.png`
