import {User, Status, Task} from '../api/lib/user.js';
/*
*Load the page with the added tasks.
*/
function loadTasks() {
    const userJson = sessionStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    let tasks = user.getAllTasks();
    //console.log(tasks);
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
                    <img class = "task-icon edit-icon" src="../images/editar.png" src="edit icon" onclick="editTask('${date}', ${i},this)"/>
                    <button class="close-button task-icon" type="button" onclick="removeTask('${date}', ${i},this)">X</button>
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
/*
*Change the status of the tasks 
*Attributes: taks date, index of the task, the new status
*/
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
/*
*Add a new task
*/
function addTask(){
    let taskName = $("#task-name").val();
    let taskDescription = $("#task-description").val();
    if (!taskName || !taskDescription) {
        alert('Please fill all the fields');
        return;
    }
    const userJson = sessionStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    let date = dueDateText.textContent;
    let task = new Task(taskName, taskDescription, Status.PENDING, user.subjects[0]);
    user.addTask(date, task);
    sessionStorage.setItem('user', JSON.stringify(user));
    loadTasks();
}
/*Delete the selected task
Atibuttes: task date, index of the task, button element 
*/
function removeTask(taskDate,selectedTask,button){
    const userJson = sessionStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    user.deleteTask(taskDate,selectedTask);
    sessionStorage.setItem('user', JSON.stringify(user));
    const elementToRemove = button.parentElement.parentElement;
    elementToRemove.remove();
    loadTasks();
}
/*Modify the selected task
Atibuttes: task date, index of the task, button element
*/
function editTask(date,task,button){
    const item = button.parentElement.parentElement;
    const title = item.querySelector('.task-header').querySelector('h4').textContent;
    const paragraph = item.querySelectorAll('p');
    console.log(paragraph);
    const description = paragraph[0].textContent;
    const dateTask = paragraph[2].textContent;
    const inputTitle = document.querySelector('#task-name');
    const inputDescription = document.querySelector('#task-description');
    const inputDate = document.querySelector(".h-10").querySelector('div').querySelector('p');
    inputTitle.value = title;
    inputDescription.value = description;
    inputDate.textContent = date;
    removeTask(date,task,button);
}

window.addTask = addTask;
window.changeTaskStatus = changeTaskStatus;
window.removeTask = removeTask;
window.editTask = editTask;
$(document).ready(function() {
    loadTasks();
});
