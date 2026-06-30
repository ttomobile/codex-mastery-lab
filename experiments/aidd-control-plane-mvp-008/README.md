# AIDD Control Plane MVP 008: Artifact Evidence Binder

MVP 007 は Verification Run の失敗・証跡不足を Review Record / Learning Log / AI Task Packet Delta へ戻した。MVP 008 では、実ファイルとして残した terminal evidence / screenshot evidence / CI artifact URL を、SaaS画面で存在確認し、Verification Evidence と Review Record に結びつける。

## 目的

- terminal evidence と screenshot evidence を「名前だけ」ではなく、存在確認対象として扱う。
- CI run URL / artifact URL / Playwright report URL を Verification Evidence に紐づける。
- 証跡が足りない場合は failure state として表示し、次回AI Task Packet Deltaへ戻す。
- AIDD-Spec v0.1 の Verification Evidence / Review Record / Learning Log と `standards/aidd-control-plane-mvp-v0.1.md` の Evidence Collector をつなぐ。

## 受け入れ条件

- 日本語UIで「Artifact Evidence Binder」セクションを表示する。
- empty/initial では、必須証跡が未登録として表示される。
- filled/valid では、terminal log、screenshot、CI artifact URL、Playwright report URL が揃い、合格状態になる。
- failure state では、壊れたURL・不足ファイル・古い証跡を指摘し、修正指示、必要な上流情報、再検証コマンドを表示する。
- Product Brief / AI Task Packet / Verification Plan / Review Record / Learning Log / Codex Prompt に証跡Binderの前提を出力する。
- unit test / Playwright E2E / doctor:aidd を更新し、lint/typecheck/test/build/e2e/doctor:aidd が通る。
