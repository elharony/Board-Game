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
        grid.appendChild(createGridItem(i))
    }
}
function createGridItem(index) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.innerHTML = index;
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
 * Disabled Cells
 */
function disabledCells() {
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
    disabledCells();
    // defaultCharacters();
})()