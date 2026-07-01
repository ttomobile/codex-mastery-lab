# AIDD Control Plane MVP 013: Independent Mock CI Service

MVP 012では、Mock CI Evidence Connectorを画面内のローカル状態として作った。MVP 013では、その判断をUIから独立したmock serviceへ切り出し、AIDD Control Planeが外部CI連携に進む前の境界を検証する。

## 目的

AIDD Control Planeを「CI run URLを貼るだけで証跡状態を判定するSaaS」に近づけるため、UI内部の固定サンプルではなく、`/health`、`/state`、`/__control/state` を持つ独立mock serviceからCI証跡状態を取得する。

## 対象

- 実装先: `experiments/aidd-control-plane-mvp-013/generated-repo`
- 接続先: `standards/aidd-spec-v0.1.md`, `standards/aidd-control-plane-mvp-v0.1.md`
- UI/テスト/docs: 日本語

## MVP範囲

- `mocks/ci-service` にNode fallback mock serviceを実装する
- mock serviceは `/health`, `/state`, `/__control/state` を持つ
- `pnpm run mock:start`, `pnpm run mock:stop`, `pnpm run mock:doctor` を追加する
- UIはmock service由来の empty / valid / failure / timeout / rate_limit を表示する
- E2Eから `/__control/state` を叩いて状態を変え、画面反映を確認する
- timeoutとrate limitでは再試行、手動Evidence Binder fallback、次回AI Task Packet Deltaを表示する
- Unit testと3ブラウザE2Eで状態契約を確認する
- `doctor:aidd` がMVP 013のdocs/scripts/mock/e2eを検査する
- Playwright等で empty/initial、filled/valid、failure、terminal evidence画像を保存する

## 非ゴール

- 実GitHub API接続
- OAuth/token保管
- artifact zipのダウンロードと展開
- 永続DB
- 実GitHub Actions workflow変更
