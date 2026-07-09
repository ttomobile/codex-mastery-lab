# AI Task Packet: AIDD Control Plane MVP084 Public Preview Smoke Final Receipt

## 背景

MVP083では複数のSmoke Repair候補を今回実行する1件へ絞った。次は、記事公開前にpreview HTML、記事内画像、terminal evidence画像がHTTP経路で読める事実を最終レシートとして束ねたい。

## ゴール

Next.js + TypeScriptで、Public Preview Smoke Final Receiptを実装する。

## 対象状態

`?state=empty|verified|failure|blocked` で切り替える。

- empty: smoke対象URLと必要証跡が未登録
- verified: preview HTML、initial/valid/failure/terminal evidence画像、3ブラウザcoverage、console status、sanitization scanが通った状態
- failure: 404、0 byte、content type mismatch、latency超過をReview Findingへ変換
- blocked: private URL、local path、host名、Firefox未確認、terminal evidence不足、AIDD-Spec接続不足、rollback不足を公開前に止める

## 必須UI

- 日本語UI
- receipt id / source gate id / article path / preview URL / checked URLs / HTTP status / byte size / content type / latency ms / checked_at
- terminal evidence image response
- Chromium / Firefox / WebKit coverage
- console status
- sanitization scan
- Review Finding YAML
- Learning Log
- AI Task Packet delta
- Codex prompt delta
- rollback condition
- AIDD-Spec接続

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

- empty / verified / failure / blocked / terminal evidence のPNGを `assets/` と `artifacts/screenshots/` に保存する。
- 記事ではスクリーンショットとterminal evidence画像を必ず参照する。

## 非ゴール

- 実GitHub Actions API連携はしない。
- 外部公開URLへ実アクセスしない。fixture化されたHTTP smoke結果をUIで扱う。
