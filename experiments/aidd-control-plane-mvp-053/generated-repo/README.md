# AIDD Control Plane MVP053

STOP/BRAKE時にAI Task Packetを自動縮小する提案を表示する小さなNext.js + TypeScriptアプリです。MVP052のRun Budget Gateの次段として、ready / brake / stopの3ケースを切り替え、brake/stopでは縮小後AI Task Packet提案を生成します。

## 実行方法

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

## 検証コマンド

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp053
```

## 表示するケース

- `ready`: 縮小提案なし。元のAI Task Packetを維持する。
- `brake`: `keep_now`、`defer_next_increment`、`minimum_verification`、`fallback_action`、`resume_condition`、`evidence_paths`、`prompt_preview`を含む縮小後AI Task Packet提案を出す。
- `stop`: 実装停止をfallbackとして明示し、再開条件と最小検証だけを残す。

## 公開前ブロック

local path、private host、private URLを検出します。縮小提案内では公開用に`WORKSPACE`または`HOME`へサニタイズして表示します。

## Capture

`pnpm run capture:mvp053`で以下を生成します。

- `assets/aidd-control-plane-mvp053-ready.png`
- `assets/aidd-control-plane-mvp053-brake.png`
- `assets/aidd-control-plane-mvp053-stop.png`
- `assets/aidd-control-plane-mvp053-terminal-evidence.png`
