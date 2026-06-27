# WatchFlow Next.js技術契約 v0.1

> WatchFlow 100点チャレンジで、Next.js採用そのものと、その使い方を採点するための暫定基準。

## 前提

WatchFlowでは、組織標準としてNext.jsを採用する。ただし「Next.jsを使った」だけでは合格にしない。バージョン、依存管理、アーキテクチャ、テスト容易性、公開リポジトリ運用までを採点対象にする。

## Organization Constraints

```yaml
framework: Next.js
language: TypeScript
locale: ja-JP first, i18n-ready
package_manager: pnpm
runtime: Node.js LTS
public_repository: true
real_external_services: false
local_mock_services: true
```

## Dependency Governance

- `packageManager` を `package.json` に明記する。
- lockfileを必ずコミットする。
- Node.jsバージョンを `.nvmrc` または `.node-version` で明示する。
- Next.js、React、TypeScript、Playwright、Vitestなどの中核パッケージは、採用理由と互換性を記録する。
- `latest` への依存や、理由のない巨大UIキットを避ける。
- `dependencies` と `devDependencies` を分ける。
- 依存追加時はADRまたは `docs/decisions/` に理由を書く。
- 公開リポジトリではDependabotを有効化し、更新頻度、対象パッケージ、CI実行方針を明示する。

## Next.js Architecture Fitness

採点対象:

- App Routerを使う。
- `page.tsx` はルーティングと合成に寄せ、複雑なUI/ロジックを詰め込まない。
- 動画プレイヤーはClient Componentとして隔離する。
- API client、mock adapter、formatting、権限判定、UI primitiveを分離する。
- `loading.tsx`、`error.tsx`、`not-found.tsx` を必要なルートに置く。
- metadataを基本設定する。
- test selectorをCSS classに依存させない。
- fetchや状態管理を複数コンポーネントへ散らばらせない。

## Mock Service Contract

ローカルで以下を再現できること。

```text
mock-api      動画、検索、コメント、チャンネル、履歴
mock-media    mp4、poster、字幕、遅延、404、500、途中切断、range request
mock-auth     anonymous / logged_in / premium / session_expired
mock-billing  free / premium / payment_failed / canceled
```

初期TrialではMSWやNext.js Route Handlerで代替してよい。ただし、100点に近づく過程でdocker-composeから制御可能なモックサービスへ発展させる。

## Internationalization / GDPR Readiness

初回から完全実装を求めないが、次をチェック対象にする。

- UI文言を日本語ベースで実装し、将来の辞書化が可能な構造にする。
- 日付、数値、再生回数、通貨、タイムゾーンの扱いを局所化する。
- Cookie/storage利用の有無を明示する。
- PII、閲覧履歴、コメント、課金状態などのデータ分類を記録する。
- GDPR観点として、同意、削除要求、データエクスポート、保持期間、地域差分を設計メモに残す。

## 公開リポジトリ運用

- GitHub Actionsでlint/typecheck/unit/e2e/visualを動かす。
- Playwright HTML reportやスクリーンショットをartifactとして保存する。
- Dependabotを設定する。
- READMEにローカル起動、テスト、docker-compose、既知の制約を書く。
- ライセンス、商標注意、YouTube非公式であることを明記する。
