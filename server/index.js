import chalkAnimation from 'chalk-animation';
import { database } from './database.js';
import express from 'express';
import logger from 'morgan';

// creating express instance
const app = express();
const port = process.env.PORT || 3000;


//  allows easy parsing of our jsons
app.use(express.json());
// will parse url encoded data
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/', express.static('client'));

// endpoint for sending word scores to db
app.post('/wordScore', async(req, res) => {
  const options = req.body;
  database.saveWordScore(options.name, options.word, parseInt(options.score));
  res.status(200).send('Success!');
});

// endpoint for getting the top 10 highest value word scores from db
app.get('/highestWordScores', async(req, res) => {
  res.status(200).send(await database.top10WordScores());
});

// endpoint for sending game scores to db
app.post('/gameScore', async(req, res) => {
  const options = req.body;
  database.saveGameScore(options.name, parseInt(options.score));
  res.status(200).send('Success!');
});

// endpoint for getting the top 10 game scores from db
app.get('/highestGameScores', async(req, res) => {
  res.status(200).send(await database.top10GameScores());
});



// This matches all routes that are not defined
app.all('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// Start the server.
app.listen(port, () => {
  // This is totally just for fun!
  const banner = `
  .d8888b.                            888      888      888          
  d88P  Y88b                           888      888      888          
  Y88b.                                888      888      888          
   "Y888b.    .d8888b 888d888  8888b.  88888b.  88888b.  888  .d88b.  
      "Y88b. d88P"    888P"       "88b 888 "88b 888 "88b 888 d8P  Y8b 
        "888 888      888     .d888888 888  888 888  888 888 88888888 
  Y88b  d88P Y88b.    888     888  888 888 d88P 888 d88P 888 Y8b.     
   "Y8888P"   "Y8888P 888     "Y888888 88888P"  88888P"  888  "Y8888                                                                       
`;
  const msg = `${banner}\n     Server started on http://localhost:${port}`;
  const rainbow = chalkAnimation.rainbow(msg);

  // Have the rainbow stop so we can log stuff to the console
  setTimeout(() => {
    rainbow.stop(); // Animation stops
  }, 2000);
});
