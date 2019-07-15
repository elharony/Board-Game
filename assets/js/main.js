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
        this.avoidItems = ['weapon-attack', 'weapon-defense', 'player-1', 'player-2'];

    }

    /**
    * Nearby Cells 
    */
    checkNearby(row, col) {

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

        // console.log(`
        //     Current item: ${row}, ${col}.
        //     Top: ${row - 1}, ${col}
        //     Right: ${row}, ${col + 1}
        //     Bottom: ${row + 1}, ${col}
        //     Left: ${row}, ${col - 1}
        //     \n
        // `)
        
        // Check for nearby items

        if(
            !(topCell.classList.contains(this.avoidItems[0]) ||
            bottomCell.classList.contains(this.avoidItems[0]) ||
            rightCell.classList.contains(this.avoidItems[0]) ||
            leftCell.classList.contains(this.avoidItems[0]))
        ) {
            
            if(!(topCell.classList.contains(this.avoidItems[1]) ||
            bottomCell.classList.contains(this.avoidItems[1]) ||
            rightCell.classList.contains(this.avoidItems[1]) ||
            leftCell.classList.contains(this.avoidItems[1]))) {

                if(!(topCell.classList.contains(this.avoidItems[2]) ||
                bottomCell.classList.contains(this.avoidItems[2]) ||
                rightCell.classList.contains(this.avoidItems[2]) ||
                leftCell.classList.contains(this.avoidItems[2]))) {

                    if(!(topCell.classList.contains(this.avoidItems[3]) ||
                    bottomCell.classList.contains(this.avoidItems[3]) ||
                    rightCell.classList.contains(this.avoidItems[3]) ||
                    leftCell.classList.contains(this.avoidItems[3]))) {

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

    /**
     * Highlight
     */

    highlightAvailableCells(row, col) {
        const MAX_HIGHLIGHTED_CELLS = 2;

        // Top
        for(let i = 1; i <= MAX_HIGHLIGHTED_CELLS; i++) {
            let topCell = document.querySelector(`.cell_${row - i}_${col}`);

            // Check if we are selecting an unavailable cell
            if((row - i) < 0) {
                break;
            } else if(topCell.classList.contains('disabled')) {
                break;
            } else {
                topCell.classList.add('highlighted');
            }
        }

        // Right
        for(let i = 1; i <= MAX_HIGHLIGHTED_CELLS; i++) {
            let rightCell = document.querySelector(`.cell_${row}_${col + i}`);

            // Check if we are selecting an unavailable cell
            if((col + i) > 9) {
                break;
            } else if(rightCell.classList.contains('disabled')) {
                break;
            } else {
                rightCell.classList.add('highlighted');
            }
        }

        // Bottom
        for(let i = 1; i <= MAX_HIGHLIGHTED_CELLS; i++) {
            let bottomCell = document.querySelector(`.cell_${row + i}_${col}`);

            // Check if we are selecting an unavailable cell
            if(((row + i) > 9)) {
                break;
            } else if(bottomCell.classList.contains('disabled')) {
                break;
            } else {
                bottomCell.classList.add('highlighted');
            }
        }

        // Left
        for(let i = 1; i <= MAX_HIGHLIGHTED_CELLS; i++) {
            let leftCell = document.querySelector(`.cell_${row}_${col - i}`);

            // Check if we are selecting an unavailable cell
            if((col - i) < 0) {
                break;
            } else if(leftCell.classList.contains('disabled')) {
                break;
            } else {
                leftCell.classList.add('highlighted');
            }
        }

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
                this.highlightAvailableCells(randCellRow, randCellCol);

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
        let randCellRow = getRandomInt(1, 8);
        let randCellCol = getRandomInt(1, 8);

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

class Engine {

    constructor() {
        this.playerTurn = 1;
        this.controller();
    }
    
    /**
     * 
     * Problem:
     * --------
     * Move the player from `A` (Current Location) to `B` (New Location)
     * 
     * 
     * Solution:
     * ---------
     * - Determine/Specify `A`
     * - Determine/Specify `B`
     * - Hide the player from `A` and place it at `B`, regardless it's `highlighted` or not
     * 
     * 
     */
    controller() {
        // const HIGHLIGHTED_CELLS = document.getElementsByClassName('.highlighted');
        const gridItems = document.querySelectorAll('.grid-item');

        /**
         * Add `click` to each cell, and
         * If clicked, `checkTurn` to check current player turn, and use the
         * Returned value to get the player's element, and
         * Remove the associated class from the old location, and
         * Add that class to the new location
         * Lastly... Change the turn to the next player!
         */
        
        for(let item of gridItems) {
            item.addEventListener('click', function() {
                let player = this.checkTurn();
                let playerElement = document.querySelector(`.${player}`);
                playerElement.classList.remove(player);
                item.classList.add(player);

                this.playerTurn = (this.playerTurn == 1) ? 2 : 1;

            }.bind(this))
        }
    }

    checkTurn() {
        if(this.playerTurn == 1) {
            return 'player-1';
        } else {
            return 'player-2';
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
            'className': 'player-1',
            'rowMin': 0,
            'rowMax': 3,
            'colMin': 0,
            'colMax': 9
        },
        {
            'name': 'Thief',
            'className': 'player-2',
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

    // Engine
    new Engine();

})()