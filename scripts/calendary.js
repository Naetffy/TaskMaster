import { User } from '../api/lib/user.js';

function loadUser() {
    const userJson = localStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    return function () {
        return user;
    }
}
const user = loadUser()();

document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = $('#calendar')[0];

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'title prev,next',
            center: '',
            right: ''
        },
        dateClick: function (info) {
            // Convertir la fecha seleccionada al formato Date
            let selectedDate = new Date(info.dateStr + 'T00:00:00');

            // Llamar a la función loadTasks con la fecha seleccionada
            loadTasks(selectedDate);

            calendar.gotoDate(selectedDate);
        },
        datesSet: function(info) {
            // Llamar a addEvents cada vez que cambie el rango de fechas del calendario
            addEvents();
        }
    });

    function addEvents() {
        calendar.removeAllEvents();
        var currentMonth = calendar.getDate().getMonth() + 1;
        var currentYear = calendar.getDate().getFullYear();

        for (let day = 1; day <= 31; day++) {
            let date = new Date(currentYear, currentMonth - 1, day);
            if (date.getMonth() + 1 !== currentMonth) break;

            let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
            let dayStr = day < 10 ? "0" + day : day;
            let conversionDate = month + "/" + dayStr + "/" + currentYear;
            let tasks = user.getTasksOfADay(conversionDate);

            if (tasks && tasks.length > 0) {
                let event = {
                    title: tasks.map(task => task.name).join(', '),
                    start: date.toISOString().split('T')[0]
                };
                calendar.addEvent(event);
            }
        }
    }

    // Llamar a addEvents para agregar los eventos del mes actual al calendario
    addEvents();
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
