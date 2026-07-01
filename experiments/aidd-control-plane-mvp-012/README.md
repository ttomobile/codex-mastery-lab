# AIDD Control Plane MVP 012: Mock CI Evidence Connector

MVP 011では、Evidence Gap Repair Plannerで不足証跡を次回AI Task Packet差分へ戻した。MVP 012では、手入力サンプルから一歩進め、GitHub Actions風のCI証跡状態をローカルmock backendで取得し、UIが取得成功・欠損・タイムアウトを判断できる入口を作る。

## 目的

AIDD Control Planeを「ユーザーがCI run URLを貼るだけで、必要な証跡の有無と次の修正依頼が分かるSaaS」に近づける。今回は実GitHub API接続ではなく、再現可能なmock CI connectorとして、成功・欠損・タイムアウトを決定的に切り替える。

## 対象

- 実装先: `experiments/aidd-control-plane-mvp-012/generated-repo`
- 接続先: `standards/aidd-spec-v0.1.md`, `standards/aidd-control-plane-mvp-v0.1.md`
- UI/テスト/docs: 日本語

## MVP範囲

- Mock CI Evidence Connectorを初期画面で見える場所へ追加
- `src/lib/mock-ci.ts` にCI run URL解析、mock状態、取得結果、証跡不足判定を実装
- UIで empty / valid / failure / timeout state を切り替えられる
- validでは coverage / playwright-report / test-results / terminal evidence / empty-valid-failure screenshots が揃う
- failureでは不足artifact、失敗job、短いcommit SHA、アクセス権不足を修正指示へ変換する
- timeoutでは「再試行」「fallbackとして手動Evidence Binderへ戻す」指示を出す
- Unit testと3ブラウザE2Eで上記状態を確認する
- `doctor:aidd` がMVP 012のdocs/scripts/e2eを検査する

## 非ゴール

- 実GitHub API接続
- OAuth/token保管
- artifact zipのダウンロードと展開
- 永続DB
- GitHub Actions workflow自体の追加
