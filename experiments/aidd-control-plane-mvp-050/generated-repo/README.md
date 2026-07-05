# AIDD Control Plane MVP 050

## 機能名

Evidence Repair Delta Generator

## 目的

Verification Run Detailで見つかった`failed` / `evidence_missing` / `timeout`のfindingを、次回AI Task Packet delta、Codex prompt delta、検証command、rollback条件、Learning Log案へ変換する。

## 必須スクリプト

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp050
```

## 受け入れ条件

- UIは日本語。
- 画面内に`AIDD Control Plane MVP050`と`Evidence Repair Delta Generator`を表示する。
- empty / ready / failureの3状態を表示する。
- readyでは3つ以上のdelta候補を表示し、finding ID、失敗分類、優先度、理想状態、修正指示、AI Task Packet delta、Codex prompt delta、verification command、rollback condition、Learning Log案、AIDD-Spec接続を表示する。
- failureではfinding ID不足、失敗分類不足、優先度不足、AI Task Packet delta不足、Codex prompt delta不足、検証command不足、rollback条件不足、Learning Log不足、local path / host / private network URL混入、AIDD-Spec connection不足を表示する。
- `doctor:aidd`はMVP050固有token、AIDD-Spec接続、capture script、3ブラウザE2E設定、local pathブロック文言を確認する。
