import { shuffle } from './shuffle.js';
import { Game } from './game.js';
import { Rack } from './rack.js';

console.log(shuffle([1, 2, 3, 4, 5])); // this should produce a different sequence each time
let g = new Game();
let r = new Rack();

// can be placed tests
console.log(g._canBePlacedOnBoard('hello', {x: 1, y: 1}, true)); // length 5, should end at 5

console.log(g._canBePlacedOnBoard('melody', {x: 1, y: 1}, true)); // should fail
console.log(g._canBePlacedOnBoard('melody', {x: 1, y: 5}, true)); // should fail
console.log(g._canBePlacedOnBoard('melody', {x: 6, y: 1}, false)); 
console.log(g._canBePlacedOnBoard('melody', {x: 9, y: 8}, true));
console.log(g._canBePlacedOnBoard('aa', {x: 14, y: 15}, true) + " this is the first test for aa (14,15)");
console.assert(g._canBePlacedOnBoard('aa', {x: 14, y: 15}, true) === true);
g._placeOnBoard('aa',{x: 14, y: 15}, true);
// [13,14], [14,14,] occupied
console.log(g._canBePlacedOnBoard('aa', {x: 13, y: 15}, true));
// [12,14], [13,14] should fail, [13,14] not available
g._placeOnBoard('aa',{x: 13, y: 15}, true);
// this should pass since it cannot be placed
console.log(g._canBePlacedOnBoard('aa', {x: 14, y: 15}, true));
console.assert(g._canBePlacedOnBoard('aa', {x: 14, y: 15}, true) === false, "this should not be placable");

console.log(g._canBePlacedOnBoard('hello', {x: 10, y: 10}, true));
g._placeOnBoard('hello', {x: 10, y: 10}, true);
console.log(g._canBePlacedOnBoard('hello', {x: 15, y: 10}, false));
g._placeOnBoard('hellos', {x: 15, y: 10}, false);
console.log(g.getGrid());

console.log(g._canBePlacedOnBoard('belt', {x: 1, y: 7}, true));

console.log(g._canBePlacedOnBoard('belt', {x: 1, y: 6}, false));

console.log(g._canBePlacedOnBoard('melody', {x: 9, y: 8}, true));
console.log(g._canBePlacedOnBoard('melody', {x: 9, y: 8}, true));
console.log(g._canBePlacedOnBoard('but', {x: 1, y: 3}, false));
console.log(g.grid[0][5]); // m is at 0 5 in the array? // need to be indexing 5,0, y,x
console.log(g.grid[6][1]);
console.log(g.getGrid());

// placing tiles test

testing taking tiles from bag, using game and rack
console.log(g.bag.slice(0, 10)); // goes from index 0 to 10 non inclusive (so really 0 to 9)
console.log(g.takeFromBag(10));
console.log(g.bag.length); // should be 90
// slice 85
console.log(JSON.stringify(g.bag.slice(0, 85)) === JSON.stringify(g.takeFromBag(85)));
console.log(g.bag.length);

// n > bag.length
// should only return items in bag 
console.log(g.bag.slice(0,5));
// console.log(this.bag.length);
console.log(g.takeFromBag(10));
console.log(JSON.stringify(g.bag.slice(0, 5)) === JSON.stringify(g.takeFromBag(10)));


// isValid testing
console.log(isValid('h*llo'));
console.log(isValid('iwoiqd0jsilda'));
console.log(isValid('h**lo'));
console.log(isValid('hel**'));
console.log(isValid('whduqdqlk'));

// testing the asynchronicity of the code
const loaded = await dictionary.loadDictionary();
console.log(loaded);
console.log(dictionary.getWords());
console.log((dictionary.words));
r.takeFromBag(7, g);
console.log(r.getAvailableTiles());
console.log(possibleWords(r.getAvailableTiles()));

