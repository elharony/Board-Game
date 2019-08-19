/**
 * === Program Flow ===
 * 1. Draw the grid
 * 2. Place `dimmed` cells
 * 3. Place `weapons`
 * 4. Place 2 `players`
 * 5. Move the players around within the `highlighted` & `available` cells
 * 6. Take `weapons`, and update stats
 * 7. When players get closer, start the `Combat Mode`!
 */

/**
 * Grid
 */
class Grid {
  constructor(gridContainer, gridSize, game) {
    this.gridContainer = gridContainer;
    this.gridSize = gridSize;
    this.game = game;
    this.draw();
  }

  draw() {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        this.gridContainer.appendChild(this.createGridItem(row, col));
        this.game.availableCells.push([row, col]);
      }
    }
  }

  createGridItem(row, col) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    gridItem.classList.add(`cell_${row}_${col}`);
    gridItem.setAttribute('data-row', row);
    gridItem.setAttribute('data-col', col);
    return gridItem;
  }
}

class Item {
  constructor(row, col, itemClassName, game) {
    this.game = game;
    this.row = row;
    this.col = col;
    this.itemClassName = itemClassName;
    this.avoidItems = [
      'weapon-attack',
      'weapon-attack-super',
      'weapon-defense',
      'weapon-health',
      'player-1',
      'player-2'
    ];
  }

