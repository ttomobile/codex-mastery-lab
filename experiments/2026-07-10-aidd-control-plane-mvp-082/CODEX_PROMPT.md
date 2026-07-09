MVP082として、AIDD Control Planeの「Smoke Receipt Repair Action Planner」を実装してください。

前提:
- このリポジトリはNext.js + TypeScript + pnpmです。
- UI、テスト名、READMEは日本語を基本にしてください。
- AIDD-Spec v0.1と standards/aidd-control-plane-mvp-v0.1.md の Smoke Receipt Repair Action Planner に接続してください。

実装要件:
1. 既存MVP081由来の文言・ドメインをMVP082へ置換する。
2. `?state=empty|planned|failure|blocked` で4状態を切り替える。
3. Preview Smoke Receiptの broken URL / finding category / severity / lane / priority reason を表示する。
4. execute_now action、next_increment、learning_logを分離し、Codex prompt previewにはexecute_nowだけを入れる。
5. AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connectionを表示する。
6. blockedでは private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、AIDD-Spec接続不足、execute_now以外混入を止める。
7. Unit test、Playwright 3ブラウザE2E、doctor:aidd、capture scriptをMVP082用に更新する。
8. capture scriptは empty / planned / failure / blocked / terminal evidence のPNGを `assets/` と `artifacts/screenshots/` に保存する。

検証コマンド:
- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd

注意:
- 実private URL、実ローカルパス、実host名は入れない。危険例は `[local path]` や `[private URL]` のようにサニタイズして表現する。
- YouTube等の実サービス名・ロゴ・実APIは使わない。
- Runtime生成物はコミット対象にしない。
