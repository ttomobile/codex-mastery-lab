# 公開直前の「見落とし」をSaaSで止める：Publication Evidence QA Gateを作った

> 2026-07-09 / Codex Mastery Lab  
> 記事種別: Experiment / SaaS / Verification Evidence / AIDD-Spec  
> 将来の書籍章: 第10章 Verification Evidence、第11章 Learning Log、第18章 AIDD Control PlaneのMVP

## 読者の悩み

AIでアプリを作るところまでは速くなった。しかし、note記事や公開previewに出す直前で、次のような見落としが起きやすい。

- スクリーンショットはあるが、failure stateの画像だけない。
- `lint` や `build` のログはあるが、3ブラウザE2Eの証跡がない。
- 記事には「検証しました」と書いたが、terminal evidence画像がない。
- preview HTMLはできたが、画像が `preview/assets/` にコピーされていない。
- ローカルパス、private host、private network URLが公開物へ混ざる。

これは「記事を書く人の注意力」だけで解くには危ない。料理の最終チェックと同じで、出す直前に「盛り付け、アレルギー表示、注文内容、レシート」をまとめて確認する場所が必要になる。

今回のMVP076では、AIDD Control Planeに **Publication Evidence QA Gate** を追加した。Run Result Digestをnote/preview公開へ進める直前に、記事・画像・terminal evidence・3ブラウザ・console・サニタイズ・AIDD-Spec接続を1画面で止めるための入口である。

## 今回の仮説

仮説は次の通り。

> 公開直前QAを「記事執筆後の目視」ではなく、SaaSの標準ゲートにすると、証跡不足と公開事故を早い段階で見つけられる。

特に、今回のゲートでは `failure` と `blocked` を分けた。

- `failure`: Firefox未確認、terminal evidence不足、failure screenshot不足など、修正すれば公開へ戻せる不足。
- `blocked`: local path / private host / private network URL混入など、公開前に必ず停止すべき状態。

この区別がないと、「まあ後で直す」が公開事故になる。

## 実験内容

Codexへ渡したAI Task Packetでは、次を要求した。

```text
Publication Evidence QA Gate MVP076
- ?state=empty|valid|failure|blocked で状態切替
- article path / preview path / asset copy / terminal evidence を表示
- initial / filled / failure / terminal evidence PNG を必須化
- Chromium / Firefox / WebKit coverage を確認
- console status と sanitization scan を確認
- Review Finding を AIDD-Spec形式へ変換可能にする
- local path / private host / private network URL 混入は公開前停止
```

実装は `experiments/2026-07-09-aidd-control-plane-mvp-076/generated-repo/` に生成した。中心のdomain modelは `src/domain/publication-evidence-qa.ts` に分離し、画面はdomain dataを表示する構成にした。

## 画面キャプチャ

### 1. empty: source digest未選択

公開前QAの入口では、まだsource digestが選ばれていない状態を出す。ここで必要な入力が一覧化される。

![MVP076 empty](assets/aidd-control-plane-mvp076-empty.png)

### 2. valid: 公開可能

validでは、記事、preview、asset copy、terminal evidence、4種類のスクリーンショット、3ブラウザcoverage、console、sanitize、AIDD-Spec接続が揃っている。

![MVP076 valid](assets/aidd-control-plane-mvp076-valid.png)

### 3. failure: 公開QA不足

failureでは、Firefox未確認やterminal evidence不足などをReview Findingとして出す。各findingには `category / severity / ideal_state / fix_instruction / verification_command / needed_upstream_info` を含めた。

![MVP076 failure](assets/aidd-control-plane-mvp076-failure.png)

### 4. blocked: 公開前停止

blockedでは、ローカルパスやprivate URLの混入を「公開前停止」として扱う。今回の画面には検出デモ用の擬似値を入れているが、実運用では記事やpreview HTMLをscanして止める想定である。

![MVP076 blocked](assets/aidd-control-plane-mvp076-blocked.png)

### 5. terminal evidence画像

検証ログも記事に貼れる証跡としてPNG化した。

