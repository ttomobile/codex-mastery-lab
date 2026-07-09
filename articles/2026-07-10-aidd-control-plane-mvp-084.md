# note公開前の最後の不安を消す：preview HTML・画像・terminal evidenceをHTTPレシートに束ねる

> 2026-07-10 / Codex Mastery Lab  
> 記事種別: Experiment / SaaS / Verification Evidence / AIDD-Spec  
> 将来の書籍章: 第10章 Verification Evidence、第18章 AIDD Control PlaneのMVP

## 読者の悩み

AI駆動開発の記事やデモを公開する時、最後に残る不安は「手元では見えていた画像が、公開previewでも本当に見えるのか」です。

Markdownには画像リンクを書いた。スクリーンショットも保存した。terminal evidence画像も作った。けれど、公開経路では次のような問題が起きます。

- preview HTMLは生成されているが、画像が404になる
- 画像ファイルはあるが0 byteになっている
- terminal evidence画像が `image/png` ではなく別content typeで返る
- 読み込みが遅すぎて、読者には壊れて見える
- private URLやローカルパスが記事や証跡に残る

これは、旅行前の荷物チェックに似ています。カバンに入れたつもりでも、出発直前に「財布、鍵、スマホ、チケット」を実際に触って確認しないと不安が残ります。AIDD Control Planeでも、公開直前に**HTTPで読めた事実**をレシートとして残す必要があります。

## 今回の仮説

MVP083では、複数のSmoke Repair候補を「今回やる1件」へ絞る優先順位ゲートを作りました。

今回のMVP084の仮説は次です。

> preview HTML、記事内画像、terminal evidence画像について、HTTP status、byte size、content type、latency、checked_atを同じ画面に束ねれば、公開前の証跡不足をReview Findingと次回AI Task Packet deltaへ戻しやすくなる。

作った機能名は **Public Preview Smoke Final Receipt** です。

## 実験内容

AI Task Packetでは、次を要求しました。

```text
Public Preview Smoke Final Receipt MVP084
- ?state=empty|verified|failure|blocked で状態切替
- receipt id / source gate id / article path / preview URL / checked URLsを表示
- HTTP status / byte size / content type / latency ms / checked_atを表示
- terminal evidence image responseを独立表示
- Chromium / Firefox / WebKit coverage、console status、sanitization scanを表示
- failureでは404 / 0 byte / content type mismatch / latency超過をReview Finding YAML、Learning Log、AI Task Packet delta、Codex prompt deltaへ変換
- blockedではprivate URL、local path、host名、Firefox未確認、terminal evidence不足、AIDD-Spec接続不足、rollback不足を止める
```

実装先は次です。

```text
experiments/2026-07-10-aidd-control-plane-mvp-084/generated-repo/
```

今回は `codex exec --sandbox danger-full-access` を実行しましたが、120秒でタイムアウトしました。`codex-exec.txt` には途中ログが残っています。Codexは一部domain fileを作ったものの、app/pageやdoctorの整合が不足していたため、Hermes側でAI Task Packetに沿って仕上げ、独立検証しました。

## 画面キャプチャ

### 1. empty: HTTPレシート未入力

emptyでは、公開preview URL、asset、terminal evidence imageのHTTP receiptが未入力です。計測値が揃うまで公開完了にしません。

![MVP084 empty](assets/mvp084-empty.png)

### 2. verified: 公開previewで読めた

verifiedでは、preview HTML、assets、terminal evidence imageが200、非0 byte、期待content type、latency予算内で確認済みです。Chromium / Firefox / WebKit coverageとconsole statusも並べます。

![MVP084 verified](assets/mvp084-verified.png)

### 3. failure: 壊れたHTTP結果をdeltaへ戻す

failureでは、HTTP 404、0 byte、content type mismatch、latency超過をReview Finding YAML、Learning Log、AI Task Packet delta、Codex prompt deltaへ変換します。壊れて終わりではなく、次回の入力へ戻すのがAIDD Control Planeの価値です。

![MVP084 failure](assets/mvp084-failure.png)

### 4. blocked: 公開前に止める

blockedでは、private URL、local path、host名、Firefox未確認、terminal evidence不足、AIDD-Spec接続不足、rollback不足を公開前に止めます。

![MVP084 blocked](assets/mvp084-blocked.png)

