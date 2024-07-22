
document.addEventListener("DOMContentLoaded", function() {
    fetch('../components/navbar.html')
        .then(response => response.text())
        .then(data => {
            console.log("prueba");
            document.getElementById('navbar-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading the navbar:', error));
});