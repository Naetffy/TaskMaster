
class User {
    constructor(name, email, calendary) {
        this.name = name;
        this.email = email;
        this.subjects = [];
        this.calendary = calendary;
    }

    addSubject(subject) {
        this.subjects.push(subject);
    }
}

class Calendary {
    constructor(user) {
        this.user = user;
        this.tasks = {};
    }

    addTask(date, task) {
        if (!this.tasks[date]) {
            this.tasks[date] = [];
        }
        this.tasks[date].push(task);
    }
}

class Subject {
    constructor(name) {
        this.name = name;
        this.grades = [];
        this.finalGrade = 0;
    }

    addGrade(grade, percentage) {
        this.grades.push([grade, percentage]);
        this.calculateFinalGrade();
    }

    calculateFinalGrade() {
        let finalGrade = 0;
        for (let i = 0; i < this.grades.length; i++) {
            finalGrade += this.grades[i][0] * this.grades[i][1];
        }
        this.finalGrade = finalGrade;
    }

    getFinalGrade() {
        return this.finalGrade;
    }
}

class Task {
    constructor(name, subject) {
        this.name = name;
        this.subject = subject;
        this.status = Status.PENDING;
        this.grade = null;
    }

    start() {
        this.status = Status.IN_PROGRESS;
    }

    complete() {
        this.status = Status.COMPLETED;
    }

    setGrade(grade) {
        this.grade = grade;
    }
}

class Status {
    static PENDING = 0;
    static IN_PROGRESS = 1;
    static COMPLETED = 2;
}

// Crear instancias de las clases
const userCalendar = new Calendary();
const user = new User('John Doe', 'johndoe@example.com', userCalendar);

// Añadir materias
const RECO = new Subject('Redes computacionales');
const IAIA = new Subject('Intro. a la inteligencia artificial');

user.addSubject(RECO);
user.addSubject(IAIA);

// Añadir calificaciones a las materias
RECO.addGrade(40, 0.3);
RECO.addGrade(40, 0.3);


console.log(`Final grade in Math: ${RECO.getFinalGrade()}`); // Final grade in Math: 88
console.log(`Final grade in Science: ${IAIA.getFinalGrade()}`); // Final grade in Science: 77.5

const RECOHomework = new Task('Homework 1', RECO);
const IAIAHomework = new Task('Homework 1', IAIA);

userCalendar.addTask('2024-07-21', RECOHomework);
userCalendar.addTask('2024-07-22', IAIAHomework);

window.user = user;