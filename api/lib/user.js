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
