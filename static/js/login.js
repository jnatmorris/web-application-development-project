var validEmail = false;
var validPass = false;
// email regex from https://stackoverflow.com/a/46181
const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// on the window loading
window.onload = () => {
    $("#InvalidEmail").slideUp(0);

    // get all values
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const submitBtn = document.getElementById("submitBtn");
    const form = document.getElementById("form");

    // add submit listener
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    });

    // function to handle submit button css and disabled properties
    const submitBtnFn = () => {
        switch (validEmail && validPass) {
            case true:
                submitBtn.style.opacity = 1;
                submitBtn.style.cursor = "pointer";
                submitBtn.className = "valid";
                submitBtn.disabled = false;
                break;

            case false:
                submitBtn.style.opacity = 0.4;
                submitBtn.className = "";
                submitBtn.style.cursor = "not-allowed";
                submitBtn.disabled = true;
                break;
        }
    };

    // event listener to run when un-focussing
    usernameInput.addEventListener("blur", () => {
        // switch dependent on if the regex is valid or not. Change border color and set state
        switch (emailRegex.test(usernameInput.value)) {
            case true:
                usernameInput.style.border = "1px solid gray";
                validEmail = true;
                $("#Email").text("Email");
                break;

            case false:
                usernameInput.style.border = "1px solid red";
                validEmail = false;
                $("#Email").text("Email: Invalid");
                break;

            default:
                throw new Error("Error in switch");
        }

        submitBtnFn();
    });

    passwordInput.addEventListener("blur", () => {
        // is there is a password input, then valid pass is true, else false
        validPass = passwordInput.value ? true : false;
        submitBtnFn();
    });

    // on loading, run the function to set the button
    submitBtnFn();
};
