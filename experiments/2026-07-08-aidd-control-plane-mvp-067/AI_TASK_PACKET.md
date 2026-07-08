# AI Task Packet: AIDD Control Plane MVP 067 Smoke Finding Action Queue

## 目的

Public Preview Smoke Verifierの失敗結果を「見つけた」で終わらせず、次にCodexへ渡せる行動キューへ変換する。AIDD Control Planeが、AI量産記事ではなく一次情報と検証証跡を次の改善へ戻すSaaSであることを示す。

## 実装対象

`experiments/2026-07-08-aidd-control-plane-mvp-067/generated-repo/` にNext.js + TypeScript + pnpmの小さなアプリを作る。

## UI言語

日本語。フォーム、状態名、テスト名、サンプルデータ、エラー文、説明文を日本語にする。

## 必須画面状態

1. empty: Smoke結果が未選択。古い検査結果を使わないことを説明する。
2. queued: asset 404や0 byteをReview Finding Action Queueへ変換し、execute_now / next_increment / learning_logを分ける。
3. blocked: private URL、local path、Firefox未確認、terminal evidence画像不足、AIDD-Spec接続不足を公開前に止める。
4. exported: execute_nowだけをAI Task Packet patch / Codex prompt previewへ書き出す。next_incrementとlearning_logは混入させない。

## 必須データ項目

- source_smoke_run_id
- broken_url
- http_status
- byte_size
- content_type
- finding_category
- severity
- lane: execute_now | next_increment | learning_log
- priority_reason
- ai_task_packet_patch
- codex_prompt_patch
- verification_commands
- required_evidence
- rollback_condition
- aidd_spec_connection
- sanitization_status

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
- queued状態で壊れたassetが行動キューへ変換される
- blocked状態でprivate URLやFirefox不足が止まる
- exported状態でexecute_nowだけがCodex prompt previewへ入る

## doctor:aidd条件

次を検査するNode scriptを用意する。

- 日本語UI文言が存在する
- AIDD-Spec / AIDD Control Plane標準への接続文言が存在する
- Chromium / Firefox / WebKit をPlaywright configに含む
- local home path、host名、private network URLをsourceと生成assetに含めない
- execute_now以外のprompt混入を防ぐテストがある

## 証跡

Playwrightまたはcapture scriptで以下を保存する。

- `aidd-control-plane-mvp067-empty.png`
- `aidd-control-plane-mvp067-queued.png`
- `aidd-control-plane-mvp067-blocked.png`
- `aidd-control-plane-mvp067-exported.png`
- `aidd-control-plane-mvp067-terminal-evidence.png`

同じ画像を実験rootの `assets/` と `artifacts/screenshots/` に置く。
