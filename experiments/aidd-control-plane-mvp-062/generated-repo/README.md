# AIDD Control Plane MVP062

Repair Delta Priority Decision Workspaceは、Evidence Repair Deltaを採用 / 保留 / 却下として判断し、採用済みdeltaだけを次回AI Task Packet / Codex promptへ進めるNext.js + TypeScriptアプリです。UIは日本語で、empty / valid / failure / decision_neededのfixtureだけを使います。

## 実行

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp062
```

## fixture

- `empty`: 判断するrepair deltaがない。
- `valid`: 採用済みdeltaだけをAI Task Packet patch / Codex prompt previewへ入れ、保留 / 却下はLearning Logへ戻す。
- `failure`: 未判断、理由不足、証跡不足、rollback不足、Firefox除外、未採用delta混入、local path / host / private network URL混入をReview Finding形式で表示する。
- `decision_needed`: adopt_now / hold_next_increment / reject_to_learning_logに分け、次の1回に入れるdeltaを最大1〜2件へ絞る。

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

- MVP062固有語とRepair Delta Priority Decision Workspace
- 採用 / 保留 / 却下の判断
- adopt_now / hold_next_increment / reject_to_learning_logのlane
- Chromium / Firefox / WebKitの3ブラウザ
- Review Finding形式
- terminal evidence、failure screenshot、Playwright report相当の証跡名
- AIDD-Spec接続
- local path / host / private network URL混入検出

## capture

`pnpm run capture:mvp062`で以下を`generated-repo/artifacts/screenshots`へ保存します。

- `artifacts/screenshots/aidd-control-plane-mvp062-empty.png`
- `artifacts/screenshots/aidd-control-plane-mvp062-valid.png`
- `artifacts/screenshots/aidd-control-plane-mvp062-failure.png`
- `artifacts/screenshots/aidd-control-plane-mvp062-decision-needed.png`
- `artifacts/screenshots/aidd-control-plane-mvp062-terminal-evidence.png`
