# Codex Prompt: MVP084

`experiments/2026-07-10-aidd-control-plane-mvp-084/generated-repo/` に、AIDD Control Plane MVP084 Public Preview Smoke Final Receiptを実装してください。

要件:

1. Next.js + TypeScript、日本語UI。
2. `?state=empty|verified|failure|blocked`。
3. preview HTML、assets、terminal evidence imageのHTTP status、byte size、content type、latency ms、checked_atを表示。
4. terminal evidence image response、Chromium / Firefox / WebKit coverage、console status、sanitization scanを表示。
5. failureでは404 / 0 byte / content type mismatch / latency超過をReview Finding YAML、Learning Log、AI Task Packet delta、Codex prompt deltaへ変換。
6. blockedではprivate URL、local path、host名、Firefox未確認、terminal evidence不足、AIDD-Spec接続不足、rollback不足を止める。
7. `pnpm run lint/typecheck/test/build/test:e2e/doctor:aidd` が通ること。
8. `pnpm run capture:mvp084` で empty / verified / failure / blocked / terminal evidence PNGを保存すること。

実装後は自己申告だけでなく、上記コマンドを独立に実行できる状態にしてください。
