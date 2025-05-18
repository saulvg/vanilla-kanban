import { createTask, deleteTask, fetchTasks, updateTask } from "./api.js";

const columns = document.querySelectorAll(".column .task-list");
const form = document.getElementById("task-form");
const input = document.getElementById("new-task");
const textarea = document.getElementById("new-desc");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalClose = document.getElementById("modal-close");

let tasks = [];
const lastFocusedEl = null;

async function init() {
	tasks = await fetchTasks();
	renderAll();
}
init();

function renderAll() {
	// biome-ignore lint/complexity/noForEach: <explanation>
	// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
	columns.forEach((col) => (col.innerHTML = ""));
	tasks.forEach(renderTask);
}

function renderTask(task) {
	const li = document.createElement("li");
	li.className = `task${task.important ? " important" : ""}${task.done ? " done" : ""}`;
	li.draggable = true;
	li.dataset.id = task.id;
	li.setAttribute("role", "listitem");
	li.tabIndex = 0;

	li.innerHTML = `
	<div class="title">${task.title}</div>
	 <div class="actions">
      <button class="imp"  aria-label="Marcar importante">★</button>
      <button class="done" aria-label="Marcar hecho">✔</button>
      <button class="del"  aria-label="Eliminar tarea">✖</button>
    </div>
	`;
}
