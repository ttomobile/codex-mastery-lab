# WatchFlow 100点ルーブリック v0.1

> 公開記事・公開リポジトリで使う採点基準。パス表記は `/path/to/project-root/` のように伏せ、個人ユーザー名を出さない。

## 目的

WatchFlowは、YouTube風の動画視聴Webアプリを題材に、AI駆動開発でプロフェッショナル品質に近づくための指示体系を育てる実験である。100点満点、または100回試行まで、毎回の失点をAI Task Packet / AIDD-Specに戻す。

## 100点配分

| カテゴリ | 点 | 主な確認観点 |
|---|---:|---|
| Product Parity | 10 | ホーム、検索、動画詳細、コメント、関連動画、チャンネル導線が、動画視聴サービスとして自然か |
| Video Experience | 12 | poster、再生/停止、シーク、音量、字幕、バッファリング、404、500、遅延、途中切断、リトライ |
| Network / State Handling | 10 | loading、empty、error、offline、timeout、retry、session expired、payment failedの状態設計 |
| Mock Backend Contracts | 8 | mock-api、mock-media、mock-auth、mock-billingがローカルで再現でき、テストから制御できるか |
| Technical Foundation / Dependency Governance | 10 | Next.js、TypeScript、Node、pnpm、lockfile、version pinning、ADR、不要依存の排除 |
| Next.js Architecture Fitness | 10 | App Router、Server/Client Component境界、Route Handler、loading/error/not-found、metadata、API client境界 |
| Component Architecture | 8 | ページ、feature、shared UI、design-system、service層の責務分離とテストしやすさ |
| Design System | 8 | tokens、components、variants、responsive、focus、reduced motion、dark mode方針 |
| Accessibility | 8 | keyboard、aria、focus order、contrast、screen reader semantics、caption/subtitle、reduced motion |
| E2E / Visual / Unit | 13 | Chromium/Firefox/WebKit、主要フロー、pixel基準画像、HTML report画像、coverage、境界値テスト |
| Public Repo Operations | 6 | GitHub Actions、Dependabot、公開README、再現手順、ライセンス、CI badge、artifact保存 |

## 採点の原則

- YouTubeのロゴや商標をコピーしない。比較対象は「動画視聴サービスとして読者が知っている体験」であり、成果物はWatchFlow独自デザインにする。
- pixel-perfectは本物のYouTubeではなく、承認済みのWatchFlow参照デザイン画像に対して測る。
- 画像・GIF・HTMLレポート・ターミナル結果を記事に載せ、読者が差分を視覚的に理解できるようにする。
- 公開リポジトリで誰でも再現できることを重視する。CI/CD、Dependabot、lockfile、バージョンpinning、セットアップ手順も品質点に入れる。
- GDPRや国際対応は、初回から「観点」として含める。最初から完全実装は求めないが、データ分類、consent/notice、locale/timezone/currency、cookie/storage方針、削除要求の設計余地を評価する。

## Trialごとに保存するもの

```text
artifacts/trial-XXX/
  prompt.md
  ai-task-packet.md
  score.md
  lost-points.md
  screenshots/
  gifs/
  test-results/
  playwright-report-screenshot.png
  terminal-results.png
  diff-summary.md
```

## 公開向けパス表記ルール

記事・README・スクリーンショットに個人ユーザー名やローカル絶対パスを出さない。

悪い例:

```text
/Users/example-user/codex-mastery-lab/apps/web
```

良い例:

```text
/path/to/project-root/apps/web
~/watchflow-lab/apps/web
```
