# Learning Log

## what worked

- AIDD-Specの必須状態をUIの状態切替に落とし込むと、E2Eで契約を確認しやすい。
- Packet生成、Runbook生成、Review、Learning Logを同じ画面に置くと、MVPの流れを短く説明できる。

## what failed

- 永続化を入れるとno DB/no localStorage制約に反するため、今回は画面状態だけに限定した。

## spec updates needed

- L3のUI-only state_controlを表すテンプレート項目を追加すると、mock backendなしの短時間MVPを説明しやすい。
- doctorスクリプトで検査する禁止APIの範囲を標準化したい。
