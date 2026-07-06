# AIDD Control Plane MVP 053 Plan

## テーマ
MVP052のCodex Run Budget Gateで `BRAKE` または `STOP` になった時、実行を諦めるだけでなく、次に実行できる小さなAI Task Packetへ自動縮小する提案を作る。

## 後工程からの逆算
- 後工程: Codex実行、Verification Evidence、Review Record、Learning Log、note公開前QA
- 欠陥: 利用枠過多や停止条件不足の時に「何を減らすか」が人間判断になり、次回Codex promptがまた肥大化する
- 理想状態: stop/brake時に、削る対象、残す検証、延期する検証、fallback action、証跡パスが自動で見える
- AIDD-Spec反映: AI Task Packetに縮小候補、defer理由、minimum verification、resume conditionを追加する

## 実験手順
1. MVP052をベースにMVP053を作る。
2. 雑プロンプトでCodexに `stop時の縮小提案` を追加させる。
3. UI、unit、E2E、doctor、captureを確認する。
4. 記事、標準、preview、backlog、book outlineを更新する。
