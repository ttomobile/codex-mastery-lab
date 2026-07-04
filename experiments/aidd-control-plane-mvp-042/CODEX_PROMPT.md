あなたはCodex Mastery Labの実装担当です。`experiments/aidd-control-plane-mvp-042/generated-repo/` はMVP 041のAIDD Control Plane実装をコピーしたNext.js + TypeScriptアプリです。

目的: AIDD Control Plane MVP 042として「Review Record Receipt Synthesizer」を追加してください。

必ず次を満たしてください。

1. `src/lib/intake.ts`
   - `ReviewRecordReceiptSynthesizerMode = "empty" | "valid" | "failure"` を追加
   - Review Record Receipt Synthesizer用の型、empty/valid/failure factory、evaluatorを追加
   - validは `createValidVerificationEvidenceReceiptBinder()` をsourceにし、score、review findings、needed upstream info、standard update、AI Task Packet delta、Codex prompt delta、verification command、Learning Log note、terminal evidence、failure screenshot、Chromium / Firefox / WebKit、AIDD-Spec接続を含める
   - failureはsource不足、score根拠不足、finding分類不足、needed upstream info不足、AI Task Packet delta不足、Codex prompt delta不足、verification command不足、Learning Log接続不足、Firefox除外、terminal/failure screenshot不足、local path/host/private network URL混入を検出できるデータにする
   - evaluatorはvalid/empty/failureを判定し、issues配列に日本語の不足理由を返す

2. `app/page.tsx`
   - UIに「Review Record Receipt Synthesizer」セクションを追加
   - `review empty` / `review valid` / `review failure` ボタンを追加
   - score、finding、needed upstream info、standard update、AI Task Packet delta、Codex prompt delta、verification command、Learning Log、evidence referencesを日本語で表示
   - empty/failure状態も分かりやすく表示

3. `tests/intake.test.ts`
   - 日本語名のunit testを追加し、empty/valid/failureの評価を確認

4. `e2e/intake-wizard.spec.ts`
   - Chromium / Firefox / WebKitで通るテストを追加
   - strict mode違反を避け、同じ文言が複数ある場合はscopeやfirst()を使う

5. `scripts/doctor-aidd.mjs`
   - MVP 042の文言、factory、unit test、E2E、capture script、AIDD-Spec接続を検査

6. `scripts/capture-mvp042.mjs` と `package.json`
   - `pnpm run capture:mvp042` を追加
   - empty/valid/failure/terminal evidenceのPNGを `../artifacts/screenshots/` に保存する
   - ファイル名は `aidd-control-plane-mvp042-empty.png`、`valid.png`、`failure.png`、`terminal-evidence.png`

7. 実装後、可能なら次を実行して直してください。
   - `pnpm install --frozen-lockfile`
   - `pnpm run lint`
   - `pnpm run typecheck`
   - `pnpm run test`
   - `pnpm run build`
   - `pnpm run test:e2e`
   - `pnpm run doctor:aidd`

制約:
- UI文言・テスト名は日本語中心。
- YouTube等の実商標や実データは使わない。
- `<home>` のようなローカル絶対パス、host名、private network URLを公開用文言に入れない。
- runtime生成物をコミット対象にする必要はありません。
