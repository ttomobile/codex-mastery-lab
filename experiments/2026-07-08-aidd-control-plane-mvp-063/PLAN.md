# PLAN: AIDD Control Plane MVP 063

## テーマ
Codex Run Queue Status Tracker: queued/running/succeeded/failed/evidence_missing をUIで追跡し、Verification Evidence / Review Record / Learning Logへ戻す。

## 後工程から逆算する問い
Codex実行後、品質ゲートの一部だけ成功した状態や証跡不足を、次回AI Task Packetへ混ぜずにReview Findingへ戻すには、実行キューにどんな状態・証跡・検証コマンドが必要か。

## 監査カテゴリ
- Requirement Fit: statusごとの受け入れ条件がUIに出るか。
- Verification Evidence: terminal / browser / 3 browser / doctor:aidd が不足すると止まるか。
- Operations / Maintenance: rollback plan と learning log output が実行結果に紐づくか。

## 制約
- 既存依存を使い、重い新規installは避ける。
- UI文言、テスト名、記事は日本語。
- empty / waiting / running / succeeded / failed / evidence_missing を操作できる。
