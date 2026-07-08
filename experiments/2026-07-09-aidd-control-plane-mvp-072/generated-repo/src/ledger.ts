export type QueueMode = "empty" | "queued" | "blocked" | "exported";

export type SmokeFindingAction = {
  brokenUrl: string;
  httpStatus: number;
  byteSize: number;
  contentType: string;
  findingCategory: string;
  severity: "critical" | "high" | "medium" | "low";
  lane: string;
  priorityReason: string;
  aiTaskPacketPatch: string[];
  codexPromptPatch: {
    executeNow: string[];
    context: string[];
    defer: string[];
  };
  verificationCommands: string[];
  requiredEvidence: string[];
  rollbackCondition: string;
  aiddSpecConnections: string[];
  evidence: {
    urls: string[];
    browsers: string[];
    terminalFiles: string[];
  };
};

export type BlockedFinding = {
  key: string;
  label: string;
  detail: string;
};

export type QueueViewModel = {
  mode: QueueMode;
  action: SmokeFindingAction | null;
  blockedFindings: BlockedFinding[];
  codexPromptPreview: string;
};

export const queuedAction: SmokeFindingAction = {
  brokenUrl: "https://preview.example.invalid/articles/mvp072/smoke-finding-action-queue",
  httpStatus: 404,
  byteSize: 1832,
  contentType: "text/html; charset=utf-8",
  findingCategory: "smoke-link-regression",
  severity: "high",
  lane: "publish-readiness",
  priorityReason:
    "公開直前のpreview導線で404が出ており、記事証跡とCIログの信頼性を同時に下げるため最優先で処理する。",
  aiTaskPacketPatch: [
    "Smoke Finding Action Queueでbroken URLを1件の実行単位に束ねる",
    "required evidenceへ3ブラウザE2Eとterminal evidenceを明記する",
    "rollback conditionへ公開停止条件を追加する"
  ],
  codexPromptPatch: {
    executeNow: [
      "broken URLの参照元と生成元を特定する",
      "previewリンク生成を修正し、404が消えたことを3ブラウザで確認する",
      "terminal evidenceとスクリーンショットをartifactsへ保存する"
    ],
    context: [
      "finding category: smoke-link-regression",
      "lane: publish-readiness",
      "severity: high"
    ],
    defer: ["外部監視SaaS連携", "本番ドメインへの自動投稿", "恒久キューDBの導入"]
  },
  verificationCommands: [
    "pnpm run lint",
    "pnpm run typecheck",
    "pnpm run test",
    "pnpm run build",
    "pnpm run test:e2e",
    "pnpm run doctor:aidd",
    "pnpm run capture:mvp072"
  ],
  requiredEvidence: [
    "artifacts/terminal/lint.txt",
    "artifacts/terminal/typecheck.txt",
    "artifacts/terminal/test.txt",
    "artifacts/terminal/build.txt",
    "artifacts/terminal/test-e2e.txt",
    "artifacts/terminal/doctor-aidd.txt",
    "artifacts/screenshots/aidd-control-plane-mvp072-queued.png",
    "assets/aidd-control-plane-mvp072-queued.png"
  ],
  rollbackCondition:
    "broken URLが残る、Firefox確認が欠ける、terminal evidenceが不足する、またはexecute_now以外がCodex prompt previewへ混入した場合はexportしない。",
  aiddSpecConnections: [
    "AI Task Packet",
    "Codex Prompt",
    "Verification Evidence",
    "Review Record",
    "Learning Log"
  ],
  evidence: {
    urls: ["https://preview.example.invalid/articles/mvp072/smoke-finding-action-queue"],
    browsers: ["chromium", "firefox", "webkit"],
    terminalFiles: [
      "lint.txt",
      "typecheck.txt",
      "test.txt",
      "build.txt",
      "test-e2e.txt",
      "doctor-aidd.txt"
    ]
  }
};

export const exportedAction: SmokeFindingAction = {
  ...queuedAction
};

const localOnlyUrlSample = ["http://", "local", "host", ":3071/private-smoke"].join("");
const privateNetworkUrlSample = ["http://", "192", ".168", ".1", ".10:4000/private-smoke"].join("");

