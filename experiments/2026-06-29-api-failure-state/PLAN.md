# 2026-06-29 API Failure State Contract 実験計画

## 今日の問い
Codexに「APIから読書ログを読み込む小さな画面」を雑に頼むと、後工程が必要とする失敗状態（offline / timeout / server error）、再試行、エラー文言契約、検証証拠は残るのか。

## 対象成果物
- Experience Layer: State Design
- System Layer: API Contract
- Implementation Layer: AI Task Packet
- Evidence / Operations Layer: Verification Evidence / Learning Log

## 題材アプリ
日本語UIの「読書ログ同期ビューア」。APIから読書ログ一覧を読み込んで表示し、検索できる小さな静的Webアプリ。

## 実験手順
1. Codexへ雑プロンプトを渡し、vibe-app を作る。
2. ブラウザ操作GIFとコンソールログを保存する。
3. 静的監査で API失敗状態 / timeout / retry / evidence を確認する。
4. 欠陥から理想状態、修正指示、必要な前工程情報を逆算する。
5. AI Task Packet v0.6 を作り、fixed-app をCodexに作らせる。
6. fixed-appを同じ監査で再確認する。
7. 標準・記事・プレビュー・backlog・book outlineへ反映する。

## 監査カテゴリ
- Requirement Fit / State Design
- API Contract / Operations
- Build / Console / Verification Evidence

## 成功条件
- vibe-appの欠陥を標準フォーマットで記録できる。
- fixed-appで `audit_api_failure_state.py` が全PASSする。
- バイブ版と改善版のGIF、コンソールログ、Codexログ、監査ログが残る。
