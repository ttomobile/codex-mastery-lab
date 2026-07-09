# AIDD Control Plane MVP Design v0.1

> AIDD-Specに沿ったAIエージェント開発ワークフローを、誰でも辿れるSaaSにするためのMVP設計。

## 1. Product Vision

AIDD Control Planeは、AIにコードを書かせるだけのSaaSではない。

主価値は、AI駆動開発で必要な入力・出力・検証証跡・レビュー・学習ログを一つの流れとして扱うことにある。

```text
Product Brief
  -> AI Task Packet
  -> Agent Run
  -> Verification Evidence
  -> Review Record
  -> Learning Log
  -> Spec Improvement
```

## 2. MVPで解く問題

AIエージェント活用時の初期問題は次である。

- 依頼文が曖昧
- 非ゴールがない
- 状態設計がない
- テスト条件がない
- 完了証拠が残らない
- 失敗が次回の指示に戻らない

MVPではこの流れをフォームとチェックリストで標準化する。

## 3. MVP機能

| 機能 | 目的 | v0.1範囲 |
| --- | --- | --- |
| Product Brief Builder | 何を作るかを短く固定する | name/user_problem/non_goals |
| AI Task Packet Builder | AIへ渡す入力を作る | YAML/Markdown出力 |
| Contract Checker | 必須項目の不足を検出する | static validation |
| Agent Runbook Generator | Codex等へ渡すコマンドを生成する | prompt + command |
| Evidence Collector | 実行ログとartifactを紐づける | 手動アップロード/パス入力 |
| Review Record | 結果を採点する | pass/fail/findings |
| Learning Log | 次回改善点を残す | spec_updates_needed |
| App Type Templates | アプリ種別ごとの推奨機能・状態契約・品質ゲート・リスク・証跡要件を補助する | video-service / learning-support / booking-management / internal-request |
| Verification Run Tracker | AI Task Packetと実行ログを結びつけ、品質ゲートの未実行・成功・失敗・証跡不足を見える化する | lint / typecheck / test / build / e2e / doctor:aidd、3ブラウザE2E、terminal evidence、screenshot evidence |
| Review & Learning Log Generator | Verification Runの失敗・証跡不足をReview Findingへ分類し、次回AI Task Packet Deltaへ戻す | review score、findings、needed upstream information、spec updates needed、Codex prompt delta |
| Artifact Evidence Binder | terminal evidence、screenshot evidence、CI run URL、CI artifact URL、Playwright report URLを同じ検証単位で束ねる | empty / valid / failure、古いログ、壊れたURL、不足証跡 |
| CI Artifact Importer | CI run summaryをVerification Evidenceへ取り込み、commit SHA、workflow、job、artifact、Playwright report URLを確認する | 手入力/サンプル入力、短いcommit SHA、失敗job、不足artifactの検出 |
| GitHub Actions Artifact Fetch Plan | run URLからCI証跡取得経路を生成し、API endpoint、token scope、必要artifactをレビューする | owner / repo / run id解析、jobs API、artifacts API、logs URL、actions:read、contents:read、不足artifact取得計画の検出 |
| Fixture-driven Mock CI Service | CI証跡の外部境界をfixtureとmock service contractで再現する | empty / valid / failure / timeout / rate_limit fixture、Docker Compose経路、Node fallback経路、`/health` / `/state` / `/__control/state`、同一contract検査 |
| CI Workflow Artifact Auditor | GitHub Actions workflowが品質gateとartifact保存をVerification Evidenceとして残すか静的監査する | lint / typecheck / test / build / doctor:aidd / mock:doctor / 3ブラウザE2E、coverage / playwright-report / test-results / terminal evidence artifact、Review FindingとAI Task Packet Deltaへの変換 |
| Spec Update Proposal Queue | Review FindingとLearning Logを標準更新候補へ変換し、AIDD-Spec / Control Plane標準 / AI Task Packet / Codex prompt deltaへ戻す | empty / valid / failure、対象標準文書、target field、priority、acceptance criteria、verification command、不足候補の検出 |
| AI Task Packet Delta Apply Preview | Spec Update Proposalを採用した場合に、次回AI Task Packet / Codex prompt / Verification Planがどう変わるかを採用前にレビューする | empty / valid / failure、target packet section、before/after summary、added acceptance criteria、verification commands、Codex prompt patch、rollback condition、不足差分の検出 |
| Delta Decision Review | AI Task Packet Deltaを採用 / 却下 / 保留に分け、誰が・いつ・なぜ判断したかをReview Recordとして残す | empty / valid / failure、decision owner、decision reason、decided at、next action、review evidence、rollback confirmed、採用済みdeltaだけを次回packetへ進める |
| Adopted Delta Markdown Exporter | 採用済みdeltaだけを次回AI Task Packet Markdown / Verification Plan / Codex promptへ書き出す | empty / valid / failure、Markdown section、verification plan patch、Codex prompt patch、rollback condition、review evidence、未採用deltaのLearning Log戻し、未採用delta混入検出 |
| Packet File Apply Planner | 採用済みdeltaのMarkdown exportを実ファイルへ反映する前に、対象ファイル・追記位置・before/after差分・検証・rollbackを確認する | empty / valid / failure、AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.md、insert position、verification command、rollback step、review evidence、未採用delta混入検出 |
| Packet Draft Workspace | Packet File Apply Plannerの適用計画から、次回AIへ渡す4種類のドラフト本文とコピー用Codex promptを実ファイル反映前に確認する | empty / valid / failure、AI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.md / LEARNING_LOG.md、draft body、source delta id、差分サマリ、実行前チェック、verification command、rollback condition、AIDD-Spec接続、file target衝突、未採用delta混入検出 |
| Safe Patch Review Workspace | Packet Draft Workspaceのドラフト本文を実ファイルへ反映する前に、安全なpatch候補としてレビューする | empty / valid / failure、patch id、target file、source draft id、diff summary、diff size、apply command、verification command、rollback command、reviewer checklist、AIDD-Spec接続、危険なtarget path、diff size過大、未採用delta混入、ローカルパス混入検出 |
| Diff Bundle & Rollback Evidence Workspace | Safe Patch Review Workspaceで承認されたpatch候補を自動適用する前に、diff bundle、dry-run結果、rollback evidenceを保存する | empty / valid / failure、bundle id、source patch id、target file、before hash、after hash、diff bundle path、dry-run command/status、rollback evidence path、rollback verified command、verification command、reviewer checklist、AIDD-Spec接続、危険なtarget path、ローカルパス混入、rollback evidence不足検出 |
| Diff Bundle Decision Ledger | Diff Bundle & Rollback Evidence Workspaceで束ねたbundleを、採用 / 却下 / 保留として判断し、理由・判断者・証跡・次の行動をReview Recordへ保存する | empty / valid / failure、bundle id、decision、decision owner、decision reason、decided at、review evidence path、next action、rollback confirmed、verification command、AIDD-Spec接続、未判断・理由不足・証跡不足・rollback未確認・local path/host混入・採用済みverification不足検出 |
| Adopted Bundle Exporter | Decision Ledgerで採用済みになったbundleだけを次回AI Task Packet / Verification Plan / Codex promptへ書き出す直前にレビューする | empty / valid / failure、source bundle id、target packet section、Markdown section、Verification Plan patch、Codex prompt patch、rollback condition、review evidence、Learning Log戻し、未採用bundle混入・証跡不足・rollback不足・local path/host混入検出 |
| Exported Packet Preflight Reviewer | Adopted Bundle Exporterで書き出した次回AI Task Packet / Verification Plan / Codex promptをCodexへ渡す直前にレビューする | empty / valid / failure、packet id、source export id、source decision status、target file、Markdown body、browser projects、verification depth、evidence paths、rollback plan、AIDD-Spec connections、未採用bundle混入・Firefox除外・浅い検証・local path/host/private network混入・rollback不足・evidence不足・AIDD-Spec接続不足検出 |
| Dogfood Packet Markdown Review | 新規アプリ案seedをAI_TASK_PACKET.md / CODEX_PROMPT.md / VERIFICATION_PLAN.mdへ反映する前に、Markdown本文、差分サマリ、実行前チェック、検証コマンド、rollback条件としてレビューする | source app idea、target file、heading、body preview、diff summary、preflight checks、verification command、rollback condition、copy bundle、実在IP/公式素材/ローカルパス/host名/プライベートネットワークURL/浅い検証/Firefox除外の反映前確認 |
| Packet Apply Command Composer | 承認済みMarkdownを実ファイルへ反映する直前に、apply command、dry-run、verification、rollback、evidence pathを確認する | empty / valid / failure、target file、apply command、dry-run command、verification command、rollback command、terminal evidence path、preflight checks、未レビューMarkdown混入・危険なtarget path・rollback不足・検証不足の検出 |
| Run Authorization Gate | preflight validなpacketをCodex run queueへ積む前に、誰が・どの条件で実行許可したかをReview Recordとして残す | empty / valid / failure、preflight status、approver、authorization reason、Codex command、sandbox mode、required verification commands、Chromium / Firefox / WebKit、evidence path、rollback plan、AIDD-Spec connections、preflight failure・未承認・危険なcommand・Firefox除外・浅い検証・local path/host/private network URL混入・証跡不足・rollback不足の検出 |
| Codex Run Queue | Run Authorization Gateで承認されたCodex実行を、実行待ち・実行中・成功・失敗・証跡不足として追跡し、Verification Evidence / Review Record / Learning Logへ戻す | empty / valid / failure、source authorization id、waiting/running/succeeded/failed/evidence_missing、Codex command、sandbox mode、required verification commands、actual results、Chromium / Firefox / WebKit、terminal/screenshot/playwright evidence、retry policy、rollback plan、AIDD-Spec connections、危険command・Firefox除外・浅い検証・証跡不足・rollback不足の検出 |
| Run Result Review Synthesizer | Codex Run Queueの実行結果を、標準Review Finding、AI Task Packet delta、Codex prompt delta、Verification command、Learning Logへ合成する | empty / valid / failure、source run id、outcome、score、terminal evidence、screenshot evidence、browser coverage、doctor:aidd、rollback、privacy、prompt delta、needed upstream info、standard update、codex prompt delta、verification command、local path/host/private network混入検出 |
| Next Increment Planner | Run Result ReviewとLearning Logを、次に実行する1インクリメント計画へ畳み込む | empty / valid / failure、source review id、source run id、recommended increment、priority reason、target artifacts、acceptance criteria、verification commands、required evidence、Codex prompt draft、rollback condition、note article angle、Learning Log接続、AIDD-Spec接続、source review不足・priority不足・3ブラウザE2E不足・terminal/failure screenshot不足・rollback不足・local path/host/private network URL混入検出 |
| Verification Run Detail | Codex Run Queueの各itemをcommand別exit code、artifact path、失敗分類、修正指示へ展開する | empty / valid / failure、source queue item、source run status、commit SHA、command status、exit code、duration、artifact path、failure category、repair instruction、terminal/screenshot/playwright evidence、Chromium / Firefox / WebKit、Review Finding draft、AIDD-Spec接続、commit SHA不足・command別detail不足・artifact path不足・失敗分類不足・修正指示不足・Firefox除外・証跡不足検出 |
| Evidence Repair Delta Generator | Verification Run Detailのfailed / evidence_missing / timeoutを次回AI Task Packet delta、Codex prompt delta、検証コマンド、rollback条件、Learning Logへ戻す | empty / valid / failure、source detail id、repair delta id、failure category、AI Task Packet delta、Codex prompt delta、verification command、rollback condition、Learning Log note、terminal evidence、failure screenshot、Chromium / Firefox / WebKit、AIDD-Spec接続、source detail不足・失敗分類不足・修正指示不足・Firefox除外・terminal/failure screenshot不足・local path/host/private network混入検出 |
| Repair Delta Priority Decision Workspace | Evidence Repair Deltaを次の1インクリメントへ採用 / 保留 / 却下として判断し、採用済みdeltaだけを次回AI Task Packet / Codex promptへ進める | empty / valid / failure、source repair delta id、decision、priority reason、decision owner、review evidence、rollback condition、next packet section、Codex prompt patch、Verification Evidence接続、Review Record接続、Learning Log接続、未判断・理由不足・証跡不足・rollback不足・Firefox除外・未採用delta混入・local path/host/private network混入検出 |
| Execution Priority Set Builder | 採用済みrepair deltaを、次の1回で実行するもの / 次回送り / Learning Log戻しへ分け、Codex prompt previewへexecute_nowだけを入れる | empty / valid / failure、source decision workspace、execute_now / next_increment / learning_log、priority、execution budget、verification commands、rollback condition、Codex prompt preview、Review Record接続、Learning Log接続、Verification Evidence接続、優先順位重複・実行予算不足・検証コマンド不足・rollback不足・Firefox除外・未採用delta混入・execute_now以外のprompt混入・local path/host/private network混入検出 |
| One-Run Handoff Pack Reviewer | execute_nowに絞ったrepair deltaを、次の1回のCodex実行へ渡す手渡しパックとして、AI Task Packet patch / Codex prompt / 検証 / 証跡 / rollback / 記事化観点まで確認する | empty / valid / failure、source execution set、execute_now delta id、AI Task Packet patch、Codex prompt、verification commands、Chromium / Firefox / WebKit、terminal / empty / valid / failure screenshot / Playwright report、rollback condition、note article angle、AIDD-Spec接続、source不足・patch不足・prompt不足・検証不足・Firefox除外・証跡不足・rollback不足・local path/host/private network URL混入検出 |
| Codex Run Start Receipt Auditor | One-Run Handoff Packを実際にCodexへ渡した直後の実行開始レシートとして、command、sandbox、開始時刻、担当、証跡保存先、検証継承、rollback停止条件を確認する | empty / valid / failure、source handoff pack id、Codex command、sandbox mode、started at、operator、evidence root、required verification commands、Chromium / Firefox / WebKit、required screenshots、rollback stop condition、AIDD-Spec接続、handoff不足・危険command・sandbox不足・evidence root不足・Firefox除外・terminal/failure screenshot不足・rollback不足・local path/host/private network URL混入検出 |
| Verification Evidence Receipt Binder | Codex Run Start Receiptに紐づく個別検証コマンド結果を1つのVerification Evidence Receiptとして束ね、Review Record / Learning Logへ渡す | empty / valid / failure、source run start receipt、command別exit code、duration、terminal log、artifact path、failure category、repair instruction、Chromium / Firefox / WebKit、empty/valid/failure/terminal evidence screenshot、doctor:aidd、AIDD-Spec接続、source不足・command別detail不足・exit code不足・artifact不足・失敗分類不足・修正指示不足・Firefox除外・terminal/failure screenshot不足・doctor:aidd不足・local path/host/private network URL混入検出 |
| Review Record Receipt Synthesizer | Verification Evidence Receipt Binderをsourceとして、検証結果をReview Record / Learning Log / 次回AI Task Packet deltaへ変換する | empty / valid / failure、source receipt、score根拠、review findings、needed upstream info、standard update、AI Task Packet delta、Codex prompt delta、verification command、Learning Log、terminal/failure screenshot、Chromium / Firefox / WebKit、AIDD-Spec接続、source不足・score根拠不足・finding分類不足・needed upstream info不足・delta不足・prompt不足・検証コマンド不足・Learning Log接続不足・Firefox除外・terminal/failure screenshot不足・local path/host/private network URL混入検出 |
| Review Finding Action Queue | Review Record Receipt Synthesizerで作られたReview Findingを、次に実行する行動キューへ変換し、execute_now / next_increment / learning_logを混ぜずに扱う | empty / valid / failure、source review id、queue id、action item、finding category、severity、lane、priority reason、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connection、Codex prompt preview、execute_nowのみprompt反映、source不足・priority reason不足・lane不足・verification command不足・rollback不足・required evidence不足・Firefox除外・terminal/failure screenshot不足・execute_now以外のprompt混入・local path / host / private network URL混入・AIDD-Spec接続不足検出 |
| One-Run Execution Readiness Gate | Review Finding Action Queueのexecute_now itemを、実際のCodex実行へ渡す直前にready / blockedとして判定する | empty / ready / blocked、source queue id、execute_now action id、Codex command、sandbox mode、required verification commands、Chromium / Firefox / WebKit、required evidence、rollback stop condition、ready reason、AIDD-Spec connection、source不足・execute_now以外混入・危険command・sandbox不足・検証不足・Firefox除外・terminal/failure screenshot不足・rollback不足・local path / host / private network URL混入・AIDD-Spec接続不足検出 |
| Codex Run Budget Shrink Planner | One-Run Execution Readiness Gate / Codex Run Budget Gateでbrakeまたはstopになった時、実行を諦めるだけでなく縮小後AI Task Packetを生成する | ready / brake / stop、source packet id、usage band、keep_now、defer_next_increment、minimum_verification、fallback_action、resume_condition、evidence_paths、prompt_preview、local path / private host / private network URLの公開用サニタイズ、Verification Evidence / Learning Log接続 |
| Shrunk Packet Handoff Receipt | Codex Run Budget Shrink Plannerで小さく畳んだAI Task Packetを、次回Codex実行へ渡す直前にハンドオフレシートとして確認する | empty / valid / blocked、source shrink plan、execute_now、defer_next_increment、minimum_verification、Codex prompt preview、required evidence、rollback condition、AIDD-Spec接続、local path / private host / private network URL・3ブラウザ不足・evidence不足の公開前ブロック。MVP070では、execute_nowだけをpromptへ入れ、Firefox除外・failure screenshot不足・rollback不足・公開用prompt混入をblockedとして検出する |
| Handoff Decision Ledger | 縮小版ハンドオフレシートを見た後、次回Codex実行へ進めるか・保留するか・止めるかをReview Recordとして判断する | empty / approved / held / blocked、source handoff receipt、decision owner、decision reason、approved execute_now、Codex command draft、verification commands、required evidence、rollback condition、hold reason、Learning Log返却、未承認・理由不足・3ブラウザ不足・evidence不足・local path/private host/private network URL混入検出。MVP071では、approved execute_nowだけをCodex command draftへ進め、heldはLearning Log返却、blockedは公開前サニタイズと証跡不足で停止する |
| Run Queue Intake | Handoff Decision Ledgerでapprovedになった実行候補だけをCodex Run Queueへ入れる直前に検査する | empty / queued / rejected / evidence_missing、source decision id、queue item id、run status、Codex command、sandbox mode、required verification commands、browser projects、required evidence、rollback plan、AIDD-Spec接続、held/blocked/unapproved decision・危険command・sandbox不足・Firefox除外・浅い検証・rollback不足・証跡不足・local path/private host/private network URL混入検出 |
| Codex Run Queue Status Tracker | Run Queue Intakeでqueuedになった実行を待ち・実行中・成功・失敗・証跡不足として追跡し、実行結果をVerification Evidence / Review Record / Learning Logへ戻す | empty / waiting / running / succeeded / failed / evidence_missing、source intake id、queue item id、run status、actual results、verification summary、browser projects、terminal evidence、screenshot evidence、browser console log、掲載用GIF、Playwright report、rollback plan、review record output、learning log output、AIDD-Spec接続、command失敗・Firefox未実行・doctor:aidd失敗・危険command・rollback不足・証跡不足・console error/warn・local path/private host/private network URL混入検出。MVP074では、6状態をquery paramで切り替え、command別exit code、3ブラウザcoverage、terminal/screenshot/console/Playwright証跡、Review Record / Learning Log出力をdoctor/e2eで確認する |
| Run Result Digest Publisher | Codex Run Queue Status Trackerの実行結果を、レビュー担当者・次回AI Task Packet・note記事化に使える短い共有ダイジェストへ変換する | empty / valid / failure / blocked、source run id、run outcome、score、terminal evidence、initial/filled/failure/terminal screenshot、Chromium / Firefox / WebKit coverage、console status、Review Record excerpt、Learning Log excerpt、AI Task Packet delta、Codex prompt delta、note article angle、publish readiness、local path/private host/private network URL混入検出 |
| Publication Evidence QA Gate | Run Result Digestをnote/preview公開へ進める直前に、記事・画像・terminal evidence・3ブラウザ・console・サニタイズ・AIDD-Spec接続を公開前QAとして確認する | empty / valid / failure / blocked、source digest id、article path、preview、asset copy、terminal evidence、initial/filled/failure/terminal evidence PNG、Chromium / Firefox / WebKit coverage、console status、sanitization scan、Review Record、Learning Log、AI Task Packet delta、Codex prompt delta、publish checklist、local path / host / private network URL混入・Firefox除外・terminal evidence不足・記事観点不足・AIDD-Spec接続不足検出 |
| Preview Smoke Receipt Binder | Publication Evidence QA Gateの後段で、公開preview HTML / asset / terminal evidence imageがHTTP経路で読めた事実をReceiptとして束ねる | empty / valid / failure / blocked、receipt id、source QA gate id、checked URLs、HTTP status、byte size、content type、latency ms、checked_at、evidence path、Chromium / Firefox / WebKit、console status、sanitization scan、Review Finding、Learning Log、AI Task Packet delta、Codex prompt delta、404・0 byte・content type mismatch・latency超過・private URL・local path・Firefox未確認・receipt保存先不足・AIDD-Spec接続不足検出 |
| Dispatch Receipt History Comparator | Run Queue Dispatch Receiptを複数件の履歴として比較し、同じ失敗が減ったか、どのRepair Actionが効いたかをReview Record / Learning Log / 次回AI Task Packet deltaへ戻す | empty / valid / improved / regression / blocked、Receipt 3件以上、score推移、再発finding、減ったfinding、effective repair action、terminal/screenshot evidence、Chromium / Firefox / WebKit、console status、execute_nowのみのprompt preview、next_increment / learning_log分離、Review Finding YAML、private URL・local path・host名・Firefox除外・terminal evidence不足・failure screenshot不足・AIDD-Spec接続不足・execute_now以外混入検出 |
| Smoke Receipt Repair Action Planner | Preview Smoke Receipt Binderで見つかったfailure / blockedを、次の1回で実行するRepair Actionへ変換する | empty / planned / failure / blocked、source receipt、broken URL、finding category、severity、lane、priority reason、execute_now action、next_increment、learning_log、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connection、Codex prompt preview、execute_now以外のprompt混入・private URL・local path・Firefox除外・terminal evidence不足・failure screenshot不足・AIDD-Spec接続不足検出 |
| Public Preview Smoke Verifier | Publication Evidence QA Gateの後段で、公開preview HTMLとassetsがHTTP経路で読めるかを最終確認する | empty / valid / failure / blocked、smoke run id、article path、preview URL/path、checked URLs、HTTP status、byte size、content type、latency ms、terminal evidence image response、Chromium / Firefox / WebKit coverage、console status、sanitization scan、Review Finding、Learning Log、AI Task Packet delta、Codex prompt delta、rerun command、HTTP経路未確認・private URL混入・Firefox未確認・terminal evidence image response不足・AIDD-Spec接続不足検出 |
| Smoke Repair Priority Gate | Smoke Receipt Repair Action Plannerで作った複数のRepair候補を、今回実行する1件 / 次回送り / Learning Log戻しへ分ける | empty / prioritized / conflict / blocked、candidate id、source receipt、severity、lane、priority score、effort、risk、priority reason、execute_now、defer_next_increment、return_to_learning_log、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec接続、Codex prompt preview、優先順位衝突・実行予算超過・private URL混入・local path混入・Firefox除外・terminal evidence不足・failure screenshot不足・rollback不足・AIDD-Spec接続不足・execute_now以外混入検出。MVP083では、execute_nowだけをpromptへ入れ、複数候補を1件に絞る優先順位ゲートをdoctor/e2eで確認する |
| Public Preview Smoke Final Receipt | Publication Evidence QA Gate / Public Preview Smoke Verifierの後段で、公開preview HTML・画像・terminal evidence imageをHTTP経路の最終receiptとして束ねる | empty / verified / failure / blocked、receipt id、source gate id、article path、preview URL、checked URLs、HTTP status、byte size、content type、latency ms、checked_at、terminal evidence image response、Chromium / Firefox / WebKit coverage、console status、sanitization scan、Review Finding YAML、Learning Log、AI Task Packet delta、Codex prompt delta、rollback condition、AIDD-Spec接続、404・0 byte・content type mismatch・latency超過のdelta化、private URL・local path・host名・Firefox未確認・terminal evidence不足・AIDD-Spec接続不足・rollback不足の公開前停止。MVP084では、公開前の最後のHTTP receiptをdoctor/e2e/captureで確認する |
| Final Receipt Failure Handoff Queue | Public Preview Smoke Final Receiptで見つかったfailure / blockedを、次の1回で実行するReview Finding Actionへ変換し、execute_now / next_increment / learning_logを混ぜずに扱う | empty / queued / blocked / exported、source receipt id、broken URL、HTTP status、byte size、content type、latency ms、finding category、severity、lane、priority reason、AI Task Packet patch、Codex prompt patch、Codex prompt preview、verification commands、required evidence、rollback condition、AIDD-Spec接続、Chromium / Firefox / WebKit coverage、terminal evidence、failure screenshot、Playwright report、console status、sanitization scan、execute_now以外のprompt混入・private URL・local path・host名・Firefox未確認・terminal evidence不足・failure screenshot不足・rollback不足・AIDD-Spec接続不足検出。MVP085では、final receipt失敗を1件の実行actionへ変換し、exported promptにexecute_nowだけが入ることをdoctor/e2e/captureで確認する |
| Smoke Finding Action Queue | Public Preview Smoke Verifierの失敗を次の1回で実行するReview Finding Actionへ変換し、execute_now / next_increment / learning_logを混ぜずに扱う | empty / queued / blocked / exported、source smoke run id、broken URL、HTTP status、byte size、content type、finding category、severity、lane、priority reason、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec接続、execute_now以外のprompt混入・private URL混入・Firefox未確認・terminal evidence不足・AIDD-Spec接続不足検出。MVP072では、preview smoke失敗を1件の実行actionへ変換し、exported promptにexecute_nowだけが入ることをdoctor/e2eで確認する |
| Smoke Action Run Queue Intake | Smoke Finding Action Queueでexportedになったexecute_now actionをCodex Run Queueへ入れる直前に検査する | empty / queued / rejected / evidence_missing、source smoke action id、queue item id、Codex command、sandbox mode、required verification commands、Chromium / Firefox / WebKit、required evidence、rollback plan、AIDD-Spec接続、Run Queue payload、未export action・execute_now以外混入・危険command・sandbox不足・Firefox除外・local path/private network URL混入・terminal evidence不足・failure screenshot不足・Playwright report不足検出。MVP073では、queued payloadとCodex command previewへexecute_nowだけを入れ、Run Queue投入前に拒否/証跡不足を分けることをdoctor/e2eで確認する |

