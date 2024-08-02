import {User,Status,Task,Subject} from '../api/lib/user.js';

/*
*Load user
*/
function loadUser(){
    const userJson = localStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    return function(){
        return user;
    }
}
const user = loadUser()();


function loadTaskCanvas(){
    const tasks = user.getAllTasks();
    let numberOfEachStatus= {0:0, 1:0, 2:0};
    let sum = 0;
    let greater = 0;
    let greaterStatus = 0;
    for (let date in tasks) {
        for (let i = 0; i < tasks[date].length; i++) {
            let task = tasks[date][i];
            numberOfEachStatus[task.status] += 1;
            sum+=1;
            if(numberOfEachStatus[task.status] > greater){
                greater = numberOfEachStatus[task.status];
                greaterStatus = task.status;
            }
        }
    }
    const header = document.querySelector('.canvas-header');
    header.querySelector('p').textContent = numberOfEachStatus[2] + " tareas completadas de " + sum;
    header.classList.toggle(Status.toString(greaterStatus));
}


        


$(document).ready(function() {
    loadTaskCanvas();
});