  /**
   * Check if there are no nearby *avoidItems* to the given cell.
   *
   * @param {*} row
   * @param {*} col
   *
   * @returns {boolean} `true` If there are no nearby *avoidItems*. `false` If there are one or more nearby *avoidItems*.
   */
  checkNearby(row, col) {
    /**
     * Example: (5, 6)
     *
     *          [4, 6]
     *   [5, 5] [5, 6] [5, 7]
     *          [6, 6]
     */
    let topCell = this.game.gameContainerElement.querySelector(`.cell_${row - 1}_${col}`);
    let bottomCell = this.game.gameContainerElement.querySelector(`.cell_${row + 1}_${col}`);
    let rightCell = this.game.gameContainerElement.querySelector(`.cell_${row}_${col + 1}`);
    let leftCell = this.game.gameContainerElement.querySelector(`.cell_${row}_${col - 1}`);

    if (
      this.isCloserTo(
        topCell,
        bottomCell,
        rightCell,
        leftCell,
        this.avoidItems[0]
      )
    ) {
      if (
        this.isCloserTo(
          topCell,
          bottomCell,
          rightCell,
          leftCell,
          this.avoidItems[1]
        )
      ) {
        if (
          this.isCloserTo(
            topCell,
            bottomCell,
            rightCell,
            leftCell,
            this.avoidItems[2]
          )
        ) {
          if (
            this.isCloserTo(
              topCell,
              bottomCell,
              rightCell,
              leftCell,
              this.avoidItems[3]
            )
          ) {
            if (
              this.isCloserTo(
                topCell,
                bottomCell,
                rightCell,
                leftCell,
                this.avoidItems[4]
              )
            ) {
              if (
                this.isCloserTo(
                  topCell,
                  bottomCell,
                  rightCell,
                  leftCell,
                  this.avoidItems[5]
                )
              ) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Used for *checkNearby()* to check if given *cells* are closer to the given *item*
   *
   * @param {*} topCell
   * @param {*} bottomCell
   * @param {*} rightCell
   * @param {*} leftCell
   * @param {*} item
   *
   * @returns {boolean} `true` If there's a closer `item`. `false` If there isn't.
   */
  isCloserTo(topCell, bottomCell, rightCell, leftCell, item) {
    if (
      !(
        topCell.classList.contains(item) ||
        bottomCell.classList.contains(item) ||
        rightCell.classList.contains(item) ||
        leftCell.classList.contains(item)
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Check whether a given cell is available or not
   *
   * @param {*} row
   * @param {*} col
   *
   * @returns {boolean} `true` If it's available.
   */
  isAvailableCell(row, col) {
    let result = !this.game.unavailableCells.includes(`cell_${row}_${col}`); // `!` To get "Not Available"
    return result;
  }

  /**
   * Put a specific item on the grid, based on its *row*, *col*
   * and the *itemClassName* specifies which item it represents
   *
   * @param {*} row
   * @param {*} col
   * @param {*} itemClassName
   *
   * @returns null
   */
  placeItem(row, col, itemClassName) {
    let selectedCell = this.game.gameContainerElement.querySelector(`.cell_${row}_${col}`);
    selectedCell.classList.add(itemClassName);

    // Make that cell unavailable for later use
    this.game.unavailableCells.push(`cell_${row}_${col}`);
  }
}

class DimmedCell extends Item {
  constructor(game) {
    super(null, null, null, game);
  }
  dimCell() {
    let randCellRow = getRandomInt(0, 9);
    let randCellCol = getRandomInt(0, 9);

    // We've found an available cell
    if (this.isAvailableCell(randCellRow, randCellCol)) {
      this.placeItem(randCellRow, randCellCol, 'disabled');
    } else {
      // Try again!
      return this.dimCell();
    }
  }
}

class Player extends Item {
  constructor(player, game) {
    super(null, null, null, game);
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
    if (
      this.rowMin <= randCellRow &&
      randCellRow <= this.rowMax &&
      (this.colMin < randCellCol && randCellCol < this.colMax)
    ) {
      // We've found an available cell
      if (this.isAvailableCell(randCellRow, randCellCol)) {
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
  constructor(weapon, game) {
    super(null, null, null, game);
    this.className = weapon.className;
    this.add();
  }

  add() {
    let randCellRow = getRandomInt(1, 8);
    let randCellCol = getRandomInt(1, 8);

    // We've found an available cell
    if (this.isAvailableCell(randCellRow, randCellCol)) {
      // Is there any nearby weapons?
      if (this.checkNearby(randCellRow, randCellCol)) {
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
  constructor(players, game) {
    this.game = game;
    this.players = players;
    this.playerTurn = 0;
    this.MAX_HIGHLIGHTED_CELLS = 2;
    this.updateStats();
    this.controller();
    this.highlightAvailableCells();
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
    const gridItems = this.game.gameContainerElement.querySelectorAll('.grid-item');

    /**
     * Add `click` to each cell, and
     * If clicked, `checkTurn` to check current player turn, and use the
     * Returned value to get the player's element, and
     * Remove the associated class from the old location, and
     * Add that class to the new location
     * Change the player turn to the next player!
     * Highlight available cells according to each player's turn
     */

    for (let item of gridItems) {
      item.addEventListener(
        'click',
        function() {
          let player = this.checkTurn();
          let playerElement = this.game.gameContainerElement.querySelector(`.${player}`);
          playerElement.classList.remove(player);
          item.classList.add(player);

          let playerRow = item.getAttribute('data-row');
          let playerCol = item.getAttribute('data-col');

          // Hit a weapon?
          this.takeWeapon(this.playerTurn, item);

          // Combat Mode?
          if (this.isCombatMode(this.playerTurn, playerRow, playerCol)) {
            this.startCompatMode();
          }

          // Switch player turn
          this.playerTurn = this.playerTurn == 0 ? 1 : 0;

          // Highlight Available Cells
          this.highlightAvailableCells();
        }.bind(this)
      );
    }
  }

  getPlayerDashboard(playerIndex, combat = false) {
    return this.game.gameContainerElement.querySelector(
      `#${combat ? 'combat_' : ''}player_${playerIndex + 1}_dashboard`
    );
  }

  /**
   * Check if the `landedCell` has a weapon or not
   * If yes, remove that weapon
   * Increase/Decrease stats based on the weapon
   * Animate the stats
   * Call `updateStats` to update stats change
   *
   * @param {*} currentPlayer
   * @param {*} landedCell
   */
  takeWeapon(currentPlayer, landedCell) {
    if (landedCell.classList.contains('weapon-attack')) {
      // Remove weapon icon
      landedCell.classList.remove('weapon-attack');

      // Increase player stats
      this.players[currentPlayer].attack += 10;

      // Animate Stats
      this.getPlayerDashboard(currentPlayer)
        .querySelector('#attack')
        .classList.add('updateStats');
      setTimeout(() => {
        this.getPlayerDashboard(currentPlayer)
          .querySelector('#attack')
          .classList.remove('updateStats');
      }, 500);

      // Update stats
      this.updateStats();
    } else if (landedCell.classList.contains('weapon-defense')) {
      landedCell.classList.remove('weapon-defense');
      this.players[currentPlayer].shield += 10;

      this.getPlayerDashboard(currentPlayer)
        .querySelector('#shield')
        .classList.add('updateStats');
      setTimeout(() => {
        this.getPlayerDashboard(currentPlayer)
          .querySelector('#shield')
          .classList.remove('updateStats');
      }, 500);
      this.updateStats();
    } else if (landedCell.classList.contains('weapon-health')) {
      landedCell.classList.remove('weapon-health');
      this.players[currentPlayer].health += 10;
      this.getPlayerDashboard(currentPlayer)
        .querySelector('#health')
        .classList.add('updateStats');
      setTimeout(() => {
        this.getPlayerDashboard(currentPlayer)
          .querySelector('#health')
          .classList.remove('updateStats');
      }, 500);
      this.updateStats();
    } else if (landedCell.classList.contains('weapon-attack-super')) {
      landedCell.classList.remove('weapon-attack-super');
      this.players[currentPlayer].attack += 20;

      this.getPlayerDashboard(currentPlayer)
        .querySelector('#attack')
        .classList.add('updateStats');
      setTimeout(() => {
        this.getPlayerDashboard(currentPlayer)
          .querySelector('#attack')
          .classList.remove('updateStats');
      }, 500);
      this.updateStats();
    }
  }

  /**
   * Update stats after hitting a weapon
   */
  updateStats() {
    const playerOneDashboard = this.getPlayerDashboard(0);
    const playerTwoDashboard = this.getPlayerDashboard(1);
    playerOneDashboard.querySelector(
      '#health'
    ).innerHTML = this.players[0].health;
    playerOneDashboard.querySelector(
      '#attack'
    ).innerHTML = this.players[0].attack;
    playerOneDashboard.querySelector(
      '#shield'
    ).innerHTML = this.players[0].shield;

    playerTwoDashboard.querySelector(
      '#health'
    ).innerHTML = this.players[1].health;
    playerTwoDashboard.querySelector(
      '#attack'
    ).innerHTML = this.players[1].attack;
    playerTwoDashboard.querySelector(
      '#shield'
    ).innerHTML = this.players[1].shield;
  }

  updateCombatStats() {
    const combatPlayerOneDashboard = this.getPlayerDashboard(0, true);
    const combatPlayerTwoDashboard = this.getPlayerDashboard(1, true);
    combatPlayerOneDashboard.querySelector(
      '#health'
    ).innerHTML = this.players[0].health;
    combatPlayerOneDashboard.querySelector(
      '#attack'
    ).innerHTML = this.players[0].attack;
    combatPlayerOneDashboard.querySelector(
      '#shield'
    ).innerHTML = this.players[0].shield;
    combatPlayerTwoDashboard.querySelector(
      '#health'
    ).innerHTML = this.players[1].health;
    combatPlayerTwoDashboard.querySelector(
      '#attack'
    ).innerHTML = this.players[1].attack;
    combatPlayerTwoDashboard.querySelector(
      '#shield'
    ).innerHTML = this.players[1].shield;
  }

  /**
   * Reset Active Turn
   * Add `active-turn` class to the current player's turn
   * Return the current player, to be used at the `controller` method
   */
  checkTurn() {
    const currentPlayer = this.playerTurn;
    this.resetTurn();
    this.getPlayerDashboard(currentPlayer).classList.add('active-turn');
    this.getPlayerDashboard(currentPlayer, true).classList.add('active-turn');
    return `player-${this.playerTurn + 1}`;
  }

  /**
   * Remove `active-turn` class from the previous turn
   */
  resetTurn() {
    let activeTurn = this.game.gameContainerElement.querySelectorAll('.active-turn');

    for (let i = 0; i < activeTurn.length; i++) {
      activeTurn[i].classList.remove('active-turn');
    }
  }

  highlightAvailableCells() {
    /**
     * Reset All Highlighted Cells
     * So that whenever a player turn is switched,
     * It erased the previous player highlighted cells
     */
    this.resetHighlightedCells();

    /**
     * Which player turn is it (Initiialy, it's going to be `player-1`)
     * Get the player `offset` (i.e. `row` & `col`)
     * [IMPORTANT] Convert the `row` and `col` to `Int` values to avoid unexpected type coercion error
     * Highlight available cells for selected player in all directions (`Top`, `Right`, `Bottom`, `Left`)
     */
    let player = this.checkTurn();
    let playerElement = this.game.gameContainerElement.querySelector(`.${player}`);

    let row = parseInt(playerElement.getAttribute('data-row'));
    let col = parseInt(playerElement.getAttribute('data-col'));

    // Top
    for (let i = 1; i <= this.MAX_HIGHLIGHTED_CELLS; i++) {
      let topCell = this.game.gameContainerElement.querySelector(`.cell_${row - i}_${col}`);

      // Check if we are selecting an unavailable cell
      if (row - i < 0) {
        break;
      } else if (topCell.classList.contains('disabled')) {
        break;
      } else {
        topCell.classList.add('highlighted');
      }
    }

    // Right
    for (let i = 1; i <= this.MAX_HIGHLIGHTED_CELLS; i++) {
      let rightCell = this.game.gameContainerElement.querySelector(`.cell_${row}_${col + i}`);

      // Check if we are selecting an unavailable cell
      if (col + i > 9) {
        break;
      } else if (rightCell.classList.contains('disabled')) {
        break;
      } else {
        rightCell.classList.add('highlighted');
      }
    }

    // Bottom
    for (let i = 1; i <= this.MAX_HIGHLIGHTED_CELLS; i++) {
      let bottomCell = this.game.gameContainerElement.querySelector(`.cell_${row + i}_${col}`);

      // Check if we are selecting an unavailable cell
      if (row + i > 9) {
        break;
      } else if (bottomCell.classList.contains('disabled')) {
        break;
      } else {
        bottomCell.classList.add('highlighted');
      }
    }

    // Left
    for (let i = 1; i <= this.MAX_HIGHLIGHTED_CELLS; i++) {
      let leftCell = this.game.gameContainerElement.querySelector(`.cell_${row}_${col - i}`);

      // Check if we are selecting an unavailable cell
      if (col - i < 0) {
        break;
      } else if (leftCell.classList.contains('disabled')) {
        break;
      } else {
        leftCell.classList.add('highlighted');
      }
    }
  }

  resetHighlightedCells() {
    let highlightedCells = this.game.gameContainerElement.querySelectorAll('.highlighted');
    for (let cell of highlightedCells) {
      cell.classList.remove('highlighted');
    }
  }

  isCombatMode(currentPlayer, row, col) {
    row = parseInt(row);
    col = parseInt(col);

    let opponentPlayer = currentPlayer == 0 ? 'player-2' : 'player-1';

    let topCell = this.game.gameContainerElement.querySelector(`.cell_${row - 1}_${col}`);
    let bottomCell = this.game.gameContainerElement.querySelector(`.cell_${row + 1}_${col}`);
    let rightCell = this.game.gameContainerElement.querySelector(`.cell_${row}_${col + 1}`);
    let leftCell = this.game.gameContainerElement.querySelector(`.cell_${row}_${col - 1}`);

    /**
     * Is the `currentPlayer` closer to `opponentPlayer`?
     */
    if (!(row == 0)) {
      if (topCell.classList.contains(opponentPlayer)) {
        return true;
      }
    }
    if (!(row == 9)) {
      if (bottomCell.classList.contains(opponentPlayer)) {
        return true;
      }
    }
    if (!(col == 0)) {
      if (leftCell.classList.contains(opponentPlayer)) {
        return true;
      }
    }
    if (!(col == 9)) {
      if (rightCell.classList.contains(opponentPlayer)) {
        return true;
      }
    }
    return false;
  }

  startCompatMode() {
    let combatModeModal = this.game.gameContainerElement.querySelector('.combat-mode');
    combatModeModal.classList.add('visible');

    this.updateCombatStats();

    var myTimer = setInterval(() => {
      // Let current player turn ATTACK the other
      let currentPlayer = this.playerTurn;
      let nextPlayer = currentPlayer == 1 ? 0 : 1;

      // Start fighting!
      this.fight(currentPlayer, nextPlayer, myTimer);

      // Switch player turn
      setTimeout(() => {
        this.playerTurn = this.playerTurn == 0 ? 1 : 0;
      }, 500);
    }, 1000);
  }

  fight(currentPlayer, nextPlayer, timer) {
    // damage =  Opponent Attack - (Current Player Shield / 100 * Opponent Attack)
    let damage =
      this.players[nextPlayer].attack -
      (this.players[currentPlayer].shield / 100) *
        this.players[nextPlayer].attack;
    this.players[currentPlayer].health -= damage;

    // Animate stats
    this.getPlayerDashboard(currentPlayer)
      .querySelector('#health')
      .classList.add('updateStats');
    setTimeout(() => {
      this.getPlayerDashboard(currentPlayer)
        .querySelector('#health')
        .classList.remove('updateStats');
    }, 500);

    // Update stats
    this.updateCombatStats();

    // Died?
    if (this.players[currentPlayer].health <= 0) {
      // Set `health` to `0`, and avoid negative values
      this.getPlayerDashboard(currentPlayer).querySelector(
        '#health'
      ).innerHTML = 0;

      // Announce the winner
      setTimeout(() => {
        clearInterval(timer);
        this.announceTheWinner(this.players[nextPlayer].name);
      }, 250);
    } else {
      this.checkTurn();
    }
  }

  announceTheWinner(winner) {
    // Show Victory Popup
    let victoryPopup = this.game.gameContainerElement.querySelector('.combat-mode.victory');
    victoryPopup.classList.add('visible');

    // Add winner text
    let winnerElem = this.game.gameContainerElement.querySelector('.combat-mode.victory .inner h2');
    winnerElem.innerHTML = `The winner is: <span>${winner}!</span>`;

    // Restart the game
    let restartBtn = this.game.gameContainerElement.querySelector('.combat-mode.victory .inner .btn');
    restartBtn.addEventListener('click', () => {
      this.restart();
    });
  }

  restart() {
    location.reload();
  }
}

// SOF: https://stackoverflow.com/a/1527820/5560399
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Game {
  constructor(gameContainerElement) {
    this.availableCells = [];
    this.unavailableCells = [];
    this.gameContainerElement = gameContainerElement;
    this.gameGridElement = this.gameContainerElement.querySelector('.grid');
  }
  init() {
    const PLAYERS = [
      {
        name: 'Police',
        className: 'player-1',
        rowMin: 0,
        rowMax: 3,
        colMin: 0,
        colMax: 9,
        health: 100,
        attack: 10,
        shield: 10
      },
      {
        name: 'Thief',
        className: 'player-2',
        rowMin: 6,
        rowMax: 9,
        colMin: 0,
        colMax: 9,
        health: 100,
        attack: 10,
        shield: 10
      }
    ];
    const DISABLED_CELLS = 15;
    const WEAPONS_COUNT = 4;
    const WEAPONS = [
      {
        type: 'defense',
        className: 'weapon-defense'
      },
      {
        type: 'attack',
        className: 'weapon-attack'
      },
      {
        type: 'health',
        className: 'weapon-health'
      },
      {
        type: 'attack',
        className: 'weapon-attack-super'
      }
    ];

    // Grid
    new Grid(this.gameGridElement, 10, this);

    // Dimmed Cells
    const dimmedCells = new DimmedCell(this);
    for (let i = 0; i < DISABLED_CELLS; i++) {
      dimmedCells.dimCell();
    }

    // Players
    new Player(PLAYERS[0], this);
    new Player(PLAYERS[1], this);

    // Weapons
    for (let i = 0; i < WEAPONS_COUNT; i++) {
      new Weapon(WEAPONS[0], this);
      new Weapon(WEAPONS[1], this);
      new Weapon(WEAPONS[2], this);
      new Weapon(WEAPONS[3], this);
    }

    // Engine
    new Engine(PLAYERS, this);
  }
}

let game = new Game(document.querySelector('#game1'));
let game2 = new Game(document.querySelector('#game2'));
game.init();
game2.init();
