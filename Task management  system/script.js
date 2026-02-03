document.addEventListener('DOMContentLoaded', loadTasks);

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const taskDate = document.getElementById('taskDate');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const statusFilter = document.getElementById('statusFilter');
const totalTasks = document.getElementById('totalTasks');
const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

addBtn.addEventListener('click', addTask);
statusFilter.addEventListener('change', renderTasks);

function addTask() {
if (taskTitle.value.trim() === '') {
alert('Please enter a task title');
return;
}

const newTask = {
id: Date.now(),
title: taskTitle.value,
description: taskDesc.value,
deadline: taskDate.value || 'No deadline',
status: 'todo' // todo, progress, done
};

tasks.push(newTask);
saveTasks();
renderTasks();
updateStats();

taskTitle.value = '';
taskDesc.value = '';
taskDate.value = '';
}

function deleteTask(id) {
tasks = tasks.filter(task => task.id !== id);
saveTasks();
renderTasks();
updateStats();
}

function editTask(id) {
const task = tasks.find(t => t.id === id);
const newTitle = prompt('Edit task title:', task.title);
const newDesc = prompt('Edit description:', task.description);
const newDeadline = prompt('Edit deadline (YYYY-MM-DD):', task.deadline);

if (newTitle !== null) task.title = newTitle;
if (newDesc !== null) task.description = newDesc;
if (newDeadline !== null) task.deadline = newDeadline;

saveTasks();
renderTasks();
}

function changeStatus(id, newStatus) {
const task = tasks.find(t => t.id === id);
if (task) {
task.status = newStatus;
saveTasks();
renderTasks();
updateStats();
}
}

function saveTasks() {
localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
renderTasks();
updateStats();
}

function renderTasks() {
const filter = statusFilter.value;
let filteredTasks = tasks;

if (filter !== 'all') {
filteredTasks = tasks.filter(task => task.status === filter);
}

taskList.innerHTML = '';

filteredTasks.forEach(task => {
const taskElement = document.createElement('div');
taskElement.className = 'task';

const statusColors = {
todo: '#e74c3c',
progress: '#f39c12',
done: '#2ecc71'
};

taskElement.style.borderLeftColor = statusColors[task.status];

taskElement.innerHTML = `
<div class="task-info">
<h3>${task.title}</h3>
<p>${task.description}</p>
<p class="deadline"><i class="far fa-calendar-alt"></i> ${task.deadline}</p>
<small>Status: <strong>${task.status.toUpperCase()}</strong></small>
</div>
<div class="task-actions">
<button class="edit-btn" onclick="editTask(${task.id})"><i class="fas fa-edit"></i> Edit</button>
<button class="status-btn" onclick="changeStatus(${task.id}, '${task.status === 'todo' ? 'progress' : task.status === 'progress' ? 'done' : 'todo'}')">
<i class="fas fa-exchange-alt"></i> Status
</button>
<button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i> Delete</button>
</div>
`;

taskList.appendChild(taskElement);
});
}

function updateStats() {
totalTasks.textContent = tasks.length;
todoTasks.textContent = tasks.filter(t => t.status === 'todo').length;
progressTasks.textContent = tasks.filter(t => t.status === 'progress').length;
doneTasks.textContent = tasks.filter(t => t.status === 'done').length;
}

