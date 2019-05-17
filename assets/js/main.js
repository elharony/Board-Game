const grid = document.querySelector('.grid');

/**
 * Draw the Grid
 */
function drawGrid() {
    let gridSize = 100;

    for(let i = 0; i < gridSize; i++) {
        grid.appendChild(createGridItem())
    }
}

function createGridItem() {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    return gridItem
}


/**
 * Disabled Grid Items
 */
function disableGridItems() {
    const disabledItems = 15;

    for(let i = 0; i < disabledItems; i++) {
        grid.childNodes[getRandomInt(0, 99)].classList.add('disabled')
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
    drawGrid();
    disableGridItems();
})()