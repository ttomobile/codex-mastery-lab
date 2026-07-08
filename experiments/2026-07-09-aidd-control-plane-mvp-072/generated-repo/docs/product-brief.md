# MVP072 Product Brief

## 体験

AIDD Control Plane MVP072は、smoke検出で見つかったbroken URLをAction Queueへ積み、修正対象、優先理由、AI Task Packet patch、Codex prompt patch、検証証跡を1件の実行単位として確認する小さなSaaS画面です。

## ゴール

- empty / queued / blocked / exported を日本語UIで切り替える。
- queuedでは、broken URL、HTTP status、byte size、content type、finding category、severity、lane、priority reason、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec接続を表示する。
- exportedでは、Codex prompt previewにexecute_nowだけを入れ、contextやdeferを混ぜない。
- blockedではprivate URL混入、Firefox未確認、terminal evidence不足、AIDD-Spec接続不足、execute_now以外のprompt混入を検出する。
- スクリーンショットを `assets/` と `artifacts/screenshots/` の両方へ保存できる。

## 非ゴール

- 実際のCodex実行キュー投入はしない。
- 外部監視SaaSやGitHub APIは呼ばない。
- 実サービス名、公式ロゴ、秘密情報は使わない。

## 主要フロー

1. reviewerがempty状態でAction Queueに対象がないことを確認する。
2. queuedへ切り替え、URL障害、優先理由、patch、検証コマンド、必要証跡を確認する。
3. blockedへ切り替え、export前に止めるべき5種類の条件を確認する。
4. exportedへ切り替え、Codex prompt previewがexecute_nowだけで構成されていることを確認する。

## 検証

`pnpm run lint`, `pnpm run typecheck`, `pnpm run test`, `pnpm run build`, `pnpm run test:e2e`, `pnpm run doctor:aidd`, `pnpm run capture:mvp072` で独立検証できるログと画像を `artifacts/` と `assets/` に残します。
