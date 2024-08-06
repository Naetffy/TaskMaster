import {User, Subject} from '../api/lib/user.js';

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
*Add a new box to enter a new grade
*/
function addGrade(){
    const lastElement = document.getElementById('input-container').lastElementChild;
    let lastNumber = lastElement ? lastElement.querySelector('label').textContent[6] : 0;
    let nextNumber = parseInt(lastNumber)+1;
    const newGrade = `<div class="subject-container items">
                <label><b>Grade ${nextNumber}</b></label>
                <div class = "subject-information">
                    <input type="text" class = "input-size">
                    <input type="text" class = "input-size">
                </div>
            </div>`;
    $('#input-container').append(newGrade);
}

/*
*Add a new subject 
*/
function addSubject() {
    let subjectTitle = $("#subject-name").val();
    let values = $('.subject-information').children();
    let subjectMinGrade = parseFloat($('#input-min-size').val());
    if (!subjectTitle) {
        alert("Please enter a subject name.");
        return;
    }
    if (subjectTitle.length > 20) {
        alert("The title is too long.");
        return;
    }
    if(isNaN(subjectMinGrade)){
        alert("Please enter a minimum grade.");
        return;
    }
    if(subjectMinGrade<0){
        alert("Please enter valid minimum grade value.");
        return;
    }
    let subject = new Subject(subjectTitle,subjectMinGrade);
    let totalPercentage = 0;

    for (let i = 0; i < values.length; i += 2) {
        let grade = parseFloat($(values[i]).val());
        let percentage = parseFloat($(values[i+1]).val());
        if (isNaN(grade) || isNaN(percentage) || grade < 0 || percentage < 0 || percentage > 1) {
            alert("Please enter valid grade and percentage values.");
            return;
        }

        totalPercentage += percentage;
        if (totalPercentage > 1) {
            alert("The total percentage exceeds 1. Please enter valid percentages.");
            return;
        }

        subject.addGrade(grade, percentage);
    }

    user.addSubject(subject);
    localStorage.setItem('user', JSON.stringify(user));
    loadSubjects();
    $('#input-container').children().slice(1).remove();
    $('#add-subject').find('input').slice(0,-1).val('');

}


/*
*Load existing subjects
*/
function loadSubjects(){
    let subjects = user.getSubjects();
    let subjectHtml = '';
    for(let i=0; i<subjects.length; i++){
        let subject = subjects[i];
        let colorGrade = subject.passing ? "isPassing" : "notPassing";
        let message = colorGrade === "isPassing" ? "Congratulations! You're progressing, keep it up!" : "Don't get discouraged! Keep studying.";
        subjectHtml += `<div class="subject-card">
                <div class="subject-header ${colorGrade}">
                    <div class="square"></div>
                    <h2>${subject.name}</h2>
                </div>  
                <div class = "grade-container">  
                    <span>FINAL GRADE:</span>
                    <span id="grade-size">${subject.getFinalGrade()}</span>
                </div>
                <p>${message}</p>
                <div class="edit-delete-buttons">
                    <button class="delete-button" onclick="deleteSubject(${i})"><i class="fas fa-trash-alt"></i></button>
                    <button class="edit-button" onclick="editSubject(${i},this)"><i class="fas fa-edit"></i></button>
                </div>
            </div>`;
    }
    document.getElementById('subjects-container').innerHTML = subjectHtml;
    console.log(subjects);
}

/*
*Delete an especific subject
*@param index the position of the element into the subjects array
*/
function deleteSubject(index) {
    let cardElement = document.querySelectorAll('.subject-card')[index];
    cardElement.classList.add('fade-out');
    user.deleteSubject(index);
    localStorage.setItem('user', JSON.stringify(user));
    loadSubjects();
}

/*
*Change de data of an especific subject
*@param index the position of the element into the subjects array
*@param button elem of the selected subject
*/
function editSubject(index,button){
    const subject = user.getSelectedSubject(index);
    const grades = subject.getGrades();
    const item = button.parentElement.parentElement;
    const title = item.querySelector('.subject-header').querySelector('h2').textContent;
    const subjectTitle = document.getElementById('subject-name');
    subjectTitle.value = title;
    $('#input-container').children().remove();
    for(let i=0;i<grades.length;i++){
        addGrade();
        let inputGrade = $('.subject-information')[i].children;
        inputGrade[0].value = grades[i][0];
        inputGrade[1].value = grades[i][1];
    }
    document.getElementById('input-min-size').value = subject.minimum;
    deleteSubject(index);
}


window.addGrade = addGrade;
window.addSubject = addSubject;
window.deleteSubject = deleteSubject;
window.editSubject = editSubject;
$(document).ready(function() {
    loadSubjects();
});
