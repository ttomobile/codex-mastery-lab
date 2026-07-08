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

const expectedScripts = [
  "lint",
  "typecheck",
  "test",
  "build",
  "test:e2e",
  "doctor:aidd",
  "capture:mvp071"
];

const expectedScreenshots = [
  "artifacts/screenshots/aidd-control-plane-mvp071-initial.png",
  "artifacts/screenshots/aidd-control-plane-mvp071-approved.png",
  "artifacts/screenshots/aidd-control-plane-mvp071-blocked.png",
  "artifacts/screenshots/aidd-control-plane-mvp071-terminal-evidence.png"
];

const checks: Check[] = [
  {
    name: "必須pnpm script",
    ok: expectedScripts.every((script) => Boolean(packageJson.scripts[script])),
    detail: expectedScripts.join(", ")
  },
  {
    name: "日本語UI",
    ok: hasAll(page, ["判断材料がありません", "Learning Log返却", "blocked検出"]),
    detail: "empty / held / blocked の日本語表示を確認"
  },
  {
    name: "approved表示項目",
    ok: hasAll(page, [
      "source handoff receipt",
      "decision owner",
      "decision reason",
      "approved execute_now",
      "Codex command draft",
      "verification commands",
      "required evidence",
      "rollback condition",
      "AIDD-Spec接続"
    ]),
    detail: "approvedで必要なReview Record項目を確認"
  },
  {
    name: "blocked検出ロジック",
    ok: hasAll(ledger, [
      "未承認",
      "理由不足",
      "3ブラウザ不足",
      "evidence不足",
      "local path混入",
      "private host混入",
      "private network URL混入"
    ]),
    detail: "停止理由と公開前サニタイズ違反を確認"
  },
  {
    name: "execute_now限定draft",
    ok: hasAll(ledger, ["buildCodexCommandDraft", "receipt.executeNow"]) && !buildHasDefer(),
    detail: "deferやheld理由をdraft生成に混ぜない"
  },
  {
    name: "Playwright 3ブラウザ",
    ok: hasAll(playwright, ["chromium", "firefox", "webkit"]),
    detail: "Chromium / Firefox / WebKit projectを確認"
  },
  {
    name: "日本語E2E",
    ok: hasAll(e2e, ["approved execute_now", "Learning Log返却", "公開前サニタイズ違反"]),
    detail: "テスト名と期待値が日本語文脈"
  },
  {
    name: "AIDD-Spec接続",
    ok: hasAll(ledger, [
      "AI Task Packet",
      "Handoff Receipt",
      "Verification Evidence",
      "Review Record",
      "Learning Log"
    ]),
    detail: "標準語彙との接続を確認"
  },
  {
    name: "capture画像",
    ok: expectedScreenshots.every((path) => existsSync(join(root, path))),
    detail: expectedScreenshots.join(", ")
  },
  {
    name: "terminal evidence",
    ok: existsSync(join(root, "artifacts", "terminal", "doctor-aidd.txt")),
    detail: "doctor自身の実行ログを保存"
  }
];

function buildHasDefer() {
  const start = ledger.indexOf("export function buildCodexCommandDraft");
  const end = ledger.indexOf("export function detectBlockedFindings");
  const body = ledger.slice(start, end);
  return body.includes("defer") || body.includes("holdReason") || body.includes("learningLogReturn");
}

const lines = [
  "AIDD Control Plane MVP071 doctor",
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
