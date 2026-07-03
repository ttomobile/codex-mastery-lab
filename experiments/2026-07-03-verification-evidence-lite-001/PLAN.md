# 2026-07-03 Verification Evidence Lite 実験計画

## 今日のテーマ
雑な日本語UIミニアプリでは、完了証拠が「動いた気がする」に寄りやすい。今回は **Verification Evidence Lite** を監査カテゴリとして選び、後工程のレビュー/テスト/記事化が必要とする証拠から、前工程でCodexへ渡すべき項目を逆算する。

## 題材アプリ
小さな「日次チェックリスト」Webアプリ。ユーザーはタスクを追加し、完了状態を切り替え、未完了のみ表示できる。

## バイブ版プロンプトの狙い
あえて「いい感じに」と依頼し、受け入れ条件・証拠・失敗状態・テスト名の指定を薄くする。

## 監査カテゴリ
1. Verification Evidence: 実行コマンド、証拠ファイル、受け入れ条件対応が残るか
2. Requirement Fit: 主要操作が本当に満たされるか
3. Accessibility: ラベル、フォーカス、状態説明があるか

## 成功条件
- Codex CLIをptyで起動したログを残す
- バイブ版と改善版のブラウザ操作GIFまたはスクリーンショットをassets/に残す
- 監査findingを標準フォーマットで残す
- standards/templates/verification-evidence-template-v0.1.md を更新する
- articles/ に日本語noteドラフトを追加する
- previewを再生成する
- git commitする
