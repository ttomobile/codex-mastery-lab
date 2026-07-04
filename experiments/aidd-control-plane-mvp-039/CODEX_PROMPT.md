# Codex Prompt: AIDD Control Plane MVP 039

あなたはCodex Mastery Labの実装担当です。`experiments/aidd-control-plane-mvp-039/generated-repo/` に、AIDD Control Plane MVP 039「One-Run Handoff Pack Reviewer」を実装してください。

## 必ず読む

- `../AI_TASK_PACKET.md`
- `../../../standards/aidd-spec-v0.1.md`
- `../../../standards/aidd-control-plane-mvp-v0.1.md`

## 実装要件

1. MVP 038のExecution Priority Set Builderの次段として、`execute_now` に絞ったrepair deltaから、次の1回のCodex実行へ渡す手渡しパックをレビューできるようにする。
2. `src/lib/intake.ts` に `OneRunHandoffPackReviewer` 系の型、empty/valid/failure factory、evaluatorを追加する。
3. valid sampleには次を含める。
   - source execution set / execute_now delta id
   - AI Task Packet patch
   - Codex prompt
   - verification commands: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd`
   - browser projects: Chromium / Firefox / WebKit
   - required evidence: terminal, empty screenshot, valid screenshot, failure screenshot, Playwright report
   - rollback condition
   - note article angle
   - AIDD-Spec / Control Plane MVP接続
4. failure sampleには次の欠陥を入れ、evaluatorで検出する。
   - source不足
   - AI Task Packet patch不足
   - Codex prompt不足
   - 検証コマンド不足
   - Firefox除外または1ブラウザだけの浅い検証
   - terminal / screenshot evidence不足
   - rollback不足
   - AIDD-Spec接続不足
   - local path / host / tailnet / private network URL混入
5. `app/page.tsx` に「One-Run Handoff Pack Reviewer」セクションと `handoff empty` / `handoff valid` / `handoff failure` ボタンを追加し、日本語で状態を表示する。
6. unit testとPlaywright E2Eを日本語名で追加する。
7. `scripts/doctor-aidd.mjs` をMVP 039向けに更新し、実装・テスト・E2E・UI文言を検査する。
8. `scripts/capture-mvp039.mjs` とpackage script `capture:mvp039` を追加し、empty / valid / failure / terminal evidence画像を生成する。
9. `package.json` のnameを `aidd-control-plane-mvp-039` に更新する。

## 実行してよい検証

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run test:e2e
pnpm run doctor:aidd
```

## 注意

- UI、テスト名、サンプル文言は日本語を基本にしてください。
- YouTube等の実サービス商標や実データは使わないでください。
- ローカルパス、host名、tailnet、private network URLを公開用記事やスクリーンショットへ残さない前提で実装してください。
- 実際にCodexを起動するジョブキューは作らないでください。
