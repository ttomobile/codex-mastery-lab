# Review Record: AIDD Control Plane MVP 049

## レビュー対象

Verification Run Detail Drilldown。

## 観点

- source queue item、source run status、commit SHAが揃っているか。
- `lint`、`typecheck`、`test`、`build`、`test:e2e`、`doctor:aidd`のcommand別detailが揃っているか。
- 各detailにexit code、duration、terminal log path、artifact path、失敗分類、修正指示があるか。
- Chromium / Firefox / WebKit coverageが揃っているか。
- terminal / empty / ready / failure screenshot evidenceが揃っているか。
- local path / host / private network URLを検出できるか。
- AIDD-Spec v0.1、Verification Evidence、Review Record、Learning Logへ接続できるか。

## failure finding例

- commit SHA不足。
- command別detail不足。
- exit code不足。
- artifact path不足。
- 失敗分類不足。
- 修正指示不足。
- Firefox除外。
- terminal evidence不足。
- failure screenshot不足。
- local path / host / private network URL混入。
- AIDD-Spec connection不足。
