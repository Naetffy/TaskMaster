//Agregar el mensaje de bienvenida con el nombre de usuario registrado
function addUserName(){
    const userJson = sessionStorage.getItem('user');
    const user = JSON.parse(userJson);
    const newSpan = `<span>Welcome, ${user.name}</span>`;
    $("#user-container").prepend(newSpan);
}


$(document).ready(function() {
    fetch('../components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            addUserName();
        })
        .catch(error => console.error('Error loading the navbar:', error));
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