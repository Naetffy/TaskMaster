import {User, Status, Task} from '../api/lib/user.js';

function loadTasks() {
    const userJson = sessionStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    let tasks = user.getAllTasks();
    console.log(tasks);
    let tasksHtml = '';
    for (let date in tasks) {
        for (let i = 0; i < tasks[date].length; i++) {
            const task = tasks[date][i];
            const statusOptions = `
                ${0 !== task.status ? '<option value="0">Pending</option>' : ''}
                ${1 !== task.status ? '<option value="1">In progress</option>' : ''}
                ${2 !== task.status ? '<option value="2">Completed</option>' : ''}
            `;
            tasksHtml += 
            `<div class="task ${Status.toString(task.status)}">
                <div class="task-header">
                    <div class="circle"></div>
                    <h4>${task.name}</h4>
                </div>    
                <p>${task.description}</p>
                <p>status: ${Status.toString(task.status)} 
                    <select class="select-status" onchange="changeTaskStatus('${date}', ${i}, this.value)">
                        <option value="">Change</option>
                        ${statusOptions}
                    </select>
                </p>
                <p>due date: ${date}</p>
            </div>`;
        }
    }
    document.getElementById('tasks-container').innerHTML = tasksHtml;
}

function changeTaskStatus(taskDate, taskIndex, newStatus) {
    console.log(`Task Date: ${taskDate}, Task Index: ${taskIndex}, New Status: ${newStatus}`);
    
    // Actualiza la tarea en tu modelo de datos y guarda el usuario actualizado en sessionStorage
    const userJson = sessionStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    user.getAllTasks()[taskDate][taskIndex].status = parseInt(newStatus);
    sessionStorage.setItem('user', JSON.stringify(user));
    // Vuelve a cargar las tareas para reflejar los cambios en el HTML
    loadTasks();
}

function addTask(){
    let taskName = $("#task-name").val();
    let taskDescription = $("#task-description").val();
    if (!taskName || !taskDescription) {
        alert('Please fill all the fields');
        return;
    }
    const userJson = sessionStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    let date = '2024-07-21';
    let task = new Task(taskName, taskDescription, Status.PENDING, user.subjects[0]);
    user.addTask(date, task);
    sessionStorage.setItem('user', JSON.stringify(user));
    loadTasks();
}

window.addTask = addTask;
window.changeTaskStatus = changeTaskStatus;
$(document).ready(function() {
    loadTasks();
});