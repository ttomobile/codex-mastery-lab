export type ReceiptCase = "empty" | "valid" | "blocked";
export type ReceiptDecision = "empty" | "valid" | "blocked";

export type AiddSpecConnection = {
  id: string;
  label: string;
  status: "connected" | "missing";
};

export type HandoffPacketInput = {
  caseName: ReceiptCase;
  sourceShrinkPlanId: string;
  executeNow: string[];
  deferNextIncrement: string[];
  minimumVerification: string[];
  codexPromptPreview: string;
  requiredEvidence: string[];
  rollbackCondition: string;
  aiddSpecConnections: AiddSpecConnection[];
  browserEvidence: string[];
  rawNotes: string[];
};

export type HandoffReceipt = {
  source_shrink_plan_id: string;
  execute_now: string[];
  defer_next_increment: string[];
  minimum_verification: string[];
  codex_prompt_preview: string;
  required_evidence: string[];
  rollback_condition: string;
  aidd_spec_connections: AiddSpecConnection[];
};

export type PublishBlock = {
  id: string;
  title: string;
  detail: string;
  fixInstruction: string;
};

export type HandoffReview = {
  decision: ReceiptDecision;
  receipt: HandoffReceipt | null;
  publishBlocks: PublishBlock[];
  unsafeTokens: string[];
  sanitizedPreview: string;
};

export const requiredReceiptFields = [
  "source_shrink_plan_id",
  "execute_now",
  "defer_next_increment",
  "minimum_verification",
  "codex_prompt_preview",
  "required_evidence",
  "rollback_condition",
  "aidd_spec_connections"
] as const;

const requiredVerification = [
  "pnpm run lint",
  "pnpm run typecheck",
  "pnpm run test",
  "pnpm run build",
  "pnpm run test:e2e",
  "pnpm run doctor:aidd"
] as const;

const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;

