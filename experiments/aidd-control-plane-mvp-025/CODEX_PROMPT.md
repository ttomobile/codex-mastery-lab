あなたはAIDD Control Plane MVP 025を実装するCodexです。

`experiments/aidd-control-plane-mvp-025/generated-repo/` で、Next.js + TypeScript + pnpmの既存MVPを拡張してください。

今回の主機能は `Dogfood Packet Markdown Review` です。Project Intake WizardとDogfood App Idea Packet Seedで作った新規アプリ案を、いきなり実ファイルへ書かず、AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.mdのMarkdown反映前プレビューとして確認できる画面を追加してください。

必須条件:

- UI、テスト名、docs、記事向けコピーは日本語中心にする。
- AIDD-Spec v0.1と `standards/aidd-control-plane-mvp-v0.1.md` への接続を表示する。
- `createDogfoodPacketMarkdownReview(seed)` を実装し、3ファイル分のtarget file / heading / body preview / diff summary / preflight checks / verification command / rollback conditionを返す。
- AI_TASK_PACKET.md previewにはMock Backend Contract、Failure State Contract、Acceptance Criteriaを含める。
- CODEX_PROMPT.md previewには非侵害境界、mock service、検証コマンド、初期生成品質と最終収束品質の分離を含める。
- VERIFICATION_PLAN.md previewにはpnpm gate、mock doctor、3ブラウザE2E、CI artifact、記事/preview証跡を含める。
- copy bundleを画面上で表示する。
- `pnpm run doctor:aidd` がMVP025の必須copy、script、capture、unit/e2e tokenを検査する。
- `pnpm run capture:mvp025` でempty/valid/failure/terminal evidence画像を保存する。

完了前に次を実行し、ログを `experiments/aidd-control-plane-mvp-025/artifacts/terminal/` に保存してください。

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
