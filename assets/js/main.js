// Grid Size
const GRID_SIZE = 10;

// Dimmed Cells
const DISABLED_CELLS = 10;

// Weapons
const WEAPONS_COUNT = 3;
const WEAPONS = [
    {
        'type': 'defense',
        'className': 'weapon-defense'
    },
    {
        'type': 'attack',
        'className': 'weapon-attack'
    }
]

// Players
const PLAYERS = [
    {
        'name': 'Police',
        'className': 'player-police',
        'rowMin': 0,
        'rowMax': 3,
        'colMin': 0,
        'colMax': 9
    },
    {
        'name': 'Thief',
        'className': 'player-thief',
        'rowMin': 6,
        'rowMax': 9,
        'colMin': 0,
        'colMax': 9
    }
]


// Store all `unavailable` cells
let availableCells = [];
let unavailableCells = [];


/**
 * 1. Draw the grid
 * 2. Place `dimmed` cells
 * 3. Place `weapons`
 * 4. Place 2 `players`
 */


/**
 * Draw the Grid
 */
const grid = document.querySelector('.grid');
function drawGrid() {
    for(let row = 0; row < GRID_SIZE; row++) {
        for(let col = 0; col < GRID_SIZE; col++) {
            grid.appendChild(createGridItem(row, col));
            availableCells.push([row, col]);
        }
    }
}
function createGridItem(row, col) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.classList.add(`cell_${row}_${col}`);
    return gridItem;
}


/**
 * Nearby Cells 
 */
function checkNearby(row, col) {

    const avoidItems = ['weapon-attack', 'weapon-defense', 'player-police', 'player-thief'];

    /* Reset row/col number if reaches the least/maximum */
    row = (row == 0) ? 1 : row;
    row = (row == 9) ? 8 : row;
    col = (col == 0) ? 1 : col;
    col = (col == 9) ? 8 : col;

    /* Check nearby cells */

    /**
     * Example: (5, 6)
     *
     *          [4, 6]
     *   [5, 5] [5, 6] [5, 7]
     *          [6, 6] 
     */
    let topCell = document.querySelector(`.cell_${row - 1}_${col}`);
    let bottomCell = document.querySelector(`.cell_${row + 1}_${col}`);
    let rightCell = document.querySelector(`.cell_${row}_${col + 1}`);
    let leftCell = document.querySelector(`.cell_${row}_${col - 1}`);
    
    // Check for nearby weapons
    for(let item = 0; item < avoidItems.length; item++) {
        if(
            topCell.classList.contains(avoidItems[item]) ||
            bottomCell.classList.contains(avoidItems[item]) ||
            rightCell.classList.contains(avoidItems[item]) ||
            leftCell.classList.contains(avoidItems[item])
        ) {
            return false;
        } else {
            return true;
        }
    }
}


/**
 * isAvailableCell?
 */
function isAvailableCell(row, col) {
    let result = !(unavailableCells.includes(`cell_${row}_${col}`)); // `!` To get "Not Available"
    return result;
}


/**
 * Place Item
 */
function placeItem(row, col, itemClassName) {

    let selectedCell = document.querySelector(`.cell_${row}_${col}`);
    selectedCell.classList.add(itemClassName);

    // Make that cell unavailable for later use
    unavailableCells.push(`cell_${row}_${col}`);
}


/**
 * Place `Disabled Cells`
 */
function placeDisabledCells() {

    function disableCell() {
        let randCellRow = getRandomInt(0, 9);
        let randCellCol = getRandomInt(0, 9);

        // We've found an available cell
        if(isAvailableCell(randCellRow, randCellCol)) {

            placeItem(randCellRow, randCellCol, 'disabled');

        } else {
            // Try again!
            return disableCell();
        }
    }

    // Disable X amount of cells
    for(let i = 0; i < DISABLED_CELLS; i++) {
        disableCell();
    }

}

/**
 * Place `Weapons`
 */
function placeWeapons() {

    function addWeapon(weapon) {
        let randCellRow = getRandomInt(0, 9);
        let randCellCol = getRandomInt(0, 9);

        // We've found an available cell
        if(isAvailableCell(randCellRow, randCellCol)) {

            // Is there any nearby weapons?
            if(checkNearby(randCellRow, randCellCol)) {

                placeItem(randCellRow, randCellCol, weapon.className);

            } else {

                // Try again!
                return addWeapon(weapon);

            }
            

        } else {
            // Try again!
            return addWeapon(weapon);
        }
    }

    // Palce X amount of weapons
    for(let i = 0; i < WEAPONS_COUNT; i++) {
        addWeapon(WEAPONS[0]); // Defense
        addWeapon(WEAPONS[1]); // Attack
    }
}

/**
 * Place `2 Players`
 */
function placePlayers() {

    function addPlayer(player) {
        let randCellRow = getRandomInt(0, 9);
        let randCellCol = getRandomInt(0, 9);

        /* Keep players away */
        if( (player.rowMin <= randCellRow && randCellRow <= player.rowMax) && 
            (player.colMin < randCellCol && randCellCol < player.colMax) ) {
                
            // We've found an available cell
            if(isAvailableCell(randCellRow, randCellCol)) {

                placeItem(randCellRow, randCellCol, player.className);

            } else {
                // Try again!
                return addPlayer(player);
            }

        } else {
            // Try again!
            return addPlayer(player);
        }
    }

    // Palce X amount of players
    addPlayer(PLAYERS[0]); // Policeman
    addPlayer(PLAYERS[1]); // Thief
}


// SOF: https://stackoverflow.com/a/1527820/5560399
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

 
/**
 * Init
 */
(function init() {
    drawGrid();
    placeDisabledCells();
    placePlayers();
    placeWeapons();
})()