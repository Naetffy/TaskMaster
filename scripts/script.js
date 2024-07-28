//Agregar el mensaje de bienvenida con el nombre de usuario registrado
function addUserName(){
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const newSpan = `<span>Welcome, ${user.name}</span>`;
    $("#user-container").prepend(newSpan);
}


document.addEventListener("DOMContentLoaded", function() {
    if (!sessionStorage.getItem('navbar')) {
        fetch('../components/navbar.html')
            .then(response => response.text())
            .then(data => {
                sessionStorage.setItem('navbar', data);
                document.getElementById('navbar-placeholder').innerHTML = data;
                addUserName();
                highlightActiveNav();
            })
            .catch(error => console.error('Error loading the navbar:', error));
    }
    else{
        $("#navbar-placeholder").html(sessionStorage.getItem('navbar'));
        addUserName();
        highlightActiveNav();
    }
});

function highlightActiveNav() {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('#nav-container li a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `..${path}`) {
            link.classList.add('active');
        }
        else {
            link.classList.remove('active');
        }
    });
}

