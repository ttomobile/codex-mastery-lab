# AIDD Control Plane MVP 007: Review & Learning Log Generator

MVP 006 は AI Task Packet と検証ログを結び、品質ゲートの未実行・成功・失敗・証跡不足を見える化した。MVP 007 では、その結果を Review Record と Learning Log に変換し、次回の AI Task Packet 改善案まで出す。

## 目的

- Verification Run Tracker の失敗・証跡不足を、採点可能な Review Record に変換する。
- Review Record から、次回の AI Task Packet に追加すべき指示差分を生成する。
- AIDD-Spec v0.1 の Review Record / Learning Log / Spec Improvement と接続する。
- `standards/aidd-control-plane-mvp-v0.1.md` の Review Dashboard と Learning Log を、初心者にも使えるSaaS画面にする。

## 受け入れ条件

- 日本語UIで Review & Learning Log セクションを表示する。
- 初期状態では、未実行ゲート・証跡不足・failure state を Review Finding として表示する。
- 成功サンプルでは、合格スコア、残リスク、次回改善案を表示する。
- 失敗サンプルでは、失点理由、修正指示、必要な上流情報、AI Task Packet delta、Verification Evidence 要件を表示する。
- Product Brief / AI Task Packet / Verification Plan / Codex Prompt に Review Record と Learning Log の利用前提が出力される。
- unit test / Playwright E2E / doctor:aidd を更新し、lint/typecheck/test/build/e2e/doctor:aidd が通る。
