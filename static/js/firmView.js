// global state to store current search value
var searchVal = "";

var userValuesGlobal = {
    id: "",
    punches: [""],
    email: "",
    name: "",
    isUser: false,
};

window.onload = async () => {
    // get id from the query in the url
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const loginFetch = await fetch(
        `http://127.0.0.1:8090/api/collections/serviceUsers/records/${id}`
    );

    // if firm does not exist, send to index
    if (loginFetch.status === 404) {
        window.location.href = "http://localhost:3000/pages/index.html";
        return;
    }

    const { punches, isUser, email, ID } = await loginFetch.json();

    userValuesGlobal = {
        punches: JSON.parse(punches),
        isUser,
        email,
        ID,
        id,
    };

    renderItems(userValuesGlobal.punches);
};

const addUser = async () => {
    const IDField = document.getElementById("idInput").value;
    const numPunchesField = document.getElementById("numPunchesField").value;

    const getUserName = await fetch(
        `http://127.0.0.1:8090/api/collections/serviceUsers/records/${IDField}`,
        {
            method: "GET",
        }
    );

    // if user does not exist with that ID, then it returns 404
    if (getUserName.status === 404) return;

    // get the name of the user
    const { name } = await getUserName.json();

    // append to the punches JSON the new user and punches
    userValuesGlobal.punches.push({
        ID: IDField,
        name: name,
        numPunches: Number(numPunchesField),
    });

    // tell database to add new JSON on punches
    fetch(
        `http://127.0.0.1:8090/api/collections/serviceUsers/records/${userValuesGlobal.id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...userValuesGlobal,
                punches: JSON.stringify(userValuesGlobal.punches),
            }),
        }
    );

    // re-sort array using the search value
    sortArray(searchVal);
};

// ============================================
// function called when adding a punch
const addPunch = async (ID) => {
    // find the index of the ID wanting to change
    const index = userValuesGlobal.punches.findIndex((x) => x.ID === ID);

    // add one punch
    userValuesGlobal.punches[index].numPunches += 1;

    // if 10 or more punches, set back to 0 and alter user
    if (userValuesGlobal.punches[index].numPunches >= 10) {
        userValuesGlobal.punches[index].numPunches = 0;
        alert("Got 10 punches!");
    }

    // add a new punch in the firm's ID's punches JSON
    fetch(
        `http://127.0.0.1:8090/api/collections/serviceUsers/records/${userValuesGlobal.id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...userValuesGlobal,
                punches: JSON.stringify(userValuesGlobal.punches),
            }),
        }
    );

    // re-render array
    sortArray(searchVal);
};

