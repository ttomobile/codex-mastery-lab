import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Check = {
  name: string;
  ok: boolean;
  detail: string;
};

const root = process.cwd();
const artifactDir = join(root, "artifacts", "terminal");
mkdirSync(artifactDir, { recursive: true });

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function hasAll(source: string, values: string[]) {
  return values.every((value) => source.includes(value));
}

const packageJson = JSON.parse(read("package.json")) as { scripts: Record<string, string> };
const page = read("app/page.tsx");
const ledger = read("src/ledger.ts");
const playwright = read("playwright.config.ts");
const e2e = read("e2e/ledger.spec.ts");
const tests = read("tests/ledger.test.ts");

const expectedScripts = [
  "lint",
  "typecheck",
  "test",
  "build",
  "test:e2e",
  "doctor:aidd",
  "capture:mvp074"
];

const expectedScreenshots = [
  "aidd-control-plane-mvp074-empty.png",
  "aidd-control-plane-mvp074-waiting.png",
  "aidd-control-plane-mvp074-running.png",
  "aidd-control-plane-mvp074-succeeded.png",
  "aidd-control-plane-mvp074-failed.png",
  "aidd-control-plane-mvp074-evidence-missing.png",
  "aidd-control-plane-mvp074-terminal-evidence.png"
].flatMap((filename) => [`artifacts/screenshots/${filename}`, `assets/${filename}`]);

const checks: Check[] = [
  {
    name: "必須pnpm script",
    ok: expectedScripts.every((script) => Boolean(packageJson.scripts[script])),
    detail: expectedScripts.join(", ")
  },
  {
    name: "query param state切り替え",
    ok: hasAll(page, ["searchParams", "normalizeState", "?state=", "empty", "waiting", "running"]),
    detail: "empty / waiting / running / succeeded / failed / evidence_missing をURLで切り替える"
  },
  {
    name: "waiting表示項目",
    ok: hasAll(page, [
      "source intake id",
      "queue item id",
      "Codex command",
      "sandbox",
      "required verification commands",
      "Chromium / Firefox / WebKit",
      "rollback plan",
      "AIDD-Spec接続"
    ]),
    detail: "Run Queue実行待ちの必須項目を確認"
  },
  {
    name: "running表示項目",
    ok: hasAll(page, [
      "started at",
      "operator",
      "current step",
      "duration",
      "evidence root",
      "browser console collection status"
    ]),
    detail: "実行中の進捗と証跡保存先を確認"
  },
  {
    name: "succeeded表示項目",
    ok: hasAll(page, [
      "actual results",
      "command別exit code",
      "3ブラウザcoverage",
      "terminal evidence",
      "screenshot evidence",
      "Playwright report",
      "Review Record output",
      "Learning Log output"
    ]),
    detail: "成功時の結果と出力先を確認"
  },
  {
    name: "failed Review Finding",
    ok: hasAll(ledger, [
      "command失敗",
      "Firefox未実行",
      "doctor:aidd失敗",
      "危険command",
      "rollback不足",
      "console error/warn",
      "local path/private network URL混入"
    ]),
    detail: "失敗分類7種を確認"
  },
  {
    name: "evidence_missing検出",
    ok: hasAll(ledger, [
      "terminal evidence不足",
      "failure screenshot不足",
      "browser console log不足",
      "Playwright report不足",
      "掲載用GIF不足"
    ]),
    detail: "証跡不足5種を確認"
  },
  {
    name: "AIDD-Spec接続",
    ok: hasAll(ledger, [
      "AIDD-Spec v0.1",
      "Control Plane標準",
      "Verification Evidence",
      "Review Record",
      "Learning Log"
    ]),
    detail: "標準語彙との接続を確認"
  },
  {
    name: "unit test日本語",
    ok: hasAll(tests, [
      "waitingでは投入元",
      "runningでは開始時刻",
      "succeededでは結果",
      "failedではReview Finding",
      "evidence_missingでは5種類"
    ]),
    detail: "状態別の日本語テスト名を確認"
  },
  {
    name: "E2E日本語",
    ok: hasAll(e2e, [
      "emptyでは追跡中",
      "waitingでは実行待ち",
      "runningでは実行中",
      "succeededでは成功結果",
      "failedではReview Finding",
      "evidence_missingでは不足証跡"
    ]),
    detail: "画面状態を日本語テスト名で確認"
  },
  {
    name: "Playwright 3ブラウザ",
    ok: hasAll(playwright, ["chromium", "firefox", "webkit"]),
    detail: "Chromium / Firefox / WebKit projectを確認"
  },
  {
    name: "capture画像",
    ok: expectedScreenshots.every((path) => existsSync(join(root, path))),
    detail: expectedScreenshots.join(", ")
  },
  {
    name: "terminal evidence",
    ok: existsSync(join(root, "artifacts", "terminal", "doctor-aidd-run.txt")),
    detail: "doctor:aiddの実行ログを保存"
  }
];

const lines = [
  "AIDD Control Plane MVP074 doctor",
  "root: generated-repo",
  "",
  ...checks.map((check) => `${check.ok ? "OK" : "NG"} ${check.name}: ${check.detail}`)
];

writeFileSync(join(artifactDir, "doctor-aidd.txt"), `${lines.join("\n")}\n`);
console.log(lines.join("\n"));

const hardFailures = checks.filter(
  (check) => !check.ok && !["capture画像", "terminal evidence"].includes(check.name)
);

if (hardFailures.length > 0) {
  process.exit(1);
}
