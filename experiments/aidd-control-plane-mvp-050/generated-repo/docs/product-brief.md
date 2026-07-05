# Product Brief: AIDD Control Plane MVP 050

## 体験

Evidence Repair Delta Generatorは、Verification Run Detailで見つかった`failed` / `evidence_missing` / `timeout`のfindingを読み、次回AI Task Packet delta、Codex prompt delta、検証command、rollback条件、Learning Log案へ変換するSaaS画面です。

## ゴール

- empty / ready / failureの3状態を表示する。
- emptyではfinding未読込で次回packetへ戻す材料がないことを説明する。
- readyでは3件以上のdelta候補を表示し、finding ID、失敗分類、優先度、理想状態、修正指示、AI Task Packet delta、Codex prompt delta、verification command、rollback condition、Learning Log案、AIDD-Spec接続を確認できるようにする。
- failureではReview Finding draft風に不足を一覧化し、local path / host / private network URL混入を公開前ブロック理由として表示する。

## 非ゴール

- 実際のCodex実行。
- ログファイルのアップロードやDB永続化。
- 外部CI、GitHub API、課金機能との接続。

## 主要ユーザーフロー

1. emptyでfinding未読込の状態を見る。
2. readyでfailed / evidence_missing / timeoutから生成されたrepair delta候補を確認する。
3. failureで不足項目と公開前ブロック理由を読み、Review Finding draftを補正する。
