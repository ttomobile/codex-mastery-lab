import { readFile } from "node:fs/promises";

const checks = [
  {
    file: "docs/ACCEPTANCE_CRITERIA.md",
    labels: ["AC-001", "AC-002", "AC-003", "証拠コマンド"]
  },
  {
    file: "docs/VERIFICATION_EVIDENCE.md",
    labels: ["品質ゲート", "ログ保存先", "スクリーンショット/GIF保存先", "残リスク"]
  },
  {
    file: "tests/e2e/daily-checklist.spec.ts",
    labels: ["AC-001", "AC-002", "AC-003"]
  }
];

let failed = false;

for (const check of checks) {
  let source = "";

  try {
    source = await readFile(check.file, "utf8");
  } catch {
    console.error(`NG ${check.file}: ファイルが見つかりません。`);
    failed = true;
    continue;
  }

  const missingLabels = check.labels.filter((label) => !source.includes(label));
  if (missingLabels.length > 0) {
    console.error(`NG ${check.file}: ${missingLabels.join(", ")} が見つかりません。`);
    failed = true;
    continue;
  }

  console.log(`OK ${check.file}`);
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("OK Verification Evidence Lite の最低限の証跡が揃っています。");
}
