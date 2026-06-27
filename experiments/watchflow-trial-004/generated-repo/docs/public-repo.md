# 公開リポジトリ運用メモ

WatchFlowは学習用の動画視聴Webアプリ実験です。公開リポジトリとして扱う場合も、実サービスのロゴ、商標、実データ、実API、個人情報は含めません。

## 公開時の方針

- README/docs/logには個人ユーザー名を含む絶対パスを書かない。
- セットアップ手順は `pnpm install --frozen-lockfile` を基準にする。
- 動画、poster、字幕、認証、課金、検索はローカルmockだけで完結させる。
- control endpointはE2E用のmock専用APIとして説明し、本番APIの例として扱わない。
- Playwright report、test-results、coverageはCI artifactから確認できるようにする。

## ライセンス

`LICENSE` はMITです。サンプル実装、モックデータ、生成posterはこのリポジトリ内の検証用途として扱います。
