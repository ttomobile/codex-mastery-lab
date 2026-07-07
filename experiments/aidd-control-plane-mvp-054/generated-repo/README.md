# AIDD Control Plane MVP054

縮小版AI Task Packetを次回実行へ渡す前のハンドオフレシートを表示する小さなNext.js + TypeScriptアプリです。MVP053のShrink Plannerの次段として、empty / valid / blockedの3ケースを切り替えます。

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
pnpm run capture:mvp054
```

## 表示するケース

- `empty`: MVP053からsource_shrink_plan_idが届いていないため、縮小版ハンドオフレシートを生成しない。
- `valid`: `source_shrink_plan_id`、`execute_now`、`defer_next_increment`、`minimum_verification`、`codex_prompt_preview`、`required_evidence`、`rollback_condition`、`aidd_spec_connections`を含む縮小版ハンドオフレシートを表示する。
- `blocked`: 未サニタイズのlocal path/private host/private network URL、minimum_verification不足、rollback不足、Chromium/Firefox/WebKit不足、evidence不足を公開前ブロックとして表示し、修正指示を出す。

## Capture

`pnpm run capture:mvp054`で以下を生成し、repo rootの`assets/`と実験側の`artifacts/screenshots/`へコピーします。

- `assets/aidd-control-plane-mvp054-empty.png`
- `assets/aidd-control-plane-mvp054-valid.png`
- `assets/aidd-control-plane-mvp054-blocked.png`
- `assets/aidd-control-plane-mvp054-terminal-evidence.png`
