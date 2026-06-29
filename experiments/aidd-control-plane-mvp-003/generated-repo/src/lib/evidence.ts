export type CommandKey = "lint" | "typecheck" | "test" | "build" | "e2e" | "doctor";

export type EvidenceStatus = "empty" | "partial" | "ready" | "missing_logs" | "missing_screenshots" | "offline";

export type CommandLog = {
  key: CommandKey;
  label: string;
  command: string;
  log: string;
};

export type ScreenshotEvidence = {
  id: string;
  label: string;
  kind: "ui_screenshot" | "terminal_evidence" | "report_image";
  path: string;
};

export type ReportLink = {
  id: string;
  label: string;
  url: string;
};

export type VerificationEvidence = {
  id: string;
  task_id: "aidd-control-plane-mvp-003";
  overall_status: EvidenceStatus;
  readiness_score: number;
  command_logs: CommandLog[];
  screenshots: ScreenshotEvidence[];
  reports: ReportLink[];
  missing_evidence: string[];
  warnings: string[];
  offline_note: string;
};

export type EvidenceForm = {
  commandLogs: Record<CommandKey, string>;
  screenshots: ScreenshotEvidence[];
  reports: {
    ciRunUrl: string;
    playwrightReport: string;
    coverageReport: string;
  };
};

export const commandDefinitions: Array<Omit<CommandLog, "log">> = [
  { key: "lint", label: "lint", command: "pnpm run lint" },
  { key: "typecheck", label: "typecheck", command: "pnpm run typecheck" },
  { key: "test", label: "test", command: "pnpm run test" },
  { key: "build", label: "build", command: "pnpm run build" },
  { key: "e2e", label: "e2e", command: "pnpm run test:e2e" },
  { key: "doctor", label: "doctor", command: "pnpm run doctor:aidd" }
];

export const emptyEvidenceForm: EvidenceForm = {
  commandLogs: {
    lint: "",
    typecheck: "",
    test: "",
    build: "",
    e2e: "",
    doctor: ""
  },
  screenshots: [
    { id: "ui-ready", label: "ready画面スクリーンショット", kind: "ui_screenshot", path: "" },
    { id: "terminal-log", label: "terminal evidence画像", kind: "terminal_evidence", path: "" }
  ],
  reports: {
    ciRunUrl: "",
    playwrightReport: "",
    coverageReport: ""
  }
};

export const sampleEvidenceForm: EvidenceForm = {
  commandLogs: {
    lint: "pnpm run lint\nESLint: 問題なし",
    typecheck: "pnpm run typecheck\nTypeScript: エラーなし",
    test: "pnpm run test\nVitest: evidence readiness logic 4件成功",
    build: "pnpm run build\nNext.js production build 成功",
    e2e: "pnpm run test:e2e\nChromium: sample ready / missing_logs / missing_screenshots 成功",
    doctor: "pnpm run doctor:aidd\ndoctor:aidd passed"
  },
  screenshots: [
    {
      id: "ui-ready",
      label: "ready画面スクリーンショット",
      kind: "ui_screenshot",
      path: "assets/evidence-collector-ready.png"
    },
    {
      id: "terminal-log",
      label: "terminal evidence画像",
      kind: "terminal_evidence",
      path: "assets/terminal-required-commands.png"
    },
    {
      id: "report-image",
      label: "report画像",
      kind: "report_image",
      path: "assets/playwright-report-summary.png"
    }
  ],
  reports: {
    ciRunUrl: "https://example.invalid/actions/runs/aidd-control-plane-mvp-003",
    playwrightReport: "playwright-report/index.html",
    coverageReport: "coverage/index.html"
  }
};

function hasValue(value: string): boolean {
  return value.trim().length > 0;
}

function commandMissingLabel(key: CommandKey): string {
  const definition = commandDefinitions.find((item) => item.key === key);
  return `${definition?.command ?? key} のCommand Log Collector入力`;
}

export function createMissingLogsEvidenceForm(): EvidenceForm {
  return {
    ...sampleEvidenceForm,
    commandLogs: {
      ...sampleEvidenceForm.commandLogs,
      lint: "",
      typecheck: ""
    }
  };
}

export function createMissingScreenshotsEvidenceForm(): EvidenceForm {
  return {
    ...sampleEvidenceForm,
    screenshots: sampleEvidenceForm.screenshots.map((item) => ({ ...item, path: "" }))
  };
}

export function evaluateEvidence(form: EvidenceForm): VerificationEvidence {
  const missingLogs = commandDefinitions
    .map((definition) => definition.key)
    .filter((key) => !hasValue(form.commandLogs[key]))
    .map(commandMissingLabel);
  const missingScreenshots = form.screenshots
    .filter((item) => !hasValue(item.path))
    .map((item) => `${item.label} のScreenshot Evidence Collector入力`);
  const reportMissing = [
    ["CI run URL", form.reports.ciRunUrl],
    ["Playwright report", form.reports.playwrightReport],
    ["coverage report", form.reports.coverageReport]
  ]
    .filter(([, value]) => !hasValue(value))
    .map(([label]) => `${label} はwarningです。CI and Report Linksに入力してください。`);

  const missingEvidence = [...missingLogs, ...missingScreenshots];
  const requiredTotal = commandDefinitions.length + form.screenshots.length;
  const readyRequired = requiredTotal - missingEvidence.length;
  const readinessScore = requiredTotal === 0 ? 0 : Math.round((readyRequired / requiredTotal) * 100);
  const overallStatus: EvidenceStatus =
    missingLogs.length > 0
      ? "missing_logs"
      : missingScreenshots.length > 0
        ? "missing_screenshots"
        : readinessScore === 100
          ? "ready"
          : readinessScore === 0
            ? "empty"
            : "partial";

  return {
    id: "verification-evidence-aidd-control-plane-mvp-003",
    task_id: "aidd-control-plane-mvp-003",
    overall_status: overallStatus,
    readiness_score: readinessScore,
    command_logs: commandDefinitions.map((definition) => ({
      ...definition,
      log: form.commandLogs[definition.key]
    })),
    screenshots: form.screenshots,
    reports: [
      { id: "ci-run", label: "CI run URL", url: form.reports.ciRunUrl },
      { id: "playwright-report", label: "Playwright report", url: form.reports.playwrightReport },
      { id: "coverage-report", label: "coverage report", url: form.reports.coverageReport }
    ],
    missing_evidence: missingEvidence,
    warnings: reportMissing.length > 0 ? reportMissing : ["CI and Report Linksは入力済みです。"],
    offline_note: "外部API未接続。通信やブラウザ保存を使わず、画面内stateだけでPreview JSONを作成します。"
  };
}

export function statusLabel(status: EvidenceStatus): string {
  const labels: Record<EvidenceStatus, string> = {
    empty: "empty",
    partial: "partial",
    ready: "ready",
    missing_logs: "missing_logs",
    missing_screenshots: "missing_screenshots",
    offline: "offline"
  };
  return labels[status];
}