const unsafeLocationPatterns = [
  /\/Users\/[^\s"'<>]+/g,
  /\/home\/[^\s"'<>]+/g,
  /\b[A-Za-z0-9._-]+\.local\b/g,
  /https?:\/\/(?:localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[0-1])\.)[^\s"'<>]*/g
];

export function createHandoffPacket(caseName: ReceiptCase): HandoffPacketInput {
  const base = {
    sourceShrinkPlanId: "MVP053-SHRINK-PLAN-READY-2026-07-07",
    executeNow: [
      "縮小版ハンドオフレシートを表示する",
      "empty / valid / blockedの3ケースを切り替える",
      "公開前ブロックと修正指示をUIに出す"
    ],
    deferNextIncrement: [
      "CI連携と記事化は次インクリメントで実施する",
      "mock backend化はMVP055以降で検討する"
    ],
    minimumVerification: [...requiredVerification],
    codexPromptPreview: [
      "AIDD Control Plane MVP054を継続してください。",
      "MVP053のShrink Plannerから受け取った縮小結果を、次回実行用のハンドオフレシートに整形します。",
      "公開前ブロックがある場合は実行せず、修正指示だけを返してください。"
    ].join("\n"),
    requiredEvidence: [
      "assets/aidd-control-plane-mvp054-empty.png",
      "assets/aidd-control-plane-mvp054-valid.png",
      "assets/aidd-control-plane-mvp054-blocked.png",
      "assets/aidd-control-plane-mvp054-terminal-evidence.png"
    ],
    rollbackCondition: "minimum_verificationまたは3ブラウザE2Eが失敗したら、ハンドオフレシートを次回実行へ渡さない。",
    aiddSpecConnections: [
      { id: "mvp053", label: "MVP053 Shrink Planner", status: "connected" },
      { id: "handoff", label: "MVP054 Handoff Receipt", status: "connected" },
      { id: "verification", label: "Verification Gate", status: "connected" }
    ],
    browserEvidence: [...requiredBrowsers],
    rawNotes: ["公開用の証跡はWORKSPACE表記だけにする"]
  } satisfies Omit<HandoffPacketInput, "caseName">;

  if (caseName === "empty") {
    return {
      ...base,
      caseName,
      sourceShrinkPlanId: "",
      executeNow: [],
      deferNextIncrement: [],
      minimumVerification: [],
      codexPromptPreview: "",
      requiredEvidence: [],
      rollbackCondition: "",
      aiddSpecConnections: [],
      browserEvidence: [],
      rawNotes: []
    };
  }

  if (caseName === "blocked") {
    return {
      ...base,
      caseName,
      minimumVerification: ["pnpm run lint", "pnpm run test"],
      requiredEvidence: ["assets/aidd-control-plane-mvp054-valid.png"],
      rollbackCondition: "",
      browserEvidence: ["Chromium"],
      rawNotes: [
        "/Users/tto/codex-mastery-lab/private/raw.log",
        "http://127.0.0.1:3024/internal",
        "tto-mac.local"
      ],
      codexPromptPreview: `${base.codexPromptPreview}\nraw=/Users/tto/codex-mastery-lab/private/raw.log host=tto-mac.local url=http://127.0.0.1:3024/internal`
    };
  }

  return { ...base, caseName };
}

export function reviewHandoffPacket(packet: HandoffPacketInput): HandoffReview {
  if (packet.caseName === "empty" || packet.sourceShrinkPlanId.trim() === "") {
    return {
      decision: "empty",
      receipt: null,
      publishBlocks: [],
      unsafeTokens: [],
      sanitizedPreview: ""
    };
  }

  const unsafeTokens = detectUnsafePublicTokens(packet);
  const publishBlocks = createPublishBlocks(packet, unsafeTokens);

  return {
    decision: publishBlocks.length > 0 ? "blocked" : "valid",
    receipt: publishBlocks.length > 0 ? null : createHandoffReceipt(packet),
    publishBlocks,
    unsafeTokens,
    sanitizedPreview: sanitizeForPublic(packet.codexPromptPreview)
  };
}

export function createHandoffReceipt(packet: HandoffPacketInput): HandoffReceipt {
  return {
    source_shrink_plan_id: sanitizeForPublic(packet.sourceShrinkPlanId),
    execute_now: packet.executeNow.map(sanitizeForPublic),
    defer_next_increment: packet.deferNextIncrement.map(sanitizeForPublic),
    minimum_verification: packet.minimumVerification.map(sanitizeForPublic),
    codex_prompt_preview: sanitizeForPublic(packet.codexPromptPreview),
    required_evidence: packet.requiredEvidence.map(sanitizeForPublic),
    rollback_condition: sanitizeForPublic(packet.rollbackCondition),
    aidd_spec_connections: packet.aiddSpecConnections
  };
}

export function createPublishBlocks(packet: HandoffPacketInput, unsafeTokens = detectUnsafePublicTokens(packet)): PublishBlock[] {
  const blocks: PublishBlock[] = [];

  if (unsafeTokens.length > 0) {
    blocks.push({
      id: "unsafe-location",
      title: "未サニタイズのlocal path/private host/private network URL",
      detail: unsafeTokens.join(" / "),
      fixInstruction: "公開前にWORKSPACEまたはHOME表記へ置換し、private network URLはWORKSPACE/private-urlへサニタイズする。"
    });
  }

  const missingVerification = requiredVerification.filter((command) => !packet.minimumVerification.includes(command));
  if (missingVerification.length > 0) {
    blocks.push({
      id: "minimum-verification",
      title: "minimum_verification不足",
      detail: missingVerification.join(", "),
      fixInstruction: "lint / typecheck / test / build / test:e2e / doctor:aiddをminimum_verificationへ追加する。"
    });
  }

  if (packet.rollbackCondition.trim() === "") {
    blocks.push({
      id: "rollback-condition",
      title: "rollback不足",
      detail: "rollback_conditionが空です。",
      fixInstruction: "検証失敗時に次回実行へ渡さない条件をrollback_conditionへ明記する。"
    });
  }

  const missingBrowsers = requiredBrowsers.filter((browser) => !packet.browserEvidence.includes(browser));
  if (missingBrowsers.length > 0) {
    blocks.push({
      id: "three-browser-e2e",
      title: "Chromium/Firefox/WebKit不足",
      detail: missingBrowsers.join(", "),
      fixInstruction: "PlaywrightのChromium / Firefox / WebKitをすべて実行し、browser evidenceへ残す。"
    });
  }

  const missingEvidence = [
    "assets/aidd-control-plane-mvp054-empty.png",
    "assets/aidd-control-plane-mvp054-valid.png",
    "assets/aidd-control-plane-mvp054-blocked.png",
    "assets/aidd-control-plane-mvp054-terminal-evidence.png"
  ].filter((evidence) => !packet.requiredEvidence.includes(evidence));

  if (missingEvidence.length > 0) {
    blocks.push({
      id: "required-evidence",
      title: "evidence不足",
      detail: missingEvidence.join(", "),
      fixInstruction: "empty / valid / blocked / terminal-evidenceの画像名をrequired_evidenceへ追加する。"
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
