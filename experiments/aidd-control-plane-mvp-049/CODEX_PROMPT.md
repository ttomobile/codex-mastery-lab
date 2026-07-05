# Codex Prompt: AIDD Control Plane MVP 049

あなたはCodex Mastery Labの実装担当です。`<repo>` のgit repo内で作業してください。

## タスク

`experiments/aidd-control-plane-mvp-049/generated-repo/` に、AIDD Control Plane SaaSの **Verification Run Detail Drilldown** MVPを実装してください。

既存の `experiments/aidd-control-plane-mvp-048/generated-repo/` を参考にしてよいですが、MVP049として独立したNext.js + TypeScript + pnpmプロジェクトにしてください。

## 実装要件

- UIは日本語
- テスト名も日本語
- empty / ready / failure の3状態を表示
- ready状態は、Codex Run Queueの1件を command別 Verification Run Detail として見せる
- readyに含める項目:
  - source queue item
  - source run status
  - commit SHA
  - command name（lint / typecheck / test / build / test:e2e / doctor:aidd）
  - exit code
  - duration
  - terminal log path
  - artifact path
  - failure category（readyでは「なし」または「修正不要」）
  - repair instruction（readyでは「追加修正なし」）
  - Chromium / Firefox / WebKit coverage
  - terminal / empty / ready / failure screenshot evidence
  - AIDD-Spec v0.1、Verification Evidence、Review Record、Learning Logへの接続
- failure状態は以下を検出して日本語で表示する
  - commit SHA不足
  - command別detail不足
  - exit code不足
  - artifact path不足
  - 失敗分類不足
  - 修正指示不足
  - Firefox除外
  - terminal evidence不足
  - failure screenshot不足
  - local path / host / private network URL混入
  - AIDD-Spec connection不足
- Review Finding draftとして、失敗分類、理想状態、修正指示、必要な上流情報、検証commandを表示

## 必須スクリプト

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`（Chromium / Firefox / WebKit）
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp049`

## 証跡要件

`capture:mvp049` は次の画像を生成してください。

- `artifacts/screenshots/aidd-control-plane-mvp049-empty.png`
- `artifacts/screenshots/aidd-control-plane-mvp049-ready.png`
- `artifacts/screenshots/aidd-control-plane-mvp049-failure.png`
- `artifacts/screenshots/aidd-control-plane-mvp049-terminal-evidence.png`

同じ画像をrepo rootの `assets/` にもコピーしてください。

## 注意

- runtime生成物（node_modules, .next, test-results, playwright-report, coverage, *.tsbuildinfo）はコミット対象にしない
- ローカルパス、host名、private network URLをUI・記事・証跡に入れない
- 実装後の検証はHermes側で独立して行うため、あなたの自己申告だけで完了扱いにはしない
