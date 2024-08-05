import {User} from '../api/lib/user.js';

function loadUser(){
    const userJson = localStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    return function(){
        return user;
    }
}
const user = loadUser()();

document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem('userPhoto')) {
        $('#user-photo-img').attr('src', localStorage.getItem('userPhoto'));
    }
    let userName = $("#user-name");
    userName.html(user.name);
    let numberOfSubjects = $("#number-of-subjects");
    numberOfSubjects.html(user.getNumberOfSubjects());
    let numberOfTasks = $("#number-of-tasks");
    numberOfTasks.html(user.getNumberOfTasks());
    $('#edit-photo-btn').on('click', function() {
        $('#photo-input').click();
    });

    $('#photo-input').on('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('userPhoto', e.target.result);
                $('#user-photo-img').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
});