(function () {
  "use strict";

  const TIMEOUT_MS = 700;

  const sampleLogs = [
    {
      id: "log-1",
      title: "夜明けの設計ノート",
      author: "青井 透",
      finishedOn: "2026-06-12",
      memo: "短い章ごとに視点が変わるため、通勤中でも読み戻しやすい。",
      syncState: "同期済み"
    },
    {
      id: "log-2",
      title: "実践アクセシビリティ入門",
      author: "南野 しおり",
      finishedOn: "2026-06-18",
      memo: "aria-live とフォームラベルの確認観点を読書会で共有したい。",
      syncState: "同期済み"
    },
    {
      id: "log-3",
      title: "小さな習慣の編集術",
      author: "河瀬 真",
      finishedOn: "2026-06-22",
      memo: "メモを一行で残す運用なら続けやすい。週末に再読する。",
      syncState: "端末に保持"
    }
  ];

  const state = {
    scenario: "success",
    logs: [],
    searchTerm: "",
    lastSyncedAt: null,
    isLoading: false
  };

  const elements = {
    searchInput: document.querySelector("#search-input"),
    retryButton: document.querySelector("#retry-button"),
    scenarioInputs: Array.from(document.querySelectorAll("input[name='scenario']")),
    liveStatus: document.querySelector("#live-status"),
    messageArea: document.querySelector("#message-area"),
    readingList: document.querySelector("#reading-list"),
    summaryCount: document.querySelector("#summary-count"),
    summaryTime: document.querySelector("#summary-time"),
    listNote: document.querySelector("#list-note")
  };

  class ApiScenarioError extends Error {
    constructor(kind, message) {
      super(message);
      this.name = "ApiScenarioError";
      this.kind = kind;
    }
  }

  function delay(ms, signal) {
    return new Promise((resolve, reject) => {
      const timerId = window.setTimeout(resolve, ms);

      signal.addEventListener("abort", () => {
        window.clearTimeout(timerId);
        reject(new DOMException("timeout", "AbortError"));
      }, { once: true });
    });
  }

  async function requestReadingLogs(scenario, options) {
    const signal = options.signal;

    if (scenario === "offline") {
      await delay(180, signal);
      throw new ApiScenarioError("offline", "オフラインのため同期できません。接続を確認して再試行してください。");
    }

    if (scenario === "server-error") {
      await delay(260, signal);
      throw new ApiScenarioError("server_error", "サーバーエラーが発生しました。時間をおいて再試行してください。");
    }

    if (scenario === "timeout") {
      await delay(TIMEOUT_MS + 500, signal);
      return { logs: sampleLogs };
    }

    await delay(300, signal);
    return { logs: sampleLogs };
  }

  function getSelectedScenario() {
    const selected = elements.scenarioInputs.find((input) => input.checked);
    return selected ? selected.value : "success";
  }

  function formatDate(dateText) {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(`${dateText}T00:00:00`));
  }

  function formatTime(date) {
    if (!date) {
      return "未同期";
    }

    return new Intl.DateTimeFormat("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);
  }

  function getVisibleLogs() {
    const query = state.searchTerm.trim().toLowerCase();
    if (!query) {
      return state.logs;
    }

    return state.logs.filter((log) => {
      return [log.title, log.author, log.memo].some((value) => value.toLowerCase().includes(query));
    });
  }

  function setMessage(text, type) {
    elements.messageArea.textContent = text;
    elements.messageArea.className = `message-area ${type || ""}`.trim();
  }

  function renderSummary() {
    elements.summaryCount.textContent = `${state.logs.length}件`;
    elements.summaryTime.textContent = `最終同期 ${formatTime(state.lastSyncedAt)}`;
  }

  function renderList() {
    const visibleLogs = getVisibleLogs();
    elements.readingList.replaceChildren();
    elements.readingList.classList.toggle("is-loading", state.isLoading);
    elements.readingList.setAttribute("aria-busy", state.isLoading ? "true" : "false");

    if (state.isLoading && state.logs.length === 0) {
      elements.listNote.textContent = "読み込み中です。";
      renderEmptyCard("読み込み中", "APIから読書ログを取得しています。");
      return;
    }

    if (visibleLogs.length === 0) {
      elements.listNote.textContent = state.logs.length === 0 ? "同期済みデータはまだありません。" : "検索結果は0件です。";
      renderEmptyCard("まだ表示できる読書ログがありません", "検索条件を変えるか、再試行してください。");
      return;
    }

    elements.listNote.textContent = `${visibleLogs.length}件を表示中`;

    visibleLogs.forEach((log) => {
      const item = document.createElement("li");
      item.className = "reading-card";

      const title = document.createElement("h3");
      title.textContent = log.title;

      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = `${log.author} / 読了日 ${formatDate(log.finishedOn)}`;

      const memo = document.createElement("p");
      memo.className = "memo";
      memo.textContent = log.memo;

      const sync = document.createElement("p");
      sync.className = "sync-state";
      sync.textContent = `同期状態: ${log.syncState}`;

      item.append(title, meta, memo, sync);
      elements.readingList.append(item);
    });
  }

  function renderEmptyCard(titleText, bodyText) {
    const item = document.createElement("li");
    item.className = "empty-card";

    const title = document.createElement("h3");
    title.textContent = titleText;

    const body = document.createElement("p");
    body.textContent = bodyText;

    item.append(title, body);
    elements.readingList.append(item);
  }

  function renderAll() {
    renderSummary();
    renderList();
  }

  function explainError(error) {
    if (error.name === "AbortError") {
      return {
        live: "タイムアウトしました。",
        message: "タイムアウトしました。既存データと検索入力は保持しています。再試行を押してください。",
        type: "warning"
      };
    }

    if (error.kind === "offline") {
      return {
        live: "オフラインのため同期できません。",
        message: error.message,
        type: "warning"
      };
    }

    if (error.kind === "server_error") {
      return {
        live: "サーバーエラーです。",
        message: error.message,
        type: "error"
      };
    }

    return {
      live: "API失敗エラーです。",
      message: "API失敗エラーが発生しました。再試行してください。",
      type: "error"
    };
  }

  async function syncReadingLogs() {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    state.scenario = getSelectedScenario();
    state.isLoading = true;
    elements.retryButton.disabled = true;
    elements.liveStatus.textContent = "読み込み中です。読書ログ一覧を更新中です。";
    setMessage("読み込み中です。前回の読書ログがある場合は保持したまま更新します。", "");
    renderAll();

    try {
      const response = await requestReadingLogs(state.scenario, { signal: controller.signal });
      state.logs = response.logs;
      state.lastSyncedAt = new Date();
      elements.liveStatus.textContent = "同期に成功しました。";
      setMessage(`${state.logs.length}件の読書ログを同期しました。`, "success");
    } catch (error) {
      const detail = explainError(error);
      elements.liveStatus.textContent = detail.live;
      setMessage(detail.message, detail.type);
    } finally {
      window.clearTimeout(timeoutId);
      state.isLoading = false;
      elements.retryButton.disabled = false;
      renderAll();
    }
  }

  elements.searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    renderAll();
  });

  elements.retryButton.addEventListener("click", () => {
    syncReadingLogs();
  });

  elements.scenarioInputs.forEach((input) => {
    input.addEventListener("change", () => {
      state.scenario = input.value;
    });
  });

  syncReadingLogs();
}());