### 3.1 Codex Run Queue Status Tracker evidence rule（MVP063反映）

Run Queueの状態追跡は、UI上のステータス表示だけでは完了扱いにしない。後工程のレビューと記事化が必要とするため、次を同じ実験単位で保存する。

```yaml
codex_run_queue_status_tracker:
  required_states:
    - empty
    - waiting
    - running
    - succeeded
    - failed
    - evidence_missing
  required_evidence:
    terminal:
      - lint
      - typecheck
      - test
      - coverage
      - build
      - doctor:aidd
      - e2e_chromium_firefox_webkit
      - capture
      - browser_console
    screenshots:
      - empty
      - waiting
      - running
      - succeeded
      - failed
      - evidence_missing
    publish_assets:
      - human_speed_gif
  review_findings:
    failed:
      category: 実行失敗
      required_fields:
        - missing
        - fix_instruction
        - verification_command
    evidence_missing:
      category: 証跡不足
      required_fields:
        - missing
        - fix_instruction
        - verification_command
  prompt_delta: |
    Run Queue状態UIを作る場合は、6状態の表示だけでなく、terminal evidence、screenshot evidence、browser console log、掲載用GIFを保存し、failed / evidence_missingをReview FindingとしてLearning Logへ戻してください。検証補助scriptもlint対象です。
```

