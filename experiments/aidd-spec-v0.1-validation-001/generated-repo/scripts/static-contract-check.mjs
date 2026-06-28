import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, "index.html"), "utf8");
const css = readFileSync(join(root, "styles.css"), "utf8");
const js = readFileSync(join(root, "app.js"), "utf8");
const all = `${html}\n${css}\n${js}`;
const failures = [];

function assertContract(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function has(pattern) {
  return pattern.test(all);
}

function htmlHas(pattern) {
  return pattern.test(html);
}

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "package.json",
  "docs/product-brief.md",
  "docs/review-record.md",
  "docs/learning-log.md"
];

for (const file of requiredFiles) {
  try {
    readFileSync(join(root, file), "utf8");
  } catch {
    failures.push(`${file} がありません。`);
  }
}

assertContract(htmlHas(/<html[^>]+lang="ja"/), "HTML lang=\"ja\" が必要です。");
assertContract(htmlHas(/<form[^>]+id="task-form"[^>]+novalidate/), "reloadを避けるnovalidate付きformが必要です。");
assertContract(htmlHas(/aria-live="polite"/), "状態メッセージに aria-live=\"polite\" が必要です。");
assertContract(htmlHas(/<ul[^>]+id="shortage-list"[\s\S]*?<li>/), "不足項目は ul/li で表示してください。");
assertContract(htmlHas(/id="offline-toggle"/), "オフライン切替ボタンが必要です。");
assertContract(htmlHas(/id="timeout-toggle"/), "タイムアウト切替ボタンが必要です。");
assertContract(htmlHas(/id="error-toggle"/), "エラー切替ボタンが必要です。");
assertContract(htmlHas(/id="analyze-button"/), "loadingを確認する解析中ボタンが必要です。");
assertContract(htmlHas(/id="packet-preview"/), "AI Task Packet風プレビューが必要です。");
assertContract(htmlHas(/API未接続/), "API未接続の説明が必要です。");
assertContract(htmlHas(/ログイン不要/), "認証失敗契約としてログイン不要の説明が必要です。");
assertContract(htmlHas(/課金機能は非ゴール/), "課金失敗契約として非ゴールの説明が必要です。");
assertContract(htmlHas(/メディア/), "media failureの扱いを説明してください。");

const controlIds = ["task-name", "user-problem", "non-goals", "verification-commands", "evidence-notes"];
for (const id of controlIds) {
  assertContract(htmlHas(new RegExp(`<label[^>]+for="${id}"`)), `${id} に対応するlabelが必要です。`);
  assertContract(htmlHas(new RegExp(`id="${id}"`)), `${id} のform controlが必要です。`);
}

assertContract(has(/addEventListener\("submit"[\s\S]*preventDefault\(\)/), "Enter送信でページ全体がreloadされない処理が必要です。");
assertContract(has(/setTimeout/), "loading状態を短時間表示する処理が必要です。");
assertContract(has(/offline/), "offline状態の実装が必要です。");
assertContract(has(/timeout/), "timeout状態の実装が必要です。");
assertContract(has(/送信準備OK/), "success状態の文言が必要です。");
assertContract(has(/空の状態/), "empty状態の文言が必要です。");
assertContract(has(/エラー状態/), "error状態の文言が必要です。");
assertContract(has(/focus\(\)/), "エラー時にエラー概要へfocusできる処理が必要です。");
assertContract(has(/prefers-reduced-motion/), "prefers-reduced-motion対応が必要です。");
assertContract(has(/min-height:\s*44px/), "主要操作の44px以上タッチターゲットが必要です。");
assertContract(has(/@media \(max-width:\s*820px\)/), "モバイル表示への対応が必要です。");
assertContract(!has(/\bfetch\s*\(/), "外部通信につながるfetchは使わないでください。");
assertContract(!has(/\bXMLHttpRequest\b/), "外部通信につながるXMLHttpRequestは使わないでください。");
assertContract(!has(/\bWebSocket\b/), "外部通信につながるWebSocketは使わないでください。");
assertContract(!has(/https?:\/\//), "外部URLを含めないでください。");
assertContract(!has(/<script[^>]+src=["']https?:\/\//), "外部scriptを読み込まないでください。");
assertContract(!has(/<link[^>]+href=["']https?:\/\//), "外部stylesheetを読み込まないでください。");

if (failures.length > 0) {
  console.error("Static contract check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

if (process.argv.includes("--lint")) {
  console.log("lint:static passed: 静的ファイルと外部通信禁止ルールを確認しました。");
} else {
  console.log("test:contract passed: AIDD-Spec L2 Liteの必須契約を確認しました。");
}
