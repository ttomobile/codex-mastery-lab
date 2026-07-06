import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const checks = [
  "README.md",
  "app/page.tsx",
  "src/lib/packet-reduction.ts",
  "tests/packet-reduction.test.ts",
  "e2e/packet-reduction.spec.ts",
  "scripts/capture-mvp053.mjs",
  "playwright.config.ts",
  "docs/product-brief.md",
  "docs/verification-plan.md"
];

const missing = checks.filter((file) => !existsSync(path.join(root, file)));
const contents = await Promise.all(checks.filter((file) => existsSync(path.join(root, file))).map((file) => readFile(path.join(root, file), "utf8")));
const allText = contents.join("\n");

const requiredText = [
  "AIDD Control Plane MVP053",
  "STOP/BRAKE時にAI Task Packetを自動縮小する提案",
  "MVP052",
  "ready",
  "brake",
  "stop",
  "縮小後AI Task Packet提案",
  "keep_now",
  "defer_next_increment",
  "minimum_verification",
  "fallback_action",
  "resume_condition",
  "evidence_paths",
  "prompt_preview",
  "公開前ブロック",
  "local path",
  "private host",
  "WORKSPACE",
  "HOME",
  "sanitizeForPublic",
  "chromium",
  "firefox",
  "webkit",
  "timeout: 120_000",
  "expect: { timeout: 90_000 }",
  "workers: 1",
  "aidd-control-plane-mvp053-ready.png",
  "aidd-control-plane-mvp053-brake.png",
  "aidd-control-plane-mvp053-stop.png",
  "aidd-control-plane-mvp053-terminal-evidence.png"
];

const missingText = requiredText.filter((text) => !allText.includes(text));

if (missing.length > 0 || missingText.length > 0) {
  console.error("doctor:aidd failed");
  for (const file of missing) console.error(`missing file: ${file}`);
  for (const text of missingText) console.error(`missing text: ${text}`);
  process.exit(1);
}

console.log("doctor:aidd passed");
console.log("MVP053 token、STOP/BRAKE縮小提案、minimum_verification、resume_condition、3ブラウザ設定、capture画像名を確認しました。");
