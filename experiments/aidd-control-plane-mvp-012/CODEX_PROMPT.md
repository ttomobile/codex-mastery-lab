あなたはCodex Mastery Labの実装担当です。`experiments/aidd-control-plane-mvp-012/generated-repo` に、AIDD Control Plane MVP 012「Mock CI Evidence Connector」を実装してください。

前提:
- 既存のMVP 011実装をベースにしてよい。
- 日本語UI、日本語テスト名、日本語docsを維持する。
- AIDD-Spec v0.1と `standards/aidd-control-plane-mvp-v0.1.md` に接続するSaaS部品として扱う。
- 実GitHub API接続は非ゴール。ローカルmockで決定的に状態を切り替える。

実装すること:
1. package名とcapture scriptをMVP 012へ更新する。
2. `src/lib/mock-ci.ts` を追加または拡張し、CI run URL解析、mock CI状態、artifact不足、失敗job、token scope不足、timeout/fallback指示をdeterministicに生成する。
3. UIの初期画面に「Mock CI Evidence Connector」を追加し、状態切替（空の状態 / 証跡が揃った状態 / 証跡不足 / 取得タイムアウト）を表示する。
4. valid状態では必須artifact 7種類が揃い、不足0件になる。
5. failure状態では不足artifact、失敗job、短いcommit SHA、token scope不足、Evidence Gap Repair Plannerへ渡す修正指示、Codex prompt deltaを表示する。
6. timeout状態では再試行対象と、手動Artifact Evidence Binderへ戻すfallbackを表示する。
7. Unit testとE2E testを日本語名で追加/更新する。E2EはChromium/Firefox/WebKitで通るようにする。
8. `scripts/capture-mvp012.mjs` を作り、empty/valid/failure/terminal evidence画像を保存できるようにする。
9. `scripts/doctor-aidd.mjs` をMVP 012用に更新する。
10. docs/product-brief.md, docs/verification-plan.md, docs/review-record.md, docs/learning-log.md をMVP 012に合わせて更新する。

完了条件:
- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
が通る実装にしてください。

禁止:
- 実GitHub APIへの接続
- 英語UIへの戻し
- runtime生成物を前提にした実装
- `.next`, `node_modules`, `test-results`, `playwright-report`, `coverage`, `*.tsbuildinfo` のコミット前提化
