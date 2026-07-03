# AI Task Packet: AIDD Control Plane MVP 030

## 背景

AIDD Control Plane MVP 029では、Decision Ledgerでadoptedになったbundleだけを次回AI Task Packet / Verification Plan / Codex promptへexportする画面を作った。次は、exportされたpacket一式をCodexへ渡す直前にレビューし、危険な材料を止める必要がある。

## 実装対象

`experiments/aidd-control-plane-mvp-030/generated-repo` に、MVP 029をベースとして `Exported Packet Preflight Reviewer` を追加する。

## UI要件

- UIコピーは日本語。
- トップ画面に「MVP 030」「Exported Packet Preflight Reviewer」「Codexへ渡す直前の確認」を表示する。
- empty / valid / failureを切り替えられる。
- empty: export済みpacketがまだない状態と、先にAdopted Bundle Exporterで採用済みbundleを選ぶ必要を表示する。
- valid: AI Task Packet / Verification Plan / Codex prompt / rollback condition / evidence path / AIDD-Spec connections / required commands が揃っている状態を表示する。
- failure: 未採用bundle混入、Firefox除外、浅い検証、ローカルパス、host名、tailnet URL、rollback不足、evidence不足、AIDD-Spec接続不足をReview Findingとして表示する。

## ロジック要件

- `src/lib/intake.ts` に型・fixture・評価関数を追加する。
- 評価関数は以下を検出する。
  - packet section不足
  - verification command不足
  - `pnpm run test:e2e --project=chromium` のような3ブラウザ除外
  - local path / host / tailnet表記
  - rollback不足
  - evidence path不足
  - AIDD-Spec接続不足
  - rejected / deferred / undecided bundle混入
- unit testを日本語名で追加する。
- Playwright E2Eを日本語名で追加する。
- `scripts/doctor-aidd.mjs` をMVP 030向けに更新する。
- `scripts/capture-mvp030.mjs` と package script `capture:mvp030` を追加する。

## 検証コマンド

- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- `pnpm run capture:mvp030`

## 非ゴール

- 実ファイルへの自動適用はしない。
- 実GitHub API連携はしない。
- 実Codex実行はしない。

## 成果物

- 実装済みNext.jsアプリ
- unit/e2e/doctor/capture
- empty / valid / failure / terminal evidence画像
