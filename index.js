require('dotenv').config(); // Sets up dotenv as soon as our application starts

const express = require('express'); 
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
const router = express.Router();
const routes = require('./routes/index.js');
const { stage, environment } = require('./config.js')
const { preLaunchCheck } = require('./utils.js')

// TODO: enable cors for selected domains before going live
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// FIXME: temporarily added for testing bolt checkout
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

if (environment !== 'production') {
  app.use(logger('dev'));
}

preLaunchCheck()
  .then(res => {
    app.use('/api/v0', routes(router));

    app.listen(`${stage.port}`, () => {
      console.log(`Server now listening at ${stage.ip}:${stage.port}`);
    });

    module.exports = app;
  })
  .catch(err => {
    console.error(err)
  })
