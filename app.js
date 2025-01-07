"use strict"; // 厳格モードを有効にする

// DOM要素を取得
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const apiUrl = "http://localhost:3000/tasks"; // JSON ServerのURL

// ページロード時にタスクを取得して表示
window.addEventListener("DOMContentLoaded", fetchTasks);

// タスクの追加処理
taskForm.addEventListener("submit", function (event) {
    event.preventDefault(); // ページリロードを防ぐ

    const taskName = taskInput.value.trim(); // 入力されたタスク名を取得
    if (taskName === "") {
        alert("タスクを入力してください！");
        return;
    }

    // サーバーにタスクを追加
    addTaskToServer(taskName);

    // 入力欄をクリア
    taskInput.value = "";
});

// サーバーからタスクを取得して表示する関数
function fetchTasks() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((tasks) => {
            tasks.forEach(addTaskToDOM); // 各タスクをDOMに追加
        })
        .catch((error) => console.error("タスクの取得に失敗しました:", error));
}

// サーバーに新しいタスクを作成する関数
function addTaskToServer(taskName) {
    const newTask = { taskName: taskName, isCompleted: false };
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
    })
        .then((response) => response.json())
        .then((task) => {
            addTaskToDOM(task); // DOMにタスクを追加
        })
        .catch((error) => console.error("タスクの作成に失敗しました:", error));
}

// サーバー上のタスクを削除する関数
function deleteTask(taskId, liElement) {
    fetch(`${apiUrl}/${taskId}`, {
        method: "DELETE",
    })
        .then(() => {
            liElement.remove(); // DOMから削除
        })
        .catch((error) => console.error("タスクの削除に失敗しました:", error));
}

// サーバー上でタスクの完了状態を更新する関数
function updateTaskStatus(taskId, isCompleted) {
    fetch(`${apiUrl}/${taskId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ isCompleted: isCompleted }),
    }).catch((error) => console.error("タスクの更新に失敗しました:", error));
}

// DOMにタスクを追加する関数
function addTaskToDOM(task) {
    // 新しいリスト要素を作成
    const li = document.createElement("li");

    // チェックボックス
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.isCompleted;
    checkbox.addEventListener("change", function () {
        li.classList.toggle("completed", checkbox.checked); // 完了状態を切り替え
        updateTaskStatus(task.id, checkbox.checked); // サーバーの状態を更新
    });

    // タスク名
    const span = document.createElement("span");
    span.textContent = task.taskName;

    // 削除ボタン
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", function () {
        deleteTask(task.id, li); // サーバーからタスクを削除
    });

    // リスト要素に追加
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);

    // 完了済みのタスクにクラスを追加
    if (task.isCompleted) {
        li.classList.add("completed");
    }

    // リストに追加
    taskList.appendChild(li);
}
