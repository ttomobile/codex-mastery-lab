const readingLogs = [
  {
    title: "夜明けの図書室",
    author: "佐伯 美晴",
    finishedAt: "2026-06-03",
    memo: "静かな章立てで、通勤前に読むと気持ちを整えやすい。終盤の手紙の場面が印象に残った。",
    syncStatus: "synced",
  },
  {
    title: "小さな習慣の設計ノート",
    author: "長谷川 亮",
    finishedAt: "2026-06-08",
    memo: "読書メモを毎晩3行だけ残す運用に応用できそう。チェックリスト化したい項目が多い。",
    syncStatus: "pending",
  },
  {
    title: "海辺のアルゴリズム",
    author: "水野 葵",
    finishedAt: "2026-06-14",
    memo: "技術の話と家族の会話が自然につながっていた。同期失敗時のUI案を考えるヒントになった。",
    syncStatus: "synced",
  },
  {
    title: "余白をつくる仕事術",
    author: "岡田 透",
    finishedAt: "2026-06-18",
    memo: "予定を詰め込みすぎない章がよい。週次レビューのテンプレートに反映したい。",
    syncStatus: "local",
  },
  {
    title: "雨の日の短編集",
    author: "藤野 ことり",
    finishedAt: "2026-06-23",
    memo: "短い物語ごとに読後感が違う。寝る前に一編ずつ読むのに向いていた。",
    syncStatus: "synced",
  },
];

const statusLabels = {
  synced: "同期済み",
  pending: "同期待ち",
  local: "端末のみ",
};

const statusClassNames = {
  synced: "synced",
  pending: "pending",
  local: "local",
};

const searchInput = document.querySelector("#searchInput");
const logList = document.querySelector("#logList");
const emptyState = document.querySelector("#emptyState");
const resultSummary = document.querySelector("#resultSummary");
const syncDot = document.querySelector("#syncDot");
const syncText = document.querySelector("#syncText");

let loadedLogs = [];

function formatDate(value) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function createLogCard(log) {
  const card = document.createElement("article");
  card.className = "log-card";

  const content = document.createElement("div");
  const title = document.createElement("h2");
  title.textContent = log.title;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.innerHTML = `<span>${log.author}</span><span>読了日: ${formatDate(log.finishedAt)}</span>`;

  const memo = document.createElement("p");
  memo.className = "memo";
  memo.textContent = log.memo;

  const status = document.createElement("span");
  status.className = `status-badge ${statusClassNames[log.syncStatus]}`;
  status.textContent = statusLabels[log.syncStatus];

  content.append(title, meta, memo);
  card.append(content, status);

  return card;
}

function filterLogs(keyword) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return loadedLogs;
  }

  return loadedLogs.filter((log) => {
    const target = `${log.title} ${log.author} ${log.memo}`.toLowerCase();
    return target.includes(normalizedKeyword);
  });
}

function renderLogs() {
  const filteredLogs = filterLogs(searchInput.value);

  logList.replaceChildren(...filteredLogs.map(createLogCard));
  emptyState.hidden = filteredLogs.length > 0;

  const total = loadedLogs.length;
  resultSummary.textContent = `${filteredLogs.length}件表示 / 全${total}件`;
}

function setReadyState() {
  syncDot.classList.add("is-ready");
  syncText.textContent = "API同期済み";
}

function loadReadingLogs() {
  resultSummary.textContent = "APIから読書ログを読み込み中です";

  window.setTimeout(() => {
    loadedLogs = readingLogs;
    setReadyState();
    renderLogs();
  }, 500);
}

searchInput.addEventListener("input", renderLogs);
loadReadingLogs();