### 3.2 Run Result Digest Publisher sharing rule（MVP075反映）

Run結果は詳細画面だけに閉じず、次回判断・レビュー・記事化で再利用できる短い共有ダイジェストへ変換する。共有前に次を確認する。

```yaml
run_result_digest_publisher:
  required_states:
    - empty
    - valid
    - failure
    - blocked
  required_inputs:
    - source_run_id
    - run_outcome
    - score
    - score_basis
    - terminal_evidence_summary
    - initial_screenshot
    - filled_screenshot
    - failure_screenshot
    - terminal_evidence_screenshot
    - browser_coverage_chromium_firefox_webkit
    - console_status
    - review_record_excerpt
    - learning_log_excerpt
    - ai_task_packet_delta
    - codex_prompt_delta
    - note_article_angle
    - publish_readiness
  required_outputs:
    - reviewer_digest
    - next_ai_task_packet_delta
    - codex_prompt_delta
    - note_article_angle
    - publish_readiness_decision
  blocking_findings:
    - score根拠不足
    - source run id不足
    - terminal evidence不足
    - failure screenshot不足
    - Firefox除外
    - console error/warn未確認
    - local path/private host/private network URL混入
    - Learning Log接続不足
    - note記事観点不足
  prompt_delta: |
    実行結果を共有する前に、source run id、run outcome、scoreとscore根拠、terminal evidence、initial/filled/failure/terminal screenshot、Chromium / Firefox / WebKit coverage、console status、Review Record excerpt、Learning Log excerpt、AI Task Packet delta、Codex prompt delta、note article angle、publish readinessを1つのMarkdown digestへまとめてください。score根拠不足、Firefox未実行、console warn、terminal evidence不足、local path / private host / private network URL混入はReview Findingとして表示し、blockedでは公開前に止めてください。検証補助scriptはdoctor:aiddと3ブラウザE2Eの対象に含めてください。
```

