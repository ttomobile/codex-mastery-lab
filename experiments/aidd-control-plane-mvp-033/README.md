# AIDD Control Plane MVP 033 / Run Result Review Synthesizer

## 今日の問い
Codex Run Queueで実行結果が集まったあと、成功・失敗・証跡不足をReview Record / Learning Log / 次回AI Task Packet Deltaへ自動分類できると、ユーザーは「次に何を直すべきか」を迷わず判断できるか。

## 後工程からの逆算
- 後工程: note記事、Review Record、Learning Log、AIDD-Spec更新候補が、実行ログの読み解きを必要とする。
- 欠陥仮説: Run QueueにログURLやstatusがあっても、失敗原因・不足証跡・次回指示への変換が人手のままだと、SaaS価値が伝わりにくい。
- 逆算される前工程: run resultを finding / ideal state / fix instruction / needed upstream info / prompt delta / verification command へ変換する標準化されたレビュー合成器。

## 実装スコープ
- 既存MVP032をベースに、Run Result Review Synthesizerを追加する。
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
