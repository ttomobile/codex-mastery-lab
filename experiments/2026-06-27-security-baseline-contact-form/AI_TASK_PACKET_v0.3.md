# AI Task Packet v0.3: セキュリティベースライン付き静的デモ依頼フォーム

## スコープ
- 対象パス: `experiments/2026-06-27-security-baseline-contact-form/fixed-app/`
- `fixed-app/` の外は変更しない。
- 依存パッケージをインストールしない。
- HTML、CSS、素のJavaScriptだけを使う。

## プロダクト意図
静的なクライアントサイドプレビューを持つ、日本語のB2B SaaSデモ依頼ページを作る。このページはローカルプロトタイプであり、本番のリード送信endpointではない。

## 機能要件
- 氏名、メールアドレス、会社規模、予算、相談内容の項目を含める。
- 送信操作後に最近の入力プレビューを表示する。
- プレビューは最大3件まで、メモリ上だけに保持する。
- プレビュー後にフォームをリセットする。

## セキュリティ契約
- 氏名、メールアドレス、予算、会社規模、相談内容はすべてユーザー入力として扱う。
- ユーザー入力値の描画には `textContent` などの安全なテキストAPIだけを使う。送信値に対して `innerHTML`、`outerHTML`、`insertAdjacentHTML` を使わない。
- `fetch`、`XMLHttpRequest`、`navigator.sendBeacon` を使わない。この実験はネットワーク送信しない静的デモである。
- `localStorage`、`sessionStorage`、`indexedDB` を使わない。PIIをブラウザストレージに永続化しない。
- 送信されたフォーム値をconsoleに出力しない。
- 明示的な文字数制約を追加する。
  - 氏名: 最大80文字
  - メールアドレス: 最大120文字
  - 相談内容: 最大600文字
- 会社規模と予算はselectで選択肢を制約する。

## プライバシー / データ分類契約
- PIIまたは業務上重要なフィールドに `data-classification` 属性を付ける。
  - 氏名: `pii.name`
  - メールアドレス: `pii.email`
  - 会社規模: `business.company_size`
  - 予算: `business.budget`
  - 相談内容: `pii_or_confidential.free_text`
- このフォームがネットワーク送信しないプレビューであり、データは画面更新までメモリ上にだけ残ることを、見える補足文として表示する。
- プレビュー前に必須のプライバシー同意チェックボックス `privacyConsent` を追加する。
- 必要に応じて、プライバシー/保持期間の補足文を `aria-describedby` でフォーム項目につなげる。
- 監査でno-network挙動を確認できるよう、フォームに `data-static-demo="true"` を追加する。

## アクセシビリティ契約
- すべての入力項目に見えるラベルを置く。
- CSSにfocus-visibleの証拠を残す。
- 最近の入力プレビュー領域は `aria-live="polite"` を使う。

## 検証証拠
`fixed-app/` の中に `SECURITY_PRIVACY.md` を作り、以下を含める。
- データ分類表。
- PIIの扱いと保持ルール。
- no-network / no-storage の宣言。
- 検証コマンドと実際の結果。
- 既知の限界: クライアントサイド検証は本番セキュリティ境界ではない。

## 品質ゲート
以下を実行して報告する。

```bash
node --check experiments/2026-06-27-security-baseline-contact-form/fixed-app/app.js
python3 experiments/2026-06-27-security-baseline-contact-form/audit_static_security.py experiments/2026-06-27-security-baseline-contact-form/fixed-app
```

期待結果: 両方exit 0。静的セキュリティ監査はすべて合格。
