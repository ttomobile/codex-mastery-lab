# Learning Log

## 学び

- 「〇〇風」の要求は、UIの見た目よりも体験パターン、状態契約、検証コマンドへ分解すると安全に扱いやすい。
- Trial 001ではmock serviceを1つに集約しても、`api/media/auth/billing`相当の状態を明示すればE2Eの制御性を保てる。
- 失敗状態は専用画面だけでなく、各機能画面に混ぜて出すとプロトタイプの検証価値が上がる。

## 次の改善

- serviceを`mocks/api`、`mocks/media`、`mocks/auth`、`mocks/billing`へ分割する。
- CI workflowとartifact保存を追加する。
- 記事化用のスクリーンショットと実行ログを保存する。
