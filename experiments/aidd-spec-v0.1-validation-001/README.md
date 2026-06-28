# AIDD-Spec v0.1 Validation 001: IssueBrief Lite

## 目的

AIDD-Spec v0.1に沿ったAI Task PacketをAIエージェントへ渡すと、期待した成果物構造・状態設計・検証証跡が出るかを確認する。

## なぜLiteか

フルNext.js + 3ブラウザCIの検証は重い。ライブ配信で誰でも追える最小検証として、まずは依存なしの静的WebアプリでL2準拠を確認する。

この検証は「AIDD-Specが一発100点を保証する」ことではなく、次を確認する。

1. AIがProduct Brief/State Contract/Failure Contractを読み取れる
2. AIが指定された出力ファイルを揃える
3. AIが指定された検証コマンドを用意する
4. 人間がReview RecordとLearning Logを書ける

## 合格条件

- `generated-repo/index.html`, `styles.css`, `app.js` が存在する
- `docs/product-brief.md`, `docs/review-record.md`, `docs/learning-log.md` が存在する
- empty/loading/success/error/offline/timeoutの状態をUIから確認できる
- キーボード操作できる
- `npm run lint:static` または同等の検査が通る
- `npm run test:contract` または同等の検査が通る
- Verification Evidenceが保存される
