
fetch('teams.json')
.then(response => response.json())
.then(data => {
    const teams = data.teams;
    let predictions = [];
    let backup = [];
    console.log(teams);
    initializeUI(teams, predictions, backup);
})

let lastTargetIndex = null;
let tablesDiv = document.getElementById('tablesDiv');


function initializeUI(teams, predictions, backup) {
    const newTableButton = document.getElementById("newTableButton");
    const predictionForm = document.getElementById("predictionForm");

    predictionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        validateForm(predictionForm);
        const formData = new FormData(e.target);
        console.log(formData);
    })

    newTableButton.addEventListener("click", function(ev) {
        ev.preventDefault();
        createNewTable(teams, predictions)
    });

    document.addEventListener('click', (e) => {
        if (e.target.matches('.removeTableButton')) {
            e.preventDefault();
            removeTable(e.target)
        }
    });



    initializeDragAndDrop(teams, predictions, backup);
}

function initializeDragAndDrop(teams, predictions, backup) {

    tablesDiv.addEventListener('dragstart', (e) => {
        console.log(`aloitettiin raahaus kohteelle ${e.target.textContent}`)
        let row = e.target.closest('.teamrow');
        let rowIndex = row.getAttribute('data-index');
        let originTable = row.closest('.leaguetable');
        let originTableIndex = originTable.getAttribute('data-index');
        e.target.classList.add('dragging');

        const payload = {
            name: e.target.textContent,
            originalPosition: rowIndex,
            table: originTable.getAttribute('data-index')
        };
        e.dataTransfer.setData('application/json', JSON.stringify(payload));
        e.dataTransfer.dropEffect = 'move';

        console.log(`dragin payload on ${e.dataTransfer.getData('application/json')}`);
        console.log(`teams: ${teams}`);
        console.log(`predictions: ${JSON.stringify(predictions)}`);
        // Saves the original state of prediction in case d&d fails
        backup = [...predictions[originTableIndex]]
    })

    tablesDiv.addEventListener('dragover', (e) => {
        e.preventDefault();
        let row = e.target.closest('.teamrow');
        if (row) {
            row.classList.add('droppable');
        }
    });

    tablesDiv.addEventListener('dragleave', (e) => {
        e.preventDefault();
        let row = e.target.closest('.teamrow');
        if (row) {
            row.classList.remove('droppable');
        }
    })


    tablesDiv.addEventListener('drop', (e) => {
        e.preventDefault();
        let payload = JSON.parse(e.dataTransfer.getData('application/json'));

        console.log(`Ollaan dropissa payload: ${payload['name']} ${payload['originalPosition']} ${payload['table']}`);
        let row = e.target.closest('.teamrow');
        if (row) {
            row.classList.remove('droppable');}

            let dropTable = e.target.closest('.leaguetable');
            let teamOriginalPosition = payload['originalPosition'];
            let dropTableIndex = dropTable.getAttribute('data-index');
            let originTableIndex = payload['table'];

            console.log(`dropTableIndex ${dropTableIndex} originTableIndex ${originTableIndex}`);
            if (dropTableIndex === originTableIndex) {
                let newPosition = row.getAttribute('data-index');
                if (lastTargetIndex !== newPosition) {
                    let predictionToUpdate = predictions[dropTableIndex];
                    let updatedPrediction = updatePrediction(predictionToUpdate, teamOriginalPosition, newPosition);
                    let tableToUpdate = document.getElementsByTagName("table")[dropTableIndex];
                    renderTable(updatedPrediction, tableToUpdate)
                }
            }
            else {
                console.log(`You dropped to a wrong table`);
            }
    })

    tablesDiv.addEventListener('dragend', (e) => {
        e.preventDefault();
        e.target.classList.remove('dragging');
    })
}

/**
 * Updates the predictions Array
 *
 * @param prediction to be updated
 * @param teamMoving
 * @param newPosition
 * @return prediction updated prediction
 */