![MVP076 terminal evidence](assets/aidd-control-plane-mvp076-terminal-evidence.png)

## 失敗と修正

Codex実装後、独立検証で最初に `pnpm run lint` が落ちた。原因は、以前の実行で残っていた `.next/` や `playwright-report/` までESLintが見に行っていたことだった。

修正はシンプルで、`eslint.config.mjs` のignoreを独立したflat config項目として先頭に出した。

```ts
export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "artifacts/**",
      "assets/**",
      "next-env.d.ts"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // ...
);
```

この失敗は小さいが重要である。検証ゲート自体がruntime生成物に引っ張られると、公開前QAが毎回不安定になる。AIDD-Spec側では「検証対象とruntime生成物の境界」をAI Task Packetへ明記すべきだと分かった。

## 検証ログ

独立検証は、Codexの自己申告ではなく別コマンドとして実行した。

```text
pnpm install --frozen-lockfile  exit 0
pnpm run lint                  exit 0
pnpm run typecheck             exit 0
pnpm run test                  exit 0
pnpm run build                 exit 0
pnpm run test:e2e              exit 0 / 12 passed / Chromium, Firefox, WebKit
pnpm run doctor:aidd           exit 0
pnpm run capture:mvp076        exit 0
```

保存したterminal evidenceは次である。

```text
experiments/2026-07-09-aidd-control-plane-mvp-076/artifacts/terminal/
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| article path | 記事本文がどこにあるか | 後から検証ログと記事を結びつけるため |
| preview path | 公開前previewが生成されているか | Markdownだけでなく読者が見るHTMLを確認するため |
| asset copy | 記事画像がpreview/assetsへ届くか | 画像リンク切れを防ぐため |
| terminal evidence | 実行ログが保存されているか | 「通った」という自己申告を証拠に変えるため |
| initial / filled / failure screenshot | 主要状態が画像で残っているか | UIの成功状態だけを見て判断しないため |
| Chromium / Firefox / WebKit | 3ブラウザで確認したか | ブラウザ差分を公開前に見つけるため |
| console status | console error/warnがないか | 画面上は動いて見える隠れた問題を拾うため |
| sanitization scan | local pathやprivate URLがないか | 公開事故を防ぐため |
| AIDD-Spec connection | 標準のどの項目とつながるか | 次回AI Task Packetへ学びを戻すため |

## SaaS / AIDD-Specへの接続

今回のMVP076は、AIDD Control Planeを「もう一つのcoding agent」にするものではない。価値は、公開前に必要な証跡と判断を、誰でも同じ順番で確認できるようにすることにある。

AIDD-Spec v0.1では、今回の学びを次のように扱える。

```yaml
standard_update:
  document: AIDD Control Plane MVP v0.1
  field: publication_evidence_qa_gate
  rule: |
    Run Result Digestを公開へ進める前に、article path、preview path、asset copy、terminal evidence、initial/filled/failure/terminal evidence PNG、Chromium/Firefox/WebKit coverage、console status、sanitization scan、Review Record、Learning Log、AI Task Packet delta、Codex prompt deltaを確認する。
    local path / private host / private network URL混入はblockedとして公開前停止にする。
```

AIDD Control Plane SaaSとしては、次に **Public Preview Smoke Verifier** へ進むのが自然だ。Publication Evidence QA Gateで「揃っている」と判断した後、本当にpreview HTMLと画像がHTTP経路で読めるかを確認する段階である。

## まとめ

今回作ったものは、派手な新機能ではない。しかし、AI駆動開発を読者へ見せるなら、公開前QAは地味でも外せない。

- `failure` と `blocked` を分けた。
- 記事、preview、画像、terminal evidence、3ブラウザ、console、sanitize、AIDD-Spec接続を1画面にした。
- 3ブラウザE2Eで12 testsが通った。
- lint失敗から、runtime生成物を検証対象から外す必要が分かった。

次回は、公開previewのHTMLとassetsが実際に読めるかを確認する **Public Preview Smoke Verifier** に進む。
