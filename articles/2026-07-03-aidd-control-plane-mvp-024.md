# AIDD Control Plane MVP 024：patchを当てる前に、戻せる証跡を保存する

MVP 023では、AIが作ったドラフトをいきなり実ファイルへ反映せず、`Safe Patch Review Workspace` でpatch候補として確認しました。今回のMVP 024では、その次の不安である「もしpatchを当てた後に壊れたら、どう戻すのか？」を扱いました。

## 読者の悩み

AIに「この差分を反映して」と頼むと、成功したときは便利です。でも失敗したときに困ります。

> どの差分を当てたのか、当てる前の状態は何だったのか、戻せる証拠は残っているのかが分からない。

これは、料理で新しい味付けを試す前に、元の分量メモを残さないまま調味料を足してしまうような状態です。おいしくなればよいですが、失敗したときに元へ戻せません。AIDD Control Planeでは、AIに作業させる前に「試す差分」「試した結果」「戻し方」を同じ場所で確認できる必要があります。

## 今回の仮説

仮説は次です。

> Safe Patch Reviewで承認されたpatch候補を、diff bundle、before hash、after hash、dry-run結果、rollback evidence、rollback verified command付きで保存できれば、AIDD Control Planeは「安全に適用する直前の証跡台」まで進める。

## 実験内容

`experiments/aidd-control-plane-mvp-024/generated-repo` に、Next.js + TypeScriptで `Diff Bundle & Rollback Evidence Workspace` を追加しました。

主な追加点は次です。

- `empty` / `valid` / `failure` の状態切替
- valid状態で4ファイル分のdiff bundleを表示
  - `AI_TASK_PACKET.md`
  - `CODEX_PROMPT.md`
  - `VERIFICATION_PLAN.md`
  - `LEARNING_LOG.md`
- 各bundleに、bundle id、source patch id、target file、before hash、after hash、diff bundle path、dry-run command/status、rollback evidence path、rollback verified command、verification command、reviewer checklist、AIDD-Spec接続を表示
- failure状態で、source patch id不足、before/after hash不足、dry-run未成功、rollback evidence不足、rollback verified command不足、危険なtarget path、ローカルパス混入、AIDD-Spec接続不足をReview Findingへ変換
- Unit test、3ブラウザE2E、doctor、capture scriptをMVP 024向けに更新

Codex CLIは今回も `codex: command not found` で起動できませんでした。そのため、失敗ログを証跡として保存し、Hermes側でAI Task Packetに沿って実装と独立検証を続けました。

## 画面キャプチャ

### empty / initial：まだdiff bundleがない

![MVP024 empty state](../assets/aidd-control-plane-mvp024-empty.png)

empty状態では、まだ保存対象のdiff bundleはありません。ここで大事なのは、patch候補があっても、適用前の証跡がないなら次へ進めないことです。

### filled / valid：4ファイル分のdiff bundleとrollback evidenceを確認する

![MVP024 valid state](../assets/aidd-control-plane-mvp024-valid.png)

valid状態では、4種類の対象ファイルごとに、before hash、after hash、dry-run結果、rollback evidence path、rollback verified commandを並べます。AIに作業させる前に「どの差分を試し、どう戻せるか」を確認できます。

### failure：dry-run失敗とrollback evidence不足を止める

![MVP024 failure state](../assets/aidd-control-plane-mvp024-failure.png)

failure状態では、dry-run未成功、rollback evidence不足、危険な `../outside/SECRET.md`、ローカルパス混入をReview Findingとして表示します。

このチェックがないと、「patchを当てるだけ」のつもりが、公開できないローカルパスを証跡へ混ぜたり、戻し方がない変更を進めたりします。

### terminal evidence：実際に通した検証ログ

![MVP024 terminal evidence](../assets/aidd-control-plane-mvp024-terminal-evidence.png)

note記事として価値が出るのは、画面の紹介だけではなく「本当に検証したログ」があるときです。AI量産記事ではなく、実験した本人しか書けない一次情報にするためです。

## 失敗 / 修正

今回の失敗は2つです。

1つ目は、Codex CLIがこの環境で見つからず、`codex: command not found` になったことです。自律ジョブなので質問で止めず、失敗ログを残してHermes側で実装しました。

2つ目は、E2E初回で `dry-run未成功` と `rollback evidence不足` が複数のReview Findingに一致し、Playwright strict modeに引っかかったことです。これはアプリの不具合ではなく、テストの指定が広すぎる問題でした。`bundle 1: dry-run未成功` のように対象を絞り、3ブラウザで再実行しました。

## 検証ログ

独立検証として、次を個別に実行しました。

```text
pnpm install --frozen-lockfile: pass
pnpm run lint: pass
pnpm run typecheck: pass
pnpm run test: pass（49 tests）
pnpm run build: pass（Next.js警告: ESLint plugin未検出、既存設定課題）
pnpm run test:e2e: pass（Chromium / Firefox / WebKit、63 tests）
pnpm run doctor:aidd: pass
pnpm run capture:mvp024: pass
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| source patch idがある | どのpatch候補から来たbundleか | 根拠不明の差分を止めるため |
| target fileが許可リスト内 | 書き換えるファイルが4種類のAI依頼ファイルだけか | AIが関係ないファイルへ触るのを防ぐため |
| before hashがある | 適用前の状態を識別できるか | 失敗時に元の状態を確認するため |
| after hashがある | 適用候補後の状態を識別できるか | どの差分で何が変わるかを追跡するため |
| dry-runが成功している | 実適用前の事前確認が通ったか | 壊れる差分を本番的に進めないため |
| rollback evidenceがある | 戻し方と戻した証跡が保存されているか | 安全に試せる状態を作るため |
| ローカルパスが混ざらない | 公開不可情報がdiffや証跡に入っていないか | 記事・preview・artifactの公開事故を防ぐため |
| AIDD-Spec接続がある | Verification Evidence / Review Record / Rollback Planへ戻るか | 一回限りの修正で終わらせないため |

## SaaS / AIDD-Specへの接続

MVP 024で、AIDD Control Planeの流れは次のようになりました。

```text
Review Finding
  -> Spec Update Proposal Queue
  -> AI Task Packet Delta Apply Preview
  -> Delta Decision Review
  -> Adopted Delta Markdown Exporter
  -> Packet File Apply Planner
  -> Packet Draft Workspace
  -> Safe Patch Review Workspace
  -> Diff Bundle & Rollback Evidence Workspace
```

今回の標準更新として、`standards/aidd-control-plane-mvp-v0.1.md` に `Diff Bundle & Rollback Evidence Workspace` を追加しました。

## 次回

次は、Diff BundleとRollback Evidenceを保存した後に、実際の適用可否を判断する `Apply Authorization Gate` へ進めます。自動適用そのものではなく、まずは「誰が、どの証跡を見て、どの条件で適用を許可したか」を残す方向が安全です。
