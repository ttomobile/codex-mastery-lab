# WatchFlow

WatchFlow は、Next.js App Router と TypeScript strict で作る日本語UIの動画視聴Webアプリ実験です。特定サービスのロゴ、商標、実データ、実APIは使わず、ローカルモックだけでホーム、検索、再生、チャンネル、コメント、関連動画、エラー状態を確認できます。

## 前提

- Node.js: `22.23.1` (`.node-version` / `.nvmrc`)
- pnpm: `10.24.0` (`packageManager` で固定)
- package manager: pnpm (`pnpm-lock.yaml` をコミット対象)
- 依存方針: `package.json` に exact version を記載し、CI は `pnpm install --frozen-lockfile` で再現します。

## 起動

```bash
corepack enable
pnpm install
pnpm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 主な画面

- `/` ホーム
- `/search?q=TypeScript` 検索結果
- `/watch/vf-001` 動画詳細/再生画面、コメント欄、関連動画
- `/channel/ch-tech` チャンネル概要
- `/error-demo` エラー状態
- `/states?auth=session_expired&billing=payment_failed` 認証/課金/ネットワーク状態
- `/design-system` コンポーネントカタログ

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
pnpm run lint
pnpm run typecheck
pnpm run test:coverage
pnpm run build
pnpm exec playwright install
pnpm run doctor:playwright
pnpm run test:e2e
```

Visual Regression の基準更新は次のコマンドです。

```bash
pnpm run test:e2e:update
```

## Mock service placeholder

`docker-compose.yml` で `mock-api`、`mock-media`、`mock-auth`、`mock-billing` の独立サービス境界を固定しています。Trial 002 では Route Handler 実装を維持し、各 `mocks/*/README.md` に契約と placeholder の理由を書いています。

## 設計メモ

- 技術選定: `docs/decisions/0001-technology-selection.md`
- デザインシステム: `docs/design-system.md`
- テスト方針: `docs/testing.md`
- GDPR準備: `docs/privacy-gdpr-readiness.md`
- 自己レビュー: `docs/score-self-review.md`

## 公開リポジトリでの扱い

READMEや記事でローカルパスを説明する場合は、個人ユーザー名を含む絶対パスを出さず、`/path/to/project-root/` のように伏せてください。
