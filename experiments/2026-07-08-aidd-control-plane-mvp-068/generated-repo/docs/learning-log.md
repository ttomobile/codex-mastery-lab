# Learning Log

MVP068では、失敗を見つけた後すぐにCodexへ投げるのではなく、1回分の実行条件を確認する入口を作った。

## 学び
- execute_now以外の混入は、実装範囲を膨らませるためblockedにする
- Firefox除外やterminal/failure screenshot不足は、読者に見せる一次情報を弱くする
- rollback stop conditionがない修正は、Run Queueへ進めない
- AIDD-Spec v0.1との接続がない実行は、後でReview Recordへ戻しにくい

## 次回候補
readyになった候補をCodex Run Queue Status Trackerへ渡し、waiting / running / succeeded / failed / evidence_missingとして追跡する。
