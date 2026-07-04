# AIDD Control Plane MVP 035 / Verification Run Detail

## 今日の問い
Codex Run Queueの各itemを、command別exit code、artifact path、失敗分類、修正指示を持つVerification Evidence詳細へ展開できると、「E2Eが通った/落ちた」という粗い報告から、次のReview FindingとLearning Logへ戻しやすくなるか。

## 後工程からの逆算
- 後工程: Run Result Review、Next Increment Planner、note記事、次回AI Task Packetが必要になる。
- 欠陥仮説: queue item単位の成功/失敗だけでは、どのcommandが、どの証跡で、どの失敗分類なのかが曖昧になる。
- 逆算される前工程: Verification Run Detailでcommand別exit code、artifact path、failure category、repair instruction、3ブラウザ証跡を表示・検査する。

## 実装スコープ
- 既存MVP034をベースに、Verification Run Detailを追加する。
- empty / valid / failure の3状態をUIとE2Eで確認する。
- 日本語UI、日本語テスト名、日本語サンプルデータを維持する。
- AIDD-Spec v0.1、AIDD Control Plane MVP v0.1、Verification Evidenceテンプレートへ接続する。

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
