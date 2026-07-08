# AIDD Control Plane MVP063

Codex Run Queue Status Trackerは、Run Queueに入ったCodex実行を `empty` / `waiting` / `running` / `succeeded` / `failed` / `evidence_missing` で表示するNext.js + TypeScriptアプリです。UI、テスト名、ドキュメントは日本語を基本にしています。

## 実行

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp063
```

## fixture

- `empty`: Run Queueが空。古い証跡を表示しない。
- `waiting`: Codex実行が待機中。実行コマンド、検証コマンド、3ブラウザ範囲を確認する。
- `running`: 実行中。完了扱いにせず証跡到着を待つ。
- `succeeded`: terminal evidence、screenshot evidence、Review Record出力、Learning Log出力、rollback planがそろった成功。
- `failed`: 実行失敗をReview Findingとして出す。
- `evidence_missing`: 実行は通過している可能性があるが、terminal evidenceまたはscreenshot evidenceが不足している。

## 画面に出す項目

- 実行コマンド
- 検証コマンド
- ブラウザ範囲: Chromium / Firefox / WebKit
- terminal evidence
- screenshot evidence
- rollback plan
- Review Record出力
- Learning Log出力
- failed / evidence_missingのReview Finding

## capture

`pnpm run capture:mvp063`で以下を`generated-repo/artifacts/screenshots`へ保存します。

- `artifacts/screenshots/aidd-control-plane-mvp063-empty.png`
- `artifacts/screenshots/aidd-control-plane-mvp063-waiting.png`
- `artifacts/screenshots/aidd-control-plane-mvp063-running.png`
- `artifacts/screenshots/aidd-control-plane-mvp063-succeeded.png`
- `artifacts/screenshots/aidd-control-plane-mvp063-failed.png`
- `artifacts/screenshots/aidd-control-plane-mvp063-evidence-missing.png`
