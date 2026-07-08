# AI Task Packet: AIDD Control Plane MVP 063 修正版

## Task

Codex Run Queue Status Trackerを、実行状態UIだけでなく、Verification Evidence / Review Record / Learning Logへ戻る証跡単位として実装する。

## Context

MVP062ではrepair deltaを採用/保留/却下へ分けた。次に必要なのは、採用済みdeltaをCodexへ渡した後、その実行が待機中・実行中・成功・失敗・証跡不足のどこにあるかを追跡し、失敗や不足を次回AI Task Packetへ戻すことである。

## Acceptance Criteria

- AC-063-1: UIで `empty / waiting / running / succeeded / failed / evidence_missing` を切り替えられる。
- AC-063-2: 各状態で実行コマンド、検証コマンド、ブラウザ範囲、terminal evidence、screenshot evidence、rollback plan、Review Record出力、Learning Log出力を表示する。
- AC-063-3: `failed` は「実行失敗」をReview Findingとして表示し、足りないものと修正指示を出す。
- AC-063-4: `evidence_missing` は「証跡不足」をReview Findingとして表示し、`capture:mvp063 && doctor:aidd` を再検証コマンドとして出す。
- AC-063-5: Playwright E2EはChromium / Firefox / WebKitを維持する。
- AC-063-6: 6状態のPNG、掲載用GIF、browser console log、terminal evidenceを保存する。
- AC-063-7: 検証補助scriptもlint対象とし、空catchを残さない。

## Verification Commands

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage
pnpm run build
pnpm run doctor:aidd
pnpm run test:e2e
pnpm run capture:mvp063
node scripts/console-check-mvp063.mjs
```

## Required Evidence

- `artifacts/terminal/*.txt`
- `artifacts/screenshots/aidd-control-plane-mvp063-*.png`
- `assets/aidd-control-plane-mvp063-status-flow.gif`
- `artifacts/terminal/browser-console-mvp063.txt`
- `FINDINGS.md`

## Rollback Condition

- Firefoxを外した場合
- `failed` / `evidence_missing` のReview Findingが出なくなった場合
- terminal evidenceまたはscreenshot evidenceが不足した場合
- lint / typecheck / test / build / doctor:aidd / test:e2e のいずれかが失敗した場合
