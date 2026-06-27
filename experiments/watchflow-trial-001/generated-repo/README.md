# WatchFlow

WatchFlow は、Next.js App Router と TypeScript strict で作る日本語UIの動画視聴Webアプリ実験です。特定サービスのロゴ、商標、実データ、実APIは使わず、ローカルモックだけでホーム、検索、再生、チャンネル、コメント、関連動画、エラー状態を確認できます。

## 前提

- Node.js: `22.23.1` (`.node-version` / `.nvmrc`)
- npm: `10.9.8`
- package manager: npm (`package-lock.json` をコミット対象)
- 依存方針: `package.json` に exact version を記載し、CI は `npm ci` で再現します。

## 起動

```bash
npm ci
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 主な画面

- `/` ホーム
- `/search?q=TypeScript` 検索結果
- `/watch/vf-001` 動画詳細/再生画面、コメント欄、関連動画
- `/channel/ch-tech` チャンネル概要
- `/error-demo` エラー状態

## モックAPI

- `GET /api/videos`
- `GET /api/videos?id=vf-001`
- `GET /api/videos?relatedTo=vf-001`
- `GET /api/search?q=設計`
- `GET /api/comments?videoId=vf-001`
- `GET /api/auth?state=anonymous|logged_in|premium|session_expired`
- `GET /api/billing?state=free|premium|payment_failed`
- `GET /api/media/video?mode=normal|slow|not_found|failure`

動画詳細では `?media=normal|slow|not_found|failure` を付けると、正常、遅延、404、失敗状態を切り替えられます。

## テスト

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install
npm run test:e2e
```

Visual Regression の基準更新は次のコマンドです。

```bash
npm run test:e2e:update
```

## 設計メモ

- 技術選定: `docs/decisions/0001-technology-selection.md`
- テスト方針: `docs/testing.md`
- GDPR準備: `docs/privacy-gdpr-readiness.md`
- 自己レビュー: `docs/score-self-review.md`

## 公開リポジトリでの扱い

READMEや記事でローカルパスを説明する場合は、個人ユーザー名を含む絶対パスを出さず、`/path/to/project-root/` のように伏せてください。
