import { User } from '../api/lib/user.js';
// Modelo
class UserModel {
    constructor() {
        // Carga el usuario desde el almacenamiento local al crear una instancia de UserModel
        this.user = this.loadUser();
    }

    loadUser() {
        // Recupera el JSON del usuario desde el almacenamiento local y lo convierte a un objeto User
        const userJson = localStorage.getItem('user');
        return User.fromJson(JSON.parse(userJson));
    }

    getUser() {
        // Devuelve el objeto User cargado
        return this.user;
    }

    getNumberOfSubjects() {
        // Devuelve el número de materias del usuario
        return this.user.getNumberOfSubjects();
    }

    getNumberOfTasks() {
        // Devuelve el número de tareas del usuario
        return this.user.getNumberOfTasks();
    }

    updatePhoto(photoData) {
        // Actualiza la foto del usuario en el almacenamiento local usando el índice del usuario actual
        const actualIndex = localStorage.getItem('currentUser');
        localStorage.setItem(`userPhoto${actualIndex}`, photoData);
    }

    getPhoto() {
        // Recupera la foto del usuario desde el almacenamiento local usando el índice del usuario actual
        const actualIndex = localStorage.getItem('currentUser');
        return localStorage.getItem(`userPhoto${actualIndex}`);
    }

    exit() {
        // Elimina los datos del usuario del almacenamiento local y borra el índice del usuario actual
        localStorage.removeItem('user');
        localStorage.removeItem('currentUser');
    }
}

// Vista
class UserView {
    constructor() {
        // Inicializa las referencias a los elementos del DOM
        this.userPhotoImg = $('#user-photo-img');
        this.userName = $("#user-name");
        this.numberOfSubjects = $("#number-of-subjects");
        this.numberOfTasks = $("#number-of-tasks");
        this.editPhotoBtn = $('#edit-photo-btn');
        this.photoInput = $('#photo-input');
        this.exitBtn = $('#exit-btn');
    }

    updateUserInfo(user) {
        // Actualiza la vista con la información del usuario (nombre, número de materias y tareas)
        this.userName.html(user.name);
        this.numberOfSubjects.html(user.getNumberOfSubjects());
        this.numberOfTasks.html(user.getNumberOfTasks());
    }

    updateUserPhoto(photo) {
        // Actualiza la vista con la foto del usuario
        this.userPhotoImg.attr('src', photo);
    }

    bindEditPhoto(handler) {
        // Asocia el evento de clic del botón de edición de foto con el manejador proporcionado
        this.editPhotoBtn.on('click', handler);
    }

    bindPhotoInput(handler) {
        // Asocia el evento de cambio del input de foto con el manejador proporcionado
        this.photoInput.on('change', handler);
    }

    bindExit(handler) {
        // Asocia el evento de clic del botón de salida con el manejador proporcionado
        this.exitBtn.on('click', handler);
    }
}

// Controlador
class UserController {
    constructor(model, view) {
        // Inicializa el controlador con el modelo y la vista proporcionados
        this.model = model;
        this.view = view;

        // Asocia los eventos de la vista con los manejadores del controlador
        this.view.bindEditPhoto(this.handleEditPhoto.bind(this));
        this.view.bindPhotoInput(this.handlePhotoInput.bind(this));
        this.view.bindExit(this.handleExit.bind(this));

        // Inicializa la vista con la información del usuario
        this.init();
    }

    init() {
        // Obtiene el usuario y la foto del modelo y actualiza la vista
        const user = this.model.getUser();
        const photo = this.model.getPhoto();
        this.view.updateUserInfo(user);
        if (photo) {
            this.view.updateUserPhoto(photo);
        }
    }

    handleEditPhoto() {
        // Abre el diálogo de selección de archivo de foto al hacer clic en el botón de editar foto
        this.view.photoInput.click();
    }

    handlePhotoInput(event) {
        // Maneja la carga de una nueva foto
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Actualiza la foto del modelo y la vista con la nueva foto
                this.model.updatePhoto(e.target.result);
                this.view.updateUserPhoto(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    handleExit() {
        // Maneja la salida del usuario, eliminando los datos del almacenamiento local y redirigiendo a la página de inicio de sesión
        this.model.exit();
        window.location.href = "login.html";
    }
}

// Inicialización
$(document).ready(function() {
    const model = new UserModel();
    const view = new UserView();
    new UserController(model, view);
});
