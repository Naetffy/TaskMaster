
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
        user.password = json.password;
        user.subjects = [];
        for (let i = 0; i < json.subjects.length; i++) {
            user.subjects.push(Subject.fromJson(json.subjects[i]));
        }
        return user;
    
    }

    async setPassword(password) {
        this.password = await hashPassword(password);
    }
    
    async validateEntry(email, password) {
        const hashedPassword = await hashPassword(password); // Espera a que se resuelva el hash
        return this.email === email && this.password === hashedPassword;
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
    getTasksOfADay(date){
        return this.calendary.tasks[date];
    }

    getPendingTasks(){
        return this.calendary.getPendingTasks();
    }

    getInProgressTasks(){
        return this.calendary.getInProgressTasks();
    }

    getCompletedTasks(){
        return this.calendary.getCompletedTasks();
    }

    deleteTask(date, task){
        this.calendary.deleteTask(date,task);
    }

    deleteSubject(index){
        if(this.subjects[index]){
            this.subjects.splice(index,1);
        }
    }
    getNumberOfSubjects(){
        return this.subjects.length;
    }
    getNumberOfTasks(){
        let numberOfTasks = 0;
        for(let date in this.calendary.tasks){
            numberOfTasks += this.calendary.tasks[date].length;
        }
        return numberOfTasks;
    }
    getSelectedSubject(index){
        return this.subjects[index];
    }
    getGradeSemester(){
        let total = 0;
        let finalGrade = 0;
        for(let i=0; i<this.subjects.length; i++){
            const credits = this.subjects[i].getNumberOfCredits();
            const grade = this.subjects[i].getFinalGrade();
            finalGrade += credits*grade;
            total += credits;
        }
        return (finalGrade/total).toFixed(2);
    }
    checkExistingSubject(name){
        let flag =  this.subjects.some(subject => subject.name === name);
        console.log(flag);
        return flag;
    }
    getIndexOfTask(){
        return this.calendary.orderOfTasks;
    }
    checkExistingTask(date,name){
        const currentTasks = this.getTasksOfADay(date);
        if(currentTasks){
            return currentTasks.some(task => task.name === name); 
        }
    }
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
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

    getPendingTasks(){
        let pendingTasks = [];
        for(let date in this.tasks){
            for(let i = 0; i < this.tasks[date].length; i++){
                if(this.tasks[date][i].status === Status.PENDING){
                    pendingTasks.push(this.tasks[date][i]);
                }
            }
        }
        return pendingTasks;
    }

    getInProgressTasks(){
        let inProgressTasks = [];
        for(let date in this.tasks){
            for(let i = 0; i < this.tasks[date].length; i++){
                if(this.tasks[date][i].status === Status.IN_PROGRESS){
                    inProgressTasks.push(this.tasks[date][i]);
                }
            }
        }
        return inProgressTasks;
    }

    getCompletedTasks(){
        let completedTasks = [];
        for(let date in this.tasks){
            for(let i = 0; i < this.tasks[date].length; i++){
                if(this.tasks[date][i].status === Status.COMPLETED){
                    completedTasks.push(this.tasks[date][i]);
                }
            }
        }
        return completedTasks;
    }

    addTask(date, task) {
        if (!this.tasks[date]) {
            this.tasks[date] = [];
        }
        task.setDate(date);
        this.tasks[date].push(task);
        this.setIdTasks(date);
    }

    deleteTask(date,index){
        if(this.tasks[date]){
            this.tasks[date].splice(index,1);
            this.setIdTasks(date);
        }
    }

    setIdTasks(date){
        for(let i = 0; i < this.tasks[date].length; i++){
            this.tasks[date][i].setId(i);
        }
    }
}

class Subject {
    constructor(name,minimum,credits) {
        this.name = name;
        this.grades = [];
        this.finalGrade = 0;
        this.passing = false;
        this.minimum = minimum;
        this.credits = credits;
    }

    static fromJson(json) {
        const subject = new Subject(json.name);
        subject.grades = json.grades;
        subject.finalGrade = json.finalGrade;
        subject.passing = json.passing;
        subject.minimum = json.minimum;
        subject.credits = json.credits;
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
        this.finalGrade = finalGrade.toFixed(2);
        this.passing = this.finalGrade >= this.minimum;
    }

    getFinalGrade() {
        return this.finalGrade;
    }

    getGrades(){
        return this.grades;
    }
    getNumberOfCredits(){
        return this.credits;
    }
}

class Task {
    constructor(name, description ,subject) {
        this.name = name;
        this.description = description;
        this.subject = subject;
        this.status = Status.PENDING;
        this.grade = null;
        this.date = null;
        this.id = null;
    }

    static fromJson(json) {
        let subject = Subject.fromJson(json.subject);
        const task = new Task(json.name, json.description, subject);
        task.status = json.status;
        task.grade = json.grade;
        task.date = json.date;
        task.id = json.id;
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

    setDate(date){
        this.date = date;
    }

    setId(id){
        this.id = id;
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
await user.setPassword("Contraseña123");

// Añadir materias
const RECO = new Subject('Redes computacionales',30);
const IAIA = new Subject('Intro. a la inteligencia artificial',30);

user.addSubject(RECO);
user.addSubject(IAIA);

// Añadir calificaciones a las materias
RECO.addGrade(40, 0.3);
RECO.addGrade(40, 0.3);

const RECOHomework = new Task('Homework1 RECO', "Realizar maquina virtual implementando el una base de datos" , RECO);
const IAIAHomework = new Task('Homework1 IAIA', "Entender una red neuronal no convulcional",IAIA);
const IAIAHomework2 = new Task('Homework2 IAIA', "Entender una red neuronal convulcional",IAIA);

userCalendar.addTask('07/27/2024', RECOHomework);
userCalendar.addTask('07/27/2024', IAIAHomework);
userCalendar.addTask('07/27/2024', IAIAHomework2);

if (!localStorage.getItem('user1')) {
    localStorage.setItem('numUsers', 1);
    localStorage.setItem('user1', JSON.stringify(user));
}

export { User, Calendary, Subject, Task, Status, hashPassword};