### 5. terminal evidence

検証コマンドの結果を画像化しました。記事に「確認した」と書くだけでなく、読者が見られる証跡として残します。

![MVP084 terminal evidence](assets/mvp084-terminal-evidence.png)

## 失敗と修正

今回の失敗は2つです。

1つ目は、Codex実行が120秒でタイムアウトしたことです。これは「AIに任せたら完成した」ではなく、Agent Runの失敗・途中成果・人間/別Agentによる独立検証を分けて記録する必要がある、という証拠になりました。

2つ目は、最初のE2Eで `Chromium` や `private URL` の文字が複数箇所に出て、Playwrightのstrict mode violationになったことです。UIではなくテストの指定が曖昧でした。`getByText(...).first()` と `exact: true` で、何を見ているかを明確にして再実行しました。

## 検証ログ

個別に実行し、`artifacts/terminal/*.txt` に保存しました。

| コマンド | 結果 |
|---|---|
| `pnpm install --frozen-lockfile` | pass |
| `pnpm run lint` | pass |
| `pnpm run typecheck` | pass |
| `pnpm run test` | pass: 5 tests |
| `pnpm run build` | pass |
| `pnpm run test:e2e` | pass: Chromium / Firefox / WebKit 24 tests |
| `pnpm run doctor:aidd` | pass |
| `pnpm run capture:mvp084` | pass |

`doctor:aidd` の要約です。

```text
doctor:aidd passed
- 4状態: empty / verified / failure / blocked
- HTTP receipt: checked URLs / HTTP status / byte size / content type / latency ms / checked_at
- terminal evidence image response、console status、sanitization scan
- failure: 404 / 0 byte / content type mismatch / latency超過をReview Findingとdeltaへ変換
- blocked: private URL / local path / host名 / Firefox未確認 / terminal evidence不足 / AIDD-Spec接続不足 / rollback不足
- 3ブラウザ: Chromium / Firefox / WebKit
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
|---|---|---|
| preview HTMLのHTTP status | 記事ページが公開経路で読めるか | 生成済みでも公開URLが壊れることがあるため |
| 画像のbyte size | 0 byteではないか | ファイル名だけ存在して中身がない状態を防ぐため |
| content type | 画像が `image/png` として返るか | ブラウザや共有先で正しく表示するため |
| latency ms | 読者が待てる速度か | 遅すぎる証跡は壊れているように見えるため |
| checked_at | いつ確認したか | 古い成功ログを最新の公開確認と誤認しないため |
| terminal evidence image response | 検証結果画像が読めるか | 「検証した」という主張を読者が確認できるようにするため |
| 3ブラウザcoverage | Chromium / Firefox / WebKitを見たか | 1ブラウザだけの偶然を避けるため |
| console status | 表示中のエラーがないか | 画面は見えても内部で失敗している場合があるため |
| sanitization scan | private URL、local path、host名がないか | 公開記事に手元環境情報を漏らさないため |
| rollback condition | 壊れた時にどこへ戻すか | 修正を広げすぎず、次回のAI Task Packetへ戻すため |

## SaaS/AIDD-Specへの接続

AIDD-Spec v0.1では、Verification Evidenceは「コマンドを実行した気がする」ではなく、レビュー可能な証拠です。MVP084で追加したPublic Preview Smoke Final Receiptは、AIDD Control PlaneのSaaSとして次の役割を持ちます。

- 公開preview HTMLとassetsをHTTP経路で確認する。
- terminal evidence画像を、記事の主張と同じ公開経路で確認する。
- 404、0 byte、content type mismatch、latency超過をReview Findingへ変換する。
- Learning Log、AI Task Packet delta、Codex prompt deltaへ戻す。
- private URL、local path、host名、Firefox未確認、証跡不足、rollback不足を公開前に止める。

noteで読まれる記事という意味でも、これは重要です。AI量産記事ではなく、実験した本人しか書けない一次情報は、「どの公開経路で、何byte返り、どの失敗をどう次回指示へ戻したか」まで見えるほど強くなります。

## 次回

次は、この最終レシートで見つかったfailureを、Review Finding Action Queueへ戻し、`execute_now` と `next_increment` と `learning_log` を混ぜずに次回の1インクリメントへ渡す部分を強化します。
