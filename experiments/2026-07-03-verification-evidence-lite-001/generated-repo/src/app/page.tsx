"use client";

import { FormEvent, useMemo, useState } from "react";

type Task = {
  id: number;
  title: string;
  done: boolean;
};

const initialTasks: Task[] = [
  { id: 1, title: "朝の予定を確認する", done: false },
  { id: 2, title: "水分をとる", done: true },
  { id: 3, title: "夕方に振り返る", done: false }
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [incompleteOnly, setIncompleteOnly] = useState(false);
  const [inputError, setInputError] = useState("");

  const visibleTasks = useMemo(() => {
    return incompleteOnly ? tasks.filter((task) => !task.done) : tasks;
  }, [incompleteOnly, tasks]);

  const completedCount = tasks.filter((task) => task.done).length;
  const progressLabel = `${tasks.length}件中${completedCount}件が完了しています`;
  const emptyMessage = incompleteOnly
    ? "未完了のタスクはありません。すべて完了しています。"
    : "タスクはまだありません。追加フォームから最初のタスクを登録できます。";

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) {
      setInputError("タスク名を入力してください。");
      return;
    }

    setTasks((current) => [
      { id: Date.now(), title, done: false },
      ...current
    ]);
    setNewTask("");
    setInputError("");
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  return (
    <main className="page-shell">
      <section className="app-panel" aria-labelledby="app-title">
        <div className="heading-row">
          <div>
            <p className="eyebrow">今日の段取り</p>
            <h1 id="app-title">日次チェックリスト</h1>
          </div>
          <div className="progress-badge" aria-label={progressLabel}>
            {completedCount}/{tasks.length}
          </div>
        </div>

        <form className="add-form" onSubmit={addTask} noValidate>
          <label htmlFor="new-task">タスクを追加</label>
          <div className="input-row">
            <input
              aria-describedby={inputError ? "new-task-error" : undefined}
              aria-invalid={inputError ? "true" : "false"}
              id="new-task"
              value={newTask}
              onChange={(event) => {
                setNewTask(event.target.value);
                if (inputError) {
                  setInputError("");
                }
              }}
              placeholder="例: 議事メモを送る"
            />
            <button type="submit">追加</button>
          </div>
          <p
            aria-live="polite"
            className="form-error"
            id="new-task-error"
            role={inputError ? "status" : undefined}
          >
            {inputError}
          </p>
        </form>

        <label className="filter-toggle">
          <input
            type="checkbox"
            checked={incompleteOnly}
            onChange={(event) => setIncompleteOnly(event.target.checked)}
          />
          未完了のみ表示
        </label>

        <ul
          aria-describedby={visibleTasks.length === 0 ? "empty-state" : undefined}
          aria-label={`タスク一覧、${visibleTasks.length}件表示中`}
          className="task-list"
        >
          {visibleTasks.map((task) => (
            <li className={task.done ? "task done" : "task"} key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.title}</span>
              </label>
            </li>
          ))}
        </ul>

        {visibleTasks.length === 0 ? (
          <p aria-live="polite" className="empty-message" id="empty-state">
            {emptyMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
}
