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