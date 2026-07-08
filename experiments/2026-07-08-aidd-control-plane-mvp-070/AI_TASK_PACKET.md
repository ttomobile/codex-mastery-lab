# AI Task Packet: AIDD Control Plane MVP 070 Shrunk Packet Handoff Receipt

## Product Brief

AIDD Control Planeは、AIに大きすぎる依頼を渡す前に、今回実行する最小単位、次回送り、検証、証跡、rollbackを揃えるSaaSである。MVP070では、MVP069で縮小されたAI Task PacketをCodex実行直前のハンドオフレシートとして確認する。

## Non-goals

- 実際のGitHub API / Codex API連携はしない。
- 認証、DB永続化、課金は作らない。
- 公式サービス名・ロゴ・実IP・ローカルパスをUIに出さない。

## Acceptance Criteria

1. empty / valid / blocked の3状態を日本語UIで切り替えられる。
2. valid状態では、source shrink plan、execute_now、defer_next_increment、minimum verification、3ブラウザ、required evidence、rollback condition、AIDD-Spec接続、Codex prompt previewが見える。
3. blocked状態では、Firefox除外、failure screenshot不足、rollback不足、private URL混入をブロック理由として表示する。
4. Codex prompt previewにはexecute_nowだけを含め、defer_next_incrementを混ぜない。
5. domain関数をunit testし、日本語テスト名を使う。
6. Playwright E2EはChromium / Firefox / WebKitでempty / valid / blockedを確認する。
7. `doctor:aidd`が日本語UI、3ブラウザ設定、必須証跡、AIDD-Spec接続、危険文字列なしを検査する。
8. capture scriptがinitial / filled / failure / terminal evidence画像を保存する。

## Verification Plan

- pnpm install --frozen-lockfile
- pnpm run lint
- pnpm run typecheck
- pnpm run test
- pnpm run build
- pnpm run test:e2e
- pnpm run doctor:aidd
- pnpm run capture:mvp070

## AIDD-Spec connection

- standards/aidd-spec-v0.1.md: AI Task Packet, Verification Evidence, Review Record, Learning Log
- standards/aidd-control-plane-mvp-v0.1.md: Shrunk Packet Handoff Receipt
