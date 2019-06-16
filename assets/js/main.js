const grid = document.querySelector('.grid');
const gridSize = 20;

// Store all `unavailable` cells
let unavailableCells = [];


/**
 * 1. Draw the grid
 * 2. Place `dimmed` cells
 * 3. Place `weapons`
 * 4. Place 2 `players` randomaly
 */


/**
 * Draw the Grid
 */
function drawGrid() {
    let gridCells = gridSize * gridSize;

    for(let i = 0; i < gridCells; i++) {
        grid.appendChild(createGridItem())
    }
}
function createGridItem() {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    return gridItem;
}


/**
 * isAvailableCell?
 */
function isAvailableCell(index) {
    let result = !(unavailableCells.includes(index)); // `!` To get "Not Available"
    return result;
}


/**
 * Place `Disabled Cells`
 */
function placeDisabledCells() {
    const disabledCellsCount = 40;

    function disableCell() {
        let rand = getRandomInt(0, 399);

        // We've found an available cell
        if(isAvailableCell(rand)) {

            // Dimmed that cell
            grid.childNodes[rand].classList.add('disabled');

            // Make its index unavailable for later usage
            unavailableCells.push(rand);

        } else {

            // Try again!
            return disableCell();
        }
    }

    // Disable X amount of cells
    for(let i = 0; i < disabledCellsCount; i++) {
        disableCell();
    }

}

/**
 * Place `Weapons`
 */
function placeWeapons() {
    const weaponsCount = 5;
    const weapons = [
        {
            'type': 'defense',
            'className': 'weapon-defense'
        },
        {
            'type': 'attack',
            'className': 'weapon-attack'
        }
    ]

    function addWeapon(weapon) {
        let rand = getRandomInt(0, 399);

        // We've found an available cell
        if(isAvailableCell(rand)) {

            // Place the weapon
            grid.childNodes[rand].classList.add(weapon.className);

            // Make its index unavailable for later usage
            unavailableCells.push(rand);

        } else {

            // Try again!
            return addWeapon(weapon);
        }
    }

    // Palce X amount of weapons
    for(let i = 0; i < weaponsCount; i++) {
        addWeapon(weapons[0]); // Defense
        addWeapon(weapons[1]); // Attack
    }
}


// SOF: https://stackoverflow.com/a/1527820/5560399
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Characters
 */
// function defaultCharacters() {
//     grid.childNodes[policePos].classList.add('current-police')
//     grid.childNodes[thiefPos].classList.add('current-thief')
// }

 
/**
 * Init
 */
(function init() {
    drawGrid();
    placeDisabledCells();
    placeWeapons();
    // defaultCharacters();
})()