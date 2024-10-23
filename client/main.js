import { Game } from './game.js';
import { multiPlayerView, getPlayerName } from './multiplayer.js';
import { Rack } from './rack.js';
import * as utils from './scrabbleUtils.js';
import {
  wordScoreBoard,
  gameScoreBoard,
  topWordAndGameScoreBoard,
} from './scoreboard.js';

// UI Components
// We grab the DOM elements we need to work with 
const boardGridElement = document.getElementById('board');
const playersElement = document.getElementById('players');
const wordElement = document.getElementById('word');
const xElement = document.getElementById('x');
const yElement = document.getElementById('y');
const directionElement = document.getElementById('direction');
const playButtonElement = document.getElementById('play');
const resetButtonElement = document.getElementById('reset');
const helpButtonElement = document.getElementById('help');
const hintElement = document.getElementById('hint');
const scoreBoard = document.getElementById('top-10-score-board');
const endButtonElement = document.getElementById('end');

// Useful constants
const TILE_COUNT = 7;
const NUMBER_OF_PLAYERS = 2;

// Keeps track of scores, creating an array of NUM_PLAYERS all set to score 0
const scores = Array.from(Array(NUMBER_OF_PLAYERS), () => 0);

// A function to setup multiple racks for a multi-player game, sets the racks for each player 
const setUpRacks = (game, tileCount, numberOfPlayers) => {
  const racks = [];
  for (let i = 0; i < numberOfPlayers; i++) {
    const rack = new Rack();
    rack.takeFromBag(tileCount, game);
    racks[i] = rack;
  }
  return racks;
};

// Helper function to help us cycle through the players, returns closure updating current
const circularCounter = (end) => {
  let current = 0;
  return () => {
    current = (current + 1) % end;
    return current;
  };
};

// Create and render the game
const game = new Game();
// boardGridElement is our actual board HTML element
game.render(boardGridElement);

// Create the racks
const racks = setUpRacks(game, TILE_COUNT, NUMBER_OF_PLAYERS);
let nextTurn = circularCounter(NUMBER_OF_PLAYERS);
let turn = 0;

// Create and render the multiplayer view and racks
multiPlayerView(playersElement, racks, turn);

// This is what happens when we click the play button
playButtonElement.addEventListener('click', () => {
  // Get the values from the UI elements based on user input
  const word = wordElement.value;
  const x = parseInt(xElement.value);
  const y = parseInt(yElement.value);
  const direction = directionElement.value === 'horizontal'; // this check is for whether the word to be played is horizontal or vertical

  // Used to record the score of the current move
  let score = 0;
  let curScore = 0;
  // Get the available tiles from the player's rack
  const tiles = racks[turn].getAvailableTiles();


  // helper functions to check if the word is valid
  const wordIsValid = (w) =>
    utils.canConstructWord(tiles, w) && utils.isValid(w);

  // not valid check
  const wordIsNotValid = (w) => !wordIsValid(w);

  // helper function that will play our word at the given {x,y} and direction, incrementing the score of the current player
  // returns the score of the word played
  const playAt = (rw, { x, y }, d) => {
    score = game.playAt(rw, { x, y }, d);
    if (score !== -1) {
      scores[turn] += score;
      curScore = score;
    }
    return score;
  };

  // Determines if a play of the word w with direction d is successful
  const playFails = (w, d) => {
    const rw = utils.constructWord(tiles, w).join('');
    return playAt(rw, { x, y }, d) === -1;
  };

  // Now, we actually try to play the word if it is valid
  if (wordIsNotValid(word)) {
    alert(`The word ${word} cannot be constructed.`);
  } else if (wordIsValid(word) && playFails(word, direction)) {
    alert(`The word ${word} cannot be played at that location.`);
  } else {

    // Rerender the board if the word played is successful
    game.render(boardGridElement);

    // Update the player's rack by removing the used tiles
    const used = utils.constructWord(tiles, word);
    used.forEach((tile) => racks[turn].removeTile(tile));

    // Take more tiles from the bag to fill the rack of the current player
    racks[turn].takeFromBag(used.length, game);

    // Save and display the word scores to the word score board
    wordScoreBoard.saveWordScore(getPlayerName(turn), word, curScore);
    wordScoreBoard.render(scoreBoard);

    // Update the UI for the next player and rerender the players
    turn = nextTurn();
    multiPlayerView(playersElement, racks, turn);

    // Clear out UI elements for the next play
    wordElement.value = '';
    xElement.value = '';
    yElement.value = '';
    hintElement.innerHTML = '';
  }
});

// used for resetting the game board
resetButtonElement.addEventListener('click', () => {
  // Reset the game board
  game.reset();
  game.render(boardGridElement);

  // Reset the racks
  racks.forEach((rack) => rack.reset());
  racks.forEach((rack) => rack.takeFromBag(TILE_COUNT, game));

  // reset the turn and counter functions
  nextTurn = circularCounter(racks.length);
  turn = 0;

  // Reset the multiplayer view
  multiPlayerView(playersElement, racks, turn, true);
});

// This is what happens when we click the help button, used for giving hints
helpButtonElement.addEventListener('click', () => {
  // used to get available tiles
  const tiles = racks[turn].getAvailableTiles();
  // find the possible words
  const possibilities = utils.bestPossibleWords(tiles);
  // give a random hint of a possible word that can be played
  const hint =
    possibilities.length === 0
      ? 'no words!'
      : possibilities[Math.floor(Math.random() * possibilities.length)];
  // set the hint HTML
  hintElement.innerText = hint;
});


// this will end the current game and save the game scores and rerender the game score board
endButtonElement.addEventListener('click', async () => {
  for (let i = 1; i <= NUMBER_OF_PLAYERS; i++) {
    await gameScoreBoard.saveGameScore(getPlayerName(i-1), scores[i-1]);
    scores[i-1] = 0;
  }
  await topWordAndGameScoreBoard.render(scoreBoard);
});
