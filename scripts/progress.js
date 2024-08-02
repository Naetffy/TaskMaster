import {User,Status,Task,Subject} from '../api/lib/user.js';

/*
*Load the colors used in the charts
*/
const colors = {
    GREEN: 'rgba(3, 251, 50,1)',
    ORANGE: 'rgba(251, 107, 3,1)',
    RED: 'rgba(251, 3, 3,1)'
}
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

/*
*Load de tasks graphic
*/
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
    header.querySelector('p').textContent = numberOfEachStatus[2] + " completed tasks out of " + sum;
    header.classList.toggle(Status.toString(greaterStatus));
    drawGraphic(Status.values(),[numberOfEachStatus[0],numberOfEachStatus[1],numberOfEachStatus[2]],'myCanvasTask',[colors.RED,colors.ORANGE,colors.GREEN],'Number of tasks');
}
/*
*Load de subjects graphic
*/
function loadSubjectCanvas(){
    const subjects = user.getSubjects();
    let passedSubjects = 0;
    let subjectsName = [];
    let subjectsGrades = [];
    let colorSubject = [];
    for(let i=0;i<subjects.length;i++){
        let subject = subjects[i];
        subjectsName.push(subject.name);
        subjectsGrades.push(subject.getFinalGrade());
        if(subject.passing){
            passedSubjects += 1;
            colorSubject.push(colors.GREEN);
        }else{
            colorSubject.push(colors.RED);
        }
    }
    const subjectContainer = document.getElementById('subjects-graphic');
    const header = subjectContainer.querySelector('.canvas-header');
    header.querySelector('p').textContent = passedSubjects + " passed subjects out of " + subjects.length;
    if(passedSubjects*100 / subjects.length > 50){ //Si el porcentaje de las tareas completadas es mas de 50 la barra es verde, si no, roja
        header.classList.toggle('COMPLETED');
    }else{
        header.classList.toggle('PENDING');
    }
    drawGraphic(subjectsName,subjectsGrades,'myCanvasSubject',colorSubject,'Grade');
}

/*
*Draw the bar graphic on screen
*@param nameValues list of the names of the labels
*@param value list of values of each label
*@param id the selected canvas tag
*@param colors a list of the colors of each bar in rgb
*@param nameLabel series name
*/
function drawGraphic(nameValues,values,id,colors,nameLabel){
  var ctx = document.getElementById(id).getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar', 
    data: {
      labels: nameValues, // Etiquetas de las barras
      datasets: [{
        label: nameLabel,
        data: values, // Datos para cada etiqueta
        backgroundColor: colors,
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true 
        }
      }
    }
  });
}


$(document).ready(function() {
    loadTaskCanvas();
    loadSubjectCanvas();

});