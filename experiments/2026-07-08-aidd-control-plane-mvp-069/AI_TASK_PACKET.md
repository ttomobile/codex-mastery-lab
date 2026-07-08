# AI Task Packet: AIDD Control Plane MVP 069 Codex Run Budget Shrink Planner

## 目的

One-Run Execution Readiness Gate / Codex Run Budget Gateで`brake`または`stop`になった時、実行を諦めるだけでなく、縮小後AI Task Packetを生成する。AIDD Control Planeが「大きすぎる依頼を安全な1回分へ畳む」SaaSであることを示す。

## 実装対象

`experiments/2026-07-08-aidd-control-plane-mvp-069/generated-repo/` にNext.js + TypeScript + pnpmの小さなアプリを作る。

## UI言語

日本語。フォーム、状態名、テスト名、サンプルデータ、エラー文、説明文を日本語にする。

## 必須画面状態

1. ready: 予算内。keep_now、検証、証跡、rollback、AIDD-Spec接続が揃っている。
2. brake: 実行量が大きい。keep_nowを1件に縮小し、defer_next_incrementを次回送りにする。
3. stop: 最低検証、3ブラウザ、証跡、rollbackが不足しているため実行しない。
4. sanitized: 公開用promptからlocal path / private host / private network URLを除去し、keep_nowだけを残す。

## 必須データ項目

- source_packet_id
- usage_band: low / medium / high / overflow
- keep_now
- defer_next_increment
- minimum_verification
- fallback_action
- resume_condition
- evidence_paths
- prompt_preview
- blocked_reasons
- sanitization_scan
- aidd_spec_connection

## 品質ゲート

個別ログを `../artifacts/terminal/*.txt` に保存できるようにする。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## E2E条件

Chromium / Firefox / WebKitで次を確認する。

- ready状態が表示される
- brake状態でkeep_nowとdefer_next_incrementが分かれる
- stop状態で最低検証・証跡・rollback不足を止める
- sanitized状態で公開用promptにkeep_nowだけが残り危険文字列がない

## doctor:aidd条件

次を検査するNode scriptを用意する。

- 日本語UI文言が存在する
- AIDD-Spec / AIDD Control Plane標準への接続文言が存在する
- Chromium / Firefox / WebKit をPlaywright configに含む
- local home path、host名、private network URLをsourceと生成assetに含めない
- defer_next_incrementがpromptへ混入しないテストがある

## 証跡

Playwrightまたはcapture scriptで以下を保存する。

- `aidd-control-plane-mvp069-ready.png`
- `aidd-control-plane-mvp069-brake.png`
- `aidd-control-plane-mvp069-stop.png`
- `aidd-control-plane-mvp069-sanitized.png`
- `aidd-control-plane-mvp069-terminal-evidence.png`

同じ画像をrepo rootの `assets/` と実験rootの `artifacts/screenshots/` に置く。
