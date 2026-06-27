# AI Task Packet v0.4: 問い合わせAPIのセキュリティ / 運用契約

## スコープ
- 対象パス: `experiments/2026-06-27-contact-api-threat-model/fixed-api/`
- 禁止パス: `fixed-api/` の外すべて
- 依存方針: `npm install` はしない。Node.js標準モジュールだけを使う。

## プロダクト意図
単に動くendpointではなく、セキュリティ担当者と運用担当者がレビューできる、小さなデモ用問い合わせHTTP APIを作る。

## 機能要件
- `GET /health` はJSONのヘルスステータスを返す。
- `POST /api/contact` はJSONの `name`, `email`, `company`, `message` を受け取る。
- 必須項目と文字数上限を検証する。
- 成功/エラーのJSONレスポンス形式を一貫させる。

## 非目標
- 問い合わせ内容をディスク、DB、ブラウザストレージ、外部サービスへ永続化しない。
- メール送信しない。
- 認証やセッションを追加しない。
- 依存パッケージをインストールしない。

## セキュリティ契約
- `name`, `email`, `company`, `message` はすべてユーザー入力として扱う。特に `name`, `email`, `message` はPIIまたは機密情報になり得る。
- POSTでは `Content-Type: application/json` を必須にする。
- 小さく明示的なリクエストbodyサイズ上限を設定する。
- ブラウザOrigin保護を追加する。許可されていない `Origin` は拒否する。`ALLOWED_ORIGINS` 環境変数で許可Originを管理し、ローカルデモ時の既定値も文書化する。
- 簡易CSRFデモ制御を追加する。ブラウザ由来のPOSTでは `X-CSRF-Token` が `CSRF_TOKEN` 環境変数と一致することを要求する。この実験ではローカルデモ用トークンを既定値にしてよいが、本番認証ではないことを文書化する。
- `POST /api/contact` に小さなインメモリIP別rate limitを追加し、超過時は `429` を返す。
- 生のリクエストbodyやPII項目をログ出力しない。

## 運用契約
- すべてのレスポンスに `X-Request-Id` でrequest idを生成または伝播する。
- 監査ログは非PIIメタデータだけにする。含めるのは request id、method、path、status code、rate-limit/validation/security の判断結果。
- 保持方針を明示する。問い合わせ内容は永続化せず、現在のリクエスト処理中のメモリだけで扱う。
- エラーレスポンス契約を統一する: `{ ok: false, error: { code, message, requestId } }`。

## データ分類
- `name`: `pii.name`
- `email`: `pii.email`
- `company`: `business.company_name`
- `message`: `pii_or_confidential.free_text`

## 品質ゲート
以下のコマンドを実行し、結果を保存する。

```bash
node --check experiments/2026-06-27-contact-api-threat-model/fixed-api/server.js
python3 experiments/2026-06-27-contact-api-threat-model/smoke_contact_api.py experiments/2026-06-27-contact-api-threat-model/fixed-api
python3 experiments/2026-06-27-contact-api-threat-model/audit_contact_api.py experiments/2026-06-27-contact-api-threat-model/fixed-api
```

## 検証証拠
`fixed-api/` の中に `SECURITY_OPERATIONS.md` を作り、以下を含める。
- データ分類表
- CSRF / Origin方針
- rate limit方針
- 監査ログ方針
- 保持/no-persistence方針
- エラーレスポンス契約
- 検証コマンドと期待結果

## プロンプト差分ログ
前回の失敗: バイブ版APIは動いたが、CSRF/Origin方針、rate limit、request id、監査ログ、保持証跡、データ分類、証跡ファイルがなかった。
追加した指示: セキュリティ/運用の制御と証拠を、最初から成果物として扱う。
