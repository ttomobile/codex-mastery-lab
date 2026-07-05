# Verification Plan: AIDD Control Plane MVP 050

## 品質ゲート

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

## 画面状態

- empty: finding未読込で、次回AI Task Packetへ戻す材料がないことを説明する。
- ready: `failed` / `evidence_missing` / `timeout`の3つ以上のdelta候補を表示する。
- failure: finding ID不足、失敗分類不足、優先度不足、AI Task Packet delta不足、Codex prompt delta不足、検証command不足、rollback条件不足、Learning Log不足、local path / host / private network URL混入、AIDD-Spec connection不足を表示する。

## 証跡

`pnpm run capture:mvp050`でempty / ready / failure / terminal evidenceのPNGを生成し、実験ディレクトリとrepo rootの`assets/`へ保存する。
