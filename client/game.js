import { scoring } from './scoring.js';

function shuffle(array) {
  // Fisher-Yates shuffle, used for random decoder cipher below
  // used below to allow us to randomly shuffle our future array of given tiles
  let m = array.length;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    let i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    let t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export class Game {
  constructor() {
    // initialize our gam based on a current board if one exists in local storage
    // here we update the board and the current bag for our tiles
    if (window.localStorage.getItem('grid') !== null && window.localStorage.getItem('bag') !== null) {
      this.grid = JSON.parse(window.localStorage.getItem('grid'));
      this.bag = JSON.parse(window.localStorage.getItem('bag'));
    } 
    // otherwise we start a new game state
    else {
      this.reset();
    }
  }

  /**
   * This function will reset the game to the default state.
   * It will NOT update visually, hence render should be called after resetting.
   */
  reset() {
    // Initialize the bag, this represents all the possible tiles in a scrabble game
    const frequencies = {
      '*': 2,
      a: 9,
      b: 2,
      c: 2,
      d: 4,
      e: 12,
      f: 2,
      g: 3,
      h: 2,
      i: 9,
      j: 1,
      k: 1,
      l: 4,
      m: 2,
      n: 6,
      o: 8,
      p: 2,
      q: 1,
      r: 6,
      s: 4,
      t: 6,
      u: 4,
      v: 2,
      w: 2,
      x: 1,
      y: 2,
      z: 1,
    };

    // we are now setting the grid for scrabble
    this.grid = [];
    for (let i = 1; i <= 15; ++i) {
      this.grid[i] = [];
      for (let j = 1; j <= 15; ++j) {
        this.grid[i][j] = null;
      }
    }

    // Create the bag (set of tiles for our games)
    this.bag = [];
    for (let letter in frequencies) {
      for (let i = 0; i < frequencies[letter]; ++i) {
        this.bag.push(letter);
      }
    }
    
    // shuffle the bag
    this.bag = shuffle(this.bag);

    // Save current state to local storage
    window.localStorage.setItem('grid', JSON.stringify(this.grid));
    window.localStorage.setItem('bag', JSON.stringify(this.bag));
  }

  // this method is used for rendering our grid and current set of tiles from the bag to the screen
  render(element) {
    // initially empty out cur HTML element's inner HTML
    element.innerHTML = '';

    for (let i = 1; i <= 15; ++i) {
      for (let j = 1; j <= 15; ++j) {
        // for each tile on the board, create a div for it
        const div = document.createElement('div');
        // give it a class of 'grid-item' to make the CSS class apply
        div.classList.add('grid-item');
        // if a letter has been played on this tile, then update it, otherwise keep it empty
        div.innerText = this.grid[i][j] === null ? '' : this.grid[i][j];
        
        // this is to add a scoring multiplier to the current tile, if it has a bonus score multiplier, we change the color accordingly
        // based on which multiplier these tiles are on
        // multipliers allow the point values per character played to increase
        const label = scoring.label(i, j);
        if (label !== '') {
          // add the multiplier class if one exists 
          div.classList.add(label);
        }
        
        // append a child div to HTML element passed in
        element.appendChild(div);
      }
    }
  }

  /**
   * A utility function to persist the current state of the bag.
   */
  _saveBag() {
    // save the current bag to local storage
    window.localStorage.setItem('bag', JSON.stringify(this.bag));
  }

  /**
   * A utility function to persist the current state of the grid.
   */
  _saveGrid() {
    // saves the current grid to local storage
    window.localStorage.setItem('grid', JSON.stringify(this.grid));
  }

  /**
   * This function removes the first n tiles from the bag and returns them. If n
   * is greater than the number of remaining tiles, this removes and returns all
   * the tiles from the bag. If the bag is empty, this returns an empty array.
   * @param {number} n The number of tiles to take from the bag.
   * @returns {Array<string>} The first n tiles removed from the bag.
   */
  takeFromBag(n) {
    if (n >= this.bag.length) {
      const drawn = this.bag;
      this.bag = [];
      return drawn;
    }

    const drawn = [];
    for (let i = 0; i < n; ++i) {
      drawn.push(this.bag.pop());
    }
    return drawn;
  }

  /**
   * This function returns the current state of the board. The positions where
   * there are no tiles can be anything (undefined, null, ...).
   *
   * @returns {Array<Array<string>>} A 2-dimensional array representing the
   * current grid.
   */
  getGrid() {
    return this.grid;
  }

  // helper function to determine whether this word can be placed on the board at the given positions
  _canBePlacedOnBoard(word, position, direction) {
    const grid = this.grid;
    const letters = word.split('');
    const placement = direction
      ? letters.map((letter, i) => grid[position.x + i][position.y] === null)
      : letters.map((letter, i) => grid[position.x][position.y + i] === null);

    return !placement.includes(false);

  }

  // function to actually play the word on the board
  _placeOnBoard(word, position, direction) {
    const grid = this.grid;
    const letters = word.split('');
    if (direction) {
      letters.forEach(
        (letter, i) => (grid[position.x + i][position.y] = letter)
      );
    } else {
      letters.forEach(
        (letter, i) => (grid[position.x][position.y + i] = letter)
      );
    }
  }

  /**
   * This function will be called when a player takes a turn and attempts to
   * place a word on the board. It will check whether the word can be placed at
   * the given position. If not, it'll return -1. It will then compute the score
   * that the word will receive and return it, taking into account special
   * positions.
   *
   * @param {string} word The word to be placed.
   * @param {Object<x|y, number>} position The position, an object with
   * properties x and y. Example: { x: 2, y: 3 }.
   * @param {boolean} direction Set to true if horizontal, false if vertical.
   * @returns {number} The score the word will obtain (including special tiles),
   * or -1 if the word cannot be placed.
   */
  playAt(word, position, direction) {
    // We first check if the word can be placed
    if (!this._canBePlacedOnBoard(word, position, direction)) {
      return -1;
    }

    // Place the word on the board
    this._placeOnBoard(word, position, direction);

    // Save the state of the board
    this._saveGrid();

    // Compute the score of the word played
    return scoring.score(word, position, direction);
  }
}
