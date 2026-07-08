# Product brief

## 対象体験

Public Preview Smoke Verifierは、MVP065 Publication Evidence QA Gateの後段で、公開preview HTMLとassetsがHTTP経路で読めるかを判定するUIです。smoke run id、article path、preview URL/path、checked URLs、HTTP status、byte size、content type、latency ms、terminal evidence image response、Chromium/Firefox/WebKit、console status、sanitization scan、Review Finding、Learning Log、AI Task Packet delta、Codex prompt delta、rerun commandを同じ画面で確認します。

## 差別化したゴール

- `evaluatePublicPreviewSmoke`でempty / valid / failure / blockedを判定する。
- validでは公開preview HTMLとassetのHTTP証跡を公開preview smoke digestとして表示する。
- failureでは失敗assetのHTTP status、byte size、content type、latency msを保持し、公開preview確認OKにしない。
- blockedではHTTP経路未確認、private URL混入、Firefox未確認、terminal evidence image response不足、AIDD-Spec接続不足をReview Findingとして表示する。
- AIDD-Spec v0.1、AIDD Control Plane MVP v0.1、Verification Evidence、Release Checklistへの接続文言を画面で確認する。
- doctor:aiddで必要script、4状態fixture、E2E、capture script、AIDD-Spec接続文言、公開危険文字列のfixture混入検査を行う。

## 非ゴール

- 実サービスの商標、ロゴ、コピーは扱わない。
- 実際の記事投稿APIや外部公開処理は扱わない。
- AIDD-Spec説明で建築や建物のメタファーは使わない。

## 主要ユーザーフロー

1. レビュー担当者がempty / valid / failure / blockedを選ぶ。
2. smoke run id、article path、preview URL/path、checked URLsを確認する。
3. HTTP status、byte size、content type、latency ms、terminal evidence image responseを確認する。
4. 3ブラウザ、console status、sanitization scan、AIDD接続文言を確認する。
5. failureまたはblockedならReview Findingとrerun commandを読み、再実行条件を固定する。
6. validなら公開preview smoke digestを記事化の入力として確認する。
