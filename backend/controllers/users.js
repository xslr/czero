const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');
const validator = require('validator');
const { knex, stage } = require('../models/dbconnection');
const { mkResult } = require('../result_code');
const { HttpStatus, ResultCode } = require('../constants');


const authTokenLifespanDays = 30;

function isAddUserRequestValid(fields) {
  let isValid = true

  try {
    isValid &= validator.isEmail(fields.email)
  } catch (err) {
    isValid = false
  }

  return isValid
}


function onAddUserQuerySuccess(req, rsp, res) {
  let result = {}

  if (1 == res.rowCount) {
    result = mkResult(ResultCode.OK_ACCOUNT_CREATED, 'User account created')
  } else {
    result = mkResult(ResultCode.ERR_UNKNOWN, 'Unknown error while creating user account.')
    result.extra = JSON.stringify(res)
    status = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR
  }

  rsp.status(HttpStatus.HTTP_201_CREATED).send(result)
}


function onAddUserQueryError(req, rsp, err) {
  console.error(`Error executing transaction: ${err}`)
  let httpStatus = HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR
  let result = err

  if (23505 === Number(err.code)) {
    httpStatus = HttpStatus.HTTP_422_UNPROCESSABLE_ENTITY
    result = {
      resultCode: ResultCode.ERR_ACCOUNT_EXISTS,
      reason: 'User account was not created because specified email is already registered.',
    }
  }
  rsp.status(httpStatus).send(result)
}


async function add(req, rsp) {
  if (isAddUserRequestValid(req.body)) {
    const hashedPassword = bcrypt.hashSync(req.body.password, stage.saltingRounds)
    knex.transaction(trx => {
      return trx
        .insert({
          created_at: new Date().toUTCString(),
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          status: 'active',
        }, 'id')
        .into('users')
        .then(id => {
          // console.log(`--> id is ${id}:${typeof id}:${id.toString()}`)
          return trx.insert({
            email: req.body.email,
            password_hash: hashedPassword,
            user_id: id[0],
          })
          .into('email_logins')
        })
        .catch(err => {
          // TODO: log to logger backend. Not to console
          console.error(`Error while inserting: ${err}`)
          throw err
        })
    })
    .then(result => onAddUserQuerySuccess(req, rsp, result))
    .catch(err => onAddUserQueryError(req, rsp, err))
  } else {
    const httpStatus = HttpStatus.HTTP_400_BAD_REQUEST
    const result = {
      reason: 'One of the user data fields is invalid',
      original_request: JSON.stringify(req.body),
    }
    rsp.status(httpStatus).send(result)
  }
}


function getAuthToken(email) {
  // Create a token
  const payload = { email: email }
  const options = {
    expiresIn: authTokenLifespanDays + 'd',
    issuer: stage.hostname
  }
  const token = jwt.sign(payload, stage.jwtSecret, options)

  return token
}


async function onLoginQuerySuccess(password, rsp, res) {
  let httpStatus = HttpStatus.HTTP_401_UNAUTHORIZED
  let result = mkResult(ResultCode.ERR_INCORRECT_LOGIN, 'incorrect credentials')

  if (Array.isArray(res) && res.length > 0) {
    const compareRes = bcrypt.compareSync(password, res[0].password_hash)
    if (compareRes) {
      httpStatus = HttpStatus.HTTP_200_OK;
      // console.log(res[0]);
      const token = getAuthToken(res[0].email);
      const userData = await UserModel.getUserById(res[0].user_id)

      if (token) {
        result = {
          authToken: token,
          token_expiry_days: authTokenLifespanDays,
        }
        if (userData) {
          result.user = userData;
        }
      } else {
        // FIXME: what happens if we could not generate a token
      }
    }
  }
  rsp.status(httpStatus).send(result)
}


async function onLoginQueryError(req, rsp, err) {
  rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR).send(JSON.stringify(err))
}


