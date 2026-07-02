以下を実装してください。

対象: `experiments/aidd-control-plane-mvp-019/generated-repo`

前提:
- MVP 018のNext.js + TypeScript実装を引き継ぐ。
- 日本語UI、日本語テスト名、日本語記事向け証跡を前提にする。
- AIDD-Spec v0.1と`standards/aidd-control-plane-mvp-v0.1.md`へ接続する。
- 建築/建物メタファーは使わない。

実装内容:
1. 新しいUIセクション `Delta Decision Review` を追加する。
2. `empty` / `valid` / `failure` の状態切替を追加する。
3. valid状態では以下を表示する。
   - 採用 / 却下 / 保留の件数
   - delta id / source proposal / decision status
   - decision owner / decision reason / decided at
   - next action / review evidence / rollback confirmed
   - included in next packet
   - 採用済みdeltaだけが次回AI Task Packet / Codex promptに入ること
4. failure状態では以下の不足をReview Findingとして表示する。
   - 判断者不足
   - 判断理由不足
   - rollback確認不足
   - 採用なのにverification command不足
   - 却下なのに再発防止メモ不足
5. 純粋関数でdecision summaryとfailure findingを生成する。
6. `doctor:aidd`でMVP 019固有のUI文言、純粋関数、E2E、capture script、AIDD-Spec接続文言を検査する。
7. Unitテストを追加する。テスト名は日本語。
8. Playwright E2Eを追加し、Chromium / Firefox / WebKitでempty、valid、failureを確認する。
9. `scripts/capture-mvp019.mjs` と `package.json` の `capture:mvp019` を追加し、empty/valid/failure/terminal evidence画像を保存できるようにする。
10. `package.json`のnameを`aidd-control-plane-mvp-019`へ更新する。

完了条件:
- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
が通る状態にしてください。
