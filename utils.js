const { HttpStatus, ConferenceStatus } = require('./constants')
const { stage } = require('./config.js')
const jwt = require('jsonwebtoken');
const { knex } = require('./models/dbconnection.js')
const ConferenceModel = require('./models/conference')
const UserModel = require('./models/users')


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
      if (err.name === 'JsonWebTokenError'){
        const result = {
          error: err.message
        };
        rsp.status(HttpStatus.HTTP_401_UNAUTHORIZED).send(result);
      } else {
        // Throw an error in case of unhandled errors
        throw new Error(err)
      }
    }
  } else {
    const result = {
      error: 'Authentication error. Token required.',
      status: HttpStatus.HTTP_401_UNAUTHORIZED,
    };
    rsp.status(HttpStatus.HTTP_401_UNAUTHORIZED).send(result);
  }
}


async function validateConferenceJoinability(req, rsp, next) {
  const cid = req.params.conferenceId
  const result = await ConferenceModel.conferenceStatusById(cid)

  if (ConferenceStatus.OPEN === result || ConferenceStatus.ACTIVE === result) {
    next()
  } else {
    let error = 'Unknown server error.'
    let status = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR

    if (ConferenceStatus.NO_CONFERENCE === result) {
      error = 'No such conference.'
      status = HttpStatus.HTTP_422_UNPROCESSABLE_ENTITY
    } else if (ConferenceStatus.CLOSED === result) {
      error = 'Conference closed for registration.'
      status = HttpStatus.HTTP_422_UNPROCESSABLE_ENTITY
    }
    rsp.status(status).send({
      error: error,
      reqBody: req.body,
      reqParam: req.params,
    })
  }
}


async function appendUserLogin(req, rsp, next) {
  UserModel.getUserByEmail(req.decodedToken.email)
    .then(res => {
      req.user = res
      next()
    })
    .catch(err => {
      rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send({
        error: 'Could not find the user corresponding to supplied auth token.',
        error2: JSON.stringify(err),
      })
    })
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
  validateConferenceJoinability,
  preLaunchCheck,
  appendUserLogin,
}
