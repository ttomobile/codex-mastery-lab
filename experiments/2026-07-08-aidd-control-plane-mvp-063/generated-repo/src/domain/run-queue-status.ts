export type QueueStatus = "empty" | "waiting" | "running" | "succeeded" | "failed" | "evidence_missing";
export type QueueDecision = "empty" | "queued" | "active" | "passed" | "blocked" | "evidence_missing";
export type FindingSeverity = "high" | "medium";

export type EvidenceState = {
  terminal: string[];
  screenshots: string[];
};

export type QueueRun = {
  id: string;
  status: QueueStatus;
  title: string;
  runCommand: string;
  verificationCommand: string;
  browserScope: string[];
  evidence: EvidenceState;
  rollbackPlan: string;
  reviewRecordOutput: string;
  learningLogOutput: string;
};

export type ReviewFinding = {
  category: string;
  severity: FindingSeverity;
  finding: string;
  missing: string[];
  fixInstruction: string;
  verificationCommand: string;
};

export type QueueViewModel = {
  decision: QueueDecision;
  run: QueueRun | null;
  findings: ReviewFinding[];
  reviewRecord: string;
  learningLog: string;
};

export const queueStatuses: QueueStatus[] = ["empty", "waiting", "running", "succeeded", "failed", "evidence_missing"];
export const requiredBrowsers = ["Chromium", "Firefox", "WebKit"] as const;
export const requiredEvidence = [
  "terminal evidence",
  "screenshot evidence",
  "Review Record出力",
  "Learning Log出力",
  "rollback plan"
] as const;

const baseRun = {
  id: "MVP063-RUN-001",
  title: "Codex Run Queue Status Tracker",
  runCommand: "pnpm run lint && pnpm run typecheck && pnpm run test && pnpm run build",
  verificationCommand: "pnpm run test:e2e && pnpm run doctor:aidd && pnpm run capture:mvp063",
  browserScope: ["Chromium", "Firefox", "WebKit"],
  rollbackPlan: "キュー状態がfailedまたはevidence_missingに戻ったら、直前のAI Task Packet差分を戻し、Review FindingをLearning Logへ追記する。",
  reviewRecordOutput: "Review Record: Run Queueの状態、実行コマンド、検証コマンド、3ブラウザ範囲、証跡、rollback planを確認した。",
  learningLogOutput: "Learning Log: Run Queue状態はUIだけでなく、terminal evidenceとscreenshot evidenceがそろってから完了扱いにする。"
} satisfies Omit<QueueRun, "status" | "evidence">;

export function createQueueRun(status: QueueStatus): QueueRun | null {
  if (status === "empty") return null;

  const completeEvidence: EvidenceState = {
    terminal: [
      "artifacts/terminal/lint.txt",
      "artifacts/terminal/typecheck.txt",
      "artifacts/terminal/test.txt",
      "artifacts/terminal/build.txt",
      "artifacts/terminal/test-e2e.txt",
      "artifacts/terminal/doctor-aidd.txt",
      "artifacts/terminal/capture-mvp063.txt"
    ],
    screenshots: [
      "artifacts/screenshots/aidd-control-plane-mvp063-empty.png",
      "artifacts/screenshots/aidd-control-plane-mvp063-waiting.png",
      "artifacts/screenshots/aidd-control-plane-mvp063-running.png",
      "artifacts/screenshots/aidd-control-plane-mvp063-succeeded.png",
      "artifacts/screenshots/aidd-control-plane-mvp063-failed.png",
      "artifacts/screenshots/aidd-control-plane-mvp063-evidence-missing.png"
    ]
  };

  if (status === "failed") {
    return {
      ...baseRun,
      status,
      id: "MVP063-RUN-FAILED",
      evidence: {
        terminal: ["artifacts/terminal/test-e2e.txt"],
        screenshots: ["artifacts/screenshots/aidd-control-plane-mvp063-failed.png"]
      },
      reviewRecordOutput: "Review Record: test:e2eが失敗。失敗ログ、対象ブラウザ、rollback planは残したが、成功証跡は未確定。",
      learningLogOutput: "Learning Log: failedでは原因、再実行条件、rollback判断を次回AI Task Packetへ戻す。"
    };
  }

  if (status === "evidence_missing") {
    return {
      ...baseRun,
      status,
      id: "MVP063-RUN-EVIDENCE-MISSING",
      evidence: {
        terminal: ["artifacts/terminal/build.txt"],
        screenshots: []
      },
      reviewRecordOutput: "Review Record: buildは通過したが、terminal evidenceとscreenshot evidenceが不足しているため完了扱いにしない。",
      learningLogOutput: "Learning Log: 証跡不足は後追い補完ではなく、capture:mvp063とdoctor:aiddの受け入れ条件へ戻す。"
    };
  }

  return {
    ...baseRun,
    status,
    id: `MVP063-RUN-${status.toUpperCase()}`,
    evidence: completeEvidence,
    reviewRecordOutput: status === "succeeded"
      ? "Review Record: succeeded。lint/typecheck/test/build/test:e2e/doctor/captureと3ブラウザ証跡がそろった。"
      : baseRun.reviewRecordOutput,
    learningLogOutput: status === "running"
      ? "Learning Log: running中は完了判定を出さず、検証コマンドと証跡の到着を待つ。"
      : baseRun.learningLogOutput
  };
}

