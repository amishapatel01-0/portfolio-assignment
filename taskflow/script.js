// Load tasks from localStorage safely
let tasks = [];

try {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
} catch {
  tasks = [];
}

let currentFilter = "all";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearCompleted = document.getElementById("clearCompleted");
const filters = document.querySelector(".filters");

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <input type="checkbox"
             class="task-checkbox"
             data-action="toggle"
             ${task.completed ? "checked" : ""}>

      <span class="task-text">${task.text}</span>

      <div class="task-actions">
        <button type="button" data-action="edit">Edit</button>
        <button type="button" data-action="delete">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateStats();
  updateEmptyMessage(filteredTasks);
}

// Update task count
function updateStats() {
  const count = tasks.length;
  const active = tasks.filter(task => !task.completed).length;
  const completed = tasks.filter(task => task.completed).length;

  if (currentFilter === "active") {
    taskCount.textContent = `${active} active ${active === 1 ? "task" : "tasks"}`;
  } else if (currentFilter === "completed") {
    taskCount.textContent = `${completed} completed ${completed === 1 ? "task" : "tasks"}`;
  } else {
    taskCount.textContent = `${count} ${count === 1 ? "task" : "tasks"}`;
  }
}

// Empty messages
function updateEmptyMessage(filteredTasks) {
  if (filteredTasks.length > 0) {
    emptyMessage.style.display = "none";
    return;
  }

  emptyMessage.style.display = "block";

  if (currentFilter === "active") {
    emptyMessage.textContent = "No active tasks.";
  } else if (currentFilter === "completed") {
    emptyMessage.textContent = "No completed tasks.";
  } else {
    emptyMessage.textContent = "No tasks yet. Add your first task!";
  }
}

// CREATE
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) return;

  tasks.push({
    id: Date.now(),
    text: text,
    completed: false
  });

  saveTasks();
  displayTasks();

  taskInput.value = "";
  taskInput.focus();
});

// UPDATE + DELETE + COMPLETE
taskList.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) return;

  const taskItem = button.closest(".task-item");
  const taskId = Number(taskItem.dataset.id);
  const task = tasks.find(task => task.id === taskId);

  if (!task) return;

  // UPDATE
  if (button.dataset.action === "edit") {
    const newText = prompt("Edit your task:", task.text);

    if (newText !== null && newText.trim()) {
      task.text = newText.trim();
      saveTasks();
      displayTasks();
    }
  }

  // DELETE
  if (button.dataset.action === "delete") {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    displayTasks();
  }
});

// Mark completed
taskList.addEventListener("change", function (event) {
  if (!event.target.classList.contains("task-checkbox")) return;

  const taskItem = event.target.closest(".task-item");
  const taskId = Number(taskItem.dataset.id);
  const task = tasks.find(task => task.id === taskId);

  if (!task) return;

  task.completed = event.target.checked;

  saveTasks();
  displayTasks();
});

// FILTERS
filters.addEventListener("click", function (event) {
  const button = event.target.closest(".filter");

  if (!button) return;

  currentFilter = button.dataset.filter;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.remove("active");
  });

  button.classList.add("active");

  displayTasks();
});

// Clear completed
clearCompleted.addEventListener("click", function () {
  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  displayTasks();
});

// Load tasks
displayTasks();
