# Product Brief: One-Run Execution Readiness Gate

## 体験
Smoke Finding Action Queueで選んだexecute_now itemを、Codex Run Queueへ入れる直前に確認する。ユーザーはCodex command、sandbox mode、検証コマンド、Chromium / Firefox / WebKit、必要証跡、rollback stop condition、AIDD-Spec v0.1接続を1画面で見る。

## ゴール
- execute_nowだけを実行候補にする
- next_increment / learning_log混入、危険command、Firefox除外、証跡不足をblockedにする
- 公開用promptからlocal pathやprivate network URLを除く

## 非ゴール
- 実際のCodex Run Queue実行管理は次MVPに送る
- 外部GitHub API連携は行わない