async function login(req, rsp) {
  const { email, password } = req.body

  if (email === undefined) {
    rsp.status(HttpStatus.HTTP_400_BAD_REQUEST).send(mkResult(ResultCode.ERR_MISSING_DATA, 'email missing'))
    return
  } else if (password === undefined) {
    rsp.status(HttpStatus.HTTP_400_BAD_REQUEST).send(mkResult(ResultCode.ERR_MISSING_DATA, 'password missing'))
    return
  }

  return await knex('email_logins')
    .select('email', 'password_hash', 'user_id')
    .where({
      email: email,
    })
    .then(res => onLoginQuerySuccess(password, rsp, res))
    .catch(err => onLoginQueryError(req, rsp, err))
}


async function logoutUser(req, rsp) {
  // TODO
}

async function getUserByEmail(req, rsp) {
  // TODO
}


async function getUserById(req, rsp) {
  console.log(req.params)

  if (!req.params.userId) {
    rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR)
       .send(mkResult(ResultCode.ERR_UNKNOWN, '!! userId should never be blank on this route'))
    return
  }

  const userId = Number(req.params.userId)
  let user = await UserModel.getUserById(userId)
  if (null == user || user.email != req.decodedToken.email) {
    rsp.status(HttpStatus.HTTP_404_NOT_FOUND)
       .send(mkResult(ResultCode.ERR_UNKNOWN_USER_ID, 'A user with specified id was not found.'))
  } else {
    rsp.status(HttpStatus.HTTP_200_OK)
       .send(user)
  }
}


async function getUserByAuthToken(req, rsp) {
  // console.log(req.body.authToken)

  const email = req.decodedToken.email
  let user = await UserModel.getUserByEmail(email)
  if (null == user) {
    rsp.status(HttpStatus.HTTP_404_NOT_FOUND)
       .send(mkResult(ResultCode.ERR_UNKNOWN_USER_EMAIL, 'A user with specified email was not found.'))
  } else {
    rsp.status(HttpStatus.HTTP_200_OK)
       .send(user)
  }
}


async function update(req, rsp) {
  if (!req.decodedToken) {
    rsp.status(HttpStatus.HTTP_401_UNAUTHORIZED)
      .send(mkResult(ResultCode.ERR_AUTH_TOKEN_MISSING, 'Auth token is required to update user data.'))
    return
  }

  const tokenEmail = req.decodedToken.email
  const userUpdateString = req.body.userUpdate
  if (!userUpdateString) {
    rsp.status(HttpStatus.HTTP_400_BAD_REQUEST)
      .send(mkResult(ResultCode.ERR_MISSING_DATA, 'userUpdate was not provided.'))
    return
  }
  const userUpdate = JSON.parse(userUpdateString)
  if (tokenEmail != userUpdate.email) {
    rsp.status(HttpStatus.HTTP_401_UNAUTHORIZED)
      .send(mkResult(ResultCode.ERR_INCORRECT_LOGIN,
                     'The user is not authorised to modify this user\'s data.'))
    console.warn(`The user is not authorised to modify this user\'s data. ${tokenEmail} != ${userUpdate.email}`)
    return
  }

  let result = await UserModel.updateUser(userUpdate)
  // console.log(`result of update = ${JSON.stringify(result)}`)
  if (!result.status) {
    rsp.status(HttpStatus.HTTP_500_INTERNAL_SERVER_ERROR)
      .send(mkResult(ResultCode.ERR_UNKNOWN, 'A user with specified email was not found.'))
  } else {
    rsp.status(HttpStatus.HTTP_200_OK)
      .send(result.detail)
  }
}


async function deactivate(req, rsp) {}


async function startPasswordReset(req, rsp) {}


async function performPasswordReset(req, rsp) {}


async function resetPassword(req, rsp) {
  // will either request a password reset token or
  // reset the password if a valid reset token is already provided
}


module.exports = {
  add,
  login,
  logoutUser,
  getUserById,
  getUserByEmail,
  getUserByAuthToken,
  update,
  deactivate,
  resetPassword,
  startPasswordReset,
  performPasswordReset,
}
