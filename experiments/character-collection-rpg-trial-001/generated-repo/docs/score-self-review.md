# Score Self Review

## 自己評価

- Product parity: ホーム、名簿、編成、遠征、戦闘、結果、幻晶、育成、状態確認を実装。
- Mock backend: compact mock serviceで`/health`、`/state`、`/__control/state`を提供。
- Failure states: `empty_roster`、`offline`、`timeout`、`party_invalid`、`payment_failed`、`battle_lose`をUIで確認可能。
- Tests: lint/typecheck/unit/coverage/build/e2eのスクリプトを用意。
- 3 browser E2E: Chromium / Firefox / WebKitをPlaywright projectsに設定。
- CI success: Trial 001ではworkflowは未追加。ローカル検証対象。
- Publishable article: 本タスク範囲では記事化までは未実施。

## 暫定点

80/100。CI成功証跡と記事公開まで到達していないため減点。
