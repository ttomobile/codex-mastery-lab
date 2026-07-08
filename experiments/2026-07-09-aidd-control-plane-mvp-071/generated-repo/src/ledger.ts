export type LedgerMode = "empty" | "approved" | "held" | "blocked";

export type HandoffReceipt = {
  sourceHandoffReceipt: string;
  decisionOwner: string;
  decisionReason: string;
  approvalState: "approved" | "unapproved";
  executeNow: string[];
  defer: string[];
  holdReason?: string;
  learningLogReturn?: string;
  verificationCommands: string[];
  requiredEvidence: string[];
  browserEvidence: string[];
  rollbackCondition: string;
  aiddSpecConnections: string[];
  evidenceText: string;
};

export type BlockedFinding = {
  key: string;
  label: string;
  detail: string;
};

export type LedgerViewModel = {
  mode: LedgerMode;
  receipt: HandoffReceipt | null;
  blockedFindings: BlockedFinding[];
  codexCommandDraft: string;
};

export const approvedReceipt: HandoffReceipt = {
  sourceHandoffReceipt: "MVP070 Shrunk Packet Handoff Receipt #070-20260709",
  decisionOwner: "AIDD reviewer / Control Plane operator",
  decisionReason:
    "handoff receipt、検証コマンド、必要証跡、rollback condition が揃い、次回Codex実行の範囲が限定されているため。",
  approvalState: "approved",
  executeNow: [
    "generated-repo の Handoff Decision Ledger UI を確認する",
    "pnpm run lint && pnpm run typecheck && pnpm run test を実行する",
    "pnpm run build && pnpm run test:e2e && pnpm run doctor:aidd を実行する"
  ],
  defer: [
    "外部GitHub API連携",
    "本番用の永続キュー",
    "実サービス名を使った画面コピー"
  ],
  verificationCommands: [
    "pnpm run lint",
    "pnpm run typecheck",
    "pnpm run test",
    "pnpm run build",
    "pnpm run test:e2e",
    "pnpm run doctor:aidd",
    "pnpm run capture:mvp071"
  ],
  requiredEvidence: [
    "artifacts/terminal/*.txt",
    "artifacts/screenshots/aidd-control-plane-mvp071-initial.png",
    "artifacts/screenshots/aidd-control-plane-mvp071-approved.png",
    "artifacts/screenshots/aidd-control-plane-mvp071-blocked.png",
    "artifacts/screenshots/aidd-control-plane-mvp071-terminal-evidence.png"
  ],
  browserEvidence: ["chromium", "firefox", "webkit"],
  rollbackCondition:
    "3ブラウザE2E、doctor:aidd、または公開前サニタイズ検査が失敗した場合は approved にせず Learning Log へ戻す。",
  aiddSpecConnections: [
    "AI Task Packet",
    "Handoff Receipt",
    "Verification Evidence",
    "Review Record",
    "Learning Log"
  ],
  evidenceText:
    "terminal evidence: lint/typecheck/test/build/test:e2e/doctor/capture completed without local path or private host leakage."
};

export const heldReceipt: HandoffReceipt = {
  ...approvedReceipt,
  approvalState: "unapproved",
  decisionReason: "",
  executeNow: [],
  holdReason: "検証順序と証跡粒度をLearning Logへ返して再確認する必要がある。",
  learningLogReturn:
    "保留理由、追加で必要なverification evidence、再開条件をLearning Logに返却する。"
};

export const blockedReceipt: HandoffReceipt = {
  ...approvedReceipt,
  approvalState: "unapproved",
  decisionReason: "",
  executeNow: ["blocked状態では実行しない"],
  verificationCommands: ["pnpm run lint", "pnpm run test:e2e"],
  requiredEvidence: ["artifacts/terminal/lint.txt"],
  browserEvidence: ["chromium"],
  evidenceText:
    "leak sample: /Users/example/project, http://localhost:3000, http://192.168.1.10:4000, http://private.internal"
};

const privateEvidencePatterns = [
  {
    key: "local-path",
    label: "local path混入",
    pattern: /(?:\/Users\/|\/home\/|[A-Za-z]:\\)/,
    detail: "公開前証跡にローカル絶対パスが含まれている。"
  },
  {
    key: "private-host",
    label: "private host混入",
    pattern: /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0|private\.internal)\b/i,
    detail: "公開前証跡にprivate hostが含まれている。"
  },
  {
    key: "private-network-url",
    label: "private network URL混入",
    pattern:
      /https?:\/\/(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})/i,
    detail: "公開前証跡にprivate network URLが含まれている。"
  }
];

export function buildCodexCommandDraft(receipt: HandoffReceipt): string {
  if (receipt.approvalState !== "approved") {
    return "";
  }

  return receipt.executeNow.map((command, index) => `${index + 1}. ${command}`).join("\n");
}

export function detectBlockedFindings(receipt: HandoffReceipt): BlockedFinding[] {
  const findings: BlockedFinding[] = [];

  if (receipt.approvalState !== "approved") {
    findings.push({
      key: "unapproved",
      label: "未承認",
      detail: "decision approval が approved ではない。"
    });
  }

  if (!receipt.decisionReason.trim()) {
    findings.push({
      key: "missing-reason",
      label: "理由不足",
      detail: "decision reason が空のためReview Recordとして不足している。"
    });
  }

  const requiredBrowsers = ["chromium", "firefox", "webkit"];
  const missingBrowsers = requiredBrowsers.filter(
    (browser) => !receipt.browserEvidence.includes(browser)
  );
  if (missingBrowsers.length > 0) {
    findings.push({
      key: "missing-three-browsers",
      label: "3ブラウザ不足",
      detail: `不足: ${missingBrowsers.join(", ")}`
    });
  }

  if (receipt.requiredEvidence.length < 4) {
    findings.push({
      key: "missing-evidence",
      label: "evidence不足",
      detail: "terminal evidence と画面証跡の組み合わせが不足している。"
    });
  }

  for (const detector of privateEvidencePatterns) {
    if (detector.pattern.test(receipt.evidenceText)) {
      findings.push({
        key: detector.key,
        label: detector.label,
        detail: detector.detail
      });
    }
  }

  return findings;
}

export function getLedgerViewModel(mode: LedgerMode): LedgerViewModel {
  if (mode === "empty") {
    return { mode, receipt: null, blockedFindings: [], codexCommandDraft: "" };
  }

  const receiptByMode: Record<Exclude<LedgerMode, "empty">, HandoffReceipt> = {
    approved: approvedReceipt,
    held: heldReceipt,
    blocked: blockedReceipt
  };
  const receipt = receiptByMode[mode];

  return {
    mode,
    receipt,
    blockedFindings: mode === "blocked" ? detectBlockedFindings(receipt) : [],
    codexCommandDraft: buildCodexCommandDraft(receipt)
  };
}