### 3.3 Publication Evidence QA Gate public QA rule（MVP076反映）

Run Result Digestをnote/preview公開へ進める前に、記事本文だけでなく公開preview、画像コピー、terminal evidence、3ブラウザ、console、sanitize、AIDD-Spec接続を同じ単位で確認する。

```yaml
publication_evidence_qa_gate:
  required_states:
    - empty
    - valid
    - failure
    - blocked
  required_inputs:
    - source_digest_id
    - article_path
    - preview_path
    - asset_copy_status
    - terminal_evidence_status
    - initial_screenshot
    - filled_screenshot
    - failure_screenshot
    - terminal_evidence_screenshot
    - chromium_firefox_webkit_coverage
    - console_status
    - sanitization_scan
    - review_record_excerpt
    - learning_log_excerpt
    - ai_task_packet_delta
    - codex_prompt_delta
    - publish_checklist
    - aidd_spec_connection
  failure_findings:
    - Firefox未確認
    - terminal evidence不足
    - failure screenshot不足
    - console warn未解消
    - 記事観点不足
    - AIDD-Spec接続不足
  blocking_findings:
    - local path混入
    - private host混入
    - private network URL混入
  prompt_delta: |
    Run Result Digestを公開へ進める前に、記事・preview・asset copy・terminal evidence・initial/filled/failure/terminal evidence PNG・Chromium/Firefox/WebKit coverage・console status・sanitization scan・Review Record・Learning Log・AI Task Packet delta・Codex prompt delta・AIDD-Spec接続をPublication Evidence QA Gateで確認してください。Firefox未確認やterminal evidence不足はfailure、local path/private host/private network URL混入はblockedとして公開前停止にしてください。
```

