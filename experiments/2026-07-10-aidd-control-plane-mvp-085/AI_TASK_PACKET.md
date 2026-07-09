# AI Task Packet: AIDD Control Plane MVP085 Final Receipt Failure Handoff Queue

## 背景

MVP084では、公開preview HTML・記事内画像・terminal evidence画像のHTTP結果を最終レシートに束ねた。次は、その最終レシートで発見されたfailure / blockedを、次回Codex実行へ渡せる1回分の行動キューへ変換する。

## ゴール

Next.js + TypeScriptで、Final Receipt Failure Handoff Queueを実装する。

## 対象状態

`?state=empty|queued|blocked|exported` で切り替える。

- empty: final receiptはあるがaction item未生成。
- queued: 404 / 0 byte / content type mismatch / latency超過が、lane付きaction itemへ変換済み。
- blocked: private URL、local path、host名、Firefox未確認、terminal evidence不足、failure screenshot不足、rollback不足、AIDD-Spec接続不足を検出して停止。
- exported: execute_now itemだけをCodex prompt previewとAI Task Packet patchへ出力。next_incrementとlearning_logは混ぜない。

## 必須UI

- 日本語UI。
- source receipt id / broken URL / HTTP status / byte size / content type / latency ms。
- finding category / severity / lane / priority reason。
- execute_now / next_increment / learning_log の明確な分離。
- Codex prompt previewにはexecute_nowのみ入ることを表示。
- AI Task Packet patch / verification commands / required evidence / rollback condition。
- Chromium / Firefox / WebKit coverage。
- terminal evidence、failure screenshot、Playwright report、console status、sanitization scan。
- Review Finding YAML、Learning Log、AIDD-Spec接続。

## 検証

個別に実行し、`artifacts/terminal/*.txt` に保存する。

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`

## 証跡

- empty / queued / blocked / exported / terminal evidence のPNGを `assets/` と `artifacts/screenshots/` に保存する。
- 記事ではスクリーンショットとterminal evidence画像を必ず参照する。

## 非ゴール

- 実公開URLへのネットワークアクセスはしない。
- 実Codex実行キュー投入はしない。今回の範囲は、投入直前のhandoff queueとprompt previewまで。
