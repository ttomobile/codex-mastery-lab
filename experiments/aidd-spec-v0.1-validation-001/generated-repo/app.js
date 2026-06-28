const form = document.querySelector("#task-form");
const fields = {
  taskName: document.querySelector("#task-name"),
  userProblem: document.querySelector("#user-problem"),
  nonGoals: document.querySelector("#non-goals"),
  verificationCommands: document.querySelector("#verification-commands"),
  evidenceNotes: document.querySelector("#evidence-notes")
};
const stateMessage = document.querySelector("#state-message");
const shortageList = document.querySelector("#shortage-list");
const packetPreview = document.querySelector("#packet-preview");
const errorSummary = document.querySelector("#error-summary");
const errorSummaryText = document.querySelector("#error-summary-text");
const analyzeButton = document.querySelector("#analyze-button");
const offlineToggle = document.querySelector("#offline-toggle");
const timeoutToggle = document.querySelector("#timeout-toggle");
const errorToggle = document.querySelector("#error-toggle");

const uiState = {
  loading: false,
  offline: false,
  timeout: false,
  forcedError: false
};

function lines(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function setPressed(button, pressed) {
  button.setAttribute("aria-pressed", String(pressed));
}

function collectShortages() {
  const shortages = [];

  if (!fields.taskName.value.trim()) {
    shortages.push("タスク名が未入力です。");
  }

  if (!fields.userProblem.value.trim()) {
    shortages.push("ユーザー課題が未入力です。");
  }

  if (lines(fields.nonGoals.value).length === 0) {
    shortages.push("非ゴールが未入力です。AIの勝手な拡張を防ぐために必要です。");
  }

  if (lines(fields.verificationCommands.value).length === 0) {
    shortages.push("検証コマンドが未入力です。完了条件を実行可能にしてください。");
  }

  return shortages;
}

function updateShortageList(shortages) {
  shortageList.innerHTML = "";

  if (shortages.length === 0) {
    const item = document.createElement("li");
    item.textContent = "不足項目はありません。";
    shortageList.append(item);
    return;
  }

  for (const shortage of shortages) {
    const item = document.createElement("li");
    item.textContent = shortage;
    shortageList.append(item);
  }
}

function updatePreview() {
  const nonGoals = lines(fields.nonGoals.value);
  const commands = lines(fields.verificationCommands.value);

  packetPreview.textContent = `task_id: "${fields.taskName.value.trim()}"
product_brief:
  name: "${fields.taskName.value.trim()}"
  user_problem: "${fields.userProblem.value.trim()}"
  non_goals: ${JSON.stringify(nonGoals)}
quality_gates:
  required_commands: ${JSON.stringify(commands)}
verification_evidence:
  notes: "${fields.evidenceNotes.value.trim()}"`;
}

function setStatus(message, tone) {
  stateMessage.textContent = message;
  stateMessage.classList.remove("is-ok", "is-warn", "is-error");

  if (tone) {
    stateMessage.classList.add(tone);
  }
}

function render() {
  const shortages = collectShortages();
  const hasRequiredError = !fields.taskName.value.trim() || !fields.userProblem.value.trim();

  updateShortageList(shortages);
  updatePreview();
  setPressed(offlineToggle, uiState.offline);
  setPressed(timeoutToggle, uiState.timeout);
  setPressed(errorToggle, uiState.forcedError);

  if (uiState.loading) {
    setStatus("解析中です。入力内容からAIDD-Spec項目の不足を確認しています。", "is-warn");
  } else if (uiState.offline) {
    setStatus("オフライン状態です。このアプリは外部送信しない設計のため、入力内容はブラウザ内だけで確認します。", "is-warn");
  } else if (uiState.timeout) {
    setStatus("タイムアウト状態です。検証待ちが長引いた場合は、証跡メモに残して再実行してください。", "is-warn");
  } else if (uiState.forcedError || hasRequiredError) {
    setStatus("エラー状態です。タスク名とユーザー課題を入力してください。", "is-error");
  } else if (shortages.length === 0) {
    setStatus("送信準備OKです。必須項目が揃っています。", "is-ok");
  } else {
    setStatus("未完了です。不足項目を確認してください。", "is-warn");
  }

  if (uiState.forcedError || hasRequiredError) {
    errorSummary.hidden = false;
    errorSummaryText.textContent = "タスク名またはユーザー課題が空です。入力画面で修正してください。";
  } else {
    errorSummary.hidden = true;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

for (const field of Object.values(fields)) {
  field.addEventListener("input", render);
}

analyzeButton.addEventListener("click", () => {
  uiState.loading = true;
  render();

  window.setTimeout(() => {
    uiState.loading = false;
    render();
  }, 450);
});

offlineToggle.addEventListener("click", () => {
  uiState.offline = !uiState.offline;
  if (uiState.offline) {
    uiState.timeout = false;
    uiState.forcedError = false;
  }
  render();
});

timeoutToggle.addEventListener("click", () => {
  uiState.timeout = !uiState.timeout;
  if (uiState.timeout) {
    uiState.offline = false;
    uiState.forcedError = false;
  }
  render();
});

errorToggle.addEventListener("click", () => {
  uiState.forcedError = !uiState.forcedError;
  if (uiState.forcedError) {
    uiState.offline = false;
    uiState.timeout = false;
    errorSummary.focus();
  }
  render();
});

render();
