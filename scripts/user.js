import {User} from '../api/lib/user.js';

function loadUser(){
    const userJson = localStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    return function(){
        return user;
    }
}
const user = loadUser()();
if (document.readyState !== 'loading') {
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        myInitCode();
    });
}
function myInitCode() {
    let actualIndex = localStorage.getItem('currentUser');
    if (localStorage.getItem(`userPhoto${actualIndex}`)) {
        $('#user-photo-img').attr('src', localStorage.getItem(`userPhoto${actualIndex}`));
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
                let actualIndex = localStorage.getItem('currentUser');
                localStorage.setItem(`userPhoto${actualIndex}`, e.target.result);
                $('#user-photo-img').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    $('#exit-btn').on('click', function() {
        console.log('exit');
        localStorage.removeItem('user');
        localStorage.removeItem('currentUser');
        window.location.href = "login.html";
    });
};