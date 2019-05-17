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
 * Init
 */
(function init() {
    drawGrid();
})()