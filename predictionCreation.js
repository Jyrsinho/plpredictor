let teams = null;

fetch('teams.json')
.then(response => response.json())
.then(data => {
    teams = data.teams;
    console.log(teams);
})

const newTableButton = document.getElementById("newTableButton");

document.addEventListener('click', (e) => {
    if (e.target.matches('.removeTableButton')) {
        e.preventDefault();
        poistaTaulukko(e.target)
    }
})

document.addEventListener('dragstart', (e) => {
    console.log(`aloitettiin raahaus kohteelle ${e.target.textContent}`)
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text', e.target.textContent);
    e.dataTransfer.dropEffect = 'move';
})

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (e.target.matches('.teamName')) {
        console.log(`raahataan yli kohteen ${e.target.textContent}`)
        e.target.classList.add('droppable');
    }
})

document.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.target.classList.remove('droppable');
})


document.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.target.matches('.teamName')) {
        e.target.classList.remove('droppable');
        e.target.textContent = e.dataTransfer.getData('text');
    }
})

document.addEventListener('dragend', (e) => {
    e.preventDefault();
    e.target.classList.remove('dragging');
})


newTableButton.addEventListener("click", function(ev) {
    ev.preventDefault();
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
        teamNameCol.setAttribute("class", "teamName");
        teamNameCol.setAttribute("draggable", "true");
        row.appendChild(teamNameCol);
        leagueTable.appendChild(row);

        position++;
    }
    maalaaTaulukko(leagueTable);
    tableDiv.appendChild(leagueTable);
    tablesDiv.appendChild(tableDiv)
});

function poistaTaulukko(target) {
    let closest = target.closest(".tableDiv");
    closest.remove();
}


function maalaaTaulukko(taulukko) {
    let rivit = taulukko.getElementsByTagName("tr")

    let red = 0;
    let green = 255;
    let blue = 0;

    let step = 255 / teams.length;

    for (let rivi of rivit) {
        rivi.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
        green = green - step;
        red = red + step;
    }
}