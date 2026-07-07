# AIDD Control Plane MVP061

Evidence Repair Delta Generatorは、Verification Run Detailのfailed / timeout / evidence_missingから修理deltaを生成するNext.js + TypeScriptアプリです。UIは日本語で、empty / valid / failure / repair_neededのfixtureだけを使います。

## 実行

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp061
```

## fixture

- `empty`: source queue itemがない。
- `valid`: 入力が十分なVerification Run Detailから、AI Task Packet delta / Codex prompt delta / verification command / rollback condition / Learning Log noteを表示する。
- `failure`: `blocked`としてsource detail不足、失敗分類不足、修正指示不足、Firefox除外、terminal/failure screenshot不足、local path / host / private network URL混入をReview Finding形式で表示する。
- `repair_needed`: execute_now / next_increment / learning_logに分け、次の1回に入れるdeltaを1件に絞る。

## 接続

画面では次のAIDD要素を明示します。

- AIDD-Spec v0.1
- AIDD Control Plane MVP v0.1
- Verification Evidence
- Review Record
- Learning Log
- AI Task Packet

## 静的確認

`pnpm run doctor:aidd`は次を確認します。

- MVP061固有語とEvidence Repair Delta Generator
- Chromium / Firefox / WebKitの3ブラウザ
- Review Finding形式と修理deltaの5項目
- execute_now / next_increment / learning_logの絞り込み
- terminal evidence、failure screenshot、playwright_report
- AIDD-Spec接続
- local path / host / private network URL混入検出

## capture

`pnpm run capture:mvp061`で以下を`generated-repo/artifacts/screenshots`、repo rootの`assets/`、実験側`artifacts/screenshots`へ保存します。

- `artifacts/screenshots/aidd-control-plane-mvp061-empty.png`
- `artifacts/screenshots/aidd-control-plane-mvp061-valid.png`
- `artifacts/screenshots/aidd-control-plane-mvp061-failure.png`
- `artifacts/screenshots/aidd-control-plane-mvp061-repair-needed.png`
- `artifacts/screenshots/aidd-control-plane-mvp061-terminal-evidence.png`