export function evaluateQueueStatus(status: QueueStatus): QueueViewModel {
  const run = createQueueRun(status);
  if (!run) {
    return {
      decision: "empty",
      run: null,
      findings: [],
      reviewRecord: "Review Record: Run Queueは空。実行対象がないため完了判定もしない。",
      learningLog: "Learning Log: empty状態を明示し、古いRunの証跡を表示しない。"
    };
  }

  const findings = createReviewFindings(run);
  return {
    decision: statusToDecision(status),
    run,
    findings,
    reviewRecord: run.reviewRecordOutput,
    learningLog: run.learningLogOutput
  };
}

function statusToDecision(status: QueueStatus): QueueDecision {
  if (status === "waiting") return "queued";
  if (status === "running") return "active";
  if (status === "succeeded") return "passed";
  if (status === "failed") return "blocked";
  if (status === "evidence_missing") return "evidence_missing";
  return "empty";
}

function createReviewFindings(run: QueueRun): ReviewFinding[] {
  if (run.status !== "failed" && run.status !== "evidence_missing") return [];

  const findings: ReviewFinding[] = [];
  if (run.status === "failed") {
    findings.push({
      category: "実行失敗",
      severity: "high",
      finding: "Run Queue内のCodex実行がfailedで止まり、成功証跡へ進めない。",
      missing: ["成功した検証コマンド", "失敗原因の修正", "succeeded状態のterminal evidence"],
      fixInstruction: "失敗ログをReview Recordへ残し、修正後にlint/typecheck/test/build/test:e2e/doctor:aidd/capture:mvp063を再実行する。",
      verificationCommand: run.verificationCommand
    });
  }

  if (run.status === "evidence_missing") {
    findings.push({
      category: "証跡不足",
      severity: "medium",
      finding: "Runは通過している可能性があるが、terminal evidenceまたはscreenshot evidenceが不足している。",
      missing: missingEvidence(run),
      fixInstruction: "capture:mvp063で6状態のスクリーンショットを保存し、doctor:aiddで証跡名とReview Record / Learning Log出力を確認する。",
      verificationCommand: "pnpm run capture:mvp063 && pnpm run doctor:aidd"
    });
  }

  return findings;
}

function missingEvidence(run: QueueRun): string[] {
  const missing: string[] = [];
  if (run.evidence.terminal.length < 2) missing.push("terminal evidence");
  if (run.evidence.screenshots.length < 1) missing.push("screenshot evidence");
  if (!run.reviewRecordOutput) missing.push("Review Record出力");
  if (!run.learningLogOutput) missing.push("Learning Log出力");
  if (!run.rollbackPlan) missing.push("rollback plan");
  return missing;
}
