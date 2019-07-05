/**
 * 1. Draw the grid
 * 2. Place `dimmed` cells
 * 3. Place `weapons`
 * 4. Place 2 `players`
 */

let availableCells = [];
let unavailableCells = [];


/**
 * Grid
 */
class Grid {

    constructor(gridContainer, gridSize) { 
        this.gridContainer = gridContainer;
        this.gridSize = gridSize;
        this.draw();
    }

    draw() {
        for(let row = 0; row < this.gridSize; row++) {
            for(let col = 0; col < this.gridSize; col++) {
                this.gridContainer.appendChild(this.createGridItem(row, col));
                availableCells.push([row, col]);
            }
        }
    }

    createGridItem(row, col) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.classList.add(`cell_${row}_${col}`);
        return gridItem;
    }
}

class Item {

    constructor(row, col, itemClassName) {
        this.row = row;
        this.col = col;
        this.itemClassName = itemClassName;
    }

    /**
    * Nearby Cells 
    */
    checkNearby(row, col) {

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

        console.log(`
            Current item: ${row}, ${col}.
            Top: ${row - 1}, ${col}
            Right: ${row}, ${col + 1}
            Bottom: ${row + 1}, ${col}
            Left: ${row}, ${col - 1}
            \n
        `)
        
        // Check for nearby items

        if(
            !(topCell.classList.contains(avoidItems[0]) ||
            bottomCell.classList.contains(avoidItems[0]) ||
            rightCell.classList.contains(avoidItems[0]) ||
            leftCell.classList.contains(avoidItems[0]))
        ) {
            
            if(!(topCell.classList.contains(avoidItems[1]) ||
            bottomCell.classList.contains(avoidItems[1]) ||
            rightCell.classList.contains(avoidItems[1]) ||
            leftCell.classList.contains(avoidItems[1]))) {

                if(!(topCell.classList.contains(avoidItems[2]) ||
                bottomCell.classList.contains(avoidItems[2]) ||
                rightCell.classList.contains(avoidItems[2]) ||
                leftCell.classList.contains(avoidItems[2]))) {

                    if(!(topCell.classList.contains(avoidItems[3]) ||
                    bottomCell.classList.contains(avoidItems[3]) ||
                    rightCell.classList.contains(avoidItems[3]) ||
                    leftCell.classList.contains(avoidItems[3]))) {

                        return true;

                    } else {
                        return false;
                    }

                } else {
                    return false;
                }

            } else {
                return false;
            }
            
        } else {
            return false;
        }
    }

    /**
     * isAvailableCell?
     */
    isAvailableCell(row, col) {
        let result = !(unavailableCells.includes(`cell_${row}_${col}`)); // `!` To get "Not Available"
        return result;
    }

    /**
     * Place Item
     */
    placeItem(row, col, itemClassName) {

        let selectedCell = document.querySelector(`.cell_${row}_${col}`);
        selectedCell.classList.add(itemClassName);

        // Make that cell unavailable for later use
        unavailableCells.push(`cell_${row}_${col}`);
    }
    
}

class DimmedCell extends Item {

    dimCell() {

        let randCellRow = getRandomInt(0, 9);
        let randCellCol = getRandomInt(0, 9);

        // We've found an available cell
        if(this.isAvailableCell(randCellRow, randCellCol)) {

            this.placeItem(randCellRow, randCellCol, 'disabled');

        } else {

            // Try again!
            return this.dimCell();
        }
    }
}

class Player extends Item {

    constructor(player) {
        super(player);
        this.rowMin = player.rowMin;
        this.rowMax = player.rowMax;
        this.colMin = player.colMin;
        this.colMax = player.colMax;
        this.className = player.className;
        this.add();
    }

    add() {
        let randCellRow = getRandomInt(0, 9);
        let randCellCol = getRandomInt(0, 9);

        /* Keep players away */
        if( (this.rowMin <= randCellRow && randCellRow <= this.rowMax) && 
            (this.colMin < randCellCol && randCellCol < this.colMax) ) {
                
            // We've found an available cell
            if(this.isAvailableCell(randCellRow, randCellCol)) {

                this.placeItem(randCellRow, randCellCol, this.className);

            } else {
                // Try again!
                return this.add();
            }

        } else {
            // Try again!
            return this.add();
        }
    }
}

class Weapon extends Item {

    constructor(weapon) {
        super(weapon);
        this.className = weapon.className;
        this.add();
    }

    add() {
        let randCellRow = getRandomInt(0, 9);
        let randCellCol = getRandomInt(0, 9);

        // We've found an available cell
        if(this.isAvailableCell(randCellRow, randCellCol)) {

            // Is there any nearby weapons?
            if(this.checkNearby(randCellRow, randCellCol)) {

                this.placeItem(randCellRow, randCellCol, this.className);

            } else {

                // Try again!
                return this.add();

            }
        } else {
            // Try again!
            return this.add();
        }
    }
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

    const DISABLED_CELLS = 10;
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


    // Grid
    const grid = new Grid(document.querySelector('.grid'), 10);


    // Dimmed Cells
    const dimmedCells = new DimmedCell();
    for(let i = 0; i < DISABLED_CELLS; i++) {
        dimmedCells.dimCell();
    }


    // Players
    const player1 = new Player(PLAYERS[0]);
    const player2 = new Player(PLAYERS[1]);


    // Weapons
    for(let i = 0; i < WEAPONS_COUNT; i++) {
        const weapon1 = new Weapon(WEAPONS[0]);
        const weapon2 = new Weapon(WEAPONS[1]);
    }

})()