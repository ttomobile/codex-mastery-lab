# WatchFlow Trial 001

YouTube風動画視聴WebアプリをNext.jsで作り、AI駆動開発の指示体系を100点に近づける最初の試行。

## 公開前提

- GitHub公開リポジトリで配布する想定。
- 記事・READMEでは個人ユーザー名を含む絶対パスを出さない。
- 参照パスは `/path/to/project-root/` または `~/watchflow-lab/` と表記する。

## 入力

- `PROMPT.md`
- `../../standards/watchflow-100-point-rubric-v0.1.md`
- `../../standards/watchflow-nextjs-technical-contract-v0.1.md`

## Trial 001の目的

CodexにNext.js前提のWatchFlowを作らせ、どこまで自律的に以下を満たせるかを見る。

- Next.js App Router設計
- 日本語UI
- 動画再生体験
- mock-api / mock-media / mock-auth / mock-billing
- E2E / Unit / Visual Regression
- GitHub Actions / Dependabot
- GDPR / 国際対応の設計メモ
- 公開リポジトリとしての再現性

## まだ実行していないこと

このディレクトリはTrial 001の準備であり、Codex実行結果そのものではない。実行後に、生成されたアプリ、ログ、スクリーンショット、GIF、テストレポートを `artifacts/trial-001/` に保存する。
