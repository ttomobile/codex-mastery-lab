# Product Brief: AIDD Control Plane MVP075

## 対象体験

Run Result Digest Publisherは、Codex Run Queue Status Trackerの実行結果を、レビュー担当者、次回AI Task Packet、Codex prompt、note記事化へ渡せる短い共有ダイジェストに変換する。

## ユーザー課題

長いterminal logやE2E結果をそのまま共有すると、score根拠、3ブラウザcoverage、console status、Review Record excerpt、Learning Log excerpt、publish readinessが分散し、次のAI作業へ渡すdeltaが曖昧になる。

## ゴール

- `?state=empty|valid|failure|blocked`で状態を切り替える。
- validでrun outcome、score、terminal evidence、initial / filled / failure / terminal screenshot、Chromium / Firefox / WebKit coverage、console status、Review Record excerpt、Learning Log excerpt、AI Task Packet delta、Codex prompt delta、note article angle、publish readinessを1画面に表示する。
- failureでscore根拠不足、Firefox未実行、console warn、terminal evidence不足をReview Findingへ戻す。
- blockedでlocal path / private host / private network URL混入を公開前に止める。

## 非ゴール

- 実キューAPI連携
- 永続DB
- 実記事投稿
- 実在サービスの商標、公式ロゴ、実在コピーの利用

## 主要フロー

1. source runを選択する。
2. 実行結果を共有ダイジェストへ変換する。
3. Review Record excerptとLearning Log excerptを確認する。
4. AI Task Packet deltaとCodex prompt deltaを次回入力へ渡す。
5. 公開前にlocal path / private host / private network URL混入を検査する。