// ============================================
// function called when removing a punch
const removePunch = (ID) => {
    // find the index of the ID wanting to change
    const index = userValuesGlobal.punches.findIndex((x) => x.ID === ID);

    // don't allow to decrement below 0
    if (userValuesGlobal.punches[index].numPunches <= 0) return;

    // remove one punch
    userValuesGlobal.punches[index].numPunches -= 1;

    // remove punch in the firm's ID's punches JSON
    fetch(
        `http://127.0.0.1:8090/api/collections/serviceUsers/records/${userValuesGlobal.id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...userValuesGlobal,
                punches: JSON.stringify(userValuesGlobal.punches),
            }),
        }
    );

    // re-render array
    sortArray(searchVal);
};

// ============================================
// function to sort the array of data
const sortArray = (text) => {
    // store current user search to global state
    searchVal = text;

    // filter the items that are exactly the same
    const exactMatch = userValuesGlobal.punches.filter(({ name }) =>
        name.includes(text)
    );
    // filter the items which are not
    const notMatch = userValuesGlobal.punches.filter(
        ({ name }) => !name.includes(text)
    );

    // concatenate the arrays together
    const wholeArr = [...exactMatch, ...notMatch];

    // render the items using the sorted array
    renderItems(wholeArr);
};

// ============================================
// render the array items
const renderItems = (arr) => {
    // if an array is passed, use it, else use the temp data
    const dataArr = arr ? arr : userValuesGlobal.punches;

    // ============================================
    // clear the contents of the container and make a new sticky header
    const contentContainer = document.getElementById("contentContainer");
    contentContainer.innerHTML = "";

    const stickyElem = document.createElement("div");
    stickyElem.className = "threeColGrid sticky";

    // ============================================
    // create the three paragraph elements
    const p1 = document.createElement("p");
    p1.innerHTML = "Customers";
    p1.className = "textCenter";

    const p2 = document.createElement("p");
    p2.innerHTML = "Add / Subtract";
    p2.className = "textCenter";

    const p3 = document.createElement("p");
    p3.innerHTML = "# of Punches";
    p3.className = "textCenter";

    // ============================================
    // append the children to the sticky element and append the sticky element
    stickyElem.appendChild(p1);
    stickyElem.appendChild(p2);
    stickyElem.appendChild(p3);
    contentContainer.appendChild(stickyElem);

    // ============================================
    // for all of the punchesRes (or array passed), add to DOM
    dataArr.forEach(({ ID, numPunches, name }, index) => {
        // ============================================
        // create the outer div of the row
        const outerThreeColGrid = document.createElement("div");

        // every other row has the odd class (makes it a dark background)
        outerThreeColGrid.className =
            index % 2 === 0 ? "threeColGrid border odd" : "threeColGrid border";

        // ============================================
        // create and format the first row element, the customers and add to DOM
        const nameElem = document.createElement("p");
        nameElem.innerText = name;
        nameElem.className = "textCenter";
        outerThreeColGrid.appendChild(nameElem);

        // ============================================
        // create div holding plus and minus btns
        const innerTwoGrid = document.createElement("div");
        innerTwoGrid.className = "twoColGrid";

        // ============================================
        // create svg element
        const svgPlus = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        svgPlus.setAttribute("fill", "none");
        svgPlus.setAttribute("viewBox", "0 0 24 24");
        svgPlus.setAttribute("stroke-width", "1.5");
        svgPlus.setAttribute("stroke", "currentColor");
        svgPlus.setAttribute("class", "itemsCenter");

        // create path element
        const path1 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        path1.setAttribute("stroke-linecap", "round");
        path1.setAttribute("stroke-linejoin", "round");
        path1.setAttribute("d", "M12 4.5v15m7.5-7.5h-15");

        // add event listener to fire on click
        svgPlus.addEventListener("click", () => addPunch(ID));

        // append path to svg
        svgPlus.appendChild(path1);

        // ============================================
        // create svg element
        const svgMinus = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        svgMinus.setAttribute("fill", "none");
        svgMinus.setAttribute("viewBox", "0 0 24 24");
        svgMinus.setAttribute("stroke-width", "1.5");
        svgMinus.setAttribute("stroke", "currentColor");
        svgMinus.setAttribute("class", "itemsCenter");

        // create path element
        const path2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        path2.setAttribute("stroke-linecap", "round");
        path2.setAttribute("stroke-linejoin", "round");
        path2.setAttribute("d", "M19.5 12h-15");

        // add event listener to fire on click
        svgMinus.addEventListener("click", () => removePunch(ID));

        // append path to svg
        svgMinus.appendChild(path2);

        // ============================================
        // add plus and minus svgs to div holding them
        innerTwoGrid.appendChild(svgPlus);
        innerTwoGrid.appendChild(svgMinus);

        // ============================================
        // create the # of punches element
        const numPunchesElem = document.createElement("p");
        numPunchesElem.innerText = numPunches;
        numPunchesElem.className = "textCenter";

        // ============================================
        // add everything to DOM
        outerThreeColGrid.appendChild(innerTwoGrid);
        outerThreeColGrid.appendChild(numPunchesElem);
        contentContainer.appendChild(outerThreeColGrid);
    });
};
