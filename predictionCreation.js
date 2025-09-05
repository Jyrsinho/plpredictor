let teams = null;

fetch('teams.json')
.then(response => response.json())
.then(data => {
    teams = data.teams;
    console.log(teams);
})

const newTableButton = document.getElementById("newTableButton");

newTableButton.addEventListener("click", function(ev) {
    ev.preventDefault();
    let tablesDiv = document.getElementById("tablesDiv");

    let tableDiv = document.createElement("div")
    tableDiv.setAttribute("id", "tableDiv");

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
    newUserDiv.appendChild(inputField);
    uxDiv.appendChild(newUserDiv);

    // luodaan poistonappula
    let removeTableButton = document.createElement("button");
    removeTableButton.setAttribute("class", "removeTableButton");
    removeTableButton.textContent = "Remove Table"
    uxDiv.appendChild(removeTableButton);

    // lisätään uxdiv tableDiviin
    tableDiv.appendChild(uxDiv);


    // luodaan taulukko, jossa kaikki joukkueet
    let leagueTable = document.createElement("table");
    leagueTable.setAttribute("class", "leaguetable");

    let position = 1;
    for (let team of teams) {
        let row = document.createElement("tr");


        let positionColumn = document.createElement("td");
        positionColumn.textContent = position.toString();
        row.appendChild(positionColumn);

        let teamNameCol = document.createElement("td");
        teamNameCol.textContent = team
        teamNameCol.setAttribute("draggable", "true");
        row.appendChild(teamNameCol);
        leagueTable.appendChild(row);

        position++;
    }
    tableDiv.appendChild(leagueTable);
    tablesDiv.appendChild(tableDiv)
});
