"use strict"; // 厳格モードを有効にする

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

// ミドルウェアの設定
app.use(express.json()); // JSONデータを解析
app.use(express.static(path.join(__dirname, "public"))); // 静的ファイルを提供（./publicディレクトリを使う）

// データを読み込む関数
const getTasks = () => {
  const data = fs.readFileSync("db.json", "utf8");
  return JSON.parse(data).tasks;
};

// データを保存する関数
const saveTasks = (tasks) => {
  fs.writeFileSync("db.json", JSON.stringify({ tasks }, null, 2));
};

// タスク一覧を取得 (GET /tasks)
app.get("/tasks", (req, res) => {
  const tasks = getTasks();
  res.json(tasks);
});

// 新しいタスクを追加 (POST /tasks)
app.post("/tasks", (req, res) => {
  const tasks = getTasks();
  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    taskName: req.body.taskName,
    isCompleted: false,
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// タスクを削除 (DELETE /tasks/:id)
app.delete("/tasks/:id", (req, res) => {
  let tasks = getTasks();
  tasks = tasks.filter((task) => task.id !== parseInt(req.params.id));
  saveTasks(tasks);
  res.status(204).send();
});

// タスクの更新（完了状態を変更）(PATCH /tasks/:id)
app.patch("/tasks/:id", (req, res) => {
  const tasks = getTasks();
  const task = tasks.find((task) => task.id === parseInt(req.params.id));
  if (task) {
    task.isCompleted = req.body.isCompleted;
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).send({ error: "タスクが見つかりません" });
  }
});

// ルートパスの設定 (GET /)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// サーバーを起動
app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で動作中`);
});
