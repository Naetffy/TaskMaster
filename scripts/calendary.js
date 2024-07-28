import { User } from '../api/lib/user.js';

function loadUser() {
    const userJson = localStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    return function() {
        return user;
    }
}
const user = loadUser()();

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = $('#calendar')[0];

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'title prev,next',
            center: '',
            right: ''
        },
        dateClick: function(info) {
            // Convertir la fecha seleccionada al formato Date
            let selectedDate = new Date(info.dateStr + 'T00:00:00');
            
            // Llamar a la función loadTasks con la fecha seleccionada
            loadTasks(selectedDate);

            calendar.gotoDate(selectedDate);
        }
    });

    calendar.render();

    function loadTasks(date) {
        $("#actual-day").html(date.toDateString());
        let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let conversionDate = month + "/" + day + "/" + date.getFullYear();
        let tasks = user.getTasksOfADay(conversionDate);
        let container = $("#task-list");
        container.html("");
        if (tasks) {
            tasks.forEach((task, index) => {
                let taskHtml = `<li class="task" id="task${index}">${task.name}</li>`;
                container.append(taskHtml);
            });
        }
        calendar.render();
    }

    var date = new Date();
    loadTasks(date);
});
