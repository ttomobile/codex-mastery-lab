export type LedgerCase = "empty" | "approved" | "held" | "blocked";
export type LedgerDecision = LedgerCase;

export type AiddSpecConnection = {
  id: string;
  label: string;
  status: "connected" | "missing";
};

export type HandoffDecisionInput = {
  caseName: LedgerCase;
  sourceHandoffReceiptId: string;
  decisionOwner: string;
  decisionReason: string;
  approvedExecuteNow: string[];
  codexCommandDraft: string;
  verificationCommands: string[];
  requiredEvidence: string[];
  rollbackCondition: string;
  aiddSpecConnections: AiddSpecConnection[];
  browserEvidence: string[];
  holdReason: string;
  additionalEvidenceNeeded: string[];
  nextReviewCondition: string;
  learningLogReturn: string;
  approvalState: "approved" | "unapproved";
  rawNotes: string[];
};

export type HandoffDecisionLedger = {
  source_handoff_receipt_id: string;
  decision: "approved";
  decision_owner: string;
  decision_reason: string;
  approved_execute_now: string[];
  codex_command_draft: string;
  verification_commands: string[];
  required_evidence: string[];
  rollback_condition: string;
  aidd_spec_connections: AiddSpecConnection[];
};

export type HeldDecision = {
  hold_reason: string;
  additional_evidence_needed: string[];
  next_review_condition: string;
  learning_log_return: string;
};

export type PublishBlock = {
  id: string;
  title: string;
  detail: string;
  fixInstruction: string;
};

export type HandoffDecisionReview = {
  decision: LedgerDecision;
  ledger: HandoffDecisionLedger | null;
  held: HeldDecision | null;
  publishBlocks: PublishBlock[];
  unsafeTokens: string[];
  sanitizedPreview: string;
};

export const requiredLedgerFields = [
  "source_handoff_receipt_id",
  "decision",
  "decision_owner",
  "decision_reason",
  "approved_execute_now",
  "codex_command_draft",
  "verification_commands",
  "required_evidence",
  "rollback_condition",
  "aidd_spec_connections"
] as const;

const requiredVerification = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run test:coverage",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
] as const;

const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;

const requiredEvidence = [
  "assets/aidd-control-plane-mvp055-empty.png",
  "assets/aidd-control-plane-mvp055-approved.png",
  "assets/aidd-control-plane-mvp055-held.png",
  "assets/aidd-control-plane-mvp055-blocked.png",
  "assets/aidd-control-plane-mvp055-terminal-evidence.png"
] as const;

