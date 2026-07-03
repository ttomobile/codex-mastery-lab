# AIDD Control Plane MVP 029: Adopted Bundle Exporter

## 目的

MVP 028のDiff Bundle Decision Ledgerで `adopted` と判断されたbundleだけを、次回AI Task Packet / Verification Plan / Codex promptへ書き出す直前のExportプレビューとして扱う。

## 今回のMVP

- 採用済みbundleだけをexport候補に含める。
- 却下・保留・未判断bundleが混ざった場合はReview Findingとして止める。
- Markdown section、Verification Plan patch、Codex prompt patch、rollback condition、review evidenceを画面で確認できる。
- AIDD-Spec v0.1のAI Task Packet / Verification Evidence / Review Record / Learning Log / Rollback Planに接続する。

## 完了条件

`generated-repo/` で以下を独立検証し、ログを `artifacts/terminal/` に保存する。

```text
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp029
```
