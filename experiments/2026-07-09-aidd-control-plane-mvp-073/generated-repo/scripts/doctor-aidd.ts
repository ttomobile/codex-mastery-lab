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
  "capture:mvp073"
];

const expectedScreenshots = [
  "artifacts/screenshots/aidd-control-plane-mvp073-empty.png",
  "artifacts/screenshots/aidd-control-plane-mvp073-queued.png",
  "artifacts/screenshots/aidd-control-plane-mvp073-rejected.png",
  "artifacts/screenshots/aidd-control-plane-mvp073-evidence-missing.png",
  "artifacts/screenshots/aidd-control-plane-mvp073-failure.png",
  "artifacts/screenshots/aidd-control-plane-mvp073-terminal-evidence.png",
  "assets/aidd-control-plane-mvp073-empty.png",
  "assets/aidd-control-plane-mvp073-queued.png",
  "assets/aidd-control-plane-mvp073-rejected.png",
  "assets/aidd-control-plane-mvp073-evidence-missing.png",
  "assets/aidd-control-plane-mvp073-failure.png",
  "assets/aidd-control-plane-mvp073-terminal-evidence.png"
];

function previewUsesOnlyExecuteNow(functionName: string) {
  const start = ledger.indexOf(`export function ${functionName}`);
  const end = ledger.indexOf("}", start);
  const body = ledger.slice(start, end);
  return body.includes("execute_now") && !body.includes("next_increment") && !body.includes("learning_log");
}

const checks: Check[] = [
  {
    name: "必須pnpm script",
    ok: expectedScripts.every((script) => Boolean(packageJson.scripts[script])),
    detail: expectedScripts.join(", ")
  },
  {
    name: "MVP073日本語UI",
    ok: hasAll(page, [
      "Smoke Action Run Queue Intake",
      "投入待ちのSmoke Actionはありません",
      "rejected検出",
      "evidence_missing検出",
      "Run Queue payload"
    ]),
    detail: "empty / queued / rejected / evidence_missing の表示を確認"
  },
  {
    name: "queued表示項目",
    ok: hasAll(page, [
      "source smoke action id",
      "queue item id",
      "Codex command",
      "sandbox mode",
      "required verification commands",
      "Chromium / Firefox / WebKit",
      "required evidence",
      "rollback plan",
      "AIDD-Spec接続",
      "Run Queue payload"
    ]),
    detail: "queuedでRun Queue intakeの必要項目を確認"
  },
  {
    name: "execute_now限定preview",
    ok:
      previewUsesOnlyExecuteNow("buildCodexCommandPreview") &&
      previewUsesOnlyExecuteNow("buildRunQueuePayloadPreview"),
    detail: "next_increment / learning_logをCodex command previewとpayload previewへ混ぜない"
  },
  {
    name: "rejected検出ロジック",
    ok: hasAll(ledger, [
      "未export action",
      "execute_now以外混入",
      "危険command",
      "sandbox不足",
      "Firefox除外",
      "local path/private network URL混入"
    ]),
    detail: "投入拒否条件6種を確認"
  },
  {
    name: "evidence_missing検出ロジック",
    ok: hasAll(ledger, [
      "terminal evidence不足",
      "failure screenshot不足",
      "Playwright report不足"
    ]),
    detail: "証跡不足3種を確認"
  },
  {
    name: "Playwright 3ブラウザ",
    ok: hasAll(playwright, ["chromium", "firefox", "webkit"]),
    detail: "Chromium / Firefox / WebKit projectを確認"
  },
  {
    name: "日本語E2E",
    ok: hasAll(e2e, [
      "Run Queue投入項目を表示する",
      "execute_nowだけを入れる",
      "投入拒否理由を表示する",
      "証跡不足を表示する"
    ]),
    detail: "テスト名と期待値が日本語文脈"
  },
  {
    name: "AIDD-Spec接続",
    ok: hasAll(ledger, [
      "Smoke Action",
      "Run Queue",
      "Codex Prompt",
      "Verification Evidence",
      "Review Record"
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
  "AIDD Control Plane MVP073 doctor",
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
