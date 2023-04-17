// on the loading of the window
window.onload = () => {
    // render items first time
    renderItems();
};

// temp data which will be shown
var tempData = [
    {
        name: "James Hall",
        numPunches: 5,
    },
    {
        name: "John Benitez",
        numPunches: 3,
    },
    {
        name: "Serena Hicks",
        numPunches: 4,
    },
    {
        name: "Darius Ford",
        numPunches: 8,
    },
    {
        name: "Triston Ashley",
        numPunches: 1,
    },
    {
        name: "Krish Mckay",
        numPunches: 3,
    },
    {
        name: "Lindsay Hodges",
        numPunches: 9,
    },
    {
        name: "Kiana Davies",
        numPunches: 3,
    },
    {
        name: "Cuppa Joe",
        numPunches: 7,
    },
];

// global state to store current search value
var searchVal = "";

// ============================================
// function called when adding a punch
const addPunch = (name) => {
    // find the index of the name wanting to change
    const index = tempData.findIndex((x) => x.name === name);

    // add one punch
    tempData[index].numPunches += 1;

    // if 10 or more punches, set back to 0 and alter user
    if (tempData[index].numPunches >= 10) {
        tempData[index].numPunches = 0;
        alert("Got 10 punches!");
    }

    // re-render array
    sortArray(searchVal);
};

// ============================================
// function called when removing a punch
const removePunch = (name) => {
    // find the index of the name wanting to change
    const index = tempData.findIndex((x) => x.name === name);

    // don't allow to decrement below 0
    if (tempData[index].numPunches <= 0) return;

    // remove one punch
    tempData[index].numPunches -= 1;

    // re-render array
    sortArray(searchVal);
};

// ============================================
// function to sort the array of data
const sortArray = (text) => {
    // store current user search to global state
    searchVal = text;

    // filter the items that are exactly the same
    const exactMatch = tempData.filter(({ name }) => name.includes(text));
    // filter the items which are not
    const notMatch = tempData.filter(({ name }) => !name.includes(text));

    // concatenate the arrays together
    const wholeArr = [...exactMatch, ...notMatch];

    // render the items using the sorted array
    renderItems(wholeArr);
};

// ============================================
// render the array items
const renderItems = (arr) => {
    // if an array is passed, use it, else use the temp data
    const dataArr = arr ? arr : tempData;

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
    // for all of the tempData (or array passed), add to DOM
    dataArr.forEach(({ name, numPunches }, index) => {
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
        svgPlus.addEventListener("click", () => addPunch(name));

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
        svgMinus.addEventListener("click", () => removePunch(name));

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
