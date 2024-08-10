import { User } from "../api/lib/user.js";

if (document.readyState !== 'loading') {
    myInitCode();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        myInitCode();
    });
}
async function myInitCode() {
    let form = $("#login-form")[0];
    $("#login-form").show();
    form.addEventListener("submit", async function(event) {
        $("#error-message").text("");
        $("#error-message").hide();
        event.preventDefault(); // Prevenir el envío del formulario
        let name = $("#name").val();
        let email = $("#email").val();
        let password = $("#password").val();
        let passwordConfirm = $("#password-confirm").val();
        let numUsers = parseInt(localStorage.getItem("numUsers"), 10);

        if (name.length > 20){
            $("#error-message").text("The name must contain less than 20 characters.");
            $("#error-message").show();
            return;
        }
        if (password !== passwordConfirm) {
            $("#error-message").text("The passwords do not match.");
            $("#error-message").show();
            return;
        }
        if (validateEmail(email) === false) {
            $("#error-message").text("Invalid email.");
            $("#error-message").show();
            return;
        }
        if (validatePassword(password) === false) {
            $("#error-message").text("The password must contain at least 6 characters, one uppercase letter and one special character.");
            $("#error-message").show();
            return;
        }
        if (numUsers === null){
            numUsers = 0;
        }
        let user = new User(name, email, password);
        await user.setPassword(password);
        numUsers++;
        localStorage.setItem("numUsers", numUsers);
        localStorage.setItem(`user${numUsers}`, JSON.stringify(user));
        window.location.href = "login.html";
    });

    $("#toggle-password").click(function() {
        let passwordInput = $("#password");
        let type = passwordInput.attr("type") === "password" ? "text" : "password";
        passwordInput.attr("type", type);

        let eyeIcon = type === "password" ? '../images/eye-icon.png' : '../images/eye-slash.png';
        $(this).css("background-image", `url(${eyeIcon})`);
    });
}; 

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    return passwordRegex.test(password);
  };