import { User } from '../api/lib/user.js';

function loadUser() {
    const userJson = localStorage.getItem('user');
    const user = User.fromJson(JSON.parse(userJson));
    return function () {
        return user;
    }
}
const user = loadUser()();

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = $('#calendar')[0];

    var daysWithEvents = [];

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
        },
        datesSet: function(info) {
            addEvents().then(() => {
                requestAnimationFrame(() => {
                    applyDayStyles();
                });
            });
        },
        dayCellDidMount: function(info) {
        }
    });

    function addEvents() {
        return new Promise((resolve) => {
            var currentMonth = calendar.getDate().getMonth() + 1;
            var currentYear = calendar.getDate().getFullYear();
            calendar.removeAllEvents();
            daysWithEvents = [];
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
                    daysWithEvents.push(date.toISOString().split('T')[0]);
                }
            }
            resolve();
        });
    }
    
    function applyDayStyles() {
        $('.fc-daygrid-day').each(function() {
            let dateStr = $(this).attr('data-date');
            if (daysWithEvents.includes(dateStr)) {
                $(this).addClass('day-with-tasks');
            } else {
                $(this).removeClass('day-with-tasks');
            }
        });
    }

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
                let status = task.status === 0 ? "PENDING" : task.status === 1 ? "IN_PROGRESS": "COMPLETED";
                let taskHtml = `
                <li class="task ${status}" id="task${index}">
                    <div class="container-row">
                        ${task.name}
                        <div class="circle"></div>
                    </div>     
                    <p id="aditionalInfo${index}" style="display:none">
                        ${task.description}
                    </p>
                </li>`;
                container.append(taskHtml);
                $(`#task${index}`).click(function() {
                    $(`#aditionalInfo${index}`).toggle();
                });
            });
        }
    }

    calendar.render();
    var date = new Date();
    loadTasks(date);
    addEvents().then(() => {
        requestAnimationFrame(() => {
            applyDayStyles();
        });
    });
    
});
