# AIDD Control Plane MVP076: Publication Evidence QA Gate

Run Result Digest Publisher の後段として、note/preview 公開直前に記事・画像・terminal evidence・3ブラウザ・console・サニタイズ・AIDD-Spec接続を一画面で確認する Publication Evidence QA Gate を実装する。

## 接続する標準

- `standards/aidd-spec-v0.1.md`
- `standards/aidd-control-plane-mvp-v0.1.md` の Publication Evidence QA Gate
- AI Task Packet / Verification Evidence / Review Record / Learning Log

## 実装方針

- Next.js + TypeScript + pnpm
- UI、テスト名、サンプルデータは日本語
- `?state=empty|valid|failure|blocked` で状態切替
- 公開前QAで local path / private host / private network URL を blocked として止める
- Playwrightで empty / valid / failure / blocked を確認し、capture scriptでPNGを保存する

## 検証コマンド

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp076
```
