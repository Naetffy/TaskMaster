
class User {
    constructor(name, email, calendary) {
        this.name = name;
        this.email = email;
        this.subjects = [];
        this.calendary = calendary;
    }
    static fromJson(json) {
        let calendary = Calendary.fromJson(json.calendary);
        const user = new User(json.name, json.email, calendary);
        user.subjects = [];
        for (let i = 0; i < json.subjects.length; i++) {
            user.subjects.push(Subject.fromJson(json.subjects[i]));
        }
        return user;
    
    }

    addSubject(subject) {
        this.subjects.push(subject);
    }

    getSubjects() {
        return this.subjects;
    }

    addTask(date, task) {
        this.calendary.addTask(date, task);
    }

    getAllTasks(){
        return this.calendary.tasks;
    }

    deleteTask(date, task){
        this.calendary.deleteTask(date,task);
    }
}

class Calendary {
    constructor(user) {
        this.user = user;
        this.tasks = {};
    }

    static fromJson(json) {
        let tasks = {};
        for (let date in json.tasks) {
            tasks[date] = json.tasks[date].map(task => Task.fromJson(task));
        }
        const calendary = new Calendary(json.user);
        calendary.tasks = tasks;
        return calendary;
    }

    addTask(date, task) {
        if (!this.tasks[date]) {
            this.tasks[date] = [];
        }
        this.tasks[date].push(task);
    }

    deleteTask(date,index){
        if(this.tasks[date]){
            this.tasks[date].splice(index,1);
        }
    }
}

class Subject {
    constructor(name) {
        this.name = name;
        this.grades = [];
        this.finalGrade = 0;
    }

    static fromJson(json) {
        const subject = new Subject(json.name);
        subject.grades = json.grades;
        subject.finalGrade = json.finalGrade;
        return subject;
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
    constructor(name, description ,subject) {
        this.name = name;
        this.description = description;
        this.subject = subject;
        this.status = Status.PENDING;
        this.grade = null;
    }

    static fromJson(json) {
        let subject = Subject.fromJson(json.subject);
        const task = new Task(json.name, json.description, subject);
        task.status = json.status;
        task.grade = json.grade;
        return task;
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

    static toString(status) {
        switch (status) {
            case Status.PENDING:
                return 'PENDING';
            case Status.IN_PROGRESS:
                return 'IN_PROGRESS';
            case Status.COMPLETED:
                return 'COMPLETED';
        }
    }
    static values() {
        return ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    }
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

const RECOHomework = new Task('Homework1 RECO', "Realizar maquina virtual implementando el una base de datos" , RECO);
const IAIAHomework = new Task('Homework1 IAIA', "Entender una red neuronal no convulcional",IAIA);
const IAIAHomework2 = new Task('Homework2 IAIA', "Entender una red neuronal convulcional",IAIA);

userCalendar.addTask('2024-07-21', RECOHomework);
userCalendar.addTask('2024-07-22', IAIAHomework);
userCalendar.addTask('2024-07-23', IAIAHomework2);

if (!sessionStorage.getItem('user')) sessionStorage.setItem('user', JSON.stringify(user));

export { User, Calendary, Subject, Task, Status };