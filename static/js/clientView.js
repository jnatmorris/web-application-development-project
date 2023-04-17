// on the loading of the window
window.onload = () => {
    // call two functions
    generateQRCode();
    renderItems();
};

// temp data which will be shown
const tempData = [
    {
        name: "Brewed Awakening",
        numPunches: 5,
    },
    {
        name: "Daily Grind",
        numPunches: 3,
    },
    {
        name: "Caffeine Fix",
        numPunches: 4,
    },
    {
        name: "Bean Scene",
        numPunches: 8,
    },
    {
        name: "The Roasted Bean",
        numPunches: 1,
    },
    {
        name: "Sam's bar",
        numPunches: 3,
    },
    {
        name: "Grounds for Discussion",
        numPunches: 9,
    },
    {
        name: "Espresso Yourself",
        numPunches: 3,
    },
    {
        name: "Cuppa Joe",
        numPunches: 7,
    },
    {
        name: "The Coffee House",
        numPunches: 3,
    },
    {
        name: "123 Coffee",
        numPunches: 4,
    },
    {
        name: "JFK Airport Express",
        numPunches: 1,
    },
    {
        name: "Water&Food",
        numPunches: 8,
    },
    {
        name: "Tod's fishery",
        numPunches: 1,
    },
    {
        name: "The Music Bar",
        numPunches: 3,
    },
];

// function to generate QR code using API
const generateQRCode = async () => {
    const name = document.getElementById("IDText").innerText.split(" ")[1];

    const newImg = new Image();

    newImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${name}`;

    newImg.onload = () => {
        const imgTag = document.getElementById("qrCode");
        imgTag.src = newImg.src;
    };
};

// function to sort the array of data
const sortArray = (text) => {
    // filter the items that are exactly the same
    const exactMatch = tempData.filter(({ name }) => name.includes(text));
    // filter the items which are not
    const notMatch = tempData.filter(({ name }) => !name.includes(text));

    // concatenate the arrays together
    const wholeArr = [...exactMatch, ...notMatch];

    // render the items using the sorted array
    renderItems(wholeArr);
};

// render the array items
const renderItems = (arr) => {
    // if an array is passed, use it, else use the temp data
    const dataArr = arr ? arr : tempData;

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

    // for all of the tempData, add to DOM
    dataArr.forEach(({ name, numPunches }, index) => {
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
