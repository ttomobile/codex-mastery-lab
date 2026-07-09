# Publication Evidence QA Gate MVP076

Run Result Digest を note/preview 公開へ進める直前に、記事・画像・terminal evidence・3ブラウザ・console・サニタイズ・AIDD-Spec接続を確認する Next.js + TypeScript のMVPです。

## 実行方法

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
pnpm run capture:mvp076
```

開発表示:

```bash
pnpm exec next dev
```

## 状態

- `?state=empty`: source digest 未選択。article path、preview path、asset copy、terminal evidence、initial/filled/failure/terminal screenshot、Chromium / Firefox / WebKit coverage、console status、sanitization scan、AIDD-Spec connection を必要入力として表示します。
- `?state=valid`: article path、preview path、asset copy status、terminal evidence status、4種類の必須スクリーンショット、3ブラウザ、console、sanitization scan、Review Record excerpt、Learning Log excerpt、AI Task Packet delta、Codex prompt delta、publish checklist を表示し、公開可能と判定します。
- `?state=failure`: Firefox未確認、terminal evidence不足、failure screenshot不足、console warn、記事観点不足、AIDD-Spec接続不足を Review Finding として表示します。failure は修正可能な公開QA不足です。
- `?state=blocked`: local path / private host / private network URL 混入を検出し、公開前停止として扱います。blocked は failure と同じ扱いにしません。

## AIDD-Spec接続

このMVPは AIDD-Spec v0.1 の Verification Evidence、Review Record、Learning Log、AI Task Packet delta、Codex prompt delta を公開前QAに戻す流れに接続しています。

`standards/aidd-control-plane-mvp-v0.1.md` の `Publication Evidence QA Gate` に対応し、Run Result Digest を公開へ進める前に article path、preview、asset copy、terminal evidence、initial/filled/failure/terminal evidence PNG、Chromium / Firefox / WebKit coverage、console status、sanitization scan、Review Record、Learning Log、AI Task Packet delta、Codex prompt delta、publish checklist を確認します。

## 検証コマンド

- `pnpm run lint`: ESLintでNext.js、TypeScript、scripts、testsを確認します。
- `pnpm run typecheck`: TypeScript型検査を実行します。
- `pnpm run test`: Vitestで `src/domain/publication-evidence-qa.ts` のドメイン判定を確認します。
- `pnpm run build`: Next.js production build を確認します。
- `pnpm run test:e2e`: Playwrightで Chromium / Firefox / WebKit の4状態を確認します。
- `pnpm run doctor:aidd`: 必須表示、3ブラウザ文言、サニタイズブロック文言、AIDD-Spec接続、公開可能/公開QA不足/公開前停止判定を静的検査します。
- `pnpm run capture:mvp076`: empty / valid / failure / blocked のPNGを `assets/` と `artifacts/screenshots/` に保存し、terminal evidence風PNGも生成します。