### 3.4 Preview Smoke Receipt Binder HTTP receipt rule（MVP077反映）

Publication Evidence QA Gateで公開前QAを通過した後、preview HTML / asset / terminal evidence imageをHTTP経路で再読込し、status、byte size、content type、latency、checked_at、evidence pathをReceiptとして束ねる。

```yaml
preview_smoke_receipt_binder:
  required_states:
    - empty
    - valid
    - failure
    - blocked
  required_inputs:
    - receipt_id
    - source_qa_gate_id
    - checked_urls
    - http_status
    - byte_size
    - content_type
    - latency_ms
    - checked_at
    - evidence_path
    - chromium_firefox_webkit_coverage
    - console_status
    - sanitization_scan
    - aidd_spec_connection
  failure_findings:
    - 404
    - 0 byte
    - content type mismatch
    - latency超過
  blocking_findings:
    - private URL
    - local path
    - Firefox未確認
    - receipt保存先不足
    - AIDD-Spec接続不足
  prompt_delta: |
    公開preview確認を「画像があるはず」という目視で終わらせず、HTML、asset、terminal evidence imageのHTTP status、byte size、content type、latency ms、checked_at、evidence pathをPreview Smoke Receiptとして保存してください。404、0 byte、content type mismatch、latency超過はReview Findingへ変換し、private URL、local path、Firefox未確認、receipt保存先不足、AIDD-Spec接続不足はblockedとして公開前停止にしてください。
```

