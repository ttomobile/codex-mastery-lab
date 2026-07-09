# 「画像はあるはず」をHTTP証跡に変える：Preview Smoke Receipt Binderを作った

> 2026-07-09 / Codex Mastery Lab  
> 記事種別: Experiment / SaaS / Verification Evidence / AIDD-Spec  
> 将来の書籍章: 第10章 Verification Evidence、第11章 Learning Log、第18章 AIDD Control PlaneのMVP

## 読者の悩み

AIでアプリを作り、テストも通し、記事にスクリーンショットも貼った。ここまで進むと、つい「公開できる」と思ってしまいます。

しかし実際には、最後に次のような事故が起きます。

- preview HTMLは生成したが、公開経路では404になる。
- PNGは存在しているように見えるが、公開先では0 byteになっている。
- terminal evidence画像のURLを開くと、実は`text/plain`が返ってくる。
- Chromiumでは見たが、Firefoxで同じ画像を確認していない。
- 記事には「確認済み」と書いたが、いつ・どのURL・何byteで読めたかが残っていない。

これは、料理でいうと「材料は買ったはず」だけを見て、食卓に出せるか確認していない状態に近いです。AIDD Control Planeが目指すのは、AIにコードを書かせるだけではありません。最後に読者へ出す一次情報が壊れていないことまで、同じ手順で確認できるSaaSです。

## 今回の仮説

MVP076ではPublication Evidence QA Gateを作り、記事・画像・terminal evidence・3ブラウザ・console・サニタイズを公開前QAとして確認しました。

今回のMVP077の仮説は、さらに一歩進めて次の通りです。

> 公開previewのHTMLと画像を「あるはず」で扱わず、HTTP status、byte size、content type、latency、checked_at、evidence pathをReceiptとして束ねると、公開直前のリンク切れや0 byte画像を再現可能なReview Findingに変えられる。

作った機能名は **Preview Smoke Receipt Binder** です。

## 実験内容

Codexへ渡したAI Task Packetでは、次を要求しました。

```text
Preview Smoke Receipt Binder MVP077
- ?state=empty|valid|failure|blocked で状態切替
- preview HTML / asset / terminal evidence imageのHTTP responseをReceipt化
- status / byte size / content type / latency / checked_at / evidence pathを表示
- 404、0 byte、content type mismatch、latency超過をReview Findingへ変換
- private URL、local path、Firefox未確認、receipt保存先不足、AIDD-Spec接続不足は公開前停止
- 3ブラウザE2Eとdoctor:aiddで検証
```

実装先は次です。

```text
experiments/2026-07-09-aidd-control-plane-mvp-077/generated-repo/
```

中心の判定は `src/domain/preview-smoke-receipt.ts` に置き、UIはdomain modelを表示するだけに寄せました。これは、後で本物のHTTP checkやCI artifact APIへ差し替えやすくするためです。

## 画面キャプチャ

### 1. empty: Receipt対象が未選択

emptyでは、まだどのPublication Evidence QA Gateの後段を確認するか選ばれていません。receipt id、source QA gate id、HTTP status、byte size、content type、latency、checked_at、evidence pathが未入力であることを明示します。

![MVP077 empty](assets/mvp077-empty.png)

### 2. valid: HTTP証跡を保存可能

validでは、preview HTML、asset PNG、terminal evidence imageがすべてHTTP 200、byte sizeあり、content type妥当、3ブラウザ確認済みとして表示されます。

![MVP077 valid](assets/mvp077-valid.png)

### 3. failure: 修正可能なHTTP不一致

failureでは、404、0 byte、content type mismatch、latency超過をReview Findingとして表示します。大事なのは「失敗した」だけで止めないことです。何を直し、どのコマンドで再確認するかへ戻せる形にします。

![MVP077 failure](assets/mvp077-failure.png)

### 4. blocked: 公開前停止

blockedでは、private URL、local path、Firefox未確認、receipt保存先不足、AIDD-Spec接続不足を公開前停止として扱います。ここは「あとで直す」ではなく、公開前に止めるべき状態です。

![MVP077 blocked](assets/mvp077-blocked.png)

### 5. terminal evidence画像

