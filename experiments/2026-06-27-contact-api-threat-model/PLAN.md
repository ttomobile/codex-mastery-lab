# PLAN: Contact API threat model reverse-engineering

Date: 2026-06-27
Slug: contact-api-threat-model

## 今日の問い
雑に「問い合わせフォームAPI」をCodexへ作らせると、後工程のSecurity / Operations監査が必要とする CSRF、rate limit、audit log、retention、error contract、verification evidence は成果物に残るのか。

## 対象AIDD-Spec成果物
- Security Baseline
- Operations / Maintenance
- AI Task Packet
- Verification Evidence

## 監査カテゴリ
1. Security / Vulnerability
2. Load / Scalability
3. Operations / Maintenance

## 制約
- 専用実験ディレクトリ配下のみ変更
- 追加依存なし
- Node.js標準ライブラリのみ
- 小さく、短時間で実行できる検証に限定

## 手順
1. 環境情報とgit状態を保存する。
2. Codexへ雑プロンプトを渡し、`vibe-api/` に小さな問い合わせAPIを作らせる。
3. `node --check` と軽量HTTP smoke testを実行する。
4. 静的監査スクリプトで CSRF / rate limit / audit log / retention / error contract / evidence を確認する。
5. 欠陥から理想状態、修正指示、必要な前工程情報を逆算する。
6. AI Task Packet v0.4 を作り、`fixed-api/` をCodexに実装させる。
7. 同じ監査を再実行し、欠陥が減るか比較する。
8. 標準仕様、書籍アウトライン、backlog、noteドラフトへ反映する。

## 成功条件
- 雑プロンプト版と改善Task Packet版の差が、監査結果として保存されている。
- AIDD-Specに API Security / Operations Evidence の追加項目が反映されている。
- 記事に実プロンプト、コマンド、ログ、監査finding、図解が含まれている。