### 3.5 Smoke Receipt Repair Action Planner rule（MVP082反映）

Preview Smoke Receiptで見つかったfailure / blockedは、その場のメモで終わらせず、次の1回で実行するRepair Actionへ変換する。execute_now、next_increment、learning_logを混ぜるとAIへの依頼が大きくなりすぎるため、Codex prompt previewにはexecute_nowだけを入れる。

```yaml
smoke_receipt_repair_action_planner:
  required_states:
    - empty
    - planned
    - failure
    - blocked
  required_inputs:
    - source_receipt
    - broken_url
    - finding_category
    - severity
    - lane
    - priority_reason
  required_outputs:
    - execute_now_action
    - next_increment
    - learning_log
    - ai_task_packet_patch
    - codex_prompt_patch
    - verification_commands
    - required_evidence
    - rollback_condition
    - aidd_spec_connection
  blocking_findings:
    - private URL
    - local path
    - Firefox除外
    - terminal evidence不足
    - failure screenshot不足
    - AIDD-Spec接続不足
    - execute_now以外混入
  prompt_delta: |
    Preview Smoke Receiptの失敗を次の1回へ進める時は、broken URL、finding category、severity、lane、priority reasonを明示し、execute_now action、AI Task Packet patch、Codex prompt patch、verification commands、required evidence、rollback condition、AIDD-Spec connectionを生成してください。Codex prompt previewにはexecute_nowだけを入れ、next_incrementとlearning_logは別欄へ分離してください。private URL、local path、Firefox除外、terminal evidence不足、failure screenshot不足、AIDD-Spec接続不足、execute_now以外混入はblockedとして止めてください。
```

