"use strict"; // 厳格モードを有効にする

// DOM要素を取得
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// タスクの追加処理
taskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // ページリロードを防ぐ

  const taskName = taskInput.value.trim(); // 入力されたタスク名を取得
  if (taskName === "") {
    alert("タスクを入力してください！");
    return;
  }

  // タスクをリストに追加
  addTask(taskName);

  // 入力欄をクリア
  taskInput.value = "";
});

// タスクをリストに追加する関数
function addTask(taskName) {
  // 新しいリスト要素を作成
  const li = document.createElement("li");

  // チェックボックス
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", function () {
    li.classList.toggle("completed", checkbox.checked); // 完了状態を切り替え
  });

  // タスク名
  const span = document.createElement("span");
  span.textContent = taskName;

  // 削除ボタン
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "削除";
  deleteButton.addEventListener("click", function () {
    li.remove(); // タスクを削除
  });

  // リスト要素に追加
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteButton);

  // リストに追加
  taskList.appendChild(li);
}