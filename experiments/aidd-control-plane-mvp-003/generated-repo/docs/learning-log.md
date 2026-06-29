# Learning Log: AIDD Control Plane MVP 003

## うまくいったこと

- Evidence readiness logicをReactから切り離し、Vitestで直接検証できる形にした。
- ボタンでready、missing_logs、missing_screenshotsを即座に再現できるため、E2Eの期待値が明確になった。
- Preview JSONを同じ評価関数から生成し、UI表示と保存対象のずれを減らした。

## 失敗しやすい点

- 禁止API名をUI文言やテスト内にそのまま書くと、静的checkerの対象に入る可能性がある。
- CI URLやreport linkは必須証跡ではなくwarningなので、readiness scoreに含めると受け入れ条件とずれる。
- スクリーンショットpathは文字列だけを扱うため、存在確認を入れると今回の非ゴールから外れる。

## 次回Spec改善

- Verification Evidenceのrequired / warning項目をAI Task Packet内で分けて書く。
- readiness scoreの重みづけをSpec側に明記する。
- Preview JSONのフィールド名をAIDD-Spec標準schemaへ寄せる。
