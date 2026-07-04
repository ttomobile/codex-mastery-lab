# AIDD Control Plane MVP 034 / Next Increment Planner

## 今日の問い
Run Result Review Synthesizerで得たfindings、Learning Log、prompt deltaを、次に実行する1インクリメントへ変換できると、ユーザーは「次に何をすればよいか」で止まらず、AIDD-Specに沿った小さな改善を継続できるか。

## 後工程からの逆算
- 後工程: note記事、次回AI Task Packet、Codex prompt、検証計画、commit/push報告が必要になる。
- 欠陥仮説: Review FindingやLearning Logがあっても、優先順位・完了条件・必要証跡・次回promptが束ねられなければ、毎回人が読み解く必要が残る。
- 逆算される前工程: findingsを1つのNext Increment Planへ畳み込み、採用理由、対象artifact、検証コマンド、画像証跡、rollback条件、記事化観点を表示する標準化された計画器。

## 実装スコープ
- 既存MVP033をベースに、Next Increment Plannerを追加する。
- empty / valid / failure の3状態をUIとE2Eで確認する。
- 日本語UI、日本語テスト名、日本語サンプルデータを維持する。
- AIDD-Spec v0.1、AIDD Control Plane MVP v0.1、AI Task Packet標準へ接続する。

## 完了条件
- `pnpm install --frozen-lockfile`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`
- `pnpm run test:e2e`
- `pnpm run doctor:aidd`
- empty / valid / failure / terminal evidence の画像証跡
- note向け記事とpreview更新
