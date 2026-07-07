# Product Brief: AIDD Control Plane MVP061

## 体験

Evidence Repair Delta Generatorは、Verification Run Detailのfailed / timeout / evidence_missingを読み、次回の修復に必要なAI Task Packet delta、Codex prompt delta、verification command、rollback condition、Learning Log noteを1画面で確認する。

## ゴール

- empty / valid / failure / repair_neededの4状態をfixtureで切り替える。
- validでは入力が十分なVerification Run Detailから修理deltaを生成する。
- failureではsource detail不足、失敗分類不足、修正指示不足、Firefox除外、terminal/failure screenshot不足、local path / host / private network URL混入をReview Finding形式へ変換する。
- repair_neededではexecute_now / next_increment / learning_logに分け、次の1回に入れるdeltaを1件に絞る。
- AIDD-Spec v0.1、AIDD Control Plane MVP v0.1、Verification Evidence、Review Record、Learning Log、AI Task Packetへの接続を画面に出す。

## 非ゴール

- 実際の外部API、Codex起動、GitHub Actions接続は行わない。
- 実サービスの商標、ロゴ、コピーは使わない。

## 主要フロー

1. キューなしを開き、source queue itemがないことを確認する。
2. delta生成へ切り替え、Verification Run Detailと修理deltaの5項目を確認する。
3. 差し戻しへ切り替え、Review Finding形式の不足項目と公開不可情報のブロックを確認する。
4. 次の1回へ切り替え、execute_now / next_increment / learning_logの分類と絞り込みを確認する。
5. unit test、Chromium / Firefox / WebKitのPlaywright E2E、doctor:aidd、capture:mvp061で確認する。
