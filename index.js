require('dotenv').config(); // Sets up dotenv as soon as our application starts

const express = require('express'); 
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();
const routes = require('./routes/index.js');

const environment = process.env.NODE_ENV; // development

const { knex, stage } = require('./models/dbconnection')

async function pre_launch_check() {
  const dbcheck = require('./models/dbcheck')
  let tries = stage.db.connectRetryCount

  while (tries > 0) {
    tries--
    const ok = await knex.migrate.latest()
      .then(() => {
        return knex.seed.run()
      })
      .then(async () => {
        return await dbcheck.verifyDb()
      })
      .catch(err => {
        console.warn(`Error: ${JSON.stringify(err)}`)
      })

    if (ok !== undefined && ok[1] === true) {
      // connection ok
      break
    } else if (tries > 0) {
      // connection NOK but we can still retry
      console.warn('Sleeping before retry. Database might not be ready.')
      await new Promise(resolve => setTimeout(resolve, stage.db.connectRetryInterval))
    } else {
      // connection NOK and retry attempts exhausted
      console.error('Could not connect to database. Giving up')
      process.exit(100)
    }
  }
}

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

pre_launch_check()
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
