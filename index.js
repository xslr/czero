require('dotenv').config(); // Sets up dotenv as soon as our application starts

const express = require('express'); 
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
const routes = require('./routes/index.js');

const environment = process.env.NODE_ENV; // development
const stage = require('./config')[environment];

async function pre_launch_check() {
  const dbcheck = require('./models/dbcheck')
  return await dbcheck.verifyDb()
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

if (environment !== 'production') {
  app.use(logger('dev'));
}

pre_launch_check()
  .then((res) => {
    app.use('/api/v0', routes(router));

    app.listen(`${stage.port}`, () => {
      console.log(`Server now listening at localhost:${stage.port}`);
    });

    module.exports = app;
  })
  .catch(err => {
    console.error(err)
  })
