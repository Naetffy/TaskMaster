import { User } from '../api/lib/user.js';
// scripts/script.js
$(document).ready(function() {
    let user = null;

    const userData = sessionStorage.getItem('user');
    if (userData) {
        user = User.fromJSON(userData);
    }

    if (user) {
        const userInfo = `
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <h3>Subjects:</h3>
            <ul>
                ${user.subjects.map(subject => `
                    <li>
                        ${subject.name} - Final Grade: ${subject.getFinalGrade()}
                        <ul>
                            ${subject.grades.map(grade => `
                                <li>Grade: ${grade[0]}, Percentage: ${grade[1]}</li>
                            `).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ul>
            <h3>Tasks:</h3>
            <ul>
                ${Object.keys(user.calendary.tasks).map(date => `
                    <li>
                        ${date}
                        <ul>
                            ${user.calendary.tasks[date].map(task => `
                                <li>${task.name} - Status: ${task.status} - Grade: ${task.grade || 'N/A'}</li>
                            `).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ul>
        `;

        $('#TemporaryDiv').html(userInfo);
    } else {
        $('#TemporaryDiv').html('<p>No user data found.</p>');
    }
});