検証ログも、記事に貼れる証跡画像として保存しました。

![MVP077 terminal evidence](assets/mvp077-terminal-evidence.png)

## 失敗と修正

Codex実装後の独立検証では、最初に `pnpm run lint` が落ちました。

原因は `next-env.d.ts` がESLint対象に入っており、Next.jsが生成するtriple slash referenceへ `@typescript-eslint/triple-slash-reference` が反応したことです。

修正では、flat configの先頭にignoreを置き、runtime生成物と `next-env.d.ts` を検証対象から外しました。

```ts
const eslintConfig = [
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
  ...tseslint.configs.recommended
];
```

さらに、Next.jsが親ディレクトリのlockfileをworkspace rootとして推測する警告も出ました。これは `next.config.ts` に `outputFileTracingRoot` を設定して抑制しました。

この失敗からの学びは、公開前QAやReceipt Binderそのものも、runtime生成物に引っ張られない検証境界を持つ必要があるということです。

## 検証ログ

Codexの自己申告ではなく、別コマンドとして独立検証しました。

```text
pnpm install --frozen-lockfile  exit 0
pnpm run lint                  exit 0
pnpm run typecheck             exit 0
pnpm run test                  exit 0 / 5 passed
pnpm run build                 exit 0
pnpm run test:e2e              exit 0 / 12 passed / Chromium, Firefox, WebKit
pnpm run doctor:aidd           exit 0
pnpm run capture:mvp077        exit 0
```

保存したterminal logは次にあります。

```text
experiments/2026-07-09-aidd-control-plane-mvp-077/artifacts/terminal/
```

## 読者が使えるチェックリスト

| チェック項目 | 何を確認したいのか | なぜ必要か |
| --- | --- | --- |
| HTTP status | HTMLや画像が200で返るか | Markdown上のパス存在だけでは公開経路の成功にならないため |
| byte size | 0 byteではないか | 壊れた画像を「存在するファイル」と誤認しないため |
| content type | PNGは`image/png`、HTMLは`text/html`で返るか | ブラウザやSNSカードで表示が崩れる原因を見つけるため |
| latency ms | 極端に遅くないか | 読者が開く前に体験劣化を見つけるため |
| checked_at | いつ確認したか | 後で再現・比較できる証跡にするため |
| evidence path | どこに証跡を保存したか | 記事、レビュー、次回AI Task Packetをつなぐため |
| 3ブラウザ | Chromium / Firefox / WebKitで読めるか | ブラウザ差分を公開前に拾うため |
| sanitize | private URLやlocal pathがないか | 公開事故を防ぐため |
| AIDD-Spec接続 | どの標準項目に戻すか | 1回の失敗を次回のAI指示へ変換するため |

## SaaS / AIDD-Specへの接続

MVP077は、AIDD Control Planeを「もう一つのcoding agent」にする機能ではありません。AIが作ったものを、公開できる一次情報へ変えるための証跡レイヤーです。

AIDD-Spec v0.1では、今回の学びを次のように扱えます。

```yaml
standard_update:
  document: AIDD Control Plane MVP v0.1
  field: preview_smoke_receipt_binder
  rule: |
    Publication Evidence QA Gate通過後、preview HTML、asset、terminal evidence imageのHTTP status、byte size、content type、latency ms、checked_at、evidence pathをReceiptとして保存する。
    404、0 byte、content type mismatch、latency超過はReview Findingへ変換し、private URL、local path、Firefox未確認、receipt保存先不足、AIDD-Spec接続不足はblockedとして公開前停止にする。
```

noteで読まれる記事にするうえでも、このReceiptは重要です。AIが量産した説明文ではなく、実験した本人しか持っていないHTTP証跡、失敗ログ、修正ログがあるから、一次情報として価値が出ます。

## 次回

次は、Preview Smoke Receiptで見つかったfailure / blockedを、次の1回の修正作業へ安全に渡す **Smoke Receipt Repair Action Planner** に進むのが自然です。

「壊れたURLを見つけた」で終わらせず、execute_now、next_increment、Learning Logを分け、Codexへ渡す1回分の修正指示へ畳み込みます。
