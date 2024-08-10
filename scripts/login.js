import { User, hashPassword} from "../api/lib/user.js";

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
        event.preventDefault(); // Prevenir el envío del formulario
        $("#error-message").text("");
        $("#error-message").hide();
        let email = $("#email").val();
        let password = $("#password").val();
        let numUsers = parseInt(localStorage.getItem("numUsers"), 10);

        if (isNaN(numUsers) || numUsers <= 0) {
            $("#error-message").text("No users found.");
            $("#error-message").show();
            return;
        }

        let validUserFound = false;
        for (let i = 1; i <= numUsers; i++) {
            let userJson = localStorage.getItem(`user${i}`);
            if (userJson) {
                let user = User.fromJson(JSON.parse(userJson));
                const valid = await user.validateEntry(email, password);
                if (valid) {
                    validUserFound = true;
                    localStorage.setItem("currentUser", i);
                    localStorage.setItem("user", JSON.stringify(user));
                    window.location.href = "task.html";
                    break;
                }
            }
        }

        if (!validUserFound) {
            $("#error-message").text("Invalid username or password");
            $("#error-message").show();
        }
    });

    $("#toggle-password").click(function() {
        let passwordInput = $("#password");
        let type = passwordInput.attr("type") === "password" ? "text" : "password";
        passwordInput.attr("type", type);

        let eyeIcon = type === "password" ? '../images/eye-icon.png' : '../images/eye-slash.png';
        $(this).css("background-image", `url(${eyeIcon})`);
    });
}; 