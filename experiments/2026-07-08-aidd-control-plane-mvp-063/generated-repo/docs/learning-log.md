# Learning Log: AIDD Control Plane MVP063

## 分かったこと

- Run Queueではwaitingとrunningを成功扱いにしない表示が必要。
- succeededは検証コマンドの通過だけでなく、terminal evidenceとscreenshot evidenceが必要。
- failedは失敗ログだけでなく、成功した検証コマンドがないことをReview Findingへ出す。
- evidence_missingは後追い補完ではなく、capture:mvp063とdoctor:aiddを受け入れ条件へ戻す。

## 次回改善

Run Queue fixtureを実mock backendへ移し、E2Eから `/__control/state` で状態を切り替えられるようにする。
