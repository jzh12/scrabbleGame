class WordScoreBoard {
  constructor() {
    this.words = [];
  }

  // TODO #8: Save the word score to the server
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

  // TODO #9: Save the game score to the server
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
  // TODO #10: Render the top word and game scores
  async render(element) {
    let wordHtml = '<h1>Top Word Scores</h1>';
    wordHtml += '<table>';
    const wordResponse = await fetch('/highestWordScores', {
      method: 'GET',
        headers: {'Content-Type': 'application/json',},
    });
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
    const gameResponse = await fetch('/highestGameScores', {
      method: 'GET',
        headers: {'Content-Type': 'application/json',},
    });
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
