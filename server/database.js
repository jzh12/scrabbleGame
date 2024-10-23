import { readFile, writeFile } from 'fs/promises';

/** A class representing a database to store scores */
class Database {
  constructor() {
    // we will define a local JSON to be our database to store any word and game scores.
    this.path = 'scores.json';
  }

  /**
   * Saves a word score to the database.
   *
   * This method reads the database file as an object, adds the new score to the
   * data, and then writes the data back to the database file.
   *
   * @param {string} name the name of the player
   * @param {string} word the word played
   * @param {number} score the score of the word
   */
  async saveWordScore(name, word, score) {
    // read current JSON
    const data = await this._read();
    // accessing the 'Word' component of our database and appending a new JSON containing name: name, word: word, and score: score to words
    // This is done to differentiate word scores and game scores
    data.word.push({ name, word, score });
    await this._write(data);
  }

  /**
   * Saves a game score to the database.
   *
   * This method reads the database file as an object, adds the new score to the
   * data, and then writes the data back to the database file.
   *
   * @param {string} name the name of the player
   * @param {number} score the score of the game
   */
  async saveGameScore(name, score) {
    // read current JSON
    const data = await this._read();
    // similar concept to saveWordScores, now appending a player name and their game score to a 'Game' component of the JSON
    data.game.push({ name, score });
    await this._write(data);
  }

  /**
   * Returns the top 10 word scores.
   *
   * This method reads the database file as an object, sorts the word scores by
   * word score, and returns the top 10.
   *
   * @returns [{name: string, word: string, score: number}] returns the top 10
   * scores
   */
  async top10WordScores() {
    const data = await this._read();
    // we now sort the word scores in ascending order
    const sorted = data.word.sort((a, b) => b.score - a.score);
    // return the top 10 word scores so far
    const top = sorted.slice(0, 10);
    return top;
  }

  /**
   * Returns the top 10 game scores.
   *
   * This method reads the database file as an object, sorts the game scores by
   * game score, and returns the top 10.
   *
   * @returns [{name: string, score: number}] returns the top 10 game scores
   */
  async top10GameScores() {
    const data = await this._read();
    // we do the same here for the game scores, sorting in descending order
    const sorted = data.game.sort((a, b) => b.score - a.score);
    const top = sorted.slice(0, 10);
    return top;
  }

  async _read() {
    try {
      // we will read the JSON file
      const data = await readFile(this.path, 'utf8');
      // then parsing it and returning the processed JSON
      return JSON.parse(data);
    } 
    catch (error) {
      return { word: [], game: [] };
    }
  }

  // This is used to write data to the JSON file
  async _write(data) {
    console.log(data);
    await writeFile(this.path, JSON.stringify(data), 'utf8');
  }
}

// create an instance to export
const database = new Database();

export { database };
