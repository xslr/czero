const { HttpStatus } = require('./result_code')
const { stage } = require('./config.js')
const jwt = require('jsonwebtoken');
const { knex } = require('./models/dbconnection.js')

function validateLoginToken(req, rsp, next) {
  const token = req.body.authToken
  if (token) {
    const options = {
      expiresIn: '2d',
      issuer: stage.hostname,
    }
    try {
      // verify makes sure that the token hasn't expired and has been issued by us
      const result = jwt.verify(token, process.env.JWT_SECRET, options)

      // Let's pass back the decoded token to the request object
      req.decodedToken = result
      // We call next to pass execution to the subsequent middleware
      next();
    } catch (err) {
      // Throw an error just in case anything goes wrong with verification
      throw new Error(err)
    }
  } else {
    const result = {
      error: 'Authentication error. Token required.',
      status: HttpStatus.HTTP_401_UNAUTHORIZED,
    };
    rsp.status(HttpStatus.HTTP_401_UNAUTHORIZED).send(result);
  }
}

async function preLaunchCheck() {
  const dbcheck = require('./models/dbcheck')
  let tries = stage.db.connectRetries

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


module.exports = {
  validateLoginToken,
  preLaunchCheck,
}
