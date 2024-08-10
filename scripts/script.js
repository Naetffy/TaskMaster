//Agregar el mensaje de bienvenida con el nombre de usuario registrado
function addUserName(){
    if (!localStorage.getItem('user')) {
        window.location.href = 'login.html';
    }
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const newSpan = `<span>Welcome, ${user.name}</span>`;
    $("#user-container").prepend(newSpan);
}

if (document.readyState !== 'loading') {
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        myInitCode();
    });
}

function myInitCode() {
    fetch('../components/navbar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar-placeholder').innerHTML = data;
                addUserName();
                highlightActiveNav();
                let actualIndex = localStorage.getItem('currentUser');
                if (localStorage.getItem(`userPhoto${actualIndex}`)) {
                    $('#user-img').attr('src', localStorage.getItem(`userPhoto${actualIndex}`));
                }
            })
            .catch(error => console.error('Error loading the navbar:', error));
}

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