const unsafeLocationPatterns = [
  /\/Users\/[^\s"'<>]+/g,
  /\/home\/[^\s"'<>]+/g,
  /\b[A-Za-z0-9._-]+\.local\b/g,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g
];

export function createHandoffDecisionInput(caseName: LedgerCase): HandoffDecisionInput {
  const base = {
    sourceHandoffReceiptId: "MVP054-HANDOFF-RECEIPT-READY-2026-07-07",
    decisionOwner: "AIDD Control Plane Reviewer",
    decisionReason: "MVP054の縮小版ハンドオフレシートに必要証跡、rollback条件、AIDD-Spec接続、3ブラウザ確認がそろっている。",
    approvedExecuteNow: [
      "Handoff Decision Ledgerを生成する",
      "approved / held / blockedの判断をUIとテストで固定する",
      "公開前ブロックがある場合は実行せず修正指示へ戻す"
    ],
    codexCommandDraft: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run test:e2e && pnpm run doctor:aidd",
    verificationCommands: [...requiredVerification],
    requiredEvidence: [...requiredEvidence],
    rollbackCondition: "verification_commands、3ブラウザE2E、required_evidenceのいずれかが欠けたらapprovedを取り消す。",
    aiddSpecConnections: [
      { id: "mvp054", label: "MVP054 Handoff Receipt", status: "connected" },
      { id: "mvp055", label: "MVP055 Handoff Decision Ledger", status: "connected" },
      { id: "spec-gate", label: "AIDD-Spec Decision Gate", status: "connected" }
    ],
    browserEvidence: [...requiredBrowsers],
    holdReason: "追加証跡の到着待ちです。",
    additionalEvidenceNeeded: ["terminal-evidence画像", "3ブラウザE2Eログ", "learning-logへの返却メモ"],
    nextReviewCondition: "追加証跡がrequired_evidenceへ登録され、doctor:aiddが成功した時点で再レビューする。",
    learningLogReturn: "MVP055では承認判断をapproved/held/blockedに分け、理由と不足証跡を次回学習ログへ戻す。",
    approvalState: "approved" as const,
    rawNotes: ["公開用の証跡はWORKSPACE表記だけにする"]
  } satisfies Omit<HandoffDecisionInput, "caseName">;

  if (caseName === "empty") {
    return {
      ...base,
      caseName,
      sourceHandoffReceiptId: "",
      decisionOwner: "",
      decisionReason: "",
      approvedExecuteNow: [],
      codexCommandDraft: "",
      verificationCommands: [],
      requiredEvidence: [],
      rollbackCondition: "",
      aiddSpecConnections: [],
      browserEvidence: [],
      holdReason: "",
      additionalEvidenceNeeded: [],
      nextReviewCondition: "",
      learningLogReturn: "",
      approvalState: "unapproved",
      rawNotes: []
    };
  }

  if (caseName === "held") {
    return {
      ...base,
      caseName,
      approvalState: "unapproved",
      requiredEvidence: requiredEvidence.filter((item) => !item.includes("terminal-evidence")),
      browserEvidence: ["Chromium", "Firefox"],
      holdReason: "WebKit証跡とterminal-evidence画像が未到着のため、承認判断を保留する。",
      additionalEvidenceNeeded: ["WebKitのE2E成功ログ", "assets/aidd-control-plane-mvp055-terminal-evidence.png"],
      nextReviewCondition: "WebKitログとterminal-evidenceが追加され、local path検出が0件になったら再レビューする。",
      learningLogReturn: "不足証跡をlearning logへ戻し、次回は証跡名を先に固定してからcaptureを実行する。"
    };
  }

  if (caseName === "blocked") {
    return {
      ...base,
      caseName,
      approvalState: "unapproved",
      decisionReason: "",
      verificationCommands: ["pnpm run lint", "pnpm run test"],
      requiredEvidence: ["assets/aidd-control-plane-mvp055-approved.png"],
      rollbackCondition: "",
      browserEvidence: ["Chromium"],
      rawNotes: [
        "/Users/example/workspace/private/mvp055.log",
        "http://127.0.0.1:3028/internal",
        "example-mac.local"
      ],
      codexCommandDraft: `${base.codexCommandDraft} && tail /Users/example/workspace/private/mvp055.log && curl http://127.0.0.1:3028/internal`
    };
  }

  return { ...base, caseName };
}

export function reviewHandoffDecision(input: HandoffDecisionInput): HandoffDecisionReview {
  if (input.caseName === "empty" || input.sourceHandoffReceiptId.trim() === "") {
    return {
      decision: "empty",
      ledger: null,
      held: null,
      publishBlocks: [],
      unsafeTokens: [],
      sanitizedPreview: ""
    };
  }

  const unsafeTokens = detectUnsafePublicTokens(input);
  const publishBlocks = createPublishBlocks(input, unsafeTokens);

  if (input.caseName === "held") {
    return {
      decision: "held",
      ledger: null,
      held: createHeldDecision(input),
      publishBlocks: [],
      unsafeTokens,
      sanitizedPreview: sanitizeForPublic(input.codexCommandDraft)
    };
  }

  return {
    decision: publishBlocks.length > 0 ? "blocked" : "approved",
    ledger: publishBlocks.length > 0 ? null : createHandoffDecisionLedger(input),
    held: null,
    publishBlocks,
    unsafeTokens,
    sanitizedPreview: sanitizeForPublic(input.codexCommandDraft)
  };
}

export function createHandoffDecisionLedger(input: HandoffDecisionInput): HandoffDecisionLedger {
  return {
    source_handoff_receipt_id: sanitizeForPublic(input.sourceHandoffReceiptId),
    decision: "approved",
    decision_owner: sanitizeForPublic(input.decisionOwner),
    decision_reason: sanitizeForPublic(input.decisionReason),
    approved_execute_now: input.approvedExecuteNow.map(sanitizeForPublic),
    codex_command_draft: sanitizeForPublic(input.codexCommandDraft),
    verification_commands: input.verificationCommands.map(sanitizeForPublic),
    required_evidence: input.requiredEvidence.map(sanitizeForPublic),
    rollback_condition: sanitizeForPublic(input.rollbackCondition),
    aidd_spec_connections: input.aiddSpecConnections
  };
}

export function createHeldDecision(input: HandoffDecisionInput): HeldDecision {
  return {
    hold_reason: sanitizeForPublic(input.holdReason),
    additional_evidence_needed: input.additionalEvidenceNeeded.map(sanitizeForPublic),
    next_review_condition: sanitizeForPublic(input.nextReviewCondition),
    learning_log_return: sanitizeForPublic(input.learningLogReturn)
  };
}

export function createPublishBlocks(input: HandoffDecisionInput, unsafeTokens = detectUnsafePublicTokens(input)): PublishBlock[] {
  const blocks: PublishBlock[] = [];

  if (input.approvalState !== "approved") {
    blocks.push({
      id: "unapproved",
      title: "未承認",
      detail: "approved判断が記録されていません。",
      fixInstruction: "decision_ownerが承認し、approvalStateをapprovedへ進める。"
    });
  }

  if (input.decisionReason.trim() === "") {
    blocks.push({
      id: "decision-reason",
      title: "理由不足",
      detail: "decision_reasonが空です。",
      fixInstruction: "なぜ実行可能なのか、またはなぜ止めるのかをdecision_reasonへ明記する。"
    });
  }

  if (input.rollbackCondition.trim() === "") {
    blocks.push({
      id: "rollback-condition",
      title: "rollback不足",
      detail: "rollback_conditionが空です。",
      fixInstruction: "承認取り消し条件と戻し先をrollback_conditionへ明記する。"
    });
  }

  const missingBrowsers = requiredBrowsers.filter((browser) => !input.browserEvidence.includes(browser));
  if (missingBrowsers.length > 0) {
    blocks.push({
      id: "three-browser-e2e",
      title: "Chromium/Firefox/WebKit不足",
      detail: missingBrowsers.join(", "),
      fixInstruction: "PlaywrightのChromium / Firefox / WebKitをすべて実行し、browser evidenceへ残す。"
    });
  }

  const missingEvidence = requiredEvidence.filter((evidence) => !input.requiredEvidence.includes(evidence));
  if (missingEvidence.length > 0) {
    blocks.push({
      id: "required-evidence",
      title: "evidence不足",
      detail: missingEvidence.join(", "),
      fixInstruction: "empty / approved / held / blocked / terminal-evidenceの画像名をrequired_evidenceへ追加する。"
    });
  }

  if (unsafeTokens.length > 0) {
    blocks.push({
      id: "unsafe-location",
      title: "未サニタイズのlocal path/private host/private network URL",
      detail: unsafeTokens.join(" / "),
      fixInstruction: "公開前にWORKSPACEまたはHOME表記へ置換し、private network URLはWORKSPACE/private-urlへサニタイズする。"
    });
  }

  return blocks;
}

export function detectUnsafePublicTokens(value: unknown): string[] {
  const text = JSON.stringify(value);
  const hits = unsafeLocationPatterns.flatMap((pattern) => text.match(pattern) ?? []);
  return Array.from(new Set(hits));
}

export function sanitizeForPublic(value: string): string {
  return value
    .replace(/\/Users\/[^\s"'<>]+/g, (match) => match.replace(/^\/Users\/[^/]+/, "HOME"))
    .replace(/\/home\/[^\s"'<>]+/g, (match) => match.replace(/^\/home\/[^/]+/, "HOME"))
    .replace(/\b[A-Za-z0-9._-]+\.local\b/g, "WORKSPACE.local")
    .replace(/https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g, "WORKSPACE/private-url");
}
