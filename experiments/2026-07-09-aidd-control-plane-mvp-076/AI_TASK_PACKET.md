# AI Task Packet: Publication Evidence QA Gate MVP076

## 目的
AIDD Control Plane の小さな Next.js + TypeScript アプリとして、Run Result Digest を note/preview 公開へ進める直前に、記事・画像・terminal evidence・3ブラウザ・console・サニタイズ・AIDD-Spec接続を公開前QAとして確認する画面を作る。

## 実装ディレクトリ
`experiments/2026-07-09-aidd-control-plane-mvp-076/generated-repo/`

## 前提
- MVP001 workflow UI、MVP002 Contract Checker、MVP003 Evidence Collector、MVP075 Run Result Digest Publisher は完了済み。
- 今回は `standards/aidd-control-plane-mvp-v0.1.md` の `Publication Evidence QA Gate` を実体化する。
- UI、テスト名、README、サンプルデータは日本語。
- 商標・公式ロゴ・実サービスコピーを使わない。

## UI要件
`?state=empty|valid|failure|blocked` で状態を切り替える。

### empty
- source digest が未選択であることを表示。
- 公開前に必要な入力として、article path、preview path、asset copy、terminal evidence、initial/filled/failure/terminal screenshot、Chromium / Firefox / WebKit coverage、console status、sanitization scan、AIDD-Spec connection を表示。

### valid
- article path、preview path、asset copy status、terminal evidence status、4種類の必須スクリーンショット、Chromium / Firefox / WebKit coverage、console status、sanitization scan、Review Record excerpt、Learning Log excerpt、AI Task Packet delta、Codex prompt delta、publish checklist を表示。
- 「公開可能」判定を明確に表示。

### failure
- Firefox未確認、terminal evidence不足、failure screenshot不足、console warn、記事観点不足、AIDD-Spec接続不足を Review Finding として表示。
- 各findingに `category / severity / ideal_state / fix_instruction / verification command / needed_upstream_info` を含める。

### blocked
- local path / private host / private network URL 混入を検出して公開前に止める。
- どの項目がブロック理由か、修正指示と再検証コマンドを表示する。

## 実装要件
- domain model を `src/domain/publication-evidence-qa.ts` に分離する。
- `app/page.tsx` は domain data を表示するだけに近づける。
- Vitestで domain logic をテストする。
- Playwrightで4状態を確認する。プロジェクトは Chromium / Firefox / WebKit。
- `scripts/doctor-aidd.mjs` で、必須表示、3ブラウザ文言、サニタイズブロック文言、AIDD-Spec接続、公開可能/停止判定を静的検査する。
- `scripts/capture-mvp076.mjs` で empty / valid / failure / blocked のPNGを `assets/` と `artifacts/screenshots/` に保存する。
- terminal evidence風PNGも生成する。外部画像ツールがなければSVG/PNG生成スクリプトでよい。
- `README.md` に実行方法、状態、AIDD-Spec接続、検証コマンドを書く。

## package scripts
必ず次を用意する。

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp076`

## 受け入れ条件
- 4状態がブラウザで確認できる。
- failure と blocked が同じ扱いにならず、failure は修正可能な公開QA不足、blocked は公開前停止として表示される。
- local path / private host / private network URL 混入を blocked として検出する。
- Review Finding が AIDD-Spec の finding形式へ変換可能な項目を持つ。
- 検証ログとスクリーンショットが保存できる。

## Verification Evidence
独立検証で次を `artifacts/terminal/*.txt` に保存する。

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp076
