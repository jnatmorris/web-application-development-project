// on the loading of the window
var punchesRes;

window.onload = async () => {
    // get the url params
    const params = new URLSearchParams(window.location.search);
    // get the id param
    const myID = params.get("id");

    const testExist = await fetch(
        `http://127.0.0.1:8090/api/collections/serviceUsers/records/${myID}`
    );

    // if user does not exist, send to index
    if (testExist.status === 404) {
        window.location.href = "http://localhost:3000/pages/index.html";
        return;
    }

    const punchesFetch = await fetch(
        `http://127.0.0.1:8090/api/collections/serviceUsers/records`
    );

    const { items } = await punchesFetch.json();

    const userPunches = [];

    items.forEach(({ isUser, punches, id, name }) => {
        // if the element in the array is a user, skip
        if (isUser) return;

        // get the punchesJSON
        const punchesJSON = JSON.parse(punches);

        // go over array appending where the user id matcher the id in the punches array
        punchesJSON.forEach(({ ID, numPunches }) => {
            if (ID === myID) {
                userPunches.push({
                    ID: id,
                    numPunches: numPunches,
                    name: name,
                });
            }
        });
    });

    // call the generate qrcode function with id
    generateQRCode(myID);

    // set the punches variable with array just populated
    punchesRes = userPunches;

    // render the items based on the populated array
    renderItems(punchesRes);
};

// function to generate QR code using API
const generateQRCode = (id) => {
    // get the inner text of the span with the id "id"
    document.getElementById("id").innerText = ` ${id}`;

    const newImg = new Image();

    // generate the QR code based on the id
    newImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`;

    newImg.onload = () => {
        const imgTag = document.getElementById("qrCode");
        imgTag.src = newImg.src;
    };
};

// function to sort the array of data
const sortArray = (text) => {
    // filter the items that are exactly the same
    const exactMatch = punchesRes.filter(({ ID }) => ID.includes(text));
    // filter the items which are not
    const notMatch = punchesRes.filter(({ ID }) => !ID.includes(text));

    // concatenate the arrays together
    const wholeArr = [...exactMatch, ...notMatch];

    // render the items using the sorted array
    renderItems(wholeArr);
};

// render the array items
const renderItems = (arr) => {
    // if an array is passed, use it, else use the temp data
    const dataArr = arr ? arr : punchesRes;

    // ============================================
    // clear the contents of the container and make a new sticky header
    const contentContainer = document.getElementById("contentContainer");
    contentContainer.innerHTML = "";

    const stickyElem = document.createElement("div");
    stickyElem.className = "twoColGrid sticky";

    // ============================================
    // create the two elements in a row
    const p1 = document.createElement("p");
    p1.innerHTML = "Firms";
    p1.className = "textCenter";

    const p2 = document.createElement("p");
    p2.innerHTML = "Firms";
    p2.className = "textCenter";

    // ============================================
    // append the children to the sticky element and append the sticky element
    stickyElem.appendChild(p1);
    stickyElem.appendChild(p2);
    contentContainer.appendChild(stickyElem);

    // for all of the data, add to DOM
    dataArr.forEach(({ numPunches, name }, index) => {
        // create the outer div of the row
        const newElem = document.createElement("div");

        // every other row has the odd class (makes it a dark background)
        if (index % 2 === 0) {
            newElem.className = "twoColGrid border odd";
        } else {
            newElem.className = "twoColGrid border";
        }

        // ============================================
        // set the values of the element
        const nameElem = document.createElement("p");
        nameElem.className = "textCenter";
        nameElem.innerText = name;

        // ============================================
        // set the values of the element
        const numPunchesElem = document.createElement("p");
        numPunchesElem.className = "textCenter";
        numPunchesElem.innerText = numPunches;

        // ============================================
        // append to the row and append row to container
        newElem.appendChild(nameElem);
        newElem.appendChild(numPunchesElem);
        contentContainer.appendChild(newElem);
    });
};