function updatePrediction(prediction, teamMoving, newPosition) {
    console.log(`Ollaan updatePrediction funktiossa arvoilla ${prediction}  ${teamMoving} ${newPosition} `);
    prediction = moveElement(prediction, teamMoving, newPosition);

    console.log(`tullaan ulos updatePrediction funktiosta rakenteella ${prediction}`)
    return prediction;
}

function moveElement(array, from, to) {
    let element = array.splice(from, 1)[0];
    array.splice(to, 0, element);
    return array;
}


function removeTable(target) {
    let closest = target.closest(".tableDiv");
    closest.remove();
}


function createNewTable(teams, predictions) {
    let tablesDiv = document.getElementById("tablesDiv");

    let tableDiv = document.createElement("div")
    tableDiv.setAttribute("class", "tableDiv");

    let uxDiv = document.createElement("div");
    uxDiv.setAttribute("class", "uxDiv");

    // luodaan input kenttä minne lisätään käyttäjän nimi
    let newUserDiv = document.createElement("div");
    newUserDiv.setAttribute("class", "newUserDiv");
    let label = document.createElement("label");
    label.setAttribute("for", "userName");
    label.textContent = "Username>";
    newUserDiv.appendChild(label);

    let inputField = document.createElement("input");
    inputField.setAttribute("id", "userName");
    inputField.setAttribute("type", "text");
    inputField.required = true;
    newUserDiv.appendChild(inputField);
    uxDiv.appendChild(newUserDiv);

    // luodaan poistonappula
    let removeTableButton = document.createElement("button");
    removeTableButton.setAttribute("class", "removeTableButton");
    removeTableButton.textContent = "Remove Table"
    uxDiv.appendChild(removeTableButton);

    // lisätään uxdiv tableDiviin
    tableDiv.appendChild(uxDiv);
    let amountOfExistingTables = document.getElementsByClassName("leaguetable").length
    let index = amountOfExistingTables;
    let leagueTable = document.createElement("table");
    leagueTable.setAttribute("class", "leaguetable");
    leagueTable.setAttribute("id", `leagueTable${index}`);
    leagueTable.setAttribute("data-index", `${index}`);

    // populate the array with teams in order
    renderTable(teams, leagueTable);
    tableDiv.appendChild(leagueTable);
    tablesDiv.appendChild(tableDiv)

    // create new prediction to predictions dict
    predictions.push([...teams])
    console.log(predictions)
}

/**
 * Renders the teams in order to a given leaguetable
 * @param teams array of teams in predicted order
 * @param leagueTable where teams will be rendered
 */
function renderTable(teams, leagueTable) {
    // clean the old data from leagueTable
    while (leagueTable.firstChild) {
        leagueTable.removeChild(leagueTable.firstChild);
    }

    let position = 1;
    for (let team of teams) {
        let row = document.createElement("tr");
        row.setAttribute('class', 'teamrow')
        row.setAttribute('id', `row${position}`);
        row.setAttribute('data-index', `${position - 1}`);

        let positionColumn = document.createElement("td");
        positionColumn.textContent = position.toString();
        row.appendChild(positionColumn);

        let teamNameCol = document.createElement("td");
        teamNameCol.textContent = team
        teamNameCol.setAttribute("id", team);
        teamNameCol.setAttribute("class", "teamName");
        teamNameCol.setAttribute("draggable", "true");
        row.appendChild(teamNameCol);
        leagueTable.appendChild(row);

        position++;
        paintTheTable(leagueTable, teams.length);
    }
}


function paintTheTable(taulukko, amountOfTeams) {
    let rivit = taulukko.getElementsByTagName("tr")
    let red = 0;
    let green = 255;
    let blue = 0;
    let step = 255 / amountOfTeams;

    for (let rivi of rivit) {
        rivi.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
        green = green - step;
        red = red + step;
    }
}

function validateForm(form) {
    // This is where we validate the form
    console.log("WE NEED TO DO VALIDATION FOR THIS FORM");
}