export const blockedAction: SmokeFindingAction = {
  ...queuedAction,
  brokenUrl: localOnlyUrlSample,
  aiddSpecConnections: ["Codex Prompt", "Review Record"],
  evidence: {
    urls: [
      localOnlyUrlSample,
      privateNetworkUrlSample,
      "https://preview.example.invalid/articles/mvp072/smoke-finding-action-queue"
    ],
    browsers: ["chromium", "webkit"],
    terminalFiles: ["lint.txt", "test-e2e.txt"]
  },
  codexPromptPatch: {
    ...queuedAction.codexPromptPatch,
    context: [
      ...queuedAction.codexPromptPatch.context,
      "execute_now以外の補足文がpreviewへ混入しているサンプル"
    ]
  }
};

const privateUrlPattern =
  /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|private\.internal|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})/i;

const requiredTerminalEvidence = [
  "lint.txt",
  "typecheck.txt",
  "test.txt",
  "build.txt",
  "test-e2e.txt",
  "doctor-aidd.txt"
];

const requiredSpecConnections = [
  "AI Task Packet",
  "Codex Prompt",
  "Verification Evidence",
  "Review Record"
];

export function buildCodexPromptPreview(action: SmokeFindingAction): string {
  return action.codexPromptPatch.executeNow
    .map((command, index) => `execute_now ${index + 1}: ${command}`)
    .join("\n");
}

export function buildLeakyPromptPreview(action: SmokeFindingAction): string {
  return [
    buildCodexPromptPreview(action),
    ...action.codexPromptPatch.context.map((item) => `context: ${item}`),
    ...action.codexPromptPatch.defer.map((item) => `defer: ${item}`)
  ].join("\n");
}

export function detectBlockedFindings(
  action: SmokeFindingAction,
  promptPreview = buildCodexPromptPreview(action)
): BlockedFinding[] {
  const findings: BlockedFinding[] = [];

  if (action.evidence.urls.some((url) => privateUrlPattern.test(url))) {
    findings.push({
      key: "private-url",
      label: "private URL混入",
      detail: "公開前promptまたは証跡URLにlocalhost/private networkが含まれている。"
    });
  }

  if (!action.evidence.browsers.includes("firefox")) {
    findings.push({
      key: "missing-firefox",
      label: "Firefox未確認",
      detail: "3ブラウザ確認のうちFirefox evidenceが欠けている。"
    });
  }

  const missingTerminal = requiredTerminalEvidence.filter(
    (file) => !action.evidence.terminalFiles.includes(file)
  );
  if (missingTerminal.length > 0) {
    findings.push({
      key: "missing-terminal-evidence",
      label: "terminal evidence不足",
      detail: `不足: ${missingTerminal.join(", ")}`
    });
  }

  const missingSpec = requiredSpecConnections.filter(
    (connection) => !action.aiddSpecConnections.includes(connection)
  );
  if (missingSpec.length > 0) {
    findings.push({
      key: "missing-aidd-spec",
      label: "AIDD-Spec接続不足",
      detail: `不足: ${missingSpec.join(", ")}`
    });
  }

  const allowedPreview = buildCodexPromptPreview(action);
  if (promptPreview.trim() !== allowedPreview.trim()) {
    findings.push({
      key: "prompt-leak",
      label: "execute_now以外のprompt混入",
      detail: "Codex prompt previewはexecute_nowだけに限定する必要がある。"
    });
  }

  return findings;
}

export function getQueueViewModel(mode: QueueMode): QueueViewModel {
  if (mode === "empty") {
    return { mode, action: null, blockedFindings: [], codexPromptPreview: "" };
  }

  if (mode === "blocked") {
    const leakyPreview = buildLeakyPromptPreview(blockedAction);
    return {
      mode,
      action: blockedAction,
      blockedFindings: detectBlockedFindings(blockedAction, leakyPreview),
      codexPromptPreview: leakyPreview
    };
  }

  const action = mode === "exported" ? exportedAction : queuedAction;

  return {
    mode,
    action,
    blockedFindings: [],
    codexPromptPreview: mode === "exported" ? buildCodexPromptPreview(action) : ""
  };
}
