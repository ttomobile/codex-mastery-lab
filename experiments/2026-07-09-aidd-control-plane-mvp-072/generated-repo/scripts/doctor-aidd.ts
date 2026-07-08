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
  "capture:mvp072"
];

const expectedScreenshots = [
  "artifacts/screenshots/aidd-control-plane-mvp072-empty.png",
  "artifacts/screenshots/aidd-control-plane-mvp072-queued.png",
  "artifacts/screenshots/aidd-control-plane-mvp072-blocked.png",
  "artifacts/screenshots/aidd-control-plane-mvp072-exported.png",
  "artifacts/screenshots/aidd-control-plane-mvp072-terminal-evidence.png",
  "assets/aidd-control-plane-mvp072-empty.png",
  "assets/aidd-control-plane-mvp072-queued.png",
  "assets/aidd-control-plane-mvp072-blocked.png",
  "assets/aidd-control-plane-mvp072-exported.png",
  "assets/aidd-control-plane-mvp072-terminal-evidence.png"
];

function previewUsesOnlyExecuteNow() {
  const start = ledger.indexOf("export function buildCodexPromptPreview");
  const end = ledger.indexOf("export function buildLeakyPromptPreview");
  const body = ledger.slice(start, end);
  return body.includes("codexPromptPatch.executeNow") && !body.includes(".context") && !body.includes(".defer");
}

const checks: Check[] = [
  {
    name: "必須pnpm script",
    ok: expectedScripts.every((script) => Boolean(packageJson.scripts[script])),
    detail: expectedScripts.join(", ")
  },
  {
    name: "MVP072日本語UI",
    ok: hasAll(page, [
      "Smoke Findingはありません",
      "AI Task Packet patch",
      "Codex prompt patch",
      "blocked検出",
      "Codex prompt preview"
    ]),
    detail: "empty / queued / blocked / exported の表示を確認"
  },
  {
    name: "queued表示項目",
    ok: hasAll(page, [
      "broken URL",
      "HTTP status",
      "byte size",
      "content type",
      "finding category",
      "severity",
      "lane",
      "priority reason",
      "verification commands",
      "required evidence",
      "rollback condition",
      "AIDD-Spec接続"
    ]),
    detail: "queuedでSmoke Finding Action Queueの必要項目を確認"
  },
  {
    name: "blocked検出ロジック",
    ok: hasAll(ledger, [
      "private URL混入",
      "Firefox未確認",
      "terminal evidence不足",
      "AIDD-Spec接続不足",
      "execute_now以外のprompt混入"
    ]),
    detail: "停止条件5種を確認"
  },
  {
    name: "exported execute_now限定preview",
    ok: previewUsesOnlyExecuteNow(),
    detail: "context/deferをCodex prompt previewへ混ぜない"
  },
  {
    name: "Playwright 3ブラウザ",
    ok: hasAll(playwright, ["chromium", "firefox", "webkit"]),
    detail: "Chromium / Firefox / WebKit projectを確認"
  },
  {
    name: "日本語E2E",
    ok: hasAll(e2e, [
      "finding詳細とpatchを表示する",
      "execute_nowだけをCodex prompt previewへ入れる",
      "Action Queueの停止条件を表示する"
    ]),
    detail: "テスト名と期待値が日本語文脈"
  },
  {
    name: "AIDD-Spec接続",
    ok: hasAll(ledger, [
      "AI Task Packet",
      "Codex Prompt",
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

const lines = [
  "AIDD Control Plane MVP072 doctor",
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
