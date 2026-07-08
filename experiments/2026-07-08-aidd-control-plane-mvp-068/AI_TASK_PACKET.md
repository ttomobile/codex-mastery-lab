# AI Task Packet: AIDD Control Plane MVP 068 One-Run Execution Readiness Gate

## 目的

Smoke Finding Action Queueの `execute_now` itemを、Codex Run Queueへ入れる直前に ready / blocked として判定する。AIDD Control Planeが「見つけた失敗をすぐAIへ投げる」のではなく、1回分の実行条件を検査してから渡すSaaSであることを示す。

## 実装対象

`experiments/2026-07-08-aidd-control-plane-mvp-068/generated-repo/` にNext.js + TypeScript + pnpmの小さなアプリを作る。

## UI言語

日本語。フォーム、状態名、テスト名、サンプルデータ、エラー文、説明文を日本語にする。

## 必須画面状態

1. empty: 実行候補が未選択。古いAction Queueを使わない。
2. ready: execute_now itemだけが選ばれ、Codex command / sandbox / 検証 / 証跡 / rollback / AIDD-Spec接続が揃っている。
3. blocked: next_increment混入、危険command、sandbox不足、Firefox除外、terminal/failure screenshot不足、rollback不足、local path/private URL、AIDD-Spec接続不足を止める。
4. sanitized: 公開用にlocal path / host名 / private network URLが除去され、Codex prompt previewにexecute_nowだけが残る。

## 必須データ項目

- source_queue_id
- execute_now_action_id
- codex_command
- sandbox_mode
- required_verification_commands
- browser_projects: Chromium / Firefox / WebKit
- required_evidence: terminal / empty / valid / failure screenshot / Playwright report
- rollback_stop_condition
- ready_reason
- aidd_spec_connection
- sanitization_scan
- blocked_reasons
- codex_prompt_preview

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

- empty状態が表示される
- ready状態でexecute_nowだけがRun Queue直前のreadyになる
- blocked状態で危険command、Firefox除外、証跡不足、AIDD-Spec接続不足が止まる
- sanitized状態でlocal path/private URLを含まないCodex prompt previewを表示する

## doctor:aidd条件

次を検査するNode scriptを用意する。

- 日本語UI文言が存在する
- AIDD-Spec / AIDD Control Plane標準への接続文言が存在する
- Chromium / Firefox / WebKit をPlaywright configに含む
- local home path、host名、private network URLをsourceと生成assetに含めない
- execute_now以外のprompt混入を防ぐテストがある

## 証跡

Playwrightまたはcapture scriptで以下を保存する。

- `aidd-control-plane-mvp068-empty.png`
- `aidd-control-plane-mvp068-ready.png`
- `aidd-control-plane-mvp068-blocked.png`
- `aidd-control-plane-mvp068-sanitized.png`
- `aidd-control-plane-mvp068-terminal-evidence.png`

同じ画像を実験rootの `assets/` と `artifacts/screenshots/` に置く。
