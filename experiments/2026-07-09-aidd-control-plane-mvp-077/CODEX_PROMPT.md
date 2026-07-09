`experiments/2026-07-09-aidd-control-plane-mvp-077/generated-repo/` に、Next.js + TypeScript + pnpmの小さなAIDD Control Plane MVPを実装してください。

題材は **Preview Smoke Receipt Binder** です。MVP076 Publication Evidence QA Gateの後段として、公開preview HTML / asset / terminal evidence imageがHTTP経路で読めた事実をReceiptとして束ねます。

必須要件:

- 日本語UI。
- `?state=empty|valid|failure|blocked` で状態切替。
- タイトル: `Preview Smoke Receipt Binder`。
- receipt id、source QA gate id、checked URLs、HTTP status、byte size、content type、latency ms、checked_at、evidence path、Chromium / Firefox / WebKit、console status、sanitization scan、AIDD-Spec接続を表示。
- valid: 「公開previewのHTTP証跡を保存できます」を表示。
- failure: 404、0 byte、content type mismatch、latency超過をReview Findingとして表示。
- blocked: private URL、local path、Firefox未確認、receipt保存先不足、AIDD-Spec接続不足を公開前停止として表示。
- domainロジックをsrc/domain配下に分離し、unit testを書く。
- Playwright E2EをChromium / Firefox / WebKitで実行できる設定にする。
- `doctor:aidd` scriptを作り、重要文言と状態、AIDD-Spec接続、3ブラウザ表示、公開前停止理由を検査する。
- `capture:mvp077` scriptで empty / valid / failure / blocked / terminal evidence のPNGを `artifacts/screenshots/` と `assets/` に保存する。
- runtime生成物をgit対象にしない `.gitignore` を用意。

実行できるpackage scripts:

- `lint`
- `typecheck`
- `test`
- `build`
- `test:e2e`
- `doctor:aidd`
- `capture:mvp077`

実装後、Codex内で可能な範囲で検証してください。ただし最終判断は外部の独立検証で行います。