## 4. 初期データモデル

```ts
type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

type AITaskPacket = {
  id: string;
  projectId: string;
  specVersion: "AIDD-Spec v0.1";
  conformanceTarget: "L0" | "L1" | "L2" | "L3" | "L4";
  productBrief: ProductBrief;
  experienceContract: ExperienceContract;
  qualityGates: QualityGate[];
  expectedOutput: ExpectedOutput;
};

type VerificationEvidence = {
  id: string;
  taskPacketId: string;
  commandLogs: CommandLog[];
  reports: EvidenceFile[];
  screenshots: EvidenceFile[];
  ciRuns: CiRun[];
};

type ReviewRecord = {
  id: string;
  taskPacketId: string;
  score: number;
  passed: boolean;
  findings: Finding[];
  remainingRisks: string[];
};

type LearningLog = {
  id: string;
  taskPacketId: string;
  whatWorked: string[];
  whatFailed: string[];
  specUpdatesNeeded: string[];
};
```

## 5. 初期画面

1. Dashboard
2. New Project
3. AI Task Packet Builder
4. Packet Preview
5. Agent Runbook
6. Evidence Upload
7. Review Dashboard
8. Learning Log

## 6. MVP Tech Stack

- Next.js + TypeScript
- pnpm
- Local JSON persistence for first demo
- Later: Postgres/Supabase or SQLite/Turso
- Playwright for workflow E2E
- GitHub Actions for CI

## 7. ライブ配信で実演する順序

1. AIDD-Spec v0.1を見せる
2. AI Task Packetをフォームで作る構想を説明する
3. まず手動YAMLでIssueBrief LiteをCodexへ渡す
4. Codex出力を検証する
5. その流れをSaaSの画面に落とす
6. MVPの最初の画面をAIエージェントに作らせる
7. Verification Evidenceを保存する
8. Review Recordを書く
9. Learning Logから次回タスクを作る

## 8. 受け入れ条件

MVP v0.1は次を満たせば成功とする。

- Product Briefを入力できる
- AI Task Packet Markdown/YAMLを生成できる
- 必須項目不足を表示できる
- Codexへ渡すRunbookを生成できる
- Evidence/Review/Learning Logの雛形を作れる
- 1つのサンプルタスクでEnd-to-Endの流れを説明できる

## 9. 今後のSaaS化

v0.2以降で追加する。

- JSON Schema validation
- GitHub Actions連携
- Artifact upload API
- 複数AIエージェント比較
- Spec diff / improvement proposal
- Team review workflow
- Template marketplace
