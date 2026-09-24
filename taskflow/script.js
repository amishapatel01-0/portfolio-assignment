let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearCompleted = document.getElementById("clearCompleted");
const filters = document.querySelector(".filters");

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    li.dataset.id = task.id;

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.dataset.action = "toggle";

    checkbox.checked = task.completed;

    const text = document.createElement("span");

    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");

    actions.className = "task-actions";

    const editButton = document.createElement("button");

    editButton.textContent = "Edit";
    editButton.type = "button";
    editButton.dataset.action = "edit";

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(actions);

    taskList.appendChild(li);
  });

  updateStats();

  if (filteredTasks.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }
}

// Update task statistics
function updateStats() {
  const activeTasks = tasks.filter((task) => !task.completed).length;

  taskCount.textContent = `${activeTasks} active ${activeTasks === 1 ? "task" : "tasks"}`;
}

// CREATE
taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (text === "") {
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(newTask);

  saveTasks();

  displayTasks();

  taskInput.value = "";
  taskInput.focus();
});

// UPDATE + DELETE + COMPLETE
// Event delegation
taskList.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const taskItem = button.closest(".task-item");

  const taskId = Number(taskItem.dataset.id);

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return;
  }

  // UPDATE
  if (button.dataset.action === "edit") {
    const newText = prompt("Edit your task:", task.text);

    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();

      saveTasks();

      displayTasks();
    }
  }

  // DELETE
  if (button.dataset.action === "delete") {
    tasks = tasks.filter((task) => task.id !== taskId);

    saveTasks();

    displayTasks();
  }
});

// Mark task completed
taskList.addEventListener("change", function (event) {
  if (!event.target.classList.contains("task-checkbox")) {
    return;
  }

  const taskItem = event.target.closest(".task-item");

  const taskId = Number(taskItem.dataset.id);

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return;
  }

  task.completed = event.target.checked;

  saveTasks();

  displayTasks();
});

// FILTERS
filters.addEventListener("click", function (event) {
  const button = event.target.closest(".filter");

  if (!button) {
    return;
  }

  currentFilter = button.dataset.filter;

  document.querySelectorAll(".filter").forEach((filter) => {
    filter.classList.remove("active");
  });

  button.classList.add("active");

  displayTasks();
});

// Clear completed tasks
clearCompleted.addEventListener("click", function () {
  tasks = tasks.filter((task) => !task.completed);

  saveTasks();

  displayTasks();
});

// Load tasks when page opens
displayTasks();
