# Codex Prompt: AIDD Control Plane MVP 048

あなたはCodex Mastery Labの実装担当です。`<repo>` のgit repo内で作業してください。

## タスク

`experiments/aidd-control-plane-mvp-048/generated-repo/` に、AIDD Control Plane SaaSの **One-Run Execution Readiness Gate** MVPを実装してください。

既存の `experiments/aidd-control-plane-mvp-047/generated-repo/` を参考にしてよいですが、MVP048として独立したNext.js + TypeScript + pnpmプロジェクトにしてください。

## 実装要件

- UIは日本語
- テスト名も日本語
- empty / ready / blocked の3状態を表示
- ready状態は、Review Finding Action Queueの `execute_now` 1件だけをCodex実行へ渡す直前の手渡し確認として見せる
- blocked状態は以下を検出して日本語で表示する
  - source queue id不足
  - execute_now以外のaction混入
  - 危険command
  - sandbox mode不足
  - required verification commands不足
  - Firefox除外
  - terminal evidence不足
  - failure screenshot不足
  - rollback stop condition不足
  - local path / host / private network URL混入
  - AIDD-Spec connection不足
- Codex command previewにはreadyなexecute_now actionだけを入れ、next_incrementやlearning_logを混ぜない
- AIDD-Spec v0.1、Verification Evidence、Review Record、Learning Logへの接続を画面に表示

## 必須スクリプト

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`（Chromium / Firefox / WebKit）
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp048`

## 証跡要件

`capture:mvp048` は次の画像を生成してください。

- `artifacts/screenshots/aidd-control-plane-mvp048-empty.png`
- `artifacts/screenshots/aidd-control-plane-mvp048-ready.png`
- `artifacts/screenshots/aidd-control-plane-mvp048-blocked.png`
- `artifacts/screenshots/aidd-control-plane-mvp048-terminal-evidence.png`

同じ画像をrepo rootの `assets/` にもコピーしてください。

## 注意

- runtime生成物（node_modules, .next, test-results, playwright-report, coverage, *.tsbuildinfo）はコミット対象にしない
- ローカルパス、host名、private network URLをUI・記事・証跡に入れない
- 実装後の検証はHermes側で独立して行うため、あなたの自己申告だけで完了扱いにはしない
