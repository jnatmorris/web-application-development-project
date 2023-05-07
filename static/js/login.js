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

// allow for the logging in / creation of a new user
const handleSubmitBtn = async () => {
    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;

    // get all of the users
    const loginFetch = await fetch(
        "http://127.0.0.1:8090/api/collections/serviceUsers/records"
    );

    // get json
    const { items } = await loginFetch.json();

    // boolean variable to test if did find the user or not
    var didFind = false;

    items.forEach(async ({ email, password, isUser, id }) => {
        // check if user exists with password and username
        if (usernameInput === email && passwordInput === password) {
            didFind = true;

            // user exists send to client view, else they are a firm
            window.location.href = `http://localhost:3000/pages/${
                isUser ? "clientView" : "firmView"
            }?id=${id}`;
        }
    });

    // if user/shop does not have a sign up, then make a user for entered data
    if (!didFind) {
        const newUserRes = await fetch(
            "http://127.0.0.1:8090/api/collections/serviceUsers/records",
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    // make the name the portion before the @ symbol of the email
                    name: usernameInput.split("@")[0],
                    email: usernameInput,
                    password: passwordInput,
                    isUser: true,
                    punches: JSON.stringify([]),
                }),
            }
        );

        // get the returned id
        const { id } = await newUserRes.json();

        // send new user to their page
        window.location.href = `http://localhost:3000/pages/clientView?id=${id}`;
    }
};
