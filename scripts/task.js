import {User, Status, Task} from '../api/lib/user.js';

/*
*Load user
*/
function loadUser(){
    const userJson = sessionStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    return function(){
        return user;
    }
}
const user = loadUser()();
/*
*Load the page with the added tasks.
*/
function loadTasks() {
    let tasks = user.getAllTasks();
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
*@param taksDate the dselected date of the task
*@param taskIndex index of the task within the date key
*@param newStatus the new status of the tasks
*/
function changeTaskStatus(taskDate, taskIndex, newStatus) {
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
    if(taskDescription.length > 40){
        alert('The description is too long');
        return;
    }
    let dueDateText = $('#dueDateText');
    if (!dueDateText.text()) {
        alert('Please select a due date');
        return;
    }
    let currentDate = new Date();
    let dueDate = new Date(dueDateText.text());
    currentDate.setHours(0,0,0,0);
    if(dueDate < currentDate){
        alert('The due date must be greater than the current date');
        return;
    };
    let task = new Task(taskName, taskDescription, Status.PENDING, user.subjects[0]);
    user.addTask(dueDateText.text(), task);
    sessionStorage.setItem('user', JSON.stringify(user));
    loadTasks();
}
/*Delete the selected task
*@param taksDate the selected date of the task
*@param slectedTask index of the task within the date key
*@param button the button element of the selected task
*/
function removeTask(taskDate,selectedTask,button){
    user.deleteTask(taskDate,selectedTask);
    const elementToRemove = button.parentElement.parentElement;
    elementToRemove.remove();
    sessionStorage.setItem('user', JSON.stringify(user));
    loadTasks();
}
/*Modify the selected task
*@param date the selected date of the task
*@param task index of the task within the date key
*@param button the button element of the selected task
*/
function editTask(date,task,button){
    const item = button.parentElement.parentElement;
    const title = item.querySelector('.task-header').querySelector('h4').textContent;
    const description = item.querySelector('p').textContent;
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

document.addEventListener('DOMContentLoaded', function() {
    const calendarIcon = document.getElementById('calendarIcon');
    const dueDateText = document.getElementById('dueDateText');

    const dateInput = document.createElement('input');
    dateInput.type = 'text';
    dateInput.style.display = 'none';
    document.body.appendChild(dateInput);

    const datePicker = flatpickr(dateInput, {
        dateFormat: "m/d/Y",
        onChange: function(selectedDates, dateStr, instance) {
            dueDateText.textContent = dateStr;
        },
        clickOpens: false 
    });

    calendarIcon.addEventListener('click', function() {
        datePicker.open();
    });
});