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


function countGrades(){
    let count = 3;
    return function(){
        count +=1;
        return count;
    }
}

let numberOfGrades = countGrades();

function addGrade(){
    let index = numberOfGrades();
    const newGrade = `<div class="subject-container items">
                <label><b>Grade ${index}</b></label>
                <div class = "subject-information">
                    <input type="text" class = "input-size">
                    <input type="text" class = "input-size">
                </div>
            </div>`;
    $('#subjects-container').append(newGrade);
}


function addSubject(){
    let subjectTitle = $("#subject-name").val();
    let subject = new Subject(subjectTitle);
    let values = $('.subject-information').children();
    for(let i=0;i<values.length;i+=2){
        let grade = $(values[i]).val();
        let percentage = $(values[i+1]).val();
        subject.addGrade(grade,percentage);
    }
    user.addSubject(subject);
    localStorage.setItem('user', JSON.stringify(user));
    console.log(user.getSubjects());
}



window.addGrade = addGrade;
window.addSubject = addSubject;
