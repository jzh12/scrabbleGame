class WordScoreBoard {
  constructor() {
    this.words = [];
  }

  // method for calling the wordScore endpoint to save a the player playing the word, word, and the score of the word to the db
  async saveWordScore(name, word, score) {
    this.words.push({name, word, score});
    try {
      await fetch('/wordScore', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({name, word, score})
      });
    }
    catch(err) {
      console.log(err);
    } 
  }

  // renders the board based on the words played
  render(element) {
    let html = '<h1>Word Scores</h1>';
    html += '<table>';
    this.words.forEach((word) => {
      html += `
        <tr>
          <td>${word.name}</td>
          <td>${word.word}</td>
          <td>${word.score}</td>
        </tr>
      `;
    });
    html += '</table>';
    element.innerHTML = html;
  }
}

class GameScoreBoard {
  constructor() {
    this.game = [];
  }

  // render method for rendering the game scores to the scoreboard
  render(element) {
    let html = '<h1>Game Score</h1>';
    html += '<table>';
    this.game.forEach((word) => {
      html += `
        <tr>
          <td>${word.name}</td>
          <td>${word.score}</td>
        </tr>
      `;
    });
    html += '</table>';
    element.innerHTML = html;
  }


  // this method is for calling the endpoint for saving our game scores
  async saveGameScore(name, score) {
    this.game.push({name, score});
    try {
      await fetch('/gameScore', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({name, score})
      });
    }
    catch(err) {
      console.log(err);
    }
  }
}

class TopWordAndGameScoreBoard {

  // this is for rendering the top 10 word scores and top 10 game scores, similar to above
  async render(element) {
    let wordHtml = '<h1>Top Word Scores</h1>';
    wordHtml += '<table>';
    // we make a call to fetch the top 10 words 
    const wordResponse = await fetch('/highestWordScores', {
      method: 'GET',
        headers: {'Content-Type': 'application/json',},
    });
    // we take the response and await until it resolves to JSON
    const top10Words = await wordResponse.json();
    top10Words.forEach(curWord => {
      wordHtml += `
      <tr>
        <td>${curWord.name}</td>
        <td>${curWord.word}</td>
        <td>${curWord.score}</td>
      </tr>
      `;
    });
    wordHtml += '</table>';
  
    let gameHtml = '<h1>Top Game Scores</h1>';
    gameHtml += '<table>'
    // we make a call to fetch the top 10 game scores
    const gameResponse = await fetch('/highestGameScores', {
      method: 'GET',
        headers: {'Content-Type': 'application/json',},
    });
    // we take the response and await until it resolves to JSON
    const top10Games = await gameResponse.json();
    top10Games.forEach(curGame => {
      gameHtml += `
      <tr>
        <td>${curGame.name}</td>
        <td>${curGame.score}</td>
      </tr>
      `;
    })
    gameHtml += '</table>';

    element.innerHTML += wordHtml;
    element.innerHTML += gameHtml;
  }
}

export const wordScoreBoard = new WordScoreBoard();
export const gameScoreBoard = new GameScoreBoard();
export const topWordAndGameScoreBoard = new TopWordAndGameScoreBoard();
