# AIDD Control Plane MVP 077: Preview Smoke Receipt Binder

## 目的

MVP076 Publication Evidence QA Gateの後段として、公開previewのHTMLと画像がHTTP経路で読めた事実を、単なる目視メモではなくVerification Evidence Receiptとして束ねる。

## 今回の1インクリメント

- `generated-repo/` にNext.js + TypeScriptアプリを実装する。
- 日本語UIで `?state=empty|valid|failure|blocked` を切り替える。
- preview HTML / asset / terminal evidence image のHTTP responseを、status / byte size / content type / latency / checked_at / evidence pathとして表示する。
- failureでは404、0 byte、content type mismatchをReview Findingへ変換する。
- blockedではprivate URL、local path、Firefox未確認、receipt保存先不足を公開前停止として表示する。
- AIDD-Spec v0.1と `standards/aidd-control-plane-mvp-v0.1.md` のVerification Evidence / Review Record / Learning Logへ接続する。

## 完了条件

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- empty / valid / failure / blocked / terminal evidenceのPNGを保存する。
- note向け記事とpreviewを更新する。
