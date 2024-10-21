import chalkAnimation from 'chalk-animation';
import { database } from './database.js';
// TODO #1: Import Morgan and Express
import express from 'express';
import logger from 'morgan';

// TODO #2: Create an Express app.
const app = express();
const port = process.env.PORT || 3000;

// TODO #3: Add middleware to the Express app.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/', express.static('client'));

// TODO #4: Implement the /wordScore endpoint
app.post('/wordScore', async(req, res) => {
  const options = req.body;
  database.saveWordScore(options.name, options.word, parseInt(options.score));
  res.status(200).send('Success!');
});

// TODO #5: Implement the /highestWordScores endpoint
app.get('/highestWordScores', async(req, res) => {
  res.status(200).send(await database.top10WordScores());
});

// TODO #6: Implement the /gameScore endpoint
app.post('/gameScore', async(req, res) => {
  const options = req.body;
  database.saveGameScore(options.name, parseInt(options.score));
  res.status(200).send('Success!');
});

// TODO #7: Implement the /highestGameScores endpoint
app.get('/highestGameScores', async(req, res) => {
  res.status(200).send(await database.top10GameScores());
});


// This matches all routes that are not defined.
app.all('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// Start the server.
app.listen(port, () => {
  // This is totally just for fun!

  const msg = `Server started on http://localhost:${port}`;
  const rainbow = chalkAnimation.rainbow(msg);

  // Have the rainbow stop so we can log stuff to the console.
  setTimeout(() => {
    rainbow.stop(); // Animation stops
  }, 2000);
});
